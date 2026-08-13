export const GITHUB_USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])|_){0,38}$/;

export function isValidUsernameFormat(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 39) return false;
  return GITHUB_USERNAME_RE.test(trimmed);
}

export const USERNAME_FORMAT_ERROR = 'That doesn\u2019t look like a GitHub username \u2014 letters, numbers, dashes and underscores only, no spaces.';