# MedGuide: Clinical Decision Support & RAG Engine

**Live Prototype:** https://medguide-jonwu.vercel.app/

### Physician-Builder Context
**MedGuide Purpose and Use Case**
MedGuide serves as an advanced Clinical Decision Support (CDS) tool designed to assist healthcare professionals in processing complex, unstructured patient history. Its primary use case is transforming free-text clinical progress notes—which are often lengthy, disjointed, and difficult to parse quickly—into structured, auditable data. By automating the extraction of medication timelines and performing real-time safety analyses, the application aims to significantly reduce the cognitive load on clinicians during pre-consultation reviews. It is particularly targeted at preventing medication errors and ensuring adherence to clinical guidelines (such as the Beers Criteria for geriatrics) by flagging potential risks that might be missed during a manual review.

**Current Functionality**
The application offers a rich interactive dashboard with four primary views. 
* The Source Evidence contains the patient's raw clinical notes in plaintext format.
* The Medication Timeline visualizes the patient's journey chronologically, distinguishing between started, stopped, changed, and continued medications. 
* The Medication History view groups events by drug name, allowing doctors to track dosage evolution over time. 
* The Safety Analysis panel provides risk-stratified alerts (High/Medium/Low) regarding drug interactions and contraindications, complete with actionable recommendations and verified external citations. Crucially, the application features a robust "human-in-the-loop" verification system; clicking on any event opens an Event Modal that uses fuzzy search algorithms to locate and highlight the exact text in the original notes that generated the insight, ensuring full auditability.

### Architecture
* **Frontend:** React 19, TypeScript, Tailwind CSS
* **AI Orchestration:** Google Gemini 2.5 Flash (via Google GenAI SDK)
* **Safety Layer:**
    * **NER Extraction:** Parses unstructured notes into structured JSON.
    * **Deterministic Rules Engine:** A hard-coded logic layer (TypeScript) that checks extracted data against **Beers Criteria** and **STOPP/START** guidelines.
    * **RAG:** Vector similarity search (Cosine) for "Source Evidence" grounding.

### Safety & Compliance
* **No PHI:** This demo runs entirely on synthetic, de-identified datasets.
* **Hallucination Control:** The "Safety Analysis" runs on a separate logic track from the generation layer.

### Quick Start
1. Clone repo
2. `npm install`
3. Create `.env` with `GEMINI_API_KEY`
4. `npm run dev`
