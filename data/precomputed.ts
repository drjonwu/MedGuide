
import { ExtractionResult, ActionType, MedicationEvent } from '../types';

const getPatientAEvents = (): MedicationEvent[] => [
  {
    id: "evt_a_1",
    date: "2009-03-31",
    medication: "Amlodipine",
    dosage: "10mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Maintained chronic antihypertensive therapy.",
    source_quote: "Amlodipine 10mg OM - 3 months' supply"
  },
  {
    id: "evt_a_losartan",
    date: "2009-03-31",
    medication: "Losartan",
    dosage: "12.5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Maintained chronic lipid/HTN management.",
    source_quote: "Losartan 12.5mg OM - 3 months' supply"
  },
  {
    id: "evt_a_2",
    date: "2009-03-31",
    medication: "Calcium Carbonate",
    dosage: "1000mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated for Calcium deficiency (1.8 mmol/L).",
    source_quote: "Replace Ca, start 1,000mg 1 tab OM"
  },
  {
    id: "evt_a_3",
    date: "2009-03-31",
    medication: "Cholecalciferol",
    dosage: "50,000 units x1/week",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Loading dose initiated for Vitamin D deficiency (20 ng/mL).",
    source_quote: "Replace Vit D, start loading dose 50,000 units"
  },
  // --- MAY 30 VISIT ---
  {
    id: "evt_a_4",
    date: "2009-05-30",
    medication: "Nifedipine LA",
    dosage: "30mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Added to optimize suboptimal BP (180/100).",
    source_quote: "Start nifedipine LA 30mg OM"
  },
  {
    id: "evt_a_alendro",
    date: "2009-05-30",
    medication: "Alendronic Acid",
    dosage: "70mg x1/week",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated for osteoporosis after dental clearance.",
    source_quote: "Start alendronic acid 70mg x1/week"
  },
  {
    id: "evt_a_vitd_maint",
    date: "2009-05-30",
    medication: "Cholecalciferol",
    dosage: "1,000 units OM",
    route: "PO",
    action: ActionType.DECREASED,
    rationale: "Switched to maintenance dose after 8-week loading completion.",
    source_quote: "Change to maintenance dose 1,000 units OM"
  },
  {
    id: "evt_a_cont_amlo_may30",
    date: "2009-05-30",
    medication: "Amlodipine",
    dosage: "10mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Maintained for baseline HTN control alongside new Nifedipine.",
    source_quote: "Amlodipine 10mg OM"
  },
  {
    id: "evt_a_cont_losartan_may30",
    date: "2009-05-30",
    medication: "Losartan",
    dosage: "12.5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for chronic Hyperlipidemia management.",
    source_quote: "Losartan 12.5mg OM"
  },
  {
    id: "evt_a_cont_calcium_may30",
    date: "2009-05-30",
    medication: "Calcium Carbonate",
    dosage: "1000mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued calcium supplementation.",
    source_quote: "Calcium carbonate 1,000mg 1 tab OM"
  },
  // --- JUNE 15 VISIT ---
  {
    id: "evt_a_5",
    date: "2009-06-15",
    medication: "Nifedipine LA",
    dosage: "60mg OM",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Uptitrated due to persistent high SBP (150s-160s).",
    source_quote: "Increase nifedipine LA to 60mg OM"
  },
  {
    id: "evt_a_omeprazole",
    date: "2009-06-15",
    medication: "Omeprazole",
    dosage: "20mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated to manage gastric reflux side effects from Alendronate.",
    source_quote: "Start omeprazole 20mg OM"
  },
  {
    id: "evt_a_cont_amlo_jun15",
    date: "2009-06-15",
    medication: "Amlodipine",
    dosage: "10mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued baseline anti-hypertensive.",
    source_quote: "Amlodipine 10mg OM"
  },
  {
    id: "evt_a_cont_alendro_jun15",
    date: "2009-06-15",
    medication: "Alendronic Acid",
    dosage: "70mg x1/week",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for osteoporosis; Omeprazole added for reflux tolerance.",
    source_quote: "Alendronic acid 70mg x1/week"
  },
  {
    id: "evt_a_cont_losartan_jun15",
    date: "2009-06-15",
    medication: "Losartan",
    dosage: "12.5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Losartan 12.5mg OM"
  },
  {
    id: "evt_a_cont_calcium_jun15",
    date: "2009-06-15",
    medication: "Calcium Carbonate",
    dosage: "1000mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Calcium carbonate 1,000mg 1 tab OM"
  },
  {
    id: "evt_a_cont_chole_jun15",
    date: "2009-06-15",
    medication: "Cholecalciferol",
    dosage: "1,000 units OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Cholecalciferol 1,000 units OM"
  },
  // --- JUNE 30 VISIT (ALL CONTINUED) ---
  {
    id: "evt_a_cont_amlo_jun30",
    date: "2009-06-30",
    medication: "Amlodipine",
    dosage: "10mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for BP control; SBP now stable in 120s.",
    source_quote: "Amlodipine 10mg OM"
  },
  {
    id: "evt_a_cont_nifed_jun30",
    date: "2009-06-30",
    medication: "Nifedipine LA",
    dosage: "60mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued at effective dose; SBP stable.",
    source_quote: "Nifedipine LA 60mg OM"
  },
  {
    id: "evt_a_cont_alendro_jun30",
    date: "2009-06-30",
    medication: "Alendronic Acid",
    dosage: "70mg x1/week",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued with Omeprazole cover; reflux symptoms improved.",
    source_quote: "Alendronic acid 70mg x1/week"
  },
  {
    id: "evt_a_cont_omep_jun30",
    date: "2009-06-30",
    medication: "Omeprazole",
    dosage: "20mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for effective reflux relief.",
    source_quote: "Omeprazole 20mg OM"
  },
  {
    id: "evt_a_cont_losartan_jun30",
    date: "2009-06-30",
    medication: "Losartan",
    dosage: "12.5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Losartan 12.5mg OM"
  },
  {
    id: "evt_a_cont_calcium_jun30",
    date: "2009-06-30",
    medication: "Calcium Carbonate",
    dosage: "1000mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Calcium carbonate 1,000mg 1 tab OM"
  },
  {
    id: "evt_a_cont_chole_jun30",
    date: "2009-06-30",
    medication: "Cholecalciferol",
    dosage: "1,000 units OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Cholecalciferol 1,000 units OM"
  },
  // --- JAN 30 2010 VISIT ---
  {
    id: "evt_a_flu",
    date: "2010-01-30",
    medication: "Influenza Vaccine",
    dosage: "1 dose",
    route: "IM",
    action: ActionType.STARTED,
    rationale: "Administered yearly influenza prophylaxis.",
    source_quote: "Influenza vaccination x1 dose"
  },
  {
    id: "evt_a_cont_amlo_jan30",
    date: "2010-01-30",
    medication: "Amlodipine",
    dosage: "10mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable maintenance for chronic HTN.",
    source_quote: "Amlodipine 10mg OM"
  },
  {
    id: "evt_a_cont_nifed_jan30",
    date: "2010-01-30",
    medication: "Nifedipine LA",
    dosage: "60mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable maintenance for chronic HTN.",
    source_quote: "Nifedipine LA 60mg OM"
  },
  {
    id: "evt_a_cont_alendro_jan30",
    date: "2010-01-30",
    medication: "Alendronic Acid",
    dosage: "70mg x1/week",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable maintenance for Osteoporosis.",
    source_quote: "Alendronic acid 70mg x1/week"
  },
  {
    id: "evt_a_cont_omep_jan30",
    date: "2010-01-30",
    medication: "Omeprazole",
    dosage: "20mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable maintenance for gastroprotection.",
    source_quote: "Omeprazole 20mg OM"
  },
  {
    id: "evt_a_cont_losartan_jan30",
    date: "2010-01-30",
    medication: "Losartan",
    dosage: "12.5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable maintenance for HLD.",
    source_quote: "Losartan 12.5mg OM"
  },
  {
    id: "evt_a_cont_calcium_jan30",
    date: "2010-01-30",
    medication: "Calcium Carbonate",
    dosage: "1000mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable maintenance supplementation.",
    source_quote: "Calcium carbonate 1,000mg 1 tab OM"
  },
  {
    id: "evt_a_cont_chole_jan30",
    date: "2010-01-30",
    medication: "Cholecalciferol",
    dosage: "1,000 units OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable maintenance supplementation.",
    source_quote: "Cholecalciferol 1,000 units OM"
  }
];

