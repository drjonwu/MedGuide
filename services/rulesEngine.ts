
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
    drugKeywords: ["benzodiazepine", "neuroleptic", "vasodilator", "hypnotic", "z-drug", "zolpidem", "zopiclone"],
    requiredConditions: ["fall", "fracture", "history of falls", "unsteady gait"],
    ageMin: 65,
    severity: "HIGH",
    descriptionTemplate: (drug) => `Use of ${drug} in patients with a history of recurrent falls significantly increases fracture risk.`,
    recommendation: "Deprescribe or reduce dose if possible. Consider safer alternatives.",
    citation: "STOPP/START Criteria Version 2",
    citationUrl: "https://academic.oup.com/ageing/article/44/2/213/2812233"
  },
  {
    id: "STOPP_LOOP_DIURETIC",
    title: "STOPP Criteria: Loop Diuretic Monotherapy",
    drugKeywords: ["furosemide", "bumetanide", "torsemide"],
    requiredConditions: ["htn", "hypertension"],
    excludedConditions: ["heart failure", "chf"], // OK for heart failure
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `${drug} is not a first-line therapy for hypertension and may cause electrolyte imbalance or incontinence.`,
    recommendation: "Consider thiazides or other antihypertensive classes if used solely for hypertension.",
    citation: "STOPP/START Criteria Version 2",
    citationUrl: "https://academic.oup.com/ageing/article/44/2/213/2812233"
  },
  {
    id: "STOPP_ANTIHYPERTENSIVE_HYPOTENSION",
    title: "STOPP Criteria: Antihypertensives in Postural Hypotension",
    drugKeywords: ["amlodipine", "nifedipine", "losartan", "valsartan", "lisinopril", "enalapril", "atenolol", "bisoprolol", "furosemide", "hctz"],
    requiredConditions: ["postural hypotension", "orthostatic hypotension"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `${drug} may exacerbate significant postural hypotension, increasing fall risk.`,
    recommendation: "Review necessity. Consider deprescribing or dose reduction if postural hypotension is symptomatic.",
    citation: "STOPP/START Criteria Version 2",
    citationUrl: "https://academic.oup.com/ageing/article/44/2/213/2812233"
  },
  {
    id: "STOPP_BISPHOSPHONATE_REFLUX",
    title: "STOPP Criteria: Bisphosphonates & Upper GI Disease",
    drugKeywords: ["alendronate", "risedronate", "ibandronate", "alendronic"],
    requiredConditions: ["reflux", "gerd", "esophagitis", "gastritis", "ulcer"],
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `Oral bisphosphonates like ${drug} may exacerbate esophagitis or reflux disease.`,
    recommendation: "Consider IV bisphosphonates (Zoledronate) or Denosumab if oral tolerance is poor.",
    citation: "STOPP/START Criteria Version 2",
    citationUrl: "https://academic.oup.com/ageing/article/44/2/213/2812233"
  }
];

