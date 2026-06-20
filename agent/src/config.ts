import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { AutoDevConfig } from './shared/types';

dotenv.config();

const CONFIG_PATH = path.join(process.env.HOME || process.env.USERPROFILE || __dirname, '.autodev', 'config.json');

export function loadConfig(): AutoDevConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    console.warn('Failed to load config, using defaults');
  }
  return getDefaultConfig();
}

export function saveConfig(config: AutoDevConfig): void {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function getDefaultConfig(): AutoDevConfig {
  return {
    repos: [],
    autoCommit: true,
    autoPush: true,
    commitThreshold: 60,
    commitMessagePattern: 'auto: updated {files}',
    maxChangesBeforeCommit: 10,
    ignoredPaths: ['node_modules', '.git', 'dist', 'build', '.next', 'target', 'venv'],
  };
}

export function getApiUrl(): string {
  return process.env.AUTODEV_API_URL || 'http://localhost:3000';
}

export function getAuthToken(): string {
  return process.env.AUTODEV_AUTH_TOKEN || '';
}
