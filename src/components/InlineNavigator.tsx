import { useState, useRef, useEffect } from "react";
import { Search, FileText, GitCommit, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TracePopupProps {
  symbol: string;
  position: { x: number; y: number };
  onClose: () => void;
}

// Lightweight trace popup component
function TracePopup({ symbol, position, onClose }: TracePopupProps) {
  const [openSections, setOpenSections] = useState({
    definition: true,
    usages: false,
    assignments: false,
    related: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div 
      className="fixed z-50 w-80 bg-popover border border-border rounded-lg shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-150"
      style={{ 
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y + 20, window.innerHeight - 400),
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm text-vscode-blue">{symbol}()</span>
        </div>
        <button 
          onClick={onClose}
          className="w-5 h-5 hover:bg-muted rounded flex items-center justify-center"
        >
          ×
        </button>
      </div>

      {/* Sections */}
      <div className="max-h-96 overflow-y-auto">
        {/* Definition */}
        <div className="border-b border-border/50">
          <button
            onClick={() => toggleSection('definition')}
            className="w-full flex items-center gap-2 p-2 hover:bg-muted/30 text-left"
          >
            {openSections.definition ? 
              <ChevronDown className="w-3 h-3" /> : 
              <ChevronRight className="w-3 h-3" />
            }
            <FileText className="w-3 h-3" />
            <span className="text-xs font-medium">Defined in</span>
          </button>
          
          {openSections.definition && (
            <div className="px-4 pb-3">
              <div className="text-xs font-mono text-vscode-blue mb-1">
                src/services/user.ts:15
              </div>
              <div className="bg-muted/20 rounded p-2 text-xs font-mono">
                <span className="text-vscode-purple">async</span>{" "}
                <span className="text-vscode-purple">function</span>{" "}
                <span className="text-vscode-blue">{symbol}</span>(userId: string)
              </div>
            </div>
          )}
        </div>

        {/* Usages */}
        <div className="border-b border-border/50">
          <button
            onClick={() => toggleSection('usages')}
            className="w-full flex items-center gap-2 p-2 hover:bg-muted/30 text-left"
          >
            {openSections.usages ? 
              <ChevronDown className="w-3 h-3" /> : 
              <ChevronRight className="w-3 h-3" />
            }
            <GitCommit className="w-3 h-3" />
            <span className="text-xs font-medium">Used in (3)</span>
          </button>
          
          {openSections.usages && (
            <div className="px-4 pb-3 space-y-2">
              {[
                { file: "Profile.tsx", line: 23 },
                { file: "UserCard.tsx", line: 45 },
                { file: "routes/users.ts", line: 67 }
              ].map((usage, i) => (
                <div key={i} className="text-xs font-mono hover:bg-muted/20 p-1 rounded cursor-pointer">
                  <span className="text-vscode-blue">{usage.file}:{usage.line}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs h-7 text-primary hover:bg-primary/10"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Open Full Trace Map
        </Button>
      </div>
    </div>
  );
}

// Code editor mockup with inline hover functionality
export function InlineNavigator() {
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);
  const [activeTrace, setActiveTrace] = useState<{ symbol: string; position: { x: number; y: number } } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSymbolClick = (symbol: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActiveTrace({
      symbol,
      position: { x: rect.left, y: rect.bottom }
    });
  };

  const closeTrace = () => {
    setActiveTrace(null);
  };

  // Handle clicks outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeTrace && event.target instanceof Element && !event.target.closest('.trace-popup')) {
        closeTrace();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeTrace]);

  return (
    <div className="bg-background min-h-screen">
      {/* VS Code-style header */}
      <div className="bg-vscode-bg-darker border-b border-vscode-border px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-4 text-sm text-muted-foreground font-mono">src/services/user.ts</span>
      </div>

      <div className="flex">
        {/* File explorer sidebar */}
        <div className="w-64 bg-vscode-bg-lighter border-r border-vscode-border p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-3">EXPLORER</div>
          <div className="space-y-1 text-sm font-mono">
            <div className="text-muted-foreground">src/</div>
            <div className="ml-4 text-muted-foreground">components/</div>
            <div className="ml-4 text-muted-foreground">pages/</div>
            <div className="ml-4 text-vscode-blue">services/ ▼</div>
            <div className="ml-8 text-foreground bg-vscode-selection px-1">user.ts</div>
            <div className="ml-8 text-muted-foreground">auth.ts</div>
          </div>
        </div>

        {/* Main editor area */}
        <div className="flex-1 relative">
          {/* Line numbers */}
          <div className="absolute left-0 w-12 bg-vscode-bg text-right text-xs text-vscode-text-dim font-mono leading-6 pt-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="px-2">{i + 1}</div>
            ))}
          </div>

          {/* Code content */}
          <div 
            ref={editorRef}
            className="ml-12 p-4 font-mono text-sm leading-6 bg-vscode-bg text-vscode-text"
          >
            <div className="space-y-1">
              <div>
                <span className="text-vscode-purple">import</span> {"{"}
                <span className="text-vscode-text"> db </span>
                {"}"} <span className="text-vscode-purple">from</span>{" "}
                <span className="text-vscode-green">'./database'</span>;
              </div>
              <div className="mt-4">
                <span className="text-vscode-text-dim">// Get user profile with formatted data</span>
              </div>
              <div>
                <span className="text-vscode-purple">async</span>{" "}
                <span className="text-vscode-purple">function</span>{" "}
                <button
                  className="relative inline-block text-vscode-blue hover:bg-vscode-selection px-1 rounded transition-colors group"
                  onMouseEnter={() => setHoveredSymbol('getUserProfile')}
                  onMouseLeave={() => setHoveredSymbol(null)}
                  onClick={(e) => handleSymbolClick('getUserProfile', e)}
                >
                  getUserProfile
                  {hoveredSymbol === 'getUserProfile' && (
                    <div className="absolute -right-1 -top-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-in fade-in-0 scale-in-95 duration-150">
                      <Search className="w-2 h-2 text-primary-foreground" />
                    </div>
                  )}
                </button>
                (userId: <span className="text-vscode-purple">string</span>) {"{"}
              </div>
              <div className="ml-4">
                <span className="text-vscode-purple">if</span> (!userId) {"{"}
              </div>
              <div className="ml-8">
                <span className="text-vscode-purple">throw</span>{" "}
                <span className="text-vscode-purple">new</span>{" "}
                <span className="text-vscode-blue">Error</span>(
                <span className="text-vscode-green">'User ID required'</span>);
              </div>
              <div className="ml-4">{"}"}</div>
              <div></div>
              <div className="ml-4">
                <span className="text-vscode-purple">const</span>{" "}
                <button
                  className="relative inline-block text-vscode-text hover:bg-vscode-selection px-1 rounded transition-colors group"
                  onMouseEnter={() => setHoveredSymbol('user')}
                  onMouseLeave={() => setHoveredSymbol(null)}
                  onClick={(e) => handleSymbolClick('user', e)}
                >
                  user
                  {hoveredSymbol === 'user' && (
                    <div className="absolute -right-1 -top-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-in fade-in-0 scale-in-95 duration-150">
                      <Search className="w-2 h-2 text-primary-foreground" />
                    </div>
                  )}
                </button>{" "}
                = <span className="text-vscode-purple">await</span> db.users.
                <button
                  className="relative inline-block text-vscode-blue hover:bg-vscode-selection px-1 rounded transition-colors group"
                  onMouseEnter={() => setHoveredSymbol('findById')}
                  onMouseLeave={() => setHoveredSymbol(null)}
                  onClick={(e) => handleSymbolClick('findById', e)}
                >
                  findById
                  {hoveredSymbol === 'findById' && (
                    <div className="absolute -right-1 -top-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-in fade-in-0 scale-in-95 duration-150">
                      <Search className="w-2 h-2 text-primary-foreground" />
                    </div>
                  )}
                </button>
                (userId);
              </div>
              <div className="ml-4">
                <span className="text-vscode-purple">return</span>{" "}
                <button
                  className="relative inline-block text-vscode-blue hover:bg-vscode-selection px-1 rounded transition-colors group"
                  onMouseEnter={() => setHoveredSymbol('formatUserProfile')}
                  onMouseLeave={() => setHoveredSymbol(null)}
                  onClick={(e) => handleSymbolClick('formatUserProfile', e)}
                >
                  formatUserProfile
                  {hoveredSymbol === 'formatUserProfile' && (
                    <div className="absolute -right-1 -top-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-in fade-in-0 scale-in-95 duration-150">
                      <Search className="w-2 h-2 text-primary-foreground" />
                    </div>
                  )}
                </button>
                (user);
              </div>
              <div>{"}"}</div>
            </div>
          </div>

          {/* Status bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-vscode-blue text-white text-xs px-4 py-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>TypeScript</span>
              <span>UTF-8</span>
              <span>Ln 8, Col 23</span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="w-3 h-3" />
              <span>Navigator: Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trace popup */}
      {activeTrace && (
        <div className="trace-popup">
          <TracePopup
            symbol={activeTrace.symbol}
            position={activeTrace.position}
            onClose={closeTrace}
          />
        </div>
      )}
    </div>
  );
}