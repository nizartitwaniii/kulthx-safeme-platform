import { Script, InsertScript, type PlatformStats } from "@shared/schema";
import { promises as fs } from "fs";
import { join } from "path";
import crypto from "crypto";

export interface IStorage {
  getScript(id: string): Promise<Script | undefined>;
  getUserScripts(userId: string): Promise<Script[]>;
  createScript(script: InsertScript): Promise<Script>;
  updateScript(id: string, script: string, userId: string): Promise<boolean>;
  deleteScript(id: string, userId: string): Promise<boolean>;
  getStats(): Promise<PlatformStats>;
  getAllScripts(): Promise<Script[]>;
}

export class FileStorage implements IStorage {
  private scriptsFile = join(process.cwd(), "data", "scripts.json");
  private cache: Map<string, Script> = new Map();
  private lastLoad = 0;
  private cacheTimeout = 30000; // 30 seconds

  private async ensureDataDir(): Promise<void> {
    const dataDir = join(process.cwd(), "data");
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  private async loadScripts(): Promise<Map<string, Script>> {
    const now = Date.now();
    if (this.cache.size > 0 && now - this.lastLoad < this.cacheTimeout) {
      return this.cache;
    }

    await this.ensureDataDir();
    
    try {
      const data = await fs.readFile(this.scriptsFile, "utf8");
      const scriptsObj = JSON.parse(data);
      this.cache.clear();
      
      Object.entries(scriptsObj).forEach(([id, script]) => {
        this.cache.set(id, script as Script);
      });
      
      this.lastLoad = now;
    } catch (error) {
      if ((error as any).code !== "ENOENT") {
        console.error("Error loading scripts:", error);
      }
      // File doesn't exist yet, start with empty cache
    }
    
    return this.cache;
  }

  private async saveScripts(): Promise<void> {
    await this.ensureDataDir();
    
    const scriptsObj: Record<string, Script> = {};
    this.cache.forEach((script, id) => {
      scriptsObj[id] = script;
    });
    
    await fs.writeFile(this.scriptsFile, JSON.stringify(scriptsObj, null, 2));
  }

  async getScript(id: string): Promise<Script | undefined> {
    const scripts = await this.loadScripts();
    return scripts.get(id);
  }

  async getUserScripts(userId: string): Promise<Script[]> {
    const scripts = await this.loadScripts();
    return Array.from(scripts.values()).filter(script => script.userId === userId);
  }

  async createScript(insertScript: InsertScript): Promise<Script> {
    const scripts = await this.loadScripts();
    
    // Check for duplicate script by same user
    const normalizedScript = insertScript.script.trim().replace(/\s+/g, " ");
    const existingScript = Array.from(scripts.values()).find(
      script => script.userId === insertScript.userId && 
                script.script.trim().replace(/\s+/g, " ") === normalizedScript
    );
    
    if (existingScript) {
      throw new Error("This script is already protected!");
    }

    const id = crypto.randomBytes(8).toString("hex");
    const script: Script = {
      id,
      script: insertScript.script.trim(),
      userId: insertScript.userId,
      createdAt: new Date(),
    };

    this.cache.set(id, script);
    await this.saveScripts();
    
    return script;
  }

  async updateScript(id: string, script: string, userId: string): Promise<boolean> {
    const scripts = await this.loadScripts();
    const existingScript = scripts.get(id);
    
    if (!existingScript || existingScript.userId !== userId) {
      return false;
    }

    // Check for duplicate script by same user
    const normalizedScript = script.trim().replace(/\s+/g, " ");
    const duplicateScript = Array.from(scripts.values()).find(
      s => s.id !== id && s.userId === userId && 
           s.script.trim().replace(/\s+/g, " ") === normalizedScript
    );
    
    if (duplicateScript) {
      throw new Error("This script is already protected by you!");
    }

    existingScript.script = script.trim();
    this.cache.set(id, existingScript);
    await this.saveScripts();
    
    return true;
  }

  async deleteScript(id: string, userId: string): Promise<boolean> {
    const scripts = await this.loadScripts();
    const script = scripts.get(id);
    
    if (!script || script.userId !== userId) {
      return false;
    }

    this.cache.delete(id);
    await this.saveScripts();
    
    return true;
  }

  async getAllScripts(): Promise<Script[]> {
    const scripts = await this.loadScripts();
    return Array.from(scripts.values());
  }

  async getStats(): Promise<PlatformStats> {
    const scripts = await this.loadScripts();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scriptsToday = Array.from(scripts.values()).filter(
      script => new Date(script.createdAt) >= today
    ).length;

    // Simulate online users (in production, this would come from real tracking)
    const baseUsers = 800;
    const variation = Math.sin(Date.now() / 300000) * 200; // 5-minute cycle
    const randomFactor = Math.random() * 100;
    const onlineUsers = Math.floor(baseUsers + variation + randomFactor);

    return {
      onlineUsers,
      totalScripts: scripts.size,
      scriptsToday,
      uptime: "99.9%",
    };
  }
}

export const storage = new FileStorage();
