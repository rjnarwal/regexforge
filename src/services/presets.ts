import { RegexPreset } from '../types';

export const REGEX_PRESETS: RegexPreset[] = [
  {
    id: 'email',
    title: 'Email Address (RFC 5322)',
    category: 'web',
    pattern: '([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)',
    flags: 'gi',
    testString: `Contact us at support@grassroot.digital or sales@enterprise-dev.co.uk!
Invalid emails like user@, @domain.com, or user@.com should not match properly.
Another team email: alex.narwal+newsletter@gmail.com`,
    description: 'Matches standard email addresses capturing user handle in Group 1 and domain in Group 2.',
  },
  {
    id: 'url',
    title: 'HTTP/HTTPS URLs & Endpoints',
    category: 'web',
    pattern: 'https?:\\/\\/(?:www\\.)?([a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+)(?::(\\d+))?(\\/[^?\\s#]*)?(?:\\?([^#\\s]*))?',
    flags: 'gi',
    testString: `Check our endpoints:
https://api.grassroot.digital:8080/v1/auth/tokens?refresh=true&scope=admin
http://localhost:3000/dashboard
https://github.com/rajesh-narwal/endly#readme`,
    description: 'Extracts full web URLs, capturing hostname in Group 1, port in Group 2, path in Group 3, and query string in Group 4.',
  },
  {
    id: 'ipv4-ipv6',
    title: 'IPv4 Addresses',
    category: 'network',
    pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    testString: `Server cluster IPs:
192.168.1.1 (Gateway Router)
10.0.0.254 (Subnet Node)
199.36.158.100 (Google CDN Edge)
999.999.999.999 (Invalid IP - will not match)`,
    description: 'Validates octet ranges 0-255 for IPv4 network addresses with boundary checks.',
  },
  {
    id: 'jwt-token',
    title: 'JWT (JSON Web Token) Structure',
    category: 'security',
    pattern: '^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*$',
    flags: 'gm',
    testString: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
not.a.valid-jwt-token-due-to-invalid-chars!#$`,
    description: 'Matches 3-part base64url encoded Header.Payload.Signature JWT token structures.',
  },
  {
    id: 'uuid-v4',
    title: 'UUID v4 / v7 (Universal Identifier)',
    category: 'identifiers',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-7][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
    flags: 'gi',
    testString: `Generated transaction IDs:
018df13b-8250-71a2-9442-1e9681145b20 (UUID v7 Time-Ordered)
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11 (UUID v4 Random)
invalid-uuid-format-12345`,
    description: 'Matches standard 36-character hexadecimal UUID format including variant and version bits.',
  },
  {
    id: 'iso-date',
    title: 'ISO 8601 Timestamp / Date',
    category: 'formatting',
    pattern: '(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2})(?:\\.(\\d{3}))?(Z|[+-]\\d{2}:\\d{2})?',
    flags: 'g',
    testString: `Server event log records:
2026-09-03T19:30:00.000Z - System Startup
2026-12-31T23:59:59+05:30 - New Year Eve
2026-05-14T08:15:30Z - Build Completed`,
    description: 'Captures Year, Month, Day, Hour, Minute, Second, Milliseconds, and Timezone Offset.',
  },
  {
    id: 'semver',
    title: 'Semantic Versioning (SemVer 2.0)',
    category: 'identifiers',
    pattern: 'v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?',
    flags: 'g',
    testString: `Release tag versions:
v1.0.0
2.4.12-beta.1+build.2026
0.9.0-rc.3
invalid_version_1.0`,
    description: 'Compliant SemVer 2.0 regex capturing Major, Minor, Patch, Pre-release tag, and Build metadata.',
  },
  {
    id: 'hex-color',
    title: 'Hexadecimal Color Codes',
    category: 'formatting',
    pattern: '#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b',
    flags: 'gi',
    testString: `Color palette tokens:
Brand Primary: #10b981 (Emerald)
Accent: #f97316 (Orange)
Dark Surface: #0a0d14
Transparent RGBA: #3b82f680
Short notation: #fff and #000`,
    description: 'Matches 3, 4, 6, and 8 digit Hex color strings with alpha channel support.',
  },
  {
    id: 'markdown-link',
    title: 'Markdown Links [Title](URL)',
    category: 'formatting',
    pattern: '\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)',
    flags: 'g',
    testString: `Here are resources:
Check out [Grassroot Digital](https://grassroot.digital) and [Endly API Client](https://endly.grassroot.digital).
Also see [TokenLens Studio](https://tokenlens.grassroot.digital).`,
    description: 'Captures link anchor text in Group 1 and destination URL in Group 2.',
  },
  {
    id: 'phone-e164',
    title: 'International Phone Numbers (E.164)',
    category: 'formatting',
    pattern: '\\+?[1-9]\\d{1,14}\\b',
    flags: 'g',
    testString: `Customer helpline numbers:
+14155552671 (US)
+919876543210 (India)
+442071838750 (UK)`,
    description: 'Matches international E.164 phone numbers with optional leading plus sign.',
  },
];
