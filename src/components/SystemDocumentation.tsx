import React from "react";
import {
  Terminal, Database, GitBranch, BookOpen,
  CheckCircle2, XCircle, AlertCircle, Key, Rocket
} from "lucide-react";

const PIPELINE_STEPS = [
  {
    number: 1,
    color: "#238636",
    title: "Scheduled Trigger",
    description:
      "Workflow executes daily at midnight UTC via a cron job, ensuring the dashboard data is never more than 24 hours stale.",
  },
  {
    number: 2,
    color: "#8957e5",
    title: "Multi-Repo Checkout",
    description:
      "The GitHub Actions runner fetches both the dashboard UI source code and the Jenkins modernizer metadata repository concurrently.",
  },
  {
    number: 3,
    color: "#1f6feb",
    title: "Static Site Generation",
    description:
      "Vite compiles the React application, freezing the highly-optimized JSON dataset into static assets for instantaneous client-side load times globally.",
  },
  {
    number: 4,
    color: "#D29922",
    title: "Deployment",
    description:
      "The compiled dist/ folder is published to GitHub Pages via the official deployment action, making the live site available within seconds of a successful build.",
  },
];

const STATUS_CARDS = [
  {
    icon: CheckCircle2,
    badgeColor: "#238636",
    label: "success",
    title: "System Healthy",
    description:
      "The OpenRewrite migration recipe was applied successfully and passed all automated validation checks. No further maintainer action is required.",
  },
  {
    icon: XCircle,
    badgeColor: "#D33833",
    label: "fail",
    title: "Requires Attention",
    description: (
      <>
        The recipe could not be applied automatically, or the resulting code
        failed CI validation.{" "}
        <strong className="text-white">Action Required:</strong> Manual review.
      </>
    ),
  },
  {
    icon: AlertCircle,
    badgeColor: "#D29922",
    label: "skipped",
    title: "Bypassed Execution",
    description:
      "No status was recorded. Typically occurs for in-progress migrations, or when a recipe explicitly skips a plugin because the target is already up-to-date.",
  },
];

const SystemDocumentation: React.FC = () => {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-12 lg:py-16 animate-in fade-in duration-500">

      {/* Header */}
      <div className="mb-12 border-b border-[#30363D] pb-8">
        <h1 className="text-4xl font-heading font-extrabold text-[#C9D1D9] tracking-tight mb-4">
          System Documentation
        </h1>
        <p className="text-[#8B949E] font-sans text-xl leading-relaxed max-w-3xl">
          Architectural methodology, continuous deployment pipeline, and data
          schema definitions.
        </p>
      </div>

      {/* Section 1 */}
      <section className="mb-20 lg:mb-28">
        <h2 className="flex items-center text-[#C9D1D9] font-sans text-2xl font-bold mb-10">
          <Database className="w-7 h-7 mr-4 text-[#238636]" />
          Methodology & Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-lg flex flex-col justify-between">
            
            <div className="text-[#C9D1D9] font-sans text-base space-y-5 leading-relaxed mb-8">
              <p>
                A core architectural constraint of this dashboard is the
                complete elimination of GitHub API rate limits.
              </p>
              <p>
                Instead, this system utilizes a{" "}
                <strong className="text-white">
                  Local File System Aggregator
                </strong>.
              </p>
              <p>
                A Node.js script parses JSON files directly from disk,
                resulting in a highly-optimized static dataset.
              </p>
            </div>

            {/* Telemetry */}
            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-6 font-jetbrains-mono text-sm text-[#8B949E]">
              <div className="flex items-center text-[#238636] mb-4 font-bold">
                <Terminal className="w-4 h-4 mr-2" />
                &gt;_execution_telemetry
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div><span className="text-[#C9D1D9]">Network Requests:</span> 0</div>
                <div><span className="text-[#C9D1D9]">API Rate Limits:</span> 0</div>
                <div><span className="text-[#C9D1D9]">Processing Time:</span> {"<"} 400ms</div>
                <div><span className="text-[#C9D1D9]">Data Reliability:</span> 100%</div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-lg">
            <h3 className="flex items-center text-[#C9D1D9] font-sans text-xl font-bold mb-8">
              <GitBranch className="w-6 h-6 mr-3 text-[#8957e5]" />
              Continuous Deployment Pipeline
            </h3>

            <div className="space-y-6">
              {PIPELINE_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>

                  <div>
                    <h4 className="text-[#C9D1D9] font-sans font-bold text-base mb-1">
                      {step.title}
                    </h4>
                    <p className="text-[#8B949E] font-sans text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Section 2 */}
      <section className="mt-16 lg:mt-24">
        <h2 className="flex items-center text-[#C9D1D9] font-sans text-2xl font-bold mb-10">
          <BookOpen className="w-7 h-7 mr-4 text-[#8B949E]" />
          Data Dictionary
        </h2>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {STATUS_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col gap-4 shadow-sm"
            >
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit"
                style={{
                  backgroundColor: `${card.badgeColor}18`,
                  border: `1px solid ${card.badgeColor}40`,
                }}
              >
                <card.icon className="w-4 h-4" style={{ color: card.badgeColor }} />
                <span
                  className="font-jetbrains-mono font-bold text-sm"
                  style={{ color: card.badgeColor }}
                >
                  {card.label}
                </span>
              </div>

              <div>
                <h4 className="text-[#C9D1D9] font-sans font-bold text-base mb-1">
                  {card.title}
                </h4>
                <p className="text-[#8B949E] font-sans text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Schema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {[{
            icon: Key,
            label: "migrationName",
            title: "Primary Identifier",
            desc: "Identifier for the OpenRewrite recipe."
          },
          {
            icon: Rocket,
            label: "pluginName",
            title: "Plugin Identifier",
            desc: "Unique Jenkins plugin artifact ID."
          }].map((item, i) => (
            <div key={i} className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col sm:flex-row gap-5 items-start shadow-sm">
              
              <div className="flex-shrink-0 bg-[#0D1117] border border-[#30363D] px-3 py-1.5 rounded-lg flex items-center gap-2">
                <item.icon className="w-4 h-4 text-[#8B949E]" />
                <span className="font-jetbrains-mono text-[#8B949E] font-bold text-sm">
                  {item.label}
                </span>
              </div>

              <div>
                <h4 className="text-[#C9D1D9] font-sans font-bold text-base mb-1">
                  {item.title}
                </h4>
                <p className="text-[#8B949E] font-sans text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default SystemDocumentation;