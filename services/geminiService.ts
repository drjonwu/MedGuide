
import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { CompleteAnalysisResult, PatientProfile, AppError, ErrorCategory, ExtractionResult, SafetyResult } from "../types";
import { toTitleCase, formatRoute, cleanJsonString } from "../utils";
import { executeSafetyRules } from "./rulesEngine";

const MODEL_NAME = "gemini-2.5-flash";

// --- SCHEMAS ---

// Schema 1: Focused purely on Extraction
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
              source_quote: { type: Type.STRING }
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
 */
const processExtractionResponse = (text: string): ExtractionResult => {
  const cleanText = cleanJsonString(text);
  const parsed = JSON.parse(cleanText);
  
  if (!parsed.extraction || !parsed.extraction.events) {
    throw new Error("Invalid extraction structure");
  }

  // Post-process events
  parsed.extraction.events = parsed.extraction.events.map((event: any, index: number) => ({
    ...event,
    id: `evt_${index}_${Date.now()}`,
    medication: toTitleCase(event.medication),
    route: formatRoute(event.route || ""),
    date: event.date.split('T')[0] // Ensure strict YYYY-MM-DD
  }));

  return parsed.extraction;
};

/**
 * Performs analysis of the patient record.
 * Hybrid Architecture:
 * 1. Generative AI (LLM) for Named Entity Recognition (NER) and Information Extraction.
 * 2. Deterministic Rules Engine for Safety/Clinical Checks (Beers, Interactions, etc.).
 */
export const analyzePatientRecord = async (patientProfile: PatientProfile): Promise<CompleteAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 1. Define Extraction Task (The "Probabilistic" NER Layer)
  const extractionTask = async () => {
    const prompt = `
      Extract a structured medication timeline from these notes for ${patientProfile.name}.
      - Identify starts, stops, changes, and continuations.
      - Infer administration route (PO if implied).
      - Strict YYYY-MM-DD date format.
      - Extract specific quotes from the text as evidence.
      
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
