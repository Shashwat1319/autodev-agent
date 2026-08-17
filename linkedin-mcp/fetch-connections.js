import { getValidAccessToken, getAllConnections, getCurrentUser } from './client.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    const accessToken = getValidAccessToken();
    const user = await getCurrentUser(accessToken);
    console.log(`✅ Connected as: ${user.name} (${user.sub})\n`);

    console.log('📥 Fetching all connections (this may take a while)...');
    const connections = await getAllConnections(accessToken);
    console.log(`\n   Total connections: ${connections.length}\n`);

    const output = {
      fetchedAt: new Date().toISOString(),
      total: connections.length,
      connections: connections.map(c => ({
        name: c.actorName,
        headline: c.actorHeadline,
        profilePicture: c.actorProfilePicture,
        urn: c.actor,
      })),
    };

    const outFile = path.join(__dirname, 'connections.json');
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
    console.log(`💾 Saved to ${outFile}`);

    console.log('\n📋 First 10 connections:');
    connections.slice(0, 10).forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.actorName} — ${c.actorHeadline}`);
    });
    console.log(`   ... and ${connections.length - 10} more`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.response) console.error('   Response:', err.response.data);
    process.exit(1);
  }
}

main();