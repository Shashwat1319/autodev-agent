const core = require('@actions/core');

async function main() {
  const username = core.getInput('username', { required: true });
  const minScore = parseInt(core.getInput('min-score') || '50', 10);
  const apiBase = core.getInput('api-base') || 'https://autodev-kappa.vercel.app';

  if (isNaN(minScore) || minScore < 0 || minScore > 100) {
    core.setFailed('min-score must be a number between 0 and 100');
    return;
  }

  const url = `${apiBase}/api/analyze?username=${encodeURIComponent(username)}`;
  core.info(`Fetching AutoDev score for ${username} from ${apiBase}...`);

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    core.setFailed(`Could not reach AutoDev API: ${err.message}`);
    return;
  }

  if (!response.ok) {
    core.setFailed(`AutoDev API returned ${response.status} for ${username}`);
    return;
  }

  const data = await response.json();
  const score = data?.overallScore ?? data?.score;

  if (typeof score !== 'number') {
    core.setFailed('AutoDev API returned no score in response');
    return;
  }

  core.setOutput('score', score);
  core.setOutput('report-url', `${apiBase}/dashboard?user=${encodeURIComponent(username)}`);

  if (score < minScore) {
    core.setFailed(
      `AutoDev score for ${username} is ${score}/100 — below the minimum of ${minScore}. ` +
      `Improve it at ${apiBase}/dashboard?user=${encodeURIComponent(username)}`
    );
  } else {
    core.info(`✅ AutoDev score for ${username}: ${score}/100 (minimum: ${minScore})`);
  }
}

main().catch((err) => core.setFailed(err.message));