const getPatientBEvents = (): MedicationEvent[] => [
  {
    id: "evt_b_1",
    date: "2009-04-01",
    medication: "Aspirin",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated for secondary stroke prevention in acute setting.",
    source_quote: "Start aspirin for secondary stroke prevention"
  },
  {
    id: "evt_b_2",
    date: "2009-04-01",
    medication: "Omeprazole",
    dosage: "20mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Gastroprotection started due to initiation of aspirin.",
    source_quote: "Start omeprazole 20mg OM... for gastroprotection"
  },
  {
    id: "evt_b_3",
    date: "2009-04-01",
    medication: "Actrapid Insulin",
    dosage: "Sliding Scale",
    route: "SC",
    action: ActionType.STARTED,
    rationale: "Tight glycemic control required for acute stroke management.",
    source_quote: "Subcut (SC) Actrapid insulin sliding scale (SCSI)"
  },
  {
    id: "evt_b_4",
    date: "2009-04-01",
    medication: "Metformin",
    dosage: "500mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Oral agent started for poorly controlled T2DM.",
    source_quote: "Metformin 500mg OM... starting at low dose"
  },
  // --- April 02 ---
  {
    id: "evt_b_5",
    date: "2009-04-02",
    medication: "Metformin",
    dosage: "500mg BD",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Uptitrated due to persistent hyperglycemia.",
    source_quote: "Increase metformin to 500mg BD"
  },
  {
    id: "evt_b_6",
    date: "2009-04-02",
    medication: "Atorvastatin",
    dosage: "80mg BD",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "High-intensity statin for secondary stroke prevention and HLD.",
    source_quote: "Start atorvastatin 80mg"
  },
  {
    id: "evt_b_7",
    date: "2009-04-02",
    medication: "Magnesium Sulfate",
    dosage: "500mg BD",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Correction of hypomagnesemia.",
    source_quote: "Replace per oral (PO) Mg 500mg BD for 3 days"
  },
  {
    id: "evt_b_cont_asp_apr02",
    date: "2009-04-02",
    medication: "Aspirin",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for stroke prevention.",
    source_quote: "Aspirin 100mg OM"
  },
  {
    id: "evt_b_cont_omep_apr02",
    date: "2009-04-02",
    medication: "Omeprazole",
    dosage: "20mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued gastroprotection.",
    source_quote: "Omeprazole 20mg OM"
  },
  {
    id: "evt_b_cont_ins_apr02",
    date: "2009-04-02",
    medication: "Actrapid Insulin",
    dosage: "Sliding Scale",
    route: "SC",
    action: ActionType.CONTINUED,
    rationale: "Continued for hyperglycemia.",
    source_quote: "Subcut (SC) Actrapid insulin sliding scale (SCSI)"
  },
  // --- April 04 ---
  {
    id: "evt_b_8",
    date: "2009-04-04",
    medication: "Warfarin",
    dosage: "2mg stat",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated for atrial fibrillation stroke prevention.",
    source_quote: "give warfarin 2mg stat today"
  },
  {
    id: "evt_b_9",
    date: "2009-04-04",
    medication: "Warfarin",
    dosage: "2mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Maintenance dosing initiated pending INR check.",
    source_quote: "start 2mg OM from tomorrow onwards"
  },
  {
    id: "evt_b_cont_asp_apr04",
    date: "2009-04-04",
    medication: "Aspirin",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued stroke prevention.",
    source_quote: "Keep aspirin current dose"
  },
  {
    id: "evt_b_cont_all_apr04",
    date: "2009-04-04",
    medication: "Metformin",
    dosage: "500mg BD",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Metformin 500mg BD"
  },
  // --- April 06 ---
  {
    id: "evt_b_10",
    date: "2009-04-06",
    medication: "Warfarin",
    dosage: "3mg stat",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "INR subtherapeutic (1.7); loading dose increased.",
    source_quote: "give warfarin 3mg once today"
  },
  {
    id: "evt_b_11",
    date: "2009-04-06",
    medication: "Warfarin",
    dosage: "3mg OM",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Maintenance dose increased for 5 days.",
    source_quote: "give warfarin 3mg OM for next 5 days"
  },
  // --- April 12 ---
  {
    id: "evt_b_12",
    date: "2009-04-12",
    medication: "Warfarin",
    dosage: "Omit",
    route: "PO",
    action: ActionType.STOPPED,
    rationale: "Held today due to supratherapeutic INR (3.3).",
    source_quote: "omit top up warfarin for today"
  },
  {
    id: "evt_b_13",
    date: "2009-04-12",
    medication: "Warfarin",
    dosage: "2.5mg OM",
    route: "PO",
    action: ActionType.DECREASED,
    rationale: "Dose reduced for maintenance due to high INR.",
    source_quote: "give warfarin 2.5 mg OM for next 3 days"
  }
];

