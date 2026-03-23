import React, { useState, useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, Info, Download, ChevronLeft } from "lucide-react";
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(15);

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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const totalPages = itemsPerPage === "All" ? 1 : Math.ceil(filteredPlugins.length / itemsPerPage);
  
  const currentData = useMemo(() => {
    if (itemsPerPage === "All") return filteredPlugins;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPlugins.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPlugins, currentPage, itemsPerPage]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }, [currentPage, totalPages]);

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
    <div className="space-y-8 relative pb-16">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-heading font-bold text-[#C9D1D9]">Plugin Matrix</h2>
        <p className="text-[#8B949E] font-sans mt-2 text-base">Search, filter, and export the complete modernization dataset.</p>
      </div>

      {/* Info Banner with increased padding and text size */}
      <div className="flex items-start bg-[#30363D]/20 border border-[#30363D] p-5 rounded-lg max-w-3xl">
        <Info className="w-5 h-5 mr-3 mt-0.5 text-[#8B949E] flex-shrink-0" /> 
        <p className="text-base text-[#C9D1D9] font-sans leading-relaxed">
          Click on any plugin row below to view its chronological migration execution log and system diagnostics.
        </p>
      </div>

      {/* Action Bar: Search & Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="w-full max-w-lg relative">
          <Input 
            placeholder="Search by plugin name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12 pl-4 py-6 bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus-visible:ring-[#8B949E] font-sans text-base rounded-md"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B949E] pointer-events-none" />
        </div>
        
        <div className="flex space-x-4 w-full md:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] rounded-md text-base font-sans font-medium transition-colors"
          >
            <Download className="w-5 h-5 mr-2 text-[#8B949E]" /> CSV
          </button>
          <button 
            onClick={handleExportJSON}
            className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] rounded-md text-base font-sans font-medium transition-colors"
          >
            <Download className="w-5 h-5 mr-2 text-[#8B949E]" /> JSON
          </button>
        </div>
      </div>

      {/* The Data Table */}
      <div className="rounded-lg border border-[#30363D] bg-[#161B22] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#0D1117]">
            <TableRow className="border-[#30363D] hover:bg-transparent">
              <TableHead className="text-[#8B949E] font-sans font-semibold py-5 px-6 text-sm uppercase tracking-wider">Plugin Name</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-5 px-6 text-sm uppercase tracking-wider">Total Migrations</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-5 px-6 text-sm uppercase tracking-wider">Successful</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-5 px-6 text-sm uppercase tracking-wider">Failed</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-5 px-6 text-sm uppercase tracking-wider">System Status</TableHead>
              <TableHead className="text-[#8B949E] font-sans font-semibold py-5 px-6 text-sm uppercase tracking-wider text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((pluginData) => {
                const rawPlugin = allPlugins.find(p => p.pluginName === pluginData.name) || null;
                
                return (
                  <TableRow 
                    key={pluginData.name} 
                    className="border-[#30363D] cursor-pointer hover:bg-[#30363D]/40 transition-colors group"
                    onClick={() => setSelectedPlugin(rawPlugin)}
                  >
                    <TableCell className="py-6 px-6 font-medium font-sans text-[#C9D1D9] text-lg">{pluginData.name}</TableCell>
                    <TableCell className="py-6 px-6 text-[#C9D1D9] font-sans text-base">{pluginData.totalMigrations}</TableCell>
                    <TableCell className="py-6 px-6 text-[#238636] font-sans font-medium text-base">{pluginData.success}</TableCell>
                    <TableCell className="py-6 px-6 text-[#D33833] font-sans font-medium text-base">{pluginData.fail}</TableCell>
                    <TableCell className="py-6 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-jetbrains-mono tracking-wide ${
                        pluginData.status === 'Healthy' ? 'bg-[#238636]/10 text-[#238636] border border-[#238636]/30' : 
                        pluginData.status === 'Requires Attention' ? 'bg-[#D33833]/10 text-[#D33833] border border-[#D33833]/30' : 
                        'bg-[#8B949E]/10 text-[#8B949E] border border-[#8B949E]/30'
                      }`}>
                        {pluginData.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-6 text-right">
                      <ChevronRight className="w-6 h-6 inline-block text-[#8B949E] group-hover:text-[#C9D1D9] transition-colors" />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-[#8B949E] font-sans text-lg">
                  No plugins found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 pt-4 font-sans text-[#8B949E]">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-base">
          <span className="font-medium text-[#C9D1D9]">
            Showing {itemsPerPage === "All" ? 1 : (currentPage - 1) * itemsPerPage + 1} to {itemsPerPage === "All" ? filteredPlugins.length : Math.min(currentPage * itemsPerPage, filteredPlugins.length)} of {filteredPlugins.length} plugins
          </span>
          <div className="flex items-center space-x-3">
            <span>Rows per page:</span>
            <select 
              className="bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] rounded-md px-3 py-1.5 outline-none focus:border-[#8B949E] cursor-pointer"
              value={itemsPerPage.toString()}
              onChange={(e) => setItemsPerPage(e.target.value === "All" ? "All" : Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="50">50</option>
              <option value="All">All</option>
            </select>
          </div>
        </div>

        {itemsPerPage !== "All" && totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-[#30363D] bg-[#161B22] text-[#C9D1D9] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#30363D] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {visiblePages.map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-md flex items-center justify-center font-medium text-base transition-colors border ${
                  currentPage === page 
                    ? "bg-[#238636] border-[#238636] text-white" 
                    : "bg-[#161B22] border-[#30363D] text-[#C9D1D9] hover:bg-[#30363D]"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-[#30363D] bg-[#161B22] text-[#C9D1D9] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#30363D] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
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