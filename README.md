# KULTHX SAFEME - Roblox Script Protection Platform

🚀 **منصة حماية وتشفير سكريبتات Roblox**

## المميزات

- 🔒 **حماية متقدمة**: تشفير وحماية سكريبتات Lua
- 🎯 **تنفيذ مباشر**: إنشاء loadstrings قابلة للتنفيذ في Roblox
- 📊 **لوحة إدارة**: إدارة وتحرير السكريبتات المحمية
- 📈 **إحصائيات حية**: متابعة إحصائيات المنصة في الوقت الفعلي
- 🛡️ **حماية أمنية**: الوصول محدود للـ Roblox HTTP requests فقط

## التقنيات المستخدمة

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Express.js + Serverless Functions
- **Database**: PostgreSQL مع File Storage fallback
- **Deployment**: Vercel

## كيفية الاستخدام

1. **حماية السكريبت**: ادخل سكريبت Lua واحصل على loadstring محمي
2. **التنفيذ**: استخدم الـ loadstring في Roblox executor
3. **الإدارة**: تصفح وحرر سكريبتاتك في قسم "My Scripts"

## API Endpoints

- `POST /api/generate` - حماية سكريبت جديد
- `GET /api/script?id={id}` - استرجاع السكريبت (Roblox فقط)
- `GET /api/stats` - إحصائيات المنصة

## الأمان

- فحص User-Agent للتأكد من الوصول من Roblox فقط
- تشفير معرفات السكريبتات
- حماية ضد الوصول غير المصرح به

## النشر

المشروع مُحسَّن للنشر على Vercel مع serverless functions.

---

**تم تطوير المشروع بواسطة KULTHX**