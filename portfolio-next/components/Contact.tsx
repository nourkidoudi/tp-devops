import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact">
      <h2>Contact</h2>
      <div className="two">
        <ul className="plain">
          <li>
            <a href="mailto:nour.kidoudi@gmail.com">nour.kidoudi@gmail.com</a>
          </li>
          <li>
            <a href="https://linkedin.com/in/nour-kidoudi-099273287" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/nourkidoudi" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>Tozeur, Tunisie</li>
        </ul>
        <ContactForm />
      </div>
    </section>
  );
}
