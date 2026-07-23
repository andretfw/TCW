import {mkdirSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    env: process.env,
    shell: process.platform === 'win32',
  });

  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim(),
  };
}

function tail(text, maxLines = 500) {
  const lines = text.split(/\r?\n/);
  return lines.slice(-maxLines).join('\n');
}

const typecheck = run('npm', ['run', 'typecheck']);
const lint = run('npm', ['run', 'lint']);

mkdirSync('public', {recursive: true});
writeFileSync(
  'public/audit-results.txt',
  [
    'TCW isolated code-quality audit',
    `Commit: ${process.env.COMMIT_REF || process.env.HEAD || 'unknown'}`,
    `Node: ${process.version}`,
    '',
    `TypeScript exit code: ${typecheck.status}`,
    '--- TypeScript output (last 500 lines) ---',
    tail(typecheck.output),
    '',
    `ESLint exit code: ${lint.status}`,
    '--- ESLint output (last 500 lines) ---',
    tail(lint.output),
    '',
    'The normal Next.js production build runs after this report is written.',
  ].join('\n'),
  'utf8',
);

console.log(`TypeScript exit code: ${typecheck.status}`);
console.log(`ESLint exit code: ${lint.status}`);
console.log('Audit output written to /audit-results.txt');

const build = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});

process.exit(build.status ?? 1);
