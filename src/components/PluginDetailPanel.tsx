import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";

interface Migration {
  migrationStatus: string;
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

interface PluginDetailPanelProps {
  plugin: PluginReport | null;
  isOpen: boolean;
  onClose: () => void;
}

const PluginDetailPanel: React.FC<PluginDetailPanelProps> = ({ plugin, isOpen, onClose }) => {
  if (!plugin) return null;

  const migrations = plugin.migrations || [];
  const successCount = migrations.filter(m => m.migrationStatus?.toLowerCase() === "success").length;
  const failCount = migrations.filter(m => m.migrationStatus?.toLowerCase() === "fail").length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl bg-[#0a0f1c] border-l border-slate-800 text-slate-50 p-0 flex flex-col">
        
        {/* Header Section */}
        <div className="p-6 border-b border-slate-800 bg-slate-950">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="text-2xl font-bold text-slate-50 flex items-center">
              {plugin.pluginName}
            </SheetTitle>
            <SheetDescription className="text-slate-400 font-mono text-xs">
              System health and migration history diagnostics.
            </SheetDescription>
          </SheetHeader>

          <div className="flex space-x-2 font-mono text-xs">
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              {migrations.length} Total Run
            </Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
              {successCount} Success
            </Badge>
            {failCount > 0 && (
              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10">
                {failCount} Failed
              </Badge>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 p-6">
          
          {/* Diagnostics / Next Steps */}
          {failCount > 0 && (
            <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="flex items-center text-red-400 font-mono text-xs mb-3 font-bold">
                <AlertCircle className="w-4 h-4 mr-2" />
                SYSTEM_DIAGNOSTICS_REQUIRED
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {migrations
                  .filter(m => m.migrationStatus?.toLowerCase() === "fail")
                  .map((m, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-0.5">{"->"}</span>
                      <span>Review failure logs for: <strong>{m.migrationName}</strong></span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Migration Timeline */}
          <div>
            <h4 className="text-slate-500 font-mono text-xs mb-4">EXECUTION_LOG</h4>
            <div className="space-y-4 border-l border-slate-800 ml-2 pl-4">
              {migrations.map((m, idx) => {
                const isSuccess = m.migrationStatus?.toLowerCase() === "success";
                const isFail = m.migrationStatus?.toLowerCase() === "fail";
                
                return (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[21px] bg-[#0a0f1c] rounded-full p-0.5 
                      ${isSuccess ? 'text-green-500' : isFail ? 'text-red-500' : 'text-yellow-500'}`}
                    >
                      {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : isFail ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <h5 className="text-slate-200 text-sm font-medium">{m.migrationName || "Unknown Recipe"}</h5>
                        <Badge variant="outline" className={`font-mono text-[10px] uppercase
                          ${isSuccess ? 'border-green-500/30 text-green-400' : isFail ? 'border-red-500/30 text-red-400' : 'border-yellow-500/30 text-yellow-400'}`}
                        >
                          {m.migrationStatus || "SKIPPED"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
              {migrations.length === 0 && (
                <div className="text-slate-500 text-sm">No migration data recorded for this plugin.</div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PluginDetailPanel;