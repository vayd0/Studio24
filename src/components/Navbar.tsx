"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";
import styles from "./Navbar.module.css";

const MENU_ID = "site-menu";

const subscribeNoop = () => () => {};

type NavState = "top" | "detached";

type Snapshot = {
  rect: DOMRect;
  background: string;
  borderColor: string;
  borderRadius: string;
  boxShadow: string;
  backdropFilter: string;
};

const REATTACH_DURATION = 600;
const REATTACH_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function snapshot(element: HTMLElement): Snapshot {
  const style = getComputedStyle(element);
  return {
    rect: element.getBoundingClientRect(),
    background: style.backgroundColor,
    borderColor: style.borderColor,
    borderRadius: style.borderRadius,
    boxShadow: style.boxShadow,
    backdropFilter: style.backdropFilter,
  };
}

export default function Navbar({ className }: { className?: string }) {
  const anchorRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<NavState>("top");
  const detachedSnapshot = useRef<Snapshot | null>(null);
  const animation = useRef<Animation | null>(null);
  const [state, setState] = useState<NavState>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const anchor = anchorRef.current;
    const bar = barRef.current;
    if (!anchor || !bar) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const next: NavState = anchor.getBoundingClientRect().bottom < 0 ? "detached" : "top";
      if (next === stateRef.current) return;

      animation.current?.cancel();
      animation.current = null;
      detachedSnapshot.current = next === "top" ? snapshot(bar) : null;
      stateRef.current = next;
      setState(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const bar = barRef.current;
    const first = detachedSnapshot.current;
    detachedSnapshot.current = null;
    if (state !== "top" || !anchor || !bar || !first) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const last = snapshot(bar);
    const style = getComputedStyle(bar);
    const marginLeft = parseFloat(style.marginLeft);
    const marginRight = parseFloat(style.marginRight);
    const barOffset = last.rect.top - anchor.getBoundingClientRect().top;

    const current = bar.animate(
      [
        {
          marginLeft: `${marginLeft + first.rect.left - last.rect.left}px`,
          marginRight: `${marginRight + last.rect.right - first.rect.right}px`,
          height: `${first.rect.height}px`,
          backgroundColor: first.background,
          borderColor: first.borderColor,
          borderRadius: first.borderRadius,
          boxShadow: first.boxShadow,
          backdropFilter: first.backdropFilter,
        },
        {
          marginLeft: `${marginLeft}px`,
          marginRight: `${marginRight}px`,
          height: `${last.rect.height}px`,
          backgroundColor: last.background,
          borderColor: last.borderColor,
          borderRadius: last.borderRadius,
          boxShadow: last.boxShadow,
          backdropFilter: last.backdropFilter,
        },
      ],
      { duration: REATTACH_DURATION, easing: REATTACH_EASING },
    );
    animation.current = current;

    let frame = 0;
    const follow = () => {
      const progress = current.effect?.getComputedTiming().progress ?? 1;
      const restingTop = anchor.getBoundingClientRect().top + barOffset;
      bar.style.transform = `translateY(${(first.rect.top - restingTop) * (1 - progress)}px)`;
      frame = requestAnimationFrame(follow);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      bar.style.transform = "";
    };
    follow();
    current.onfinish = () => {
      stop();
      animation.current = null;
    };
    current.oncancel = stop;
  }, [state]);

  return (
    <nav
      ref={anchorRef}
      className={`${styles.anchor} ${className ?? ""}`}
      aria-label="Navigation principale"
      data-intro="nav"
    >
      <div ref={barRef} className={styles.bar} data-state={state}>
        <Link href="/" className={styles.logo} aria-label="Studio 24, accueil">
          <Image src="/icons/logo-24.svg" alt="" width={158.7745} height={213.3} className={styles.logoImage} preload />
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menu}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          onClick={() => setMenuOpen(true)}
        >
          <Image src="/icons/menu.svg" alt="" width={29.3911} height={20.9937} className={styles.menuIcon} />
        </button>
      </div>
      {isClient && createPortal(<Menu id={MENU_ID} open={menuOpen} onClose={closeMenu} />, document.body)}
    </nav>
  );
}
