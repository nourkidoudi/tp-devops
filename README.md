# TP DevOps – Nour Kidoudi

Mise en place d'une VM Ubuntu Server 26.04 avec accès SSH sécurisé, Docker et Jenkins, puis création d'un mini CV versionné sur GitHub et push via SSH.

**Environnement :** VMware, Ubuntu Server 26.04 LTS (resolute), réseau NAT `192.168.237.0/24`, VM en `192.168.237.130`, machine physique sous Windows (PowerShell).

---

## 1. Installation d'Ubuntu Server 26.04 et accès SSH sécurisé

Installation d'Ubuntu Server 26.04 avec l'option **Install OpenSSH server** cochée. Vérification du service et de l'IP :

```bash
sudo systemctl status ssh
ip a
```

<img src="screenshots/ssh-service.png" alt="Service SSH actif et adresse IP" width="600">

Génération d'une clé Ed25519 sur la machine physique et copie vers la VM :

```powershell
ssh-keygen -t ed25519 -C "nour-vm"
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh nour@192.168.237.130 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Un avertissement `REMOTE HOST IDENTIFICATION HAS CHANGED` est apparu, car l'IP avait été utilisée par une ancienne VM. Correction :

```powershell
ssh-keygen -R 192.168.237.130
```

Durcissement de SSH, dans `/etc/ssh/sshd_config.d/99-hardening.conf` :

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
```

```bash
sudo sshd -t && sudo systemctl restart ssh
sudo ufw allow OpenSSH
sudo ufw allow 8080/tcp
sudo ufw enable
sudo ufw status
```

<img src="screenshots/ssh-config.png" alt="Configuration SSH et pare-feu" width="600">

---

## 2. Test de l'accès SSH depuis la machine physique

```powershell
ssh nour@192.168.237.130
hostname && lsb_release -a
```

Connexion réussie par clé, sans mot de passe.

<img src="screenshots/ssh-connexion.png" alt="Connexion SSH" width="600">

---

## 3. Installation de Docker sur la VM

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER && newgrp docker
docker --version
docker run hello-world
sudo systemctl status docker
```

> Docker est installé depuis les dépôts Ubuntu (paquet `docker.io`, version 29.1.3).

<img src="screenshots/docker-hello.png" alt="Version de Docker et hello-world" width="600">
<img src="screenshots/docker-status.png" alt="Service Docker actif" width="600">

---

## 4. Installation de Jenkins en tant que service

```bash
sudo apt install -y fontconfig openjdk-21-jre
java -version

sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install -y jenkins
sudo systemctl enable --now jenkins
sudo systemctl status jenkins
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

> Problème rencontré : avec l'ancienne clé `jenkins.io-2023.key`, `apt update` renvoyait `NO_PUBKEY 7198F4B714ABFC68`, car Jenkins a changé sa clé de signature. Utiliser `jenkins.io-2026.key` a résolu le problème.

Vérification depuis la machine physique : `http://192.168.237.130:8080`, avec installation des plugins suggérés et création de l'utilisateur admin.

<img src="screenshots/jenkins-install.png" alt="Installation des plugins" width="600">
<img src="screenshots/jenkins-status.png" alt="Service Jenkins" width="600">
<img src="screenshots/jenkins.png" alt="Tableau de bord Jenkins" width="600">

---

## 5. Mini CV One Page (HTML5 / CSS3 / JavaScript)

Le CV est dans le dossier [`cv/`](cv/) (`index.html`, `style.css`, `script.js`). Il propose un mode sombre mémorisé et un bouton d'impression / export PDF.

```powershell
mkdir tp-devops; cd tp-devops
git init -b main
git add .
git commit -m "Ajout du mini CV one page"
```

<img src="screenshots/cv.png" alt="CV" width="600">

---

## 6. Push GitHub via SSH

Affichage de la clé publique, ajoutée sur GitHub (*Settings → SSH and GPG keys → New SSH key*) :

