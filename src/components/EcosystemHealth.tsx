import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import rawData from "../data/aggregated_migrations.json";
import PluginMatrix from "./PluginMatrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface Migration {
  migrationStatus: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

const EcosystemHealth: React.FC = () => {
  const pluginReports = rawData as unknown as PluginReport[];

  const stats = useMemo(() => {
    let success = 0;
    let fail = 0;
    let totalMigrations = 0;

    pluginReports.forEach((plugin) => {
      const migrations = plugin.migrations || [];
      totalMigrations += migrations.length;
      migrations.forEach((m) => {
        if (m.migrationStatus?.toLowerCase() === "success") success++;
        if (m.migrationStatus?.toLowerCase() === "fail") fail++;
      });
    });

    const successRate = totalMigrations > 0 ? ((success / totalMigrations) * 100).toFixed(1) : "0.0";

    return { totalPlugins: pluginReports.length, totalMigrations, success, fail, successRate };
  }, [pluginReports]);

  const chartOption = useMemo(() => ({
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["50%", "80%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#020617', 
          borderWidth: 2
        },
        label: { show: false },
        data: [
          { value: stats.success, name: "SUCCESS", itemStyle: { color: "#22c55e" } },
          { value: stats.fail, name: "FAILED", itemStyle: { color: "#ef4444" } },
          { value: stats.totalMigrations - stats.success - stats.fail, name: "SKIPPED", itemStyle: { color: "#eab308" } },
        ],
      },
    ],
  }), [stats]);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Ecosystem Health</h1>
          <p className="text-slate-400 mt-1">Real-time modernization telemetry.</p>
        </div>
        <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10 font-mono">
          <Activity className="mr-2 h-3 w-3 animate-pulse" /> LIVE_SYNC
        </Badge>
      </div>

      {/* NEW: Telemetry HUD (Replaces the generic SaaS cards) */}
      <div className="bg-[#0a0f1c] border border-slate-800 rounded-lg p-6 mb-8 flex flex-wrap gap-8 items-center shadow-inner font-mono">
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs tracking-wider mb-1">TOTAL_PLUGINS</span>
          <span className="text-3xl font-bold text-blue-400">{stats.totalPlugins}</span>
        </div>
        
        <div className="h-10 w-px bg-slate-800 hidden md:block"></div>
        
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs tracking-wider mb-1">MIGRATIONS_RUN</span>
          <span className="text-3xl font-bold text-slate-200">{stats.totalMigrations}</span>
        </div>

        <div className="h-10 w-px bg-slate-800 hidden md:block"></div>

        <div className="flex flex-col">
          <span className="text-slate-500 text-xs tracking-wider mb-1">SUCCESS_RATE</span>
          <span className="text-3xl font-bold text-green-400">{stats.successRate}%</span>
        </div>

        <div className="h-10 w-px bg-slate-800 hidden md:block"></div>

        <div className="flex flex-col">
          <span className="text-slate-500 text-xs tracking-wider mb-1">FAILURES</span>
          <span className="text-3xl font-bold text-red-400">{stats.fail}</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-[#0a0f1c] border-slate-800 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-slate-200 font-mono text-sm">STATE_DISTRIBUTION</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ReactECharts option={chartOption} style={{ height: "250px", width: "100%" }} />
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a0f1c] border-slate-800 md:col-span-2 flex items-center justify-center min-h-[250px]">
          <p className="text-slate-500 font-mono text-sm">{">"} recipe_analytics_visualization_mounting...</p>
        </Card>
      </div>

      {/* Plugin Matrix Integration */}
      <div className="mt-8">
        <PluginMatrix />
      </div>
    </div>
  );
};

export default EcosystemHealth;