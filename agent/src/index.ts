#!/usr/bin/env node
import { loadConfig } from './config';
import { FileWatcher } from './core/watcher';
import { CommitEvent } from '../../shared/types/index';

console.log(`
  ╔══════════════════════════════════════╗
  ║        AutoDev Agent v0.1           ║
  ║   Your code. Auto-piloted.           ║
  ╚══════════════════════════════════════╝
`);

const config = loadConfig();

const watcher = new FileWatcher(config);
watcher.onCommitCallback((repoPath: string) => {
  const event: CommitEvent = {
    id: `${Date.now()}`,
    repo: repoPath,
    message: 'Auto-commit',
    files: [],
    timestamp: new Date().toISOString(),
    hash: '',
  };
});

watcher.start();

process.on('SIGINT', () => {
  console.log('\nShutting down AutoDev agent...');
  watcher.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  watcher.stop();
  process.exit(0);
});
