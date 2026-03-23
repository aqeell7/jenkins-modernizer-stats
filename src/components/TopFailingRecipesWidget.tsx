import React, { useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface Migration {
  migrationStatus: string;
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

const TopFailingRecipesWidget: React.FC = () => {
  const allPlugins = rawData as unknown as PluginReport[];

  const topFailing = useMemo(() => {
    const statsMap: Record<string, { name: string; fail: number; total: number }> = {};

    allPlugins.forEach(plugin => {
      const migrations = plugin.migrations || [];
      migrations.forEach(m => {
        if (!m.migrationName) return;
        if (!statsMap[m.migrationName]) {
          statsMap[m.migrationName] = { name: m.migrationName, fail: 0, total: 0 };
        }
        statsMap[m.migrationName].total++;
        if (m.migrationStatus?.toLowerCase() === "fail") statsMap[m.migrationName].fail++;
      });
    });

    return Object.values(statsMap)
      .filter(recipe => recipe.fail > 0)
      .sort((a, b) => b.fail - a.fail)
      .slice(0, 7); // Increased to 7 to beautifully fill the 400px card height
  }, [allPlugins]);

  if (topFailing.length === 0) {
    return <div className="text-[#8B949E] font-sans text-sm p-4">System optimal. Zero failing recipes.</div>;
  }

  return (
    <div className="w-full flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center text-[#C9D1D9] font-jetbrains-mono text-sm mb-6 font-bold">
          <AlertTriangle className="w-4 h-4 mr-2 text-[#D33833]" />
          CRITICAL_RECIPE_FAILURES
        </div>

        <div className="space-y-4 w-full">
          {topFailing.map((recipe, index) => {
            const failPercent = (recipe.fail / recipe.total) * 100;
            return (
              <div key={recipe.name} className="w-full group">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[#C9D1D9] font-sans text-sm truncate pr-4" title={recipe.name}>
                    <span className="text-[#8B949E] font-jetbrains-mono text-xs mr-2">{index + 1}.</span>
                    {recipe.name}
                  </span>
                  <span className="text-[#8B949E] font-jetbrains-mono text-xs whitespace-nowrap">
                    <span className="text-[#D33833] font-bold">{recipe.fail}</span> / {recipe.total}
                  </span>
                </div>
                {/* Upgraded Progress Bar to match Primer */}
                <div className="w-full h-1.5 bg-[#0D1117] border border-[#30363D] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#D33833] transition-all group-hover:brightness-110" 
                    style={{ width: `${failPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meaningful Footer to anchor the bottom of the card */}
      <div className="mt-4 pt-4 border-t border-[#30363D] flex justify-end">
        <span className="text-xs font-sans text-[#8B949E] flex items-center hover:text-[#C9D1D9] transition-colors cursor-pointer">
          View full recipe analytics <ArrowRight className="w-3 h-3 ml-1" />
        </span>
      </div>
    </div>
  );
};

export default TopFailingRecipesWidget;