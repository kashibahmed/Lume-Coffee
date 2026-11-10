"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CafeMoment() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    const ctx = gsap.context(() => {
      // Left image reveal
      if (imageContainerRef.current) {
        gsap.from(imageContainerRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          x: -40,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      // Right text content reveal
      if (textContentRef.current) {
        gsap.from(textContentRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          x: 40,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    }, sectionRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="cafe-moment"
      ref={sectionRef}
      className="relative py-24 sm:py-32 md:py-40 overflow-hidden select-none"
      style={{ backgroundColor: "#F9C6C6" }}
    >
      {/* Decorative subtle vertical grid lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-between max-w-7xl mx-auto px-6 md:px-10 opacity-30">
        <div className="w-px h-full bg-[#9C8E5E]/20" />
        <div className="w-px h-full bg-[#9C8E5E]/20 hidden sm:block" />
        <div className="w-px h-full bg-[#9C8E5E]/20" />
        <div className="w-px h-full bg-[#9C8E5E]/20 hidden sm:block" />
        <div className="w-px h-full bg-[#9C8E5E]/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column: Cafe Interior Photo - Large & Prominent */}
          <div ref={imageContainerRef} className="lg:col-span-6 xl:col-span-6 w-full">
            <div className="relative w-full">
              {/* Offset decorative backing plate for tactile depth */}
              <div className="absolute -inset-2.5 sm:-inset-4 bg-[#EFD6C5] rounded-[2.8rem] sm:rounded-[3.5rem] -translate-x-2 translate-y-3 sm:-translate-x-3 sm:translate-y-4 shadow-xl border border-white/60" />

              {/* Main Photo Container */}
              <div className="relative aspect-[4/3] w-full rounded-[2.5rem] sm:rounded-[3.2rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white/90 bg-[#EFD6C5]">
                <Image
                  src="/images/lume-cafe-interior-brand.jpg"
                  alt="Lume Coffee Co. cafe interior with pink walls, espresso bar, and cozy seating"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 650px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Headline, Attractive Narrative Copy & CTA Button */}
          <div ref={textContentRef} className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFD6C5] border border-[#9C8E5E]/20 text-[#9C8E5E] text-xs font-bold tracking-[0.25em] uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE LUME SPACE</span>
            </div>

            {/* Bold Headline with clean 3-line balance */}
            <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl lg:text-[3.2rem] xl:text-[4rem] tracking-tight leading-[0.95] uppercase text-[#9C8E5E]">
              <span className="block">CRAFTED FOR YOUR</span>
              <span className="block">PERFECT COFFEE</span>
              <span className="block">MOMENT WITH US</span>
            </h2>

            {/* Elevated Attractive Copy - Harmonious Length */}
            <p className="font-body text-sm sm:text-base md:text-lg leading-relaxed text-[#9C8E5E] font-medium opacity-95 max-w-xl">
              At Lume, every cup is thoughtfully crafted to deliver more than just coffee. We combine slow-brewed richness with velvety smooth cream and heartfelt barista craft to create a balanced, refreshing escape in every sip.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href="#visit"
                className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#9C8E5E] text-[#FFF9F2] shadow-xl hover:bg-[#887D47] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/40"
              >
                <span className="font-headline text-lg sm:text-xl uppercase tracking-wider">
                  LEARN MORE ABOUT US
                </span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

