import { getValidAccessToken, getPostLikers, getPostComments, getCurrentUser } from './client.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  const whichPost = args[0] || 'post4';

  // Post URNs - UPDATE THESE from your LinkedIn post URLs
  // Format: urn:li:activity:XXXXXXXXXXXXXXXXXXXX or urn:li:share:XXXXXXXXXXXXXXXXXXXX
  // Get from: click post → "Copy link to post" → extract the ID
  const POST_URNS = {
    post4: process.env.POST_URN_4 || 'urn:li:activity:XXXXXXXXXXXXXXXXXXXX', // 8 likers - AutoDev scorecard post
    post5: process.env.POST_URN_5 || 'urn:li:activity:XXXXXXXXXXXXXXXXXXXX', // 6 likers - npx autodev-agent post
  };

  const postUrn = POST_URNS[whichPost];
  if (!postUrn || postUrn.includes('XXXXXXXX')) {
    console.error(`❌ Post URN not set for ${whichPost}`);
    console.log('\n📝 To get Post URN:');
    console.log('   1. Go to your LinkedIn post');
    console.log('   2. Click "..." → "Copy link to post"');
    console.log('   3. URL looks like: https://www.linkedin.com/feed/update/urn:li:activity:123456789/');
    console.log('   4. Copy the URN part: urn:li:activity:123456789');
    console.log('   5. Set in .env: POST_URN_4=urn:li:activity:123456789');
    console.log('   6. Or POST_URN_5=urn:li:activity:987654321');
    process.exit(1);
  }

  try {
    const accessToken = getValidAccessToken();
    const user = await getCurrentUser(accessToken);
    console.log(`✅ Connected as: ${user.name} (${user.sub})\n`);

    console.log(`📥 Fetching likers for ${whichPost} (${postUrn})...`);
    const likers = await getPostLikers(accessToken, postUrn);
    console.log(`   Found ${likers.length} likers\n`);

    console.log(`📥 Fetching comments for ${whichPost}...`);
    const comments = await getPostComments(accessToken, postUrn);
    console.log(`   Found ${comments.length} comments\n`);

    const output = {
      postUrn,
      fetchedAt: new Date().toISOString(),
      likers: likers.map(l => ({
        name: l.actorName,
        headline: l.actorHeadline,
        profilePicture: l.actorProfilePicture,
        urn: l.actor,
      })),
      comments: comments.map(c => ({
        author: c.authorName,
        headline: c.authorHeadline,
        content: c.content,
        createdAt: c.createdAt,
        urn: c.author,
      })),
    };

    const outFile = path.join(__dirname, `likers-${whichPost}.json`);
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
    console.log(`\n💾 Saved to ${outFile}`);

    console.log('\n📋 Likers:');
    likers.forEach((l, i) => {
      console.log(`   ${i + 1}. ${l.actorName} — ${l.actorHeadline}`);
      console.log(`      URN: ${l.actor}`);
    });

    if (comments.length > 0) {
      console.log('\n💬 Comments:');
      comments.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.authorName}: "${c.content.slice(0, 80)}..."`);
      });
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.response) console.error('   Response:', err.response.data);
    process.exit(1);
  }
}

main();