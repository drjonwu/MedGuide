
import { GoogleGenAI } from "@google/genai";
import { RAGChunk, ChatMessage } from "../types";

const EMBEDDING_MODEL = "text-embedding-004";
const GENERATION_MODEL = "gemini-2.5-flash";

// Utility to prevent rate limiting
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ClinicalRAG {
  private chunks: RAGChunk[] = [];
  private ai: GoogleGenAI;
  private hasInitialized: boolean = false;
  private fullText: string;

  constructor(notes: string) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.fullText = notes;
    // Initialize chunks immediately
    this.chunks = this.createChunks(notes);
  }

  /**
   * Splits the raw notes into logical chunks.
   * Strategy: Split by double newlines to separate paragraphs/sections.
   */
  private createChunks(text: string): RAGChunk[] {
    const rawSegments = text.split(/\n\n+/);
    
    return rawSegments
      .map((segment, index) => ({
        id: `chunk_${index}`,
        text: segment.trim()
      }))
      .filter(chunk => chunk.text.length > 0);
  }

  /**
   * Generates an embedding for a text string.
   */
  private async embedText(text: string): Promise<number[]> {
    // FIX: Use 'contents' instead of 'content' to match SDK requirements
    // FIX: Using simple text string for contents is robust
    const result = await this.ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text 
    });
    return result.embedding?.values || [];
  }

  /**
   * Calculates Cosine Similarity between two vectors.
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Indexes chunks with rate limiting protections.
   */
  private async indexChunks() {
    if (this.hasInitialized) return;

    // Reduce batch size to 3 to be very safe against Rate Limits (429)
    const BATCH_SIZE = 3; 
    
    for (let i = 0; i < this.chunks.length; i += BATCH_SIZE) {
      const batch = this.chunks.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (chunk: any) => {
        try {
          // Skip if already embedded (idempotency)
          if (chunk._embedding) return;
          chunk._embedding = await this.embedText(chunk.text);
        } catch (e) {
          console.warn(`Failed to embed chunk ${chunk.id}`, e);
        }
      }));

      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < this.chunks.length) {
        await sleep(200);
      }
    }
    this.hasInitialized = true;
  }

  /**
   * Retrieves the top K most relevant chunks for a query.
   * Returns empty array if indexing fails, triggering fallback.
   */
  public async retrieveContext(query: string, topK: number = 3): Promise<RAGChunk[]> {
    try {
      // 1. Ensure Chunks are Indexed
      if (!this.hasInitialized) {
         await this.indexChunks();
      }

      // 2. Embed the Query
      const queryEmbedding = await this.embedText(query);

      // 3. Score Chunks
      const scoredChunks = this.chunks
        .filter((chunk: any) => chunk._embedding) // Only score chunks that successfully embedded
        .map((chunk: any) => {
          const similarity = this.cosineSimilarity(queryEmbedding, chunk._embedding);
          return { ...chunk, similarity };
        });

      // 4. Sort and Slice
      scoredChunks.sort((a, b) => b.similarity - a.similarity);
      return scoredChunks.slice(0, topK);

    } catch (error) {
      console.error("Retrieval failed:", error);
      // Return empty array to signal failure, triggering full-text fallback
      return [];
    }
  }

  /**
   * The main entry point: Answers a question using RAG.
   * Includes Fallback logic if RAG fails.
   */
  public async answerQuery(query: string): Promise<{ answer: string, context: RAGChunk[] }> {
    try {
      // 1. Attempt Retrieval
      let contextChunks = await this.retrieveContext(query);
      let contextText = "";
      
      // 2. FALLBACK LOGIC: If retrieval failed or returned nothing useful
      const isFallback = contextChunks.length === 0;

      if (isFallback) {
        console.warn("RAG retrieval yielded no results. Using Full-Context Fallback.");
        // Use the entire notes content (Gemini Flash has 1M context, so this is safe)
        contextText = this.fullText;
        // Clear contextChunks so UI doesn't show "Retrieved Context" (cleaner UX)
        contextChunks = []; 
      } else {
        contextText = contextChunks.map(c => `[Context ID: ${c.id}]\n${c.text}`).join("\n\n");
      }
      
      const systemInstruction = `
        You are MedGuide Copilot, a clinical assistant. 
        Answer the user's question based ONLY on the provided Context from the patient's medical records.
        
        Rules:
        1. If the answer is not in the context, say "I cannot find information about that in the records."
        2. Be concise, professional, and clinical.
        3. Do not make up dates or medications.
        4. Refer to the context implicitly.
      `;

      const prompt = `
        Context Information:
        ${contextText}

        User Question: ${query}
      `;

      // 3. Generate Answer
      const response = await this.ai.models.generateContent({
        model: GENERATION_MODEL,
        contents: prompt,
        config: { systemInstruction }
      });

      return {
        answer: response.text || "I was unable to generate a response.",
        context: contextChunks // Will be empty if fallback was used
      };

    } catch (error) {
      console.error("RAG Error:", error);
      throw error;
    }
  }
}
