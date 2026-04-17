# 🚀 HackBLR Hackathon Checklist

Use this to track your progress and stay on timeline.

---

## Phase 1: Setup & Foundation (Target: Hour 0-4)

### Environment & Dependencies
- [ ] Node.js installed (v16+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with API keys
- [ ] All API keys validated (test API calls)

### Qdrant Setup
- [ ] Qdrant instance running locally or in cloud
- [ ] Qdrant health check passed (`curl http://localhost:6333/health`)
- [ ] Collection created and seeded (`npm run seed`)
- [ ] Sample documents visible in Qdrant

### Backend Server
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health check works (`GET /health`)
- [ ] Logs show startup banner

**Status:** ☐ Not Started ☐ In Progress ☐ Complete

---

## Phase 2: Core Features (Target: Hour 4-10)

### Error Explanation Feature
- [ ] System prompt configured in `processor.service.ts`
- [ ] Sample error documents in Qdrant
- [ ] REST endpoint returns error explanations
- [ ] Response is clear and concise

Test:
```bash
curl -X POST http://localhost:3000/api/query \
  -d '{"query": "null pointer exception"}'
```

### Code Navigation Feature
- [ ] Code samples in Qdrant with proper tags
- [ ] Intent detection working (`detectIntent()`)
- [ ] Response shows relevant code sections
- [ ] Voice-friendly output (short, clear)

Test via REST or manually check logs.

### API Documentation Feature
- [ ] API docs stored in Qdrant
- [ ] APIMentor system prompt tuned
- [ ] Example responses generated
- [ ] Includes code examples in response

**Status:** ☐ Not Started ☐ In Progress ☐ Complete

---

## Phase 3: Vapi Integration (Target: Hour 10-14)

### Webhook Setup
- [ ] Vapi assistant created in Vapi dashboard
- [ ] Webhook URL configured
- [ ] Webhook receives POST requests (logs confirm)
- [ ] Request parsing working

### Voice I/O
- [ ] Voice input transcribed correctly
- [ ] Response generated from transcription
- [ ] TTS output readable and clear
- [ ] End-to-end latency < 5 seconds

### Error Handling
- [ ] Graceful failures (no 500 errors)
- [ ] Timeouts handled
- [ ] Fallback responses if API calls fail
- [ ] Detailed error logs for debugging

**Status:** ☐ Not Started ☐ In Progress ☐ Complete

---

## Phase 4: Polish & Testing (Target: Hour 14-18)

### Prompt Engineering
- [ ] System prompts sound natural (not robotic)
- [ ] Responses are concise (< 30 seconds of speech)
- [ ] Intent detection is accurate
- [ ] Context retrieval is relevant

### Demo Quality
- [ ] All 3 scenarios work perfectly
- [ ] Response time is fast (<3 sec)
- [ ] Voice output is clear
- [ ] Demo script written and practiced

### Backup & Fallbacks
- [ ] REST endpoint working as fallback
- [ ] Demo video pre-recorded (in case Vapi fails)
- [ ] Offline mode (local Qdrant, no external APIs)
- [ ] Error scenarios handled gracefully

**Status:** ☐ Not Started ☐ In Progress ☐ Complete

---

## Phase 5: Pitch & Presentation (Target: Hour 18-22)

### Presentation Materials
- [ ] Pitch script finalized (2 min max)
- [ ] Architecture diagram explained
- [ ] Demo scenarios clearly scripted
- [ ] Slide deck prepared (if needed)

### Practice & Refinement
- [ ] Team practiced pitch together
- [ ] Timing is correct (< 2 minutes)
- [ ] Tech demo practiced (smooth transitions)
- [ ] Backup plan if tech fails

### Deployment
- [ ] Backend deployed (Vercel, Railway, etc.)
- [ ] Webhook URL uses deployed backend
- [ ] Qdrant accessible from deployed backend
- [ ] All endpoints work in production

**Status:** ☐ Not Started ☐ In Progress ☐ Complete

---

## Phase 6: Submission (Target: Hour 22-24)

- [ ] GitHub repo ready (clear README, good commits)
- [ ] Live demo URL or video ready
- [ ] Pitch deck submitted
- [ ] Code is clean and documented
- [ ] API keys removed (use .env.example)

**Status:** ☐ Ready ☐ Submitted

---

## Quick Reference

### Start Development
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Seed Qdrant (first time only)
npm run seed

# Terminal 3: Test REST endpoint
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test question"}'
```

### Key Files to Customize
- `src/services/processor.service.ts` — System prompts
- `scripts/seedQdrant.ts` — Knowledge base
- `src/routes/webhook.ts` — Add endpoints
- `.env` — Configuration

### Debugging
```bash
# Check Qdrant
curl http://localhost:6333/health

# Check backend
curl http://localhost:3000/health

# View logs
npm run dev  # Shows all logs in terminal

# Test OpenAI API
OPENAI_API_KEY=xxx node -e "require('openai').OpenAI(...)"
```

---

## Time Management Tips

⚡ **Hours 1-4:** Get infrastructure running (most important)
⚡ **Hours 4-10:** Implement core logic (proof of concept)
⚡ **Hours 10-14:** Add voice integration (impressive factor)
⚡ **Hours 14-18:** Polish and optimize
⚡ **Hours 18-24:** Pitch, demo, deployment

**Don't:** Spend too much time on UI, complexity, or features you won't demo
**Do:** Focus on one feature working perfectly over many features partially working

---

## Success Criteria for Judges

✅ **Problem:** Does it solve a real problem? (context switching, accessibility)
✅ **Demo:** Can you show it working live? (or pre-recorded backup)
✅ **Tech:** Is the tech stack appropriate? (Vapi + Qdrant makes sense)
✅ **Impact:** Could this scale? (Yes, works in any codebase)
✅ **Polish:** Does it feel like a real product? (clear voice, fast, reliable)

---

Good luck! Focus on impact over complexity. Judges love working demos and clear problem statements. 🎤🚀
