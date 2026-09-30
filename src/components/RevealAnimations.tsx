"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const START = "top 88%";

function revealLines() {
  gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((element) => {
    SplitText.create(element, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (split) =>
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: START },
        }),
    });
  });
}

function revealRules() {
  gsap.utils.toArray<HTMLElement>('[data-reveal="rule"]').forEach((element) => {
    gsap.from(element, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: { trigger: element, start: START },
    });
  });
}

function revealMedia() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal="media"]');
  if (!items.length) return;
  gsap.set(items, { clipPath: "inset(100% 0% 0% 0%)" });
  ScrollTrigger.batch(items, {
    start: START,
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        stagger: 0.12,
        ease: "power4.inOut",
        onComplete: () => gsap.set(batch, { clearProps: "clipPath" }),
      });
      const images = batch.flatMap((item) => Array.from(item.querySelectorAll("img")));
      gsap.fromTo(images, { scale: 1.25 }, { scale: 1, duration: 1.6, stagger: 0.12, ease: "power3.out" });
    },
  });
}

function revealFades() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]');
  if (!items.length) return;
  const revealed = new Set<Element>();
  const show = (elements: Element[]) => {
    const pending = elements.filter((element) => !revealed.has(element));
    if (!pending.length) return;
    pending.forEach((element) => revealed.add(element));
    gsap.to(pending, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
    });
  };

  gsap.set(items, { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch(items, { start: START, once: true, onEnter: show });
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "bottom bottom+=2",
    once: true,
    onEnter: () => show(items.filter((item) => item.getBoundingClientRect().top < window.innerHeight)),
  });
}

function revealExpand() {
  gsap.utils.toArray<HTMLElement>('[data-reveal="expand"]').forEach((element) => {
    gsap.fromTo(
      element,
      { clipPath: "inset(12% 8% 12% 8% round 24px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        scrollTrigger: { trigger: element, start: "top 95%", end: "top 30%", scrub: 0.6 },
      },
    );
  });
}

function parallax() {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
    const amount = parseFloat(element.dataset.parallax || "8");
    gsap.fromTo(
      element,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}

function parallaxSpeed() {
  gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((element) => {
    const speed = parseFloat(element.dataset.speed ?? "1");
    if (!speed || speed === 1) return;
    gsap.to(element, {
      y: () => (1 - speed) * (window.innerHeight + element.offsetHeight),
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "clamp(top bottom)",
        end: "clamp(bottom top)",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}

export default function RevealAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      revealLines();
      revealRules();
      revealMedia();
      revealFades();
      revealExpand();
      parallax();
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", parallaxSpeed);
    return () => mm.revert();
  });

  return null;
}
