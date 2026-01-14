import { PatientProfile } from './types';

const PATIENT_A_NOTES = `
Madam A
March 31 2009
First visit GP consult
79 year old chinese female. No known drug allergies.
Patient (pt) has past medical history (PMHx) of:
- Hypertension (HTN) - started on anti-HTN meds by polyclinic many years ago - currently taking amlodipine 10mg OM
- Hyperlipidemia (HLD) - started on treatment by General Practitioner (GP) many years ago - currently taking losartan 12.5mg OM
Presenting to primary care for continuation of care after discharging from hospital after experiencing a fall from standing height resulting in Left hip fracture which required open reduction and surgical fixation (ORIF).
Laboratory findings: Noted Bone Mineral Density done in Feb 2009 - T-score -2.7. Calcium deficient - 1.8 mmol/L. Vitamin D deficient - 20 ng/mL.
Plans:
- Replace Ca, start 1,000mg 1 tab OM
- Replace Vit D, start loading dose 50,000 units cholecalciferol x1/week for 8 weeks
Medications prescribed on March 31 2009:
- Amlodipine 10mg OM - 3 months' supply, chronic med for HTN - old
- Losartan 12.5mg OM - 3 months' supply, chronic med for HLD - old
- Calcium carbonate 1,000mg 1 tab OM - 3 months' supply, new for hypoCa - new
- Cholecalciferol 50,000 units x1/week - 8 weeks supply, new for Vit D deficiency - new

Madam A
May 30 2009
Follow-up visit to GP
Vitals today: BP - 180/100.
Also noted that Dental has done tooth extraction x1 and cleared for starting bisphosphonates.
Plans:
- Keep amlodipine current dose
- Start nifedipine LA 30mg OM to better optimize control of whole day BP trend
- Start alendronic acid 70mg x1/week
- As have completed Vit D loading dose, to change to maintenance dose 1,000 units OM instead
Medications prescribed on May 30 2009:
- Amlodipine 10mg OM
- Nifedipine LA 30mg OM - newly started
- Alendronic acid 70mg x1/week - newly started
- Losartan 12.5mg OM
- Calcium carbonate 1,000mg 1 tab OM
- Cholecalciferol 1,000 units OM - newly started for maintenance

Madam A
June 15 2009
Follow-up visit to GP
Pt family noted that pt BP trend has still been high - SBP 150s-160s after starting nifedipine LA 30mg OM.
However, pt family noted that pt has been complaining of finding alendronate side effect (s/e) of gastric reflux to be quite uncomfortable for her.
Plans:
- Start omeprazole 20mg OM, to be taken with alendronate
- Increase nifedipine LA to 60mg OM
Medications prescribed on June 15 2009:
- Amlodipine 10mg OM
- Nifedipine LA 60mg OM - newly increased
- Alendronic acid 70mg x1/week
- Omeprazole 20mg OM - newly started
- Losartan 12.5mg OM
- Calcium carbonate 1,000mg 1 tab OM
- Cholecalciferol 1,000 units OM

Madam A
June 30 2009
Follow up visit to GP
Noted that SBP now 120s throughout the day.
Pt shares that reflex symptoms have improved considerably since starting the regular omeprazole.
Medications prescribed on June 30 2009:
- Amlodipine 10mg OM
- Nifedipine LA 60mg OM
- Alendronic acid 70mg x1/week
- Omeprazole 20mg OM
- Losartan 12.5mg OM
- Calcium carbonate 1,000mg 1 tab OM
- Cholecalciferol 1,000 units OM

Madam A
Jan 30 2010
Follow up visit to GP
Noted that pt is due for her yearly influenza vaccination.
Medications prescribed on Jan 30 2010:
- Influenza vaccination x1 dose - new
- Amlodipine 10mg OM
- Nifedipine LA 60mg OM
- Alendronic acid 70mg x1/week
- Omeprazole 20mg OM
- Losartan 12.5mg OM
- Calcium carbonate 1,000mg 1 tab OM
- Cholecalciferol 1,000 units OM
`;

