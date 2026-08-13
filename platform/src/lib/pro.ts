export const PRO_PRICE_INR = '₹299';
export const PRO_PRICE_STRIKE_INR = '₹749';

export function isProUnlocked(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some(c => c.startsWith('autodev_pro=1'));
}

export function unlockPro(): void {
  document.cookie = 'autodev_pro=1; path=/; max-age=31536000; SameSite=Lax';
}

export function markProAttempt(username: string): void {
  document.cookie = `autodev_pro_attempt=${encodeURIComponent(username)}; path=/; max-age=3600; SameSite=Lax`;
}

export function isProAttempt(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some(c => c.startsWith('autodev_pro_attempt='));
}

export function clearProAttempt(): void {
  document.cookie = 'autodev_pro_attempt=; path=/; max-age=0; SameSite=Lax';
}