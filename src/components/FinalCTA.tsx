"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, Clock, ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecorativeSun from "./DecorativeSun";
import CoffeeBeanSvg from "./CoffeeBeanSvg";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);

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
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          scale: 0.96,
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "all",
        });
      }

      if (sunRef.current) {
        gsap.to(sunRef.current, {
          rotation: 360,
          repeat: -1,
          duration: 40,
          ease: "linear",
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
      id="visit"
      ref={sectionRef}
      className="relative py-24 sm:py-32 md:py-36 overflow-hidden select-none"
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

      {/* Background Decorative Sun */}
      <div
        ref={sunRef}
        className="absolute -bottom-24 -right-24 pointer-events-none opacity-25 z-0"
      >
        <DecorativeSun size={360} color="#9C8E5E" variant="hand-drawn" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div
          ref={cardRef}
          className="relative rounded-[2.8rem] sm:rounded-[3.5rem] bg-[#EFD6C5] p-8 sm:p-12 md:p-16 border-4 sm:border-8 border-white/80 shadow-2xl overflow-hidden"
        >
          {/* Subtle ambient glow inside card */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#F9C6C6]/30 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#9C8E5E]/25 text-[#9C8E5E] text-xs font-bold tracking-[0.25em] uppercase shadow-sm">
                <CoffeeBeanSvg size={15} color="#9C8E5E" />
                <span>Doors Open Early Everyday</span>
              </div>

              {/* Bold Headline */}
              <h2 className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] text-[#9C8E5E] tracking-tight leading-[0.92] uppercase">
                YOUR NEXT FAVOURITE COFFEE IS WAITING.
              </h2>

              {/* Subtitle */}
              <p className="font-body text-base sm:text-lg md:text-xl text-[#9C8E5E] font-medium max-w-lg leading-relaxed opacity-95">
                Come by, grab your favourite cup and make today a little brighter.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=2874+King+St+SE+Suite+D%2C+Smyrna%2C+GA+30080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-9 py-4 rounded-full bg-[#9C8E5E] text-[#FFF9F2] text-sm font-semibold tracking-wide uppercase hover:bg-[#887D47] transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2.5 group border-2 border-white/40 hover:scale-105 active:scale-95"
                >
                  <span className="font-headline text-lg sm:text-xl uppercase tracking-wider">VISIT CAFE</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>

                <a
                  href="#menu"
                  className="px-8 py-4 rounded-full bg-white/80 text-[#9C8E5E] border-2 border-[#9C8E5E] text-sm font-semibold tracking-wide uppercase hover:bg-[#9C8E5E] hover:text-[#FFF9F2] transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 font-headline text-lg sm:text-xl"
                >
                  See Drink Menu
                </a>
              </div>

              {/* Quick Hours & Address Badges */}
              <div
                id="visit-info"
                className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#9C8E5E]/20 text-xs text-[#9C8E5E]"
              >
                <a
                  href="https://www.google.com/maps/search/?api=1&query=2874+King+St+SE+Suite+D%2C+Smyrna%2C+GA+30080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 bg-white/80 p-4 rounded-2xl border border-white/90 shadow-sm hover:bg-white hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#9C8E5E] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold block text-[#9C8E5E] text-sm">
                        Lume Café
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#9C8E5E]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <span className="text-[#9C8E5E]/85 font-medium block">
                      2874 King St. SE, Suite D, Smyrna, GA 30080
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3 bg-white/80 p-4 rounded-2xl border border-white/90 shadow-sm">
                  <Clock className="w-4 h-4 text-[#9C8E5E] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#9C8E5E] text-sm mb-0.5">
                      Opening Hours
                    </span>
                    <span className="text-[#9C8E5E]/85 font-medium">
                      Mon–Fri: 7am – 6pm · Sat–Sun: 8am – 7pm
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-[2.2rem] sm:rounded-[2.8rem] overflow-hidden shadow-2xl border-4 sm:border-6 border-white/90 bg-[#EFD6C5]">
                <Image
                  src="/images/final-cta-glass.jpg"
                  alt="Iced specialty hazelnut latte with whipped cream in Lume can glass"
                  fill
                  className="object-cover scale-100 hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-white shadow-md z-10">
                  <DecorativeSun size={28} color="#9C8E5E" variant="burst" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
