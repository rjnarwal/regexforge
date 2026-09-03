import { RegexFlags, RegexParseResult, MatchResult, CaptureGroup, RegexTokenExplanation, CodeSnippet } from '../types';

export function flagsToString(flags: RegexFlags): string {
  let str = '';
  if (flags.g) str += 'g';
  if (flags.i) str += 'i';
  if (flags.m) str += 'm';
  if (flags.s) str += 's';
  if (flags.u) str += 'u';
  if (flags.y) str += 'y';
  return str;
}

export function stringToFlags(flagStr: string): RegexFlags {
  return {
    g: flagStr.includes('g'),
    i: flagStr.includes('i'),
    m: flagStr.includes('m'),
    s: flagStr.includes('s'),
    u: flagStr.includes('u'),
    y: flagStr.includes('y'),
  };
}

export function executeRegex(pattern: string, flags: RegexFlags, testString: string): RegexParseResult {
  const startTime = performance.now();

  if (!pattern) {
    return {
      isValid: true,
      matches: [],
      executionTimeMs: 0,
    };
  }

  try {
    const flagStr = flagsToString(flags);
    const regex = new RegExp(pattern, flagStr);
    const matches: MatchResult[] = [];

    if (flags.g) {
      let match: RegExpExecArray | null;
      let lastIndex = -1;
      let iterations = 0;
      const maxIterations = 5000; // Protection against infinite loops on zero-length matches

      while ((match = regex.exec(testString)) !== null) {
        iterations++;
        if (iterations > maxIterations) break;

        const fullText = match[0];
        const matchStart = match.index;
        const matchEnd = matchStart + fullText.length;

        const groups: CaptureGroup[] = [];
        // Capture group indices start from 1
        for (let i = 1; i < match.length; i++) {
          const groupText = match[i];
          if (groupText !== undefined) {
            // Find start offset of this group inside full match
            const groupOffsetInMatch = fullText.indexOf(groupText);
            const groupStart = groupOffsetInMatch !== -1 ? matchStart + groupOffsetInMatch : matchStart;
            const groupEnd = groupStart + groupText.length;

            groups.push({
              index: i,
              text: groupText,
              start: groupStart,
              end: groupEnd,
            });
          }
        }

        // Check for named groups
        if (match.groups) {
          Object.entries(match.groups).forEach(([name, text]) => {
            if (text !== undefined) {
              const existing = groups.find((g) => g.text === text);
              if (existing) {
                existing.name = name;
              } else {
                groups.push({
                  index: groups.length + 1,
                  name,
                  text,
                  start: matchStart,
                  end: matchEnd,
                });
              }
            }
          });
        }

        matches.push({
          matchIndex: matches.length + 1,
          start: matchStart,
          end: matchEnd,
          fullText,
          groups,
        });

        // Avoid infinite loop on zero-length matches like /^/g
        if (regex.lastIndex === lastIndex) {
          regex.lastIndex++;
        }
        lastIndex = regex.lastIndex;

        if (fullText.length === 0 && regex.lastIndex >= testString.length) {
          break;
        }
      }
    } else {
      // Non-global match
      const match = regex.exec(testString);
      if (match) {
        const fullText = match[0];
        const matchStart = match.index;
        const matchEnd = matchStart + fullText.length;

        const groups: CaptureGroup[] = [];
        for (let i = 1; i < match.length; i++) {
          const groupText = match[i];
          if (groupText !== undefined) {
            const groupOffsetInMatch = fullText.indexOf(groupText);
            const groupStart = groupOffsetInMatch !== -1 ? matchStart + groupOffsetInMatch : matchStart;
            groups.push({
              index: i,
              text: groupText,
              start: groupStart,
              end: groupStart + groupText.length,
            });
          }
        }

        if (match.groups) {
          Object.entries(match.groups).forEach(([name, text]) => {
            if (text !== undefined) {
              const existing = groups.find((g) => g.text === text);
              if (existing) {
                existing.name = name;
              } else {
                groups.push({
                  index: groups.length + 1,
                  name,
                  text,
                  start: matchStart,
                  end: matchEnd,
                });
              }
            }
          });
        }

        matches.push({
          matchIndex: 1,
          start: matchStart,
          end: matchEnd,
          fullText,
          groups,
        });
      }
    }

    const endTime = performance.now();
    return {
      isValid: true,
      matches,
      executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      isValid: false,
      error: err.message || 'Invalid regular expression pattern',
      matches: [],
      executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
    };
  }
}

