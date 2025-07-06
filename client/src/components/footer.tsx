import { useStats } from "@/hooks/use-stats";

export function Footer() {
  const { data: stats } = useStats();

  return (
    <footer className="bg-blue-800/50 backdrop-blur-md p-8 text-center mt-16">
      <div className="max-w-4xl mx-auto">
        {stats && (
          <div className="flex flex-wrap justify-center items-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                👥 <span className="font-semibold">Online Users:</span>{" "}
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full">
                  {stats.onlineUsers.toLocaleString()}
                </span>
              </span>
            </div>
            <div className="text-sm text-gray-400">
              📜 Protected Scripts:{" "}
              <span className="font-semibold text-blue-400">
                {stats.totalScripts.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              ⚡ Uptime:{" "}
              <span className="font-semibold text-green-400">{stats.uptime}</span>
            </div>
          </div>
        )}

        <p className="text-lg text-gray-300 mb-4">
          © 2025 KULTHX SAFEME | All Rights Reserved ✨
        </p>
        <p className="text-sm text-gray-400">
          Powered by Vercel Serverless Architecture | Built for Roblox Developers
        </p>

        <div className="flex justify-center space-x-6 mt-6">
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            Support
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            API Status
          </a>
        </div>
      </div>
    </footer>
  );
}
