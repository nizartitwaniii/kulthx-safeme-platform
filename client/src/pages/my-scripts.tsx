import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ScriptCard } from "@/components/ui/script-card";
import { getUserScripts, updateScript, deleteScript } from "@/lib/api";
import { ScriptWithLoadstring } from "@shared/schema";

export default function MyScripts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const userId = (() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }
    return id;
  })();

  const { data: scripts = [], isLoading, error } = useQuery({
    queryKey: ["/api/my-scripts", userId],
    queryFn: () => getUserScripts(userId),
  });

  const updateMutation = useMutation({
    mutationFn: updateScript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-scripts", userId] });
      toast({
        title: "Success!",
        description: "Script updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update script",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteScript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-scripts", userId] });
      toast({
        title: "Success!",
        description: "Script deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete script",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (scriptId: string, newScript: string) => {
    updateMutation.mutate({ scriptId, script: newScript, userId });
  };

  const handleDelete = (scriptId: string) => {
    if (confirm("Are you sure you want to delete this script?")) {
      deleteMutation.mutate({ scriptId, userId });
    }
  };

  // Handle error in useEffect to avoid infinite re-renders
  useEffect(() => {
    if (error) {
      toast({
        title: "Error", 
        description: "Failed to load scripts",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white font-sans min-h-screen">
      <LoadingOverlay isVisible={isLoading || updateMutation.isPending || deleteMutation.isPending} />
      <Sidebar />
      <Header />
      
      <main className="max-w-7xl mx-auto p-8">
        <section className="py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-blue-300">📜 My Protected Scripts</h2>
            <div className="text-sm text-gray-400">
              <span className="font-semibold">{scripts.length}</span> scripts
            </div>
          </div>
          
          <div className="space-y-6">
            {scripts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-2xl font-semibold text-gray-400 mb-2">No scripts found</h3>
                <p className="text-gray-500">Start by protecting your first script on the home page!</p>
              </div>
            ) : (
              scripts.map((script: ScriptWithLoadstring) => (
                <ScriptCard
                  key={script.id}
                  script={script}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}