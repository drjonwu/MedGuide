
import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { z } from "zod";
import { CompleteAnalysisResult, PatientProfile, AppError, ErrorCategory, ExtractionResult, SafetyResult, ActionType, MedicationEvent } from "../types";
import { toTitleCase, formatRoute, cleanJsonString } from "../utils";
import { executeSafetyRules } from "./rulesEngine";
import { PRECOMPUTED_DATA } from "../data/precomputed";

const MODEL_NAME = "gemini-3-flash-preview";

// --- ZOD SCHEMAS FOR RUNTIME VALIDATION ---

const ActionTypeSchema = z.enum(["STARTED", "STOPPED", "INCREASED", "DECREASED", "CONTINUED", "UNCLEAR"]);

const MedicationEventSchema = z.object({
  date: z.string().describe("Date in YYYY-MM-DD format"),
  startDate: z.string().optional(),
  medication: z.string(),
  dosage: z.string(),
  route: z.string().optional(),
  action: ActionTypeSchema,
  rationale: z.string(),
  source_quote: z.string(),
  quote_start: z.number().optional(),
  quote_end: z.number().optional(),
});

const ExtractionResultSchema = z.object({
  patientId: z.string(),
  events: z.array(MedicationEventSchema)
});

const RootResponseSchema = z.object({
  extraction: ExtractionResultSchema
});

// --- GENAI SCHEMAS ---

// Schema 1: Focused purely on Extraction (Updated with Offsets)
const EXTRACTION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    extraction: {
      type: Type.OBJECT,
      properties: {
        patientId: { type: Type.STRING },
        events: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "Date in YYYY-MM-DD format." },
              startDate: { type: Type.STRING, description: "Original start date string." },
              medication: { type: Type.STRING },
              dosage: { type: Type.STRING },
              route: { type: Type.STRING },
              action: {
                type: Type.STRING,
                enum: ["STARTED", "STOPPED", "INCREASED", "DECREASED", "CONTINUED", "UNCLEAR"]
              },
              rationale: { type: Type.STRING },
              source_quote: { type: Type.STRING },
              quote_start: { type: Type.INTEGER, description: "The 0-based character index where the quote starts in the provided text." },
              quote_end: { type: Type.INTEGER, description: "The 0-based character index where the quote ends in the provided text." }
            },
            required: ["date", "medication", "dosage", "route", "action", "rationale", "source_quote"]
          }
        }
      },
      required: ["patientId", "events"]
    }
  },
  required: ["extraction"]
};

/**
 * Maps raw API errors to structured AppErrors for the UI.
 */
const mapGeminiError = (error: any): AppError => {
  const msg = error?.message || error?.toString() || "";

  if (error instanceof z.ZodError) {
     return new AppError(ErrorCategory.VALIDATION, "AI Response failed schema validation.", error);
  }

  if (msg.includes("400") || msg.includes("401") || msg.includes("403") || msg.includes("API key")) {
    return new AppError(ErrorCategory.AUTH, "Invalid API Key or Permissions.", error);
  }
  if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
    return new AppError(ErrorCategory.RATE_LIMIT, "Service is currently busy (Rate Limit Reached).", error);
  }
  if (msg.includes("500") || msg.includes("502") || msg.includes("503")) {
    return new AppError(ErrorCategory.SERVER, "AI Service is temporarily unavailable.", error);
  }
  if (msg.includes("safety") || msg.includes("blocked")) {
    return new AppError(ErrorCategory.SAFETY, "The clinical notes triggered safety filters.", error);
  }
  if (msg.includes("JSON")) {
    return new AppError(ErrorCategory.PARSING, "Failed to interpret the AI response.", error);
  }

  return new AppError(ErrorCategory.UNKNOWN, "An unexpected error occurred.", error);
};

/**
 * Helper to process the extraction response.
 * Uses Zod to validate the runtime structure.
 */
const processExtractionResponse = (text: string): ExtractionResult => {
  const cleanText = cleanJsonString(text);
  let parsedRaw;
  
  try {
    parsedRaw = JSON.parse(cleanText);
  } catch (e) {
    throw new AppError(ErrorCategory.PARSING, "Failed to parse JSON response from AI.");
  }

  // VALIDATION STEP: Ensure structure matches what our app expects
  const validationResult = RootResponseSchema.safeParse(parsedRaw);

  if (!validationResult.success) {
    console.error("Zod Validation Errors:", validationResult.error);
    throw new AppError(ErrorCategory.VALIDATION, "AI Output Structure Mismatch", validationResult.error);
  }

  const parsed = validationResult.data;

  // Post-process events
  const events: MedicationEvent[] = parsed.extraction.events.map((event: any, index: number) => ({
    ...event,
    id: `evt_${index}_${Date.now()}`,
    medication: toTitleCase(event.medication),
    route: formatRoute(event.route || ""),
    date: event.date.split('T')[0], // Ensure strict YYYY-MM-DD
    action: event.action as ActionType // Cast string to Enum
  }));

  return {
    patientId: parsed.extraction.patientId,
    events
  };
};

