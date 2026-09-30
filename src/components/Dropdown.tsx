"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import styles from "./Dropdown.module.css";

type DropdownProps = {
  name: string;
  label: string;
  options: string[];
  defaultValue?: string;
  className?: string;
};

export default function Dropdown({ name, label, options, defaultValue, className }: DropdownProps) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => Math.max(0, options.indexOf(defaultValue ?? options[0])));
  const [active, setActive] = useState(selected);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openList = () => {
    setActive(selected);
    setOpen(true);
  };

  const choose = (index: number) => {
    setSelected(index);
    setActive(index);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(last, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`${styles.dropdown} ${className ?? ""}`} data-open={open}>
      <input type="hidden" name={name} value={options[selected]} />
      <button
        type="button"
        role="combobox"
        className={styles.trigger}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <Image src="/icons/chevron-down.svg" alt="" width={31.1324} height={17.2986} className={styles.chevron} />
        <span className={styles.value}>{options[selected]}</span>
      </button>

      <ul id={listboxId} role="listbox" aria-label={label} className={styles.listbox}>
        {options.map((option, index) => (
          <li
            key={option}
            id={optionId(index)}
            role="option"
            aria-selected={index === selected}
            data-active={index === active}
            className={styles.option}
            style={{ "--i": index } as CSSProperties}
            onPointerEnter={() => setActive(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span className={styles.optionText}>{option}</span>
            <svg className={styles.check} viewBox="0 0 16 12" aria-hidden="true">
              <path d="M1.5 6.5 5.5 10.5 14.5 1.5" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
