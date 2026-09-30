const themeBtn = document.getElementById('theme');

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeBtn.textContent = dark ? 'Mode clair' : 'Mode sombre';
}

let saved = null;
try { saved = localStorage.getItem('cv-theme'); } catch (e) { /* stockage indisponible */ }
applyTheme(saved === 'dark');

themeBtn.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  applyTheme(dark);
  try { localStorage.setItem('cv-theme', dark ? 'dark' : 'light'); } catch (e) {}
});

document.getElementById('print').addEventListener('click', () => window.print());