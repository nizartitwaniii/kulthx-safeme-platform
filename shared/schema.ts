import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scripts = pgTable("scripts", {
  id: text("id").primaryKey(),
  script: text("script").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScriptSchema = createInsertSchema(scripts).pick({
  script: true,
  userId: true,
});

export const updateScriptSchema = z.object({
  scriptId: z.string().min(1, "Script ID is required"),
  script: z.string().min(1, "Script content is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const deleteScriptSchema = z.object({
  scriptId: z.string().min(1, "Script ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export type Script = typeof scripts.$inferSelect;
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type UpdateScript = z.infer<typeof updateScriptSchema>;
export type DeleteScript = z.infer<typeof deleteScriptSchema>;

export interface PlatformStats {
  onlineUsers: number;
  totalScripts: number;
  scriptsToday: number;
  uptime: string;
}

export interface ProtectResponse {
  success: boolean;
  loadstring?: string;
  scriptId?: string;
  error?: string;
}

export interface ScriptWithLoadstring extends Script {
  loadstring: string;
  preview: string;
}
