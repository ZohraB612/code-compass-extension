import { useState } from "react";
import { AlertTriangle, FileText, Package, Globe, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImpactAnalysisProps {
  target: string;
}

interface ImpactItem {
  name: string;
  file: string;
  line?: number;
  type: "function" | "component" | "service" | "api" | "test";
  severity: "high" | "medium" | "low";
  description: string;
}

interface ImpactCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: ImpactItem[];
  isOpen: boolean;
}

export function ImpactAnalysis({ target }: ImpactAnalysisProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    direct: true,
    indirect: false,
    external: false,
    tests: false,
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getSeverityBadge = (severity: ImpactItem["severity"]) => {
    const classes = {
      high: "impact-high",
      medium: "impact-medium", 
      low: "impact-low",
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded font-mono border ${classes[severity]}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  const getTypeIcon = (type: ImpactItem["type"]) => {
    switch (type) {
      case "function":
        return FileText;
      case "component":
        return Package;
      case "service":
        return Globe;
      case "api":
        return Globe;
      case "test":
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const impactCategories: ImpactCategory[] = [
    {
      id: "direct",
      title: "Direct Dependencies",
      icon: AlertTriangle,
      isOpen: openSections.direct,
      items: [
        {
          name: "ProfileComponent",
          file: "src/pages/Profile.tsx",
          line: 23,
          type: "component",
          severity: "high",
          description: "Main profile page component - breaking change will affect user profile display",
        },
        {
          name: "UserCard",
          file: "src/components/UserCard.tsx",
          line: 45,
          type: "component",
          severity: "high",
          description: "User card widget used across dashboard and search results",
        },
        {
          name: "GET /api/users/:id",
          file: "src/api/routes/users.ts",
          line: 67,
          type: "api",
          severity: "medium",
          description: "Public API endpoint - changes may affect external consumers",
        },
      ],
    },
    {
      id: "indirect",
      title: "Indirect Dependencies",
      icon: Package,
      isOpen: openSections.indirect,
      items: [
        {
          name: "Dashboard",
          file: "src/pages/Dashboard.tsx",
          line: 89,
          type: "component",
          severity: "medium",
          description: "Dashboard uses UserCard which depends on getUserProfile",
        },
        {
          name: "SearchResults",
          file: "src/components/SearchResults.tsx",
          line: 156,
          type: "component",
          severity: "low",
          description: "Search results display user cards for matching users",
        },
        {
          name: "NotificationService",
          file: "src/services/notifications.ts",
          line: 234,
          type: "service",
          severity: "low",
          description: "Fetches user data for notification personalization",
        },
      ],
    },
    {
      id: "external",
      title: "External Impact",
      icon: Globe,
      isOpen: openSections.external,
      items: [
        {
          name: "Mobile App",
          file: "mobile-app/api-client.ts",
          type: "api",
          severity: "medium",
          description: "Mobile application consumes /api/users/:id endpoint",
        },
        {
          name: "Analytics Pipeline",
          file: "analytics/user-events.js",
          type: "service",
          severity: "low",
          description: "Analytics service tracks profile view events",
        },
      ],
    },
    {
      id: "tests",
      title: "Test Coverage",
      icon: AlertTriangle,
      isOpen: openSections.tests,
      items: [
        {
          name: "getUserProfile.test.ts",
          file: "tests/services/user.test.ts",
          line: 45,
          type: "test",
          severity: "high",
          description: "Unit tests for getUserProfile function - 15 test cases",
        },
        {
          name: "profile-integration.test.ts",
          file: "tests/integration/profile.test.ts",
          line: 23,
          type: "test",
          severity: "medium",
          description: "Integration tests for profile page functionality",
        },
      ],
    },
  ];

  const totalImpacts = impactCategories.reduce((sum, category) => sum + category.items.length, 0);
  const highSeverityCount = impactCategories.flatMap(c => c.items).filter(item => item.severity === "high").length;

  return (
    <div className="space-y-0">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="syntax-function">{target}()</span>
          <span className="text-xs text-muted-foreground">Impact Analysis</span>
        </h3>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <span className="text-muted-foreground">
            {totalImpacts} dependencies found
          </span>
          {highSeverityCount > 0 && (
            <span className="flex items-center gap-1 text-vscode-red">
              <AlertTriangle className="w-3 h-3" />
              {highSeverityCount} high-severity impacts
            </span>
          )}
        </div>
      </div>

      {impactCategories.map((category) => {
        const Icon = category.icon;
        const ChevronIcon = category.isOpen ? ChevronDown : ChevronRight;
        
        return (
          <div key={category.id} className="navigator-section">
            <div 
              className="navigator-section-header"
              onClick={() => toggleSection(category.id)}
            >
              <div className="flex items-center gap-2">
                <ChevronIcon className="w-4 h-4" />
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.title}</span>
                <span className="text-xs text-muted-foreground">
                  ({category.items.length})
                </span>
              </div>
            </div>
            
            <div 
              className={`navigator-section-content ${
                category.isOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="p-3 space-y-3">
                {category.items.map((item, index) => {
                  const TypeIcon = getTypeIcon(item.type);
                  
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-2 rounded hover:bg-muted/30 cursor-pointer"
                    >
                      <TypeIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm text-vscode-blue">
                            {item.name}
                          </span>
                          {getSeverityBadge(item.severity)}
                        </div>
                        
                        <div className="text-xs text-muted-foreground font-mono">
                          {item.file}
                          {item.line && `:${item.line}`}
                        </div>
                        
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <div className="p-4 border-t border-border space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-vscode-red/10 rounded">
            <div className="font-mono text-vscode-red font-semibold">
              {impactCategories.flatMap(c => c.items).filter(i => i.severity === "high").length}
            </div>
            <div className="text-muted-foreground">High Risk</div>
          </div>
          <div className="text-center p-2 bg-vscode-orange/10 rounded">
            <div className="font-mono text-vscode-orange font-semibold">
              {impactCategories.flatMap(c => c.items).filter(i => i.severity === "medium").length}
            </div>
            <div className="text-muted-foreground">Medium Risk</div>
          </div>
          <div className="text-center p-2 bg-vscode-green/10 rounded">
            <div className="font-mono text-vscode-green font-semibold">
              {impactCategories.flatMap(c => c.items).filter(i => i.severity === "low").length}
            </div>
            <div className="text-muted-foreground">Low Risk</div>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          Generate Impact Report
        </Button>
      </div>
    </div>
  );
}