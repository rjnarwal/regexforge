import React, { useRef, useEffect } from 'react';
import { MatchResult } from '../types';
import { Copy, Check, Trash2, FileText, CornerDownLeft, AlignLeft } from 'lucide-react';

interface TestStringViewerProps {
  testString: string;
  onTestStringChange: (text: string) => void;
  matches: MatchResult[];
  activeHoverMatchIndex: number | null;
  onHoverMatch: (index: number | null) => void;
}

const MATCH_COLORS = [
  { bg: 'bg-emerald-500/25', border: 'border-emerald-500/50', text: 'text-emerald-300' },
  { bg: 'bg-blue-500/25', border: 'border-blue-500/50', text: 'text-blue-300' },
  { bg: 'bg-purple-500/25', border: 'border-purple-500/50', text: 'text-purple-300' },
  { bg: 'bg-amber-500/25', border: 'border-amber-500/50', text: 'text-amber-300' },
  { bg: 'bg-cyan-500/25', border: 'border-cyan-500/50', text: 'text-cyan-300' },
  { bg: 'bg-pink-500/25', border: 'border-pink-500/50', text: 'text-pink-300' },
];

export const TestStringViewer: React.FC<TestStringViewerProps> = ({
  testString,
  onTestStringChange,
  matches,
  activeHoverMatchIndex,
  onHoverMatch,
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and highlight backdrop
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(testString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Render highlighted spans inside the backdrop
  const renderHighlightedBackdrop = () => {
    if (matches.length === 0 || !testString) {
      return <span>{testString}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastOffset = 0;

    matches.forEach((m, matchIdx) => {
      // 1. Text before match
      if (m.start > lastOffset) {
        elements.push(
          <span key={`unmatched-${lastOffset}`}>
            {testString.slice(lastOffset, m.start)}
          </span>
        );
      }

      const colorStyle = MATCH_COLORS[matchIdx % MATCH_COLORS.length];
      const isHovered = activeHoverMatchIndex === m.matchIndex;

      // 2. Matched span
      elements.push(
        <mark
          key={`match-${matchIdx}-${m.start}`}
          onMouseEnter={() => onHoverMatch(m.matchIndex)}
          onMouseLeave={() => onHoverMatch(null)}
          className={`rounded px-0.5 py-0.5 font-mono cursor-pointer transition-all border ${colorStyle.bg} ${colorStyle.border} ${
            isHovered ? 'ring-2 ring-accent scale-105 shadow-md' : ''
          }`}
          style={{ backgroundColor: 'transparent' }}
        >
          <span className={`rounded px-1 py-0.5 ${colorStyle.bg} ${colorStyle.border} border`}>
            {m.fullText}
          </span>
        </mark>
      );

      lastOffset = m.end;
    });

    // 3. Trailing unmatched text
    if (lastOffset < testString.length) {
      elements.push(
        <span key={`unmatched-tail-${lastOffset}`}>
          {testString.slice(lastOffset)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="bg-background-secondary border border-border rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 flex flex-col h-full">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Test String (Payload)
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-text-muted font-mono text-[11px] hidden sm:inline">
            {testString.length} chars • {testString.split('\n').length} lines
          </span>

          <button
            onClick={copyToClipboard}
            className="px-2 py-1 rounded-lg bg-background-tertiary hover:bg-background-elevated border border-border text-text-secondary hover:text-text-primary flex items-center space-x-1 transition-colors"
            title="Copy test string"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => onTestStringChange('')}
            className="p-1 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Clear test string"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor & Highlight Container */}
      <div className="relative flex-1 min-h-[300px] rounded-xl border border-border overflow-hidden bg-background-tertiary/60">
        {/* Layer 1: Highlight Backdrop (Behind) */}
        <div
          ref={backdropRef}
          aria-hidden="true"
          className="absolute inset-0 p-4 font-mono text-xs sm:text-sm whitespace-pre-wrap break-words overflow-auto pointer-events-none text-transparent leading-relaxed"
          style={{ wordBreak: 'break-word' }}
        >
          {renderHighlightedBackdrop()}
        </div>

        {/* Layer 2: Interactive Textarea (In Front) */}
        <textarea
          ref={textareaRef}
          value={testString}
          onChange={(e) => onTestStringChange(e.target.value)}
          onScroll={handleScroll}
          placeholder="Paste or type test text here to run live regular expression matching..."
          className="relative z-10 w-full h-full bg-transparent p-4 font-mono text-xs sm:text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none resize-none leading-relaxed"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
