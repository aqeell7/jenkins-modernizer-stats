import React, { useState, useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { AlertTriangle, CheckCircle2, Search, Filter, ChevronRight, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import RecipeDetailPanel from "./RecipeDetailPanel";

interface Migration {
  migrationStatus: string;
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

const RecipeAnalytics: React.FC = () => {
  const allPlugins = rawData as unknown as PluginReport[];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState<"all" | "failures">("all");
  
  // New state for the drill-down panel
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const recipeStats = useMemo(() => {
    const statsMap: Record<string, { name: string; success: number; fail: number; skipped: number; total: number }> = {};

    allPlugins.forEach(plugin => {
      const migrations = plugin.migrations || [];
      migrations.forEach(m => {
        if (!m.migrationName) return; 

        if (!statsMap[m.migrationName]) {
          statsMap[m.migrationName] = { name: m.migrationName, success: 0, fail: 0, skipped: 0, total: 0 };
        }

        statsMap[m.migrationName].total++;
        const status = m.migrationStatus?.toLowerCase();
        
        if (status === "success") statsMap[m.migrationName].success++;
        else if (status === "fail") statsMap[m.migrationName].fail++;
        else statsMap[m.migrationName].skipped++;
      });
    });

    return Object.values(statsMap).sort((a, b) => {
      if (b.fail !== a.fail) return b.fail - a.fail;
      return b.total - a.total;
    });
  }, [allPlugins]);

  const filteredRecipes = useMemo(() => {
    return recipeStats.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterState === "all" || (filterState === "failures" && recipe.fail > 0);
      return matchesSearch && matchesFilter;
    });
  }, [recipeStats, searchTerm, filterState]);


  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-8 pb-16 pt-4 px-2">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-heading font-bold text-[#C9D1D9]">Recipe Analytics</h2>
        <p className="text-[#8B949E] font-sans mt-2 text-base">Deep-dive telemetry and execution rates for OpenRewrite recipes.</p>
      </div>

      {/* Helper Banner */}
      <div className="flex items-start bg-[#30363D]/20 border border-[#30363D] p-5 rounded-lg max-w-3xl">
        <Info className="w-5 h-5 mr-3 mt-0.5 text-[#8B949E] flex-shrink-0" /> 
        <p className="text-base text-[#C9D1D9] font-sans leading-relaxed">
          Click on any recipe below to drill down and view the exact list of plugins associated with its failures or successes.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#161B22] border border-[#30363D] p-5 rounded-lg shadow-sm">
        <div className="w-full max-w-md relative">
          <Input 
            placeholder="Search recipes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-5 bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus-visible:ring-[#8B949E] font-sans text-base rounded-md"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B949E] pointer-events-none" />
        </div>
        
        <div className="flex bg-[#0D1117] border border-[#30363D] rounded-md p-1.5 w-full sm:w-auto">
          <button 
            onClick={() => setFilterState("all")}
            className={`flex-1 sm:flex-none px-6 py-2 rounded text-base font-sans font-medium transition-colors ${filterState === "all" ? "bg-[#30363D] text-[#C9D1D9] shadow-sm" : "text-[#8B949E] hover:text-[#C9D1D9]"}`}
          >
            All Recipes
          </button>
          <button 
            onClick={() => setFilterState("failures")}
            className={`flex-1 sm:flex-none px-6 py-2 rounded text-base font-sans font-medium flex items-center justify-center transition-colors ${filterState === "failures" ? "bg-[#30363D] text-[#C9D1D9] shadow-sm" : "text-[#8B949E] hover:text-[#C9D1D9]"}`}
          >
            <Filter className="w-4 h-4 mr-2" /> Requires Attention
          </button>
        </div>
      </div>

      {/* Data Container */}
      <div className="bg-[#161B22] border border-[#30363D] text-[#C9D1D9] rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-[#30363D] bg-[#0D1117] p-5 md:px-8 flex items-center justify-between">
          <div className="flex items-center text-[#C9D1D9] font-sans font-semibold text-base uppercase tracking-wider">
            {filterState === "failures" ? (
              <><AlertTriangle className="w-5 h-5 mr-3 text-[#D33833]" /> TOP FAILING RECIPES</>
            ) : (
              <><CheckCircle2 className="w-5 h-5 mr-3 text-[#8B949E]" /> ALL RECIPES EXECUTED</>
            )}
          </div>
          <div className="text-[#8B949E] font-sans text-sm">
            Showing <strong className="text-[#C9D1D9] font-semibold">{filteredRecipes.length}</strong> recipes
          </div>
        </div>

        <div className="p-0">
          {filteredRecipes.length > 0 ? (
            <div className="divide-y divide-[#30363D]">
              {filteredRecipes.map((recipe, index) => {
                const failPercent = (recipe.fail / recipe.total) * 100;
                const successPercent = (recipe.success / recipe.total) * 100;
                const skippedPercent = (recipe.skipped / recipe.total) * 100;
                
                return (
                  // MADE ROW CLICKABLE
                  <div 
                    key={recipe.name} 
                    onClick={() => setSelectedRecipe(recipe.name)}
                    className="p-6 md:px-8 hover:bg-[#30363D]/20 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-5 gap-6">
                      
                      <div className="flex items-start space-x-5 max-w-3xl relative z-10">
                        <span className="text-[#8B949E] font-jetbrains-mono text-base pt-0.5 w-6 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="text-[#C9D1D9] font-medium font-sans text-xl leading-snug group-hover:text-white transition-colors">
                          {recipe.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-6 relative z-10 w-full lg:w-auto">
                        <div className="flex space-x-6 text-sm font-sans border border-[#30363D] bg-[#0D1117] rounded-lg px-6 py-3 shrink-0">
                          <div className="flex flex-col items-center min-w-[3rem]">
                            <span className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">Failed</span>
                            <span className="text-[#D33833] font-jetbrains-mono font-bold text-base">{recipe.fail}</span>
                          </div>
                          <div className="w-px bg-[#30363D]"></div>
                          <div className="flex flex-col items-center min-w-[3rem]">
                            <span className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">Success</span>
                            <span className="text-[#238636] font-jetbrains-mono text-base">{recipe.success}</span>
                          </div>
                          <div className="w-px bg-[#30363D]"></div>
                          <div className="flex flex-col items-center min-w-[3rem]">
                            <span className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">Total</span>
                            <span className="text-[#C9D1D9] font-jetbrains-mono text-base">{recipe.total}</span>
                          </div>
                        </div>
                        {/* Interactive Drill-down Indicator */}
                        <ChevronRight className="w-6 h-6 text-[#8B949E] group-hover:text-[#C9D1D9] transition-transform group-hover:translate-x-1 hidden sm:block" />
                      </div>

                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-[#0D1117] border border-[#30363D] rounded-full overflow-hidden flex shadow-inner relative z-10">
                      {failPercent > 0 && <div className="h-full bg-[#D33833] transition-all group-hover:brightness-110" style={{ width: `${failPercent}%` }} />}
                      {successPercent > 0 && <div className="h-full bg-[#238636] transition-all group-hover:brightness-110" style={{ width: `${successPercent}%` }} />}
                      {skippedPercent > 0 && <div className="h-full bg-[#D29922] transition-all group-hover:brightness-110" style={{ width: `${skippedPercent}%` }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-20 text-center flex flex-col items-center text-[#8B949E]">
              <AlertTriangle className="w-16 h-16 mb-6 text-[#30363D]" />
              <p className="font-sans text-xl font-medium text-[#C9D1D9] mb-2">No recipes found.</p>
              <p className="font-sans text-base">Try adjusting your search or status filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* The Drill-Down Panel Component */}
      <RecipeDetailPanel 
        recipeName={selectedRecipe} 
        allPlugins={allPlugins} 
        isOpen={selectedRecipe !== null} 
        onClose={() => setSelectedRecipe(null)} 
      />
    </div>
  );
};

export default RecipeAnalytics;