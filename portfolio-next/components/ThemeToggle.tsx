"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  // Applique le thème mémorisé au chargement de la page
  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-theme");
      if (saved) document.documentElement.dataset.theme = saved;
    } catch {
      /* stockage indisponible */
    }
  }, []);

  function toggle() {
    const root = document.documentElement;
    const current =
      root.dataset.theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* stockage indisponible */
    }
  }

  return (
    <button type="button" className="theme-btn" onClick={toggle}>
      Clair / sombre
    </button>
  );
}
