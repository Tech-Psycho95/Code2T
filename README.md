# 🎤 Voice-Native Developer Experience Agent

A hackathon-ready voice-first agent that helps developers understand code, debug errors, and navigate APIs—all through natural conversation.

**Tech Stack:** Vapi (voice) + Qdrant (vector search) + OpenAI + Express + TypeScript

---

## Quick Start (5 minutes)

### 1. **Setup Environment**

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Fill in your API keys in .env
# - VAPI_API_KEY (from https://dashboard.vapi.ai)
# - OPENAI_API_KEY (from https://platform.openai.com/api-keys)
```

### 2. **Start Qdrant** (Vector Database)

**Option A: Docker (Recommended)**
```bash
docker run -p 6333:6333 qdrant/qdrant:latest
```

**Option B: Local (Download from https://qdrant.tech/download/)**
```bash
./qdrant
```

Then seed the knowledge base:
```bash
npm run seed
```

### 3. **Start the Backend**

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║   🎤 Voice-Native Developer Experience Agent              ║
║   Server running on http://localhost:3000                  ║
║   Ready for Vapi webhooks!                                ║
╚════════════════════════════════════════════════════════════╝
```

### 4. **Test Without Vapi** (REST Endpoint)

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I fix a null pointer exception?"}'
```

Response:
```json
{
  "response": "A null pointer exception happens when you try to access a property on something that's null or undefined...",
  "sources": [
    {
      "title": "NullPointerException Solution",
      "category": "error",
      "tags": ["null", "error", "debugging"]
    }
  ]
}
```

---

## Integration with Vapi

### 1. Create a Vapi Assistant

```json
{
  "name": "Developer Agent",
  "model": {
    "provider": "openai",
    "model": "gpt-4-turbo-preview"
  },
  "voice": {
    "provider": "openai",
    "voiceId": "nova"
  },
  "webhookUrl": "https://your-backend.com/webhook/vapi"
}
```

### 2. Setup Webhook

Configure your backend URL in Vapi:
```
https://your-backend.com/webhook/vapi
```

The webhook receives voice input → Backend processes → Response sent back to Vapi TTS.

---

## Project Structure

```
voice-dev-agent/
├── src/
│   ├── index.ts              # Main server entry
│   ├── config.ts             # Configuration
│   ├── services/
│   │   ├── qdrant.service.ts     # Vector search
│   │   ├── openai.service.ts     # LLM & embeddings
│   │   ├── vapi.service.ts       # Voice integration
│   │   └── processor.service.ts  # Query orchestration
│   └── routes/
│       └── webhook.ts        # Vapi & REST endpoints
├── scripts/
│   └── seedQdrant.ts         # Populate knowledge base
├── data/
│   └── (sample docs)
├── package.json
├── tsconfig.json
└── .env
```

---

## Key Features

### 🎯 Feature 1: Error Explanation
```
User: "I'm getting a null pointer exception on line 42"
Agent: Searches for similar errors → Explains the cause → Suggests fix
```

### 🗺️ Feature 2: Code Navigation
```
User: "How does authentication work in this codebase?"
Agent: Finds relevant code → Explains structure and flow
```

### 📚 Feature 3: API Documentation
```
User: "How do I paginate results with the REST API?"
Agent: Retrieves API docs → Generates example → Reads it aloud
```

---

## Adding More Knowledge

Edit `scripts/seedQdrant.ts`:

```typescript
const SAMPLE_DOCUMENTS: CodeDocument[] = [
  {
    id: 'your-unique-id',
    title: 'Your Topic',
    content: 'Detailed explanation here...',
    category: 'error' | 'code' | 'api' | 'guide',
    tags: ['tag1', 'tag2'],
    timestamp: Date.now(),
  },
  // Add more...
];
```

Then:
```bash
npm run seed
```

---

## Architecture

```
┌──────────────────┐
│  Vapi (Voice)    │ ◄── User speaks
└────────┬─────────┘
         │
         ▼ HTTP POST
    ┌─────────────┐
    │  Backend    │
    │  (Express)  │
    └──┬──────────┘
       │
       ├─→ Generate embedding (OpenAI)
       │
       ├─→ Search vectors (Qdrant)
       │
       ├─→ Generate response (OpenAI)
       │
       └─→ Send back to Vapi TTS
```

---

## Debugging

### Check if Qdrant is running:
```bash
curl http://localhost:6333/health
```

### View logs:
```bash
npm run dev
# Logs show incoming Vapi calls and generated responses
```

### Test a query:
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "explain async/await"}'
```

---

## Deployment

### Deploy to Vercel (Serverless)
```bash
npm run build
vercel deploy
```

### Deploy to Railway / Heroku
```bash
git push heroku main
```

**Note:** Serverless functions have timeout limits. For Vapi webhooks, queue responses instead of responding inline.

---

## Support

- **Vapi Docs:** https://docs.vapi.ai
- **Qdrant Docs:** https://qdrant.tech/documentation
- **OpenAI Docs:** https://platform.openai.com/docs

                                                      Built with 💖 by Shivam
