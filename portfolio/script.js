'use strict';

/* ---------- Données (à modifier ici) ---------- */
const STATE_LABEL = { done: 'Pratiqué', part: 'Bases', wip: 'En apprentissage' };

const STAGES = [
  { name: 'Plan', state: 'done', tools: ['Scrum', 'UML'], text: 'Gestion de projet agile et modélisation des besoins.' },
  { name: 'Code', state: 'done', tools: ['Git / GitHub', 'JavaScript', 'React.js', 'Node.js', 'Java', 'Python'], text: 'Développement full stack et gestion de versions.' },
  { name: 'Build', state: 'part', tools: ['Docker'], text: 'Docker installé et testé sur une VM Ubuntu Server.' },
  { name: 'Integrate', state: 'part', tools: ['Jenkins', 'GitHub Actions'], text: 'Jenkins installé comme service ; pipelines CI/CD en cours d\'apprentissage.' },
  { name: 'Secure', state: 'part', tools: ['SSH par clé', 'Pare-feu UFW', 'Root désactivé'], text: 'Accès distant durci sur la VM : mot de passe SSH désactivé, seuls les ports utiles ouverts.' },
  { name: 'Deploy', state: 'wip', tools: ['Kubernetes', 'AWS', 'Azure'], text: 'Orchestration de conteneurs et cloud : découverte progressive.' },
  { name: 'Monitor', state: 'wip', tools: ['Prometheus', 'Grafana'], text: 'Supervision et alertes : sujet de mon projet de stage à l\'aéroport de Tozeur–Nefta.' }
];


const TOOLS = [
  { name: 'Git', mono: 'Git', role: 'Versioning', used: true, state: 'done', label: 'Pratiqué', text: 'Dépôt GitHub, commits et push via clé SSH : historique du CV et du portfolio.' },
  { name: 'Docker', mono: 'Dk', role: 'Conteneurs', used: true, state: 'part', label: 'Bases', text: 'Installé sur la VM Ubuntu et validé avec hello-world ; Dockerfile nginx pour servir le portfolio.' },
  { name: 'Jenkins', mono: 'Jk', role: 'CI/CD', used: true, state: 'part', label: 'Bases', text: 'Installé comme service sur la VM, tableau de bord accessible depuis la machine physique.' },
  { name: 'Kubernetes', mono: 'K8', role: 'Orchestration', used: false, state: 'wip', label: 'À découvrir', text: 'Déployer et faire évoluer des conteneurs sur un cluster.' },
  { name: 'Ansible', mono: 'An', role: 'Configuration as code', used: false, state: 'wip', label: 'À découvrir', text: 'Automatiser la configuration de la VM (SSH, pare-feu, Docker) au lieu de la faire à la main.' },
  { name: 'Terraform', mono: 'Tf', role: 'Infrastructure as Code', used: false, state: 'wip', label: 'À découvrir', text: 'Décrire et créer l\'infrastructure cloud (AWS, Azure) par le code.' },
  { name: 'Argo CD', mono: 'Ar', role: 'GitOps', used: false, state: 'wip', label: 'À découvrir', text: 'Déployer automatiquement sur Kubernetes à partir d\'un dépôt Git.' }
];

const PROJECTS = [
  { cat: 'DevSecOps', title: 'VM DevSecOps sécurisée', text: 'Ubuntu Server 26.04, accès SSH par clé, pare-feu, Docker et Jenkins en service, documenté dans un dépôt Git.', tags: ['Linux', 'SSH', 'Docker', 'Jenkins'], link: 'https://github.com/nourkidoudi/tp-devops' },
  { cat: 'Web', title: 'Smart City Web Platform', text: 'Plateforme pour les services urbains et l\'engagement citoyen : chatbot IA, scan de QR codes et gestion multi-rôles.', tags: ['React.js', 'Node.js', 'API REST'] },
  { cat: 'Monitoring', title: 'InfraWatch', text: 'Plateforme de supervision d\'infrastructure IT en temps réel.', tags: ['Supervision', 'Temps réel'] },
  { cat: 'Monitoring', title: 'Monitoring Tozeur–Nefta (proposé)', text: 'Projet proposé : tableau de bord live des serveurs et services, avec alertes automatiques et statistiques de performance.', tags: ['Prometheus', 'Grafana', 'Docker', 'Linux'] }
];

const EXPERIENCE = [
  { when: 'Été 2026', role: 'Stagiaire, supervision d\'infrastructure IT', where: 'Aéroport de Tozeur–Nefta (OACA)', text: 'Supervision et monitoring d\'infrastructure IT.' },
  { when: 'Fév 2025', role: 'Stagiaire PFE, développeuse full stack', where: 'Desert Navigation, Tozeur', text: 'Plateforme Smart City avec React.js, Node.js, API RESTful et base de données.' },
  { when: 'Juil 2024', role: 'Stagiaire d\'été, développeuse web', where: 'Addinn', text: 'Développement d\'une mini-application web.' },
  { when: 'Jan 2024', role: 'Stagiaire, technicienne IT', where: 'ITQAN', text: 'Systèmes logiciels et infrastructure IT.' },
  { when: 'Jan 2023', role: 'Stagiaire, technicienne réseaux', where: 'Tunisie Télécom', text: 'Réseaux GSM, supervision et maintenance.' }
];

