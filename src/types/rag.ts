export interface Document {
  id: string;
  title: string;
  content: string;
  source: string;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  title: string;
  content: string;
  embedding?: number[]; // Vector embedding (e.g. 768 or 1536 float array)
  keywords?: string[];
  category?: string;
  created_at: string;
}

export interface Embedding {
  vector: number[];
  dimensions: number;
}

export interface RetrievedContext {
  chunk: DocumentChunk;
  similarityScore: number;
  relevanceExplanation?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  retrievedContexts?: RetrievedContext[];
  confidenceScore?: number;
  isStreaming?: boolean;
}

export interface RAGResponse {
  answer: string;
  retrievedContexts: RetrievedContext[];
  query: string;
  confidence: number;
}
