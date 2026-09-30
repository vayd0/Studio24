"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import styles from "./Intro.module.css";

gsap.registerPlugin(SplitText, useGSAP);

export default function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const counter = counterRef.current;
    if (!root || !logo || !counter) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    const html = document.documentElement;
    const media = document.querySelector<HTMLElement>('[data-intro="media"] img');
    const nav = document.querySelector<HTMLElement>('[data-intro="nav"]');
    const lines = Array.from(document.querySelectorAll<HTMLElement>('[data-intro="lines"]'));
    const splits = lines.map((element) => SplitText.create(element, { type: "lines", mask: "lines" }));
    const splitLines = splits.flatMap((split) => split.lines);

    html.dataset.introPlaying = "";
    window.scrollTo(0, 0);

    const unlock = () => {
      delete html.dataset.introPlaying;
    };

    const finish = () => {
      splits.forEach((split) => split.revert());
      if (media) gsap.set(media, { clearProps: "transform,scale" });
      if (nav) gsap.set(nav, { clearProps: "transform,opacity,visibility" });
      unlock();
      setDone(true);
    };

    const progress = { value: 0 };

    gsap.set(media, { scale: 1.2 });
    gsap.set(nav, { autoAlpha: 0, y: -20 });
    gsap.set(splitLines, { yPercent: 110 });

    gsap
      .timeline({ onComplete: finish })
      .fromTo(logo, { y: 0, yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "power4.out" })
      .to(
        progress,
        {
          value: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(progress.value)).padStart(3, "0");
          },
        },
        0,
      )
      .to(logo, { yPercent: -110, duration: 0.5, ease: "power3.in" }, 1.7)
      .to(counter, { autoAlpha: 0, duration: 0.3 }, 1.7)
      .to(
        root,
        {
          yPercent: -100,
          borderBottomLeftRadius: "50% 18%",
          borderBottomRightRadius: "50% 18%",
          duration: 1,
          ease: "power4.inOut",
        },
        2,
      )
      .to(media, { scale: 1, duration: 1.6, ease: "power3.out" }, 2.2)
      .to(nav, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.45)
      .to(splitLines, { yPercent: 0, duration: 1, stagger: 0.08, ease: "power4.out" }, 2.45);

    return unlock;
  });

  if (done) return null;

  return (
    <div ref={rootRef} className={styles.intro} data-intro-overlay aria-hidden="true">
      <span className={styles.logoMask}>
        <span ref={logoRef} className={styles.logo}>
          <Image src="/icons/logo-24.svg" alt="" width={158.7745} height={213.3} className={styles.logoImage} preload />
        </span>
      </span>
      <span ref={counterRef} className={styles.counter}>
        000
      </span>
    </div>
  );
}
