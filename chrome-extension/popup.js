document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('username-input');
  const btn = document.getElementById('analyze-btn');
  const result = document.getElementById('result');
  const error = document.getElementById('error');

  let analyzing = false;

  btn.addEventListener('click', analyze);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') analyze(); });

  async function analyze() {
    const username = input.value.trim();
    if (!username || analyzing) return;

    analyzing = true;
    btn.disabled = true;
    btn.textContent = 'Analyzing...';
    error.textContent = '';
    result.innerHTML = '';

    try {
      const res = await fetch(`https://autodev-kappa.vercel.app/api/analyze?username=${encodeURIComponent(username)}`);
      if (!res.ok) {
        let errorMsg = 'Failed to analyze';
        try { const e = await res.json(); errorMsg = e.error || errorMsg; } catch {}
        throw new Error(errorMsg);
      }
      const data = await res.json();
      showResult(data);
    } catch (err) {
      error.textContent = (err instanceof Error ? err.message : String(err)) || 'An error occurred';
    }

    analyzing = false;
    btn.disabled = false;
    btn.textContent = 'Analyze';
  }

  function showResult(data) {
    result.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'result';

    const score = document.createElement('div');
    score.className = 'score';
    score.textContent = `${data.overallScore}/100`;
    container.appendChild(score);

    const scoreLabel = document.createElement('div');
    scoreLabel.className = 'score-label';
    scoreLabel.textContent = 'AutoDev Score';
    container.appendChild(scoreLabel);

    const stats = document.createElement('div');
    stats.className = 'stats';
    stats.innerHTML = `<span>📦 <span class="stat-value">${data.totalRepos}</span> repos</span><span>⭐ <span class="stat-value">${data.totalStars}</span> stars</span><span>🍴 <span class="stat-value">${data.totalForks}</span> forks</span>`;
    container.appendChild(stats);

    const links = document.createElement('div');
    links.className = 'links';

    const reportLink = document.createElement('a');
    reportLink.href = `https://autodev-kappa.vercel.app/dashboard?user=${encodeURIComponent(data.username)}`;
    reportLink.target = '_blank';
    reportLink.textContent = 'View Full Report →';
    links.appendChild(reportLink);

    const readmeLink = document.createElement('a');
    readmeLink.href = `https://autodev-kappa.vercel.app/readme-generator?username=${encodeURIComponent(data.username)}`;
    readmeLink.target = '_blank';
    readmeLink.textContent = 'Generate README →';
    links.appendChild(readmeLink);

    container.appendChild(links);
    result.appendChild(container);
  }
});
