import React from "react";
import { Terminal, Database, GitBranch, BookOpen, CheckCircle2, XCircle, AlertCircle, Key } from "lucide-react";

const SystemDocumentation: React.FC = () => {
  return (
    /* Expanded to max-w-7xl to fill wide monitors, with explicit padding */
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      
      {/* Header - Explicit massive margin bottom (mb-16) */}
      <div className="mb-12 border-b border-[#30363D] pb-8">
        <h1 className="text-4xl font-heading font-extrabold text-[#C9D1D9] tracking-tight mb-4">
          System Documentation
        </h1>
        <p className="text-[#8B949E] font-sans text-xl leading-relaxed">
          Architectural methodology, continuous deployment pipeline, and data schema definitions.
        </p>
      </div>

      {/* Section 1: Methodology - Grid layout to fix the empty right side */}
      <section className="mb-16">
        <h2 className="flex items-center text-[#C9D1D9] font-sans text-2xl font-bold mb-8">
          <Database className="w-7 h-7 mr-4 text-[#238636]" />
          Methodology & Architecture
        </h2>

        {/* Side-by-side grid on extra-large screens, stacking on smaller ones */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Left Column: Zero-API Engine */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-lg flex flex-col justify-between">
            <div className="text-[#C9D1D9] font-sans text-lg space-y-6 leading-relaxed mb-8">
              <p>
                A core architectural constraint of this dashboard is the complete elimination of GitHub API rate limits. Traditional approaches rely on batching hundreds of HTTP requests during the build phase, which is fundamentally fragile and slow.
              </p>
              <p>
                Instead, this system utilizes a <strong className="text-white">Local File System Aggregator</strong>. During the GitHub Actions build, the runner clones the entire <code className="bg-[#0D1117] border border-[#30363D] px-2 py-1 rounded-md text-[#8B949E] font-jetbrains-mono text-sm mx-1">jenkins-infra/metadata-plugin-modernizer</code> repository locally. 
              </p>
              <p>
                A bespoke Node.js script recursively scans the directories, parsing the JSON files directly from disk in milliseconds, resulting in a highly-optimized, frozen static dataset.
              </p>
            </div>

            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-6 font-jetbrains-mono text-base text-[#8B949E] leading-loose w-full">
              <div className="flex items-center text-[#238636] mb-4 font-bold text-lg">
                <Terminal className="w-5 h-5 mr-3" /> execution_telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><span className="text-[#C9D1D9]">Network Requests:</span> 0</div>
                <div><span className="text-[#C9D1D9]">API Rate Limits:</span> 0</div>
                <div><span className="text-[#C9D1D9]">Processing Time:</span> {"<"} 400ms</div>
                <div><span className="text-[#C9D1D9]">Data Reliability:</span> 100%</div>
              </div>
            </div>
          </div>

          {/* Right Column: CI/CD Pipeline */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-lg">
            <h3 className="flex items-center text-[#C9D1D9] font-sans text-xl font-bold mb-8">
              <GitBranch className="w-6 h-6 mr-3 text-[#8957e5]" />
              Continuous Deployment Pipeline
            </h3>
            
            <div className="relative border-l-2 border-[#30363D] ml-4 pl-8 space-y-12">
              <div className="relative">
                <div className="absolute -left-[43px] bg-[#161B22] border-2 border-[#30363D] rounded-full p-2">
                  <div className="w-3 h-3 bg-[#8B949E] rounded-full"></div>
                </div>
                <h4 className="text-[#C9D1D9] font-sans font-bold text-xl">1. Scheduled Trigger</h4>
                <p className="text-[#8B949E] font-sans text-base mt-3 leading-relaxed">
                  Workflow executes daily at midnight UTC via a cron job, ensuring the dashboard data is never more than 24 hours stale.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[43px] bg-[#161B22] border-2 border-[#30363D] rounded-full p-2">
                  <div className="w-3 h-3 bg-[#8B949E] rounded-full"></div>
                </div>
                <h4 className="text-[#C9D1D9] font-sans font-bold text-xl">2. Multi-Repo Checkout</h4>
                <p className="text-[#8B949E] font-sans text-base mt-3 leading-relaxed">
                  The GitHub Actions runner fetches both the dashboard UI source code and the massive Jenkins modernizer metadata repository concurrently.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[43px] bg-[#161B22] border-2 border-[#30363D] rounded-full p-2">
                  <div className="w-3 h-3 bg-[#8B949E] rounded-full"></div>
                </div>
                <h4 className="text-[#C9D1D9] font-sans font-bold text-xl">3. Static Site Generation</h4>
                <p className="text-[#8B949E] font-sans text-base mt-3 leading-relaxed">
                  Vite compiles the React application, freezing the highly-optimized JSON dataset into static assets for instantaneous client-side load times globally.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 2: Data Dictionary */}
      <section className="mb-12">
        <h2 className="flex items-center text-[#C9D1D9] font-sans text-2xl font-bold mb-8">
          <BookOpen className="w-7 h-7 mr-4 text-[#8B949E]" />
          Data Dictionary
        </h2>

        {/* 2-column grid for the dictionary cards to use horizontal space efficiently */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start shadow-sm">
            <div className="flex-shrink-0 bg-[#238636]/10 border border-[#238636]/30 px-3 py-2 rounded-lg flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-[#238636]" />
              <span className="font-jetbrains-mono text-[#238636] font-bold tracking-wide">success</span>
            </div>
            <div>
              <h4 className="text-[#C9D1D9] font-sans font-bold text-lg mb-2">System Healthy</h4>
              <p className="text-[#8B949E] font-sans text-base leading-relaxed">
                The OpenRewrite migration recipe was applied successfully and passed all automated validation checks. No further maintainer action is required.
              </p>
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start shadow-sm">
            <div className="flex-shrink-0 bg-[#D33833]/10 border border-[#D33833]/30 px-3 py-2 rounded-lg flex items-center">
              <XCircle className="w-5 h-5 mr-2 text-[#D33833]" />
              <span className="font-jetbrains-mono text-[#D33833] font-bold tracking-wide">fail</span>
            </div>
            <div>
              <h4 className="text-[#C9D1D9] font-sans font-bold text-lg mb-2">Requires Attention</h4>
              <p className="text-[#8B949E] font-sans text-base leading-relaxed">
                The recipe could not be applied automatically, or the resulting code failed CI validation. <strong className="text-white">Action Required:</strong> Manual review.
              </p>
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start shadow-sm">
            <div className="flex-shrink-0 bg-[#D29922]/10 border border-[#D29922]/30 px-3 py-2 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-[#D29922]" />
              <span className="font-jetbrains-mono text-[#D29922] font-bold tracking-wide">skipped</span>
            </div>
            <div>
              <h4 className="text-[#C9D1D9] font-sans font-bold text-lg mb-2">Bypassed Execution</h4>
              <p className="text-[#8B949E] font-sans text-base leading-relaxed">
                No status was recorded. Typically occurs for in-progress migrations, or when a recipe explicitly skips a plugin because the target is already up-to-date.
              </p>
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start shadow-sm">
            <div className="flex-shrink-0 bg-[#0D1117] border border-[#30363D] px-3 py-2 rounded-lg flex items-center">
              <Key className="w-5 h-5 mr-2 text-[#8B949E]" />
              <span className="font-jetbrains-mono text-[#8B949E] font-bold tracking-wide">migrationName</span>
            </div>
            <div>
              <h4 className="text-[#C9D1D9] font-sans font-bold text-lg mb-2">Primary Identifier</h4>
              <p className="text-[#8B949E] font-sans text-base leading-relaxed">
                The strict string identifier for the OpenRewrite recipe executed. Used heavily in the analytics engine for grouping and sorting.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default SystemDocumentation;