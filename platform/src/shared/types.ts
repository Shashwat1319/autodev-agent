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