const PATIENT_B_NOTES = `
Mr B
April 01 2009
Admission note to Acute Hospital
65 year old Indian male. No known drug allergies.
PMHx of:
- Hypertension (HTN) - previously prescribed nifedipine, but pt has been non-compliant to many years
- Hyperlipidemia (HLD) - pt had declined starting pharmaceutical mx
- Type 2 Diabetes Mellitus (T2DM) - poorly controlled, as pt not keen to start any treatment
- Obesity complicated by obstructive sleep apnea (OSA)
History of Presenting Complaint (HOPC):
Noted to have sudden onset of Right sided weakness of both upper (UL) and lower limbs (LL) 3 days ago.
Investigations:
- CT brain confirmed diagnosis of Left thalamic stroke, acute infarct
- Renal panel shows Chronic Kidney Disease (CKD) stage 2
- Random capillary blood glucose (CBG) was 18
- Poorly controlled HTN in AnE, SBP 180s
Plans:
- Start aspirin for secondary stroke prevention
- Allow permissive HTN for 2 weeks
Medications prescribed on April 01 2009:
- Aspirin 100mg OM, newly started inpatient (inpt) for new stroke - new
- Omeprazole 20mg OM, newly started intpt for gastroprotection in view of (ivo) newly started aspirin - new
- Subcut (SC) Actrapid insulin sliding scale (SCSI), newly started inpt to ensure better CBG control - new
- Metformin 500mg OM, newly started for DM control, starting at low dose in view of pt's non-compliance to medications for many years - new

Mr B
April 02 2009
Daily Ward Rounds in Acute Hospital
Overnight/subjective: CBG poorly controlled, noted hyperglycemia.
Investigations: Lipid panel significant for high LDL (2.8 mmol/L) and high cholesterol (6.5 mmol/L). Magnesium (Mg) slightly deficient (0.70 mmol/L).
Plans:
- Monitor CBG closely
- Increase metformin to 500mg BD ivo suboptimal CBG control
- Start atorvastatin 80mg
- Replace per oral (PO) Mg 500mg BD for 3 days
Medications prescribed on April 02 2009:
- Aspirin 100mg OM
- Omeprazole 20mg OM
- Subcut (SC) Actrapid insulin sliding scale (SCSI)
- Metformin 500mg BD, newly started on metformin for for DM control, increasing dose today from 500mg OM to BD
- Atorvastatin 80mg BD, newly started today ivo pt's poorly controlled lipids and also for secondary stroke prevention - new
- Magnesium sulfate 500mg BD, 3 days course, newly started as short PO replacement for Mg deficiency - new

Mr B
April 03 2009
Daily Ward Rounds in Acute Hospital
Investigations: TTE and Holter done yesterday afternoon and reported today. Significant for paroxysmal Atrial Fibrillation (AF).
Consulted Cardiovascular Medicine (CVM) today as a referral letter for above findings.
Plans:
- Await CVM review
- Keep in view to start warfarin for pAF
Medications prescribed on April 03 2009:
- Aspirin 100mg OM
- Omeprazole 20mg OM
- Subcut (SC) Actrapid insulin sliding scale (SCSI)
- Metformin 500mg BD
- Atorvastatin 80mg BD
- Magnesium sulfate 500mg BD, 2 more days remaining

Mr B
April 04 2009
Daily Ward Rounds in Acute Hospital
Noted CVM specialist review with many thanks. Noted CVM suggestion to start warfarin for pAF ivo recent hx of stroke. Suggested to keep INR between 2.0 and 3.0.
Plans:
- Keep aspirin current dose
- Start warfarin, to titrate dose to reach target INR range of 2.0 to 3.0. Consulted with Pharmacy and suggested to give warfarin 2mg stat today and start 2mg OM from tomorrow onwards and check INR in 2 days' time
Medications prescribed on April 04 2009:
- Aspirin 100mg OM
- Omeprazole 20mg OM
- Subcut (SC) Actrapid insulin sliding scale (SCSI)
- Metformin 500mg BD
- Atorvastatin 80mg BD
- Magnesium sulfate 500mg BD, 1 more day remaining
- Warfarin 2mg ordered once today April 04 2009 and another dose 2mg ordered for tomorrow April 05 2009 - new

Mr B
April 06 2009
Inpatient review note in Acute Hospital
Noted PT and INR results today. Today's INR is subtherapeutic, only 1.7.
Consulted with hospital pharmacist:
- Suggested to give warfarin 3mg once today
- Then to give warfarin 3mg OM for next 5 days and recheck INR the day afterwards (on April 12 2009)
Medications prescribed on April 06 2009:
- Warfarin 3mg ordered once today April 06 2009
- Subsequent warfarin dose 3mg OM ordered for tomorrow April 07 2009 for an additional 5 days

Mr B
April 12 2009
Inpatient review note in Acute Hospital
Noted PT and INR results today. Today's INR is now beyond therapeutic range, 3.3.
Consulted with hospital pharmacist:
- Suggested to omit top up warfarin for today
- To give warfarin 2.5 mg OM for next 3 days and recheck INR the day afterwards (on April 16 2009)
Medications prescribed on April 12 2009:
- Warfarin dose 2.5mg OM ordered for tomorrow April 13 2009 for 3 days - new
`;