const getPatientCEvents = (): MedicationEvent[] => [
  {
    id: "evt_c_1",
    date: "2009-04-02",
    medication: "Ketoprofen Plaster",
    dosage: "1 patch",
    route: "Topical",
    action: ActionType.STARTED,
    rationale: "Started for symptomatic relief of severe OA knee pain.",
    source_quote: "Start ketoprofen plaster"
  },
  {
    id: "evt_c_2",
    date: "2009-04-02",
    medication: "Glucosamine",
    dosage: "500mg TDS",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated as a trial therapy for osteoarthritis.",
    source_quote: "Trial of glucosamine"
  },
  {
    id: "evt_c_panadol",
    date: "2009-04-02",
    medication: "Panadol",
    dosage: "2 tabs QDS PRN",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Prescribed as PRN analgesia for breakthrough OA pain.",
    source_quote: "Panadol 2 tabs QDS PRN for pain"
  },
  // --- AUG 02 VISIT ---
  {
    id: "evt_c_knee_inj",
    date: "2009-08-02",
    medication: "Hydrocortisone & Lignocaine",
    dosage: "1 injection per knee",
    route: "Intra-articular",
    action: ActionType.STARTED,
    rationale: "Immediate intervention for severe pain while awaiting expedited TKR.",
    source_quote: "Intra-articular hydrocortisone and lignocaine injections given x2"
  },
  {
    id: "evt_c_cont_keto_aug02",
    date: "2009-08-02",
    medication: "Ketoprofen Plaster",
    dosage: "1 patch BD",
    route: "Topical",
    action: ActionType.CONTINUED,
    rationale: "Maintained for temporary pain relief pending surgery.",
    source_quote: "Ketoprofen plaster BD PRN - kept on old dose"
  },
  {
    id: "evt_c_cont_gluco_aug02",
    date: "2009-08-02",
    medication: "Glucosamine",
    dosage: "500mg TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued despite limited relief as per patient request.",
    source_quote: "Glucosamine 500mg TDS - kept on old dose"
  },
  {
    id: "evt_c_cont_panadol_aug02",
    date: "2009-08-02",
    medication: "Panadol",
    dosage: "2 tabs QDS PRN",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued as PRN analgesia; pain noted to be triggered by walking.",
    source_quote: "Panadol 2 tabs QDS PRN - kept on old dose"
  },
  // --- AUG 15 ADMISSION ---
  {
    id: "evt_c_3",
    date: "2009-08-15",
    medication: "Metformin",
    dosage: "850mg BD",
    route: "PO",
    action: ActionType.STOPPED,
    rationale: "Suspended pre-operatively (NBM) for TKR to prevent lactic acidosis risk.",
    source_quote: "Suspend metformin starting midnight tonight"
  },
  {
    id: "evt_c_iv_fluid_start",
    date: "2009-08-15",
    medication: "Dextrose 5% - Normal Saline",
    dosage: "1L/day",
    route: "IV",
    action: ActionType.STARTED,
    rationale: "Maintenance hydration initiated while NBM pre-operatively.",
    source_quote: "Start IV drip Dextrose 5% (D5) - Normal Saline (NS) 1L/day"
  },
  {
    id: "evt_c_cont_keto_aug15",
    date: "2009-08-15",
    medication: "Ketoprofen Plaster",
    dosage: "1 patch BD",
    route: "Topical",
    action: ActionType.CONTINUED,
    rationale: "Admitting orders: Continuation of chronic pain medications.",
    source_quote: "Ketoprofen plaster BD PRN"
  },
  {
    id: "evt_c_cont_gluco_aug15",
    date: "2009-08-15",
    medication: "Glucosamine",
    dosage: "500mg TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Admitting orders: Continuation of chronic supplements.",
    source_quote: "Glucosamine 500mg TDS"
  },
  {
    id: "evt_c_cont_panadol_aug15",
    date: "2009-08-15",
    medication: "Panadol",
    dosage: "2 tabs QDS PRN",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Admitting orders: Continuation of PRN analgesia.",
    source_quote: "Panadol 2 tabs QDS PRN"
  },
  // --- AUG 16 POST-OP ---
  {
    id: "evt_c_iv_fluid_stop",
    date: "2009-08-16",
    medication: "Dextrose 5% - Normal Saline",
    dosage: "1L/day",
    route: "IV",
    action: ActionType.STOPPED,
    rationale: "Discontinued post-operatively as oral intake resumes.",
    source_quote: "IV 1L/day D5-NS drip stopped"
  },
  {
    id: "evt_c_4",
    date: "2009-08-16",
    medication: "Ceftriaxone",
    dosage: "1g q24H",
    route: "IV",
    action: ActionType.STARTED,
    rationale: "Standard post-operative antibiotic prophylaxis.",
    source_quote: "Start IV Ceftriaxone for 1 day for post-op prophylaxis"
  },
  {
    id: "evt_c_5",
    date: "2009-08-16",
    medication: "Tramadol",
    dosage: "50mg TDS",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated for moderate to severe post-op pain management.",
    source_quote: "Start tramadol 50mg TDS regular for post-op pain"
  },
  {
    id: "evt_c_aspirin",
    date: "2009-08-16",
    medication: "Aspirin",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Chemical DVT prophylaxis protocol post-TKR.",
    source_quote: "Start aspirin 100 mg OM"
  },
  {
    id: "evt_c_vitc",
    date: "2009-08-16",
    medication: "Vitamin C",
    dosage: "500mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Post-operative supplementation to aid wound healing.",
    source_quote: "Start Vitamin C 500mg 1 tab OM"
  },
  {
    id: "evt_c_gaba",
    date: "2009-08-16",
    medication: "Gabapentin",
    dosage: "300mg ON",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Adjunct therapy for post-operative neuropathic pain control.",
    source_quote: "Start gabapentin 300mg ON"
  },
  {
    id: "evt_c_neuro",
    date: "2009-08-16",
    medication: "Neurobion",
    dosage: "1 tab ON",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Post-operative Vitamin B supplementation.",
    source_quote: "Start neurobion 1 tab ON"
  },
  {
    id: "evt_c_cont_keto_aug16",
    date: "2009-08-16",
    medication: "Ketoprofen Plaster",
    dosage: "1 patch BD",
    route: "Topical",
    action: ActionType.CONTINUED,
    rationale: "Maintained as part of multimodal post-op analgesia.",
    source_quote: "Ketoprofen plaster BD PRN"
  },
  {
    id: "evt_c_cont_gluco_aug16",
    date: "2009-08-16",
    medication: "Glucosamine",
    dosage: "500mg TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation of home medication.",
    source_quote: "Glucosamine 500mg TDS"
  },
  {
    id: "evt_c_panadol_aug16",
    date: "2009-08-16",
    medication: "Panadol",
    dosage: "2 tabs QDS",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Escalated from PRN to Regular dosing for post-op pain control.",
    source_quote: "Panadol 2 tabs QDS, changed from PRN dosing to regular"
  },
  // --- AUG 17 WARD ROUND ---
  {
    id: "evt_c_6",
    date: "2009-08-17",
    medication: "Metformin",
    dosage: "850mg BD",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Resumed following post-op recovery; NBM lifted.",
    source_quote: "Restart metformin tomorrow"
  },
  {
    id: "evt_c_7",
    date: "2009-08-17",
    medication: "Sangobion",
    dosage: "2 tabs OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Treatment for anemia (Hb dropped to 10.1 post-op).",
    source_quote: "Start PO replacement iron as sangobion"
  },
  {
    id: "evt_c_folate",
    date: "2009-08-17",
    medication: "Folic Acid",
    dosage: "400mcg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Treatment for newly identified folate deficiency.",
    source_quote: "Start Folic acid 400 mcg 1 tab OM"
  },
  {
    id: "evt_c_b12",
    date: "2009-08-17",
    medication: "Vitamin B12",
    dosage: "1000mcg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Treatment for newly identified B12 deficiency.",
    source_quote: "Start B12 1000mcg OM"
  },
  {
    id: "evt_c_augmentin",
    date: "2009-08-17",
    medication: "Augmentin",
    dosage: "1g BD",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Step-down oral antibiotics following IV Ceftriaxone.",
    source_quote: "Change to PO Augmentin for 1 week"
  },
  {
    id: "evt_c_cont_aspirin_aug17",
    date: "2009-08-17",
    medication: "Aspirin",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for 2-week course of DVT prophylaxis.",
    source_quote: "Aspirin 100 mg OM with omeprazole cover 20mg OM"
  },
  {
    id: "evt_c_cont_keto_aug17",
    date: "2009-08-17",
    medication: "Ketoprofen Plaster",
    dosage: "1 patch BD",
    route: "Topical",
    action: ActionType.CONTINUED,
    rationale: "Continued as adjunct analgesia.",
    source_quote: "Ketoprofen plaster BD PRN"
  },
  {
    id: "evt_c_cont_gluco_aug17",
    date: "2009-08-17",
    medication: "Glucosamine",
    dosage: "500mg TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Glucosamine 500mg TDS"
  },
  {
    id: "evt_c_cont_panadol_aug17",
    date: "2009-08-17",
    medication: "Panadol",
    dosage: "2 tabs QDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued regular dosing for ongoing pain management.",
    source_quote: "Panadol 2 tabs QDS regular"
  },
  {
    id: "evt_c_cont_tramadol_aug17",
    date: "2009-08-17",
    medication: "Tramadol",
    dosage: "50mg TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for post-op analgesia.",
    source_quote: "Tramadol 50mg TDS regular"
  },
  {
    id: "evt_c_cont_vitc_aug17",
    date: "2009-08-17",
    medication: "Vitamin C",
    dosage: "500mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for wound healing.",
    source_quote: "Vitamin C 500mg 1 tab OM"
  },
  {
    id: "evt_c_cont_gaba_aug17",
    date: "2009-08-17",
    medication: "Gabapentin",
    dosage: "300mg ON",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued for neuropathic pain control.",
    source_quote: "Gabapentin 300mg ON"
  },
  {
    id: "evt_c_cont_neuro_aug17",
    date: "2009-08-17",
    medication: "Neurobion",
    dosage: "1 tab ON",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued supplementation.",
    source_quote: "Neurobion 1 tab ON"
  }
];

