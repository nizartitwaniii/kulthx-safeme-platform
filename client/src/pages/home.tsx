import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { protectScript } from "@/lib/api";
import { Copy, Shield, Zap, Smartphone, Settings } from "lucide-react";

export default function Home() {
  const [script, setScript] = useState("");
  const [result, setResult] = useState<{ loadstring: string; scriptId: string } | null>(null);
  const { toast } = useToast();

  const protectMutation = useMutation({
    mutationFn: protectScript,
    onSuccess: (data) => {
      if (data.success) {
        setResult({
          loadstring: data.loadstring!,
          scriptId: data.scriptId!
        });
        toast({
          title: "Success!",
          description: "Script protected successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to protect script",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to protect script. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProtect = () => {
    if (!script.trim()) {
      toast({
        title: "Error",
        description: "Please enter a script!",
        variant: "destructive",
      });
      return;
    }

    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
    }

    protectMutation.mutate({ script: script.trim(), userId });
  };

  const handleCopy = async () => {
    if (result?.loadstring) {
      try {
        await navigator.clipboard.writeText(result.loadstring);
        toast({
          title: "Copied!",
          description: "Loadstring copied to clipboard!",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy loadstring",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white font-sans min-h-screen">
      <LoadingOverlay isVisible={protectMutation.isPending} />
      <Sidebar />
      <Header />
      
      <main className="max-w-7xl mx-auto p-8">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gray-800/50 rounded-2xl shadow-xl mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 text-blue-300">
              🛡️ Protect Your Roblox Scripts
            </h2>
            <p className="text-xl mb-8 text-gray-300 leading-relaxed">
              Securely encrypt and share your scripts with unique loadstrings for Roblox executors. 
              Keep your code safe from unauthorized access while maintaining full functionality.
            </p>
            
            {/* Script Input Area */}
            <div className="bg-gray-700/30 p-6 rounded-xl mb-6">
              <label htmlFor="scriptInput" className="block text-left text-sm font-medium text-gray-300 mb-2">
                📝 Paste your Roblox script below:
              </label>
              <Textarea
                id="scriptInput"
                rows={8}
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full bg-gray-700/50 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="-- Example: 
game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = 50
print('Script protected by KULTHX SAFEME!')

-- Paste your Roblox script here..."
              />
            </div>
            
            <Button 
              onClick={handleProtect}
              disabled={protectMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 text-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              🚀 Protect Your Script
            </Button>
            
            {/* Protection Result */}
            {result && (
              <div className="mt-8">
                <Card className="bg-green-900/30 border-green-600/50">
                  <CardContent className="p-6">
                    <p className="text-green-400 font-semibold mb-3 flex items-center justify-center">
                      <Shield className="w-5 h-5 mr-2" />
                      ✅ Script Protected Successfully!
                    </p>
                    <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                      <label className="block text-sm text-gray-300 mb-2">🔗 Your Protected Loadstring:</label>
                      <Input
                        value={result.loadstring}
                        readOnly
                        className="bg-gray-700/50 border-gray-600 text-gray-200 font-mono text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-700">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Loadstring
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        📱 Share Script
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-300">
            🌟 Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Advanced Encryption</h3>
                <p className="text-gray-300">
                  Military-grade encryption protects your scripts from unauthorized access and reverse engineering.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Lightning Fast</h3>
                <p className="text-gray-300">
                  Optimized delivery ensures your scripts load instantly in any Roblox executor.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6">
                <Smartphone className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Cross-Platform</h3>
                <p className="text-gray-300">
                  Compatible with all major Roblox executors and injection methods.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6">
                <Settings className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Script Management</h3>
                <p className="text-gray-300">
                  Organize, edit, and manage all your protected scripts from one dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-300">ℹ About KULTHX SAFEME</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">What is KULTHX SAFEME?</h3>
                <p className="text-gray-300">
                  An innovative platform for protecting Roblox scripts, offering secure solutions to convert your scripts into encrypted links for safe in-game use.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">How It Works</h3>
                <p className="text-gray-300">
                  Enter your script, and we will store it securely, generating a unique loadstring for use in Roblox via HttpGet.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Why Choose Us?</h3>
                <ul className="text-gray-300 list-disc list-inside space-y-1">
                  <li>Strong encryption to protect your scripts.</li>
                  <li>Modern and user-friendly interface.</li>
                  <li>Unique and secure loadstring for each script.</li>
                  <li>Continuous updates and support.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
