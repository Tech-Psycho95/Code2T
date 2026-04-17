import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config';

let qdrantClient: QdrantClient | null = null;

export const initQdrant = async () => {
  try {
    qdrantClient = new QdrantClient({
      url: config.QDRANT_URL,
      apiKey: config.QDRANT_API_KEY || undefined,
    });

    console.log('✓ Qdrant connected');
    return qdrantClient;
  } catch (error) {
    console.error('✗ Qdrant connection failed:', error);
    throw error;
  }
};

export const getQdrantClient = (): QdrantClient => {
  if (!qdrantClient) {
    throw new Error('Qdrant not initialized. Call initQdrant() first.');
  }
  return qdrantClient;
};

export interface CodeDocument {
  id: string;
  title: string;
  content: string;
  category: 'error' | 'code' | 'api' | 'guide';
  language?: string;
  tags: string[];
  timestamp: number;
}

export const searchCodeContext = async (
  queryEmbedding: number[],
  limit: number = 3
): Promise<CodeDocument[]> => {
  const client = getQdrantClient();

  try {
    const results = await client.search(config.QDRANT_COLLECTION, {
      vector: queryEmbedding,
      limit,
      with_payload: true,
      score_threshold: 0.6,
    });

    return results.map((result) => result.payload as unknown as CodeDocument);
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};

export const storeDocument = async (
  doc: CodeDocument,
  embedding: number[]
): Promise<void> => {
  const client = getQdrantClient();

  try {
    await client.upsert(config.QDRANT_COLLECTION, {
      points: [
        {
          id: doc.id.split('-').reduce((acc, part) => acc + part.charCodeAt(0), 0),
          vector: embedding,
          payload: doc as unknown as Record<string, unknown>,
        },
      ],
    });
  } catch (error) {
    console.error('Document storage failed:', error);
    throw error;
  }
};