export function performSubstitution(
  pattern: string,
  flags: RegexFlags,
  testString: string,
  replacement: string
): { result: string; replacementsCount: number; error?: string } {
  if (!pattern) {
    return { result: testString, replacementsCount: 0 };
  }

  try {
    const flagStr = flagsToString(flags);
    const regex = new RegExp(pattern, flagStr);
    let count = 0;

    const result = testString.replace(regex, (...args) => {
      count++;
      // Custom replacement processing if needed or default string replace
      let rep = replacement;
      // Handle $1, $2 group replacements
      const match = args[0];
      const offset = args[args.length - 2];
      const namedGroups = typeof args[args.length - 1] === 'object' ? args[args.length - 1] : undefined;

      rep = rep.replace(/\$(&|`|'|\$|\d+|<[^>]+>)/g, (m, token) => {
        if (token === '&') return match;
        if (token === '$') return '$';
        if (token === '`') return testString.slice(0, offset);
        if (token === "'") return testString.slice(offset + match.length);
        if (/^\d+$/.test(token)) {
          const grpIndex = parseInt(token, 10);
          return args[grpIndex] !== undefined ? args[grpIndex] : m;
        }
        if (token.startsWith('<') && token.endsWith('>') && namedGroups) {
          const groupName = token.slice(1, -1);
          return namedGroups[groupName] !== undefined ? namedGroups[groupName] : m;
        }
        return m;
      });

      return rep;
    });

    return { result, replacementsCount: count };
  } catch (err: any) {
    return { result: testString, replacementsCount: 0, error: err.message };
  }
}

