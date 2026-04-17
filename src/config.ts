import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  VAPI_API_KEY: process.env.VAPI_API_KEY || '',
  QDRANT_URL: process.env.QDRANT_URL || 'http://localhost:6333',
  QDRANT_API_KEY: process.env.QDRANT_API_KEY || '',
  GROK_API_KEY: process.env.GROK_API_KEY || '',
  GROK_BASE_URL: process.env.GROK_BASE_URL || 'https://api.x.ai/v1',
  GROK_MODEL: process.env.GROK_MODEL || 'grok-2',
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || 'voyage-3-small',
  QDRANT_COLLECTION: process.env.QDRANT_COLLECTION || 'code-knowledge',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
