import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PatternEditor } from './components/PatternEditor';
import { TestStringViewer } from './components/TestStringViewer';
import { MatchesInspector } from './components/MatchesInspector';
import { SyntaxExplainer } from './components/SyntaxExplainer';
import { SubstitutionStudio } from './components/SubstitutionStudio';
import { CodeGeneratorModal } from './components/CodeGeneratorModal';
import { PresetsModal } from './components/PresetsModal';
import { CheatSheetModal } from './components/CheatSheetModal';
import { RegexFlags, RegexPreset } from './types';
import { executeRegex, explainRegexPattern, flagsToString, stringToFlags } from './services/regexService';
import { Sparkles, Replace, HelpCircle, Layers, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

const DEFAULT_PATTERN = '([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)';
const DEFAULT_TEST_STRING = `Welcome to RegexForge by grassroot.digital!
Test your regex patterns in real time with live color-coded match extractions.

Contact team accounts:
• Primary: support@grassroot.digital (Group 1: "support", Group 2: "grassroot.digital")
• Sales: sales@enterprise-dev.co.uk (Group 1: "sales", Group 2: "enterprise-dev.co.uk")
• Developer: alex.narwal+newsletter@gmail.com

Try loading presets or editing the pattern and flags above!`;

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'midnight' | 'light'>('dark');
  const [pattern, setPattern] = useState<string>(DEFAULT_PATTERN);
  const [flags, setFlags] = useState<RegexFlags>({
    g: true,
    i: true,
    m: false,
    s: false,
    u: false,
    y: false,
  });
  const [testString, setTestString] = useState<string>(DEFAULT_TEST_STRING);
  const [activeTab, setActiveTab] = useState<'matches' | 'explainer' | 'substitution'>('matches');
  const [activeHoverMatchIndex, setActiveHoverMatchIndex] = useState<number | null>(null);

  // Modals
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isCodeExportOpen, setIsCodeExportOpen] = useState(false);

  // Theme synchronization
  useEffect(() => {
    const savedTheme = (localStorage.getItem('grassroot_theme') as 'dark' | 'midnight' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.remove('dark', 'midnight', 'light');
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'midnight' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('grassroot_theme', newTheme);
    document.documentElement.classList.remove('dark', 'midnight', 'light');
    document.documentElement.classList.add(newTheme);
  };

  const handleSelectPreset = (preset: RegexPreset) => {
    setPattern(preset.pattern);
    setFlags(stringToFlags(preset.flags));
    setTestString(preset.testString);
  };

  const handleClearWorkspace = () => {
    setPattern('');
    setTestString('');
  };

  const parseResult = executeRegex(pattern, flags, testString);
  const explanations = explainRegexPattern(pattern, flags);
  const flagsString = flagsToString(flags);

  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary selection:bg-accent selection:text-white antialiased">
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onThemeChange={handleThemeChange}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenCodeExport={() => setIsCodeExportOpen(true)}
        onClearWorkspace={handleClearWorkspace}
      />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* 1. Pattern Editor Bar */}
        <PatternEditor
          pattern={pattern}
          flags={flags}
          onPatternChange={setPattern}
          onFlagsChange={setFlags}
          parseResult={parseResult}
        />

        {/* 2. Dual Studio Layout: Test String & Matches / Explainer / Substitution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Test String Viewer with Live Highlights */}
          <div className="lg:col-span-6 flex flex-col">
            <TestStringViewer
              testString={testString}
              onTestStringChange={setTestString}
              matches={parseResult.matches}
              activeHoverMatchIndex={activeHoverMatchIndex}
              onHoverMatch={setActiveHoverMatchIndex}
            />
          </div>

          {/* Right Column: Multi-Tab Studio */}
          <div className="lg:col-span-6 space-y-4 flex flex-col">
            {/* Tab Selector */}
            <div className="flex items-center space-x-1.5 p-1 bg-background-secondary border border-border rounded-xl shadow-sm">
              <button
                onClick={() => setActiveTab('matches')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  activeTab === 'matches'
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Matches ({parseResult.matches.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('explainer')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  activeTab === 'explainer'
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Explain Syntax</span>
              </button>

              <button
                onClick={() => setActiveTab('substitution')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  activeTab === 'substitution'
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`}
              >
                <Replace className="w-3.5 h-3.5" />
                <span>Substitution</span>
              </button>
            </div>

            {/* Active Tab View */}
            {activeTab === 'matches' && (
              <MatchesInspector
                matches={parseResult.matches}
                activeHoverMatchIndex={activeHoverMatchIndex}
                onHoverMatch={setActiveHoverMatchIndex}
              />
            )}

            {activeTab === 'explainer' && (
              <SyntaxExplainer explanations={explanations} pattern={pattern} />
            )}

            {activeTab === 'substitution' && (
              <SubstitutionStudio
                pattern={pattern}
                flags={flags}
                testString={testString}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-border py-4 mt-auto select-none text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-text-primary">RegexForge</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side In-Memory Execution</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              grassroot.digital
            </a>
            <a
              href="https://endly.grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              Endly API Client
            </a>
            <a
              href="https://tokenlens.grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              TokenLens JWT
            </a>
            <a
              href="https://jsonlens.grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              JSONLens
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      <CodeGeneratorModal
        isOpen={isCodeExportOpen}
        onClose={() => setIsCodeExportOpen(false)}
        pattern={pattern}
        flagsString={flagsString}
        testString={testString}
      />
    </div>
  );
};

export default App;
