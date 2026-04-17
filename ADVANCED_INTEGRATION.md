# Advanced: Vapi Integration Examples

This file shows different ways to integrate with Vapi for different use cases.

---

## 1. Webhook Mode (Recommended for Hackathon)

**How it works:**
1. User calls Vapi assistant
2. Vapi sends webhook to your backend with transcribed voice
3. Your backend processes and sends response back
4. Vapi converts response to speech

**Pros:** Simple, no SDK needed, works anywhere
**Cons:** Latency (network round trip)

Already implemented in `src/routes/webhook.ts`

---

## 2. Server-Sent Events (Real-time Streaming)

For lower latency, stream responses:

```typescript
// Advanced: Streaming responses (optional)
app.post('/webhook/vapi-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Start processing
  processDevQuery(query).then(result => {
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    res.end();
  });
});
```

---

## 3. Custom Vapi Integration with SDK

If you want to use Vapi SDK directly:

```bash
npm install @vapi/sdk
```

```typescript
import Vapi from '@vapi/sdk';

const vapi = new Vapi({
  apiKey: config.VAPI_API_KEY,
});

// Create call programmatically
const call = await vapi.calls.create({
  assistantId: 'your-assistant-id',
  customerId: 'user-123',
});
```

---

## 4. Multi-Turn Conversation Context

Keep conversation history for better context:

```typescript
interface ConversationContext {
  callId: string;
  history: { role: string; content: string }[];
  lastUpdate: number;
}

const conversationContexts = new Map<string, ConversationContext>();

// In webhook handler
const context = conversationContexts.get(callId);
if (!context) {
  conversationContexts.set(callId, {
    callId,
    history: [],
    lastUpdate: Date.now(),
  });
}

// Add new message to history
context.history.push({
  role: 'user',
  content: message.content,
});

// Pass to LLM with history for better responses
const response = await generateResponse(
  systemPrompt,
  message.content,
  contextDocuments,
  context.history  // Include history
);

context.history.push({
  role: 'assistant',
  content: response,
});
```

---

## 5. Advanced: Intent Classification

For better routing:

```typescript
enum UserIntent {
  ErrorExplanation = 'error_explanation',
  CodeNavigation = 'code_navigation',
  APIDocumentation = 'api_documentation',
  GeneralHelp = 'general_help',
  Greeting = 'greeting',
  Goodbye = 'goodbye',
}

async function classifyIntent(query: string): Promise<UserIntent> {
  const response = await generateResponse(
    `You are an intent classifier. Respond with ONLY one of: ${Object.values(UserIntent).join(', ')}`,
    query
  );
  
  return response.trim().toLowerCase() as UserIntent;
}
```

---

## 6. Smart Context Window

Limit context for faster responses:

```typescript
function selectBestDocs(docs: CodeDocument[], query: string): CodeDocument[] {
  // Sort by relevance score (if Qdrant provides scores)
  // Take only top 2 for faster response
  return docs.slice(0, 2);
}
```

---

## 7. Error Recovery

Graceful fallbacks:

```typescript
export async function processDevQuerySafely(
  request: ProcessingRequest
): Promise<ProcessingResult> {
  try {
    return await processDevQuery(request);
  } catch (error) {
    console.error('Primary processing failed:', error);
    
    // Fallback response
    return {
      response: "I'm having trouble processing that right now. Could you rephrase your question?",
      sourceDocs: [],
      queryEmbedding: [],
    };
  }
}
```

---

## 8. Metrics & Monitoring

Track performance:

```typescript
interface QueryMetrics {
  timestamp: number;
  queryLength: number;
  responseTime: number;
  sourcesFound: number;
  confidence: number;
}

const metrics: QueryMetrics[] = [];

const startTime = Date.now();
const result = await processDevQuery(request);
const responseTime = Date.now() - startTime;

metrics.push({
  timestamp: Date.now(),
  queryLength: request.userQuery.length,
  responseTime,
  sourcesFound: result.sourceDocs.length,
  confidence: result.sourceDocs[0]?.score || 0,
});

console.log(`Response generated in ${responseTime}ms`);
```

---

## 9. Custom System Prompts by User Type

Different prompts for different audiences:

```typescript
const SYSTEM_PROMPTS_BY_ROLE = {
  junior_dev: `You are a patient, encouraging mentor for junior developers...`,
  senior_dev: `You are a concise technical expert...`,
  non_native: `You are a clear educator using simple English...`,
};
```

---

## 10. Local Development with Mock Vapi

Test without Vapi API:

```typescript
// In development, mock Vapi responses
if (config.NODE_ENV === 'development') {
  app.post('/webhook/vapi', (req, res) => {
    // Simulate Vapi webhook with mock data
    const mockPayload = {
      message: {
        role: 'user',
        content: 'How do I fix a null pointer exception?',
      },
      call: {
        id: 'mock-call-' + Date.now(),
        status: 'active',
      },
    };
    
    // Process as normal
    processDevQuery(mockPayload.message.content);
  });
}
```

---

## Choosing Your Integration Path

| Approach | Complexity | Latency | When to Use |
|----------|-----------|---------|------------|
| Webhook (default) | Low | Medium | Most hackathons |
| Streaming SSE | Medium | Low | If latency matters |
| Vapi SDK | Medium | Low | If you need more control |
| Multi-turn | Medium | Same | For better context |
| Advanced routing | Medium | Same | For complex use cases |

**Recommendation for HackBLR:** Use webhook mode + multi-turn for best results with minimal complexity.

---

## Testing Your Integration

```bash
# Mock Vapi webhook
curl -X POST http://localhost:3000/webhook/vapi \
  -H "Content-Type: application/json" \
  -d '{
    "message": {"role": "user", "content": "explain async/await"},
    "call": {"id": "test-123", "status": "active"},
    "messages": []
  }'

# Check response time
time curl -X POST http://localhost:3000/api/query ...
```

---

## Troubleshooting

**Slow responses?**
- Reduce `limit` in `searchCodeContext()` (fewer embeddings to process)
- Use smaller `context` in LLM prompt
- Cache embeddings

**Wrong answers?**
- Improve system prompts
- Add more relevant docs to Qdrant
- Use better intent classification

**API errors?**
- Add retry logic with exponential backoff
- Log API responses for debugging
- Set up error alerting

---

Good luck! Choose the simplest approach that works for your needs. 🚀
