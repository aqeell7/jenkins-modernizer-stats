import React, { useState } from "react";
import EcosystemHealth from "./components/EcosystemHealth";
import PluginMatrix from "./components/PluginMatrix";
import RecipeAnalytics from "./components/RecipeAnalytics";
import ArchitecturePipeline from "./components/ArchitecturePipeline";

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
        return <ArchitecturePipeline />;
      default:
        return <EcosystemHealth />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#020617] text-slate-50 selection:bg-blue-500/30">
        
        <Sidebar className="border-r border-slate-800 bg-[#020617]">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 font-mono text-xs">SYSTEM_VIEWS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveView("health")}
                      isActive={activeView === "health"}
                      className={activeView === "health" ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:text-slate-50"}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Ecosystem Health
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveView("recipes")}
                      isActive={activeView === "recipes"}
                      className={activeView === "recipes" ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:text-slate-50"}
                    >
                      <Settings2 className="mr-2 h-4 w-4" /> Recipe Analytics
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveView("matrix")}
                      isActive={activeView === "matrix"}
                      className={activeView === "matrix" ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:text-slate-50"}
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
                      className={activeView === "architecture" ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:text-slate-50"}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Architecture & Pipeline
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default App;