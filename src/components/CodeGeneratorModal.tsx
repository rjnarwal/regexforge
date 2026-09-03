import React, { useState } from 'react';
import { generateCodeSnippets } from '../services/regexService';
import { X, Code2, Copy, Check, Terminal, Layers } from 'lucide-react';

interface CodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pattern: string;
  flagsString: string;
  testString: string;
}

export const CodeGeneratorModal: React.FC<CodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  pattern,
  flagsString,
  testString,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>('kotlin');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const snippets = generateCodeSnippets(pattern, flagsString, testString);
  const activeSnippet = snippets.find((s) => s.language === selectedLang) || snippets[0];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
      <div className="bg-background-elevated border border-border rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background-secondary">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary">
                Multi-Language Code Generator
              </h3>
              <p className="text-[11px] text-text-muted">
                Production-ready regex integration code for your target stack
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-tertiary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center space-x-1.5 px-6 py-3 border-b border-border bg-background-secondary/60 overflow-x-auto">
          {snippets.map((snip) => (
            <button
              key={snip.language}
              onClick={() => setSelectedLang(snip.language)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLang === snip.language
                  ? 'bg-accent text-white shadow-md shadow-accent/20 scale-[1.02]'
                  : 'bg-background-tertiary text-text-muted hover:text-text-primary hover:bg-background-elevated'
              }`}
            >
              {snip.title}
            </button>
          ))}
        </div>

        {/* Code Content View */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
              Target: {activeSnippet.title}
            </span>
            <button
              onClick={copyCode}
              className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 hover:opacity-90 flex items-center space-x-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code Snippet'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-background-tertiary border border-border font-mono text-xs text-text-primary overflow-x-auto leading-relaxed whitespace-pre">
            {activeSnippet.code}
          </div>
        </div>
      </div>
    </div>
  );
};
