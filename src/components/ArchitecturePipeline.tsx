import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Database, GitBranch, Server } from "lucide-react";

const ArchitecturePipeline: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold text-slate-50">Architecture & Pipeline</h2>
        <p className="text-slate-400 mt-1">System design and continuous deployment methodology.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#0a0f1c] border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200 font-mono text-sm flex items-center">
              <Database className="w-4 h-4 mr-2 text-blue-400" />
              THE_ZERO_API_ENGINE
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 text-sm space-y-4">
            <p>
              Unlike traditional dashboards that rely on rate-limited HTTP requests to the GitHub API, this architecture utilizes a <strong>Zero-API Local Aggregation</strong> model.
            </p>
            <p>
              During the build phase, the CI/CD pipeline clones the entire <code>jenkins-infra/metadata-plugin-modernizer</code> repository directly into the runner environment. A Node.js build script recursively scans the local filesystem, parses the JSON reports, and compiles a highly-optimized master dataset.
            </p>
            <div className="bg-slate-950 p-3 rounded-md border border-slate-800 font-mono text-xs text-green-400">
              {">"} Total Network Requests: 0<br/>
              {">"} API Rate Limits Hit: 0<br/>
              {">"} Data Processing Time: {"<"} 500ms
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1c] border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200 font-mono text-sm flex items-center">
              <Terminal className="w-4 h-4 mr-2 text-yellow-400" />
              DATA_DICTIONARY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-mono text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">SUCCESS</span>
                <span className="text-slate-400 text-xs text-right w-2/3">OpenRewrite recipe applied and passed validation.</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-mono text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded">FAIL</span>
                <span className="text-slate-400 text-xs text-right w-2/3">Recipe failed validation. Requires manual maintainer intervention.</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="font-mono text-yellow-400 text-xs bg-yellow-500/10 px-2 py-1 rounded">SKIPPED</span>
                <span className="text-slate-400 text-xs text-right w-2/3">No status recorded, typically indicating an in-progress or bypassed migration.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0a0f1c] border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200 font-mono text-sm flex items-center">
            <Server className="w-4 h-4 mr-2 text-purple-400" />
            GITHUB_ACTIONS_WORKFLOW
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-slate-800 ml-3 pl-6 space-y-6">
            <div className="relative">
              <div className="absolute -left-[31px] bg-slate-800 rounded-full p-1">
                <GitBranch className="w-3 h-3 text-slate-300" />
              </div>
              <h4 className="text-slate-200 font-medium text-sm">1. CRON Trigger</h4>
              <p className="text-slate-500 text-xs mt-1">Workflow executes daily at midnight UTC via scheduled cron, or upon manual dispatch.</p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[31px] bg-slate-800 rounded-full p-1">
                <GitBranch className="w-3 h-3 text-slate-300" />
              </div>
              <h4 className="text-slate-200 font-medium text-sm">2. Multi-Repo Checkout</h4>
              <p className="text-slate-500 text-xs mt-1">Runner fetches both the dashboard source code and the Jenkins modernizer metadata repository concurrently.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] bg-slate-800 rounded-full p-1">
                <GitBranch className="w-3 h-3 text-slate-300" />
              </div>
              <h4 className="text-slate-200 font-medium text-sm">3. Build & Static Site Generation (SSG)</h4>
              <p className="text-slate-500 text-xs mt-1">Vite compiles the React+TypeScript application, freezing the dynamically fetched data into static JSON assets for instantaneous client-side load times.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] bg-slate-800 rounded-full p-1">
                <GitBranch className="w-3 h-3 text-slate-300" />
              </div>
              <h4 className="text-slate-200 font-medium text-sm">4. Deployment</h4>
              <p className="text-slate-500 text-xs mt-1">The <code>dist</code> folder is published to GitHub Pages via the official deployment action.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchitecturePipeline;