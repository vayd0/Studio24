import { Fragment } from "react";
import Image from "next/image";
import styles from "./Services.module.css";

const services = [
  "Architecture d’Intérieur",
  "Architecture & Construction",
  "Rénovation et Restructuration",
];

export default function Services() {
  return (
    <section id="services" className={styles.services} aria-label="Nos services">
      <ul className={styles.list} data-speed="1.06">
        {services.map((service, index) => (
          <Fragment key={service}>
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
            <li className={styles.item} data-reveal="lines">
              {service}
            </li>
          </Fragment>
        ))}
      </ul>
      <p className={styles.text} data-reveal="lines" data-speed="0.9">
        De la première esquisse à la livraison, nous concevons et réalisons des maisons
        individuelles, extensions et bâtiments professionnels en dessinant des volumes pérennes et
        parfaitement intégrés à leur environnement.
      </p>
    </section>
  );
}