const PATIENT_C_NOTES = `
Madam C
April 02 2009
First specialist visit to Orthopedic Surgery
77 years old chinese lady.
PMHx:
- T2DM - taking metformin 850mg BD
Investigations: XR done today in clinic prior to review - Severe OA changes seen b/l, Right > Left.
Plans:
- Start ketoprofen plaster
- Trial of glucosamine
- Refer to outpatient Physiotherapy (PT) and Occupational Therapy (OT)
- KIV to H&L injections to b/l knees if pain persistent and impeding ADLs
- KIV for b/l TKR if pt keen
Medications prescribed on April 02 2009:
- Ketoprofen plaster BD PRN for pain, 1 months' supply - newly started
- Glucosamine 500mg TDS for pain, 3 months' supply - newly started
- Panadol 2 tabs QDS PRN for pain, 1 months' supply - newly started

Madam C
August 02 2009
Follow-up visit to Orthopedic Surgery
Pt notes that while it is better controlled with analgesia, relief is temporary and that pain would be triggered with simple walking.
Pt is very keen for immediate pain relief and wants to expedite TKR.
Offered H&L injection to b/l knees to pt, pt keen to proceed.
Plans:
- Proceed with H&L today
- Arrange for expedited elective b/l TKR
Medications prescribed on August 02 2009:
- Ketoprofen plaster BD PRN - kept on old dose
- Glucosamine 500mg TDS - kept on old dose
- Panadol 2 tabs QDS PRN - kept on old dose
- Intra-articular hydrocortisone and lignocaine injections given x2, one injection into each knee joint - new, one time medication

Madam C
August 15 2009
Admitted to Acute Hospital Orthopedic Surgery
Elective admission from OTO clinic.
Issues: b/l severe OA knees planned for elective b/l TKR on Aug 16. b/g DM.
Plans:
- Proceed with 11am TKR tomorrow
- Nil by mouth (NBM) tonight midnight
- Suspend metformin starting midnight tonight
- Start IV drip Dextrose 5% (D5) - Normal Saline (NS) 1L/day at midnight while NBM
Medications prescribed on August 15 2009:
- Metformin 850mg BD - suspended midnight on Aug 15
- Ketoprofen plaster BD PRN
- Glucosamine 500mg TDS
- Panadol 2 tabs QDS PRN
- IV drip Dextrose 5% - Normal Saline 1L/day, started at midnight while NBM - new

Madam C
August 16 2009
Daily Ward Rounds in Acute Hospital
Noted operative notes this morning: Pt required 2 units of packed cells transfusion (PCT) ivo significant blood loss intraoperatively.
Impression: b/l OA knees s/p b/l TKR on Aug 16 2009 complicated by: Intermittent low grade postoperative fever.
Plans:
- Start post-operative medications as per OTO operation notes: Vitamin C x1 month, gabapentin x1 month, neurobion x1 month, aspirin x2 weeks for DVT prophylaxis
- Start IV Ceftriaxone for 1 day for post-op prophylaxis
- Start tramadol 50mg TDS regular for post-op pain
- Change panadol from PRN to regular
Medications given August 16 2009:
- Aspirin 100 mg OM with omeprazole cover 20mg OM for 2 weeks from date of Aug 16 2009, newly order for DVT prophylaxis - newly started
- IV 1L/day D5-NS drip stopped
- Continued to suspend metformin 850mg BD
- Ketoprofen plaster BD PRN
- Glucosamine 500mg TDS
- Panadol 2 tabs QDS, changed from PRN dosing to regular - old
- Tramadol 50mg TDS regular, newly started today for managing post-op pain - new
- Vitamin C 500mg 1 tab OM, newly started post-op - new
- Gabapentin 300mg ON, newly started post-op - new
- Neurobion 1 tab ON, newly started post-op - new
- IV Ceftriaxone 1g q24H for today for post-op prophylaxis - new

Madam C
August 17 2009
Daily Ward Rounds in Acute Hospital
Noted labs today: Hemoglobin (Hb) dropped from pre-op baseline of 13s to 10.1. B12, folate, and serum iron all newly found to be deficient today.
Plans:
- Start PO replacement iron as sangobion 2 tabs OM
- Start B12 and folate replacement
- Complete 1 day of IV Ceftrixone today, to change to PO Augmentin for 1 week starting tomorrow Aug 18 2009
- Restart metformin tomorrow
Medications given August 17 2009:
- Sangobion 2 tabs OM, newly started for iron deficiency anemia - new
- Folic acid 400 mcg 1 tab OM, newly started for folate deficiency - new
- B12 1000mcg OM, newly started for B12 deficiency - new
- Aspirin 100 mg OM with omeprazole cover 20mg OM
- Metformin 850mg BD resumed today - new change to old med
- Ketoprofen plaster BD PRN
- Glucosamine 500mg TDS
- Panadol 2 tabs QDS regular
- Tramadol 50mg TDS regular
- Vitamin C 500mg 1 tab OM
- Gabapentin 300mg ON
- Neurobion 1 tab ON
- PO Augmentin 1g BD, newly started for post-op prophylaxis, ordered for x 2 weeks from today Aug 17 - new
`;

