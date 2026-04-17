# Demo Scenarios for Voice-Native Developer Agent

Use these to test your agent before the pitch. Test both via REST and Vapi webhook.

---

## Scenario 1: Error Explanation (Demo Feature #1)

**User Input (via voice or text):**
> "I keep getting a null pointer exception when I try to access user.profile.name. What's going on?"

**Expected Response:**
- Recognizes it's an error question
- Retrieves "NullPointerException Solution" from Qdrant
- Explains the issue clearly
- Suggests the fix: optional chaining or null checks

**What judges see:**
✅ Agent understands the problem
✅ Provides accurate technical solution
✅ Uses voice conversationally (not robotic)

---

## Scenario 2: Code Navigation (Demo Feature #2)

**User Input:**
> "Can you explain how authentication works in this codebase?"

**Expected Response:**
- Detects it's asking about code structure
- Retrieves async/await, authentication, or related patterns
- Explains the flow: login → JWT → protected routes
- References specific code sections

**What judges see:**
✅ Agent understands code architecture
✅ Explains without overwhelming detail
✅ Hands-free code exploration 🎯

---

## Scenario 3: API Documentation (Demo Feature #3)

**User Input:**
> "How do I paginate API results? Show me an example."

**Expected Response:**
- Detects it's asking about API usage
- Retrieves REST API documentation
- Explains limit/offset parameters
- Provides code example

**What judges see:**
✅ Agent serves as documentation assistant
✅ Saves developers from breaking flow
✅ Accessible learning (important for diverse teams)

---

## Scenario 4: Async/Await (Bonus)

**User Input:**
> "Explain async/await to me"

**Expected Response:**
- Identifies learning request
- Retrieves async/await documentation
- Explains syntax + use cases
- Gives code example

---

## Testing Checklist

### ✓ Before Demo

- [ ] Backend running on http://localhost:3000
- [ ] Qdrant seeded with sample documents
- [ ] Test REST endpoint: `curl -X POST http://localhost:3000/api/query ...`
- [ ] All scenarios return relevant responses
- [ ] Response time < 5 seconds
- [ ] No API key errors

### ✓ Demo Day

- [ ] Vapi webhook configured
- [ ] Voice works end-to-end
- [ ] Responses are clear and concise (< 30 seconds of speech)
- [ ] Fallback plans if API fails (pre-recorded demo)
- [ ] Backup: Test via REST if Vapi has issues

---

## REST Testing Script

```bash
# Test error explanation
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "I am getting a null pointer exception on line 42. Help!"}'

# Test code navigation
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How does authentication work in this code?"}'

# Test API docs
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I paginate results with the REST API?"}'

# Test async/await
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain async and await to me"}'
```

---

## Judges Love...

✨ **Real Problems:** Error debugging, code exploration, API guidance
✨ **Voice is Key:** Show that hands-free is actually useful
✨ **Speed:** Quick, accurate responses (not 30-second delays)
✨ **Polish:** Clear system prompts, good voice quality
✨ **Scope:** Why this matters (productivity, accessibility, onboarding)

---

## Fallback Demo (If APIs Fail)

Pre-record a video showing:
1. User asks a question (via voice input)
2. Agent processes and responds (via TTS)
3. Text shows up on screen with sources

This gives judges the full experience without live API risk.

---

## Tips for Great Demo

1. **Start simple:** Error explanation is most relatable
2. **Show sources:** Highlight which docs the agent used
3. **Explain the tech:** "We're using Qdrant for semantic search..."
4. **End with impact:** "Imagine this in every IDE"
5. **Have backup:** If Vapi fails, use REST endpoint demo

Good luck! 🚀
