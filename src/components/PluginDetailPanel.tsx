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
      {/* Increased width to max-w-2xl for better reading lines */}
      <SheetContent className="w-full sm:max-w-2xl bg-[#0D1117] border-l border-[#30363D] text-[#C9D1D9] p-0 flex flex-col shadow-2xl">
        
        {/* Header Section - Massive padding, large typography */}
        <div className="p-8 md:p-10 border-b border-[#30363D] bg-[#161B22]">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-3xl font-heading font-extrabold text-[#C9D1D9] flex items-center tracking-tight">
              {plugin.pluginName}
            </SheetTitle>
            <SheetDescription className="text-[#8B949E] font-sans text-base mt-2">
              System health and migration history diagnostics.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-wrap gap-3 font-jetbrains-mono">
            <Badge variant="outline" className="px-4 py-1.5 border-[#30363D] text-[#C9D1D9] bg-[#30363D]/20 text-sm">
              {migrations.length} Total Run
            </Badge>
            <Badge variant="outline" className="px-4 py-1.5 border-[#238636]/30 text-[#238636] bg-[#238636]/10 text-sm tracking-wide">
              {successCount} Success
            </Badge>
            {failCount > 0 && (
              <Badge variant="outline" className="px-4 py-1.5 border-[#D33833]/30 text-[#D33833] bg-[#D33833]/10 text-sm tracking-wide">
                {failCount} Failed
              </Badge>
            )}
          </div>
        </div>

        {/* Scrollable Content - Huge internal padding */}
        <ScrollArea className="flex-1 p-8 md:p-10">
          
          {/* Diagnostics / Next Steps */}
          {failCount > 0 && (
            <div className="mb-12 bg-[#D33833]/10 border border-[#D33833]/20 rounded-xl p-6 md:p-8 shadow-sm">
              <h4 className="flex items-center text-[#D33833] font-sans text-lg mb-4 font-bold tracking-tight">
                <AlertCircle className="w-6 h-6 mr-3" />
                System Diagnostics Required
              </h4>
              <ul className="space-y-4 text-base text-[#C9D1D9] font-sans leading-relaxed">
                {migrations
                  .filter(m => m.migrationStatus?.toLowerCase() === "fail")
                  .map((m, idx) => (
                    <li key={idx} className="flex items-start bg-[#161B22] p-4 rounded-md border border-[#D33833]/20">
                      <span className="text-[#D33833] mr-3 mt-0.5 font-bold">{"->"}</span>
                      <span>Review failure logs for: <strong className="text-white ml-1 font-semibold">{m.migrationName}</strong></span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Migration Timeline */}
          <div>
            <h4 className="text-[#C9D1D9] font-sans text-xl mb-8 font-bold flex items-center">
              <Clock className="w-5 h-5 mr-3 text-[#8B949E]" />
              Execution Log
            </h4>
            
            <div className="space-y-8 border-l-2 border-[#30363D] ml-3 pl-8">
              {migrations.map((m, idx) => {
                const isSuccess = m.migrationStatus?.toLowerCase() === "success";
                const isFail = m.migrationStatus?.toLowerCase() === "fail";
                
                return (
                  <div key={idx} className="relative">
                    {/* Adjusted absolute positioning for larger icons and thicker borders */}
                    <div className={`absolute -left-[45px] bg-[#0D1117] border-2 border-[#30363D] rounded-full p-1.5 
                      ${isSuccess ? 'text-[#238636]' : isFail ? 'text-[#D33833]' : 'text-[#D29922]'}`}
                    >
                      {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : isFail ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    
                    {/* Highly readable timeline cards */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 md:p-6 shadow-sm hover:border-[#8B949E]/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <h5 className="text-[#C9D1D9] text-base md:text-lg font-sans leading-relaxed font-medium">
                          {m.migrationName || "Unknown Recipe"}
                        </h5>
                        <Badge variant="outline" className={`font-jetbrains-mono text-xs px-3 py-1 uppercase self-start sm:self-auto tracking-widest
                          ${isSuccess ? 'border-[#238636]/30 text-[#238636] bg-[#238636]/10' : isFail ? 'border-[#D33833]/30 text-[#D33833] bg-[#D33833]/10' : 'border-[#D29922]/30 text-[#D29922] bg-[#D29922]/10'}`}
                        >
                          {m.migrationStatus || "SKIPPED"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {migrations.length === 0 && (
                <div className="text-[#8B949E] text-base font-sans bg-[#161B22] border border-[#30363D] p-6 rounded-xl">
                  No migration data recorded for this plugin.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PluginDetailPanel;