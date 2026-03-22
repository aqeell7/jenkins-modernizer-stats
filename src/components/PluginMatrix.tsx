import React, { useState, useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, Info } from "lucide-react";
import PluginDetailPanel from "./PluginDetailPanel";

interface Migration {
  migrationStatus: string;
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

const PluginMatrix: React.FC = () => {
  const allPlugins = rawData as unknown as PluginReport[];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlugin, setSelectedPlugin] = useState<PluginReport | null>(null);

  const processedData = useMemo(() => {
    return allPlugins.map(plugin => {
      let success = 0;
      let fail = 0;
      const migrations = plugin.migrations || [];
      
      migrations.forEach(m => {
        if (m.migrationStatus?.toLowerCase() === "success") success++;
        if (m.migrationStatus?.toLowerCase() === "fail") fail++;
      });

      return {
        name: plugin.pluginName,
        totalMigrations: migrations.length,
        success,
        fail,
        status: fail > 0 ? "Requires Attention" : (success > 0 ? "Healthy" : "Pending")
      };
    });
  }, [allPlugins]);

  const filteredPlugins = useMemo(() => {
    return processedData.filter(plugin => 
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processedData, searchTerm]);

  return (
    <div className="space-y-4 relative">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Plugin Matrix</h2>
        <p className="text-slate-400">Search and filter the complete modernization dataset.</p>
      </div>

      {/* Helper text for discoverability */}
      <p className="text-xs text-blue-400 font-mono flex items-center bg-blue-500/10 border border-blue-500/20 p-2 rounded-md max-w-md">
        <Info className="w-3 h-3 mr-2 flex-shrink-0" /> 
        Click on any plugin row to open the granular diagnostics panel.
      </p>

      {/* Functional Search Bar */}
      <div className="max-w-md relative mt-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input 
          placeholder="Search by plugin name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-slate-900 border-slate-800 text-slate-50 focus-visible:ring-slate-700"
        />
      </div>

      {/* The Data Table */}
      <div className="rounded-md border border-slate-800 bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Plugin Name</TableHead>
              <TableHead className="text-slate-400">Total Migrations</TableHead>
              <TableHead className="text-slate-400">Successful</TableHead>
              <TableHead className="text-slate-400">Failed</TableHead>
              <TableHead className="text-slate-400">System Status</TableHead>
              <TableHead className="text-slate-400 text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlugins.length > 0 ? (
              filteredPlugins.map((pluginData) => {
                const rawPlugin = allPlugins.find(p => p.pluginName === pluginData.name) || null;
                
                return (
                  <TableRow 
                    key={pluginData.name} 
                    className="border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors group"
                    onClick={() => setSelectedPlugin(rawPlugin)}
                  >
                    <TableCell className="font-medium text-slate-200">{pluginData.name}</TableCell>
                    <TableCell className="text-slate-300">{pluginData.totalMigrations}</TableCell>
                    <TableCell className="text-green-500">{pluginData.success}</TableCell>
                    <TableCell className="text-red-500">{pluginData.fail}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                        pluginData.status === 'Healthy' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        pluginData.status === 'Requires Attention' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {pluginData.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Chevron icon becomes brighter when the user hovers over the row */}
                      <ChevronRight className="w-5 h-5 inline-block text-slate-600 group-hover:text-slate-300 transition-colors" />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No plugins found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-slate-500 font-mono">
        Showing {filteredPlugins.length} of {processedData.length} plugins
      </div>

      <PluginDetailPanel 
        plugin={selectedPlugin} 
        isOpen={selectedPlugin !== null} 
        onClose={() => setSelectedPlugin(null)} 
      />
    </div>
  );
};

export default PluginMatrix;