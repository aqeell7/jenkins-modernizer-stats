import React, { useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { AlertOctagon } from "lucide-react";

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
      .slice(0, 5); // ONLY GRAB THE TOP 5
  }, [allPlugins]);

  if (topFailing.length === 0) {
    return <div className="text-[#8B949E] font-jetbrains-mono text-sm p-4">System optimal. Zero failing recipes.</div>;
  }

  return (
    <div className="w-full flex flex-col justify-center h-full px-4 py-2">
      <div className="flex items-center text-[#D33833] font-jetbrains-mono font-bold text-xs mb-4">
        <AlertOctagon className="w-3 h-3 mr-2" />
        CRITICAL_RECIPE_FAILURES
      </div>
      <div className="space-y-4 w-full">
        {topFailing.map((recipe, index) => {
          const failPercent = (recipe.fail / recipe.total) * 100;
          return (
            <div key={recipe.name} className="w-full">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[#C9D1D9] font-jetbrains-mono text-xs truncate pr-4" title={recipe.name}>
                  {index + 1}. {recipe.name}
                </span>
                <span className="text-[#D33833] font-jetbrains-mono text-xs whitespace-nowrap">
                  {recipe.fail} / {recipe.total}
                </span>
              </div>
              <div className="w-full h-1 bg-[#30363D] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#D33833]" 
                  style={{ width: `${failPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopFailingRecipesWidget;