import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScriptSchema, updateScriptSchema, deleteScriptSchema, ScriptWithLoadstring } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Generate/Protect script endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const result = insertScriptSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: 'Invalid request data',
          details: result.error.errors 
        });
      }

      const { script, userId } = result.data;
      const createdScript = await storage.createScript({ script, userId });
      
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
      console.error('Generate script error:', error);
      
      if (error.message === 'This script is already protected!') {
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
        error: error.message || 'Server error while generating link.' 
      });
    }
  });

  // Script retrieval endpoint
  app.get("/api/script", async (req, res) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).send('Invalid or missing script ID');
    }

    try {
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

      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(script.script);
    } catch (error) {
      console.error('Script retrieval error:', error);
      return res.status(500).send('Server error while retrieving script');
    }
  });

  // Get user scripts (POST method for compatibility)
  app.post("/api/my-scripts-post", async (req, res) => {
    const { userId } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing user ID' });
    }

    try {
      const scripts = await storage.getUserScripts(userId);
      
      const baseUrl = req.headers.host?.includes('localhost') 
        ? `http://${req.headers.host}` 
        : `https://${req.headers.host}`;
      
      const scriptsWithLoadstring = scripts.map(script => ({
        id: script.id,
        script: script.script,
        createdAt: script.createdAt,
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
  });

  // Update/Delete script endpoints
  app.post("/api/my-scripts/:id", async (req, res) => {
    const { id } = req.params;
    const { script, userId } = req.body;
    
    if (!script || typeof script !== 'string' || script.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid or missing script content' });
    }
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing user ID' });
    }

    try {
      const success = await storage.updateScript(id, script, userId);
      
      if (!success) {
        return res.status(404).json({ error: 'Script not found or unauthorized access' });
      }

      return res.status(200).json({ message: 'Script updated successfully' });
    } catch (error: any) {
      console.error('Update script error:', error);
      return res.status(500).json({ error: error.message || 'Server error while updating script' });
    }
  });

  app.delete("/api/my-scripts/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing user ID' });
    }

    try {
      const success = await storage.deleteScript(id, userId);
      
      if (!success) {
        return res.status(404).json({ error: 'Script not found or unauthorized access' });
      }

      return res.status(200).json({ message: 'Script deleted successfully' });
    } catch (error: any) {
      console.error('Delete script error:', error);
      return res.status(500).json({ error: error.message || 'Server error while deleting script' });
    }
  });

  // Platform statistics endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error('Stats error:', error);
      return res.status(500).json({ 
        error: 'Server error while fetching statistics' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
