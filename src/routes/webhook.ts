import { Router, Request, Response } from 'express';
import {
  parseVapiWebhook,
  sendVapiResponse,
} from '../services/vapi.service';
import { processDevQuery } from '../services/processor.service';

const router = Router();

/**
 * POST /webhook/vapi
 * Receives voice input from Vapi, processes it, and sends response
 */
router.post('/webhook/vapi', async (req: Request, res: Response) => {
  try {
    const payload = parseVapiWebhook(req.body);
    const { call, message, messages } = payload;

    console.log(`\n📞 Incoming Vapi Call: ${call.id}`);
    console.log(`   Status: ${call.status}`);
    console.log(`   Message: ${message.content}`);

    // Return 200 immediately to acknowledge webhook
    res.status(200).json({ success: true });

    // Process the query asynchronously
    if (message.content && message.role === 'user') {
      const result = await processDevQuery({
        userQuery: message.content,
        callId: call.id,
        conversationHistory: messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => `${m.role}: ${m.content}`),
      });

      console.log(`\n🤖 Generated Response:`);
      console.log(`   ${result.response}`);
      console.log(`   Sources: ${result.sourceDocs.length} documents found`);

      // Send response back to Vapi
      await sendVapiResponse(call.id, result.response);
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/query
 * REST endpoint for testing the agent without Vapi
 */
router.post('/api/query', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await processDevQuery({
      userQuery: query,
      callId: 'test-' + Date.now(),
    });

    res.json({
      response: result.response,
      sources: result.sourceDocs.map((doc) => ({
        title: doc.title,
        category: doc.category,
        tags: doc.tags,
      })),
    });
  } catch (error) {
    console.error('Query processing error:', error);
    res.status(500).json({
      error: 'Failed to process query',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;
