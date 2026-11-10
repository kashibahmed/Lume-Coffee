"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  image: string;
  rating: number;
  featuredQuote: string;
  bodyQuote: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: "olivia",
    name: "Olivia Carter",
    role: "Regular customer",
    avatar: "/images/reviews/avatar-woman-white.png",
    image: "/images/reviews/reviewer-4.png",
    rating: 5,
    featuredQuote:
      "THE COFFEE IS RICH, SMOOTH, AND FULL OF FLAVOR, WITH AN AROMA THAT MAKES EVERY MORNING FEEL SPECIAL. IT HAS QUICKLY BECOME MY FAVORITE PART OF THE DAY, AND I HONESTLY LOOK FORWARD TO EVERY CUP.",
    bodyQuote:
      "The coffee is rich, smooth, and full of flavor, with an aroma that makes every morning feel special. It has quickly become my favorite part of the day, and I look forward to every cup.",
  },
  {
    id: "ethan",
    name: "Ethan Carter",
    role: "Regular customer",
    avatar: "/images/reviews/avatar-man-corduroy.png",
    image: "/images/reviews/reviewer-1.png",
    rating: 5,
    featuredQuote:
      "EVERY SIP FEELS FRESH, BALANCED, AND BEAUTIFULLY CRAFTED, WITHOUT BEING TOO STRONG OR BITTER. IT'S THE PERFECT COFFEE TO ENJOY WHILE WORKING, RELAXING, OR SIMPLY SLOWING DOWN.",
    bodyQuote:
      "Every sip feels fresh, balanced, and beautifully crafted, without being too strong or bitter. It's the perfect coffee to enjoy while working, relaxing, or simply slowing down.",
  },
  {
    id: "sophia",
    name: "Sophia Martin",
    role: "Regular customer",
    avatar: "/images/reviews/avatar-woman-green.png",
    image: "/images/reviews/reviewer-2.png",
    rating: 5,
    featuredQuote:
      "I ABSOLUTELY LOVE THE SMOOTH TASTE AND RICH AROMA OF THIS COFFEE—IT FEELS PREMIUM IN EVERY WAY. ONE CUP IS ENOUGH TO TURN AN ORDINARY MORNING INTO A MUCH BETTER ONE.",
    bodyQuote:
      "I absolutely love the smooth taste and rich aroma of this coffee—it feels premium in every way. One cup is enough to turn an ordinary morning into a much better one.",
  },
  {
    id: "daniel",
    name: "Daniel Brooks",
    role: "Creative Director",
    avatar: "/images/reviews/avatar-man-laptop.png",
    image: "/images/reviews/reviewer-3.png",
    rating: 5,
    featuredQuote:
      "FROM THE FIRST SIP, I LOVED HOW SMOOTH AND RICH THE COFFEE TASTED, WITH JUST THE RIGHT DEPTH OF FLAVOR. IT'S BECOME MY FAVORITE CHOICE FOR A RELAXING BREAK OR A PRODUCTIVE MORNING.",
    bodyQuote:
      "From the first sip, I loved how smooth and rich the coffee tasted, with just the right depth of flavor. It's become my favorite choice for a relaxing break or a productive morning.",
  },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const activeReview = REVIEWS[activeIndex];
  const otherReviews = REVIEWS.map((review, index) => ({
    review,
    index,
  })).filter(({ index }) => index !== activeIndex);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

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
      gsap.from(".reviews-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        clearProps: "all",
      });

      gsap.from(".reviews-featured", {
        scrollTrigger: {
          trigger: ".reviews-featured",
          start: "top 85%",
          once: true,
        },
        y: 45,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        clearProps: "all",
      });

      gsap.from(".reviews-bottom-card", {
        scrollTrigger: {
          trigger: ".reviews-bottom-grid",
          start: "top 85%",
          once: true,
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power2.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  // Animate quote and image switch
  useEffect(() => {
    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0.35, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  return (
    <section
      id="reviews"
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

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
        {/* Section Header */}
        <div className="reviews-header text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-block">
            <span className="px-4 py-1.5 rounded-full bg-[#EFD6C5] border border-[#9C8E5E]/20 text-[#9C8E5E] text-xs font-bold tracking-[0.25em] uppercase shadow-sm">
              CUSTOMER REVIEWS
            </span>
          </div>

          <h2 className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] uppercase text-[#9C8E5E]">
            A FEW WORDS FROM
            <br />
            OUR PEOPLE.
          </h2>
        </div>

        {/* Featured Testimonial Box (Hero Review) */}
        <div className="reviews-featured relative bg-[#EFD6C5] rounded-[2.5rem] sm:rounded-[3.2rem] md:rounded-[3.8rem] p-6 sm:p-10 md:p-14 shadow-2xl border-4 sm:border-8 border-white/80 overflow-hidden">
          {/* Giant Decorative Quotation Mark in top-right */}
          <div className="absolute top-6 sm:top-10 right-6 sm:right-12 pointer-events-none opacity-25">
            <Quote className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 text-[#9C8E5E] rotate-180" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
            {/* Left: Customer Photo with Offset Accent Plate */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Offset decorative backing plate */}
                <div className="absolute -inset-2.5 sm:-inset-3.5 bg-[#9C8E5E] rounded-[2.2rem] sm:rounded-[2.8rem] -translate-x-2 translate-y-3 sm:-translate-x-3 sm:translate-y-4 opacity-80" />

                {/* Main Photo Container */}
                <div
                  ref={imageRef}
                  className="relative aspect-[4/3] sm:aspect-square w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white/90 bg-[#EFD6C5]"
                >
                  <Image
                    key={activeReview.image}
                    src={activeReview.image}
                    alt={activeReview.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 450px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right: Stars, Featured Quote, Navigation & Reviewer Info */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 sm:space-y-8">
              {/* Star Rating */}
              <div className="flex items-center gap-1.5 text-[#9C8E5E]">
                {[...Array(activeReview.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#9C8E5E]"
                  />
                ))}
              </div>

              {/* Quotation text */}
              <div ref={quoteRef} className="min-h-[140px] sm:min-h-[160px] flex items-center">
                <blockquote className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.08] tracking-tight uppercase text-[#9C8E5E]">
                  “{activeReview.featuredQuote}”
                </blockquote>
              </div>

              {/* Controls and Reviewer Name */}
              <div className="flex items-center justify-between pt-2 border-t border-[#9C8E5E]/20">
                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous review"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/80 border-2 border-[#9C8E5E]/40 text-[#9C8E5E] flex items-center justify-center hover:bg-[#9C8E5E] hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next review"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#9C8E5E] text-[#FFF9F2] border-2 border-[#9C8E5E] flex items-center justify-center hover:bg-[#887D47] transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Reviewer Details */}
                <div className="text-right">
                  <h4 className="font-headline text-lg sm:text-xl text-[#9C8E5E] tracking-tight uppercase">
                    {activeReview.name}
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[#9C8E5E]/80 font-medium">
                    {activeReview.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3 Review Cards (3-column grid matching reference image) */}
        <div className="reviews-bottom-grid grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
          {otherReviews.map(({ review, index }) => (
            <div
              key={review.id}
              onClick={() => setActiveIndex(index)}
              className="reviews-bottom-card cursor-pointer relative bg-[#EFD6C5] rounded-[2rem] sm:rounded-[2.4rem] p-7 sm:p-8 shadow-xl border-2 border-white/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#9C8E5E] flex flex-col justify-between"
            >
              <div>
                {/* Top: Avatar + Name + Role */}
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-white">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className="font-headline text-base sm:text-lg text-[#9C8E5E] leading-tight uppercase">
                      {review.name}
                    </h4>
                    <p className="font-body text-xs text-[#9C8E5E]/80 font-medium">
                      {review.role}
                    </p>
                  </div>
                </div>

                {/* Review Quote Body */}
                <p className="font-body text-xs sm:text-sm text-[#9C8E5E] leading-relaxed font-medium opacity-90">
                  “{review.bodyQuote}”
                </p>
              </div>

              {/* Subtle indicator bar */}
              <div className="mt-5 pt-3 border-t border-[#9C8E5E]/15 flex items-center justify-between">
                <div className="flex gap-1 text-[#9C8E5E]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] font-bold tracking-wider text-[#9C8E5E]/70 uppercase">
                  Verified Sip
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

