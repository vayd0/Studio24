import Image from "next/image";
import Navbar from "@/components/Navbar";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.media} data-intro="media">
        <div className={styles.parallax} data-parallax="12">
          <Image
            src="/images/hero-foret.png"
            alt="Maison contemporaine en bardage bois et métal noir, nichée dans une forêt à flanc de colline"
            fill
            preload
            sizes="(min-width: 768px) 1446px, 100vw"
            className={styles.image}
          />
        </div>
      </div>

      <Navbar className={styles.topbar} />

      <div className={styles.intro}>
        <h1 className={styles.title} data-intro="lines" data-speed="1.15">
          Chez Studio 24, nous concevons des espaces axés sur le rythme de vos journées.
        </h1>
        <p className={styles.lead} data-intro="lines" data-speed="1.08">
          Lignes épurées, matériaux bruts et maîtrise de la lumière : l&apos;architecture ne doit pas
          seulement s&apos;admirer, elle doit se vivre.
        </p>
      </div>
    </header>
  );
}