export function explainRegexPattern(pattern: string, flags: RegexFlags): RegexTokenExplanation[] {
  const explanations: RegexTokenExplanation[] = [];
  if (!pattern) return explanations;

  // Add Flag explanations
  const flagDescriptions: Record<string, string> = {
    g: 'Global (find all matches rather than stopping after the first match)',
    i: 'Case-insensitive (matches uppercase and lowercase interchangeably)',
    m: 'Multiline mode (^ and $ match beginning and end of each line)',
    s: 'DotAll mode (. matches any character including newline \\n)',
    u: 'Unicode support (handles full UTF-16 code points and emojis)',
    y: 'Sticky mode (matches only from index indicated by lastIndex)',
  };

  const activeFlags = flagsToString(flags);
  if (activeFlags) {
    explanations.push({
      id: 'flags',
      token: `/${pattern}/${activeFlags}`,
      type: 'flag',
      title: 'Regex Flags',
      description: `Active flags: ${activeFlags
        .split('')
        .map((f) => `\`${f}\` - ${flagDescriptions[f] || 'Active'}`)
        .join(', ')}`,
    });
  }

  // Tokenize high-level constructs
  let idx = 0;
  while (idx < pattern.length) {
    const char = pattern[idx];
    const nextChar = pattern[idx + 1];

    if (char === '^') {
      explanations.push({
        id: `anchor-start-${idx}`,
        token: '^',
        type: 'anchor',
        title: 'Start Anchor',
        description: flags.m
          ? 'Asserts position at the start of a line'
          : 'Asserts position at the beginning of the string',
      });
      idx++;
    } else if (char === '$') {
      explanations.push({
        id: `anchor-end-${idx}`,
        token: '$',
        type: 'anchor',
        title: 'End Anchor',
        description: flags.m
          ? 'Asserts position at the end of a line'
          : 'Asserts position at the end of the string',
      });
      idx++;
    } else if (char === '\\') {
      // Escape sequence
      const esc = pattern.slice(idx, idx + 2);
      let desc = `Escaped literal character \`${esc}\``;
      let title = 'Escaped Character';

      if (esc === '\\d') {
        title = 'Digit Class';
        desc = 'Matches any ASCII digit [0-9]';
      } else if (esc === '\\D') {
        title = 'Non-Digit Class';
        desc = 'Matches any character that is not a digit [^0-9]';
      } else if (esc === '\\w') {
        title = 'Word Character Class';
        desc = 'Matches any alphanumeric word character or underscore [a-zA-Z0-9_]';
      } else if (esc === '\\W') {
        title = 'Non-Word Character Class';
        desc = 'Matches any character that is not a word character [^a-zA-Z0-9_]';
      } else if (esc === '\\s') {
        title = 'Whitespace Class';
        desc = 'Matches any whitespace character (space, tab, newline, carriage return)';
      } else if (esc === '\\S') {
        title = 'Non-Whitespace Class';
        desc = 'Matches any non-whitespace character';
      } else if (esc === '\\b') {
        title = 'Word Boundary';
        desc = 'Asserts position at a word boundary (between \\w and \\W)';
      } else if (esc === '\\B') {
        title = 'Non-Word Boundary';
        desc = 'Asserts position that is not a word boundary';
      } else if (esc === '\\n') {
        title = 'Line Feed';
        desc = 'Matches a newline character (LF, ASCII 10)';
      } else if (esc === '\\t') {
        title = 'Tab Character';
        desc = 'Matches a horizontal tab character (ASCII 9)';
      }

      explanations.push({
        id: `esc-${idx}`,
        token: esc,
        type: 'escape',
        title,
        description: desc,
      });
      idx += 2;
    } else if (char === '[') {
      // Character class
      const endBracket = pattern.indexOf(']', idx + 1);
      if (endBracket !== -1) {
        const cls = pattern.slice(idx, endBracket + 1);
        const isNegated = cls.startsWith('[^');
        explanations.push({
          id: `class-${idx}`,
          token: cls,
          type: 'character_class',
          title: isNegated ? 'Negated Character Set' : 'Character Set',
          description: isNegated
            ? `Matches any character NOT listed in ${cls}`
            : `Matches any single character present in ${cls}`,
        });
        idx = endBracket + 1;
      } else {
        explanations.push({
          id: `char-${idx}`,
          token: char,
          type: 'literal',
          title: 'Opening Bracket',
          description: 'Matches literal `[`',
        });
        idx++;
      }
    } else if (char === '(') {
      // Grouping
      const sub = pattern.slice(idx);
      if (sub.startsWith('(?<')) {
        const endName = sub.indexOf('>');
        const name = endName !== -1 ? sub.slice(3, endName) : 'name';
        explanations.push({
          id: `group-named-${idx}`,
          token: `(?<${name}>...)`,
          type: 'group',
          title: `Named Capture Group: "${name}"`,
          description: `Captures matching text and assigns it to group variable \`${name}\``,
        });
      } else if (sub.startsWith('(?:')) {
        explanations.push({
          id: `group-noncap-${idx}`,
          token: '(?:...)',
          type: 'group',
          title: 'Non-Capturing Group',
          description: 'Groups multiple tokens together without storing them in a capture index',
        });
      } else if (sub.startsWith('(?=')) {
        explanations.push({
          id: `lookahead-pos-${idx}`,
          token: '(?=...)',
          type: 'lookaround',
          title: 'Positive Lookahead',
          description: 'Asserts that what immediately follows matches the pattern, without consuming characters',
        });
      } else if (sub.startsWith('(?!')) {
        explanations.push({
          id: `lookahead-neg-${idx}`,
          token: '(?!...)',
          type: 'lookaround',
          title: 'Negative Lookahead',
          description: 'Asserts that what immediately follows does NOT match the pattern',
        });
      } else if (sub.startsWith('(?<=')) {
        explanations.push({
          id: `lookbehind-pos-${idx}`,
          token: '(?<=...)',
          type: 'lookaround',
          title: 'Positive Lookbehind',
          description: 'Asserts that what immediately precedes matches the pattern',
        });
      } else if (sub.startsWith('(?<!')) {
        explanations.push({
          id: `lookbehind-neg-${idx}`,
          token: '(?<!...)',
          type: 'lookaround',
          title: 'Negative Lookbehind',
          description: 'Asserts that what immediately precedes does NOT match the pattern',
        });
      } else {
        explanations.push({
          id: `group-cap-${idx}`,
          token: '(...)',
          type: 'group',
          title: 'Numbered Capture Group',
          description: 'Captures matching sub-pattern into an indexed capture group ($1, $2, etc.)',
        });
      }
      idx++;
    } else if (char === '+' || char === '*' || char === '?' || char === '{') {
      // Quantifiers
      let qToken = char;
      let qDesc = '';
      if (char === '+') qDesc = 'Matches 1 or more of the preceding token (greedy)';
      if (char === '*') qDesc = 'Matches 0 or more of the preceding token (greedy)';
      if (char === '?') qDesc = 'Matches 0 or 1 of the preceding token (optional)';
      if (char === '{') {
        const endBrace = pattern.indexOf('}', idx);
        if (endBrace !== -1) {
          qToken = pattern.slice(idx, endBrace + 1);
          qDesc = `Matches exactly the quantifier range \`${qToken}\` of the preceding token`;
          idx = endBrace;
        }
      }

      explanations.push({
        id: `quant-${idx}`,
        token: qToken,
        type: 'quantifier',
        title: 'Quantifier',
        description: qDesc,
      });
      idx++;
    } else if (char === '.') {
      explanations.push({
        id: `dot-${idx}`,
        token: '.',
        type: 'character_class',
        title: 'Wildcard Dot',
        description: flags.s
          ? 'Matches any character including line breaks (DotAll mode)'
          : 'Matches any single character except line breaks (\\n, \\r)',
      });
      idx++;
    } else if (char === '|') {
      explanations.push({
        id: `alt-${idx}`,
        token: '|',
        type: 'group',
        title: 'Alternation (OR)',
        description: 'Acts like a boolean OR; matches the expression before or after the bar',
      });
      idx++;
    } else {
      // Literal character
      explanations.push({
        id: `lit-${idx}`,
        token: char,
        type: 'literal',
        title: `Literal "${char}"`,
        description: `Matches the literal character \`${char}\` (case ${flags.i ? 'insensitive' : 'sensitive'})`,
      });
      idx++;
    }
  }

  return explanations;
}

