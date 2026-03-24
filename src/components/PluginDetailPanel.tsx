import React, { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Clock, Calendar, Tag, GitPullRequest, ArrowRight } from "lucide-react";

interface Migration {
  migrationStatus: string;
  migrationName: string;
  timestamp?: string;
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

// --- METADATA ENGINE (For Prototype Realism) ---
// This intelligently guesses metadata based on the recipe string.
const enrichRecipeData = (recipeName: string, _status: string, index: number) => {
  const lowerName = recipeName.toLowerCase();
  let priority = "LOW";
  let tags = ["chore"];
  let description = "Applied standard OpenRewrite refactoring rules.";
  let version = "v1.0.0";

  if (lowerName.includes("jenkinsfile")) {
    priority = "HIGH";
    tags = ["ci-cd", "infrastructure"];
    description = "Updates Jenkinsfile to comply with modern infrastructure standards and declarative pipeline syntax.";
    version = "v2.9.1";
  } else if (lowerName.includes("java 17") || lowerName.includes("java 11")) {
    priority = "HIGH";
    tags = ["core", "java-upgrade"];
    description = "Bumps target bytecode and updates JVM dependencies to modern LTS releases.";
    version = "v5.x";
  } else if (lowerName.includes("junit")) {
    priority = "MEDIUM";
    tags = ["testing", "junit5"];
    description = "Migrates legacy JUnit 4 test annotations and assertions to JUnit 5 Jupiter.";
    version = "v5.10";
  } else if (lowerName.includes("commons")) {
    priority = "LOW";
    tags = ["dependencies", "security"];
    description = "Replaces deprecated Apache Commons calls with secure, modern equivalents.";
  }

  // Generate a realistic past date
  const date = new Date();
  date.setDate(date.getDate() - (index * 14));
  const dateStr = date.toISOString().split('T')[0];

  return { priority, tags, description, version, date: dateStr };
};

const PluginDetailPanel: React.FC<PluginDetailPanelProps> = ({ plugin, isOpen, onClose }) => {
  if (!plugin) return null;

  const migrations = plugin.migrations || [];
  const successCount = migrations.filter(m => m.migrationStatus?.toLowerCase() === "success").length;
  const failCount = migrations.filter(m => m.migrationStatus?.toLowerCase() === "fail").length;

  // Enrich migrations with our metadata engine
  const enrichedMigrations = useMemo(() => {
    return migrations.map((m, idx) => ({
      ...m,
      meta: enrichRecipeData(m.migrationName || "", m.migrationStatus || "", idx)
    }));
  }, [migrations]);

  const failedMigrations = enrichedMigrations.filter(m => m.migrationStatus?.toLowerCase() === "fail");

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl bg-[#0D1117] border-l border-[#30363D] text-[#C9D1D9] p-0 flex flex-col shadow-2xl">
        
        {/* Header Section */}
        <div className="p-8 border-b border-[#30363D] bg-[#161B22]">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-3xl font-heading font-extrabold text-[#C9D1D9] flex items-center tracking-tight">
              {plugin.pluginName}
            </SheetTitle>
            <SheetDescription className="text-[#8B949E] font-sans text-base mt-2 flex items-center">
              <GitPullRequest className="w-4 h-4 mr-2" />
              Repository health and migration history diagnostics.
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

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 p-8">
          
          {/* Actionable Intelligence: Recommended Next Steps */}
          {failCount > 0 && (
            <div className="mb-12">
              <h4 className="flex items-center text-[#C9D1D9] font-sans text-xl mb-6 font-bold tracking-tight">
                <AlertCircle className="w-6 h-6 mr-3 text-[#D33833]" />
                Recommended Next Steps
              </h4>
              
              <div className="space-y-4">
                {failedMigrations.map((m, idx) => (
                  <div key={idx} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row">
                    {/* Priority Accent Strip */}
                    <div className={`w-2 hidden sm:block ${m.meta.priority === 'HIGH' ? 'bg-[#D33833]' : m.meta.priority === 'MEDIUM' ? 'bg-[#D29922]' : 'bg-[#30363D]'}`}></div>
                    
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[#C9D1D9] font-sans font-semibold text-base">{m.migrationName}</span>
                        <Badge variant="outline" className={`font-jetbrains-mono text-[10px] ml-4 shrink-0
                          ${m.meta.priority === 'HIGH' ? 'text-[#D33833] border-[#D33833]/30 bg-[#D33833]/10' : 
                            m.meta.priority === 'MEDIUM' ? 'text-[#D29922] border-[#D29922]/30 bg-[#D29922]/10' : 
                            'text-[#8B949E] border-[#30363D] bg-[#30363D]/20'}`}
                        >
                          {m.meta.priority} PRIORITY
                        </Badge>
                      </div>
                      <p className="text-[#8B949E] font-sans text-sm mb-4 leading-relaxed">
                        Review the failed pull request logs. {m.meta.description}
                      </p>
                      <button className="text-sm font-sans text-[#4493f8] hover:text-[#58a6ff] flex items-center transition-colors">
                        Review Open PR <ArrowRight className="w-3 h-3 ml-1.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Migration Timeline (Data Dense) */}
          <div>
            <h4 className="text-[#C9D1D9] font-sans text-xl mb-8 font-bold flex items-center">
              <Clock className="w-5 h-5 mr-3 text-[#8B949E]" />
              Migration History
            </h4>
            
            <div className="space-y-8 border-l-2 border-[#30363D] ml-3 pl-8">
              {enrichedMigrations.map((m, idx) => {
                const isSuccess = m.migrationStatus?.toLowerCase() === "success";
                const isFail = m.migrationStatus?.toLowerCase() === "fail";
                
                return (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[45px] bg-[#0D1117] border-2 border-[#30363D] rounded-full p-1.5 
                      ${isSuccess ? 'text-[#238636]' : isFail ? 'text-[#D33833]' : 'text-[#D29922]'}`}
                    >
                      {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : isFail ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    
                    {/* Data-Dense Timeline Card */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-sm hover:border-[#8B949E]/50 transition-colors">
                      
                      {/* Top Row: Name & Status */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                        <h5 className="text-[#C9D1D9] text-lg font-sans leading-relaxed font-semibold">
                          {m.migrationName || "Unknown Recipe"}
                        </h5>
                        <Badge variant="outline" className={`font-jetbrains-mono text-xs px-3 py-1 uppercase self-start sm:self-auto tracking-widest shrink-0
                          ${isSuccess ? 'border-[#238636]/30 text-[#238636] bg-[#238636]/10' : isFail ? 'border-[#D33833]/30 text-[#D33833] bg-[#D33833]/10' : 'border-[#D29922]/30 text-[#D29922] bg-[#D29922]/10'}`}
                        >
                          {m.migrationStatus || "SKIPPED"}
                        </Badge>
                      </div>

                      {/* Middle Row: Description */}
                      <p className="text-[#8B949E] font-sans text-sm leading-relaxed mb-5">
                        {m.meta.description}
                      </p>

                      {/* Bottom Row: Metadata (Date, Version, Tags) */}
                      <div className="flex flex-wrap items-center gap-4 text-[#8B949E] font-jetbrains-mono text-xs pt-4 border-t border-[#30363D]/50">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {m.meta.date}
                        </div>
                        <div className="flex items-center">
                          <Tag className="w-3.5 h-3.5 mr-1.5" />
                          {m.meta.version}
                        </div>
                        <div className="flex gap-2">
                          {m.meta.tags.map(tag => (
                            <span key={tag} className="bg-[#30363D]/50 border border-[#30363D] px-2 py-0.5 rounded text-[10px] uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
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