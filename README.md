# Skydot 2.0 — AI backend fixed

This version fixes the main problem where Talk to Sky showed:
"Sky couldn't reach the AI layer right now."

## Files
- `index.html` — frontend
- `api/chat.js` — secure Vercel serverless backend

## Required Vercel setup
1. Deploy this folder/repository to Vercel.
2. Open Vercel → Project → Settings → Environment Variables.
3. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
   - Environment: Production (and Preview if desired)
4. Redeploy.

The API key is server-side only. Do NOT put the key inside `index.html`.

## Important
Without `ANTHROPIC_API_KEY`, the app cannot generate real AI answers to arbitrary questions.
A local greeting fallback is included, so "hello"/"hi"/"namaste" gets a response even before the backend key is configured.
