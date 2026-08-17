import { fileURLToPath } from 'url';
import path from 'path';
import { getAuthUrl, exchangeCodeForTokens } from './client.js';
import { createServer } from 'http';
import { URL } from 'url';
import open from 'open';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('🔐 Starting LinkedIn OAuth flow...\n');

  const { url, state } = getAuthUrl();
  console.log('📋 Opening browser for authorization...');
  console.log(`   If browser doesn't open, visit:\n   ${url}\n`);

  await open(url);

  const codePromise = new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:3000`);
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      const errorDesc = url.searchParams.get('error_description');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error: ${error}</h1><p>${errorDesc || ''}</p>`);
        reject(new Error(`${error}: ${errorDesc}`));
        server.close();
        return;
      }

      if (returnedState !== state) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>Invalid state parameter</h1>');
        reject(new Error('Invalid state'));
        server.close();
        return;
      }

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <h1>✅ Authorization successful!</h1>
          <p>You can close this window and return to the terminal.</p>
          <script>setTimeout(() => window.close(), 2000);</script>
        `);
        resolve(code);
        server.close();
      }
    });

    server.listen(3000, () => {
      console.log('🌐 Callback server running on http://localhost:3000');
    });
  });

  try {
    const code = await codePromise;
    console.log('✅ Authorization code received, exchanging for tokens...\n');

    const tokens = await exchangeCodeForTokens(code);
    console.log('✅ Tokens saved successfully!');
    console.log(`   Access token expires: ${new Date(tokens.expiresAt).toLocaleString()}`);
    console.log(`   Scope: ${tokens.scope}`);
    console.log('\n🎉 Ready to use LinkedIn API! Run:');
    console.log('   npm run likers:post4   # Fetch 8 likers from post #4');
    console.log('   npm run likers:post5   # Fetch 6 likers from post #5');
    console.log('   npm run connections    # Fetch all 292 connections');
    console.log('   npm run warm-leads     # Generate CSV for DM outreach');
  } catch (err) {
    console.error('❌ Auth failed:', err.message);
    process.exit(1);
  }
}

main();