import React, { useState } from 'react';
import { X, BookOpen, Search, Copy, Check } from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToken?: (token: string) => void;
}

interface CheatItem {
  token: string;
  name: string;
  description: string;
  example: string;
}

interface CheatCategory {
  category: string;
  items: CheatItem[];
}

const CHEAT_DATA: CheatCategory[] = [
  {
    category: 'Character Classes',
    items: [
      { token: '.', name: 'Wildcard Dot', description: 'Matches any single character except newline (\\n)', example: 'a.c matches "abc", "a9c"' },
      { token: '\\d', name: 'Digit', description: 'Matches any digit character [0-9]', example: '\\d+ matches "42", "2026"' },
      { token: '\\D', name: 'Non-Digit', description: 'Matches any character that is not a digit [^0-9]', example: '\\D+ matches "Hello"' },
      { token: '\\w', name: 'Word Character', description: 'Matches any alphanumeric character or underscore [a-zA-Z0-9_]', example: '\\w+ matches "user_name123"' },
      { token: '\\W', name: 'Non-Word Character', description: 'Matches any non-alphanumeric character', example: '\\W matches "@", "#", " "' },
      { token: '\\s', name: 'Whitespace', description: 'Matches spaces, tabs, newlines, carriage returns', example: '\\s+ matches "   "' },
      { token: '\\S', name: 'Non-Whitespace', description: 'Matches any non-whitespace character', example: '\\S+ matches "word"' },
      { token: '[abc]', name: 'Character Set', description: 'Matches any character inside brackets', example: '[aeiou] matches vowel' },
      { token: '[^abc]', name: 'Negated Set', description: 'Matches any character NOT inside brackets', example: '[^0-9] matches non-digits' },
      { token: '[a-z]', name: 'Character Range', description: 'Matches any character between a and z inclusive', example: '[A-Z] matches uppercase' },
    ],
  },
  {
    category: 'Quantifiers & Repetition',
    items: [
      { token: '+', name: 'One or More', description: 'Matches 1 or more of preceding token (greedy)', example: 'a+ matches "a", "aaaa"' },
      { token: '*', name: 'Zero or More', description: 'Matches 0 or more of preceding token (greedy)', example: 'a* matches "", "aaa"' },
      { token: '?', name: 'Optional / Zero or One', description: 'Matches 0 or 1 of preceding token', example: 'https? matches "http", "https"' },
      { token: '{3}', name: 'Exact Count', description: 'Matches exactly 3 of preceding token', example: '\\d{4} matches "2026"' },
      { token: '{2,5}', name: 'Range Count', description: 'Matches between 2 and 5 of preceding token', example: 'a{2,4} matches "aa", "aaaa"' },
      { token: '{2,}', name: 'Minimum Count', description: 'Matches at least 2 of preceding token', example: '\\d{2,} matches "99", "1000"' },
      { token: '+?', name: 'Lazy / Non-Greedy', description: 'Matches as few characters as possible', example: '<.+?> matches "<p>" in "<p>hi</p>"' },
    ],
  },
  {
    category: 'Anchors & Boundaries',
    items: [
      { token: '^', name: 'Start Anchor', description: 'Matches the beginning of string or line (with m flag)', example: '^Hello matches only at start' },
      { token: '$', name: 'End Anchor', description: 'Matches the end of string or line (with m flag)', example: 'end$ matches only at end' },
      { token: '\\b', name: 'Word Boundary', description: 'Matches position between a \\w and \\W or start/end of string', example: '\\bcat\\b matches "cat" but not "catch"' },
      { token: '\\B', name: 'Non-Word Boundary', description: 'Matches position that is NOT a word boundary', example: '\\Bcat matches "certificate"' },
    ],
  },
  {
    category: 'Groups & Lookarounds',
    items: [
      { token: '(...)', name: 'Capture Group', description: 'Captures matching sub-expression into indexed group $1, $2', example: '(\\d{4})-(\\d{2})' },
      { token: '(?<name>...)', name: 'Named Capture Group', description: 'Captures sub-expression into group variable name', example: '(?<year>\\d{4})' },
      { token: '(?:...)', name: 'Non-Capturing Group', description: 'Groups expressions together without saving capture index', example: '(?:https|http)' },
      { token: '(?=...)', name: 'Positive Lookahead', description: 'Asserts following characters match pattern without consuming', example: '\\d+(?=px) matches "10" in "10px"' },
      { token: '(?!...)', name: 'Negative Lookahead', description: 'Asserts following characters do NOT match pattern', example: 'q(?!u) matches "q" not followed by "u"' },
      { token: '(?<=...)', name: 'Positive Lookbehind', description: 'Asserts preceding characters match pattern', example: '(?<=\\$)\\d+ matches "100" in "$100"' },
      { token: '(?<!...)', name: 'Negative Lookbehind', description: 'Asserts preceding characters do NOT match pattern', example: '(?<!\\$)\\d+ matches "100" in "€100"' },
      { token: 'a|b', name: 'Alternation (OR)', description: 'Matches expression on left OR right', example: 'cat|dog matches "cat" or "dog"' },
    ],
  },
];

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  isOpen,
  onClose,
  onInsertToken,
}) => {
  const [search, setSearch] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
      <div className="bg-background-elevated border border-border rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background-secondary">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary">
                Regex Syntax Quick Cheat Sheet
              </h3>
              <p className="text-[11px] text-text-muted">
                Essential tokens, character classes, anchors, quantifiers & lookarounds
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

        {/* Search */}
        <div className="p-4 border-b border-border bg-background-secondary/50">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cheat sheet tokens (e.g. lookahead, digit, boundary)..."
              className="w-full pl-9 pr-4 py-2 bg-background-tertiary border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 max-h-[520px]">
          {CHEAT_DATA.map((cat) => {
            const filteredItems = cat.items.filter(
              (it) =>
                it.name.toLowerCase().includes(search.toLowerCase()) ||
                it.token.toLowerCase().includes(search.toLowerCase()) ||
                it.description.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={cat.category} className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {cat.category}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {filteredItems.map((item) => (
                    <div
                      key={item.token}
                      className="p-3 rounded-xl bg-background-tertiary/70 border border-border flex items-start justify-between gap-3 hover:border-accent/40 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <code className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-background-elevated border border-border text-emerald-400">
                            {item.token}
                          </code>
                          <span className="font-heading font-semibold text-xs text-text-primary">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-normal">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-text-muted font-mono">
                          Example: {item.example}
                        </p>
                      </div>

                      <button
                        onClick={() => copyToken(item.token)}
                        className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-text-muted hover:text-text-primary border border-border shrink-0 transition-colors"
                        title="Copy token"
                      >
                        {copiedToken === item.token ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
