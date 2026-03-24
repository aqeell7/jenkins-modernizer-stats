import React, { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { CheckCircle2, XCircle, AlertCircle, Box, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(20);

  // Reset state when a new recipe is opened or tab changes
  React.useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [recipeName, activeTab]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

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

  // Auto-switch tabs if the default "fail" tab is empty but others have data
  React.useEffect(() => {
    if (recipeName && affectedPlugins.fail.length === 0) {
      if (affectedPlugins.success.length > 0) setActiveTab("success");
      else if (affectedPlugins.skipped.length > 0) setActiveTab("skipped");
    }
  }, [recipeName, affectedPlugins]);

  // Apply search filter to the currently active tab
  const filteredPlugins = useMemo(() => {
    const list = affectedPlugins[activeTab];
    if (!searchTerm) return list;
    return list.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [affectedPlugins, activeTab, searchTerm]);

  // Pagination Logic
  const totalPages = itemsPerPage === "All" ? 1 : Math.ceil(filteredPlugins.length / itemsPerPage);
  
  const currentData = useMemo(() => {
    if (itemsPerPage === "All") return filteredPlugins;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPlugins.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPlugins, currentPage, itemsPerPage]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }, [currentPage, totalPages]);

  if (!recipeName) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* Massive width upgrade (xl:max-w-[45vw]) and strictly enforced Flexbox height for safe scrolling */}
      <SheetContent className="w-full sm:max-w-3xl xl:max-w-[45vw] bg-[#0D1117] border-l border-[#30363D] text-[#C9D1D9] p-0 flex flex-col h-full shadow-2xl">
        
        {/* TOP FIXED SECTION: Header & Tabs */}
        <div className="shrink-0 p-8 border-b border-[#30363D] bg-[#161B22]">
          <SheetHeader className="text-left mb-8">
            <SheetTitle className="text-2xl md:text-3xl font-heading font-extrabold text-[#C9D1D9] leading-tight tracking-tight">
              {recipeName}
            </SheetTitle>
            <SheetDescription className="text-[#8B949E] font-sans text-lg mt-3 flex items-center">
              <Box className="w-5 h-5 mr-3" />
              Plugins affected by this OpenRewrite execution.
            </SheetDescription>
          </SheetHeader>

          {/* Interactive Status Tabs */}
          <div className="flex flex-wrap gap-4 font-sans">
            <button 
              onClick={() => setActiveTab("fail")}
              className={`px-5 py-3 rounded-md text-base font-semibold transition-colors flex items-center border
                ${activeTab === "fail" ? 'bg-[#D33833]/10 border-[#D33833]/50 text-[#D33833]' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#D33833]/30'}`}
            >
              <XCircle className="w-5 h-5 mr-3" />
              Failed ({affectedPlugins.fail.length})
            </button>
            <button 
              onClick={() => setActiveTab("success")}
              className={`px-5 py-3 rounded-md text-base font-semibold transition-colors flex items-center border
                ${activeTab === "success" ? 'bg-[#238636]/10 border-[#238636]/50 text-[#238636]' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#238636]/30'}`}
            >
              <CheckCircle2 className="w-5 h-5 mr-3" />
              Success ({affectedPlugins.success.length})
            </button>
            <button 
              onClick={() => setActiveTab("skipped")}
              className={`px-5 py-3 rounded-md text-base font-semibold transition-colors flex items-center border
                ${activeTab === "skipped" ? 'bg-[#D29922]/10 border-[#D29922]/50 text-[#D29922]' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#D29922]/30'}`}
            >
              <AlertCircle className="w-5 h-5 mr-3" />
              Skipped ({affectedPlugins.skipped.length})
            </button>
          </div>
        </div>

        {/* MIDDLE FIXED SECTION: Search Bar */}
        <div className="shrink-0 px-8 py-5 border-b border-[#30363D] bg-[#0D1117]">
          <div className="relative w-full max-w-xl">
            {/* Search Icon moved to the right with correct padding */}
            <Input 
              placeholder={`Search ${activeTab} plugins...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-5 pr-12 py-6 bg-[#161B22] border-[#30363D] text-[#C9D1D9] focus-visible:ring-[#8B949E] font-sans text-base rounded-md"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B949E] pointer-events-none" />
          </div>
        </div>

        {/* SCROLLABLE SECTION: The Plugin List */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0D1117]">
          {currentData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentData.map((plugin, idx) => (
                <div key={idx} className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 flex items-center shadow-sm hover:border-[#8B949E]/50 transition-colors cursor-default">
                  {activeTab === "fail" && <XCircle className="w-5 h-5 mr-4 text-[#D33833] shrink-0" />}
                  {activeTab === "success" && <CheckCircle2 className="w-5 h-5 mr-4 text-[#238636] shrink-0" />}
                  {activeTab === "skipped" && <AlertCircle className="w-5 h-5 mr-4 text-[#D29922] shrink-0" />}
                  <span className="text-[#C9D1D9] font-sans text-base font-medium truncate" title={plugin}>
                    {plugin}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-[#8B949E]">
              <Box className="w-16 h-16 mb-6 opacity-20" />
              <p className="font-sans text-lg">
                {searchTerm ? "No plugins match your search." : `No ${activeTab} plugins for this recipe.`}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM FIXED SECTION: Pagination Controls */}
        <div className="shrink-0 px-8 py-5 border-t border-[#30363D] bg-[#161B22]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[#8B949E]">
            <div className="flex items-center space-x-6 text-sm">
              <span className="font-medium text-[#C9D1D9]">
                Showing {itemsPerPage === "All" ? 1 : (currentPage - 1) * itemsPerPage + 1} to {itemsPerPage === "All" ? filteredPlugins.length : Math.min(currentPage * itemsPerPage, filteredPlugins.length)} of {filteredPlugins.length}
              </span>
              <div className="flex items-center space-x-3">
                <span>Rows:</span>
                <select 
                  className="bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] rounded-md px-3 py-1.5 outline-none focus:border-[#8B949E] cursor-pointer"
                  value={itemsPerPage.toString()}
                  onChange={(e) => setItemsPerPage(e.target.value === "All" ? "All" : Number(e.target.value))}
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            {itemsPerPage !== "All" && totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-[#30363D] bg-[#0D1117] text-[#C9D1D9] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#30363D] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {visiblePages.map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center font-medium text-base transition-colors border ${
                      currentPage === page 
                        ? "bg-[#238636] border-[#238636] text-white" 
                        : "bg-[#0D1117] border-[#30363D] text-[#C9D1D9] hover:bg-[#30363D]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-[#30363D] bg-[#0D1117] text-[#C9D1D9] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#30363D] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default RecipeDetailPanel;