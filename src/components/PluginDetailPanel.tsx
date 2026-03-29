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
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Tag,
  GitPullRequest,
  ArrowRight,
} from "lucide-react";

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

const STATUS_COLORS = {
  success: "text-[#238636]",
  fail: "text-[#D33833]",
  warning: "text-[#D29922]",
  neutral: "text-[#8B949E]",
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "text-[#D33833] border-[#D33833]/30 bg-[#D33833]/10";
    case "MEDIUM":
      return "text-[#D29922] border-[#D29922]/30 bg-[#D29922]/10";
    default:
      return "text-[#8B949E] border-[#30363D] bg-[#30363D]/20";
  }
};

// --- METADATA ENGINE ---
const enrichRecipeData = (recipeName: string, _status: string, index: number) => {
  const lowerName = recipeName.toLowerCase();
  let priority = "LOW";
  let tags = ["chore"];
  let description = "Applied standard OpenRewrite refactoring rules.";
  let version = "v1.0.0";

  if (lowerName.includes("jenkinsfile")) {
    priority = "HIGH";
    tags = ["ci-cd", "infrastructure"];
    description = "Updates Jenkinsfile to modern declarative pipeline.";
    version = "v2.9.1";
  } else if (lowerName.includes("java")) {
    priority = "HIGH";
    tags = ["core", "java-upgrade"];
    description = "Upgrades JVM and dependencies.";
    version = "v5.x";
  } else if (lowerName.includes("junit")) {
    priority = "MEDIUM";
    tags = ["testing", "junit5"];
    description = "Migrates JUnit 4 to JUnit 5.";
    version = "v5.10";
  }

  const date = new Date();
  date.setDate(date.getDate() - index * 14);

  return {
    priority,
    tags,
    description,
    version,
    date: date.toISOString().split("T")[0],
  };
};

const PluginDetailPanel: React.FC<PluginDetailPanelProps> = ({
  plugin,
  isOpen,
  onClose,
}) => {
  if (!plugin) return null;

  const migrations = plugin.migrations || [];

  const successCount = migrations.filter(
    (m) => m.migrationStatus?.toLowerCase() === "success"
  ).length;

  const failCount = migrations.filter(
    (m) => m.migrationStatus?.toLowerCase() === "fail"
  ).length;

  const enrichedMigrations = useMemo(() => {
    return migrations.map((m, idx) => ({
      ...m,
      meta: enrichRecipeData(
        m.migrationName || "",
        m.migrationStatus || "",
        idx
      ),
    }));
  }, [migrations]);

  const failedMigrations = enrichedMigrations.filter(
    (m) => m.migrationStatus?.toLowerCase() === "fail"
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="bg-[#0D1117] border-l border-[#30363D] text-[#C9D1D9] p-0 flex flex-col h-full shadow-2xl overflow-hidden"
        style={{ minWidth: "50vw", maxWidth: "50vw" }}
      >
        {/* HEADER */}
        <div className="p-10 border-b border-[#30363D] bg-[#161B22]">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-4xl font-extrabold">
              {plugin.pluginName}
            </SheetTitle>

            <SheetDescription className="text-[#8B949E] text-lg mt-3 flex items-center">
              <GitPullRequest className="w-5 h-5 mr-3" />
              Repository migration insights
            </SheetDescription>
          </SheetHeader>

          <div className="flex gap-4 mt-6 flex-wrap">
            <Badge className="px-5 py-2 text-base bg-[#30363D]/20 text-[#C9D1D9]">
              {migrations.length} Runs
            </Badge>

            <Badge className="px-5 py-2 text-base bg-[#238636]/10 text-[#238636]">
              {successCount} Success
            </Badge>

            {failCount > 0 && (
              <Badge className="px-5 py-2 text-base bg-[#D33833]/10 text-[#D33833]">
                {failCount} Failed
              </Badge>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <ScrollArea className="flex-1 px-10 py-10">
          
          {/* FAILED SECTION */}
          {failCount > 0 && (
            <div className="mb-14">
              <h4 className="flex items-center text-2xl font-bold mb-6">
                <AlertCircle className={`w-6 h-6 mr-3 ${STATUS_COLORS.fail}`} />
                Recommended Fixes
              </h4>

              <div className="space-y-5">
                {failedMigrations.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 hover:border-[#8B949E]/50 transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-lg font-semibold">
                        {m.migrationName}
                      </span>

                      <Badge
                        className={`text-xs px-3 py-1 uppercase ${getPriorityStyles(
                          m.meta.priority
                        )}`}
                      >
                        {m.meta.priority}
                      </Badge>
                    </div>

                    <p className="text-[#8B949E] text-base mb-4">
                      {m.meta.description}
                    </p>

                    {/* Converted dead button to a live, dynamic GitHub link */}
                    <a 
                      href={`https://github.com/jenkinsci/${plugin.pluginName}-plugin/pulls`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4493f8] flex items-center text-sm w-fit hover:text-[#58a6ff] hover:underline transition-colors"
                    >
                      Review PR <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIMELINE */}
          <div>
            <h4 className="text-2xl font-bold mb-8 flex items-center">
              <Clock className={`w-6 h-6 mr-3 ${STATUS_COLORS.neutral}`} />
              Migration Timeline
            </h4>

            <div className="space-y-10 border-l-2 border-[#30363D] pl-10">
              {enrichedMigrations.map((m, idx) => {
                const isSuccess =
                  m.migrationStatus?.toLowerCase() === "success";
                const isFail =
                  m.migrationStatus?.toLowerCase() === "fail";

                return (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[26px] top-2">
                      {isSuccess ? (
                        <CheckCircle2 className={STATUS_COLORS.success} />
                      ) : isFail ? (
                        <XCircle className={STATUS_COLORS.fail} />
                      ) : (
                        <Clock className={STATUS_COLORS.warning} />
                      )}
                    </div>

                    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-7 hover:border-[#8B949E]/50 transition">
                      <div className="flex justify-between mb-3">
                        <h5 className="text-lg font-semibold">
                          {m.migrationName}
                        </h5>

                        <Badge
                          className={`text-xs uppercase ${
                            isSuccess
                              ? "bg-[#238636]/10 text-[#238636]"
                              : isFail
                              ? "bg-[#D33833]/10 text-[#D33833]"
                              : "bg-[#D29922]/10 text-[#D29922]"
                          }`}
                        >
                          {m.migrationStatus}
                        </Badge>
                      </div>

                      <p className="text-[#8B949E] text-base mb-5">
                        {m.meta.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-[#8B949E] border-t border-[#30363D]/50 pt-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {m.meta.date}
                        </span>

                        <span className="flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          {m.meta.version}
                        </span>

                        <div className="flex gap-2">
                          {m.meta.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-[#30363D]/50 px-2 py-1 rounded text-xs"
                            >
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
                <div className="text-lg text-[#8B949E]">
                  No migration data available.
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