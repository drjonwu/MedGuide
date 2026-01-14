
export enum ActionType {
  STARTED = 'STARTED',
  STOPPED = 'STOPPED',
  INCREASED = 'INCREASED',
  DECREASED = 'DECREASED',
  CONTINUED = 'CONTINUED',
  UNCLEAR = 'UNCLEAR'
}

export interface MedicationEvent {
  id?: string; // Unique identifier for UI navigation
  date: string;
  startDate?: string; // Original start date of the medication if known
  medication: string;
  dosage: string;
  route?: string; // PO, IV, Topical, etc.
  action: ActionType;
  rationale: string;
  source_quote: string;
}

export interface SafetyAlert {
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  recommendation: string;
  citation?: string;
  citationUrl?: string;
}

export interface ExtractionResult {
  patientId: string;
  events: MedicationEvent[];
}

export interface SafetyResult {
  alerts: SafetyAlert[];
  summary: string;
}

export interface CompleteAnalysisResult {
  extraction: ExtractionResult;
  safety: SafetyResult;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  notes: string;
  insuranceNumber: string;
}

// RAG / Chat Types
export interface RAGChunk {
  id: string;
  text: string;
  similarity?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  context?: RAGChunk[]; // The sources used to generate this answer
  isThinking?: boolean;
}

export type ViewState = 'landing' | 'timeline' | 'history' | 'safety' | 'source' | 'chat';

// Error Handling Types
export enum ErrorCategory {
  AUTH = 'AUTH',          // API Key issues (400, 401, 403)
  RATE_LIMIT = 'RATE_LIMIT', // 429 Resource Exhausted
  SAFETY = 'SAFETY',      // Content blocked by filters
  SERVER = 'SERVER',      // 500, 502, 503
  PARSING = 'PARSING',    // Invalid JSON response
  UNKNOWN = 'UNKNOWN'     // Generic fallback
}

export class AppError extends Error {
  constructor(
    public category: ErrorCategory,
    public message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}