```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

<img src="screenshots/github-ssh-key.png" alt="Clé SSH sur GitHub" width="600">

Test de l'authentification :

```powershell
ssh -T git@github.com
```

<img src="screenshots/github-ssh-test.png" alt="Test SSH GitHub" width="600">

Configuration du dépôt local pour utiliser SSH et push :

```powershell
git remote add origin git@github.com:nourkidoudi/tp-devops.git
git remote -v
git push -u origin main
```

<img src="screenshots/git-push.png" alt="Push GitHub" width="600">

---

## 7. Évolution : application « DevSecOps Portfolio »

Le mini CV devient une petite application web dans le dossier [`portfolio/`](portfolio/) (`index.html`, `style.css`, `script.js`, `Dockerfile`). L'ancienne version reste dans [`cv/`](cv/).

**Sections :** About, Skills, Projects, Experience, Contact.

<img src="screenshots/portfolio.png" alt="Portfolio DevSecOps" width="600">

### Principales améliorations

- **Skills présentées comme un pipeline DevSecOps** (Plan, Code, Build, Integrate, Secure, Deploy, Monitor), chaque étape avec son niveau réel : pratiqué, bases ou en apprentissage.
- **Application pilotée par les données** : projets, compétences et expériences sont des tableaux dans `script.js`, la page est générée dynamiquement.
- **Projets filtrables** par catégorie (DevSecOps, Web, Monitoring).
- **Navigation** avec menu fixe et section active mise en évidence.
- **Formulaire de contact** avec validation, qui ouvre le client mail (aucun serveur ni service tiers).
- **Mode sombre** qui suit la préférence du système et mémorise le choix, page responsive et accessible (focus visible, mouvement réduit respecté).
- **Sécurité de la page** : politique CSP stricte (aucun script ni style externe), affichage des données avec `textContent` et non `innerHTML`, liens externes en `rel="noopener noreferrer"`.
- **Conteneurisation** : `Dockerfile` basé sur nginx sans droits root.

### Lancer le portfolio

En local : ouvrir `portfolio/index.html` dans le navigateur.

Dans un conteneur, sur la VM :

```bash
cd portfolio
docker build -t portfolio .
docker run -d --name portfolio -p 8081:8080 portfolio
```
Puis ouvrir `http://192.168.237.130:8081` depuis la machine physique (autoriser le port avec `sudo ufw allow 8081/tcp`).


## 8. Section « DevSecOps Skills »

Une section **DevSecOps Skills** est ajoutée au portfolio ([`portfolio/`](portfolio/)). Elle affiche les 7 technologies demandées :

- **Utilisés dans ce projet :** Git, Docker, Jenkins, avec pour chacun l'usage réel (dépôt GitHub en SSH, conteneurs sur la VM, Jenkins installé comme service).
- **Prochaines étapes :** Kubernetes, Ansible, Terraform, Argo CD, affichés comme « à découvrir » avec leur rôle (orchestration, configuration as code, infrastructure as code, GitOps).

Chaque carte indique le rôle de l'outil et un niveau (pratiqué, bases ou à découvrir), ce qui reste fidèle à ce qui a été réalisé.

<img src="screenshots/devsecops-skills.png" alt="Section DevSecOps Skills" width="600">

## 9. Section « Projects » générée dynamiquement en JavaScript

Les projets ne sont pas écrits en HTML : ils sont décrits dans un **tableau d'objets** (`PROJECTS` dans [`portfolio/script.js`](portfolio/script.js)), et la page est construite à partir de ce tableau. Pour ajouter un projet, il suffit d'ajouter un objet, sans toucher au HTML.

```javascript
const PROJECTS = [
  { cat: 'DevSecOps', title: 'VM DevSecOps sécurisée',
    text: 'Ubuntu Server 26.04, accès SSH par clé, pare-feu, Docker et Jenkins en service.',
    tags: ['Linux', 'SSH', 'Docker', 'Jenkins'],
    link: 'https://github.com/nourkidoudi/tp-devops' },
  { cat: 'Web', title: 'Smart City Web Platform',
    text: 'Plateforme pour les services urbains et l\'engagement citoyen.',
    tags: ['React.js', 'Node.js', 'API REST'] },
  // ...
];

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
    ul.appendChild(li);
  });
}
```

Le code fait trois choses :
- `PROJECTS.filter(...)` sélectionne les projets selon la catégorie choisie ;
- `forEach` crée un bloc de page par objet (titre, catégorie, description, technologies, lien) ;
- les boutons de filtre (Tous, DevSecOps, Web, Monitoring) sont eux aussi générés à partir du tableau et appellent `renderProjects`.

Le texte est inséré avec `textContent` (fonction `el`), jamais avec `innerHTML`, ce qui évite l'injection de code.

**Résultat :**

<img src="screenshots/projects.png" alt="Section Projects générée dynamiquement" width="600">

---
---
## 10. Dockerisation initiale

Le portfolio est servi par **Nginx** dans un conteneur grâce au fichier [`portfolio/Dockerfile`](portfolio/Dockerfile) :

