"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecorativeSun from "./DecorativeSun";

export default function BrandIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative py-28 sm:py-36 md:py-44 overflow-hidden select-none"
      style={{ backgroundColor: "#F9C6C6" }}
    >
      {/* Subtle architectural vertical grid lines (matching reference aesthetic) */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-6 h-full">
        <div className="border-r border-brand-espresso/[0.08] h-full" />
        <div className="border-r border-brand-espresso/[0.08] h-full" />
        <div className="border-r border-brand-espresso/[0.08] h-full" />
        <div className="border-r border-brand-espresso/[0.08] h-full" />
        <div className="border-r border-brand-espresso/[0.08] h-full" />
        <div className="h-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 md:px-16 text-center">
        <div ref={contentRef} className="space-y-6 sm:space-y-8">
          {/* Top category label */}
          <div className="inline-block">
            <span className="font-bold text-xs sm:text-sm tracking-[0.28em] uppercase" style={{ color: "#9C8E5E" }}>
              ABOUT LUME
            </span>
          </div>

          {/* High-impact editorial headline statement with inline visual capsules */}
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.2rem] leading-[1.28] sm:leading-[1.2] md:leading-[1.14] tracking-tight uppercase" style={{ color: "#9C8E5E" }}>
            AT LUME, OUR MISSION IS SIMPLE: TO BRIGHTEN YOUR DAY WITH ELEVATED COFFEE
            {/* Inline Realistic Coffee Bean from user upload in the coffee icon spot */}
            <span className="inline-block align-middle mx-2 sm:mx-3.5 my-1 hover:scale-110 transition-transform duration-300">
              <img
                src="/images/lume-coffee-bean.png"
                alt="Roasted Coffee Bean"
                className="h-10 sm:h-13 md:h-16 lg:h-18 w-auto inline-block object-contain drop-shadow-md -rotate-12 select-none"
              />
            </span>,
            {" "}SWEET AND SAVORY BITES
            {/* Inline Capsule: Lume Iced Coffee Glass */}
            <span className="inline-flex items-center justify-center align-middle mx-2 sm:mx-3.5 my-1">
              <span className="relative inline-flex items-center justify-center bg-white rounded-full w-14 sm:w-18 md:w-22 h-9 sm:h-11 md:h-13 shadow-md border border-brand-espresso/10 overflow-visible group">
                <img
                  src="/images/lume-hero-glass.png"
                  alt="Lume Iced Coffee"
                  className="absolute -top-3 sm:-top-4 md:-top-5 h-13 sm:h-16 md:h-20 w-auto object-contain drop-shadow-sm -rotate-6 transition-transform duration-300 group-hover:scale-110"
                />
              </span>
            </span>,
            {" "}AND A COZY SPACE WHERE EVERYONE FEELS WELCOME. IT’S A PLACE TO RELAX, CONNECT, AND CHASE YOUR DREAMS
            {/* Inline Capsule: Golden Sun Icon */}
            <span className="inline-flex items-center justify-center align-middle mx-2 sm:mx-3.5 my-1">
              <span className="inline-flex items-center justify-center bg-white rounded-full w-10 sm:w-12 md:w-14 h-9 sm:h-11 md:h-13 shadow-md border border-brand-espresso/10">
                <DecorativeSun size={24} color="#9C8E5E" variant="burst" className="animate-spin-slow" />
              </span>
            </span>.
          </h2>
        </div>
      </div>
    </section>
  );
}
