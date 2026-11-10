"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const stickersRef = useRef<HTMLDivElement>(null);

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
      // Card scroll reveal
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          y: 40,
          scale: 0.97,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      // Gentle floating animation for the center badge
      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          y: -5,
          rotation: -1,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Gentle stagger floating on corner sticker pills
      if (stickersRef.current) {
        const stickers = stickersRef.current.querySelectorAll(".sticker-pill");
        stickers.forEach((sticker, i) => {
          gsap.to(sticker, {
            y: i % 2 === 0 ? -6 : 6,
            duration: 3 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
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
      id="philosophy"
      ref={sectionRef}
      className="relative py-20 sm:py-28 md:py-36 overflow-hidden select-none"
      style={{ backgroundColor: "#F9C6C6" }}
    >
      {/* Decorative vertical grid guide lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-between max-w-7xl mx-auto px-6 md:px-10 opacity-30">
        <div className="w-px h-full bg-[#9C8E5E]/20" />
        <div className="w-px h-full bg-[#9C8E5E]/20 hidden sm:block" />
        <div className="w-px h-full bg-[#9C8E5E]/20" />
        <div className="w-px h-full bg-[#9C8E5E]/20 hidden sm:block" />
        <div className="w-px h-full bg-[#9C8E5E]/20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 md:px-10">
        {/* Main Statement Card - Brand Peach Sand (#EFD6C5) */}
        <div
          ref={cardRef}
          className="relative rounded-[2.5rem] sm:rounded-[3.2rem] md:rounded-[4rem] bg-[#EFD6C5] px-6 sm:px-12 md:px-20 py-16 sm:py-20 md:py-24 shadow-2xl border-4 sm:border-8 border-white/80 text-center overflow-hidden"
        >
          {/* Subtle warm ambient highlights inside card */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#F9C6C6]/40 blur-3xl pointer-events-none" />

          {/* Corner Floating Sticker: Premium Beans (Left margin, clear of text) */}
          <div className="sticker-pill hidden lg:block absolute left-6 sm:left-10 top-1/3 -translate-y-1/2 -rotate-12 z-20 pointer-events-none">
            <span className="px-4 py-1.5 rounded-full bg-[#F9C6C6] text-[#9C8E5E] text-xs font-bold tracking-wider uppercase shadow-md border border-[#9C8E5E]/25 inline-block">
              Premium Beans
            </span>
          </div>

          {/* Corner Floating Sticker: Creamy Texture (Right margin, clear of text) */}
          <div className="sticker-pill hidden lg:block absolute right-6 sm:right-10 top-1/3 -translate-y-1/2 rotate-12 z-20 pointer-events-none">
            <span className="px-4 py-1.5 rounded-full bg-[#F9C6C6] text-[#9C8E5E] text-xs font-bold tracking-wider uppercase shadow-md border border-[#9C8E5E]/25 inline-block">
              Creamy Texture
            </span>
          </div>

          {/* Inner Content Container */}
          <div ref={stickersRef} className="relative z-10 max-w-4xl mx-auto">
            {/* Top Dedicated Pill: Bold Flavor (Centered safely above headline) */}
            <div className="flex justify-center mb-5 sm:mb-7">
              <div className="sticker-pill -rotate-3 hover:rotate-0 transition-transform">
                <span className="px-5 py-1.5 rounded-full bg-[#9C8E5E] text-[#FFF9F2] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md border border-white/40 inline-block">
                  Bold Flavor
                </span>
              </div>
            </div>

            {/* Mobile chip row for small screens where side pills are hidden */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-[#F9C6C6] text-[#9C8E5E] text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-sm border border-[#9C8E5E]/20">
                Premium Beans
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#F9C6C6] text-[#9C8E5E] text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-sm border border-[#9C8E5E]/20">
                Creamy Texture
              </span>
            </div>

            {/* Line 1: YOUR DAY DESERVES A */}
            <div className="my-1 sm:my-2">
              <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.94] uppercase text-[#9C8E5E]">
                YOUR DAY DESERVES A
              </h2>
            </div>

            {/* Line 2 & 3: LITTLE MORE [COFFEE LOVE] */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-2 sm:my-4">
              <span className="font-headline text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.94] uppercase text-[#9C8E5E]">
                LITTLE MORE
              </span>

              {/* Center Tilted Badge [COFFEE LOVE] */}
              <div
                ref={badgeRef}
                className="inline-block transform -rotate-3 sm:-rotate-4 hover:rotate-0 transition-transform duration-300"
              >
                <div className="px-5 sm:px-7 md:px-9 py-1.5 sm:py-2.5 rounded-2xl sm:rounded-3xl bg-[#9C8E5E] border-2 sm:border-3 border-white/70 shadow-xl">
                  <span className="font-headline text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase text-[#FFF9F2] leading-none block">
                    COFFEE LOVE
                  </span>
                </div>
              </div>
            </div>

            {/* Line 4: WITH EVERY SIP OF RICH, */}
            <div className="my-1 sm:my-2">
              <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.94] uppercase text-[#9C8E5E]">
                WITH EVERY SIP OF RICH,
              </h2>
            </div>

            {/* Line 5: SMOOTH & CREAMY BLISS */}
            <div className="my-1 sm:my-2">
              <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.94] uppercase text-[#9C8E5E]">
                SMOOTH & CREAMY BLISS
              </h2>
            </div>

            {/* Bottom Dedicated Pill: Freshly Roasted (Safely spaced below headline) */}
            <div className="flex justify-center mt-6 sm:mt-8 mb-4">
              <div className="sticker-pill rotate-[-4deg] hover:rotate-0 transition-transform">
                <span className="px-5 py-1.5 rounded-full bg-[#9C8E5E] text-[#FFF9F2] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md border border-white/40 inline-block">
                  Freshly Roasted
                </span>
              </div>
            </div>

            {/* Subtitle / Narrative Copy */}
            <div className="max-w-xl mx-auto text-center mt-8 sm:mt-10 pt-2">
              <p className="font-body text-sm sm:text-base md:text-lg text-[#9C8E5E] font-medium leading-relaxed opacity-95">
                Designed to refresh your mood, elevate your taste, and turn every coffee break into something worth remembering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