export function generateCodeSnippets(pattern: string, flagsString: string, testString: string): CodeSnippet[] {
  const safePattern = pattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const safeTest = testString.slice(0, 100).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

  return [
    {
      language: 'kotlin',
      title: 'Kotlin / Native Android',
      code: `// Native Android / Kotlin Regex Engine
val pattern = Regex("""${pattern}""", setOf(${flagsString
        .split('')
        .map((f) => {
          if (f === 'i') return 'RegexOption.IGNORE_CASE';
          if (f === 'm') return 'RegexOption.MULTILINE';
          if (f === 's') return 'RegexOption.DOT_MATCHES_ALL';
          return null;
        })
        .filter(Boolean)
        .join(', ') || 'emptySet()'}))

val input = "${safeTest}"
val matches = pattern.findAll(input)

matches.forEachIndexed { index, matchResult ->
    println("Match \${index + 1}: \${matchResult.value} at range \${matchResult.range}")
    matchResult.groupValues.forEachIndexed { grpIndex, grpValue ->
        if (grpIndex > 0) println("  Group \$grpIndex: \$grpValue")
    }
}`,
    },
    {
      language: 'java',
      title: 'Java (java.util.regex)',
      code: `import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class RegexRunner {
    public static void main(String[] args) {
        int flags = 0${flagsString.includes('i') ? ' | Pattern.CASE_INSENSITIVE' : ''}${
        flagsString.includes('m') ? ' | Pattern.MULTILINE' : ''
      }${flagsString.includes('s') ? ' | Pattern.DOTALL' : ''};
        
        Pattern pattern = Pattern.compile("${safePattern}", flags);
        Matcher matcher = pattern.matcher("${safeTest}");

        int matchCount = 0;
        while (matcher.find()) {
            matchCount++;
            System.out.printf("Match %d: %s [%d-%d]%n", matchCount, matcher.group(), matcher.start(), matcher.end());
            for (int i = 1; i <= matcher.groupCount(); i++) {
                System.out.printf("  Group %d: %s%n", i, matcher.group(i));
            }
        }
    }
}`,
    },
    {
      language: 'typescript',
      title: 'TypeScript / JavaScript',
      code: `// TypeScript / ES2022 MatchAll
const regex = /${pattern}/${flagsString};
const input = "${safeTest}";

const matches = Array.from(input.matchAll(regex));

matches.forEach((match, index) => {
  console.log(\`Match \${index + 1}: "\${match[0]}" at offset \${match.index}\`);
  match.slice(1).forEach((group, groupIndex) => {
    console.log(\`  Group \${groupIndex + 1}: "\${group}"\`);
  });
  if (match.groups) {
    console.log('  Named Groups:', match.groups);
  }
});`,
    },
    {
      language: 'python',
      title: 'Python 3 (re module)',
      code: `import re

pattern = r"""${pattern}"""
flags = 0${flagsString.includes('i') ? ' | re.IGNORECASE' : ''}${flagsString.includes('m') ? ' | re.MULTILINE' : ''}${
        flagsString.includes('s') ? ' | re.DOTALL' : ''
      }
input_text = """${testString.slice(0, 120)}"""

matches = list(re.finditer(pattern, input_text, flags))
for i, match in enumerate(matches, 1):
    print(f"Match {i}: '{match.group(0)}' [{match.start()}:{match.end()}]")
    for g_idx, group in enumerate(match.groups(), 1):
        print(f"  Group {g_idx}: '{group}'")
    if match.groupdict():
        print(f"  Named Groups: {match.groupdict()}")`,
    },
    {
      language: 'go',
      title: 'Go (regexp package)',
      code: `package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(\`${pattern}\`)
	input := \`${testString.slice(0, 120)}\`

	matches := re.FindAllStringSubmatchIndex(input, -1)
	for i, loc := range matches {
		matchText := input[loc[0]:loc[1]]
		fmt.Printf("Match %d: %s [%d:%d]\\n", i+1, matchText, loc[0], loc[1])
		// Extract submatch capture groups
		for g := 2; g < len(loc); g += 2 {
			if loc[g] != -1 {
				fmt.Printf("  Group %d: %s\\n", g/2, input[loc[g]:loc[g+1]])
			}
		}
	}
}`,
    },
    {
      language: 'rust',
      title: 'Rust (regex crate)',
      code: `use regex::Regex;

fn main() {
    let re = Regex::new(r"${pattern}").unwrap();
    let text = r"${testString.slice(0, 120)}";

    for (i, cap) in re.captures_iter(text).enumerate() {
        println!("Match {}: {:?}", i + 1, &cap[0]);
        for (g_idx, group) in cap.iter().skip(1).enumerate() {
            if let Some(g) = group {
                println!("  Group {}: {}", g_idx + 1, g.as_str());
            }
        }
    }
}`,
    },
  ];
}
