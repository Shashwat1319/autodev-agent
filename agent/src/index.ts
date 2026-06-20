#!/usr/bin/env node
import { loadConfig } from './config';
import { FileWatcher } from './core/watcher';
import { CloudConnector } from './core/cloud-connector';
import { SyncQueue } from './core/sync-queue';
import { CommitEvent, AgentStatus } from './shared/types';

console.log(`
  ╔══════════════════════════════════════╗
  ║        AutoDev Agent v0.1           ║
  ║   Your code. Auto-piloted.           ║
  ╚══════════════════════════════════════╝
`);

const config = loadConfig();
const cloud = new CloudConnector();
const syncQueue = new SyncQueue();

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
  cloud.sendCommit(event);
});

cloud.connect();
watcher.start();

process.on('SIGINT', () => {
  console.log('\nShutting down AutoDev agent...');
  watcher.stop();
  cloud.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  watcher.stop();
  cloud.disconnect();
  process.exit(0);
});

// Periodic status heartbeat
setInterval(() => {
  const status: AgentStatus = {
    running: true,
    connected: cloud.isConnected(),
    watchedRepos: config.repos.filter(r => r.enabled).length,
    lastSync: new Date().toISOString(),
    commitsToday: 0,
  };
  cloud.sendStatus(status);
}, 60000);
