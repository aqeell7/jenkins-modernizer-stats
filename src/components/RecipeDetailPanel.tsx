import React, { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Box,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Migration {
  migrationStatus: string;
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

interface RecipeDetailPanelProps {
  recipeName: string | null;
  allPlugins: PluginReport[];
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailPanel: React.FC<RecipeDetailPanelProps> = ({
  recipeName,
  allPlugins,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "fail" | "success" | "skipped"
  >("fail");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(20);

  React.useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [recipeName, activeTab]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const affectedPlugins = useMemo(() => {
    if (!recipeName) return { fail: [], success: [], skipped: [] };

    const fail: string[] = [];
    const success: string[] = [];
    const skipped: string[] = [];

    allPlugins.forEach((plugin) => {
      const targetMigration = plugin.migrations?.find(
        (m) => m.migrationName === recipeName
      );
      if (targetMigration) {
        const status = targetMigration.migrationStatus?.toLowerCase();
        if (status === "fail") fail.push(plugin.pluginName);
        else if (status === "success") success.push(plugin.pluginName);
        else skipped.push(plugin.pluginName);
      }
    });

    return { fail, success, skipped };
  }, [recipeName, allPlugins]);

  React.useEffect(() => {
    if (recipeName && affectedPlugins.fail.length === 0) {
      if (affectedPlugins.success.length > 0) setActiveTab("success");
      else if (affectedPlugins.skipped.length > 0)
        setActiveTab("skipped");
    }
  }, [recipeName, affectedPlugins]);

  const filteredPlugins = useMemo(() => {
    const list = affectedPlugins[activeTab];
    if (!searchTerm) return list;
    return list.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [affectedPlugins, activeTab, searchTerm]);

  const totalPages =
    itemsPerPage === "All"
      ? 1
      : Math.ceil(filteredPlugins.length / itemsPerPage);

  const currentData = useMemo(() => {
    if (itemsPerPage === "All") return filteredPlugins;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPlugins.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredPlugins, currentPage, itemsPerPage]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [currentPage, totalPages]);

  if (!recipeName) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="bg-[#0D1117] border-l border-[#30363D] text-[#C9D1D9] p-0 flex flex-col h-full shadow-2xl overflow-hidden"
        style={{ minWidth: "50vw", maxWidth: "50vw" }}
      >
        {/* HEADER */}
        <div className="shrink-0 p-8 md:p-10 border-b border-[#30363D] bg-[#161B22]">
          <SheetHeader className="text-left mb-8">
            <SheetTitle className="text-2xl md:text-4xl font-heading font-extrabold">
              {recipeName}
            </SheetTitle>
            <SheetDescription className="text-[#8B949E] text-lg mt-3 flex items-center">
              <Box className="w-5 h-5 mr-3" />
              Plugins affected by this OpenRewrite execution.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-wrap gap-4">
            {["fail", "success", "skipped"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-md text-base font-semibold flex items-center border transition-colors ${
                  activeTab === tab
                    ? tab === "fail"
                      ? "bg-[#D33833]/10 border-[#D33833]/50 text-[#D33833]"
                      : tab === "success"
                      ? "bg-[#238636]/10 border-[#238636]/50 text-[#238636]"
                      : "bg-[#D29922]/10 border-[#D29922]/50 text-[#D29922]"
                    : "bg-[#0D1117] border-[#30363D] text-[#8B949E]"
                }`}
              >
                {tab === "fail" && (
                  <XCircle className="w-5 h-5 mr-3" />
                )}
                {tab === "success" && (
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                )}
                {tab === "skipped" && (
                  <AlertCircle className="w-5 h-5 mr-3" />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                {affectedPlugins[tab as keyof typeof affectedPlugins]
                  .length}
                )
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH */}
        <div className="shrink-0 px-10 py-6 border-b border-[#30363D]">
          <div className="relative">
            <Input
              placeholder={`Search ${activeTab} plugins...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-5 pr-14 py-7 bg-[#161B22] border-[#30363D] text-lg"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#8B949E]" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-10">
          {currentData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentData.map((plugin, idx) => (
                <div
                  key={idx}
                  className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex items-center"
                >
                  <span className="text-lg font-medium truncate">
                    {plugin}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-[#8B949E] text-xl">
              No data found
            </div>
          )}
        </div>

        {/* ✅ IMPROVED FOOTER */}
        <div className="shrink-0 px-10 py-8 border-t border-[#30363D] bg-[#161B22]">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8 text-[#8B949E]">
            
            {/* LEFT */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-lg">
              <span className="font-semibold text-[#C9D1D9]">
                Showing{" "}
                {itemsPerPage === "All"
                  ? 1
                  : (currentPage - 1) * itemsPerPage + 1}{" "}
                to{" "}
                {itemsPerPage === "All"
                  ? filteredPlugins.length
                  : Math.min(
                      currentPage * itemsPerPage,
                      filteredPlugins.length
                    )}{" "}
                of {filteredPlugins.length}
              </span>

              <div className="flex items-center gap-3">
                <span>Rows per page:</span>
                <select
                  className="bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] rounded-lg px-5 py-3 text-base"
                  value={itemsPerPage.toString()}
                  onChange={(e) =>
                    setItemsPerPage(
                      e.target.value === "All"
                        ? "All"
                        : Number(e.target.value)
                    )
                  }
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            {/* RIGHT */}
            {itemsPerPage !== "All" && totalPages > 1 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  className="p-4 border rounded-lg"
                >
                  <ChevronLeft />
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[48px] h-[48px] rounded-lg text-lg ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "border"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  className="p-4 border rounded-lg"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RecipeDetailPanel;