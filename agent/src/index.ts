#!/usr/bin/env node
import { loadConfig } from './config';
import { FileWatcher } from './core/watcher';

const BANNER = `
  ╔══════════════════════════════════════╗
  ║        AutoDev Agent v1.0           ║
  ║   Your code. Auto-piloted.           ║
  ╚══════════════════════════════════════╝
`;

const API_BASE = 'https://autodev-kappa.vercel.app';

function printScore(username: string): void {
  console.log(`\n  📊 Fetching AutoDev score for ${username}...\n`);

  interface ScoreResponse {
    score?: number;
    overallScore?: number;
    label?: string;
  }

  fetch(`${API_BASE}/api/analyze?username=${encodeURIComponent(username)}`)
    .then((res) => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json() as Promise<ScoreResponse>;
    })
    .then((data) => {
      const score = data?.score ?? data?.overallScore ?? '?';
      const label = data?.label ?? '';
      console.log('  ╔══════════════════════════════════════════╗');
      console.log(`  ║   ${username.padEnd(38)}║`);
      console.log('  ╠══════════════════════════════════════════╣');
      console.log(`  ║   Score: ${String(score).padEnd(5)}/100  ${label.padEnd(19)}║`);
      console.log('  ╚══════════════════════════════════════════╝');
      console.log('');
      console.log(`  🔗 Full report: ${API_BASE}/dashboard?user=${encodeURIComponent(username)}`);
      console.log(`  🏆 Add badge: ${API_BASE}/api/badge?username=${encodeURIComponent(username)}`);
      console.log('');
      process.exit(0);
    })
    .catch((err) => {
      console.error(`  ❌ Could not fetch score: ${(err as Error).message}`);
      console.error(`  🔗 Try it in browser: ${API_BASE}/dashboard?user=${encodeURIComponent(username)}`);
      process.exit(1);
    });
}

function main(): void {
  console.log(BANNER);

  const scoreArg = process.argv.find((a) => a.startsWith('--score'));
  const scoreUsername = scoreArg ? scoreArg.split('=')[1] ?? process.argv[process.argv.indexOf(scoreArg) + 1] : null;

  if (scoreUsername) {
    printScore(scoreUsername.trim());
    return;
  }

  console.log('  📊 See your GitHub profile score:');
  console.log(`  ${API_BASE}/dashboard?user=YOUR_USERNAME`);
  console.log('');
  console.log('  🏆 Add a score badge to your README:');
  console.log('  https://autodev-kappa.vercel.app/dashboard');
  console.log('');
  console.log('  💡 Tip: npx autodev-agent --score yourusername');
  console.log('');

  const config = loadConfig();

  const watcher = new FileWatcher(config);
  watcher.start();

  function shutdown(): void {
    console.log('\nShutting down AutoDev agent...');
    watcher.stop();
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
