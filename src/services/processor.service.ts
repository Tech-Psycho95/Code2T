import {
  searchCodeContext,
  CodeDocument,
} from './qdrant.service';
import {
  generateEmbedding,
  generateResponse,
} from './openai.service';

export interface ProcessingRequest {
  userQuery: string;
  callId: string;
  conversationHistory?: string[];
}

export interface ProcessingResult {
  response: string;
  sourceDocs: CodeDocument[];
  queryEmbedding: number[];
}

const SYSTEM_PROMPTS = {
  errorExplainer: `You are a friendly developer assistant specialized in explaining errors and bugs.
When a developer mentions an error, provide:
1. A clear explanation of what went wrong
2. Possible causes
3. A concrete fix or next steps

Keep responses concise and voice-friendly (2-3 sentences max for voice output).`,

  codeNavigator: `You are an expert code guide. You help developers understand how code works.
When asked about code structure, provide:
1. Simple overview of the relevant code
2. Key functions/classes involved
3. How to navigate to relevant parts

Be conversational and helpful.`,

  apiMentor: `You are an API documentation expert.
When developers ask about APIs, provide:
1. Simple explanation of what the API does
2. Basic usage example
3. Important parameters or gotchas

Format responses for voice - clear and concise.`,

  general: `You are a helpful developer assistant with access to the project's codebase and documentation.
Answer questions clearly and concisely. Reference specific parts of the code when relevant.
Keep responses brief and actionable.`,
};

export const processDevQuery = async (
  request: ProcessingRequest
): Promise<ProcessingResult> => {
  const { userQuery } = request;

  // 1. Generate embedding for the query
  const queryEmbedding = await generateEmbedding(userQuery);

  // 2. Search Qdrant for relevant context
  const relevantDocs = await searchCodeContext(queryEmbedding, 3);

  // 3. Determine intent and select appropriate system prompt
  const intent = detectIntent(userQuery);
  const systemPrompt = SYSTEM_PROMPTS[intent] || SYSTEM_PROMPTS.general;

  // 4. Format context from retrieved documents
  const contextDocuments = relevantDocs.map((doc) => {
    return `[${doc.category.toUpperCase()}: ${doc.title}]\n${doc.content}`;
  });

  // 5. Generate response using LLM with context
  const response = await generateResponse(
    systemPrompt,
    userQuery,
    contextDocuments
  );

  return {
    response,
    sourceDocs: relevantDocs,
    queryEmbedding,
  };
};

const detectIntent = (
  query: string
): keyof typeof SYSTEM_PROMPTS => {
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes('error') ||
    lowerQuery.includes('exception') ||
    lowerQuery.includes('bug') ||
    lowerQuery.includes('crash')
  ) {
    return 'errorExplainer';
  }

  if (
    lowerQuery.includes('code') ||
    lowerQuery.includes('function') ||
    lowerQuery.includes('class') ||
    lowerQuery.includes('how does')
  ) {
    return 'codeNavigator';
  }

  if (
    lowerQuery.includes('api') ||
    lowerQuery.includes('endpoint') ||
    lowerQuery.includes('documentation')
  ) {
    return 'apiMentor';
  }

  return 'general';
};
