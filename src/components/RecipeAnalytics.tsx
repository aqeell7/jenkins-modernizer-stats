import React, { useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

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

    return Object.values(statsMap)
      .filter(recipe => recipe.fail > 0)
      .sort((a, b) => b.fail - a.fail); // Descending order of failures
  }, [allPlugins]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-50">Recipe Analytics</h2>
        <p className="text-slate-400 mt-1">Deep-dive telemetry on OpenRewrite recipe failure rates.</p>
      </div>

      <div className="bg-[#0a0f1c] border border-slate-800 rounded-lg overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-900/50 p-4 flex items-center justify-between">
          <div className="flex items-center text-red-400 font-mono text-sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            TOP_FAILING_RECIPES
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Showing {recipeStats.length} recipes requiring intervention
          </div>
        </div>

        <div className="p-0">
          {recipeStats.length > 0 ? (
            <div className="divide-y divide-slate-800/50">
              {recipeStats.map((recipe, index) => {
                const failPercent = (recipe.fail / recipe.total) * 100;
                const successPercent = (recipe.success / recipe.total) * 100;
                
                return (
                  <div key={recipe.name} className="p-6 hover:bg-slate-800/20 transition-colors">
                    <div className="flex justify-between items-end mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-600 font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="text-slate-200 font-medium">{recipe.name}</h3>
                      </div>
                      <div className="text-right font-mono text-xs flex space-x-4">
                        <span className="text-red-400">{recipe.fail} Failed</span>
                        <span className="text-green-400">{recipe.success} Success</span>
                        <span className="text-slate-500">{recipe.total} Total</span>
                      </div>
                    </div>

                    {/* Telemetry Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-red-500" 
                        style={{ width: `${failPercent}%` }}
                        title={`${failPercent.toFixed(1)}% Failure Rate`}
                      />
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${successPercent}%` }}
                        title={`${successPercent.toFixed(1)}% Success Rate`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center text-slate-500">
              <CheckCircle2 className="w-12 h-12 mb-4 text-green-500/20" />
              <p className="font-mono text-sm">System optimal. Zero failing recipes detected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeAnalytics;