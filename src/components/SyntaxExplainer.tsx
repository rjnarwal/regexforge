import React from 'react';
import { RegexTokenExplanation } from '../types';
import { HelpCircle, Anchor, Layers, CheckSquare, Eye, Sparkles, Terminal } from 'lucide-react';

interface SyntaxExplainerProps {
  explanations: RegexTokenExplanation[];
  pattern: string;
}

const TYPE_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  anchor: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', label: 'Anchor' },
  character_class: { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', label: 'Char Class' },
  quantifier: { bg: 'bg-purple-500/15 border-purple-500/30', text: 'text-purple-400', label: 'Quantifier' },
  group: { bg: 'bg-blue-500/15 border-blue-500/30', text: 'text-blue-400', label: 'Group' },
  lookaround: { bg: 'bg-cyan-500/15 border-cyan-500/30', text: 'text-cyan-400', label: 'Lookaround' },
  escape: { bg: 'bg-orange-500/15 border-orange-500/30', text: 'text-orange-400', label: 'Escape' },
  literal: { bg: 'bg-slate-500/15 border-slate-500/30', text: 'text-slate-300', label: 'Literal' },
  flag: { bg: 'bg-pink-500/15 border-pink-500/30', text: 'text-pink-400', label: 'Flags' },
};

export const SyntaxExplainer: React.FC<SyntaxExplainerProps> = ({ explanations, pattern }) => {
  return (
    <div className="bg-background-secondary border border-border rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Regex Syntax Explainer & Tree Breakdown
          </span>
        </div>
        <span className="text-[11px] font-mono text-text-muted">
          {explanations.length} tokens parsed
        </span>
      </div>

      {explanations.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-border rounded-xl text-text-muted text-xs">
          Enter a regular expression above to view a step-by-step human explanation of its syntax.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
          {explanations.map((item) => {
            const badge = TYPE_BADGES[item.type] || TYPE_BADGES.literal;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-background-tertiary/70 border border-border hover:border-accent/40 transition-colors space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-background-elevated border border-border text-accent truncate max-w-[200px]">
                    {item.token}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold shrink-0 ${badge.bg} ${badge.text}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-xs text-text-primary">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-normal mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
