import { useState } from "react";
import { InlineNavigator } from "./InlineNavigator";

export function DemoMockups() {
  const [activeView, setActiveView] = useState<'light' | 'dark'>('dark');

  const mockups = [
    { id: 'dark', label: 'Dark Mode (Default)' },
    { id: 'light', label: 'Light Mode' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Controls */}
      <div className="bg-muted/50 border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Navigator Extension Demo</h1>
            <p className="text-sm text-muted-foreground">
              Lightweight, inline code navigation for VS Code
            </p>
          </div>
          
          <div className="flex gap-2">
            {mockups.map((mockup) => (
              <button
                key={mockup.id}
                onClick={() => setActiveView(mockup.id as 'light' | 'dark')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeView === mockup.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border hover:bg-muted'
                }`}
              >
                {mockup.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className={`${activeView === 'light' ? 'theme-light' : ''}`}>
        <InlineNavigator />
      </div>

      {/* Instructions */}
      <div className="absolute top-20 right-4 w-72 bg-popover border border-border rounded-lg p-4 shadow-lg">
        <h3 className="font-semibold text-sm mb-2">Try the Navigator:</h3>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>• Hover over any blue function name</li>
          <li>• Click to open trace popup</li>
          <li>• Expand sections with chevrons</li>
          <li>• Notice the smooth, native feel</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs font-medium mb-1">Features:</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>✓ Inline hover detection</div>
            <div>✓ Compact trace popups</div>
            <div>✓ VS Code native styling</div>
            <div>✓ Smooth animations</div>
          </div>
        </div>
      </div>
    </div>
  );
}