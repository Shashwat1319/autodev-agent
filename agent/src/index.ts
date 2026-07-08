#!/usr/bin/env node
import { loadConfig } from './config';
import { FileWatcher } from './core/watcher';

console.log(`
  ╔══════════════════════════════════════╗
  ║        AutoDev Agent v0.1           ║
  ║   Your code. Auto-piloted.           ║
  ╚══════════════════════════════════════╝
`);

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
