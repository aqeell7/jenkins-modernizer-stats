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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="mb-12 border-b border-[#30363D] pb-8">
        <h1 className="text-4xl font-heading font-extrabold text-[#C9D1D9] tracking-tight mb-4">
          System Documentation
        </h1>
        <p className="text-[#8B949E] font-sans text-xl leading-relaxed">
          Architectural methodology, continuous deployment pipeline, and data
          schema definitions.
        </p>
      </div>

      {/* Section 1: Methodology & Architecture */}
      <section className="mb-16">
        <h2 className="flex items-center text-[#C9D1D9] font-sans text-2xl font-bold mb-8">
          <Database className="w-7 h-7 mr-4 text-[#238636]" />
          Methodology & Architecture
        </h2>

        {/* lg: triggers the side-by-side layout on laptops, not just xl */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Zero-API Engine */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-lg flex flex-col justify-between">
            <div className="text-[#C9D1D9] font-sans text-base space-y-5 leading-relaxed mb-8">
              <p>
                A core architectural constraint of this dashboard is the
                complete elimination of GitHub API rate limits. Traditional
                approaches rely on batching hundreds of HTTP requests during the
                build phase, which is fundamentally fragile and slow.
              </p>
              <p>
                Instead, this system utilizes a{" "}
                <strong className="text-white">
                  Local File System Aggregator
                </strong>
                . During the GitHub Actions build, the runner clones the entire{" "}
                <code className="bg-[#0D1117] border border-[#30363D] px-2 py-0.5 rounded-md text-[#8B949E] font-jetbrains-mono text-sm">
                  jenkins-infra/metadata-plugin-modernizer
                </code>{" "}
                repository locally.
              </p>
              <p>
                A bespoke Node.js script recursively scans the directories,
                parsing the JSON files directly from disk in milliseconds,
                resulting in a highly-optimized, frozen static dataset.
              </p>
            </div>

            {/* Telemetry block */}
            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-6 font-jetbrains-mono text-sm text-[#8B949E] leading-loose">
              <div className="flex items-center text-[#238636] mb-4 font-bold">
                <Terminal className="w-4 h-4 mr-2" />
                &gt;_execution_telemetry
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <span className="text-[#C9D1D9]">Network Requests:</span> 0
                </div>
                <div>
                  <span className="text-[#C9D1D9]">API Rate Limits:</span> 0
                </div>
                <div>
                  <span className="text-[#C9D1D9]">Processing Time:</span>{" "}
                  {"<"} 400ms
                </div>
                <div>
                  <span className="text-[#C9D1D9]">Data Reliability:</span>{" "}
                  100%
                </div>
              </div>
            </div>
          </div>

          {/* Right: CI/CD Pipeline — numbered + color-coded steps */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-lg">
            <h3 className="flex items-center text-[#C9D1D9] font-sans text-xl font-bold mb-8">
              <GitBranch className="w-6 h-6 mr-3 text-[#8957e5]" />
              Continuous Deployment Pipeline
            </h3>

            <div className="space-y-6">
              {PIPELINE_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  {/* Colored numbered badge */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-jetbrains-mono font-bold text-white text-sm"
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

      {/* Section 2: Data Dictionary — status badges separated from schema fields */}
      <section className="mb-12">
        <h2 className="flex items-center text-[#C9D1D9] font-sans text-2xl font-bold mb-8">
          <BookOpen className="w-7 h-7 mr-4 text-[#8B949E]" />
          Data Dictionary
        </h2>

        {/* Status badges */}
        <p className="text-[#8B949E] font-sans text-sm uppercase tracking-widest mb-4 font-jetbrains-mono">
          Migration Status Values
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
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
                  className="font-jetbrains-mono font-bold text-sm tracking-wide"
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

        {/* Schema fields — visually separated */}
        <p className="text-[#8B949E] font-sans text-sm uppercase tracking-widest mb-4 font-jetbrains-mono">
          Schema Fields
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col sm:flex-row gap-5 items-start shadow-sm">
            <div className="flex-shrink-0 bg-[#0D1117] border border-[#30363D] px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Key className="w-4 h-4 text-[#8B949E]" />
              <span className="font-jetbrains-mono text-[#8B949E] font-bold text-sm tracking-wide">
                migrationName
              </span>
            </div>
            <div>
              <h4 className="text-[#C9D1D9] font-sans font-bold text-base mb-1">
                Primary Identifier
              </h4>
              <p className="text-[#8B949E] font-sans text-sm leading-relaxed">
                The strict string identifier for the OpenRewrite recipe
                executed. Used heavily in the analytics engine for grouping and
                sorting.
              </p>
            </div>
          </div>

          {/* Placeholder for a second schema field — add more as needed */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col sm:flex-row gap-5 items-start shadow-sm">
            <div className="flex-shrink-0 bg-[#0D1117] border border-[#30363D] px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#8B949E]" />
              <span className="font-jetbrains-mono text-[#8B949E] font-bold text-sm tracking-wide">
                pluginName
              </span>
            </div>
            <div>
              <h4 className="text-[#C9D1D9] font-sans font-bold text-base mb-1">
                Plugin Identifier
              </h4>
              <p className="text-[#8B949E] font-sans text-sm leading-relaxed">
                The unique artifact ID of the Jenkins plugin. Used as the
                primary key across all datasets — migration reports, PR records,
                and recipe analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SystemDocumentation;