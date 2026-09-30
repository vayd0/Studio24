"use client";

import { useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import styles from "./Menu.module.css";

const links = [
  { href: "#top", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#projets", label: "Projets" },
  { href: "#visite", label: "Visite 3D" },
  { href: "#contact", label: "Contact" },
];

const socials = [
  { href: "https://www.instagram.com/", label: "Instagram" },
  { href: "https://www.behance.net/", label: "Behance" },
];

type MenuProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

export default function Menu({ id, open, onClose }: MenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    root.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    onClose();
    const target = href === "#top" ? null : document.querySelector(href);
    setTimeout(() => {
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  return (
    <div className={styles.root} data-open={open} inert={!open}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer}>
        <div className={styles.sheet} aria-hidden="true" />

        <div
          ref={panelRef}
          id={id}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onKeyDown={trapFocus}
        >
          <div className={styles.header}>
            <span className={styles.label}>Menu</span>
            <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Fermer le menu">
              <span className={styles.closeLine} />
              <span className={styles.closeLine} />
            </button>
          </div>

          <nav className={styles.nav} aria-label="Menu principal">
            <ul className={styles.list}>
              {links.map((link, index) => (
                <li key={link.href} className={styles.item} style={{ "--i": index } as CSSProperties}>
                  <a href={link.href} className={styles.link} onClick={(event) => navigate(event, link.href)}>
                    <span className={styles.linkInner}>
                      <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={styles.text}>{link.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.footer}>
            <div className={styles.footerBlock}>
              <span className={styles.footerLabel}>Email</span>
              <a href="mailto:contact@studio24.fr" className={styles.footerLink}>
                contact@studio24.fr
              </a>
            </div>
            <div className={styles.footerBlock}>
              <span className={styles.footerLabel}>Nous suivre</span>
              <div className={styles.socials}>
                {socials.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className={styles.footerLink}>
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
