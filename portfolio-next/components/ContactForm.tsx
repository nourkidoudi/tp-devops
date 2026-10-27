"use client";

import { useState } from "react";

type Status = { text: string; error: boolean };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ text: "", error: false });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // à garder avant le await
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);

    if (!payload.name || !emailOk || payload.message.length < 5) {
      setStatus({
        text: "Renseignez un nom, un email valide et un message d'au moins 5 caractères.",
        error: true,
      });
      return;
    }

    setSending(true);
    setStatus({ text: "", error: false });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({ text: "Message envoyé, merci !", error: false });
        form.reset();
      } else if (res.status === 400 && Array.isArray(json.details)) {
        setStatus({
          text: json.details.map((d: { message: string }) => d.message).join(" "),
          error: true,
        });
      } else if (res.status === 429) {
        setStatus({ text: "Trop de messages envoyés, réessayez plus tard.", error: true });
      } else {
        setStatus({ text: "Une erreur est survenue, réessayez plus tard.", error: true });
      }
    } catch {
      setStatus({ text: "Impossible de joindre le serveur.", error: true });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="f-name">Nom</label>
      <input id="f-name" name="name" type="text" autoComplete="name" maxLength={80} />
      <label htmlFor="f-email">Email</label>
      <input id="f-email" name="email" type="email" autoComplete="email" maxLength={120} />
      <label htmlFor="f-msg">Message</label>
      <textarea id="f-msg" name="message" rows={4} maxLength={1000} />
      <button type="submit" disabled={sending}>
        {sending ? "Envoi..." : "Envoyer"}
      </button>
      <p className={status.error ? "form-status err" : "form-status"} role="status">
        {status.text}
      </p>
    </form>
  );
}