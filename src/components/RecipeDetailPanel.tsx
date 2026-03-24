import React, { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, AlertCircle, Box, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Migration {
  migrationStatus: string;
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

interface RecipeDetailPanelProps {
  recipeName: string | null;
  allPlugins: PluginReport[];
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailPanel: React.FC<RecipeDetailPanelProps> = ({ recipeName, allPlugins, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"fail" | "success" | "skipped">("fail");

  // Reset state when a new recipe is opened
  React.useEffect(() => {
    setSearchTerm("");
    setActiveTab("fail");
  }, [recipeName]);

  // Data Engine: Find all plugins affected by this specific recipe
  const affectedPlugins = useMemo(() => {
    if (!recipeName) return { fail: [], success: [], skipped: [] };

    const fail: string[] = [];
    const success: string[] = [];
    const skipped: string[] = [];

    allPlugins.forEach(plugin => {
      const targetMigration = plugin.migrations?.find(m => m.migrationName === recipeName);
      if (targetMigration) {
        const status = targetMigration.migrationStatus?.toLowerCase();
        if (status === "fail") fail.push(plugin.pluginName);
        else if (status === "success") success.push(plugin.pluginName);
        else skipped.push(plugin.pluginName);
      }
    });

    return { fail, success, skipped };
  }, [recipeName, allPlugins]);

  // Apply search filter to the currently active tab
  const displayedPlugins = useMemo(() => {
    const list = affectedPlugins[activeTab];
    if (!searchTerm) return list;
    return list.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [affectedPlugins, activeTab, searchTerm]);

  // Auto-switch tabs if the default "fail" tab is empty but others have data
  React.useEffect(() => {
    if (recipeName && affectedPlugins.fail.length === 0) {
      if (affectedPlugins.success.length > 0) setActiveTab("success");
      else if (affectedPlugins.skipped.length > 0) setActiveTab("skipped");
    }
  }, [recipeName, affectedPlugins]);

  if (!recipeName) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl bg-[#0D1117] border-l border-[#30363D] text-[#C9D1D9] p-0 flex flex-col shadow-2xl">
        
        {/* Header Section */}
        <div className="p-8 md:p-10 border-b border-[#30363D] bg-[#161B22]">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-2xl md:text-3xl font-heading font-extrabold text-[#C9D1D9] leading-tight tracking-tight">
              {recipeName}
            </SheetTitle>
            <SheetDescription className="text-[#8B949E] font-sans text-base mt-3 flex items-center">
              <Box className="w-4 h-4 mr-2" />
              Plugins affected by this specific OpenRewrite execution.
            </SheetDescription>
          </SheetHeader>

          {/* Interactive Status Tabs */}
          <div className="flex flex-wrap gap-3 font-sans mt-6">
            <button 
              onClick={() => setActiveTab("fail")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center border
                ${activeTab === "fail" ? 'bg-[#D33833]/10 border-[#D33833]/50 text-[#D33833]' : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#D33833]/30'}`}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Failed ({affectedPlugins.fail.length})
            </button>
            <button 
              onClick={() => setActiveTab("success")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center border
                ${activeTab === "success" ? 'bg-[#238636]/10 border-[#238636]/50 text-[#238636]' : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#238636]/30'}`}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Success ({affectedPlugins.success.length})
            </button>
            <button 
              onClick={() => setActiveTab("skipped")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center border
                ${activeTab === "skipped" ? 'bg-[#D29922]/10 border-[#D29922]/50 text-[#D29922]' : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#D29922]/30'}`}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Skipped ({affectedPlugins.skipped.length})
            </button>
          </div>
        </div>

        {/* Search Bar for the List */}
        <div className="px-8 md:px-10 py-4 border-b border-[#30363D] bg-[#0D1117]">
          <div className="relative">
            <Input 
              placeholder={`Search ${activeTab} plugins...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#161B22] border-[#30363D] text-[#C9D1D9] focus-visible:ring-[#8B949E] font-sans h-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E] pointer-events-none" />
          </div>
        </div>

        {/* Scrollable Plugin List */}
        <ScrollArea className="flex-1 p-8 md:p-10 bg-[#0D1117]">
          {displayedPlugins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedPlugins.map((plugin, idx) => (
                <div key={idx} className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex items-center shadow-sm">
                  {activeTab === "fail" && <XCircle className="w-4 h-4 mr-3 text-[#D33833] shrink-0" />}
                  {activeTab === "success" && <CheckCircle2 className="w-4 h-4 mr-3 text-[#238636] shrink-0" />}
                  {activeTab === "skipped" && <AlertCircle className="w-4 h-4 mr-3 text-[#D29922] shrink-0" />}
                  <span className="text-[#C9D1D9] font-sans text-sm font-medium truncate" title={plugin}>
                    {plugin}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[#8B949E]">
              <Box className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-sans text-base">
                {searchTerm ? "No plugins match your search." : `No ${activeTab} plugins for this recipe.`}
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default RecipeDetailPanel;