export interface AutoDevConfig {
  repos: WatchedRepo[];
  autoCommit: boolean;
  autoPush: boolean;
  commitThreshold: number; // seconds of inactivity before commit
  commitMessagePattern: string;
  maxChangesBeforeCommit: number;
  ignoredPaths: string[];
}

export interface WatchedRepo {
  localPath: string;
  remoteUrl: string;
  branch: string;
  enabled: boolean;
}

export interface CommitEvent {
  id: string;
  repo: string;
  message: string;
  files: string[];
  timestamp: string;
  hash: string;
}

export interface ProfileAnalysis {
  username: string;
  avatar: string;
  bio: string;
  location: string;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalContributions: number;
  languages: { name: string; percentage: number }[];
  topRepos: RepoAnalysis[];
  consistencyScore: number;
  overallScore: number;
  recommendations: string[];
}

export interface RepoAnalysis {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export interface AgentStatus {
  running: boolean;
  connected: boolean;
  watchedRepos: number;
  lastSync: string;
  commitsToday: number;
}

export interface UserSession {
  id: string;
  githubUsername: string;
  accessToken: string;
  plan: 'free' | 'pro' | 'team';
}