const getPatientDEvents = (): MedicationEvent[] => [
  // --- April 03 2009 ---
  {
    id: "evt_d_1",
    date: "2009-04-03",
    medication: "Madopar",
    dosage: "125mg TDS (8am, 12pm, 4pm)",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated for symptomatic management of newly diagnosed idiopathic Parkinson's disease (tremor, rigidity, bradykinesia).",
    source_quote: "Start trial of low dose madopar 125 mg at 8am, 12 noon, 4pm"
  },
  {
    id: "evt_d_2",
    date: "2009-04-03",
    medication: "QV Cream",
    dosage: "Apply BD PRN",
    route: "Topical",
    action: ActionType.STARTED,
    rationale: "Symptomatic relief for dry skin/eczema.",
    source_quote: "Start QV cream for dry skin"
  },
  {
    id: "evt_d_3",
    date: "2009-04-03",
    medication: "Amlodipine",
    dosage: "5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Maintenance therapy for Hypertension.",
    source_quote: "Amlodipine 5mg OM"
  },
  {
    id: "evt_d_4",
    date: "2009-04-03",
    medication: "Colchicine",
    dosage: "0.5mg q8H PRN",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "PRN management for acute Gout flares.",
    source_quote: "Colchicine 0.5 mg q8H PRN for gout flares"
  },
  {
    id: "evt_d_5",
    date: "2009-04-03",
    medication: "Allopurinol",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Urate-lowering therapy for Gout prevention.",
    source_quote: "Allopurinol 100mg OM"
  },
  // --- May 03 2009 ---
  {
    id: "evt_d_6",
    date: "2009-05-03",
    medication: "Madopar",
    dosage: "125mg QDS (8am, 12pm, 4pm, 8pm)",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Frequency increased to q4h to address 'wearing off' phenomenon and debilitating 'off' periods.",
    source_quote: "Change madopar timing to 125 mg x4/day"
  },
  {
    id: "evt_d_7",
    date: "2009-05-03",
    medication: "Selegiline",
    dosage: "1.25mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Adjunct MAO-B inhibitor added to extend 'on' time.",
    source_quote: "Add on selegiline 1.25mg OM"
  },
  {
    id: "evt_d_8",
    date: "2009-05-03",
    medication: "Lactulose",
    dosage: "10mL TDS",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Management of constipation (PD non-motor symptom).",
    source_quote: "Start lactulose regular"
  },
  {
    id: "evt_d_9",
    date: "2009-05-03",
    medication: "Senna",
    dosage: "2 tabs OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Stimulant laxative added for constipation.",
    source_quote: "and senna regular"
  },
  {
    id: "evt_d_10",
    date: "2009-05-03",
    medication: "Macrogol",
    dosage: "1 sachet PRN",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Rescue aperient for constipation > 1 day.",
    source_quote: "Macrogol 1 sachet PRN"
  },
  {
    id: "evt_d_cont_qv_may03",
    date: "2009-05-03",
    medication: "QV Cream",
    dosage: "Apply BD PRN",
    route: "Topical",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "QV cream application x2/day PRN"
  },
  {
    id: "evt_d_cont_amlo_may03",
    date: "2009-05-03",
    medication: "Amlodipine",
    dosage: "5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Amlodipine 5mg OM"
  },
  {
    id: "evt_d_cont_colch_may03",
    date: "2009-05-03",
    medication: "Colchicine",
    dosage: "0.5mg q8H PRN",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Colchicine 0.5 mg q8H PRN"
  },
  {
    id: "evt_d_cont_allo_may03",
    date: "2009-05-03",
    medication: "Allopurinol",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Allopurinol 100mg OM"
  },
  // --- June 15 2009 ---
  {
    id: "evt_d_11",
    date: "2009-06-15",
    medication: "Selegiline",
    dosage: "2.5mg OM",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Dose uptitrated for better symptom control.",
    source_quote: "Increase selegiline 2.5 mg OM"
  },
  {
    id: "evt_d_12",
    date: "2009-06-15",
    medication: "Midodrine",
    dosage: "10mg TDS (10am, 2pm, 4pm)",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Initiated for symptomatic postural hypotension.",
    source_quote: "Start trial of midodrine 10mg at 10am, 2pm, 4pm"
  },
  {
    id: "evt_d_cont_mado_jun15",
    date: "2009-06-15",
    medication: "Madopar",
    dosage: "125mg QDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Motor symptoms better controlled on current dose.",
    source_quote: "Continue madopar current doses"
  },
  {
    id: "evt_d_cont_lac_jun15",
    date: "2009-06-15",
    medication: "Lactulose",
    dosage: "10mL TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Lactulose 10mL TDS regular"
  },
  {
    id: "evt_d_cont_senna_jun15",
    date: "2009-06-15",
    medication: "Senna",
    dosage: "2 tabs OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Senna 2 tabs OM regular"
  },
  {
    id: "evt_d_cont_macro_jun15",
    date: "2009-06-15",
    medication: "Macrogol",
    dosage: "1 sachet PRN",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Macrogol 1 sachet PRN"
  },
  {
    id: "evt_d_cont_qv_jun15",
    date: "2009-06-15",
    medication: "QV Cream",
    dosage: "Apply BD PRN",
    route: "Topical",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "QV cream application x2/day PRN"
  },
  {
    id: "evt_d_cont_amlo_jun15",
    date: "2009-06-15",
    medication: "Amlodipine",
    dosage: "5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Amlodipine 5mg OM"
  },
  {
    id: "evt_d_cont_colch_jun15",
    date: "2009-06-15",
    medication: "Colchicine",
    dosage: "0.5mg q8H PRN",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Colchicine 0.5 mg q8H PRN"
  },
  {
    id: "evt_d_cont_allo_jun15",
    date: "2009-06-15",
    medication: "Allopurinol",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Allopurinol 100mg OM"
  },
  // --- June 22 2009 ---
  {
    id: "evt_d_cont_mado_jun22",
    date: "2009-06-22",
    medication: "Madopar",
    dosage: "125mg QDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable 'on' periods; continued.",
    source_quote: "Continue madopar and selegiline current doses"
  },
  {
    id: "evt_d_cont_seleg_jun22",
    date: "2009-06-22",
    medication: "Selegiline",
    dosage: "2.5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Stable; continued.",
    source_quote: "Continue madopar and selegiline current doses"
  },
  {
    id: "evt_d_cont_mido_jun22",
    date: "2009-06-22",
    medication: "Midodrine",
    dosage: "10mg TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Postural BP stable in clinic; continued.",
    source_quote: "Keep current midodrine dose"
  },
  {
    id: "evt_d_cont_lac_jun22",
    date: "2009-06-22",
    medication: "Lactulose",
    dosage: "10mL TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Lactulose 10mL TDS regular"
  },
  {
    id: "evt_d_cont_senna_jun22",
    date: "2009-06-22",
    medication: "Senna",
    dosage: "2 tabs OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Senna 2 tabs OM regular"
  },
  {
    id: "evt_d_cont_macro_jun22",
    date: "2009-06-22",
    medication: "Macrogol",
    dosage: "1 sachet PRN",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Macrogol 1 sachet PRN"
  },
  {
    id: "evt_d_cont_qv_jun22",
    date: "2009-06-22",
    medication: "QV Cream",
    dosage: "Apply BD PRN",
    route: "Topical",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "QV cream application x2/day PRN"
  },
  {
    id: "evt_d_cont_amlo_jun22",
    date: "2009-06-22",
    medication: "Amlodipine",
    dosage: "5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Amlodipine 5mg OM"
  },
  {
    id: "evt_d_cont_colch_jun22",
    date: "2009-06-22",
    medication: "Colchicine",
    dosage: "0.5mg q8H PRN",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Colchicine 0.5 mg q8H PRN"
  },
  {
    id: "evt_d_cont_allo_jun22",
    date: "2009-06-22",
    medication: "Allopurinol",
    dosage: "100mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Allopurinol 100mg OM"
  }
];

