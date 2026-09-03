export interface RegexFlags {
  g: boolean; // Global
  i: boolean; // Ignore Case
  m: boolean; // Multiline
  s: boolean; // DotAll
  u: boolean; // Unicode
  y: boolean; // Sticky
}

export interface CaptureGroup {
  index: number;
  name?: string;
  text: string;
  start: number;
  end: number;
}

export interface MatchResult {
  matchIndex: number;
  start: number;
  end: number;
  fullText: string;
  groups: CaptureGroup[];
}

export interface RegexParseResult {
  isValid: boolean;
  error?: string;
  matches: MatchResult[];
  executionTimeMs: number;
}

export interface RegexTokenExplanation {
  id: string;
  token: string;
  type: 'anchor' | 'character_class' | 'quantifier' | 'group' | 'lookaround' | 'literal' | 'escape' | 'flag';
  title: string;
  description: string;
  example?: string;
}

export interface RegexPreset {
  id: string;
  title: string;
  category: 'web' | 'security' | 'identifiers' | 'formatting' | 'network';
  pattern: string;
  flags: string;
  testString: string;
  description: string;
}

export interface CodeSnippet {
  language: 'kotlin' | 'java' | 'typescript' | 'python' | 'go' | 'rust';
  title: string;
  code: string;
}
