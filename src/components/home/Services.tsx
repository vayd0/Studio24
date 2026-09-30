"use client";

import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import styles from "./Services.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const services = [
  {
    title: "Architecture d’Intérieur",
    text: "Nous repensons vos intérieurs dans leurs moindres détails : circulation, lumière, matières et mobilier sur mesure, pour créer des espaces qui vous ressemblent et accompagnent chaque moment de votre quotidien.",
  },
  {
    title: "Architecture & Construction",
    text: "De la première esquisse à la livraison, nous concevons et réalisons des maisons individuelles, extensions et bâtiments professionnels en dessinant des volumes pérennes et parfaitement intégrés à leur environnement.",
  },
  {
    title: "Rénovation et Restructuration",
    text: "Nous redonnons vie aux bâtiments existants : réhabilitation, surélévation et redistribution des volumes, en améliorant leur performance énergétique tout en respectant l’histoire et le caractère de chaque lieu.",
  },
];

export default function Services() {
  const [active, setActive] = useState(1);
  const textRef = useRef<HTMLParagraphElement>(null);
  const firstRender = useRef(true);

  useGSAP(
    () => {
      const text = textRef.current;
      if (!text) return;
      const isFirst = firstRender.current;
      firstRender.current = false;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(text, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: isFirst ? 1.1 : 0.8,
          stagger: isFirst ? 0.08 : 0.05,
          ease: "power4.out",
          scrollTrigger: isFirst ? { trigger: text, start: "top 88%" } : undefined,
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { dependencies: [active], revertOnUpdate: true },
  );

  return (
    <section id="services" className={styles.services} aria-label="Nos services">
      <ul className={styles.list} data-speed="1.06">
        {services.map((service, index) => (
          <Fragment key={service.title}>
            {index > 0 && (
              <li aria-hidden="true" className={styles.separatorItem}>
                <Image
                  src="/icons/separator.svg"
                  alt=""
                  width={501.748}
                  height={2.09937}
                  className={styles.separator}
                  data-reveal="rule"
                />
              </li>
            )}
            <li>
              <button
                type="button"
                className={styles.item}
                aria-pressed={index === active}
                aria-controls="service-description"
                onClick={() => setActive(index)}
              >
                <span className={styles.itemLabel} data-reveal="lines">
                  {service.title}
                </span>
              </button>
            </li>
          </Fragment>
        ))}
      </ul>
      <div className={styles.text} data-speed="0.9">
        <p key={active} ref={textRef} id="service-description" aria-live="polite">
          {services[active].text}
        </p>
      </div>
    </section>
  );
}
