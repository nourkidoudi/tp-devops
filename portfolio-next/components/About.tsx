export default function About() {
  return (
    <section id="about">
      <h2>About</h2>
      <div className="two">
        <div>
          <p>
            {"Titulaire d'une Licence en Développement de Systèmes d'Information, je suis en première année de Master DevOps & Cloud Computing à l'ISET Tozeur."}
          </p>
          <p>
            {"Je viens du développement full stack (React, Node.js) et je m'intéresse à ce qui vient après le code : conteneurs, intégration continue, supervision et sécurité des accès."}
          </p>
          <p>
            {"Je cherche à rejoindre une équipe DevOps pour automatiser des pipelines et déployer des applications jusqu'en production."}
          </p>
        </div>
        <dl className="facts">
          <dt>Formation</dt>
          <dd>Master DevOps & Cloud, ISET Tozeur</dd>
          <dt>Localisation</dt>
          <dd>Tozeur, Tunisie</dd>
          <dt>Langues</dt>
          <dd>Arabe, français, anglais, allemand (notions)</dd>
          <dt>Méthode</dt>
          <dd>Scrum</dd>
        </dl>
      </div>
    </section>
  );
}
