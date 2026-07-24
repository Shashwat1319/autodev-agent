import type { NextApiResponse } from 'next';
import { BASE_URL } from '../lib/config';

const pages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/dashboard', priority: '0.8', changefreq: 'weekly' },
  { loc: '/leaderboard', priority: '0.7', changefreq: 'daily' },
  { loc: '/readme-generator', priority: '0.8', changefreq: 'weekly' },
  { loc: '/pro-report/Shashwat1319', priority: '0.5', changefreq: 'monthly' },
  { loc: '/dashboard?user=Shashwat1319', priority: '0.6', changefreq: 'weekly' },
];

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  const lastmod = new Date().toISOString().split('T')[0];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(p => `<url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n  ')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() { return null; }
