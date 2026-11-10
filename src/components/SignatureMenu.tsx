"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SIGNATURE_PRODUCTS, Product } from "@/data/coffeeData";
import { useCart } from "@/context/CartContext";

const CATEGORIES = ["POPULAR BLENDS", "COLD BREW", "FRAPPUCCINO"] as const;

export default function SignatureMenu() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("POPULAR BLENDS");
  const { addToCart } = useCart();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Small delay to ensure 700vh hero layout has fully mounted before measuring trigger positions
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    const ctx = gsap.context(() => {
      // Header entrance animation (once: true so it never hides or reverses)
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true,
          },
          y: 35,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      // Cards staggered entrance animation (once: true, clears all inline styles on complete)
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
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

  const filteredProducts = SIGNATURE_PRODUCTS.filter((product) => {
    if (activeCategory === "POPULAR BLENDS") return true; // Shows full collection
    return product.category.toUpperCase() === activeCategory;
  });

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative py-24 sm:py-32 md:py-36 overflow-hidden select-none"
      style={{ backgroundColor: "#F9C6C6" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-12">
        {/* Header Block */}
        <div ref={headerRef} className="space-y-8 mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] uppercase text-[#9C8E5E]">
                EXPLORE OUR
                <span className="block">SIGNATURE BREWS</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#9C8E5E] max-w-xs md:text-right font-body leading-relaxed opacity-90">
              A selection of favorites crafted to delight every coffee lover.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                    isActive
                      ? "bg-[#9C8E5E] text-white shadow-md border border-[#9C8E5E]"
                      : "bg-[#EFD6C5] hover:bg-white/80 text-[#9C8E5E] border border-[#9C8E5E]/20"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Responsive Product Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          {filteredProducts.map((product: Product) => {
            return (
              <div
                key={product.id}
                className="group relative rounded-[2.2rem] p-6 sm:p-7 flex flex-col justify-between cursor-pointer border border-[#9C8E5E]/20 bg-[#EFD6C5] hover:bg-[#9C8E5E] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl opacity-100 visible"
              >
                {/* Top Rating with Star Icon */}
                <div className="flex justify-end items-center gap-1.5 mb-2">
                  <span className="text-xs font-bold tracking-wider text-[#9C8E5E] group-hover:text-white/95 transition-colors duration-500">
                    4.8
                  </span>
                  <span className="text-[#9C8E5E] group-hover:text-[#FFE082] text-xs transition-colors duration-500">
                    ★
                  </span>
                </div>

                {/* Transparent Coffee Cup Image Container */}
                <div className="relative w-full h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px] xl:h-[340px] flex items-center justify-center my-2 overflow-visible">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-auto max-w-[94%] object-contain select-none transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_18px_24px_rgba(43,37,32,0.22)]"
                  />
                </div>

                {/* Product Name */}
                <div className="my-3 text-center">
                  <h3 className="font-headline text-2xl sm:text-[1.75rem] uppercase tracking-wide leading-tight text-[#9C8E5E] group-hover:text-white transition-colors duration-500">
                    {product.name}
                  </h3>
                </div>

                {/* Bottom Row: Price & Add To Cart CTA Button */}
                <div className="pt-3 flex items-center justify-between border-t border-[#9C8E5E]/20 group-hover:border-white/20 transition-colors duration-500">
                  <span className="font-bold text-lg sm:text-xl text-[#9C8E5E] group-hover:text-white transition-colors duration-500">
                    ${product.price.toFixed(2)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 text-[#9C8E5E] group-hover:text-white transition-colors duration-500 group/btn"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <span>ADD TO CART</span>
                    <span className="text-base transition-transform duration-300 group-hover/btn:translate-x-1.5">
                      →
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
