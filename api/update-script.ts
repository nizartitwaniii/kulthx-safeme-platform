import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { updateScriptSchema } from '@shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const result = updateScriptSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: result.error.errors 
      });
    }

    const { scriptId, script, userId } = result.data;

    // Update script
    const success = await storage.updateScript(scriptId, script, userId);
    
    if (!success) {
      return res.status(404).json({ 
        success: false,
        error: 'Script not found or unauthorized access' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Script updated successfully'
    });
  } catch (error: any) {
    console.error('Update script error:', error);
    
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Server error while updating script' 
    });
  }
}
