import * as fs from 'fs';
import * as path from 'path';

interface QueuedOperation {
  id: string;
  type: 'commit' | 'push' | 'pull';
  repoPath: string;
  message?: string;
  timestamp: string;
  retries: number;
}

export class SyncQueue {
  private queue: QueuedOperation[] = [];
  private queuePath: string;

  constructor() {
    const dir = path.join(process.env.HOME || process.env.USERPROFILE || __dirname, '.autodev');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.queuePath = path.join(dir, 'queue.json');
    this.load();
  }

  enqueue(op: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>): void {
    this.queue.push({
      ...op,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      retries: 0,
    });
    this.save();
  }

  dequeue(): QueuedOperation | undefined {
    return this.queue.shift();
  }

  peek(): QueuedOperation | undefined {
    return this.queue[0];
  }

  get length(): number {
    return this.queue.length;
  }

  getAll(): QueuedOperation[] {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
    this.save();
  }

  private save(): void {
    fs.writeFileSync(this.queuePath, JSON.stringify(this.queue, null, 2));
  }

  private load(): void {
    try {
      if (fs.existsSync(this.queuePath)) {
        const raw = fs.readFileSync(this.queuePath, 'utf-8');
        this.queue = JSON.parse(raw);
      }
    } catch {
      this.queue = [];
    }
  }
}