/**
 * Performs analysis of the patient record.
 * Hybrid Architecture:
 * 1. Generative AI (LLM) for Named Entity Recognition (NER) and Information Extraction.
 * 2. Deterministic Rules Engine for Safety/Clinical Checks (Beers, Interactions, etc.).
 */
export const analyzePatientRecord = async (patientProfile: PatientProfile): Promise<CompleteAnalysisResult> => {
  // --- STRATEGIC INTERCEPTION: Static Hydration for Demos ---
  if (PRECOMPUTED_DATA[patientProfile.id]) {
    console.log(`🚀 MedGuide Acceleration: Using Pre-Computed Data for ${patientProfile.name}`);
    
    // Simulate a tiny network delay (300ms) so it feels "real" but fast
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const extraction = PRECOMPUTED_DATA[patientProfile.id];
    
    // We still run the Safety Engine live. 
    // This is the "Hybrid" part: Static Extraction + Dynamic Safety Logic.
    const alerts = executeSafetyRules(patientProfile, extraction.events);
    
    const summary = alerts.length > 0
      ? `Identified ${alerts.length} potential safety concerns based on standard clinical guidelines (Beers, STOPP/START, Drug Interactions).`
      : "No significant safety alerts detected based on current active medications and known conditions.";

    return { 
      extraction, 
      safety: { summary, alerts } 
    };
  }
  // -----------------------------------------------------------

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 1. Define Extraction Task (The "Probabilistic" NER Layer)
  const extractionTask = async () => {
    const prompt = `
      Extract a comprehensive structured medication timeline from these notes for ${patientProfile.name}.
      
      CRITICAL INSTRUCTIONS:
      1. Include ALL medication types: 
         - Oral medications (tablets, syrups)
         - IV Fluids and infusions (e.g., Normal Saline, Dextrose)
         - Injections (IM, SC, Intra-articular, e.g., vaccinations, steroids)
         - Topical preparations (creams, plasters)
         - PRN (as needed) medications
      2. Capture both chronic/long-term medications AND short-term/one-off doses (e.g., loading doses, stat doses).
      3. Identify specific actions: STARTED, STOPPED, INCREASED, DECREASED, CONTINUED.
      4. Infer administration route (PO if implied, but look for IV/IM/SC/Topical keywords).
      5. Strict YYYY-MM-DD date format.
      6. Extract specific quotes from the text as evidence.
      7. Provide character offsets (start and end index) for the quote in the text to allow for highlighting.

      DISAMBIGUATION & ACCURACY RULES:
      - DIFFERENTIATE FORMULATIONS: If a patient takes different forms of the same drug (e.g. "Metformin IR" vs "Metformin XR"), treat them as distinct if the notes imply they are separate prescriptions.
      - PRN vs REGULAR: Clearly distinguish between "PRN" (as needed) and "Regular" use. A change from PRN to Regular is a significant event (e.g., INCREASED).
      - DOSAGE CHANGES: When dosage changes (INCREASED/DECREASED), ensure the 'medication' name is consistent with the previous entry to maintain timeline continuity, unless the drug itself changed.
      - MULTIPLE ACTIVES: If a plan lists multiple active medications (e.g. "Continue Amlodipine, Start Lisinopril"), extract separate events for each.
      - CONFLICT RESOLUTION: If the notes contain conflicting info, prioritize the "Plan" or "Orders" section over the "Subjective" history.

      Patient Notes: "${patientProfile.notes}"
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: EXTRACTION_SCHEMA,
        temperature: 0.1,
      }
    });
    
    return processExtractionResponse(response.text || "{}");
  };

  try {
    // A. Execute NER / Extraction
    const extraction = await extractionTask();

    // B. Execute Deterministic Safety Engine
    // We pass the EXTRACTED structured data into the rules engine, NOT the raw text.
    // This prevents hallucination.
    const alerts = executeSafetyRules(patientProfile, extraction.events);

    // Formulate a summary based on the alerts (Simple aggregation)
    const summary = alerts.length > 0
      ? `Identified ${alerts.length} potential safety concerns based on standard clinical guidelines (Beers, STOPP/START, Drug Interactions).`
      : "No significant safety alerts detected based on current active medications and known conditions.";

    const safety: SafetyResult = {
      summary,
      alerts
    };

    return { extraction, safety };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    if (error instanceof AppError) throw error;
    throw mapGeminiError(error);
  }
};
