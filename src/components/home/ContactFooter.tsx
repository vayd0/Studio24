import Image from "next/image";
import ContactForm from "./ContactForm";
import styles from "./ContactFooter.module.css";

export default function ContactFooter() {
  return (
    <footer id="contact" className={styles.footer}>
      <h2 className={styles.title} data-reveal="lines">
        Un projet à nous proposer ?
      </h2>

      <ContactForm />

      <div className={styles.email} data-reveal="fade">
        <span className={styles.emailLabel}>EMAIL</span>
        <a href="mailto:contact@studio24.fr" className={styles.emailLink}>
          contact@studio24.fr
        </a>
      </div>

      <div className={styles.info}>
        <div className={styles.social} data-reveal="fade">
          <span>Nous suivre</span>
          <div className={styles.socialLinks}>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Image src="/icons/instagram.svg" alt="" width={58.8} height={58.8} className={styles.instagram} />
            </a>
            <a href="https://www.behance.net/" target="_blank" rel="noreferrer" aria-label="Behance" className={styles.behanceLink}>
              <Image src="/icons/behance.svg" alt="" width={43.681} height={44.01} className={styles.behance} />
            </a>
          </div>
        </div>
        <p className={styles.disclaimer} data-reveal="fade">
          Studio 24 est une agence fictive créée pour mon portfolio. Les visuels issus de Google
          restent la propriété de leurs auteurs.
        </p>
        <p className={styles.copyright} data-reveal="fade">
          © Studio24 2026
        </p>
      </div>
    </footer>
  );
}
