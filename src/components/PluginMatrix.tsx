import React, { useState, useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, Info, Download } from "lucide-react";
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

  // --- EXPORT FUNCTIONALITY ---
  const handleExportCSV = () => {
    const headers = ["Plugin Name", "Total Migrations", "Successful", "Failed", "System Status"];
    const csvContent = [
      headers.join(","),
      ...filteredPlugins.map(p => `${p.name},${p.totalMigrations},${p.success},${p.fail},${p.status}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "jenkins_modernizer_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredPlugins, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "jenkins_modernizer_data.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-2xl font-sans font-bold text-[#C9D1D9]">Plugin Matrix</h2>
        <p className="text-[#8B949E] font-sans mt-1">Search, filter, and export the complete modernization dataset.</p>
      </div>

      {/* Helper text for discoverability */}
      <p className="text-sm text-[#C9D1D9] font-sans flex items-center bg-[#30363D]/30 border border-[#30363D] p-3 rounded-md max-w-2xl">
        <Info className="w-4 h-4 mr-3 text-[#8B949E] flex-shrink-0" /> 
        Click on any plugin row below to view its chronological migration execution log and system diagnostics.
      </p>

      {/* Action Bar: Search & Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
          <Input 
            placeholder="Search by plugin name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus-visible:ring-[#8B949E] font-sans h-10"
          />
        </div>
        
        <div className="flex space-x-3 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] rounded-md text-sm font-sans transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-[#8B949E]" /> CSV
          </button>
          <button 
            onClick={handleExportJSON}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] rounded-md text-sm font-sans transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-[#8B949E]" /> JSON
          </button>
        </div>
      </div>

      {/* The Data Table */}
      <div className="rounded-md border border-[#30363D] bg-[#161B22] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#0D1117]">
            <TableRow className="border-[#30363D] hover:bg-transparent">
              <TableHead className="text-[#8B949E] font-sans font-semibold py-4">Plugin Name</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-4">Total Migrations</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-4">Successful</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-4">Failed</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-4">System Status</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-4 text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlugins.length > 0 ? (
              filteredPlugins.map((pluginData) => {
                const rawPlugin = allPlugins.find(p => p.pluginName === pluginData.name) || null;
                
                return (
                  <TableRow 
                    key={pluginData.name} 
                    className="border-[#30363D] cursor-pointer hover:bg-[#30363D]/40 transition-colors group"
                    onClick={() => setSelectedPlugin(rawPlugin)}
                  >
                    {/* Replaced monospace with sans, increased text size, added vertical padding */}
                    <TableCell className="py-4 font-medium font-sans text-[#C9D1D9] text-base">{pluginData.name}</TableCell>
                    <TableCell className="py-4 text-[#C9D1D9] font-sans">{pluginData.totalMigrations}</TableCell>
                    <TableCell className="py-4 text-[#238636] font-sans">{pluginData.success}</TableCell>
                    <TableCell className="py-4 text-[#D33833] font-sans">{pluginData.fail}</TableCell>
                    <TableCell className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-jetbrains-mono ${
                        pluginData.status === 'Healthy' ? 'bg-[#238636]/10 text-[#238636] border border-[#238636]/30' : 
                        pluginData.status === 'Requires Attention' ? 'bg-[#D33833]/10 text-[#D33833] border border-[#D33833]/30' : 
                        'bg-[#8B949E]/10 text-[#8B949E] border border-[#8B949E]/30'
                      }`}>
                        {pluginData.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <ChevronRight className="w-5 h-5 inline-block text-[#8B949E] group-hover:text-[#C9D1D9] transition-colors" />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[#8B949E] font-sans text-base">
                  No plugins found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-[#8B949E] font-sans">
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