
import { ActionType, PatientProfile, MedicationEvent } from './types';
import { 
  PlayCircle, 
  MinusCircle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Activity, 
  AlertOctagon, 
  AlertTriangle, 
  Info,
  Pill,
  Syringe,
  Wind,
  Hand,
  Eye,
  Ear,
  CircleDot,
  FileQuestion,
  BicepsFlexed,
  Bone,
  Scan,
  Sparkles,
  LucideIcon
} from 'lucide-react';

/**
 * Cleans raw text output from LLMs to ensure valid JSON parsing.
 * Removes markdown code blocks (```json ... ```) if present.
 */
export const cleanJsonString = (str: string): string => {
  let cleanStr = str.trim();
  // Remove starting markdown
  if (cleanStr.startsWith('```')) {
    cleanStr = cleanStr.replace(/^```(json)?\s*/, '');
  }
  // Remove ending markdown
  if (cleanStr.endsWith('```')) {
    cleanStr = cleanStr.replace(/\s*```$/, '');
  }
  return cleanStr;
};

/**
 * Parses a date string safely to ensure it renders as the intended local date.
 * Handles "YYYY-MM-DD" explicitly to avoid UTC timezone shifts (e.g., displaying previous day).
 */
export const parseClinicalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  
  // Handle YYYY-MM-DD specifically to treat as local time
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [_, y, m, d] = isoMatch;
    // Create date at local midnight
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }
  
  return new Date(dateStr);
};

/**
 * Converts a string to Title Case.
 * Handles common medical acronyms (e.g., QV, IV, PO) by keeping them uppercase.
 */
export const toTitleCase = (str: string) => {
  if (!str) return str;
  
  // Common medical acronyms to preserve in uppercase
  const acronyms = new Set([
    'QV', 'IV', 'IM', 'SC', 'PO', 'PR', 'SL', 'NG', 'TP', 
    'LA', 'XL', 'XR', 'SR', 'ER', 'CR', 'IR', 'DS', 'SA', 'HA', 
    'HCT', 'HCTZ', 'CD', 'EC', 'PM', 'AM', 'OM', 'ON', 
    'BD', 'TDS', 'QDS', 'PRN', 'D5', 'NS', 'D5NS', 'D5-NS', 'COPD', 'HIV', 
    'RNA', 'DNA', 'MRI', 'CT', 'MRSA', 'OA', 'TKR', 'RAI', 'UTI', 'AKI',
    'NSAID', 'NSAIDS', 'ACE', 'ARB', 'CCB'
  ]);

  return str.replace(
    /\w\S*/g,
    text => {
      const clean = text.replace(/[^a-zA-Z0-9-]/g, ''); 
      if (acronyms.has(clean.toUpperCase())) {
        const regex = new RegExp(clean.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        return text.replace(regex, clean.toUpperCase());
      }

      const match = text.match(/^(\w+)([^a-zA-Z0-9]*)$/);
      if (match) {
        const word = match[1];
        const punct = match[2];
        if (acronyms.has(word.toUpperCase())) {
          return word.toUpperCase() + punct;
        }
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase() + punct;
      }

      return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
    }
  );
};

/**
 * Formats medication routes (e.g., PO -> PO, topical -> Topical).
 */
export const formatRoute = (str: string) => {
  if (!str) return undefined;
  if (str.length <= 3) return str.toUpperCase();
  return toTitleCase(str);
};

/**
 * Robustly locates a quote within a text, handling exact matches, whitespace differences,
 * and punctuation differences.
 */
export const findQuoteInText = (text: string, quote: string): { start: number; end: number; match: string } | null => {
  if (!text || !quote) return null;

  // 1. Exact Match
  const exactIdx = text.indexOf(quote);
  if (exactIdx !== -1) return { start: exactIdx, end: exactIdx + quote.length, match: quote };

  // Helper to create a map of normalized indices to original indices
  const createIndexMap = (original: string, normalizeFn: (char: string) => string | null) => {
    let normalized = '';
    const map: number[] = [];
    
    for (let i = 0; i < original.length; i++) {
      const char = original[i];
      const normChar = normalizeFn(char);
      if (normChar !== null) {
        normalized += normChar;
        map.push(i);
      }
    }
    return { normalized, map };
  };

  // 2. Alphanumeric Normalization
  // Strips all whitespace and punctuation, converting to lowercase.
  // This handles cases like "BP: 120/80" matching "BP 120 80" or extra spaces.
  const alphaNumeric = (c: string) => /[a-z0-9]/i.test(c) ? c.toLowerCase() : null;
  const { normalized: normText, map: textMap } = createIndexMap(text, alphaNumeric);
  const { normalized: normQuote } = createIndexMap(quote, alphaNumeric);

  if (normQuote.length === 0) return null;

  const foundIdx = normText.indexOf(normQuote);
  
  if (foundIdx !== -1) {
    const start = textMap[foundIdx];
    // The end index in normText is foundIdx + normQuote.length - 1
    // We map that back to the original text index.
    const end = textMap[foundIdx + normQuote.length - 1] + 1; // +1 to include the character
    return {
      start,
      end,
      match: text.substring(start, end)
    };
  }

  return null;
};

// --- FHIR INTEROPERABILITY ---

export const generateFHIRBundle = (patient: PatientProfile, events: MedicationEvent[]) => {
  const timestamp = new Date().toISOString();
  
  // FHIR Patient Resource
  const fhirPatient = {
    resourceType: "Patient",
    id: patient.id,
    identifier: [
      {
        system: "http://hospital.org/insurance-ids",
        value: patient.insuranceNumber
      }
    ],
    name: [
      {
        use: "official",
        text: patient.name
      }
    ],
    gender: patient.gender.toLowerCase(),
    birthDate: new Date(new Date().getFullYear() - patient.age, 0, 1).toISOString().split('T')[0] // Approximate
  };

  // Map Events to FHIR MedicationStatements
  const entries = events.map(evt => {
    return {
      resourceType: "MedicationStatement",
      id: evt.id,
      status: evt.action === ActionType.STOPPED ? "stopped" : "active",
      statusReason: [
        {
          text: evt.action
        }
      ],
      medicationCodeableConcept: {
        text: evt.medication
      },
      subject: {
        reference: `Patient/${patient.id}`
      },
      effectiveDateTime: evt.date,
      dateAsserted: timestamp,
      dosage: [
        {
          text: evt.dosage,
          route: evt.route ? { text: evt.route } : undefined
        }
      ],
      note: [
        {
          text: evt.rationale
        }
      ]
    };
  });

  // Wrap in Bundle
  return {
    resourceType: "Bundle",
    type: "collection",
    timestamp: timestamp,
    entry: [
      { resource: fhirPatient },
      ...entries.map(e => ({ resource: e }))
    ]
  };
};

// --- STYLE CONFIGURATION ---

interface RouteStyleConfig {
  keywords: string[];
  style: {
    className: string;
    Icon: LucideIcon;
  }
}

const ROUTE_STYLES_CONFIG: RouteStyleConfig[] = [
  {
    keywords: ['INH', 'INHALER', 'NEB', 'PUFF'],
    style: { className: 'bg-sky-100 text-sky-700 border-sky-200', Icon: Wind }
  },
  {
    keywords: ['EYE', 'OPTIC', 'OPHTHALMIC'],
    style: { className: 'bg-cyan-100 text-cyan-700 border-cyan-200', Icon: Eye }
  },
  {
    keywords: ['EAR', 'OTIC', 'AURICULAR'],
    style: { className: 'bg-lime-100 text-lime-700 border-lime-200', Icon: Ear }
  },
  {
    keywords: ['TOPICAL', 'CREAM', 'OINT', 'PLASTER', 'PATCH', 'TRANSDERMAL', 'GEL', 'LOTION'],
    style: { className: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: Hand }
  },
  {
    keywords: ['PR', 'RECTAL', 'SUPP', 'ENEMA'],
    style: { className: 'bg-stone-100 text-stone-700 border-stone-200', Icon: CircleDot }
  },
  {
    keywords: ['SL', 'SUBLINGUAL', 'BUCCAL'],
    style: { className: 'bg-violet-100 text-violet-700 border-violet-200', Icon: Sparkles }
  },
  {
    keywords: ['PO', 'ORAL', 'TABLET', 'CAPSULE', 'SYRUP', 'NG', 'PEG', 'MOUTH'],
    style: { className: 'bg-blue-100 text-blue-700 border-blue-200', Icon: Pill }
  },
  {
    keywords: ['ARTICULAR', 'LOCAL', 'JOINT'],
    style: { className: 'bg-teal-100 text-teal-700 border-teal-200', Icon: Bone }
  },
  {
    keywords: ['IM', 'INTRAMUSCULAR', 'MUSCLE'],
    style: { className: 'bg-rose-100 text-rose-700 border-rose-200', Icon: BicepsFlexed }
  },
  {
    keywords: ['SC', 'SUB', 'DEPOT', 'CUTANEOUS'],
    style: { className: 'bg-orange-100 text-orange-700 border-orange-200', Icon: Scan }
  },
  {
    keywords: ['IV', 'INTRAVENOUS', 'INFUSION', 'DRIP', 'VENOUS'],
    style: { className: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200', Icon: Syringe }
  },
  {
    keywords: ['INJ'],
    style: { className: 'bg-slate-100 text-slate-700 border-slate-200', Icon: Syringe }
  }
];

const DEFAULT_ROUTE_STYLE = { className: 'bg-slate-200/60 text-slate-600 border-slate-200/60', Icon: Activity };

/**
 * Returns consistent Tailwind CSS classes and Icons for medication routes.
 * Uses a configuration-driven approach for better maintainability.
 */
export const getRouteBadgeStyles = (route?: string) => {
  if (!route) return { className: 'bg-slate-200/60 text-slate-600 border-slate-200/60', Icon: FileQuestion };
  
  const r = route.toUpperCase();

  const match = ROUTE_STYLES_CONFIG.find(config => 
    config.keywords.some(keyword => r.includes(keyword))
  );

  return match ? match.style : DEFAULT_ROUTE_STYLE;
};

/**
 * Returns consistent styling and iconography for ActionTypes.
 */
export const getActionTheme = (action: ActionType) => {
  switch (action) {
    case ActionType.STARTED: 
      return { 
        Icon: PlayCircle,
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200',
        borderLeft: 'border-l-emerald-400',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800'
      };
    case ActionType.STOPPED: 
      return { 
        Icon: MinusCircle,
        bg: 'bg-rose-50', 
        text: 'text-rose-700', 
        border: 'border-rose-200',
        borderLeft: 'border-l-rose-400',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800'
      };
    case ActionType.INCREASED: 
      return { 
        Icon: TrendingUp,
        bg: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-200',
        borderLeft: 'border-l-amber-400',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800'
      };
    case ActionType.DECREASED: 
      return { 
        Icon: TrendingDown,
        bg: 'bg-indigo-50', 
        text: 'text-indigo-700', 
        border: 'border-indigo-200',
        borderLeft: 'border-l-indigo-400',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-800'
      };
    case ActionType.CONTINUED: 
      return { 
        Icon: Clock,
        bg: 'bg-slate-50', 
        text: 'text-slate-700', 
        border: 'border-slate-200',
        borderLeft: 'border-l-slate-300',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-800'
      };
    default: 
      return { 
        Icon: Activity,
        bg: 'bg-gray-50', 
        text: 'text-gray-600', 
        border: 'border-gray-200',
        borderLeft: 'border-l-gray-300',
        badgeBg: 'bg-gray-100',
        badgeText: 'text-gray-800'
      };
  }
};

/**
 * Returns consistent styling for Safety Alert Severities.
 */
export const getSeverityTheme = (severity: string) => {
  const s = severity.toUpperCase();
  if (s === 'HIGH') return { 
    bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", 
    Icon: AlertOctagon 
  };
  if (s === 'MEDIUM') return { 
    bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", 
    Icon: AlertTriangle 
  };
  return { 
    bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", 
    Icon: Info 
  };
};
