import React from 'react';
import { RegexFlags, RegexParseResult } from '../types';
import { flagsToString } from '../services/regexService';
import { AlertCircle, CheckCircle2, Clock, Zap, Info } from 'lucide-react';

interface PatternEditorProps {
  pattern: string;
  flags: RegexFlags;
  onPatternChange: (pattern: string) => void;
  onFlagsChange: (flags: RegexFlags) => void;
  parseResult: RegexParseResult;
}

const FLAG_CONFIGS: { key: keyof RegexFlags; label: string; tooltip: string }[] = [
  { key: 'g', label: 'g', tooltip: 'Global: match all occurrences' },
  { key: 'i', label: 'i', tooltip: 'Case-insensitive: ignore uppercase/lowercase' },
  { key: 'm', label: 'm', tooltip: 'Multiline: ^ and $ match line starts and ends' },
  { key: 's', label: 's', tooltip: 'DotAll: dot (.) matches newline (\\n)' },
  { key: 'u', label: 'u', tooltip: 'Unicode: enable full unicode code points' },
  { key: 'y', label: 'y', tooltip: 'Sticky: match only from target lastIndex' },
];

export const PatternEditor: React.FC<PatternEditorProps> = ({
  pattern,
  flags,
  onPatternChange,
  onFlagsChange,
  parseResult,
}) => {
  const toggleFlag = (key: keyof RegexFlags) => {
    onFlagsChange({
      ...flags,
      [key]: !flags[key],
    });
  };

  return (
    <div className="bg-background-secondary border border-border rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Regular Expression Pattern</span>
          </span>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          {parseResult.isValid ? (
            <>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  {parseResult.matches.length} {parseResult.matches.length === 1 ? 'match' : 'matches'}
                </span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-background-tertiary text-text-muted border border-border flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{parseResult.executionTimeMs} ms</span>
              </span>
            </>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 flex items-center space-x-1 font-semibold">
              <AlertCircle className="w-3 h-3" />
              <span>Pattern Error</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Pattern Input Bar with Regex Delimiters */}
      <div
        className={`flex items-center bg-background-tertiary/90 border-2 rounded-xl transition-all overflow-hidden ${
          !parseResult.isValid
            ? 'border-red-500/70 focus-within:border-red-500'
            : 'border-border hover:border-accent/40 focus-within:border-accent'
        }`}
      >
        <span className="px-3.5 text-text-muted font-mono text-lg font-bold select-none opacity-60">/</span>

        <input
          type="text"
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          placeholder="Enter regular expression pattern (e.g. ([a-z0-9_.-]+)@([a-z0-9-]+)\.([a-z.]+))"
          className="flex-1 bg-transparent py-3 px-1 text-sm sm:text-base font-mono text-text-primary placeholder:text-text-muted/50 focus:outline-none"
          spellCheck={false}
          autoComplete="off"
        />

        <span className="px-2 text-text-muted font-mono text-lg font-bold select-none opacity-60">/</span>

        {/* Flag Selector Pills */}
        <div className="flex items-center space-x-1 pr-3 pl-1 border-l border-border/80">
          {FLAG_CONFIGS.map((cfg) => {
            const isActive = flags[cfg.key];
            return (
              <button
                key={cfg.key}
                type="button"
                onClick={() => toggleFlag(cfg.key)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105'
                    : 'bg-background-secondary text-text-muted hover:text-text-primary hover:bg-background-elevated'
                }`}
                title={cfg.tooltip}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Syntax Error Message (if any) */}
      {!parseResult.isValid && parseResult.error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start space-x-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Regex Error:</strong> {parseResult.error}
          </div>
        </div>
      )}
    </div>
  );
};