const DRUG_DISEASE_RULES: ClinicalRule[] = [
  {
    id: "DDI_NSAID_CKD",
    title: "Drug-Disease: NSAID in CKD",
    drugKeywords: ["ibuprofen", "naproxen", "diclofenac", "ketorolac", "etoricoxib", "celecoxib", "ketoprofen"],
    requiredConditions: ["ckd", "chronic kidney disease", "renal failure", "kidney injury", "aki", "nephropathy"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `${drug} can decrease renal blood flow and precipitate acute kidney injury in patients with existing CKD.`,
    recommendation: "Avoid NSAIDs in CKD patients. Use acetaminophen or opioids for pain if necessary.",
    citation: "KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease",
    citationUrl: "https://kdigo.org/guidelines/ckd-evaluation-and-management/"
  },
  {
    id: "DDI_METFORMIN_CKD",
    title: "Drug-Disease: Metformin in Advanced CKD",
    drugKeywords: ["metformin", "glucophage"],
    requiredConditions: ["ckd stage 4", "ckd stage 5", "esrd", "dialysis"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `${drug} is contraindicated in severe renal impairment (eGFR < 30) due to risk of lactic acidosis.`,
    recommendation: "Discontinue metformin. Consider insulin or other non-renally cleared agents.",
    citation: "FDA Drug Safety Communication: Metformin in Renal Impairment",
    citationUrl: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-revises-warnings-regarding-use-diabetes-medicine-metformin-certain"
  },
  {
    id: "DDI_SULFONYLUREA_CKD",
    title: "Drug-Disease: Sulfonylureas in CKD",
    drugKeywords: ["glipizide", "glyburide", "glibenclamide", "gliclazide"],
    requiredConditions: ["ckd", "chronic kidney disease", "renal failure", "kidney injury"],
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `${drug} and its metabolites are renally excreted. Accumulation in CKD increases risk of prolonged hypoglycemia.`,
    recommendation: "Use with caution. Glipizide is preferred over Glyburide in CKD, but dose reduction may be needed. Monitor blood glucose closely.",
    citation: "National Kidney Foundation: Diabetes and CKD",
    citationUrl: "https://www.kidney.org/atoz/content/diabetes-and-chronic-kidney-disease"
  },
  {
     id: "DDI_BETA_BLOCKER_ASTHMA",
     title: "Drug-Disease: Non-selective Beta Blockers in Asthma/COPD",
     drugKeywords: ["propranolol", "nadolol", "timolol", "carvedilol", "sotalol"],
     requiredConditions: ["asthma", "copd", "bronchospasm"],
     severity: "MEDIUM",
     descriptionTemplate: (drug) => `Non-selective beta-blockers may precipitate bronchospasm.`,
     recommendation: "Use cardioselective beta-blockers (e.g., Bisoprolol, Metoprolol) if necessary.",
     citation: "Global Initiative for Chronic Obstructive Lung Disease (GOLD)",
     citationUrl: "https://goldcopd.org/"
  }
];

const DRUG_DRUG_INTERACTIONS: ClinicalRule[] = [
  {
    id: "INT_WARFARIN_NSAID",
    title: "Interaction: Warfarin + NSAID",
    drugKeywords: ["warfarin"],
    interactionDrugKeywords: ["ibuprofen", "naproxen", "diclofenac", "aspirin", "ketoprofen"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `Concurrent use of Warfarin and NSAIDs/Aspirin significantly increases bleeding risk.`,
    recommendation: "Avoid combination unless aspirin is for specific secondary prevention. Monitor INR closely.",
    citation: "British National Formulary (BNF): Interactions",
    citationUrl: "https://bnf.nice.org.uk/interactions/"
  },
  {
    id: "INT_WARFARIN_ANTIBIOTIC",
    title: "Interaction: Warfarin + Antibiotics",
    drugKeywords: ["warfarin"],
    interactionDrugKeywords: ["ciprofloxacin", "levofloxacin", "bactrim", "sulfamethoxazole", "metronidazole", "erythromycin", "clarithromycin", "amoxicillin", "clavulanate"],
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `Antibiotics may potentiate the effect of Warfarin, increasing INR and bleeding risk.`,
    recommendation: "Monitor INR closely upon initiation of antibiotics. Dose reduction of Warfarin may be needed.",
    citation: "British National Formulary (BNF): Interactions",
    citationUrl: "https://bnf.nice.org.uk/interactions/"
  },
  {
    id: "INT_WARFARIN_PPI",
    title: "Interaction: Warfarin + PPI",
    drugKeywords: ["warfarin"],
    interactionDrugKeywords: ["omeprazole", "esomeprazole"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `Omeprazole inhibits CYP2C19, which metabolizes Warfarin. Co-administration can increase Warfarin exposure and bleeding risk.`,
    recommendation: "Monitor INR closely. Consider switching PPI to Pantoprazole (less CYP2C19 inhibition).",
    citation: "British National Formulary (BNF): Interactions",
    citationUrl: "https://bnf.nice.org.uk/interactions/warfarin/"
  },
  {
    id: "INT_CALCIUM_PPI",
    title: "Interaction: Calcium Carbonate + PPI",
    drugKeywords: ["calcium carbonate"],
    interactionDrugKeywords: ["omeprazole", "pantoprazole", "lansoprazole", "esomeprazole", "rabeprazole"],
    severity: "MEDIUM",
    descriptionTemplate: (drug) => `Proton Pump Inhibitors like ${drug} reduce gastric acid secretion, which can significantly impair the absorption of Calcium Carbonate.`,
    recommendation: "Switch calcium formulation to Calcium Citrate (absorption is acid-independent). Alternatively, take Calcium Carbonate with meals.",
    citation: "FDA Drug Safety Communication: Low Magnesium Levels associated with long-term use of Proton Pump Inhibitor drugs",
    citationUrl: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-low-magnesium-levels-associated-long-term-use-proton-pump-inhibitor-drugs"
  },
  {
    id: "INT_ACE_ARB_POTASSIUM",
    title: "Interaction: ACE/ARB + Potassium/Spironolactone",
    drugKeywords: ["lisinopril", "enalapril", "ramipril", "losartan", "valsartan", "candesartan"],
    interactionDrugKeywords: ["spironolactone", "eplerenone", "potassium", "slow-k", "k-chlor"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `Concurrent use of ACE inhibitors/ARBs with Potassium sparing agents or supplements increases risk of severe hyperkalemia.`,
    recommendation: "Monitor serum potassium and creatinine closely.",
    citation: "British National Formulary (BNF): Interactions",
    citationUrl: "https://bnf.nice.org.uk/interactions/"
  },
  {
    id: "INT_VANCO_PIPTAZO",
    title: "Interaction: Vancomycin + Piperacillin-Tazobactam",
    drugKeywords: ["vancomycin"],
    interactionDrugKeywords: ["piperacillin", "tazobactam", "tazocin", "zylfrin"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `Concurrent use of Vancomycin and Piperacillin-Tazobactam is associated with a higher incidence of acute kidney injury compared to Vancomycin alone or with other beta-lactams.`,
    recommendation: "Monitor renal function daily. Consider alternative empiric coverage (e.g., Cefepime) if renal function declines.",
    citation: "JAMA Pediatrics: Association of Vancomycin + Piperacillin-Tazobactam with AKI",
    citationUrl: "https://jamanetwork.com/journals/jamapediatrics/fullarticle/2664032"
  },
  {
    id: "INT_ACE_NSAID",
    title: "Interaction: ACE/ARB + NSAID (Renal Risk)",
    drugKeywords: ["lisinopril", "enalapril", "ramipril", "losartan", "valsartan", "candesartan"],
    interactionDrugKeywords: ["ibuprofen", "naproxen", "diclofenac", "ketoprofen", "etoricoxib"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `Concurrent use of ACE/ARB and NSAIDs reduces glomerular filtration and significantly increases AKI risk, especially if dehydration or diuretics are present (Triple Whammy).`,
    recommendation: "Avoid combination. Monitor creatinine and potassium. Ensure adequate hydration.",
    citation: "BMJ: Triple Whammy",
    citationUrl: "https://www.bmj.com/content/346/bmj.e8525"
  },
  {
    id: "INT_OPIOID_GABAPENTINOID",
    title: "Interaction: Opioids + Gabapentinoids",
    drugKeywords: ["tramadol", "codeine", "morphine", "oxycodone", "fentanyl"],
    interactionDrugKeywords: ["gabapentin", "pregabalin"],
    severity: "HIGH",
    descriptionTemplate: (drug) => `FDA Warning: Concomitant use of opioids and gabapentinoids increases risk of respiratory depression and sedation.`,
    recommendation: "Monitor closely for respiratory depression. Use lowest effective dosages.",
    citation: "FDA Drug Safety Communication 2019",
    citationUrl: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-warns-about-serious-breathing-problems-seizure-and-nerve-pain-medicines-gabapentin-and"
  }
];

const DUPLICATION_RULES: ClinicalRule[] = [
  {
    id: "DUP_CCB",
    title: "Therapeutic Duplication: Calcium Channel Blockers",
    drugKeywords: ["amlodipine", "nifedipine", "felodipine", "diltiazem", "verapamil"],
    checkType: 'DUPLICATION',
    severity: "HIGH",
    descriptionTemplate: (drug) => `Multiple Calcium Channel Blockers detected. Concurrent use is generally unnecessary and increases risk of hypotension and edema.`,
    recommendation: "Review indication. Consolidate to a single agent unless specific rationale exists (e.g., Diltiazem for rate control + Amlodipine for BP).",
    citation: "JNC 8 Hypertension Guidelines",
    citationUrl: "https://jamanetwork.com/journals/jama/fullarticle/1791497"
  }
];

// --- ENGINE LOGIC ---

/**
 * Normalizes strings for keyword matching
 */
const normalize = (s: string) => s.toLowerCase().trim();

/**
 * Checks if a medication string matches any keywords in a list
 */
const isMatch = (medName: string, keywords: string[]): boolean => {
  const normalizedMed = normalize(medName);
  return keywords.some(k => normalizedMed.includes(normalize(k)));
};

/**
 * Checks if patient has a condition matching the keywords
 */
const hasCondition = (patientConditions: string[], keywords: string[]): boolean => {
  return patientConditions.some(c => isMatch(c, keywords));
};

export const executeSafetyRules = (
  patient: PatientProfile, 
  medicationEvents: MedicationEvent[]
): SafetyAlert[] => {
  const alerts: SafetyAlert[] = [];
  
  // 1. Determine "Active" Medications
  // SORTING FIX: Events must be processed chronologically to determine valid latest status
  const sortedEvents = [...medicationEvents].sort((a, b) => 
    parseClinicalDate(a.date).getTime() - parseClinicalDate(b.date).getTime()
  );

  const latestMedsMap = new Map<string, MedicationEvent>();
  
  sortedEvents.forEach(evt => {
    // Basic deduplication logic based on medication name
    // Since we are strictly sorted by date, we can safely overwrite to get the latest state
    latestMedsMap.set(evt.medication, evt);
  });

  // Filter out Stopped meds to get the list of "Active" meds
  const activeMeds = Array.from(latestMedsMap.values()).filter(m => m.action !== ActionType.STOPPED);

  // 2. Run Single Drug Rules (Beers, STOPP/START, Drug-Disease)
  const allSingleRules = [...BEERS_CRITERIA_RULES, ...STOPP_START_RULES, ...DRUG_DISEASE_RULES];

  activeMeds.forEach(med => {
    allSingleRules.forEach(rule => {
      // A. Check Age Constraint
      if (rule.ageMin && patient.age < rule.ageMin) return;

      // B. Check Drug Match
      if (!isMatch(med.medication, rule.drugKeywords)) return;

      // C. Check Excluded Conditions (Exceptions)
      if (rule.excludedConditions && hasCondition(patient.conditions, rule.excludedConditions)) return;

      // D. Check Required Conditions (e.g. for Drug-Disease checks)
      if (rule.requiredConditions && !hasCondition(patient.conditions, rule.requiredConditions)) return;

      // Hit!
      alerts.push({
        title: rule.title,
        severity: rule.severity,
        description: rule.descriptionTemplate(med.medication),
        recommendation: rule.recommendation,
        citation: rule.citation,
        citationUrl: rule.citationUrl
      });
    });
  });

  // 3. Run Interaction Rules (Drug-Drug)
  // This is O(N^2) complexity, acceptable for med lists < 50 items
  activeMeds.forEach(med1 => {
    DRUG_DRUG_INTERACTIONS.forEach(rule => {
      // Match Med 1
      if (!isMatch(med1.medication, rule.drugKeywords)) return;

      // Look for Med 2 in the active list
      activeMeds.forEach(med2 => {
        if (med1 === med2) return; // Don't match self

        if (rule.interactionDrugKeywords && isMatch(med2.medication, rule.interactionDrugKeywords)) {
             alerts.push({
                title: rule.title,
                severity: rule.severity,
                description: rule.descriptionTemplate(`${med1.medication} + ${med2.medication}`),
                recommendation: rule.recommendation,
                citation: rule.citation,
                citationUrl: rule.citationUrl
            });
        }
      });
    });
  });

  // 4. Run Duplication Rules (Class Duplication)
  DUPLICATION_RULES.forEach(rule => {
    // Find all meds that match this class
    const matchingMeds = activeMeds.filter(m => isMatch(m.medication, rule.drugKeywords));
    
    // If we have 2 or more distinct medications of the same class
    if (matchingMeds.length >= 2) {
       alerts.push({
          title: rule.title,
          severity: rule.severity,
          description: rule.descriptionTemplate(matchingMeds.map(m => m.medication).join(" + ")),
          recommendation: rule.recommendation,
          citation: rule.citation,
          citationUrl: rule.citationUrl
       });
    }
  });

  // Deduplicate alerts (in case multiple rules trigger identical messages)
  const uniqueAlerts = alerts.filter((alert, index, self) => 
    index === self.findIndex((t) => (
      t.title === alert.title && t.description === alert.description
    ))
  );

  return uniqueAlerts;
};
