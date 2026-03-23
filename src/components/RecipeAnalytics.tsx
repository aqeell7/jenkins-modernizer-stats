import React, { useState, useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { AlertTriangle, CheckCircle2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

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

  // Crunch the data for all recipes
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

    // Sort by failures first, then by total volume
    return Object.values(statsMap).sort((a, b) => {
      if (b.fail !== a.fail) return b.fail - a.fail;
      return b.total - a.total;
    });
  }, [allPlugins]);

  // Apply search and toggle filters
  const filteredRecipes = useMemo(() => {
    return recipeStats.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterState === "all" || (filterState === "failures" && recipe.fail > 0);
      return matchesSearch && matchesFilter;
    });
  }, [recipeStats, searchTerm, filterState]);

  const totalFailuresCount = recipeStats.filter(r => r.fail > 0).length;

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div>
        <h2 className="text-3xl font-heading font-bold text-[#C9D1D9]">Recipe Analytics</h2>
        <p className="text-[#8B949E] font-sans mt-1">Deep-dive telemetry and execution rates for OpenRewrite recipes.</p>
      </div>

      {/* Action Bar: Search & Filtering */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#161B22] border border-[#30363D] p-4 rounded-md shadow-sm">
        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
          <Input 
            placeholder="Search recipes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus-visible:ring-[#8B949E] font-sans h-10"
          />
        </div>
        
        <div className="flex bg-[#0D1117] border border-[#30363D] rounded-md p-1 w-full sm:w-auto">
          <button 
            onClick={() => setFilterState("all")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-sm font-sans transition-colors ${filterState === "all" ? "bg-[#30363D] text-[#C9D1D9] shadow-sm" : "text-[#8B949E] hover:text-[#C9D1D9]"}`}
          >
            All Recipes
          </button>
          <button 
            onClick={() => setFilterState("failures")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-sm font-sans flex items-center justify-center transition-colors ${filterState === "failures" ? "bg-[#30363D] text-[#C9D1D9] shadow-sm" : "text-[#8B949E] hover:text-[#C9D1D9]"}`}
          >
            <Filter className="w-3 h-3 mr-2" /> Requires Attention
          </button>
        </div>
      </div>

      {/* Data Container */}
      <div className="bg-[#161B22] border border-[#30363D] text-[#C9D1D9] rounded-md overflow-hidden shadow-sm">
        <div className="border-b border-[#30363D] bg-[#0D1117] p-4 flex items-center justify-between">
          <div className="flex items-center text-[#C9D1D9] font-sans font-semibold text-sm">
            {filterState === "failures" ? (
              <><AlertTriangle className="w-4 h-4 mr-2 text-[#D33833]" /> TOP FAILING RECIPES</>
            ) : (
              <><CheckCircle2 className="w-4 h-4 mr-2 text-[#8B949E]" /> ALL RECIPES EXECUTED</>
            )}
          </div>
          <div className="text-[#8B949E] font-jetbrains-mono text-xs">
            Showing {filteredRecipes.length} recipes ({totalFailuresCount} with failures)
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
                  <div key={recipe.name} className="p-6 hover:bg-[#30363D]/20 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
                      <div className="flex items-start space-x-4 max-w-2xl">
                        <span className="text-[#8B949E] font-jetbrains-mono text-sm pt-0.5">{String(index + 1).padStart(2, '0')}</span>
                        {/* Changed to font-sans and text-base for maximum readability */}
                        <h3 className="text-[#C9D1D9] font-medium font-sans text-base leading-snug">{recipe.name}</h3>
                      </div>
                      
                      <div className="flex space-x-6 text-sm font-sans border border-[#30363D] bg-[#0D1117] rounded-md px-4 py-2 self-start md:self-auto">
                        <div className="flex flex-col items-center">
                          <span className="text-[#8B949E] text-xs mb-0.5">Failed</span>
                          <span className="text-[#D33833] font-jetbrains-mono font-bold">{recipe.fail}</span>
                        </div>
                        <div className="w-px bg-[#30363D]"></div>
                        <div className="flex flex-col items-center">
                          <span className="text-[#8B949E] text-xs mb-0.5">Success</span>
                          <span className="text-[#238636] font-jetbrains-mono">{recipe.success}</span>
                        </div>
                        <div className="w-px bg-[#30363D]"></div>
                        <div className="flex flex-col items-center">
                          <span className="text-[#8B949E] text-xs mb-0.5">Total</span>
                          <span className="text-[#C9D1D9] font-jetbrains-mono">{recipe.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Upgraded Telemetry Progress Bar */}
                    <div className="w-full h-2.5 bg-[#0D1117] border border-[#30363D] rounded-full overflow-hidden flex shadow-inner">
                      {failPercent > 0 && (
                        <div className="h-full bg-[#D33833]" style={{ width: `${failPercent}%` }} title={`${failPercent.toFixed(1)}% Failed`} />
                      )}
                      {successPercent > 0 && (
                        <div className="h-full bg-[#238636]" style={{ width: `${successPercent}%` }} title={`${successPercent.toFixed(1)}% Success`} />
                      )}
                      {skippedPercent > 0 && (
                        <div className="h-full bg-[#D29922]" style={{ width: `${skippedPercent}%` }} title={`${skippedPercent.toFixed(1)}% Skipped`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center flex flex-col items-center text-[#8B949E]">
              <AlertTriangle className="w-12 h-12 mb-4 text-[#8B949E]/40" />
              <p className="font-sans text-base">No recipes found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeAnalytics;