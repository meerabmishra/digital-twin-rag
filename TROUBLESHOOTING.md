# Troubleshooting Guide

## Common Errors and Solutions

### Error: "Cannot connect to ChromaDB"

**Solution:**
1. Make sure Docker is installed and running
2. Start ChromaDB in a separate terminal:
   ```bash
   docker run -p 8000:8000 chromadb/chroma
   ```
3. Keep that terminal window open
4. Refresh your browser

### Error: "OPENAI_API_KEY is not set"

**Solution:**
1. Check your `.env.local` file exists in the project root
2. Verify it contains:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. Make sure there are no spaces around the `=` sign
4. Restart the dev server (`npm run dev`)

### Error: "Failed to initialize vector database"

**Possible causes:**
- ChromaDB is not running → Start Docker container
- Port 8000 is blocked → Check firewall settings
- Network issue → Try restarting Docker

### Error: Network or Fetch Failed

**Solution:**
1. Make sure dev server is running on port 3000
2. Check browser console for detailed error
3. Verify `.env.local` file is in the correct location

### Port 3000 Already in Use

**Solution:**
```bash
npm run dev -- -p 3001
```
Then access at http://localhost:3001

## Quick Checklist

Before clicking "Start Chat":

- [ ] Docker is installed
- [ ] ChromaDB container is running: `docker ps` should show chromadb
- [ ] `.env.local` file exists with valid `OPENAI_API_KEY`
- [ ] Dev server is running: `npm run dev`
- [ ] Browser console shows no errors (F12 → Console tab)

## Testing ChromaDB Connection

Open a new terminal and test:
```bash
curl http://localhost:8000/api/v1/heartbeat
```

Should return: `{"nanosecond heartbeat":...}`

If not, ChromaDB is not running properly.

## Testing OpenAI API Key

Create a test file `test-openai.js`:
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'YOUR_API_KEY_HERE'
});

const test = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "test",
});

console.log('Success!', test.data[0].embedding.length);
```

## Still Having Issues?

1. Check the browser console (F12) for error messages
2. Check the terminal where `npm run dev` is running
3. Make sure you have credits in your OpenAI account
4. Try restarting everything:
   - Stop dev server (Ctrl+C)
   - Stop ChromaDB (Ctrl+C in that terminal)
   - Start ChromaDB again
   - Start dev server again
