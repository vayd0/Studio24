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
  {
    title: "Exemple",
    year: "2024",
    image: { src: "/images/projet-3.jpg", alt: "Maison en bois sombre et pierre, grande terrasse vitrée au cœur d'une forêt" },
  },
  {
    title: "Exemple",
    year: "2024",
    image: { src: "/images/projet-4.jpg", alt: "Maison blanche contemporaine avec piscine à flanc de montagne, face à une vallée alpine" },
  },
  {
    title: "Exemple",
    year: "2024",
    image: { src: "/images/projet-5.jpg", alt: "Maison circulaire vitrée en pierre et bois sur une falaise en bord de mer au coucher du soleil" },
  },
  {
    title: "Exemple",
    year: "2024",
    image: { src: "/images/projet-6.jpg", alt: "Maison en bardage bois et béton avec toiture végétalisée dans une forêt de fougères" },
  },
];

function pinHorizontalScroll(section: HTMLElement, track: HTMLElement, isMobile: boolean) {
  const { scrollRatio, scrub, snapDuration } = isMobile ? settings.mobile : settings.desktop;
  const holdStart = isMobile ? 0 : HOLD_START;
  const total = holdStart + 1 + HOLD_END;

  const cards = () => Array.from(track.children) as HTMLElement[];
  const cardOffset = (card: HTMLElement) => card.offsetLeft + card.offsetWidth / 2 - section.clientWidth / 2;
  const distance = () => {
    const last = cards().at(-1);
    return last ? Math.max(0, cardOffset(last)) : 0;
  };
  const leadIn = () => (isMobile ? Math.max(0, (window.innerHeight - section.offsetHeight) / 2) : 0);
  const scrollLength = () => distance() * scrollRatio * total;

  const pin = ScrollTrigger.create({
    trigger: section,
    start: "center center",
    end: () => `+=${Math.max(scrollLength() - leadIn(), scrollLength() / 2)}`,
    pin: true,
    invalidateOnRefresh: true,
  });

  const snapPoints = (pinStart: number) => {
    const d = distance();
    if (!d) return [pinStart, 1];
    const points = cards().map((card) => (holdStart + Math.min(1, Math.max(0, cardOffset(card) / d))) / total);
    return [pinStart, ...points.filter((point) => point > pinStart), 1];
  };

  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: isMobile ? "bottom bottom" : "center center",
        end: () => pin.end,
        scrub,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value, self) => {
            const pinStart = self ? (pin.start - self.start) / (self.end - self.start) : 0;
            if (value < pinStart - 0.001) return value;
            const points = snapPoints(pinStart);
            if ((self?.direction ?? 1) > 0) return points.find((point) => point >= value - 0.001) ?? 1;
            return points.findLast((point) => point <= value + 0.001) ?? pinStart;
          },
          duration: snapDuration,
          delay: 0.1,
          inertia: false,
          ease: "power2.inOut",
        },
      },
    })
    .to({}, { duration: holdStart })
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
                <div className={styles.parallaxX} data-parallax-x>
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 768px) 570px, 360px"
                    className={styles.image}
                  />
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
