import React, { useState } from "react";
import EcosystemHealth from "./components/EcosystemHealth";
import PluginMatrix from "./components/PluginMatrix";
import RecipeAnalytics from "./components/RecipeAnalytics";
import SystemDocumentation from "./components/SystemDocumentation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from "@/components/ui/sidebar";
import { LayoutDashboard, Database, FileText, Settings2 } from "lucide-react";

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<"health" | "recipes" | "matrix" | "architecture">("health");

  const renderContent = () => {
    switch (activeView) {
      case "health":
        return <EcosystemHealth />;
      case "matrix":
        return (
          <div className="animate-in fade-in duration-500">
            <PluginMatrix />
          </div>
        );
      case "recipes":
        return <RecipeAnalytics />;
      case "architecture":
        return <SystemDocumentation />;
      default:
        return <EcosystemHealth />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#0D1117] text-[#C9D1D9] selection:bg-[#238636]/30">

        <Sidebar className="border-r border-[#30363D] bg-[#161B22] sticky top-0 h-screen">
          <SidebarContent>
            <div className="flex items-center gap-3 p-4 border-b border-[#30363D] mb-4">
              <img src="jenkins.svg" alt="Jenkins Logo" className="h-8 w-auto" />
              <span className="font-heading font-bold text-lg text-[#C9D1D9]">Plugin Modernizer</span>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 font-mono text-xs">SYSTEM VIEWS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView("health")}
                      isActive={activeView === "health"}
                      className={activeView === "health" ? "bg-[#30363D] text-[#C9D1D9]" : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#30363D]/50"}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Ecosystem Health
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView("recipes")}
                      isActive={activeView === "recipes"}
                      className={activeView === "recipes" ? "bg-[#30363D] text-[#C9D1D9]" : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#30363D]/50"}
                    >
                      <Settings2 className="mr-2 h-4 w-4" /> Recipe Analytics
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView("matrix")}
                      isActive={activeView === "matrix"}
                      className={activeView === "matrix" ? "bg-[#30363D] text-[#C9D1D9]" : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#30363D]/50"}
                    >
                      <Database className="mr-2 h-4 w-4" /> Plugin Matrix
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 font-mono text-xs">DOCUMENTATION</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView("architecture")}
                      isActive={activeView === "architecture"}
                      className={activeView === "architecture" ? "bg-[#30363D] text-[#C9D1D9]" : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#30363D]/50"}
                    >
                      <FileText className="mr-2 h-4 w-4" /> System Documentation
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8 overflow-y-auto bg-[#0D1117]">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default App;