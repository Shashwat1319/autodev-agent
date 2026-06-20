import * as chokidar from 'chokidar';
import * as path from 'path';
import { AutoDevConfig } from '../shared/types';
import { GitEngine } from './git-engine';

export class FileWatcher {
  private watcher: chokidar.FSWatcher | null = null;
  private changeTimer: NodeJS.Timeout | null = null;
  private pendingChanges: Set<string> = new Set();
  private gitEngine: GitEngine;
  private config: AutoDevConfig;
  private changeCount: number = 0;
  private onCommit: ((repo: string) => void) | null = null;

  constructor(config: AutoDevConfig) {
    this.config = config;
    this.gitEngine = new GitEngine();
  }

  onCommitCallback(cb: (repo: string) => void): void {
    this.onCommit = cb;
  }

  start(): void {
    const watchedDirs = this.config.repos
      .filter(r => r.enabled)
      .map(r => r.localPath);

    if (watchedDirs.length === 0) {
      console.log('No repos configured for watching');
      return;
    }

    const ignorePatterns = this.config.ignoredPaths.map(p => `**/${p}/**`);

    this.watcher = chokidar.watch(watchedDirs, {
      ignored: [
        ...ignorePatterns,
        '**/.git/**',
        '**/node_modules/**',
      ],
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    });

    this.watcher
      .on('add', (filePath) => this.onChange(filePath, 'added'))
      .on('change', (filePath) => this.onChange(filePath, 'changed'))
      .on('unlink', (filePath) => this.onChange(filePath, 'deleted'));

    console.log(`Watching ${watchedDirs.length} repo(s)...`);
  }

  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
      this.changeTimer = null;
    }
  }

  private onChange(filePath: string, event: string): void {
    if (!this.config.autoCommit) return;

    const relativePath = this.getRelativePath(filePath);
    this.pendingChanges.add(relativePath);
    this.changeCount++;

    console.log(`[${event}] ${relativePath}`);

    if (this.changeCount >= this.config.maxChangesBeforeCommit) {
      this.flush();
      return;
    }

    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
    }

    this.changeTimer = setTimeout(() => {
      this.flush();
    }, this.config.commitThreshold * 1000);
  }

  private async flush(): Promise<void> {
    if (this.pendingChanges.size === 0) return;

    const changes = Array.from(this.pendingChanges);
    this.pendingChanges.clear();
    this.changeCount = 0;

    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
      this.changeTimer = null;
    }

    for (const repo of this.config.repos) {
      if (!repo.enabled) continue;

      const repoChanges = changes.filter(c => c.startsWith(repo.localPath));
      if (repoChanges.length === 0) continue;

      try {
        const message = this.config.commitMessagePattern
          .replace('{files}', repoChanges.slice(0, 3).join(', ') + (repoChanges.length > 3 ? ` +${repoChanges.length - 3} more` : ''));

        await this.gitEngine.commitAndPush(repo.localPath, message, this.config.autoPush);
        console.log(`Committed to ${repo.localPath}: ${message}`);

        if (this.onCommit) {
          this.onCommit(repo.localPath);
        }
      } catch (err: any) {
        console.error(`Failed to commit to ${repo.localPath}: ${err.message}`);
      }
    }
  }

  private getRelativePath(filePath: string): string {
    for (const repo of this.config.repos) {
      if (filePath.startsWith(repo.localPath)) {
        return filePath;
      }
    }
    return filePath;
  }
}
