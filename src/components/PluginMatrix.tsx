import React, { useState, useMemo } from "react";
import rawData from "../data/aggregated_migrations.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

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

  // Process the raw nested data into a flat, sortable structure for the table
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

  // Apply the functional search filter
  const filteredPlugins = useMemo(() => {
    return processedData.filter(plugin => 
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processedData, searchTerm]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Plugin Matrix</h2>
        <p className="text-slate-400">Search and filter the complete modernization dataset.</p>
      </div>

      {/* Functional Search Bar */}
      <div className="max-w-md">
        <Input 
          placeholder="Search by plugin name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-900 border-slate-800 text-slate-50"
        />
      </div>

      {/* The Data Table */}
      <div className="rounded-md border border-slate-800 bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Plugin Name</TableHead>
              <TableHead className="text-slate-400">Total Migrations</TableHead>
              <TableHead className="text-slate-400">Successful</TableHead>
              <TableHead className="text-slate-400">Failed</TableHead>
              <TableHead className="text-slate-400">System Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlugins.length > 0 ? (
              filteredPlugins.map((plugin) => (
                <TableRow key={plugin.name} className="border-slate-800">
                  <TableCell className="font-medium text-slate-200">{plugin.name}</TableCell>
                  <TableCell className="text-slate-300">{plugin.totalMigrations}</TableCell>
                  <TableCell className="text-green-500">{plugin.success}</TableCell>
                  <TableCell className="text-red-500">{plugin.fail}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      plugin.status === 'Healthy' ? 'bg-green-500/10 text-green-500' : 
                      plugin.status === 'Requires Attention' ? 'bg-red-500/10 text-red-500' : 
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {plugin.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No plugins found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-slate-500">
        Showing {filteredPlugins.length} of {processedData.length} plugins
      </div>
    </div>
  );
};

export default PluginMatrix;