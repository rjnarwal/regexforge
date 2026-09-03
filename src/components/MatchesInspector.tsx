import React, { useState } from 'react';
import { MatchResult, CaptureGroup } from '../types';
import { Layers, Copy, Check, ChevronDown, ChevronRight, Hash, Sparkles, Tag } from 'lucide-react';

interface MatchesInspectorProps {
  matches: MatchResult[];
  activeHoverMatchIndex: number | null;
  onHoverMatch: (index: number | null) => void;
}

const MATCH_COLORS = [
  { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500 text-white' },
  { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500 text-white' },
  { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500 text-white' },
  { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500 text-white' },
  { bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', text: 'text-cyan-400', badge: 'bg-cyan-500 text-white' },
  { bg: 'bg-pink-500/15', border: 'border-pink-500/30', text: 'text-pink-400', badge: 'bg-pink-500 text-white' },
];

export const MatchesInspector: React.FC<MatchesInspectorProps> = ({
  matches,
  activeHoverMatchIndex,
  onHoverMatch,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set([1, 2, 3]));

  const toggleExpand = (matchIndex: number) => {
    const next = new Set(expandedIndices);
    if (next.has(matchIndex)) {
      next.delete(matchIndex);
    } else {
      next.add(matchIndex);
    }
    setExpandedIndices(next);
  };

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Compute total captured groups across all matches
  const totalGroups = matches.reduce((acc, m) => acc + m.groups.length, 0);

  return (
    <div className="bg-background-secondary border border-border rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 flex flex-col h-full">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Matches & Capture Groups ({matches.length})
          </span>
        </div>

        {matches.length > 0 && (
          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded-full bg-background-tertiary text-text-secondary border border-border">
              {totalGroups} groups
            </span>
          </div>
        )}
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[500px] pr-1">
        {matches.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-border rounded-xl text-text-muted space-y-2">
            <Sparkles className="w-6 h-6 mx-auto text-text-muted/40" />
            <p className="text-xs">No matches found in the current test string.</p>
            <p className="text-[11px] text-text-muted/70">
              Adjust your pattern or test string to see real-time match extractions.
            </p>
          </div>
        ) : (
          matches.map((m, idx) => {
            const color = MATCH_COLORS[idx % MATCH_COLORS.length];
            const isHovered = activeHoverMatchIndex === m.matchIndex;
            const isExpanded = expandedIndices.has(m.matchIndex);

            return (
              <div
                key={m.matchIndex}
                onMouseEnter={() => onHoverMatch(m.matchIndex)}
                onMouseLeave={() => onHoverMatch(null)}
                className={`rounded-xl border transition-all overflow-hidden ${color.border} ${
                  isHovered ? 'ring-2 ring-accent shadow-md bg-background-tertiary' : 'bg-background-tertiary/60'
                }`}
              >
                {/* Match Summary Bar */}
                <div
                  onClick={() => toggleExpand(m.matchIndex)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-background-elevated/40 transition-colors"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${color.badge}`}>
                      #{m.matchIndex}
                    </span>

                    <span className="font-mono text-xs font-semibold text-text-primary truncate max-w-[200px] sm:max-w-[280px]">
                      "{m.fullText}"
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
                    <span className="text-text-muted text-[10px]">
                      [{m.start}:{m.end}] ({m.fullText.length} chars)
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyText(`match-${m.matchIndex}`, m.fullText);
                      }}
                      className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-background-secondary"
                      title="Copy full match"
                    >
                      {copiedKey === `match-${m.matchIndex}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {m.groups.length > 0 && (
                      <div className="text-text-muted">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Capture Groups Details */}
                {isExpanded && m.groups.length > 0 && (
                  <div className="px-3 pb-3 pt-1 border-t border-border/40 space-y-2 bg-background-secondary/40 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Capture Groups ({m.groups.length})
                    </div>

                    <div className="space-y-1.5">
                      {m.groups.map((grp) => (
                        <div
                          key={`grp-${grp.index}-${grp.name || ''}`}
                          className="p-2 rounded-lg bg-background-tertiary border border-border/60 flex items-center justify-between font-mono"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="px-1.5 py-0.2 rounded bg-background-elevated border border-border text-[10px] font-bold text-accent">
                              {grp.name ? `$<${grp.name}>` : `Group ${grp.index}`}
                            </span>
                            <span className="text-text-primary font-semibold text-xs truncate max-w-[180px] sm:max-w-[260px]">
                              "{grp.text}"
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5 text-[10px] text-text-muted shrink-0">
                            <span>[{grp.start}:{grp.end}]</span>
                            <button
                              type="button"
                              onClick={() => copyText(`grp-${m.matchIndex}-${grp.index}`, grp.text)}
                              className="p-1 rounded text-text-muted hover:text-text-primary"
                              title="Copy group text"
                            >
                              {copiedKey === `grp-${m.matchIndex}-${grp.index}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
