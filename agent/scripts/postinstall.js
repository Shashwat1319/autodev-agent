#!/usr/bin/env node
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

console.log('');
console.log(
  colors.cyan + '  ⚡ AutoDev Agent installed! ' + colors.reset +
  colors.green + 'Your code. Auto-piloted.' + colors.reset
);
console.log('');
console.log(colors.yellow + '  📊 Get your GitHub profile score (free, no login):' + colors.reset);
console.log('  https://autodev-kappa.vercel.app/dashboard?user=YOUR_USERNAME');
console.log('');
console.log(colors.yellow + '  🏆 Add a live score badge to your GitHub README:' + colors.reset);
console.log('  https://autodev-kappa.vercel.app/readme-generator');
console.log('');
console.log('  📦 Try: ' + colors.cyan + 'npx autodev-agent' + colors.reset + ' — auto-commit & push your code');
console.log('');
