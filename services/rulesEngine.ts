
import { SafetyAlert, PatientProfile, MedicationEvent, ActionType } from "../types";
import { parseClinicalDate } from "../utils";

// --- TYPES ---

export interface ClinicalRule {
  id: string;
  title: string;
  descriptionTemplate: (drugName: string) => string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  citation: string;
  citationUrl: string;
  
  // Logic Predicates
  drugKeywords: string[]; // List of substrings to match medication names (e.g. "omeprazole", "ppi")
  excludedConditions?: string[]; // If patient has this, rule might NOT apply (exceptions)
  requiredConditions?: string[]; // If patient has this, rule applies (e.g. "Osteoporosis")
  ageMin?: number; // e.g. 65 for Beers
  maxDurationWeeks?: number; // For future implementation with duration calculation
  interactionDrugKeywords?: string[]; // For Drug-Drug interactions
  checkType?: 'SINGLE' | 'INTERACTION' | 'DUPLICATION'; // Type of check
}

// --- RULES DATABASE (Deterministic Clinical Logic) ---

const BEERS_CRITERIA_RULES: ClinicalRule[] = [
  {
    id: "BEERS_PPI_ELDERLY",
    title: "Beers Criteria: Proton Pump Inhibitors (PPI)",
    drugKeywords: ["omeprazole", "pantoprazole", "lansoprazole", "esomeprazole", "rabeprazole", "dexlansoprazole"],
    ageMin: 65,
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `Long-term use of ${drug} in older adults is associated with C. difficile infection, bone loss, and fractures.`,
    recommendation: "Avoid use >8 weeks unless for high-risk patients (e.g., oral corticosteroids, chronic NSAID use), erosive esophagitis, or pathological hypersecretory condition.",
    citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
    citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  },
  {
    id: "BEERS_NSAIDS_ELDERLY",
    title: "Beers Criteria: NSAID Usage",
    drugKeywords: ["ibuprofen", "naproxen", "diclofenac", "ketorolac", "indomethacin", "meloxicam", "ketoprofen", "celecoxib", "etoricoxib"],
    ageMin: 65,
    severity: "HIGH",
    descriptionTemplate: (drug) => `Use of ${drug} increases risk of GI bleeding and peptic ulcer disease in older adults.`,
    recommendation: "Avoid chronic use. If necessary, use lowest effective dose for shortest duration and provide gastroprotection (PPI or Misoprostol).",
    citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
    citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  },
  {
    id: "BEERS_BENZOS",
    title: "Beers Criteria: Benzodiazepines",
    drugKeywords: ["diazepam", "lorazepam", "alprazolam", "clonazepam", "temazepam", "midazolam", "triazolam"],
    ageMin: 65,
    severity: "HIGH",
    descriptionTemplate: (drug) => `Older adults have increased sensitivity to benzodiazepines like ${drug} and decreased metabolism of long-acting agents. Increases risk of cognitive impairment, delirium, falls, fractures.`,
    recommendation: "Avoid use for treatment of insomnia, agitation, or delirium.",
    citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
    citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  },
  {
    id: "BEERS_ANTICHOLINERGIC",
    title: "Beers Criteria: Anticholinergics",
    drugKeywords: ["diphenhydramine", "chlorpheniramine", "hydroxyzine", "promethazine", "amitriptyline", "nortriptyline", "doxepin"],
    ageMin: 65,
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `${drug} is highly anticholinergic; risk of confusion, dry mouth, constipation, and toxicity.`,
    recommendation: "Avoid. Use non-anticholinergic alternatives.",
    citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
    citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  },
  {
    id: "BEERS_SULFONYLUREAS",
    title: "Beers Criteria: Long-acting Sulfonylureas",
    drugKeywords: ["glimepiride", "glyburide", "glibenclamide", "chlorpropamide"],
    ageMin: 65,
    severity: "HIGH",
    descriptionTemplate: (drug) => `${drug} has a prolonged half-life and carries a high risk of prolonged hypoglycemia in older adults.`,
    recommendation: "Avoid. Use shorter-acting agents like Glipizide or alternative classes (e.g., Metformin, DPP-4 inhibitors).",
    citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
    citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  },
  {
    id: "BEERS_TRAMADOL",
    title: "Beers Criteria: Tramadol",
    drugKeywords: ["tramadol"],
    ageMin: 65,
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `${drug} is associated with increased risk of hyponatremia and SIADH in older adults.`,
    recommendation: "Monitor sodium levels closely upon initiation or dose changes.",
    citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
    citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  },
  {
    id: "BEERS_SLIDING_SCALE",
    title: "Beers Criteria: Sliding Scale Insulin",
    drugKeywords: ["sliding scale", "insulin sliding", "actrapid", "humulin r"], 
    ageMin: 65,
    severity: "HIGH",
    descriptionTemplate: (drug) => `Sliding scale insulin regimens provide reactive rather than physiologic glucose control and increase risk of hypoglycemia/hyperglycemia.`,
    recommendation: "Avoid. Use basal-bolus insulin regimens.",
    citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
    citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  },
  {
    id: "BEERS_ALPHA_BLOCKERS",
    title: "Beers Criteria: Alpha-1 Blockers",
    drugKeywords: ["doxazosin", "prazosin", "terazosin"],
    ageMin: 65,
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `${drug} has high risk of orthostatic hypotension in older adults.`,
    recommendation: "Avoid use as an antihypertensive.",
    citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
    citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  },
  {
     id: "BEERS_DIGOXIN",
     title: "Beers Criteria: Digoxin",
     drugKeywords: ["digoxin", "lanoxin"],
     severity: "MEDIUM",
     ageMin: 65,
     descriptionTemplate: (drug) => `Digoxin should generally be avoided as first-line for AF/HF. Dosages > 0.125mg/day increase toxicity risk in elderly due to decreased renal clearance.`,
     recommendation: "Avoid dosages > 0.125mg/day. Monitor levels.",
     citation: "American Geriatrics Society 2023 Updated AGS Beers Criteria",
     citationUrl: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372"
  }
];

const STOPP_START_RULES: ClinicalRule[] = [
  {
    id: "STOPP_FALLS_RISK",
    title: "STOPP Criteria: Fall Risk Medication",
    drugKeywords: ["benzodiazepine", "neuroleptic", "vasodil