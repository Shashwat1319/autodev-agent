import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { AutoDevConfig } from '../../shared/types/index';

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
