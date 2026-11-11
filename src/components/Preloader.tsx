"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecorativeSun from "./DecorativeSun";
import { usePreload } from "@/context/PreloadContext";

interface PreloaderProps {
  onComplete?: () => void;
}

const PHASES = [
  {
    word: "BREWING",
    bg: "#887D47", // Brand Deep Olive Gold
    text: "#FFF9F2", // Cream White
  },
  {
    word: "ROASTING",
    bg: "#EFD6C5", // Warm Peach Cream
    text: "#9C8E5E", // Brand Olive
  },
  {
    word: "GRINDING",
    bg: "#F9C6C6", // Brand Blush Pink
    text: "#887D47", // Brand Deep Olive
  },
  {
    word: "POURING",
    bg: "#332C25", // Dark Espresso Roast
    text: "#FFF9F2", // Cream White
  },
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const echoContainerRef = useRef<HTMLDivElement>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showEcho, setShowEcho] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const { videoProgress, videoReady, markPreloaderComplete } = usePreload();
  const videoReadyRef = useRef(false);
  videoReadyRef.current = videoReady;

  const [displayProgress, setDisplayProgress] = useState(0);

  // Smoothly interpolate displayed percentage
  useEffect(() => {
    const target = Math.max(displayProgress, videoProgress);
    if (target === displayProgress) return;

    const diff = target - displayProgress;
    const step = Math.max(1, Math.ceil(diff / 5));
    const timer = setTimeout(() => {
      setDisplayProgress((prev) => Math.min(target, prev + step));
    }, 30);

    return () => clearTimeout(timer);
  }, [videoProgress, displayProgress]);

  useEffect(() => {
    // 1. Lock scroll and pause Lenis while preloading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (typeof window !== "undefined" && (window as any).__lenis) {
      (window as any).__lenis.stop();
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      document.body.style.overflow = originalOverflow;
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
      setIsDone(true);
      markPreloaderComplete();
      onComplete?.();
      return;
    }

    let isCancelled = false;

    // Curtain exit execution
    const triggerCurtainLift = () => {
      if (isCancelled || !containerRef.current) return;

      setShowEcho(true);

      gsap.delayedCall(0.35, () => {
        if (isCancelled || !containerRef.current) return;

        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.style.overflow = originalOverflow;

            // Resume Lenis smooth scroll and refresh ScrollTrigger
            if (typeof window !== "undefined" && (window as any).__lenis) {
              (window as any).__lenis.start();
            }
            ScrollTrigger.refresh();

            setIsDone(true);
            markPreloaderComplete();
            onComplete?.();
          },
        });
      });
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Phase 0: BREWING (0s -> 0.4s)
      tl.to({}, { duration: 0.4 });

      // Phase 1: ROASTING (0.4s -> 0.8s)
      tl.call(() => setCurrentPhase(1));
      tl.fromTo(
        textWrapperRef.current,
        { scale: 0.92, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.15, ease: "power2.out" }
      );
      tl.to({}, { duration: 0.35 });

      // Phase 2: GRINDING (0.8s -> 1.25s)
      tl.call(() => setCurrentPhase(2));
      tl.fromTo(
        textWrapperRef.current,
        { scale: 0.92, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.15, ease: "power2.out" }
      );
      tl.to({}, { duration: 0.35 });

      // Phase 3: POURING (1.25s -> ...)
      tl.call(() => {
        setCurrentPhase(3);
      });
      tl.fromTo(
        textWrapperRef.current,
        { scale: 0.92, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.15, ease: "power2.out" }
      );
      tl.to({}, { duration: 0.3 });

      // Check if video scroll buffer is ready
      tl.call(() => {
        const checkReady = () => {
          if (videoReadyRef.current) {
            triggerCurtainLift();
          } else {
            // Keep checking every 60ms until buffer finishes loading
            setTimeout(checkReady, 60);
          }
        };
        checkReady();
      });
    }, containerRef);

    return () => {
      isCancelled = true;
      document.body.style.overflow = originalOverflow;
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
      ctx.revert();
    };
  }, [markPreloaderComplete, onComplete]);

  // Echo animation when showEcho becomes true
  useEffect(() => {
    if (!showEcho || !echoContainerRef.current) return;

    const layers = echoContainerRef.current.querySelectorAll(".echo-layer");
    gsap.fromTo(
      layers,
      { y: 0, opacity: 0.85, scaleY: 0.9 },
      {
        y: (i) => {
          const offsets = [-20, -40, -60, -80, 20, 40, 60, 80];
          return offsets[i] || 0;
        },
        opacity: (i) => {
          const opacities = [0.65, 0.45, 0.25, 0.12, 0.65, 0.45, 0.25, 0.12];
          return opacities[i] || 0.2;
        },
        scaleY: 1.05,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.02,
      }
    );
  }, [showEcho]);

  if (isDone) return null;

  const current = PHASES[currentPhase];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-colors duration-200"
      style={{ backgroundColor: current.bg }}
    >
      {/* Top Brand Bar */}
      <div className="absolute top-8 left-8 sm:left-12 flex items-center gap-2.5 opacity-80 pointer-events-none">
        <DecorativeSun size={20} color={current.text} variant="hand-drawn" />
        <span
          className="font-headline tracking-widest text-xs uppercase"
          style={{ color: current.text }}
        >
          Lume Coffee Co.
        </span>
      </div>

      <div className="absolute top-8 right-8 sm:right-12 opacity-80 pointer-events-none">
        <span
          className="font-body text-xs tracking-wider uppercase font-medium"
          style={{ color: current.text }}
        >
          Est. 2026
        </span>
      </div>

      {/* Main Kinetic Typography */}
      <div className="relative flex items-center justify-center w-full px-4">
        {/* Echo Layers Container (activated on POURING finale) */}
        {showEcho && (
          <div
            ref={echoContainerRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            {/* 4 layers up */}
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: current.text }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: current.text }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: current.text }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: current.text }}
            >
              POURING
            </span>

            {/* 4 layers down */}
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: current.text }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: current.text }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: current.text }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: current.text }}
            >
              POURING
            </span>
          </div>
        )}

        {/* Foreground Active Word */}
        <div ref={textWrapperRef} className="relative z-10 text-center">
          <h1
            className="font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black transition-colors duration-150"
            style={{ color: current.text }}
          >
            {current.word}
          </h1>
        </div>
      </div>

      {/* Bottom Loading Progress Indicator */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-sm px-6 flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-semibold tracking-widest uppercase opacity-85">
          <span style={{ color: current.text }}>
            {displayProgress < 100 ? "Brewing Experience" : "Ready to Pour"}
          </span>
          <span className="tabular-nums" style={{ color: current.text }}>
            {displayProgress}%
          </span>
        </div>

        {/* Real-time Progress Bar */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden border border-white/25"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${displayProgress}%`,
              backgroundColor: current.text,
            }}
          />
        </div>
      </div>
    </div>
  );
}
