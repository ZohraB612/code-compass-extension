import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, MapPin, GitCommit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SymbolTraceProps {
  symbol: string;
}

interface TraceSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  content: React.ReactNode;
}

export function SymbolTrace({ symbol }: SymbolTraceProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    definition: true,
    usages: false,
    assignments: false,
    related: false,
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections: TraceSection[] = [
    {
      id: "definition",
      title: "Defined in",
      icon: MapPin,
      isOpen: openSections.definition,
      content: (
        <div className="p-3 space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <div className="text-sm font-mono text-vscode-blue">
                src/services/user.ts:15
              </div>
              <div className="code-snippet text-xs">
                <span className="syntax-keyword">async</span>{" "}
                <span className="syntax-keyword">function</span>{" "}
                <span className="syntax-function">{symbol}</span>
                (userId: <span className="syntax-keyword">string</span>) {"{"}
                {"\n  "}
                <span className="syntax-comment">// Get user profile with formatted data</span>
                {"\n  "}
                <span className="syntax-keyword">const</span> user = <span className="syntax-keyword">await</span> db.users.findById(userId);
                {"\n}"}
              </div>
              <Button variant="ghost" size="sm" className="trace-button">
                <ExternalLink className="w-3 h-3" />
                Jump to definition
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "usages",
      title: "Used in (8 locations)",
      icon: GitCommit,
      isOpen: openSections.usages,
      content: (
        <div className="p-3 space-y-3">
          {[
            { file: "src/pages/Profile.tsx", line: 23, context: "ProfileComponent" },
            { file: "src/components/UserCard.tsx", line: 45, context: "UserCard" },
            { file: "src/api/routes/users.ts", line: 67, context: "GET /api/users/:id" },
          ].map((usage, index) => (
            <div key={index} className="flex items-start gap-3 hover:bg-muted/30 p-2 rounded cursor-pointer">
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="text-sm font-mono text-vscode-blue">
                  {usage.file}:{usage.line}
                </div>
                <div className="text-xs text-muted-foreground">
                  in {usage.context}
                </div>
                <div className="code-snippet text-xs">
                  <span className="syntax-keyword">const</span> profile = <span className="syntax-keyword">await</span>{" "}
                  <span className="syntax-function">{symbol}</span>(userId);
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="trace-button w-full">
            View all 8 usages
          </Button>
        </div>
      ),
    },
    {
      id: "assignments",
      title: "Assignments & Overrides",
      icon: FileText,
      isOpen: openSections.assignments,
      content: (
        <div className="p-3 space-y-3">
          <div className="text-xs text-muted-foreground">
            No assignments found - this is a function declaration.
          </div>
        </div>
      ),
    },
    {
      id: "related",
      title: "Related Changes",
      icon: GitCommit,
      isOpen: openSections.related,
      content: (
        <div className="p-3 space-y-3">
          {[
            { type: "PR", title: "Add user profile caching", id: "#234" },
            { type: "Commit", title: "Fix getUserProfile error handling", id: "a4b2c1d" },
            { type: "Issue", title: "Profile loading performance", id: "#156" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 hover:bg-muted/30 p-2 rounded cursor-pointer">
              <div className={`text-xs px-2 py-1 rounded font-mono ${
                item.type === "PR" ? "bg-vscode-green/20 text-vscode-green" :
                item.type === "Commit" ? "bg-vscode-blue/20 text-vscode-blue" :
                "bg-vscode-orange/20 text-vscode-orange"
              }`}>
                {item.type}
              </div>
              <div className="flex-1">
                <div className="text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground font-mono">{item.id}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-0">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="syntax-function">{symbol}()</span>
          <span className="text-xs text-muted-foreground">Symbol Trace</span>
        </h3>
      </div>

      {sections.map((section) => {
        const Icon = section.icon;
        const ChevronIcon = section.isOpen ? ChevronDown : ChevronRight;
        
        return (
          <div key={section.id} className="navigator-section">
            <div 
              className="navigator-section-header"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-2">
                <ChevronIcon className="w-4 h-4" />
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.title}</span>
              </div>
            </div>
            <div 
              className={`navigator-section-content ${
                section.isOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              {section.content}
            </div>
          </div>
        );
      })}

      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Full Trace Map
        </Button>
      </div>
    </div>
  );
}