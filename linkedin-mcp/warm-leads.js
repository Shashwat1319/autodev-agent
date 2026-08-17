import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadJSON(file) {
  const p = path.join(__dirname, file);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function generateDM(name, headline, isRecruiter = false) {
  if (isRecruiter) {
    return `Hi ${name} — thanks for the like on my AutoDev post! 🙌 Since you're in recruitment: recruiters check GitHub before calling candidates. Free analyzer scores any profile /100 in 10s: https://autodev-kappa.vercel.app/dashboard. Want to test a candidate's profile? Drop their GitHub username, I'll send you the scorecard.`;
  }
  return `Hi ${name} — liked my AutoDev post 🙌 Free GitHub score in 10s: https://autodev-kappa.vercel.app/dashboard. Drop your GitHub username, I'll reply with your score + #1 fix.`;
}

function main() {
  const likers4 = loadJSON('likers-post4.json');
  const likers5 = loadJSON('likers-post5.json');
  const connections = loadJSON('connections.json');

  const allLeads = [];

  if (likers4?.likers) {
    likers4.likers.forEach(l => {
      allLeads.push({
        source: 'post4_liker',
        name: l.name,
        headline: l.headline,
        urn: l.urn,
        dmScript: generateDM(l.name, l.headline),
      });
    });
  }

  if (likers5?.likers) {
    likers5.likers.forEach(l => {
      allLeads.push({
        source: 'post5_liker',
        name: l.name,
        headline: l.headline,
        urn: l.urn,
        dmScript: generateDM(l.name, l.headline),
      });
    });
  }

  if (connections?.connections) {
    connections.connections
      .filter(c => c.headline && (c.headline.toLowerCase().includes('recruit') || c.headline.toLowerCase().includes('hr') || c.headline.toLowerCase().includes('talent')))
      .forEach(c => {
        allLeads.push({
          source: 'connection_recruiter',
          name: c.name,
          headline: c.headline,
          urn: c.urn,
          dmScript: generateDM(c.name, c.headline, true),
        });
      });
  }

  // CSV export
  const csvHeader = 'Source,Name,Headline,URN,DM Script\n';
  const csvRows = allLeads.map(l =>
    `"${l.source}","${l.name.replace(/"/g, '""')}","${l.headline.replace(/"/g, '""')}","${l.urn}","${l.dmScript.replace(/"/g, '""')}"`
  ).join('\n');

  fs.writeFileSync(path.join(__dirname, 'warm-leads.csv'), csvHeader + csvRows);
  console.log(`\n📊 Generated warm-leads.csv with ${allLeads.length} leads`);
  console.log(`   - Post #4 likers: ${likers4?.likers?.length || 0}`);
  console.log(`   - Post #5 likers: ${likers5?.likers?.length || 0}`);
  console.log(`   - Recruiter connections: ${allLeads.filter(l => l.source === 'connection_recruiter').length}`);

  // Also save JSON for programmatic use
  fs.writeFileSync(path.join(__dirname, 'warm-leads.json'), JSON.stringify(allLeads, null, 2));
  console.log('\n💾 Also saved warm-leads.json');

  console.log('\n📋 Ready for outreach! Open warm-leads.csv in Excel/Sheets, copy DM scripts, send manually.');
}

main();