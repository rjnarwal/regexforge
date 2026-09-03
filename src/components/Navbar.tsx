import React from 'react';
import {
  Sparkles,
  ExternalLink,
  Moon,
  Sun,
  BookOpen,
  Code2,
  Trash2,
  Share2,
  Zap,
  KeyRound,
  FileCode2,
  Home,
  CheckCircle2,
  Sliders,
  Layers,
} from 'lucide-react';

import { isDesktopEnvironment, isMacDesktopEnvironment } from '../utils/platform';

interface NavbarProps {
  theme: 'dark' | 'midnight' | 'light';
  onThemeChange: (theme: 'dark' | 'midnight' | 'light') => void;
  onOpenPresets: () => void;
  onOpenCheatSheet: () => void;
  onOpenCodeExport: () => void;
  onClearWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  onOpenPresets,
  onOpenCheatSheet,
  onOpenCodeExport,
  onClearWorkspace,
}) => {
  const isDesktop = isDesktopEnvironment();
  const isMac = isMacDesktopEnvironment();

  return (
    <header className={`bg-background-secondary border-b border-border select-none sticky top-0 z-40 app-drag-region ${
      isMac ? 'pl-24 pr-4' : 'px-4'
    }`}>
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
        {/* Left: Brand & Product Info */}
        <div className="flex items-center space-x-3 no-drag">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <span className="font-mono font-black text-xs tracking-tighter">.*</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-bold text-sm tracking-tight text-text-primary">
                  RegexForge
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                  Visual Studio
                </span>
              </div>
              <span className="text-[10px] text-text-muted font-mono -mt-0.5">
                by grassroot.digital
              </span>
            </div>
          </div>

          {/* Grassroot Digital Home Link (Shown ONLY on Web, hidden on Desktop App) */}
          {!isDesktop && (
            <div className="hidden lg:flex items-center space-x-1 pl-4 border-l border-border/80 text-xs">
              <a
                href="https://grassroot.digital"
                className="px-2.5 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors flex items-center space-x-1"
                title="Return to Grassroot Digital Welcome Hub"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>Home</span>
              </a>
            </div>
          )}
        </div>

        {/* Right: Actions, Presets, Code Export, Theme Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3 no-drag">
          {/* Presets Button */}
          <button
            onClick={onOpenPresets}
            className="px-2.5 py-1.5 rounded-lg bg-background-tertiary hover:bg-background-elevated border border-border text-xs text-text-primary font-medium flex items-center space-x-1.5 transition-all shadow-sm"
            title="Load Curated Regex Presets"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Presets Library</span>
          </button>

          {/* Cheat Sheet Button */}
          <button
            onClick={onOpenCheatSheet}
            className="px-2.5 py-1.5 rounded-lg bg-background-tertiary hover:bg-background-elevated border border-border text-xs text-text-primary font-medium flex items-center space-x-1.5 transition-all shadow-sm"
            title="Open Regex Syntax Quick Cheat Sheet"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Cheat Sheet</span>
          </button>

          {/* Code Export Button */}
          <button
            onClick={onOpenCodeExport}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-400 font-medium flex items-center space-x-1.5 transition-all shadow-sm"
            title="Generate Code for Kotlin, Java, TS, Python, Go"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Code</span>
          </button>

          {/* Desktop App Download (Only on Web) */}
          {!isDesktop && (
            <a
              href="https://github.com/rjnarwal/regexforge/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-xs text-emerald-400 font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Download RegexForge Native Desktop App (Mac / Windows / Linux)"
            >
              <span className="hidden sm:inline">Desktop App ▾</span>
              <span className="sm:hidden">App ▾</span>
            </a>
          )}

          {/* Clear Workspace */}
          <button
            onClick={onClearWorkspace}
            className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Clear Pattern & Test String"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <div className="flex items-center bg-background-tertiary border border-border rounded-xl p-0.5 shadow-sm">
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'dark' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('midnight')}
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                theme === 'midnight' ? 'bg-blue-600 text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
              title="Midnight Navy Theme"
            >
              Navy
            </button>
            <button
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'light' ? 'bg-amber-500 text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
              title="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
