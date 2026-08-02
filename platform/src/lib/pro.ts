export const PRO_PRICE_INR = '₹749';

export function isProUnlocked(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some(c => c.startsWith('autodev_pro=1'));
}

export function unlockPro(): void {
  document.cookie = 'autodev_pro=1; path=/; max-age=31536000; SameSite=Lax';
}
