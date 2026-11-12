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
  const currentPhaseRef = useRef(0);

  const [showEcho, setShowEcho] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const { videoProgress, videoReady, markPreloaderComplete } = usePreload();
  const videoReadyRef = useRef(false);
  videoReadyRef.current = videoReady;

  const [displayProgress, setDisplayProgress] = useState(0);
  const displayProgressRef = useRef(0);
  displayProgressRef.current = displayProgress;

  const hasCompletedFirstLoopRef = useRef(false);
  const isExitingRef = useRef(false);

  // 1. Smoothly interpolate displayed percentage up to real video progress
  useEffect(() => {
    const target = Math.max(displayProgress, videoProgress);
    if (target === displayProgress) return;

    const diff = target - displayProgress;
    const step = Math.max(1, Math.ceil(diff / 5));
    const timer = setTimeout(() => {
      setDisplayProgress((prev) => Math.min(target, prev + step));
    }, 25);

    return () => clearTimeout(timer);
  }, [videoProgress, displayProgress]);

  // Baseline progress animation so the progress bar is always lively and moving
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoReadyRef.current) {
        setDisplayProgress(100);
        return;
      }
      setDisplayProgress((prev) => {
        // Softly crawl up to 92% until videoReady signals 100%
        if (prev < 90) {
          return prev + 1;
        }
        return prev;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  // 2. Continuous Looping & Synchronization Controller
  useEffect(() => {
    // Lock scroll and stop Lenis while preloading
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
    let timerId: NodeJS.Timeout | null = null;

    // Trigger finale echo and smooth curtain slide-up
    const triggerCurtainLift = () => {
      if (isCancelled || isExitingRef.current || !containerRef.current) return;
      isExitingRef.current = true;

      // Make sure displayed progress displays 100%
      setDisplayProgress(100);
      setShowEcho(true);

      gsap.delayedCall(0.38, () => {
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

    // Cycle to next word in the loop
    const stepPhase = () => {
      if (isCancelled || isExitingRef.current) return;

      const current = currentPhaseRef.current;
      const next = (current + 1) % PHASES.length;

      // If we just wrapped from 3 (POURING) to 0 (BREWING), we have completed a full loop
      if (current === PHASES.length - 1) {
        hasCompletedFirstLoopRef.current = true;
      }

      // Check if we are ready to finish:
      // We finish on "POURING" (phase 3) once the loading bar is full (>= 98%) AND videoReady is true,
      // and we have displayed at least 1 full cycle so the user experiences the complete brand story.
      const isBufferReady = videoReadyRef.current || displayProgressRef.current >= 99;
      if (current === 3 && isBufferReady && hasCompletedFirstLoopRef.current) {
        triggerCurtainLift();
        return;
      }

      currentPhaseRef.current = next;
      setCurrentPhase(next);

      // Micro-scale entrance animation for each word
      if (textWrapperRef.current) {
        gsap.fromTo(
          textWrapperRef.current,
          { scale: 0.9, opacity: 0.75 },
          { scale: 1, opacity: 1, duration: 0.18, ease: "power2.out" }
        );
      }

      // Set pacing for word display:
      // ~480ms per word gives a rhythmic, captivating, and brisk motion flow
      timerId = setTimeout(stepPhase, 480);
    };

    // Start first word animation
    if (textWrapperRef.current) {
      gsap.fromTo(
        textWrapperRef.current,
        { scale: 0.9, opacity: 0.75 },
        { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" }
      );
    }
    timerId = setTimeout(stepPhase, 480);

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
      document.body.style.overflow = originalOverflow;
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    };
  }, [markPreloaderComplete, onComplete]);

  // 3. Echo bloom animation when showEcho activates
  useEffect(() => {
    if (!showEcho || !echoContainerRef.current) return;

    const layers = echoContainerRef.current.querySelectorAll(".echo-layer");
    gsap.fromTo(
      layers,
      { y: 0, opacity: 0.85, scaleY: 0.9 },
      {
        y: (i) => {
          const offsets = [-22, -44, -66, -88, 22, 44, 66, 88];
          return offsets[i] || 0;
        },
        opacity: (i) => {
          const opacities = [0.7, 0.48, 0.28, 0.12, 0.7, 0.48, 0.28, 0.12];
          return opacities[i] || 0.2;
        },
        scaleY: 1.06,
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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-colors duration-300"
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

      {/* Main Kinetic Looping Typography */}
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
            className="font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black transition-colors duration-200"
            style={{ color: current.text }}
          >
            {current.word}
          </h1>
        </div>
      </div>

      {/* Bottom Loading Progress Indicator - Perfectly Synced */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-sm px-6 flex flex-col items-center gap-2.5 pointer-events-none">
        <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-semibold tracking-widest uppercase opacity-90">
          <span style={{ color: current.text }}>
            {displayProgress < 100 ? "Brewing Experience" : "Ready to Pour"}
          </span>
          <span className="tabular-nums font-bold" style={{ color: current.text }}>
            {displayProgress}%
          </span>
        </div>

        {/* Real-time Smooth Progress Bar */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden border border-white/25"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.18)" }}
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
