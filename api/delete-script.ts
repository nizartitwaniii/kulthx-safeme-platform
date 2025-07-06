import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { deleteScriptSchema } from '@shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const result = deleteScriptSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: result.error.errors 
      });
    }

    const { scriptId, userId } = result.data;

    // Delete script
    const success = await storage.deleteScript(scriptId, userId);
    
    if (!success) {
      return res.status(404).json({ 
        success: false,
        error: 'Script not found or unauthorized access' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Script deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete script error:', error);
    
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Server error while deleting script' 
    });
  }
}
