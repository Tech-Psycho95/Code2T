import { initQdrant, storeDocument, CodeDocument } from '../src/services/qdrant.service';
import { generateEmbedding } from '../src/services/openai.service';
import { config } from '../src/config';
import { QdrantClient } from '@qdrant/js-client-rest';

const SAMPLE_DOCUMENTS: CodeDocument[] = [
  {
    id: 'error-null-pointer',
    title: 'NullPointerException Solution',
    content: `NullPointerException occurs when you try to access a property or call a method on null/undefined.
Common causes: uninitialized variables, missing API responses, incorrect destructuring.
Solution: Add null checks before access. Use optional chaining (?.) or nullish coalescing (??).
Example: const value = user?.profile?.name ?? 'Unknown';`,
    category: 'error',
    language: 'javascript',
    tags: ['null', 'error', 'debugging', 'javascript'],
    timestamp: Date.now(),
  },
  {
    id: 'error-cors',
    title: 'CORS Error Explanation',
    content: `Cross-Origin Resource Sharing (CORS) error means your frontend and backend are on different domains.
This is a browser security feature preventing unauthorized requests.
Solution: Add CORS headers to your backend: app.use(cors()) or configure allowed origins.
Also ensure credentials are sent correctly: fetch(..., { credentials: 'include' })`,
    category: 'error',
    tags: ['cors', 'security', 'networking', 'browser'],
    timestamp: Date.now(),
  },
  {
    id: 'code-react-hooks',
    title: 'React Hooks Pattern',
    content: `React Hooks let you use state and effects in functional components.
Key hooks: useState (state), useEffect (side effects), useContext (global state).
Usage: const [count, setCount] = useState(0);
Rules: Only call hooks at top level, use custom hooks for reusable logic.
Dependencies array controls when effects run: [] = once, [dep] = when dep changes.`,
    category: 'code',
    language: 'javascript',
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    timestamp: Date.now(),
  },
  {
    id: 'code-async-await',
    title: 'Async/Await Pattern',
    content: `Async/await makes asynchronous code look synchronous and easier to understand.
Use async keyword before function, await inside to pause execution.
Error handling: wrap in try/catch or .catch() on the promise.
Example:
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
  } catch (error) {
    console.error(error);
  }
}`,
    category: 'code',
    language: 'javascript',
    tags: ['async', 'promises', 'javascript', 'patterns'],
    timestamp: Date.now(),
  },
  {
    id: 'api-rest-basics',
    title: 'REST API Design Basics',
    content: `REST APIs use HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove).
Status codes: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error).
Pagination: Use limit and offset parameters. Example: /api/users?limit=10&offset=20
Filtering: /api/users?name=John&active=true
Always version your API: /api/v1/users`,
    category: 'api',
    tags: ['rest', 'api', 'http', 'design'],
    timestamp: Date.now(),
  },
  {
    id: 'api-authentication',
    title: 'API Authentication Methods',
    content: `Common auth patterns:
1. API Keys: Simple but less secure. Pass in header: Authorization: Bearer YOUR_KEY
2. OAuth2: Industry standard for delegated access.
3. JWT (JSON Web Tokens): Stateless auth. Token contains encoded user info.
4. Session/Cookie: Server-side state (traditional).
For APIs, prefer Bearer tokens over sessions. Always use HTTPS.`,
    category: 'api',
    tags: ['authentication', 'security', 'api'],
    timestamp: Date.now(),
  },
  {
    id: 'guide-debugging',
    title: 'Debugging Workflow',
    content: `Effective debugging steps:
1. Reproduce: Confirm the bug consistently.
2. Isolate: Narrow down to the specific code causing it.
3. Hypothesis: What do you think is wrong?
4. Test: Add console.logs, use debugger, check variable states.
5. Fix: Change the code and re-test.
Tools: Browser DevTools, VS Code debugger, Network tab (for API issues).`,
    category: 'guide',
    tags: ['debugging', 'troubleshooting', 'tools'],
    timestamp: Date.now(),
  },
];

const initializeCollection = async (client: QdrantClient) => {
  try {
    // Try to delete existing collection (ignore errors)
    try {
      await client.deleteCollection(config.QDRANT_COLLECTION);
      console.log(`Deleted existing collection: ${config.QDRANT_COLLECTION}`);
    } catch (e) {
      // Collection might not exist, that's OK
    }

    // Create new collection
    await client.createCollection(config.QDRANT_COLLECTION, {
      vectors: {
        size: 1536, // text-embedding-3-small dimension
        distance: 'Cosine',
      },
    });

    console.log(`✓ Created collection: ${config.QDRANT_COLLECTION}`);
  } catch (error) {
    console.error('Failed to initialize collection:', error);
    throw error;
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting Qdrant seed...\n');

    // Initialize Qdrant
    const client = await initQdrant();

    // Initialize collection
    await initializeCollection(client);

    // Seed documents
    console.log(`📝 Seeding ${SAMPLE_DOCUMENTS.length} documents...\n`);

    for (const doc of SAMPLE_DOCUMENTS) {
      try {
        console.log(`  → Embedding: ${doc.title}`);
        const embedding = await generateEmbedding(doc.content);

        await storeDocument(doc, embedding);
        console.log(`    ✓ Stored`);
      } catch (error) {
        console.error(`    ✗ Failed to seed ${doc.title}:`, error);
      }
    }

    console.log(`
╔════════════════════════════════════════════════════════════╗
║   ✅ Qdrant Seeding Complete                              ║
║                                                            ║
║   Collection: ${config.QDRANT_COLLECTION}                 ║
║   Documents: ${SAMPLE_DOCUMENTS.length}                    ║
║   Embeddings: text-embedding-3-small (1536 dims)          ║
║                                                            ║
║   Ready to start the server: npm run dev                  ║
╚════════════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
