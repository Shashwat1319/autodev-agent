export const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Rust: '#dea584', Go: '#00ADD8',
  Java: '#b07219', C: '#555555', 'C++': '#f34b7d', 'C#': '#178600',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
  Dart: '#00B4AB', Lua: '#000080', Scala: '#c22d40', Shell: '#89e051',
  Vue: '#4fc08d', Svelte: '#ff3e00', React: '#61dafb',
};

export function getLangColor(language: string): string {
  return LANG_COLORS[language] || '#666';
}
