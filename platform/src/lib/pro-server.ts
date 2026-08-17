import { createHmac, timingSafeEqual } from 'crypto';

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const PRO_PRICE_PAISE = Number(process.env.PRO_PRICE_PAISE) || 49900;

const REPO_OWNER = 'Shashwat1319';
const REPO_NAME = 'autodev-agent';
const PAID_USERS_PATH = 'data/paid-users.json';
const BRANCH = 'master';

interface PaidUser {
  username: string;
  paymentLinkId: string;
  paymentId: string;
  email?: string;
  amount: number;
  currency: string;
  paidAt: number;
  verified: boolean;
}

interface PaidUsersData {
  users: PaidUser[];
  updatedAt: number;
}

async function githubRequest(url: string, options: RequestInit = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not set');
  
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res;
}

export async function readPaidUsers(): Promise<PaidUsersData> {
  try {
    const res = await githubRequest(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PAID_USERS_PATH}?ref=${BRANCH}`
    );
    if (!res.ok) {
      if (res.status === 404) return { users: [], updatedAt: 0 };
      throw new Error(`GitHub read failed: ${res.status}`);
    }
    const data = await res.json();
    const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    return content as PaidUsersData;
  } catch {
    return { users: [], updatedAt: 0 };
  }
}

export async function writePaidUsers(data: PaidUsersData): Promise<boolean> {
  try {
    const current = await readPaidUsers();
    const sha = current.users.length > 0 ? (await githubRequest(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PAID_USERS_PATH}?ref=${BRANCH}`
    ).then(r => r.ok ? r.json() : null).then(d => d?.sha)) : undefined;

    const put = await githubRequest(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PAID_USERS_PATH}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          message: 'pro: update paid users',
          content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
          branch: BRANCH,
          ...(sha ? { sha } : {}),
        }),
      }
    );
    return put.ok;
  } catch {
    return false;
  }
}

export async function addPaidUser(user: PaidUser): Promise<boolean> {
  const data = await readPaidUsers();
  const existing = data.users.find(u => u.paymentLinkId === user.paymentLinkId);
  if (existing) {
    existing.verified = true;
    existing.paymentId = user.paymentId;
  } else {
    data.users.push(user);
  }
  data.updatedAt = Date.now();
  return writePaidUsers(data);
}

export async function isUserPro(username: string): Promise<boolean> {
  const data = await readPaidUsers();
  return data.users.some(u => u.username === username && u.verified);
}

export async function getProUser(username: string): Promise<PaidUser | null> {
  const data = await readPaidUsers();
  return data.users.find(u => u.username === username && u.verified) || null;
}

export async function revokePro(username: string): Promise<boolean> {
  const data = await readPaidUsers();
  const idx = data.users.findIndex(u => u.username === username);
  if (idx === -1) return false;
  data.users.splice(idx, 1);
  data.updatedAt = Date.now();
  return writePaidUsers(data);
}

export function verifyPaymentSignature(payload: string, signature: string): boolean {
  if (!KEY_SECRET) return false;
  const expected = createHmac('sha256', KEY_SECRET).update(payload).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyPaymentLinkSignature(
  paymentLinkId: string,
  referenceId: string,
  linkStatus: string,
  paymentId: string,
  signature: string
): boolean {
  const payload = `${paymentLinkId}|${referenceId}|${linkStatus}|${paymentId}`;
  return verifyPaymentSignature(payload, signature);
}

export async function verifyPaymentAmount(paymentLinkId: string): Promise<boolean> {
  if (!KEY_SECRET) return false;
  try {
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${KEY_SECRET}`).toString('base64');
    const res = await fetch(`https://api.razorpay.com/v1/payment_links/${paymentLinkId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.amount === PRO_PRICE_PAISE && data.currency === 'INR' && data.status === 'paid';
  } catch {
    return false;
  }
}

export function createProCookie(): string {
  return 'autodev_pro=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure';
}

export function parseProCookie(cookies: string): boolean {
  return cookies.split('; ').some(c => c.startsWith('autodev_pro=1'));
}