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
        const e = await res.json();
        throw new Error(e.error || 'Failed to analyze');
      }
      const data = await res.json();
      showResult(data);
    } catch (err) {
      error.textContent = err.message;
    }

    analyzing = false;
    btn.disabled = false;
    btn.textContent = 'Analyze';
  }

  function showResult(data) {
    result.innerHTML = `
      <div class="result">
        <div class="score">${data.overallScore}/100</div>
        <div class="score-label">AutoDev Score</div>
        <div class="stats">
          <span>📦 <span class="stat-value">${data.totalRepos}</span> repos</span>
          <span>⭐ <span class="stat-value">${data.totalStars}</span> stars</span>
          <span>🍴 <span class="stat-value">${data.totalForks}</span> forks</span>
        </div>
        <div class="links">
          <a href="https://autodev-kappa.vercel.app/dashboard?user=${data.username}" target="_blank">View Full Report →</a>
          <a href="https://autodev-kappa.vercel.app/readme-generator?user=${data.username}" target="_blank">Generate README →</a>
        </div>
      </div>
    `;
  }
});
