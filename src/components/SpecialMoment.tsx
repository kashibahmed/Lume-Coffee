"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SpecialMoment() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCupRef = useRef<HTMLDivElement>(null);
  const rightCupRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

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
      // Scroll reveal entrance
      if (bannerRef.current) {
        gsap.from(bannerRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          scale: 0.94,
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "all",
        });
      }

      // Entrance for left & right cups
      if (leftCupRef.current) {
        gsap.from(leftCupRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          x: -60,
          opacity: 0,
          duration: 1.1,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      if (rightCupRef.current) {
        gsap.from(rightCupRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          x: 60,
          opacity: 0,
          duration: 1.1,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      // Gentle floating animation for left cup
      if (leftCupRef.current) {
        gsap.to(leftCupRef.current, {
          y: -12,
          rotation: -5,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Gentle floating animation for right cup
      if (rightCupRef.current) {
        gsap.to(rightCupRef.current, {
          y: -14,
          rotation: 5,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
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
      id="special-moment"
      ref={sectionRef}
      className="relative py-20 sm:py-24 md:py-28 overflow-hidden select-none"
      style={{ backgroundColor: "#F9C6C6" }}
    >
      {/* Decorative vertical grid lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-between max-w-7xl mx-auto px-6 md:px-10 opacity-30">
        <div className="w-px h-full bg-[#9C8E5E]/20" />
        <div className="w-px h-full bg-[#9C8E5E]/20 hidden sm:block" />
        <div className="w-px h-full bg-[#9C8E5E]/20" />
        <div className="w-px h-full bg-[#9C8E5E]/20 hidden sm:block" />
        <div className="w-px h-full bg-[#9C8E5E]/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        {/* Main Composition: Left Cup + Center Layered Banners + Right Cup */}
        <div className="relative max-w-5xl mx-auto flex items-center justify-center pt-4 sm:pt-8 pb-1">
          {/* Left Tilted Coffee Glass (Hazelnut Latte with whipped cream & nuts) */}
          <div
            ref={leftCupRef}
            className="absolute left-0 sm:left-3 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-24 sm:w-32 md:w-40 lg:w-48 aspect-[1/2] pointer-events-none"
            style={{ transform: "rotate(-9deg)" }}
          >
            <div className="relative w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.22)]">
              <Image
                src="/images/special-cup-hazelnut.png"
                alt="Lume Iced Hazelnut Latte with whipped cream"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 130px, 220px"
                priority
              />
            </div>
          </div>

          {/* Center Layered Ribbons Banner */}
          <div
            ref={bannerRef}
            className="relative z-10 text-center w-full max-w-3xl sm:max-w-4xl px-12 sm:px-20 md:px-28 lg:px-32"
          >
            {/* Top Ribbon: MAKE YOUR COFFEE */}
            <div className="inline-block transform -rotate-[3deg] hover:rotate-0 transition-transform duration-300">
              <div className="px-6 sm:px-10 md:px-14 py-2 sm:py-3.5 md:py-4.5 rounded-2xl sm:rounded-3xl bg-[#887D47] text-[#FFF9F2] shadow-2xl border-2 sm:border-4 border-white/70">
                <h2 className="font-headline text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight uppercase leading-none whitespace-nowrap">
                  MAKE YOUR COFFEE
                </h2>
              </div>
            </div>

            {/* Bottom Ribbon: MOMENT SPECIAL */}
            <div className="block -mt-1 sm:-mt-2 md:-mt-3 transform -rotate-[1.5deg] sm:translate-x-3 md:translate-x-6 hover:rotate-0 transition-transform duration-300">
              <div className="inline-block px-7 sm:px-12 md:px-16 py-2 sm:py-3.5 md:py-4.5 rounded-2xl sm:rounded-3xl bg-[#9C8E5E] text-[#FFF9F2] shadow-2xl border-2 sm:border-4 border-white/70">
                <h2 className="font-headline text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight uppercase leading-none whitespace-nowrap">
                  MOMENT SPECIAL
                </h2>
              </div>
            </div>
          </div>

          {/* Right Tilted Coffee Glass (Cold Brew Cloud with Ice Cubes) */}
          <div
            ref={rightCupRef}
            className="absolute right-0 sm:right-3 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-24 sm:w-32 md:w-40 lg:w-48 aspect-[1/2] pointer-events-none"
            style={{ transform: "rotate(9deg)" }}
          >
            <div className="relative w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.22)]">
              <Image
                src="/images/special-cup-cloud.png"
                alt="Lume Cold Brew Cloud with ice cubes"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 130px, 220px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Narrative Copy & CTA Button - Compact, Balanced Spacing */}
        <div className="max-w-xl mx-auto text-center mt-6 sm:mt-8 space-y-4 sm:space-y-5">
          <p className="font-body text-sm sm:text-base md:text-lg leading-relaxed text-[#9C8E5E] font-medium opacity-95">
            Every day deserves a better cup of coffee — one that feels refreshing, indulgent, and made with intention.
          </p>

          {/* CTA Button */}
          <div className="pt-1">
            <a
              href="#visit"
              className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-[#9C8E5E] text-[#FFF9F2] shadow-xl hover:bg-[#887D47] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/50"
            >
              <span className="font-headline text-lg sm:text-xl uppercase tracking-wider">
                VISIT US NOW
              </span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

