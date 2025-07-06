import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertScriptSchema } from '@shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const result = insertScriptSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: result.error.errors 
      });
    }

    const { script, userId } = result.data;

    // Create protected script
    const createdScript = await storage.createScript({ script, userId });
    
    // Generate loadstring
    const baseUrl = req.headers.host?.includes('localhost') 
      ? `http://${req.headers.host}` 
      : `https://${req.headers.host}`;
    const loadstring = `loadstring(game:HttpGet("${baseUrl}/api/script?id=${createdScript.id}"))()`;

    return res.status(200).json({
      success: true,
      loadstring,
      scriptId: createdScript.id
    });
  } catch (error: any) {
    console.error('Protect script error:', error);
    
    if (error.message === 'This script is already protected!') {
      // Find existing script and return its loadstring
      try {
        const userScripts = await storage.getUserScripts(req.body.userId);
        const normalizedScript = req.body.script.trim().replace(/\s+/g, " ");
        const existingScript = userScripts.find(s => 
          s.script.trim().replace(/\s+/g, " ") === normalizedScript
        );
        
        if (existingScript) {
          const baseUrl = req.headers.host?.includes('localhost') 
            ? `http://${req.headers.host}` 
            : `https://${req.headers.host}`;
          const loadstring = `loadstring(game:HttpGet("${baseUrl}/api/script?id=${existingScript.id}"))()`;
          
          return res.status(400).json({
            success: false,
            error: 'This script is already protected!',
            loadstring,
            scriptId: existingScript.id
          });
        }
      } catch (e) {
        // Fall through to generic error
      }
    }

    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to protect script' 
    });
  }
}
