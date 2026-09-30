import styles from "./Visit3D.module.css";

export default function Visit3D() {
  return (
    <section id="visite" className={styles.visit} aria-labelledby="visite-3d">
      <h2 id="visite-3d" className={styles.title} data-reveal="lines" data-speed="1.06">
        Visite 3D<span className={styles.titleEnd}> de notre projet phare.</span>
      </h2>
      <div className={styles.viewer} data-reveal="expand" />
    </section>
  );
}
