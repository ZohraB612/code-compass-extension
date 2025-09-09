import { useState } from "react";
import { Code, Search, GitBranch, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SymbolTrace } from "./navigator/SymbolTrace";
import { FlowTrace } from "./navigator/FlowTrace";
import { ImpactAnalysis } from "./navigator/ImpactAnalysis";

type NavigatorMode = "symbol" | "flow" | "impact" | null;

interface NavigatorProps {
  className?: string;
}

export function Navigator({ className }: NavigatorProps) {
  const [activeMode, setActiveMode] = useState<NavigatorMode>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("getUserProfile");

  const modes = [
    {
      id: "symbol" as const,
      label: "Symbol Trace",
      icon: Search,
      description: "Trace symbol definitions and usages",
    },
    {
      id: "flow" as const,
      label: "Flow Trace",
      icon: GitBranch,
      description: "Follow function call flows",
    },
    {
      id: "impact" as const,
      label: "Impact Analysis",
      icon: Target,
      description: "Analyze dependencies and impacts",
    },
  ];

  const renderActivePanel = () => {
    switch (activeMode) {
      case "symbol":
        return <SymbolTrace symbol={selectedSymbol} />;
      case "flow":
        return <FlowTrace functionName={selectedSymbol} />;
      case "impact":
        return <ImpactAnalysis target={selectedSymbol} />;
      default:
        return null;
    }
  };

  return (
    <div className={`navigator-extension ${className}`}>
      {/* Main Interface */}
      <div className="bg-background min-h-screen p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Code className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Navigator</h1>
            <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
              VS Code Extension
            </span>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              
              return (
                <Button
                  key={mode.id}
                  variant={isActive ? "default" : "outline"}
                  className={`h-auto p-4 justify-start ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setActiveMode(isActive ? null : mode.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{mode.label}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {mode.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Code Context Simulation */}
          <div className="code-snippet">
            <div className="text-xs text-muted-foreground mb-2">
              src/services/user.ts
            </div>
            <pre className="text-sm leading-relaxed">
              <span className="syntax-keyword">async</span>{" "}
              <span className="syntax-keyword">function</span>{" "}
              <span 
                className="syntax-function cursor-pointer hover:bg-vscode-selection rounded px-1"
                onClick={() => {
                  setSelectedSymbol("getUserProfile");
                  setActiveMode("symbol");
                }}
              >
                getUserProfile
              </span>
              (userId: <span className="syntax-keyword">string</span>) {"{"}
              {"\n  "}
              <span className="syntax-comment">// Hover over symbols to trace them</span>
              {"\n  "}
              <span className="syntax-keyword">const</span> user = <span className="syntax-keyword">await</span> db.users.findById(userId);
              {"\n  "}
              <span className="syntax-keyword">return</span> formatUserProfile(user);
              {"\n}"}
            </pre>
          </div>

          {/* Active Panel */}
          {activeMode && (
            <div className="navigator-panel relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => setActiveMode(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              {renderActivePanel()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}