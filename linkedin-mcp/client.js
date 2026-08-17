import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_FILE = path.join(__dirname, 'tokens.json');
const ENV_FILE = path.join(__dirname, '.env');

const LINKEDIN_API = 'https://api.linkedin.com/v2';
const LINKEDIN_AUTH = 'https://www.linkedin.com/oauth/v2';

let config = { clientId: '', clientSecret: '', redirectUri: '' };

function loadConfig() {
  if (fs.existsSync(ENV_FILE)) {
    const env = fs.readFileSync(ENV_FILE, 'utf8');
    env.split('\n').forEach(line => {
      const [key, ...val] = line.split('=');
      if (key === 'LINKEDIN_CLIENT_ID') config.clientId = val.join('=').trim();
      if (key === 'LINKEDIN_CLIENT_SECRET') config.clientSecret = val.join('=').trim();
      if (key === 'LINKEDIN_REDIRECT_URI') config.redirectUri = val.join('=').trim();
    });
  }
  if (!config.clientId || !config.clientSecret) {
    throw new Error('Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET in .env');
  }
  if (!config.redirectUri) {
    config.redirectUri = 'https://www.linkedin.com/developers/tools/oauth/redirect';
  }
}

function loadTokens() {
  if (fs.existsSync(TOKEN_FILE)) {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  }
  return null;
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

function getAuthHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  };
}

async function fetchWithAuth(endpoint, accessToken, options = {}) {
  const res = await axios({
    url: `${LINKEDIN_API}${endpoint}`,
    method: options.method || 'GET',
    headers: getAuthHeaders(accessToken),
    data: options.data,
    params: options.params,
  });
  return res.data;
}

export async function getCurrentUser(accessToken) {
  return fetchWithAuth('/userinfo', accessToken);
}

export async function getPostLikers(accessToken, postUrn, start = 0, count = 100) {
  const data = await fetchWithAuth(
    `/socialActions/${encodeURIComponent(postUrn)}/likes`,
    accessToken,
    { params: { start, count } }
  );
  return data.elements || [];
}

export async function getPostComments(accessToken, postUrn, start = 0, count = 100) {
  const data = await fetchWithAuth(
    `/socialActions/${encodeURIComponent(postUrn)}/comments`,
    accessToken,
    { params: { start, count } }
  );
  return data.elements || [];
}

export async function getConnections(accessToken, start = 0, count = 100) {
  const data = await fetchWithAuth(
    '/connections',
    accessToken,
    {
      params: {
        q: 'members',
        projection: '(elements*(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams)))',
        start,
        count,
      },
    }
  );
  return data.elements || [];
}

export async function getAllConnections(accessToken) {
  let all = [];
  let start = 0;
  const batchSize = 100;
  while (true) {
    const batch = await getConnections(accessToken, start, batchSize);
    if (batch.length === 0) break;
    all.push(...batch);
    start += batchSize;
    if (batch.length < batchSize) break;
  }
  return all;
}

export function getAuthUrl() {
  loadConfig();
  const state = Math.random().toString(36).substring(7);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state,
    scope: 'r_liteprofile r_emailaddress openid profile',
  });
  return { url: `${LINKEDIN_AUTH}/authorization?${params.toString()}`, state };
}

export async function exchangeCodeForTokens(code) {
  loadConfig();
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const res = await axios.post(`${LINKEDIN_AUTH}/accessToken`, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const tokens = {
    accessToken: res.data.access_token,
    refreshToken: res.data.refresh_token,
    expiresAt: Date.now() + (res.data.expires_in || 5184000) * 1000,
    scope: res.data.scope,
  };
  saveTokens(tokens);
  return tokens;
}

export function getValidAccessToken() {
  const tokens = loadTokens();
  if (!tokens) throw new Error('No tokens found. Run auth first.');
  if (Date.now() >= tokens.expiresAt - 60000) {
    throw new Error('Token expired. Re-run auth.');
  }
  return tokens.accessToken;
}