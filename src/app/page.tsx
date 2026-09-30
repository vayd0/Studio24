import Intro from "@/components/Intro";
import RevealAnimations from "@/components/RevealAnimations";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Projects from "@/components/home/Projects";
import Visit3D from "@/components/home/Visit3D";
import ContactFooter from "@/components/home/ContactFooter";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Intro />
      <Hero />
      <main>
        <Services />
        <Projects />
        <Visit3D />
      </main>
      <ContactFooter />
      <RevealAnimations />
    </div>
  );
}
