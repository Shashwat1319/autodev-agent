import type { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import crypto from 'crypto';
import { rateLimit } from '../../lib/rate-limit';

const langColors: Record<string, [number, number, number]> = {
  JavaScript: [247/255, 223/255, 30/255], TypeScript: [49/255, 120/255, 198/255],
  Python: [53/255, 114/255, 165/255], HTML: [227/255, 76/255, 38/255],
  CSS: [86/255, 61/255, 124/255],
};

function sanitize(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/[^\x20-\x7E\xA0-\xFF\s]/g, '').trim();
}

function getLangColor(name: string) {
  const c = langColors[name] || [102/255, 102/255, 102/255];
  return rgb(c[0], c[1], c[2]);
}

function getScoreColor(score: number) {
  if (score >= 70) return rgb(76/255, 175/255, 80/255);
  if (score >= 40) return rgb(255/255, 152/255, 0/255);
  return rgb(244/255, 67/255, 54/255);
}

async function verifyPayment(payment_id: string, order_id: string, signature: string): Promise<boolean> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keySecret || !keyId) return false;

  const expected = crypto.createHmac('sha256', keySecret).update(`${order_id}|${payment_id}`).digest('hex');
  if (expected !== signature) return false;

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  try {
    const payRes = await fetch(`https://api.razorpay.com/v1/payments/${payment_id}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!payRes.ok) return false;
    const payment = await payRes.json();
    return payment.status === 'captured';
  } catch {
    return false;
  }
}

async function fetchProfile(username: string) {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  const token = process.env.GITHUB_TOKEN || '';
  if (token) headers.Authorization = `Bearer ${token}`;

  const [userRes, reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
    fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
  ]);

  if (!userRes.ok) return null;

  const userData = await userRes.json();
  const repos = await reposRes.json();
  const events = await eventsRes.json();

  const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);

  const langMap: Record<string, number> = {};
  repos.forEach((r: any) => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
  const totalLangs = Object.values(langMap).reduce((a: number, b: number) => a + b, 0);
  const languages = Object.entries(langMap)
    .map(([name, count]) => ({ name, percentage: Math.round((count / totalLangs) * 100) }))
    .sort((a, b) => b.percentage - a.percentage).slice(0, 6);

  const topRepos = repos.filter((r: any) => !r.fork)
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5).map((r: any) => ({
      name: r.name, description: r.description || 'No description',
      stars: r.stargazers_count, forks: r.forks_count, language: r.language || 'Unknown',
    }));

  const consistency = Math.min(100, Math.round(
    (repos.length > 0 ? 30 : 0) + (totalStars > 0 ? 20 : 0) +
    (events.length > 10 ? 25 : events.length > 0 ? 10 : 0) +
    (userData.public_repos > 5 ? 15 : 5) + (userData.bio ? 10 : 0)
  ));
  const overallScore = Math.round((consistency + Math.min(100, totalStars * 2)) / 2);
  const totalContributions = Math.round(repos.reduce((sum: number, r: any) => sum + (r.size || 0), 0) / 100);

  const recommendations: string[] = [];
  if (!userData.bio) recommendations.push('Add a bio to your GitHub profile');
  if (!userData.blog) recommendations.push('Add a website/blog link to your profile');
  if (repos.filter((r: any) => !r.fork).length < 3) recommendations.push('Create more original repositories');
  if (totalStars < 5) recommendations.push('Share your projects to get more stars');
  if (events.length < 10) recommendations.push('Be more active - commit more frequently');

  return {
    username: userData.login, avatar: userData.avatar_url,
    bio: sanitize(userData.bio) || 'No bio',
    location: sanitize(userData.location) || 'N/A',
    totalRepos: userData.public_repos, totalStars, totalForks, totalContributions,
    languages, topRepos, consistency, overallScore, recommendations,
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://autodev-kappa.vercel.app');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `generate-pdf:${ip}`, maxRequests: 5, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: `Too many requests. Try again in ${Math.ceil(rl.resetIn / 1000)}s.` });

  const { username, payment_id, order_id, razorpay_signature } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  if (!payment_id || !order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Payment ID, Order ID, and signature are required' });
  }

  const isValid = await verifyPayment(payment_id, order_id, razorpay_signature);
  if (!isValid) {
    return res.status(402).json({ error: 'Payment verification failed. Please try again.' });
  }

  try {
    const profile = await fetchProfile(username);
    if (!profile) return res.status(404).json({ error: 'User not found' });

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);

    const W = 595.28;
    const H = 841.89;
    const ML = 45;
    const CW = W - ML * 2;

    const ACCENT = rgb(6/255, 182/255, 212/255);
    const MUTED = rgb(0.55, 0.55, 0.55);
    const CARD = rgb(22/255, 30/255, 52/255);
    const BG = rgb(15/255, 20/255, 35/255);
    const WHITE = rgb(1, 1, 1);
    const DARK = rgb(0.12, 0.12, 0.12);

    let currentPage = doc.addPage([W, H]);
    let y = H;

    const drawText = (text: string, x: number, yy: number, size: number, opts: any = {}) => {
      currentPage.drawText(text, {
        x, y: yy, size,
        font: opts.bold ? bold : font,
        color: opts.color || WHITE, ...opts,
      });
    };

    const addNewPage = () => {
      currentPage = doc.addPage([W, H]);
      currentPage.drawRectangle({ x: 0, y: 0, width: W, height: H, color: BG });
      y = H - 30;
    };

    const ensureSpace = (needed: number) => {
      if (y - needed < 50) addNewPage();
    };

    const sectionHeader = (title: string) => {
      ensureSpace(45);
      y -= 18;
      drawText(title.toUpperCase(), ML, y, 9, { bold: true, color: ACCENT });
      currentPage.drawRectangle({
        x: ML + 130, y: y + 3, width: CW - 130, height: 0.5, color: rgb(0.3, 0.3, 0.3),
      });
      y -= 24;
    };
    currentPage.drawRectangle({ x: 0, y: 0, width: W, height: H, color: BG });

    // Header bar
    currentPage.drawRectangle({ x: 0, y: H - 50, width: W, height: 50, color: ACCENT });
    drawText('AUTODEV', ML, H - 34, 16, { bold: true, color: DARK });
    drawText('GitHub Profile Report', ML, H - 25, 9, { color: DARK });
    const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    drawText(date, W - ML, H - 34, 9, { color: DARK });
    drawText(BASE_URL.replace('https://', ''), W - ML, H - 25, 8, { color: DARK });

    y = H - 75;

    // ====== PROFILE + SCORE SECTION (two-column layout) ======
    ensureSpace(140);

    // Left: avatar placeholder + name + info
    currentPage.drawRectangle({ x: ML, y: y - 110, width: CW * 0.55, height: 110, color: CARD });

    drawText(profile.username, ML + 20, y - 20, 24, { bold: true });
    drawText(profile.bio, ML + 20, y - 40, 9, { color: MUTED });
    drawText(profile.location, ML + 20, y - 55, 9, { color: MUTED });

    drawText('Account:', ML + 20, y - 72, 8, { color: MUTED });
    drawText(`${profile.totalRepos} repos`, ML + 70, y - 72, 8, { color: MUTED });

    // Right: score card
    const scoreX = ML + CW * 0.55 + 15;
    const scoreCW = CW * 0.45 - 15;
    currentPage.drawRectangle({ x: scoreX, y: y - 110, width: scoreCW, height: 110, color: CARD });

    drawText('SCORE', scoreX + 15, y - 22, 9, { bold: true, color: MUTED });
    const scoreColor = getScoreColor(profile.overallScore);
    drawText(`${profile.overallScore}`, scoreX + 15, y - 65, 42, { bold: true, color: scoreColor });
    drawText(`/100`, scoreX + 60, y - 42, 14, { bold: true, color: MUTED });
    drawText(`${profile.overallScore >= 70 ? 'Great' : profile.overallScore >= 40 ? 'Needs Work' : 'Low'}`, scoreX + 15, y - 82, 10, { color: MUTED });

    // Progress bar below score
    const barY = y - 96;
    currentPage.drawRectangle({ x: scoreX + 15, y: barY, width: scoreCW - 30, height: 6, color: rgb(0.15, 0.15, 0.25) });
    currentPage.drawRectangle({
      x: scoreX + 15, y: barY, width: (scoreCW - 30) * (profile.overallScore / 100), height: 6, color: scoreColor,
    });

    y -= 130;

    // ====== STATS GRID ======
    sectionHeader('Statistics');

    const stats = [
      { label: 'Repos', value: profile.totalRepos },
      { label: 'Stars', value: profile.totalStars },
      { label: 'Forks', value: profile.totalForks },
      { label: 'Contrib', value: profile.totalContributions },
    ];

    const cellW = (CW - 12) / 4;
    stats.forEach((s, i) => {
      const cx = ML + i * (cellW + 4);
      ensureSpace(60);
      currentPage.drawRectangle({ x: cx, y: y - 50, width: cellW, height: 50, color: CARD });
      drawText(String(s.value), cx + 12, y - 15, 18, { bold: true, color: ACCENT });
      drawText(s.label, cx + 12, y - 34, 8, { color: MUTED });
    });
    y -= 65;

    // ====== LANGUAGES ======
    sectionHeader('Languages Used');

    if (profile.languages.length > 0) {
      profile.languages.forEach((l: any, i: number) => {
        ensureSpace(25);
        const ly = y - i * 22;
        drawText(l.name, ML, ly - 10, 9, { color: MUTED });

        currentPage.drawRectangle({ x: 130, y: ly - 18, width: 280, height: 13, color: rgb(0.15, 0.15, 0.25) });
        currentPage.drawRectangle({
          x: 130, y: ly - 18, width: 280 * (l.percentage / 100), height: 13, color: getLangColor(l.name),
        });
        drawText(`${l.percentage}%`, 420, ly - 12, 9, { bold: true, color: ACCENT });
      });
      y -= profile.languages.length * 22 + 10;
    } else {
      drawText('No language data', ML, y - 10, 9, { color: MUTED });
      y -= 20;
    }

    // ====== TOP REPOS ======
    sectionHeader('Top Repositories');

    profile.topRepos.forEach((r: any, i: number) => {
      ensureSpace(35);
      const ry = y - i * 30;
      currentPage.drawRectangle({ x: ML, y: ry - 24, width: CW, height: 24, color: CARD });
      drawText(`${i + 1}.`, ML + 10, ry - 16, 9, { bold: true, color: ACCENT });
      drawText(r.name, ML + 28, ry - 16, 10, { bold: true });
      drawText(`${r.stars} stars`, W - ML - 100, ry - 16, 8, { color: MUTED });
      drawText(r.language, W - ML - 25, ry - 16, 8, { color: MUTED });
    });
    y -= Math.min(profile.topRepos.length, 5) * 30 + 15;

    // ====== RECOMMENDATIONS ======
    if (profile.recommendations.length > 0) {
      sectionHeader('Recommendations');
      profile.recommendations.forEach((r: string, i: number) => {
        ensureSpace(22);
        const ry = y - i * 20;
        drawText(`> ${r}`, ML + 8, ry - 12, 9, { color: MUTED });
      });
      y -= profile.recommendations.length * 20 + 10;
    }

    // ====== CONSISTENCY ======
    ensureSpace(55);
    y = Math.max(y - 15, 60);
    currentPage.drawRectangle({ x: ML, y: y - 40, width: CW, height: 40, color: CARD });
    drawText('Consistency Score', ML + 18, y - 16, 9, { bold: true, color: MUTED });
    drawText(`${profile.consistency}%`, W - ML - 20, y - 16, 10, { bold: true, color: ACCENT });

    // Current page footer
    y = Math.min(y - 55, H - 50);

    // ====== PAGE FOOTER (on every page) ======
    for (let i = 0; i < doc.getPageCount(); i++) {
      const p = doc.getPage(i);
      const { height: ph } = p.getSize();
      p.drawRectangle({ x: 0, y: 0, width: W, height: 32, color: ACCENT });
      p.drawText(BASE_URL.replace('https://', ''), { x: ML, y: 10, size: 8, color: DARK, font });
      p.drawText('npx autodev-agent', { x: W - ML, y: 10, size: 8, color: DARK, font });
    }

    const pdfBytes = await doc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${profile.username}-autodev-report.pdf"`);
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate PDF' });
  }
}