```dockerfile
# Image Nginx qui s'exécute sans droits root (écoute sur le port 8080)
FROM nginxinc/nginx-unprivileged:alpine

# Copie des fichiers statiques du portfolio dans le dossier servi par Nginx
COPY index.html style.css script.js /usr/share/nginx/html/

# Port d'écoute du conteneur
EXPOSE 8080
```

**Explication :**
- `FROM nginxinc/nginx-unprivileged:alpine` : image officielle de Nginx, légère (Alpine) et exécutée sans droits root, ce qui limite les risques.
- `COPY ...` : le portfolio est un site statique, il suffit de copier ses trois fichiers dans le dossier que Nginx sert par défaut.
- `EXPOSE 8080` : cette image écoute sur le port 8080 (sans droits root, le port 80 n'est pas utilisable).

---
## 11. Construction de l'image Docker `cv-docker`

Commande utilisée sur la VM, dans le dossier `portfolio/` qui contient le Dockerfile :

```bash
docker build -t cv-docker .
```

- `docker build` construit une image à partir du Dockerfile ;
- `-t cv-docker` donne le nom `cv-docker` à l'image ;
- `.` indique que le Dockerfile se trouve dans le dossier courant.

Vérification avec `docker images cv-docker` :

<img src="screenshots/docker-build.png" alt="Construction de l'image cv-docker" width="600">

---
## 12. Exécution du conteneur et accès depuis la machine physique

Commande utilisée sur la VM :

```bash
docker run -d --name cv-docker -p 8081:8080 cv-docker
```

- `-d` : exécution en arrière-plan ;
- `--name cv-docker` : nom du conteneur ;
- `-p 8081:8080` : le port 8081 de la VM est redirigé vers le port 8080 du conteneur (Nginx) ;
- `cv-docker` : image construite à l'étape 11.

Le port est ouvert dans le pare-feu avec `sudo ufw allow 8081/tcp`.

Résultat de `docker ps` :

```
COLLER ICI LA SORTIE RÉELLE DE docker ps
```

<img src="screenshots/docker-run.png" alt="docker run et docker ps" width="600">

Accès depuis la machine physique sur `http://192.168.237.130:8081` :

<img src="screenshots/acces-portfolio.png" alt="Portfolio accessible depuis la machine physique" width="600">

---
## 13. Déploiement avec Docker Compose

Le fichier [`portfolio/docker-compose.yml`](portfolio/docker-compose.yml) décrit le service :

```yaml
services:
  portfolio:
    build: .
    image: cv-docker
    container_name: portfolio
    ports:
      - "8081:8080"
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
```

- `build: .` construit l'image à partir du Dockerfile du dossier ;
- `image: cv-docker` nomme l'image ;
- `ports: "8081:8080"` expose le portfolio sur le port 8081 de la VM ;
- `restart: unless-stopped` relance le conteneur après un redémarrage de la VM ;
- `no-new-privileges` empêche le processus du conteneur d'obtenir de nouveaux droits.

Commande utilisée sur la VM, dans le dossier `portfolio/` :

```bash
docker compose up -d
```

Résultat de `docker compose ps` :

```
COLLER ICI LA SORTIE RÉELLE DE docker compose ps
```

<img src="screenshots/compose-ps.png" alt="docker compose up et docker compose ps" width="600">

Accès depuis la machine physique sur `http://192.168.237.130:8081` :

<img src="screenshots/compose-acces.png" alt="Portfolio servi par Docker Compose" width="600">

---
## 14. Publication sur GitHub via SSH

Le dépôt est relié à GitHub par SSH (clé `PC-lenovo`, voir l'étape 6). Commandes Git utilisées pour publier les modifications :

```bash
git remote -v                # vérifie que l'origine utilise SSH (git@github.com:...)
ssh -T git@github.com        # teste l'authentification SSH
git status                   # liste les fichiers modifiés
git add -A                   # ajoute les modifications à l'index
git commit -m "Message"      # enregistre les modifications
git push                     # publie sur GitHub via SSH
git log --oneline            # affiche l'historique des commits
```

Dépôt GitHub mis à jour : **https://github.com/nourkidoudi/tp-devops**

---
## 17. Configuration automatique de la VM

Le `Vagrantfile` configure le nom de la VM, l'adresse IP privée, la mémoire et le nombre de CPU :

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "cloud-image/ubuntu-24.04"
  # La virtualisation imbriquée ralentit le démarrage : on augmente le délai d'attente
  config.vm.boot_timeout = 1200

  # Nom de la VM dans Vagrant (vagrant status) et nom d'hôte
  config.vm.define "ubuntu-devops" do |node|
    node.vm.hostname = "ubuntu-devops"

    # Adresse IP privée (réseau host-only)
    node.vm.network "private_network", ip: "192.168.56.10"

    node.vm.provider "virtualbox" do |vb|
      vb.name   = "ubuntu-devops"   # nom de la VM dans VirtualBox
      vb.memory = 1536              # mémoire en Mo
      vb.cpus   = 2                 # nombre de CPU
      # IO-APIC nécessaire pour que le système invité utilise plusieurs CPU
      vb.customize ["modifyvm", :id, "--ioapic", "on"]
      # Désactive la console série, qui ralentit fortement le démarrage des images cloud Ubuntu
      vb.customize ["modifyvm", :id, "--uartmode1", "disconnected"]
    end

    node.vm.provision "shell", inline: <<-SHELL
      echo "VM créée automatiquement par Vagrant" > /home/vagrant/bienvenue.txt
    SHELL
  end
end
```

| Paramètre | Directive | Valeur |
|---|---|---|
| Nom de la VM | `config.vm.define`, `vb.name` | `ubuntu-devops` |
| Adresse IP privée | `private_network` | `192.168.56.10` |
| Mémoire | `vb.memory` | 1536 Mo |
| Nombre de CPU | `vb.cpus` | 2 |

Remarque : sans l'IO-APIC, l'invité ne voyait qu'un seul CPU malgré `vb.cpus = 2`. L'ajout de `--ioapic on` a corrigé ce point.

Résultat de `vagrant status` :

```
COLLER ICI LA SORTIE RÉELLE DE vagrant status
```

<img src="screenshots/vagrant-status.png" alt="vagrant status" width="600">

Vérification dans la VM (nom d'hôte, interface `192.168.56.10`, mémoire, 2 CPU) :

<img src="screenshots/vagrant-config.png" alt="Vérification de la configuration" width="600">

---
## 18. Migration du portfolio vers Next.js

Commande de création du projet :

```bash
npx create-next-app@latest portfolio-next
```

Next.js 16 avec le routeur App Router et TypeScript. Les mêmes sections que la version HTML/CSS/JavaScript sont conservées : About, Skills, DevSecOps Skills, Projects, Experience et Contact. Lancement : `npm run dev`, puis `http://localhost:3000`.

<img src="screenshots/next-home.png" alt="Portfolio Next.js" width="600">

---

## 19. Composants réutilisables

```
portfolio-next/
├── app/
│   ├── layout.tsx          # Header + Footer autour de chaque page
│   ├── page.tsx            # page d'accueil : assemble les sections
│   ├── globals.css
│   └── projects/
│       ├── page.tsx        # /projects
│       └── [slug]/page.tsx # /projects/nom-du-projet
├── components/
│   ├── Header.tsx  ThemeToggle.tsx  Footer.tsx
│   ├── Hero.tsx  About.tsx  Skills.tsx  Tools.tsx
│   ├── Projects.tsx  ProjectList.tsx
│   ├── Experience.tsx
│   └── Contact.tsx  ContactForm.tsx
└── data/
    ├── types.ts  stages.ts  tools.ts
    └── projects.ts  experience.ts
```

La page d'accueil assemble les composants :

```tsx
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Tools />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
```

---

## 20. Données séparées des composants

Les projets, compétences et expériences sont dans le dossier `data/`, typés avec TypeScript. Exemple extrait de `data/projects.ts` :

```ts
export const projects: Project[] = [
  {
    slug: "smart-city-web-platform",
    category: "Web",
    title: "Smart City Web Platform",
    status: "Projet de fin d'études",
    summary: "Plateforme pour les services urbains et l'engagement citoyen.",
    tags: ["React.js", "Node.js", "API REST"],
    // ...
  },
];
```

Les composants lisent ces données avec `projects.map(...)` : pour ajouter un projet, il suffit d'ajouter un objet.

---

## 21. Pages dédiées aux projets

- `/projects` affiche la liste de tous les projets, avec filtre par catégorie ;
- `/projects/nom-du-projet` affiche le détail d'un projet (route dynamique `app/projects/[slug]/page.tsx`).

Un projet inconnu renvoie une page 404 grâce à `notFound()`.

<img src="screenshots/next-projects.png" alt="Page /projects" width="600">
<img src="screenshots/next-projet.png" alt="Page d'un projet" width="600">

---
**Dépôt :** https://github.com/nourkidoudi/tp-devops
