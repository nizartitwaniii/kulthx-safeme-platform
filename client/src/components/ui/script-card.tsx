import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScriptWithLoadstring } from "@shared/schema";
import { Edit, Trash2, Copy, Calendar } from "lucide-react";

interface ScriptCardProps {
  script: ScriptWithLoadstring;
  onUpdate: (scriptId: string, newScript: string) => void;
  onDelete: (scriptId: string) => void;
}

export function ScriptCard({ script, onUpdate, onDelete }: ScriptCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editContent, setEditContent] = useState(script.script);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script.loadstring);
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
  };

  const handleUpdate = () => {
    if (!editContent.trim()) {
      toast({
        title: "Error",
        description: "Script cannot be empty!",
        variant: "destructive",
      });
      return;
    }

    onUpdate(script.id, editContent.trim());
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    onDelete(script.id);
  };

  return (
    <Card className="bg-gray-800/50 hover:shadow-xl transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-400">Script #{script.id}</h3>
            <p className="text-sm text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Created: {new Date(script.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">
              Active
            </span>
            <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded">
              Protected
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            🔗 Loadstring:
          </label>
          <div className="flex">
            <Input
              value={script.loadstring}
              readOnly
              className="flex-1 bg-gray-700/50 border-gray-600 text-gray-200 font-mono text-sm rounded-r-none"
            />
            <Button
              onClick={handleCopy}
              className="bg-gray-600 hover:bg-gray-700 px-4 rounded-l-none border border-l-0 border-gray-600"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            📝 Script Content:
          </label>
          <Textarea
            value={script.script}
            readOnly
            rows={4}
            className="w-full bg-gray-700/50 border-gray-600 text-gray-200 font-mono text-sm resize-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditContent(script.script)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-blue-400">✏️ Edit Script</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  className="w-full bg-gray-700/50 border-gray-600 text-white font-mono"
                  placeholder="Edit your Roblox script here..."
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setIsEditOpen(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    💾 Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>

          <Button className="bg-blue-600 hover:bg-blue-700">
            📊 Analytics
          </Button>

          <Button className="bg-purple-600 hover:bg-purple-700">
            🔄 Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
