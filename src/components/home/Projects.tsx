"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./Projects.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

const HOLD_START = 0.1;
const HOLD_END = 0.25;
const PARALLAX = 8;

const settings = {
  desktop: { scrollRatio: 1.5, scrub: 0.8, snapDuration: { min: 0.3, max: 0.8 } },
  mobile: { scrollRatio: 1.2, scrub: 0.4, snapDuration: { min: 0.25, max: 0.5 } },
};

type Project = {
  title: string;
  year: string;
  image?: { src: string; alt: string };
};

const projects: Project[] = [
  {
    title: "Exemple",
    year: "2024",
    image: { src: "/images/projet-1.png", alt: "Tours résidentielles couvertes de végétation" },
  },
  {
    title: "Exemple",
    year: "2024",
    image: { src: "/images/projet-2.png", alt: "Maison organique blanche au toit végétalisé en forêt" },
  },
  { title: "Exemple", year: "2024" },
  { title: "Exemple", year: "2024" },
  { title: "Exemple", year: "2024" },
  { title: "Exemple", year: "2024" },
];

function pinHorizontalScroll(section: HTMLElement, track: HTMLElement, isMobile: boolean) {
  const { scrollRatio, scrub, snapDuration } = isMobile ? settings.mobile : settings.desktop;
  const total = HOLD_START + 1 + HOLD_END;

  const cards = () => Array.from(track.children) as HTMLElement[];
  const cardOffset = (card: HTMLElement) => card.offsetLeft + card.offsetWidth / 2 - section.clientWidth / 2;
  const distance = () => {
    const last = cards().at(-1);
    return last ? Math.max(0, cardOffset(last)) : 0;
  };
  const snapPoints = () => {
    const d = distance();
    if (!d) return [0, 1];
    const points = cards().map((card) => (HOLD_START + Math.min(1, Math.max(0, cardOffset(card) / d))) / total);
    return [0, ...points, 1];
  };

  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: "center center",
        end: () => `+=${distance() * scrollRatio * total}`,
        pin: true,
        scrub,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value, self) => {
            const points = snapPoints();
            if ((self?.direction ?? 1) > 0) return points.find((point) => point >= value - 0.001) ?? 1;
            return points.findLast((point) => point <= value + 0.001) ?? 0;
          },
          duration: snapDuration,
          delay: 0.1,
          inertia: false,
          ease: "power2.inOut",
        },
      },
    })
    .to({}, { duration: HOLD_START })
    .to(track, { x: () => -distance(), ease: "none", duration: 1 })
    .fromTo(
      track.querySelectorAll("[data-parallax-x]"),
      { xPercent: PARALLAX },
      { xPercent: -PARALLAX, ease: "none", duration: 1 },
      "<",
    )
    .to({}, { duration: HOLD_END });
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();
      mm.add(
        { motionOk: "(prefers-reduced-motion: no-preference)", isMobile: "(max-width: 767px)" },
        (context) => {
          const { motionOk, isMobile } = context.conditions as { motionOk: boolean; isMobile: boolean };
          if (!motionOk) return;

          section.dataset.pinned = "true";
          pinHorizontalScroll(section, track, isMobile);
          document.fonts?.ready.then(() => ScrollTrigger.refresh());

          return () => {
            delete section.dataset.pinned;
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="projets" className={styles.projects} aria-label="Nos projets">
      <ul ref={trackRef} className={styles.track}>
        {projects.map((project, index) => (
          <li key={index} className={styles.card}>
            <div className={styles.media} data-reveal="media">
              {project.image && (
                <div className={styles.parallaxY} data-parallax="7">
                  <div className={styles.parallaxX} data-parallax-x>
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      fill
                      sizes="(min-width: 768px) 570px, 360px"
                      className={styles.image}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={styles.caption} data-reveal="fade">
              <span>{project.title}</span>
              <span>{project.year}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