const getPatientEEvents = (): MedicationEvent[] => [
  {
    id: "evt_e_1",
    date: "2009-04-04",
    medication: "Metformin",
    dosage: "750mg TDS",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Uptitrated from 500mg BD due to poor DM control (HbA1c 12.4%).",
    source_quote: "Increase metformin to 750mg TDS"
  },
  {
    id: "evt_e_2",
    date: "2009-04-04",
    medication: "Levothyroxine",
    dosage: "25mcg x3/wk, 50mcg x4/wk",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Maintained for Grave's disease s/p RAI.",
    source_quote: "Levothyroxine... old"
  },
  {
    id: "evt_e_3",
    date: "2009-04-04",
    medication: "Ural",
    dosage: "1 sachet OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Alkalizer started for symptomatic relief of UTI.",
    source_quote: "Start ural as urine alkalizer"
  },
  // --- May 16 ---
  {
    id: "evt_e_4",
    date: "2009-05-16",
    medication: "Metformin",
    dosage: "1g TDS",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Maximized dose due to persistent hyperglycemia (CBG 16.7).",
    source_quote: "Increase metformin to 1g TDS max dose"
  },
  {
    id: "evt_e_5",
    date: "2009-05-16",
    medication: "Glipizide",
    dosage: "2.5mg OM",
    route: "PO",
    action: ActionType.STARTED,
    rationale: "Second agent added for DM control.",
    source_quote: "Add on glipizide low dose"
  },
  {
    id: "evt_e_6",
    date: "2009-05-16",
    medication: "Levothyroxine",
    dosage: "25mcg x2/wk, 50mcg x5/wk",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Dose adjusted due to noted hypothyroidism.",
    source_quote: "Increase levothyroxine dose"
  },
  {
    id: "evt_e_cont_ural_may16",
    date: "2009-05-16",
    medication: "Ural",
    dosage: "1 sachet OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Ural 1 sachet OM"
  },
  // --- June 16 ---
  {
    id: "evt_e_7",
    date: "2009-06-16",
    medication: "Glipizide",
    dosage: "5mg OM",
    route: "PO",
    action: ActionType.INCREASED,
    rationale: "Uptitrated due to high home CBG readings.",
    source_quote: "Increase glipizide dose"
  },
  {
    id: "evt_e_cont_met_jun16",
    date: "2009-06-16",
    medication: "Metformin",
    dosage: "1g TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued at max dose.",
    source_quote: "Keep metformin 1g TDS"
  },
  {
    id: "evt_e_cont_ural_jun16",
    date: "2009-06-16",
    medication: "Ural",
    dosage: "1 sachet OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Ural 1 sachet OM"
  },
  {
    id: "evt_e_cont_levo_jun16",
    date: "2009-06-16",
    medication: "Levothyroxine",
    dosage: "25mcg x2/wk, 50mcg x5/wk",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Routine continuation.",
    source_quote: "Levothyroxine..."
  },
  // --- July 16 ---
  {
    id: "evt_e_8",
    date: "2009-07-16",
    medication: "Novomix Insulin",
    dosage: "4 units pre-breakfast",
    route: "SC",
    action: ActionType.STARTED,
    rationale: "Insulin initiated due to inadequate control on dual oral therapy.",
    source_quote: "Start SC novomix 4 units pre-breakfast"
  },
  {
    id: "evt_e_cont_met_jul16",
    date: "2009-07-16",
    medication: "Metformin",
    dosage: "1g TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued.",
    source_quote: "Keep metformin 1g TDS"
  },
  {
    id: "evt_e_cont_glip_jul16",
    date: "2009-07-16",
    medication: "Glipizide",
    dosage: "5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued.",
    source_quote: "Keep glipizide 5mg OM"
  },
  // --- Aug 16 ---
  {
    id: "evt_e_9",
    date: "2009-08-16",
    medication: "Glipizide",
    dosage: "2.5mg OM",
    route: "PO",
    action: ActionType.DECREASED,
    rationale: "Dose reduced due to asymptomatic hypoglycemia.",
    source_quote: "Reduce glipizide back to previous 2.5 mg OM"
  },
  {
    id: "evt_e_10",
    date: "2009-08-16",
    medication: "Novomix Insulin",
    dosage: "2 units pre-breakfast",
    route: "SC",
    action: ActionType.DECREASED,
    rationale: "Dose reduced due to tight control and hypo risk.",
    source_quote: "Reduce SC novomix from 4 units... to 2 units"
  },
  {
    id: "evt_e_cont_met_aug16",
    date: "2009-08-16",
    medication: "Metformin",
    dosage: "1g TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued.",
    source_quote: "Keep metformin 1g TDS"
  },
  // --- Aug 29 (Admission) ---
  {
    id: "evt_e_11",
    date: "2009-08-29",
    medication: "Vancomycin",
    dosage: "2.5g stat",
    route: "IV",
    action: ActionType.STARTED,
    rationale: "Loading dose for osteomyelitis (MRSA positive).",
    source_quote: "IV Vancomycin 2,500 mg once dose now... loading"
  },
  {
    id: "evt_e_12",
    date: "2009-08-29",
    medication: "Vancomycin",
    dosage: "2g q8H",
    route: "IV",
    action: ActionType.STARTED,
    rationale: "Maintenance dose started 8h after loading.",
    source_quote: "IV Vancomycin maintenance dose 2,000mg q8H"
  },
  {
    id: "evt_e_13",
    date: "2009-08-29",
    medication: "Piperacillin-Tazobactam",
    dosage: "3.375g q8H",
    route: "IV",
    action: ActionType.STARTED,
    rationale: "Empiric coverage for osteomyelitis.",
    source_quote: "IV Piperacillin-Tazocin 3.375 q8H"
  },
  {
    id: "evt_e_14",
    date: "2009-08-29",
    medication: "Normal Saline",
    dosage: "1L/day",
    route: "IV",
    action: ActionType.STARTED,
    rationale: "Hydration for Acute Kidney Injury (AKI).",
    source_quote: "Start IV NS 1L/day for hydration ivo acute kidney injury"
  },
  {
    id: "evt_e_15",
    date: "2009-08-29",
    medication: "Actrapid Insulin",
    dosage: "Sliding Scale",
    route: "SC",
    action: ActionType.STARTED,
    rationale: "Initiated for inpatient glycemic control during infection.",
    source_quote: "Actrapid as per insulin sliding scale protocol"
  },
  {
    id: "evt_e_cont_met_aug29",
    date: "2009-08-29",
    medication: "Metformin",
    dosage: "1g TDS",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued on admission.",
    source_quote: "Metformin 1g TDS"
  },
  {
    id: "evt_e_cont_glip_aug29",
    date: "2009-08-29",
    medication: "Glipizide",
    dosage: "2.5mg OM",
    route: "PO",
    action: ActionType.CONTINUED,
    rationale: "Continued on admission.",
    source_quote: "Glipizide 2.5 mg OM"
  },
  {
    id: "evt_e_cont_novo_aug29",
    date: "2009-08-29",
    medication: "Novomix Insulin",
    dosage: "2 units pre-breakfast",
    route: "SC",
    action: ActionType.CONTINUED,
    rationale: "Continued on admission.",
    source_quote: "Subcutaneous novomix 2 units"
  },
  // --- Sept 01 ---
  {
    id: "evt_e_16",
    date: "2009-09-01",
    medication: "Metformin",
    dosage: "Suspended",
    route: "PO",
    action: ActionType.STOPPED,
    rationale: "Suspended pre-operatively for toe amputation.",
    source_quote: "Suspend metformin... ivo planned for operation"
  },
  {
    id: "evt_e_17",
    date: "2009-09-01",
    medication: "Glipizide",
    dosage: "Suspended",
    route: "PO",
    action: ActionType.STOPPED,
    rationale: "Suspended pre-operatively.",
    source_quote: "Glipizide... suspended"
  },
  {
    id: "evt_e_18",
    date: "2009-09-01",
    medication: "Novomix Insulin",
    dosage: "Suspended",
    route: "SC",
    action: ActionType.STOPPED,
    rationale: "Suspended pre-operatively.",
    source_quote: "Suspend tomorrow's pre-breakfast novomix"
  },
  {
    id: "evt_e_19",
    date: "2009-09-01",
    medication: "Levothyroxine",
    dosage: "Suspended",
    route: "PO",
    action: ActionType.STOPPED,
    rationale: "Suspended pre-operatively.",
    source_quote: "Levothyroxine... suspended"
  },
  {
    id: "evt_e_20",
    date: "2009-09-01",
    medication: "Vancomycin",
    dosage: "2.5g stat",
    route: "IV",
    action: ActionType.INCREASED,
    rationale: "Re-loading dose given due to subtherapeutic trough (14.2).",
    source_quote: "Increase Vanco dose with once dose now"
  },
  {
    id: "evt_e_21",
    date: "2009-09-01",
    medication: "Vancomycin",
    dosage: "2.5g q8H",
    route: "IV",
    action: ActionType.INCREASED,
    rationale: "Maintenance increased to target therapeutic levels.",
    source_quote: "IV Vancomycin maintenance dose 2,500mg q8H"
  },
  {
    id: "evt_e_22",
    date: "2009-09-01",
    medication: "Dextrose 5% - Normal Saline",
    dosage: "1L/day",
    route: "IV",
    action: ActionType.STARTED,
    rationale: "Fluids changed to dextrose-containing for NBM protocol.",
    source_quote: "changed instead to D5-NS 1L/day"
  },
  {
    id: "evt_e_cont_pip_sep01",
    date: "2009-09-01",
    medication: "Piperacillin-Tazobactam",
    dosage: "3.375g q8H",
    route: "IV",
    action: ActionType.CONTINUED,
    rationale: "Continued.",
    source_quote: "IV Piperacillin-Tazocin 3.375 q8H"
  }
];

export const PRECOMPUTED_DATA: Record<string, ExtractionResult> = {
  "PATIENT_A": {
    patientId: "PATIENT_A",
    events: getPatientAEvents()
  },
  "PATIENT_B": {
    patientId: "PATIENT_B",
    events: getPatientBEvents()
  },
  "PATIENT_C": {
    patientId: "PATIENT_C",
    events: getPatientCEvents()
  },
  "PATIENT_D": {
    patientId: "PATIENT_D",
    events: getPatientDEvents()
  },
  "PATIENT_E": {
    patientId: "PATIENT_E",
    events: getPatientEEvents()
  }
};
