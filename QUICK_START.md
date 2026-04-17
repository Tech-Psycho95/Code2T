# ⚡ 30-Minute Quick Start

Get the agent running in 30 minutes flat. Follow this exact sequence.

---

## Minute 0-5: Environment Setup

```bash
cd HackBLR

# Copy environment file
cp .env.example .env

# Edit .env with your API keys (use your favorite editor)
# Minimally needed:
# - OPENAI_API_KEY=sk-...
# (Vapi is only needed if you're doing the full voice integration)

# Install dependencies
npm install
```

**Expected output:**
```
✓ added 150+ packages
```

---

## Minute 5-10: Start Qdrant

**Option A: Docker (If you have it)**
```bash
docker run -p 6333:6333 qdrant/qdrant:latest
```

**Option B: Skip Qdrant for now**
If you don't have Docker, you can still test the backend! The Qdrant client will fail gracefully, but you can test the REST endpoint with mock data.

**Expected output:**
```
Starting Qdrant server on 0.0.0.0:6333
```

---

## Minute 10-15: Seed Knowledge Base

```bash
npm run seed
```

**Expected output:**
```
🌱 Starting Qdrant seed...
📝 Seeding 7 documents...
→ Embedding: NullPointerException Solution
  ✓ Stored
... (7 documents total)

✅ Qdrant Seeding Complete
```

If Qdrant isn't running, you'll see an error—that's OK, continue anyway.

---

## Minute 15-20: Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
╔════════════════════════════════════════════════════════════╗
║   🎤 Voice-Native Developer Experience Agent              ║
║   Server running on http://localhost:3000                  ║
║   Ready for Vapi webhooks!                                ║
╚════════════════════════════════════════════════════════════╝
```

**Don't close this terminal!**

---

## Minute 20-25: Test the Agent

Open a **new terminal** and test:

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I fix a null pointer exception?"}'
```

**Expected response:**
```json
{
  "response": "A null pointer exception happens when...",
  "sources": [
    {
      "title": "NullPointerException Solution",
      "category": "error",
      "tags": ["null", "error", "debugging"]
    }
  ]
}
```

✅ **Agent is working!**

---

## Minute 25-30: Try More Queries

```bash
# Error explanation
curl -X POST http://localhost:3000/api/query \
  -d '{"query": "I keep getting CORS errors"}'

# Code navigation
curl -X POST http://localhost:3000/api/query \
  -d '{"query": "Explain how React hooks work"}'

# API docs
curl -X POST http://localhost:3000/api/query \
  -d '{"query": "How do I paginate API results?"}'
```

---

## 🎉 Done! You have a working Voice-Native Agent

Your next steps:

### If you want voice input (Vapi):
1. Get Vapi API key from https://dashboard.vapi.ai
2. Create an assistant in Vapi dashboard
3. Set webhook to: `http://localhost:3000/webhook/vapi`
4. Call the assistant and speak your question

### If you want to improve responses:
1. Edit system prompts in `src/services/processor.service.ts`
2. Add more documents to `scripts/seedQdrant.ts`
3. Run `npm run seed` again

### If you want to demo:
1. Use demo scenarios in `DEMO_SCENARIOS.md`
2. Test each scenario with REST endpoint
3. Record a video if Vapi integration isn't done

---

## Troubleshooting

**"Cannot find module..."**
→ Run `npm install` again

**"Qdrant connection failed"**
→ Make sure Docker is running (`docker run ...`)
→ Or skip it for now, use REST endpoint

**"OpenAI API error"**
→ Check your OPENAI_API_KEY in .env
→ Make sure it's correct (starts with `sk-`)

**"Response is slow"**
→ That's normal for first request (cold start)
→ Should be fast on subsequent requests

---

## What You Have Now

✅ Working backend on http://localhost:3000
✅ Vector search (Qdrant)
✅ LLM integration (OpenAI)
✅ Intent detection (error vs code vs API)
✅ Multi-turn conversation support
✅ Ready for Vapi webhook integration

---

## Next: Vapi Integration (5 more minutes)

1. Sign up at https://dashboard.vapi.ai
2. Create new assistant
3. Set webhook URL: `https://your-backend-url/webhook/vapi`
4. Click "Test Call"
5. Speak: "How do I fix a null pointer exception?"
6. Hear back: Clear explanation!

---

**That's it! You're ready to pitch or iterate.** 🚀

For detailed info, see:
- `README.md` — Full documentation
- `DEMO_SCENARIOS.md` — Demo scripts
- `HACKATHON_CHECKLIST.md` — What to do next
- `ADVANCED_INTEGRATION.md` — Advanced features
