// Claude Code PreToolUse hook (Bash + PowerShell): blocks a raw
// `shopify theme push`, which would overwrite Admin edits unchecked.
// Theme pushes go through scripts/theme-push.sh (see CLAUDE.md, Shopify CLI).
let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  let command = '';
  try {
    command = JSON.parse(input).tool_input?.command || '';
  } catch {
    process.exit(0);
  }
  // Only the command itself (line start or after ; & | ( ), not a mention
  // of it in a commit message or doc text.
  if (/(^|[;&|(]|\n)\s*(npx\s+)?shopify(\.cmd)?\s+theme\s+push\b/.test(command)) {
    process.stderr.write(
      'Blocked: raw `shopify theme push` skips the Admin-edit check. ' +
        'Use scripts/theme-push.sh [--dev] <file>... (see CLAUDE.md, Shopify CLI).\n'
    );
    process.exit(2);
  }
});
