import React from "react";
import { Card } from "@/components/ui/card";
import { Terminal, Database, GitBranch, Server } from "lucide-react";

const ArchitecturePipeline: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-5xl">
      <div>
        <h2 className="text-3xl font-heading font-bold text-[#C9D1D9]">Architecture & Pipeline</h2>
        <p className="text-[#8B949E] mt-1 font-sans">System design and continuous deployment methodology.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#161B22] border-[#30363D] text-[#C9D1D9] rounded-md p-4 flex flex-col">
          <div className="text-[#C9D1D9] font-jetbrains-mono text-sm flex items-center mb-4 font-bold">
            <Database className="w-4 h-4 mr-2 text-blue-400" />
            THE_ZERO_API_ENGINE
          </div>
          <div className="text-[#8B949E] text-sm space-y-4 font-sans">
            <p>
              Unlike traditional dashboards that rely on rate-limited HTTP requests to the GitHub API, this architecture utilizes a <strong>Zero-API Local Aggregation</strong> model.
            </p>
            <p>
              During the build phase, the CI/CD pipeline clones the entire <code>jenkins-infra/metadata-plugin-modernizer</code> repository directly into the runner environment. A Node.js build script recursively scans the local filesystem, parses the JSON reports, and compiles a highly-optimized master dataset.
            </p>
            <div className="bg-[#0D1117] p-3 rounded-md border border-[#30363D] font-jetbrains-mono text-xs text-[#238636]">
              {">"} Total Network Requests: 0<br/>
              {">"} API Rate Limits Hit: 0<br/>
              {">"} Data Processing Time: {"<"} 500ms
            </div>
          </div>
        </Card>

        <Card className="bg-[#161B22] border-[#30363D] text-[#C9D1D9] rounded-md p-4 flex flex-col">
          <div className="text-[#C9D1D9] font-jetbrains-mono text-sm flex items-center mb-4 font-bold">
            <Terminal className="w-4 h-4 mr-2 text-[#D29922]" />
            DATA_DICTIONARY
          </div>
          <div className="space-y-4 font-sans text-[#8B949E]">
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-[#30363D] pb-2">
                <span className="font-jetbrains-mono text-[#238636] text-xs bg-[#238636]/10 px-2 py-1 rounded">SUCCESS</span>
                <span className="text-xs text-right w-2/3">OpenRewrite recipe applied and passed validation.</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#30363D] pb-2">
                <span className="font-jetbrains-mono text-[#D33833] text-xs bg-[#D33833]/10 px-2 py-1 rounded">FAIL</span>
                <span className="text-xs text-right w-2/3">Recipe failed validation. Requires manual maintainer intervention.</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="font-jetbrains-mono text-[#D29922] text-xs bg-[#D29922]/10 px-2 py-1 rounded">SKIPPED</span>
                <span className="text-xs text-right w-2/3">No status recorded, typically indicating an in-progress or bypassed migration.</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-[#161B22] border-[#30363D] text-[#C9D1D9] rounded-md p-4">
        <div className="text-[#C9D1D9] font-jetbrains-mono text-sm flex items-center mb-4 font-bold">
          <Server className="w-4 h-4 mr-2 text-[#8957e5]" />
          GITHUB_ACTIONS_WORKFLOW
        </div>
        <div>
          <div className="relative border-l-2 border-[#30363D] ml-3 pl-6 space-y-6">
            <div className="relative">
              <div className="absolute -left-[31px] bg-[#30363D] rounded-full p-1">
                <GitBranch className="w-3 h-3 text-[#C9D1D9]" />
              </div>
              <h4 className="text-[#C9D1D9] font-sans font-medium text-sm">1. CRON Trigger</h4>
              <p className="text-[#8B949E] font-sans text-xs mt-1">Workflow executes daily at midnight UTC via scheduled cron, or upon manual dispatch.</p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[31px] bg-[#30363D] rounded-full p-1">
                <GitBranch className="w-3 h-3 text-[#C9D1D9]" />
              </div>
              <h4 className="text-[#C9D1D9] font-sans font-medium text-sm">2. Multi-Repo Checkout</h4>
              <p className="text-[#8B949E] font-sans text-xs mt-1">Runner fetches both the dashboard source code and the Jenkins modernizer metadata repository concurrently.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] bg-[#30363D] rounded-full p-1">
                <GitBranch className="w-3 h-3 text-[#C9D1D9]" />
              </div>
              <h4 className="text-[#C9D1D9] font-sans font-medium text-sm">3. Build & Static Site Generation (SSG)</h4>
              <p className="text-[#8B949E] font-sans text-xs mt-1">Vite compiles the React+TypeScript application, freezing the dynamically fetched data into static JSON assets for instantaneous client-side load times.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] bg-[#30363D] rounded-full p-1">
                <GitBranch className="w-3 h-3 text-[#C9D1D9]" />
              </div>
              <h4 className="text-[#C9D1D9] font-sans font-medium text-sm">4. Deployment</h4>
              <p className="text-[#8B949E] font-sans text-xs mt-1">The <code className="font-jetbrains-mono">dist</code> folder is published to GitHub Pages via the official deployment action.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArchitecturePipeline;