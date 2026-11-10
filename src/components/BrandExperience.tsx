"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CoffeeBeanSvg from "./CoffeeBeanSvg";

const brandPillars = [
  {
    step: "01",
    title: "QUALITY IN EVERY CUP",
    description:
      "We carefully select our coffee and bring together rich flavours, quality ingredients, and thoughtful preparation to make every cup worth savouring.",
  },
  {
    step: "02",
    title: "CRAFTED WITH PASSION",
    description:
      "From the first pour to the final finish, every detail matters. We blend creativity, precision, and passion to bring you coffee made with care.",
  },
  {
    step: "03",
    title: "MOMENTS WORTH SAVOURING",
    description:
      "Lume Coffee Co. is more than just coffee — it's about slowing down, connecting with people, and making everyday moments a little more special.",
  },
];

export default function BrandExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

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
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      // Gentle floating animation on side cards
      if (leftCardRef.current && rightCardRef.current) {
        gsap.to(leftCardRef.current, {
          y: -10,
          rotation: -2,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(rightCardRef.current, {
          y: -12,
          rotation: 4,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
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
      className="relative py-24 sm:py-32 md:py-40 overflow-hidden select-none"
      style={{ backgroundColor: "#F9C6C6" }}
    >
      <div ref={containerRef} className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-block">
            <span className="px-4 py-1.5 rounded-full bg-[#EFD6C5] border border-[#9C8E5E]/20 text-[#9C8E5E] text-xs font-bold tracking-[0.25em] uppercase shadow-sm">
              COME SAY HI
            </span>
          </div>

          <h2 className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] uppercase text-[#9C8E5E]">
            YOUR NEXT FAVORITE CUP IS WAITING
          </h2>
        </div>

        {/* Hero Visual Card with Floating Interactive Badges */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Photo Container */}
          <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full rounded-[2.5rem] sm:rounded-[3.2rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white/70 bg-[#EFD6C5]">
            <Image
              src="/images/lume-barista-latte.jpg"
              alt="Lume barista presenting a fresh handcrafted latte"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 950px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Top Center: Scalloped "OPEN DAILY" Rotating Badge */}
          <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-20">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              {/* Scallop Flower Background */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#9C8E5E] drop-shadow-lg"
              >
                <path
                  d="M 96.00 50.00 Q 86.14 61.74 87.21 77.04 Q 72.34 80.74 64.21 93.75 Q 50.00 88.00 35.79 93.75 Q 27.66 80.74 12.79 77.04 Q 13.86 61.74 4.00 50.00 Q 13.86 38.26 12.79 22.96 Q 27.66 19.26 35.79 6.25 Q 50.00 12.00 64.21 6.25 Q 72.34 19.26 87.21 22.96 Q 86.14 38.26 96.00 50.00 Z"
                  fill="currentColor"
                />
              </svg>

              {/* Rotating Circular Text */}
              <div className="absolute inset-0 flex items-center justify-center animate-spin-slow pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-bold tracking-[0.2em] uppercase fill-[#FFF9F2]">
                    <textPath href="#circlePath" startOffset="0%">
                      ★ OPEN DAILY ★ OPEN DAILY
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Center Coffee Bean Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CoffeeBeanSvg size={18} color="#FFF9F2" rotate={-15} />
              </div>
            </div>
          </div>

          {/* Left Floating Card: COLD / 18-hour steep */}
          <div
            ref={leftCardRef}
            className="absolute -left-3 sm:-left-7 md:-left-10 top-1/3 -translate-y-1/2 z-20"
          >
            {/* Top Pin Button */}
            <div className="flex justify-center -mb-2.5 relative z-10">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EFD6C5] border-2 border-white shadow-md flex items-center justify-center text-[#9C8E5E]">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Card Body */}
            <div className="bg-[#EFD6C5] rounded-[1.8rem] sm:rounded-[2.2rem] p-2.5 sm:p-3.5 shadow-2xl border-2 border-white/80 w-24 sm:w-32 md:w-36 text-center transition-all duration-300 hover:scale-105">
              <div className="relative aspect-square w-full rounded-2xl bg-white/70 overflow-hidden mb-2 p-1 flex items-center justify-center shadow-inner">
                <img
                  src="/images/coffee-cups/cold-brew-cloud.png"
                  alt="Cold Brew"
                  className="w-full h-full object-contain drop-shadow-md select-none"
                />
              </div>
              <h4 className="font-headline text-sm sm:text-base md:text-lg text-[#9C8E5E] uppercase tracking-wide leading-tight">
                COLD
              </h4>
              <p className="text-[9px] sm:text-[11px] text-[#9C8E5E]/85 font-medium tracking-tight">
                18-hour steep
              </p>
            </div>
          </div>

          {/* Right Floating Card: MATCHA / Lightly sweet */}
          <div
            ref={rightCardRef}
            className="absolute -right-3 sm:-right-7 md:-right-10 top-1/4 -translate-y-1/2 z-20"
          >
            {/* Top Pin Button */}
            <div className="flex justify-center -mb-2.5 relative z-10">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EFD6C5] border-2 border-white shadow-md flex items-center justify-center text-[#9C8E5E]">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Card Body */}
            <div className="bg-[#EFD6C5] rounded-[1.8rem] sm:rounded-[2.2rem] p-2.5 sm:p-3.5 shadow-2xl border-2 border-white/80 w-24 sm:w-32 md:w-36 text-center transition-all duration-300 hover:scale-105">
              <div className="relative aspect-square w-full rounded-2xl bg-white/70 overflow-hidden mb-2 p-1 flex items-center justify-center shadow-inner">
                <img
                  src="/images/coffee-cups/vanilla-ice-latte.png"
                  alt="Vanilla Ice Latte"
                  className="w-full h-full object-contain drop-shadow-md select-none"
                />
              </div>
              <h4 className="font-headline text-sm sm:text-base md:text-lg text-[#9C8E5E] uppercase tracking-wide leading-tight">
                MATCHA
              </h4>
              <p className="text-[9px] sm:text-[11px] text-[#9C8E5E]/85 font-medium tracking-tight">
                Lightly sweet
              </p>
            </div>
          </div>

          {/* Bottom Center: Scalloped Arrow Badge */}
          <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 z-20">
            <a
              href="#menu"
              className="group relative w-14 h-14 sm:w-18 sm:h-18 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              aria-label="Explore our menu"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#9C8E5E] drop-shadow-xl group-hover:text-[#887D47] transition-colors"
              >
                <path
                  d="M 96.00 50.00 Q 86.14 61.74 87.21 77.04 Q 72.34 80.74 64.21 93.75 Q 50.00 88.00 35.79 93.75 Q 27.66 80.74 12.79 77.04 Q 13.86 61.74 4.00 50.00 Q 13.86 38.26 12.79 22.96 Q 27.66 19.26 35.79 6.25 Q 50.00 12.00 64.21 6.25 Q 72.34 19.26 87.21 22.96 Q 86.14 38.26 96.00 50.00 Z"
                  fill="currentColor"
                />
              </svg>
              <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFF9F2] absolute transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Bottom Description Text */}
        <div className="max-w-2xl mx-auto text-center mt-14 sm:mt-18">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#9C8E5E] font-medium font-body">
            At Lume Coffee Co., great coffee is all about the little details. Carefully selected beans, perfectly balanced flavours, and thoughtfully crafted recipes come together in every cup — made to be savoured, never rushed.
          </p>
        </div>

        {/* 3 Pillars / Feature Cards (01, 02, 03) */}
        <div className="mt-20 sm:mt-24 pt-6 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
          {brandPillars.map((pillar) => (
            <div
              key={pillar.step}
              className="relative bg-[#EFD6C5] rounded-[2rem] sm:rounded-[2.4rem] pt-11 sm:pt-12 pb-8 sm:pb-9 px-7 sm:px-8 shadow-xl border-2 border-white/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-start"
            >
              {/* Scalloped Number Badge overlapping top-left */}
              <div className="absolute -top-6 sm:-top-7 left-6 sm:left-8 z-10">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-[#9C8E5E] drop-shadow-md"
                  >
                    <path
                      d="M 96.00 50.00 Q 86.14 61.74 87.21 77.04 Q 72.34 80.74 64.21 93.75 Q 50.00 88.00 35.79 93.75 Q 27.66 80.74 12.79 77.04 Q 13.86 61.74 4.00 50.00 Q 13.86 38.26 12.79 22.96 Q 27.66 19.26 35.79 6.25 Q 50.00 12.00 64.21 6.25 Q 72.34 19.26 87.21 22.96 Q 86.14 38.26 96.00 50.00 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-headline text-white text-xl sm:text-2xl font-bold tracking-wider pt-0.5">
                    {pillar.step}
                  </span>
                </div>
              </div>

              {/* Pillar Title */}
              <h3 className="font-headline text-2xl sm:text-3xl text-[#9C8E5E] uppercase tracking-tight leading-[1.05] mb-4">
                {pillar.title}
              </h3>

              {/* Pillar Description */}
              <p className="font-body text-sm sm:text-base text-[#9C8E5E] font-medium leading-relaxed opacity-90">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