/* ---------- Rendu (textContent uniquement, jamais innerHTML) ---------- */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function tagList(items) {
  const ul = el('ul', 'tags');
  items.forEach(t => ul.appendChild(el('li', '', t)));
  return ul;
}

function renderPipeline() {
  const ol = document.getElementById('pipeline');
  STAGES.forEach(s => {
    const li = el('li');
    const a = el('a');
    a.href = '#stage-' + s.name.toLowerCase();
    a.appendChild(el('span', 'dot ' + s.state));
    a.appendChild(document.createTextNode(s.name));
    li.appendChild(a);
    ol.appendChild(li);
  });
}

function renderSkills() {
  const ol = document.getElementById('skill-list');
  STAGES.forEach(s => {
    const li = el('li');
    li.id = 'stage-' + s.name.toLowerCase();
    const head = el('h3');
    head.appendChild(el('span', 'dot ' + s.state));
    head.appendChild(document.createTextNode(s.name));
    head.appendChild(el('span', 'state', STATE_LABEL[s.state]));
    const body = el('div');
    body.appendChild(tagList(s.tools));
    body.appendChild(el('p', '', s.text));
    li.append(head, body);
    ol.appendChild(li);
  });
}

function renderTools() {
  TOOLS.forEach(t => {
    const li = el('li', 'tool' + (t.used ? '' : ' next'));
    li.appendChild(el('span', 'mono', t.mono));
    li.appendChild(el('h4', '', t.name));
    li.appendChild(el('span', 'role', t.role));
    const badge = el('span', 'badge');
    badge.appendChild(el('span', 'dot ' + t.state));
    badge.appendChild(document.createTextNode(t.label));
    li.appendChild(badge);
    li.appendChild(el('p', '', t.text));
    document.getElementById(t.used ? 'tools-used' : 'tools-next').appendChild(li);
  });
}

function renderProjects(filter) {
  const ul = document.getElementById('project-list');
  ul.replaceChildren();
  PROJECTS.filter(p => filter === 'Tous' || p.cat === filter).forEach(p => {
    const li = el('li');
    li.dataset.cat = p.cat;
    li.appendChild(el('h3', '', p.title));
    li.appendChild(el('p', 'cat', p.cat));
    li.appendChild(el('p', '', p.text));
    li.appendChild(tagList(p.tags));
    if (p.link) {
      const a = el('a', '', 'Voir sur GitHub');
      a.href = p.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const wrap = el('p');
      wrap.appendChild(a);
      li.appendChild(wrap);
    }
    ul.appendChild(li);
  });
}

function renderFilters() {
  const box = document.getElementById('filters');
  const cats = ['Tous', ...new Set(PROJECTS.map(p => p.cat))];
  cats.forEach((c, i) => {
    const b = el('button', '', c);
    b.type = 'button';
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => {
      box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      renderProjects(c);
    });
    box.appendChild(b);
  });
}

function renderExperience() {
  const ol = document.getElementById('exp-list');
  EXPERIENCE.forEach(e => {
    const li = el('li');
    li.append(el('div', 'when', e.when), el('h3', '', e.role), el('p', 'where', e.where), el('p', '', e.text));
    ol.appendChild(li);
  });
}

/* ---------- Thème ---------- */
const themeBtn = document.getElementById('theme');
function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeBtn.textContent = dark ? 'Mode clair' : 'Mode sombre';
}
let saved = null;
try { saved = localStorage.getItem('portfolio-theme'); } catch (e) { /* stockage indisponible */ }
applyTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
themeBtn.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  applyTheme(dark);
  try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch (e) {}
});

/* ---------- Navigation : section active ---------- */
function initScrollSpy() {
  const links = [...document.querySelectorAll('.bar nav a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.removeAttribute('aria-current'));
      const active = links.find(a => a.getAttribute('href') === '#' + entry.target.id);
      if (active) active.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => s && observer.observe(s));
}

/* ---------- Formulaire : validation puis ouverture du client mail ---------- */
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-msg').value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || message.length < 5) {
    status.className = 'err';
    status.textContent = 'Renseignez un nom, un email valide et un message d\'au moins 5 caractères.';
    return;
  }
  const subject = encodeURIComponent('Contact portfolio : ' + name);
  const body = encodeURIComponent(message + '\n\n' + name + ' (' + email + ')');
  status.className = '';
  status.textContent = 'Votre application mail va s\'ouvrir avec le message prêt à envoyer.';
  window.location.href = 'mailto:nour.kidoudi@gmail.com?subject=' + subject + '&body=' + body;
});

renderPipeline();
renderSkills();
renderTools();
renderFilters();
renderProjects('Tous');
renderExperience();
initScrollSpy();
