import { apiRequest } from "./queryClient";
import { InsertScript, UpdateScript, DeleteScript, ProtectResponse, ScriptWithLoadstring, PlatformStats } from "@shared/schema";

export async function protectScript(data: InsertScript): Promise<ProtectResponse> {
  const response = await apiRequest("POST", "/api/generate", data);
  return response.json();
}

export async function getUserScripts(userId: string): Promise<ScriptWithLoadstring[]> {
  const response = await apiRequest("POST", "/api/my-scripts-post", { userId });
  return response.json();
}

export async function updateScript(data: UpdateScript): Promise<{ success: boolean; error?: string }> {
  const response = await apiRequest("POST", `/api/my-scripts/${data.scriptId}`, {
    script: data.script,
    userId: data.userId
  });
  const result = await response.json();
  return { success: true, ...result };
}

export async function deleteScript(data: DeleteScript): Promise<{ success: boolean; error?: string }> {
  const response = await apiRequest("DELETE", `/api/my-scripts/${data.scriptId}`, {
    userId: data.userId
  });
  const result = await response.json();
  return { success: true, ...result };
}

export async function getStats(): Promise<PlatformStats> {
  const response = await apiRequest("GET", "/api/stats");
  return response.json();
}
