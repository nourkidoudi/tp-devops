"use client";

import { useState } from "react";

const EMAIL = "nour.kidoudi@gmail.com";

export default function ContactForm() {
  const [status, setStatus] = useState<{ text: string; error: boolean }>({
    text: "",
    error: false,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || message.length < 5) {
      setStatus({
        text: "Renseignez un nom, un email valide et un message d'au moins 5 caractères.",
        error: true,
      });
      return;
    }

    const subject = encodeURIComponent("Contact portfolio : " + name);
    const body = encodeURIComponent(message + "\n\n" + name + " (" + email + ")");
    setStatus({
      text: "Votre application mail va s'ouvrir avec le message prêt à envoyer.",
      error: false,
    });
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="f-name">Nom</label>
      <input id="f-name" name="name" type="text" autoComplete="name" maxLength={80} />
      <label htmlFor="f-email">Email</label>
      <input id="f-email" name="email" type="email" autoComplete="email" maxLength={120} />
      <label htmlFor="f-msg">Message</label>
      <textarea id="f-msg" name="message" rows={4} maxLength={1000} />
      <button type="submit">Envoyer par email</button>
      <p className={status.error ? "form-status err" : "form-status"} role="status">
        {status.text}
      </p>
    </form>
  );
}