const PATIENT_D_NOTES = `
Mr D
April 03 2009
First specialist visit to Neurology
86 years old Caucasian man.
PMHx:
1. HTN on amlodipine
2. HLD on diet control
3. Gout on regular allopurinol and PRN colchicine
4. Eczema on topical creams
Referred from GP for Parkinsonism: Symptoms started 6 years ago, 6 months ago started having multiple falls.
O/E: Mask-like facies, Intermittent resting tremor, Clasp-knife rigidity present, Bradykinesia present. Shuffling gait.
Issues: Newly dx idiopathic parkinson's disease complicated by: Recurrent falls, Progressive dysphagia.
Plans:
- Start trial of low dose madopar 125 mg at 8am, 12 noon, 4pm
- Start QV cream for dry skin
Medications given April 03 2009:
- Madopar 125 mg x3/day (8am, 12 noon, 4pm), newly started for newly diagnosed parkinson's disease - new
- QV cream application x2/day PRN for dry skin - new
- Amlodipine 5mg OM - old
- Colchicine 0.5 mg q8H PRN for gout flares - old
- Allopurinol 100mg OM - old

Mr D
May 03 2009
Follow-up specialist visit to Neurology
Subjective: Pt shares that he has "on" periods around 30 mins after taking madopar, and that "on" period lasts for around 4 hours. However, pt finds the rebound "off" period to be more debilitating than before.
Pt also sharing that he is now bothered by constipation; having no bowel opening (NBO) for 3-4 days.
Plans:
- Change madopar timing to 125 mg x4/day, to take at 8am, 12 noon, 4pm, 8pm
- Add on selegiline 1.25mg OM
- Start lactulose regular and senna regular to ensure regular clearing of bowels
Medications given May 03 2009:
- Madopar 125 mg x4/day (8am, 12 noon, 4pm, 8pm), newly uptitrated - newly uptitrated
- Selegiline 1.25mg OM, newly started for management of Parkinsons' symptoms - new
- Lactulose 10mL TDS regular - new
- Senna 2 tabs OM regular - new
- Macrogol 1 sachet PRN for no bowel opening (BO) for more than 1 day - new
- QV cream application x2/day PRN
- Amlodipine 5mg OM
- Colchicine 0.5 mg q8H PRN
- Allopurinol 100mg OM

Mr D
June 15 2009
Follow-up specialist visit to Neurology
Pt feels that motor symptoms are now better controlled.
However, pt is now more disturbed by non-motor symptoms. On top of previously shared constipation, pt has now also noted postural hypotension symptoms.
O/E: Measured postural BP in clinic. During BP measurements, pt complained of postural hypotension symptoms throughout.
Plans:
- Continue madopar current doses
- Increase selegiline 2.5 mg OM
- Start trial of midodrine 10mg at 10am, 2pm, 4pm
Medications given June 15 2009:
- Madopar 125 mg x4/day
- Selegiline 2.5 mg OM, newly uptitrated from 1.25 mg OM - new
- Midodrine 10 mg x3/day (to take at 10am, 2pm, 4pm), newly started for symptomatic postural hypotension - new
- Lactulose 10mL TDS regular
- Senna 2 tabs OM regular
- Macrogol 1 sachet PRN
- QV cream application x2/day PRN
- Amlodipine 5mg OM
- Colchicine 0.5 mg q8H PRN
- Allopurinol 100mg OM

Mr D
June 22 2009
Follow-up specialist visit to Neurology
Subjective: "On" periods have been stable. No postural BP drop seen in clinic today.
Plans:
- Continue madopar and selegiline current doses
- Keep current midodrine dose
Medications given June 22 2009:
- Madopar 125 mg x4/day
- Selegiline 2.5 mg OM
- Midodrine 10 mg x3/day
- Lactulose 10mL TDS regular
- Senna 2 tabs OM regular
- Macrogol 1 sachet PRN
- QV cream application x2/day PRN
- Amlodipine 5mg OM
- Colchicine 0.5 mg q8H PRN
- Allopurinol 100mg OM
`;

