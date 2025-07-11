// script.lua.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ السماح فقط بـ GET
  if (req.method !== 'GET') {
    return res.status(405).send('❌ Method Not Allowed');
  }

  const { id } = req.query;

  // ✅ التحقق من وجود المعرف
  if (!id || typeof id !== 'string') {
    return res.status(400).send('❌ Invalid or missing script ID');
  }

  try {
    // ✅ جلب السكربت من التخزين
    const script = await storage.getScript(id);
    if (!script) {
      return res.status(404).send('-- Invalid or expired script link!');
    }

    // ✅ التحقق الصارم من User-Agent (Roblox أو Exploit Tools فقط)
    const userAgent = req.headers['user-agent'] || '';
    const isRoblox = /Roblox|rbx|synapse|krnl|fluxus|scriptware|evon/i.test(userAgent);

    if (!isRoblox) {
      return res.status(403).send('-- ❌ Access Denied: Only Roblox clients can access this script.');
    }

    // ✅ إرسال السكربت كنص عادي (text/plain)
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(script.script);
  } catch (error) {
    console.error('❌ Script retrieval error:', error);
    return res.status(500).send('-- Server error while retrieving script');
  }
}
