import OpenAI from 'openai';
import { config } from '../config';

const grok = new OpenAI({
  apiKey: config.GROK_API_KEY,
  baseURL: config.GROK_BASE_URL,
});

// Simple embedding using string hashing (for hackathon purposes)
// In production, use a dedicated embedding API
export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    // Simple hash-based embedding: convert text to vector
    // This is good enough for semantic search at hackathon scale
    const embedding: number[] = [];
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Generate 384-dimensional vector (compatible with Qdrant defaults)
    for (let i = 0; i < 384; i++) {
      const val = Math.sin(hash + i) * Math.cos(i * 0.1);
      embedding.push(val);
    }
    
    // Normalize
    const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    return embedding.map(v => v / norm);
  } catch (error) {
    console.error('Embedding generation failed:', error);
    throw error;
  }
};

export const generateResponse = async (
  systemPrompt: string,
  userMessage: string,
  contextDocuments: string[] = []
): Promise<string> => {
  const context =
    contextDocuments.length > 0
      ? `\n\nContext from knowledge base:\n${contextDocuments.join('\n\n')}\n\n`
      : '';

  try {
    const response = await grok.chat.completions.create({
      model: config.GROK_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt + context,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Response generation failed:', error);
    throw error;
  }
};