const PATIENT_E_NOTES = `
Madam E
April 04 2009
First specialist visit to Endocrinology
Referred to Endocrinology for poorly controlled DM.
59 years old Chinese lady. Morbidly obese, 120 kg.
PMHx:
- T2DM
- Grave's disease s/p Radioactive Iodine (RAI) 20 years ago
- Chronic kidney disease (CKD) stage 3
- Recurrent lower limb (LL) cellulitis for b/l limbs
Current history:
- Pt has been having recurrent b/l LL warmth, swelling, redness for 4-5 months.
- Pt screened for DM 6 weeks ago and found to have HbA1c of 12.4%. Was started on metformin 500mg BD by GP for recently diagnosed DM, but pt has been non-compliant.
Impression:
1. DM, poorly controlled and not compliant with medication. Complicated by: Recurrent UTI, Recurrent LL cellulitis.
2. Grave's disease s/p Radioactive Iodine (RAI), now on long term levothyroxine replacement.
Plans:
- Increase metformin to 750mg TDS
- Start ural as urine alkalizer to address UTI sx
- KIV to add on glipizide if metformin insufficient
Medications given April 04 2009:
- Metformin 750mg TDS, newly uptitrated for poorly controlled DM (was given 500mg BD, but pt was not compliant) - new
- Levothyroxine 25 mcg x3/week - old
- Levothyroxine 50 mcg x4/week - old
- Ural 1 sachet OM, newly started for UTI symptoms - new

Madam E
May 16 2009
Follow-up specialist visit to Endocrinology
Following up on CBG control in pt with poorly controlled DM and non-compliant to medications.
Objective: Random CBG raised today 16.7. Also noted hypothyroidism on today's bloods despite taking long term levothyroxine replacement.
Plans:
- Increase metformin to 1g TDS max dose
- Add on glipizide low dose
- Increase levothyroxine dose
Medications given May 16 2009:
- Metformin 1g TDS, newly uptitrated - new
- Glipizide 2.5 mg OM, newly started to better control DM - new
- Ural 1 sachet OM
- Levothyroxine 25 mcg x2/week, newly uptitrating - new
- Levothyroxine 50 mcg x5/week, newly uptitrating - new

Madam E
June 16 2009
Follow-up specialist visit to Endocrinology
Monitoring CBG control at home in response to titration of OGHAs done last visit May 2009.
Subjective: Pt claims that she is now compliant to OHGAs.
Objective: Noted CBG diary, ranging 8-12 pre-breakfast, 10-18 pre-lunch, 12-20 pre-dinner.
Plans:
- Keep metformin 1g TDS max dose
- Increase glipizide dose
- Review again in 1 month's time to monitor response to CBG, KIV to start SC insulin.
Medications given June 16 2009:
- Metformin 1g TDS
- Glipizide 5mg OM, newly uptitrated from 2.5 mg OM to better control DM - new
- Ural 1 sachet OM
- Levothyroxine 25 mcg x2/week
- Levothyroxine 50 mcg x5/week

Madam E
July 16 2009
Follow-up specialist visit to Endocrinology
Communications: Explained to pt that would advise to start subcutaneous insulin ivo inadequate CBG control on just OHGAs alone. Pt was previously hesitant, but now agreeable to try starting low dose.
Plans:
- Keep metformin 1g TDS max dose
- Keep glipizide 5mg OM
- Start SC novomix 4 units pre-breakfast
Medications given June 16 2009:
- Metformin 1g TDS
- Glipizide 5mg OM
- Subcutaneous novomix 4 units pre-breakfast, newly started ivo poor CBG control despite use of 2 OHGAs - new
- Ural 1 sachet OM
- Levothyroxine 25 mcg x2/week
- Levothyroxine 50 mcg x5/week

Madam E
August 16 2009
Follow-up specialist visit to Endocrinology
Objective: Noted CBG diary, ranging 4-7 pre-breakfast with x2 episodes of asymptomatic hypoglycemia 3.4 and 3.8.
Communications: Explained to pt that in view of charted episodes of hypoglycemia at home and tight CBG control, especially during the mornings, will be reducing glipizide back to old dose as well as reducing novomix.
Plans:
- Keep metformin 1g TDS max dose
- Reduce glipizide back to previous 2.5 mg OM dose in view of recent hypoglycemia
- Reduce SC novomix from 4 units pre-breakfast to 2 units instead
Medications given August 16 2009:
- Metformin 1g TDS
- Glipizide 2.5 mg OM, newly reduced from 5 mg OM to 2.5 mg OM ivo tight CBG control - new
- Subcutaneous novomix 2 units pre-breakfast, newly reduced from 4 units pre-BF to 2 units pre-BF ivo tight CBG control - new
- Ural 1 sachet OM
- Levothyroxine 25 mcg x2/week
- Levothyroxine 50 mcg x5/week

Madam E
August 29 2009
Admission note to Acute Hospital
HOPC: Experienced Left forefoot pain for 4-5 days. Left foot pain initially started as plantar base of Left great toe redness and swelling.
Investigations: X-ray of Left foot shows focal bony lysis of Left 1st toe metatarsal base with joint effusion and periarticular swelling. Noted that pt is positive for MRSA on skin swabbing upon screening today.
Impression: Left great toe base of metatarsal osteomyelitis (OM) 2' suboptimal DM control in b/g MRSA colonizer.
Plans:
- Start IV NS 1L/day for hydration ivo acute kidney injury (AKI)
- To start empiric IV Vancomycin and IV Piperacillin-Tazocin
Medications given August 29 2009:
- Metformin 1g TDS
- Glipizide 2.5 mg OM
- Subcutaneous novomix 2 units pre-breakfast
- Actrapid as per insulin sliding scale protocol
- Ural 1 sachet OM
- Levothyroxine 25 mcg x2/week
- Levothyroxine 50 mcg x5/week
- IV NS 1L/day, new, started for AKI
- IV Vancomycin 2,500 mg once dose now, new, loading dose
- IV Vancomycin maintenance dose 2,000mg q8H, to serve 8 hours after completion of loading dose
- IV Piperacillin-Tazocin 3.375 q8H for next 7 days

Madam E
September 01 2009
Inpatient review note in Acute Hospital
Noted OTO finalized plans yesterday. OTO plans to proceed with Left foot toe ray amputation tomorrow.
Noted lab results today: Vanco trough today is below therapeutic threshold - today is 14.2.
Plans:
- Increase Vanco dose with once dose now
- Suspend metformin and other OHGAs ivo planned for operation tomorrow
- Suspend tomorrow's pre-breakfast novomix
Medications given September 01 2009:
- Metformin 1g TDS - suspended
- Glipizide 2.5 mg OM - suspended
- Subcutaneous novomix 2 units pre-breakfast - suspended
- Actrapid sliding scale changed from TDS pre-meals titration to instead q6H as per insulin sliding scale protocol for nil by mouth
- Ural 1 sachet OM - suspended
- Levothyroxine 25 mcg x2/week - suspended
- Levothyroxine 50 mcg x5/week - suspended
- IV NS 1L/day stopped, changed instead to D5-NS 1L/day as per preoperative nil by mouth protocol
- IV Vancomycin 2,500 mg once dose now, new, increased dose
- IV Vancomycin maintenance dose 2,500mg q8H, to serve 8 hours after completion of once dose
- IV Piperacillin-Tazocin 3.375 q8H
`;

