import React, { useState } from 'react';
import { RegexFlags } from '../types';
import { performSubstitution } from '../services/regexService';
import { Replace, Copy, Check, Download, Sparkles, ArrowRight } from 'lucide-react';

interface SubstitutionStudioProps {
  pattern: string;
  flags: RegexFlags;
  testString: string;
}

export const SubstitutionStudio: React.FC<SubstitutionStudioProps> = ({
  pattern,
  flags,
  testString,
}) => {
  const [replacement, setReplacement] = useState<string>('[$1]');
  const [copied, setCopied] = useState(false);

  const { result, replacementsCount, error } = performSubstitution(
    pattern,
    flags,
    testString,
    replacement
  );

  const insertPlaceholder = (token: string) => {
    setReplacement((prev) => prev + token);
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'regexforge-substitution.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background-secondary border border-border rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Replace className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Substitution / String Replace Studio
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold">
            {replacementsCount} {replacementsCount === 1 ? 'replacement' : 'replacements'}
          </span>
        </div>
      </div>

      {/* Replacement Pattern Input with Placeholder Helper Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-secondary">
            Replacement Template:
          </label>
          <div className="flex items-center space-x-1.5 text-[10px] font-mono">
            <span className="text-text-muted">Quick Tokens:</span>
            <button
              onClick={() => insertPlaceholder('$1')}
              className="px-1.5 py-0.5 rounded bg-background-tertiary border border-border hover:bg-background-elevated text-accent font-bold"
              title="Insert 1st Capture Group"
            >
              $1
            </button>
            <button
              onClick={() => insertPlaceholder('$2')}
              className="px-1.5 py-0.5 rounded bg-background-tertiary border border-border hover:bg-background-elevated text-accent font-bold"
              title="Insert 2nd Capture Group"
            >
              $2
            </button>
            <button
              onClick={() => insertPlaceholder('$&')}
              className="px-1.5 py-0.5 rounded bg-background-tertiary border border-border hover:bg-background-elevated text-emerald-400 font-bold"
              title="Insert Full Match"
            >
              $&
            </button>
          </div>
        </div>

        <input
          type="text"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          placeholder="e.g. $1-$2 or <span class='highlight'>$&</span>"
          className="w-full bg-background-tertiary border border-border rounded-xl py-2.5 px-3.5 font-mono text-xs sm:text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Output Preview Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-secondary flex items-center space-x-1">
            <ArrowRight className="w-3.5 h-3.5 text-accent" />
            <span>Replaced Output Preview:</span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyResult}
              className="px-2.5 py-1 rounded-lg bg-background-tertiary hover:bg-background-elevated border border-border text-text-primary flex items-center space-x-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Result'}</span>
            </button>
            <button
              onClick={downloadResult}
              className="p-1 rounded-lg bg-background-tertiary hover:bg-background-elevated border border-border text-text-secondary hover:text-text-primary"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-background-tertiary/90 border border-border font-mono text-xs text-text-primary whitespace-pre-wrap break-words max-h-[220px] overflow-y-auto leading-relaxed">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : result ? (
            result
          ) : (
            <span className="text-text-muted italic">Result will appear here...</span>
          )}
        </div>
      </div>
    </div>
  );
};
