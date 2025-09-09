import { useState } from "react";
import { ArrowRight, Database, Globe, FileText, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlowTraceProps {
  functionName: string;
}

interface FlowStep {
  id: string;
  name: string;
  file: string;
  line: number;
  type: "function" | "api" | "database" | "external";
  description: string;
  codeSnippet?: string;
}

export function FlowTrace({ functionName }: FlowTraceProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const flowSteps: FlowStep[] = [
    {
      id: "entry",
      name: functionName,
      file: "src/services/user.ts",
      line: 15,
      type: "function",
      description: "Entry point - validates userId parameter",
      codeSnippet: `async function ${functionName}(userId: string) {
  if (!userId) throw new Error('User ID required');`,
    },
    {
      id: "db-call",
      name: "db.users.findById",
      file: "src/lib/database.ts",
      line: 78,
      type: "database",
      description: "Queries user table by primary key",
      codeSnippet: "const user = await db.users.findById(userId);",
    },
    {
      id: "validation",
      name: "validateUserData",
      file: "src/utils/validation.ts",
      line: 23,
      type: "function",
      description: "Validates and sanitizes user data",
      codeSnippet: "const validatedUser = validateUserData(user);",
    },
    {
      id: "formatting",
      name: "formatUserProfile",
      file: "src/services/user.ts",
      line: 89,
      type: "function",
      description: "Formats user data for client consumption",
      codeSnippet: "return formatUserProfile(validatedUser);",
    },
    {
      id: "external",
      name: "analytics.track",
      file: "src/services/analytics.ts",
      line: 45,
      type: "external",
      description: "Tracks profile access for analytics",
      codeSnippet: "analytics.track('profile_accessed', { userId });",
    },
  ];

  const getStepIcon = (type: FlowStep["type"]) => {
    switch (type) {
      case "function":
        return FileText;
      case "database":
        return Database;
      case "api":
        return Globe;
      case "external":
        return ExternalLink;
      default:
        return FileText;
    }
  };

  const getStepColor = (type: FlowStep["type"]) => {
    switch (type) {
      case "function":
        return "text-vscode-blue bg-vscode-blue/10";
      case "database":
        return "text-vscode-green bg-vscode-green/10";
      case "api":
        return "text-vscode-orange bg-vscode-orange/10";
      case "external":
        return "text-vscode-purple bg-vscode-purple/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  return (
    <div className="space-y-0">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Play className="w-4 h-4" />
          <span className="syntax-function">{functionName}()</span>
          <span className="text-xs text-muted-foreground">Flow Trace</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Execution flow with {flowSteps.length} steps
        </p>
      </div>

      <div className="p-4 space-y-3">
        {flowSteps.map((step, index) => {
          const Icon = getStepIcon(step.type);
          const isLast = index === flowSteps.length - 1;
          const isSelected = selectedStep === step.id;
          
          return (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-px h-8 bg-border" />
              )}
              
              {/* Step Item */}
              <div
                className={`flex items-start gap-3 p-3 rounded cursor-pointer transition-colors ${
                  isSelected ? "bg-muted/50" : "hover:bg-muted/30"
                }`}
                onClick={() => setSelectedStep(isSelected ? null : step.id)}
              >
                {/* Step Number & Icon */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-mono">
                    {index + 1}
                  </div>
                  {!isLast && (
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${getStepColor(step.type)}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="font-mono text-sm text-vscode-blue">
                      {step.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {step.file}:{step.line}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Expanded Code Snippet */}
                  {isSelected && step.codeSnippet && (
                    <div className="code-snippet text-xs mt-2">
                      <pre className="whitespace-pre-wrap">{step.codeSnippet}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-vscode-blue rounded-full"></div>
              Functions ({flowSteps.filter(s => s.type === "function").length})
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-vscode-green rounded-full"></div>
              Database ({flowSteps.filter(s => s.type === "database").length})
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-vscode-purple rounded-full"></div>
              External ({flowSteps.filter(s => s.type === "external").length})
            </span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Interactive Flow Graph
        </Button>
      </div>
    </div>
  );
}