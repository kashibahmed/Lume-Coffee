"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Instagram, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_IMAGES } from "@/data/coffeeData";
import DecorativeSun from "./DecorativeSun";

export default function LifestyleGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      // Gallery grid items stagger
      if (galleryRef.current) {
        gsap.from(galleryRef.current.children, {
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          scale: 0.94,
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-36 bg-brand-cream overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-[0.25em] text-brand-olive uppercase block">
              Moments & Memories
            </span>
            <h2 className="font-headline text-5xl sm:text-6xl md:text-7xl text-brand-olive-dark tracking-tight leading-none">
              A LITTLE LOOK INTO LUME.
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white border border-brand-peach/80 text-brand-olive-dark hover:bg-brand-olive-dark hover:text-brand-cream transition-all duration-300 shadow-sm text-xs font-bold tracking-wider uppercase group self-start md:self-auto"
          >
            <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Follow Our Little World</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Instagram Asymmetric Grid: 6 Images */}
        <div
          ref={galleryRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {GALLERY_IMAGES.map((item, idx) => {
            // Apply varied heights for visual interest
            const heightClass =
              idx === 0 || idx === 3
                ? "aspect-[3/4]"
                : idx === 1 || idx === 5
                ? "aspect-[4/3]"
                : "aspect-square";

            return (
              <div
                key={item.id}
                className={`group relative rounded-[2rem] overflow-hidden bg-brand-peach shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-white ${heightClass}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover scale-100 group-hover:scale-108 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />

                {/* Hover overlay with editorial caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/80 via-brand-espresso/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-brand-cream">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blush">
                      @lumecoffeeco
                    </span>
                    <Instagram className="w-3.5 h-3.5 text-brand-blush" />
                  </div>
                  <h4 className="font-headline text-2xl text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-2 mt-0.5">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Micro Instagram Tagline */}
        <div className="mt-12 text-center flex items-center justify-center gap-3 text-xs text-brand-espresso/60">
          <DecorativeSun size={18} color="#887D47" variant="burst" />
          <span>Tag your moments with #LumeMornings to be featured in our café journal</span>
        </div>
      </div>
    </section>
  );
}