export const PATIENTS: PatientProfile[] = [
  {
    id: "PATIENT_A",
    name: "Madam A",
    age: 79,
    gender: "Female",
    conditions: ["HTN", "HLD", "Osteoporosis", "Vit D Deficiency"],
    notes: PATIENT_A_NOTES,
    insuranceNumber: "INS-992-883"
  },
  {
    id: "PATIENT_B",
    name: "Mr B",
    age: 65,
    gender: "Male",
    conditions: ["Stroke", "CKD Stage 2", "T2DM", "HTN", "HLD", "Obesity", "OSA", "pAF"],
    notes: PATIENT_B_NOTES,
    insuranceNumber: "INS-110-229"
  },
  {
    id: "PATIENT_C",
    name: "Madam C",
    age: 77,
    gender: "Female",
    conditions: ["Severe OA Knees", "T2DM", "Iron Deficiency Anemia"],
    notes: PATIENT_C_NOTES,
    insuranceNumber: "INS-883-123"
  },
  {
    id: "PATIENT_D",
    name: "Mr D",
    age: 86,
    gender: "Male",
    conditions: ["Parkinson's Disease", "HTN", "HLD", "Gout", "Postural Hypotension"],
    notes: PATIENT_D_NOTES,
    insuranceNumber: "INS-445-009"
  },
  {
    id: "PATIENT_E",
    name: "Madam E",
    age: 59,
    gender: "Female",
    conditions: ["T2DM", "Grave's Disease", "CKD Stage 3", "Osteomyelitis", "MRSA", "Obesity"],
    notes: PATIENT_E_NOTES,
    insuranceNumber: "INS-112-445"
  }
];