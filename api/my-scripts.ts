import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { ScriptWithLoadstring } from '@shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  try {
    // Get user's scripts
    const scripts = await storage.getUserScripts(userId);
    
    // Transform scripts to include loadstring and preview
    const baseUrl = req.headers.host?.includes('localhost') 
      ? `http://${req.headers.host}` 
      : `https://${req.headers.host}`;
    
    const scriptsWithLoadstring: ScriptWithLoadstring[] = scripts.map(script => ({
      ...script,
      loadstring: `loadstring(game:HttpGet("${baseUrl}/api/script?id=${script.id}"))()`,
      preview: script.script.length > 100 
        ? script.script.substring(0, 100) + '...' 
        : script.script
    }));

    return res.status(200).json(scriptsWithLoadstring);
  } catch (error) {
    console.error('Fetch scripts error:', error);
    return res.status(500).json({ error: 'Server error while fetching scripts' });
  }
}
