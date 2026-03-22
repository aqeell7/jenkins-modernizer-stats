import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import rawData from "./data/aggregated_migrations.json";
import PluginMatrix from "./components/PluginMatrix";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider 
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, LayoutDashboard, Database, FileText, CheckCircle2, XCircle, Settings2 } from "lucide-react";

interface Migration {
  migrationStatus: string;
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

const App: React.FC = () => {
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
          borderColor: '#020617', // tailwind slate-950 to match background
          borderWidth: 2
        },
        label: { show: false },
        data: [
          { value: stats.success, name: "Success", itemStyle: { color: "#22c55e" } },
          { value: stats.fail, name: "Failed", itemStyle: { color: "#ef4444" } },
          { value: stats.totalMigrations - stats.success - stats.fail, name: "Other", itemStyle: { color: "#eab308" } },
        ],
      },
    ],
  }), [stats]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-950 text-slate-50">
        
        {/* The distinctly named Navigation Sidebar */}
        <Sidebar className="border-r border-slate-800 bg-slate-950">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-400">System Views</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="bg-slate-800 text-slate-50"><LayoutDashboard className="mr-2 h-4 w-4" /> Ecosystem Health</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-400 hover:text-slate-50"><Settings2 className="mr-2 h-4 w-4" /> Recipe Analytics</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-400 hover:text-slate-50"><Database className="mr-2 h-4 w-4" /> Plugin Matrix</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-400">Documentation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-400 hover:text-slate-50"><FileText className="mr-2 h-4 w-4" /> Architecture & Pipeline</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Ecosystem Health</h1>
              <p className="text-slate-400 mt-1">Real-time modernization status for the Jenkins plugin infrastructure.</p>
            </div>
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              <Activity className="mr-2 h-3 w-3 text-green-500" /> Live Data Sync
            </Badge>
          </div>

          {/* Top Level Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Plugins</CardTitle>
                <Database className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{stats.totalPlugins}</div>
                <p className="text-xs text-slate-500 mt-1">Tracked in modernizer</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Migrations</CardTitle>
                <Activity className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{stats.totalMigrations}</div>
                <p className="text-xs text-slate-500 mt-1">{stats.successRate}% overall success rate</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Failed Migrations</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">{stats.fail}</div>
                <p className="text-xs text-slate-500 mt-1">Requires manual intervention</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Successful Migrations</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{stats.success}</div>
                <p className="text-xs text-slate-500 mt-1">Automated fixes applied</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="bg-slate-900 border-slate-800 md:col-span-1">
              <CardHeader>
                <CardTitle className="text-slate-200">Migration Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ReactECharts option={chartOption} style={{ height: "250px", width: "100%" }} />
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900 border-slate-800 md:col-span-2 flex items-center justify-center min-h-[250px]">
              <p className="text-slate-500">Recipe Analytics visualization will mount here...</p>
            </Card>
          </div>

          {/* Plugin Matrix Integration */}
          <div className="mt-8">
            <PluginMatrix />
          </div>

        </main>
      </div>
    </SidebarProvider>
  );
};

export default App;