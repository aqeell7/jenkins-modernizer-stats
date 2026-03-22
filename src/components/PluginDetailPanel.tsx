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
      <SheetContent className="w-full sm:max-w-xl bg-[#0D1117] border-l border-[#30363D] text-[#C9D1D9] p-0 flex flex-col">
        
        {/* Header Section */}
        <div className="p-6 border-b border-[#30363D] bg-[#161B22]">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="text-2xl font-heading font-bold text-[#C9D1D9] flex items-center">
              {plugin.pluginName}
            </SheetTitle>
            <SheetDescription className="text-[#8B949E] font-sans text-xs">
              System health and migration history diagnostics.
            </SheetDescription>
          </SheetHeader>

          <div className="flex space-x-2 font-jetbrains-mono text-xs">
            <Badge variant="outline" className="border-[#30363D] text-[#C9D1D9] bg-[#30363D]/20">
              {migrations.length} Total Run
            </Badge>
            <Badge variant="outline" className="border-[#238636]/30 text-[#238636] bg-[#238636]/10">
              {successCount} Success
            </Badge>
            {failCount > 0 && (
              <Badge variant="outline" className="border-[#D33833]/30 text-[#D33833] bg-[#D33833]/10">
                {failCount} Failed
              </Badge>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 p-6">
          
          {/* Diagnostics / Next Steps */}
          {failCount > 0 && (
            <div className="mb-8 bg-[#D33833]/10 border border-[#D33833]/20 rounded-lg p-4">
              <h4 className="flex items-center text-[#D33833] font-jetbrains-mono text-xs mb-3 font-bold">
                <AlertCircle className="w-4 h-4 mr-2" />
                SYSTEM_DIAGNOSTICS_REQUIRED
              </h4>
              <ul className="space-y-2 text-sm text-[#C9D1D9] font-jetbrains-mono">
                {migrations
                  .filter(m => m.migrationStatus?.toLowerCase() === "fail")
                  .map((m, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-[#D33833] mr-2 mt-0.5">{"->"}</span>
                      <span>Review failure logs for: <strong>{m.migrationName}</strong></span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Migration Timeline */}
          <div>
            <h4 className="text-[#8B949E] font-jetbrains-mono text-xs mb-4 font-bold">EXECUTION_LOG</h4>
            <div className="space-y-4 border-l border-[#30363D] ml-2 pl-4">
              {migrations.map((m, idx) => {
                const isSuccess = m.migrationStatus?.toLowerCase() === "success";
                const isFail = m.migrationStatus?.toLowerCase() === "fail";
                
                return (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[21px] bg-[#0D1117] rounded-full p-0.5 
                      ${isSuccess ? 'text-[#238636]' : isFail ? 'text-[#D33833]' : 'text-[#D29922]'}`}
                    >
                      {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : isFail ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="bg-[#161B22] border border-[#30363D] rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <h5 className="text-[#C9D1D9] text-sm font-jetbrains-mono leading-tight">{m.migrationName || "Unknown Recipe"}</h5>
                        <Badge variant="outline" className={`font-jetbrains-mono text-[10px] uppercase ml-2
                          ${isSuccess ? 'border-[#238636]/30 text-[#238636]' : isFail ? 'border-[#D33833]/30 text-[#D33833]' : 'border-[#D29922]/30 text-[#D29922]'}`}
                        >
                          {m.migrationStatus || "SKIPPED"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
              {migrations.length === 0 && (
                <div className="text-[#8B949E] text-sm font-jetbrains-mono">No migration data recorded for this plugin.</div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PluginDetailPanel;