import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).send('Invalid or missing script ID');
  }

  try {
    // Get script from storage
    const script = await storage.getScript(id);
    if (!script) {
      return res.status(404).send('Invalid or expired link!');
    }

    // Check User-Agent to allow only Roblox HTTP requests
    const userAgent = req.headers['user-agent'] || '';
    const isRoblox = userAgent.includes('Roblox') || userAgent.includes('HttpGet');
    
    if (!isRoblox) {
      return res.status(403).send('Access denied: This endpoint is for Roblox execution only.');
    }

    // Return script content as plain text
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(script.script);
  } catch (error) {
    console.error('Script retrieval error:', error);
    return res.status(500).send('Server error while retrieving script');
  }
}
