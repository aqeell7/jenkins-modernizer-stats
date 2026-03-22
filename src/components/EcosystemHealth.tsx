import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import rawData from "../data/aggregated_migrations.json";
import TopFailingRecipesWidget from "./TopFailingRecipesWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, BarChart3 } from "lucide-react";

interface Migration {
  migrationStatus: string;
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

const EcosystemHealth: React.FC = () => {
  const pluginReports = rawData as unknown as PluginReport[];

  // 1. Crunch data for the Top Metrics and Pie Chart
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

  // 2. Crunch data specifically for the new Stacked Bar Chart (Top 10 highest volume recipes)
  const barChartData = useMemo(() => {
    const recipeMap: Record<string, { name: string; success: number; fail: number; skipped: number; total: number }> = {};

    pluginReports.forEach(plugin => {
      const migrations = plugin.migrations || [];
      migrations.forEach(m => {
        if (!m.migrationName) return;
        if (!recipeMap[m.migrationName]) {
          recipeMap[m.migrationName] = { name: m.migrationName, success: 0, fail: 0, skipped: 0, total: 0 };
        }
        recipeMap[m.migrationName].total++;
        
        const status = m.migrationStatus?.toLowerCase();
        if (status === "success") recipeMap[m.migrationName].success++;
        else if (status === "fail") recipeMap[m.migrationName].fail++;
        else recipeMap[m.migrationName].skipped++;
      });
    });

    // Get top 10 by total execution volume
    const topRecipes = Object.values(recipeMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return {
      // Truncate long recipe names for the X-axis so they don't overlap
      categories: topRecipes.map(r => r.name.length > 25 ? r.name.substring(0, 25) + '...' : r.name),
      fullNames: topRecipes.map(r => r.name),
      success: topRecipes.map(r => r.success),
      fail: topRecipes.map(r => r.fail),
      skipped: topRecipes.map(r => r.skipped)
    };
  }, [pluginReports]);

  // ECharts Config: Pie Chart
  const pieChartOption = useMemo(() => ({
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#020617', 
          borderWidth: 2
        },
        label: { 
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#94a3b8',
          fontFamily: 'monospace',
          fontSize: 11
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 15,
          lineStyle: { color: '#334155' }
        },
        data: [
          { value: stats.success, name: "SUCCESS", itemStyle: { color: "#22c55e" } },
          { value: stats.fail, name: "FAILED", itemStyle: { color: "#ef4444" } },
          { value: stats.totalMigrations - stats.success - stats.fail, name: "SKIPPED", itemStyle: { color: "#eab308" } },
        ],
      },
    ],
  }), [stats]);

  // NEW ECharts Config: Stacked Bar Chart
  const barChartOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0f172a',
      borderColor: '#1e293b',
      textStyle: { color: '#f8fafc', fontFamily: 'monospace', fontSize: 12 },
      formatter: function (params: any) {
        // Show the full non-truncated name in the tooltip hover
        let tooltipText = `<div style="font-weight:bold;margin-bottom:4px;max-width:300px;white-space:normal;">${barChartData.fullNames[params[0].dataIndex]}</div>`;
        params.forEach((param: any) => {
          tooltipText += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
        });
        return tooltipText;
      }
    },
    legend: {
      data: ['SUCCESS', 'FAILED', 'SKIPPED'],
      textStyle: { color: '#94a3b8', fontFamily: 'monospace' },
      top: 0
    },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: barChartData.categories,
      axisLabel: { color: '#64748b', fontFamily: 'monospace', fontSize: 10, interval: 0, rotate: 15 },
      axisLine: { lineStyle: { color: '#334155' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      axisLabel: { color: '#64748b', fontFamily: 'monospace' }
    },
    series: [
      { name: 'SUCCESS', type: 'bar', stack: 'total', itemStyle: { color: '#22c55e' }, data: barChartData.success },
      { name: 'FAILED', type: 'bar', stack: 'total', itemStyle: { color: '#ef4444' }, data: barChartData.fail },
      { name: 'SKIPPED', type: 'bar', stack: 'total', itemStyle: { color: '#eab308' }, data: barChartData.skipped }
    ]
  }), [barChartData]);

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

      {/* Telemetry HUD */}
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

      {/* Top Row: State Distribution & Top Failing Recipes */}
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <Card className="bg-[#0a0f1c] border-slate-800 md:col-span-1 min-h-[350px]">
          <CardHeader>
            <CardTitle className="text-slate-200 font-mono text-sm">STATE_DISTRIBUTION</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[280px]">
            <ReactECharts option={pieChartOption} style={{ height: "100%", width: "100%" }} />
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a0f1c] border-slate-800 md:col-span-2 flex items-center justify-center min-h-[350px] p-0">
          <TopFailingRecipesWidget />
        </Card>
      </div>

      {/* NEW Bottom Row: Full Width Execution Matrix */}
      <Card className="bg-[#0a0f1c] border-slate-800 w-full">
        <CardHeader className="pb-0">
          <CardTitle className="text-slate-200 font-mono text-sm flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
            RECIPE_EXECUTION_MATRIX (TOP 10 VOLUME)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ReactECharts option={barChartOption} style={{ height: "300px", width: "100%" }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EcosystemHealth;