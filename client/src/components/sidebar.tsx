import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Home, FileText, Info, Book } from "lucide-react";
import { useStats } from "@/hooks/use-stats";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { data: stats } = useStats();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: "/real-home", icon: Home, label: "Home", emoji: "🏠" },
    { path: "/my-scripts", icon: FileText, label: "My Scripts", emoji: "📜" },
    { path: "/real-home#about", icon: Info, label: "About", emoji: "ℹ️" },
  ];

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800/90 backdrop-blur-md transform transition-transform duration-300 ease-in-out z-40 shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-2">🔒 KULTHX SAFEME</h2>
          <p className="text-sm text-gray-400 mb-6">Script Protection Platform</p>
          
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <span
                    className={`flex items-center space-x-3 text-lg px-4 py-2 rounded-lg transition-colors hover:bg-blue-600/50 cursor-pointer ${
                      location === item.path ? 'bg-blue-600/50' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          
          {stats && (
            <div className="mt-8 p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">
                  Online Users: <span className="font-semibold text-blue-400">{stats.onlineUsers.toLocaleString()}</span>
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Protected Scripts: <span className="font-semibold">{stats.totalScripts.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
