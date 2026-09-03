import React, { useState } from 'react';
import { REGEX_PRESETS } from '../services/presets';
import { RegexPreset } from '../types';
import { X, Sparkles, Search, ArrowRight, Layers, Tag } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: RegexPreset) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Presets' },
    { id: 'web', label: 'Web & URLs' },
    { id: 'security', label: 'Security & Auth' },
    { id: 'identifiers', label: 'UUID & SemVer' },
    { id: 'formatting', label: 'Formatting & Dates' },
    { id: 'network', label: 'Networking & IPs' },
  ];

  const filtered = REGEX_PRESETS.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.pattern.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
      <div className="bg-background-elevated border border-border rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background-secondary">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary">
                Curated Regex Presets Library
              </h3>
              <p className="text-[11px] text-text-muted">
                Battle-tested regular expressions for production applications
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

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-border bg-background-secondary/50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search presets by name, token, or use-case..."
              className="w-full pl-9 pr-4 py-2 bg-background-tertiary border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-background-tertiary text-text-muted hover:text-text-primary hover:bg-background-elevated'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Presets Grid */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3 max-h-[500px]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-xs">
              No presets matching your search query.
            </div>
          ) : (
            filtered.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="p-4 rounded-xl bg-background-tertiary/70 border border-border hover:border-accent hover:bg-background-tertiary transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-text-primary group-hover:text-accent transition-colors">
                      {preset.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-background-elevated border border-border text-text-muted uppercase">
                      /{preset.flags}/
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-normal">
                    {preset.description}
                  </p>
                  <div className="p-1.5 rounded bg-background-elevated border border-border/60 font-mono text-[11px] text-emerald-400 truncate mt-1">
                    /{preset.pattern}/{preset.flags}
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 group-hover:scale-105 transition-transform flex items-center space-x-1 shrink-0 self-start sm:self-center"
                >
                  <span>Load Preset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
