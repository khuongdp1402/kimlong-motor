// Vercel Function entry point: wraps the existing Express app so every
// /api/* route runs as a single serverless function in production, without
// changing any route logic. Local dev is unaffected — `npm run dev:all`
// still runs server/index.js directly as a long-lived process on PORT via
// `npm run server`; this file is only used by Vercel's build/runtime.
import app from '../server/index.js';

export default app;
