"use client";

import type { FormEvent } from "react";
import Dropdown from "@/components/Dropdown";
import styles from "./ContactFooter.module.css";

const CONTACT_EMAIL = "contact@studio24.fr";

const projectTypes = [
  "Architecture d’intérieur",
  "Architecture & Construction",
  "Rénovation et Restructuration",
];

export default function ContactForm() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const type = String(data.get("type"));
    const email = String(data.get("email"));
    const message = String(data.get("message"));
    const subject = `Nouveau projet — ${type}`;
    const body = `Type de projet : ${type}\nEmail : ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className={styles.form} aria-label="Proposer un projet" onSubmit={onSubmit}>
      <div className={styles.row} data-reveal="fade">
        <Dropdown name="type" label="Type de projet" options={projectTypes} className={styles.select} />
        <label className={styles.field}>
          <span className="visually-hidden">Votre email</span>
          <input type="email" name="email" placeholder="exemple@gmail.com" autoComplete="email" required />
        </label>
      </div>
      <label className={`${styles.field} ${styles.message}`} data-reveal="fade">
        <span className="visually-hidden">Détails du projet</span>
        <textarea name="message" placeholder=" " required />
        <span aria-hidden="true" className={styles.messagePlaceholder}>
          Détails du projet...
        </span>
      </label>
      <button type="submit" className={styles.submit} data-reveal="fade">
        Envoyer
      </button>
    </form>
  );
}
