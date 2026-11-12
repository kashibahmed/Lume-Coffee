"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecorativeSun from "./DecorativeSun";
import { usePreload } from "@/context/PreloadContext";

interface PreloaderProps {
  onComplete?: () => void;
}

const PHASES = ["BREWING", "ROASTING", "GRINDING", "POURING"];
const BRAND_BG = "#F9C6C6"; // Fixed Brand Pink per spec
const BRAND_TEXT = "#887D47"; // Fixed Brand Olive Gold per spec

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const echoContainerRef = useRef<HTMLDivElement>(null);

  const [currentPhase, setCurrentPhase] = useState(0);
  const currentPhaseRef = useRef(0);

  const [showEcho, setShowEcho] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const { initialBufferProgress, isInitialReady, markPreloaderComplete } = usePreload();
  const isInitialReadyRef = useRef(false);
  isInitialReadyRef.current = isInitialReady;

  const [displayProgress, setDisplayProgress] = useState(0);
  const displayProgressRef = useRef(0);
  displayProgressRef.current = displayProgress;

  const isExitingRef = useRef(false);

  // Smoothly interpolate displayed percentage up to real initial buffer progress
  useEffect(() => {
    const target = Math.max(displayProgress, initialBufferProgress);
    if (target === displayProgress) return;

    const diff = target - displayProgress;
    const step = Math.max(1, Math.ceil(diff / 4));
    const timer = setTimeout(() => {
      setDisplayProgress((prev) => Math.min(target, prev + step));
    }, 20);

    return () => clearTimeout(timer);
  }, [initialBufferProgress, displayProgress]);

  // Continuous looping & synchronization controller
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
    let timerId: NodeJS.Timeout | null = null;

    // Trigger finale echo and smooth curtain slide-up
    const triggerCurtainLift = () => {
      if (isCancelled || isExitingRef.current || !containerRef.current) return;
      isExitingRef.current = true;

      setDisplayProgress(100);
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

    // Cycle to next word in the loop
    const stepPhase = () => {
      if (isCancelled || isExitingRef.current) return;

      const current = currentPhaseRef.current;
      const next = (current + 1) % PHASES.length;

      // Check exit condition:
      // When initial 15-frame buffer + fonts are ready and we hit POURING (or finished a pass), lift curtain!
      if (isInitialReadyRef.current) {
        if (current === PHASES.length - 1) {
          triggerCurtainLift();
          return;
        }
      }

      currentPhaseRef.current = next;
      setCurrentPhase(next);

      // Micro-scale entrance animation for each word
      if (textWrapperRef.current) {
        gsap.fromTo(
          textWrapperRef.current,
          { scale: 0.92, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 0.16, ease: "power2.out" }
        );
      }

      // 400ms cadence keeps kinetic typography lively and swift
      timerId = setTimeout(stepPhase, 400);
    };

    // Initial word animation
    if (textWrapperRef.current) {
      gsap.fromTo(
        textWrapperRef.current,
        { scale: 0.92, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.16, ease: "power2.out" }
      );
    }
    timerId = setTimeout(stepPhase, 400);

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
      document.body.style.overflow = originalOverflow;
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    };
  }, [markPreloaderComplete, onComplete]);

  // Echo bloom animation when showEcho activates
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
        duration: 0.38,
        ease: "power3.out",
        stagger: 0.02,
      }
    );
  }, [showEcho]);

  if (isDone) return null;

  const currentWord = PHASES[currentPhase];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ backgroundColor: BRAND_BG }}
    >
      {/* Top Brand Bar */}
      <div className="absolute top-8 left-8 sm:left-12 flex items-center gap-2.5 opacity-85 pointer-events-none">
        <DecorativeSun size={20} color={BRAND_TEXT} variant="hand-drawn" />
        <span
          className="font-headline tracking-widest text-xs uppercase"
          style={{ color: BRAND_TEXT }}
        >
          Lume Coffee Co.
        </span>
      </div>

      <div className="absolute top-8 right-8 sm:right-12 opacity-85 pointer-events-none">
        <span
          className="font-body text-xs tracking-wider uppercase font-medium"
          style={{ color: BRAND_TEXT }}
        >
          Est. 2026
        </span>
      </div>

      {/* Main Kinetic Looping Typography */}
      <div className="relative flex items-center justify-center w-full px-4">
        {/* Echo Layers Container */}
        {showEcho && (
          <div
            ref={echoContainerRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            {/* 4 layers up */}
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: BRAND_TEXT }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: BRAND_TEXT }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: BRAND_TEXT }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: BRAND_TEXT }}
            >
              POURING
            </span>

            {/* 4 layers down */}
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: BRAND_TEXT }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: BRAND_TEXT }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: BRAND_TEXT }}
            >
              POURING
            </span>
            <span
              className="echo-layer absolute font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
              style={{ color: BRAND_TEXT }}
            >
              POURING
            </span>
          </div>
        )}

        {/* Foreground Active Word */}
        <div ref={textWrapperRef} className="relative z-10 text-center">
          <h1
            className="font-headline text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] tracking-tight uppercase leading-none font-black"
            style={{ color: BRAND_TEXT }}
          >
            {currentWord}
          </h1>
        </div>
      </div>

      {/* Bottom Loading Progress Indicator */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-sm px-6 flex flex-col items-center gap-2.5 pointer-events-none">
        <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-semibold tracking-widest uppercase opacity-90">
          <span style={{ color: BRAND_TEXT }}>
            {displayProgress < 100 ? "Brewing Experience" : "Ready to Pour"}
          </span>
          <span className="tabular-nums font-bold" style={{ color: BRAND_TEXT }}>
            {displayProgress}%
          </span>
        </div>

        {/* Real-time Smooth Progress Bar */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden border border-[#887D47]/25"
          style={{ backgroundColor: "rgba(136, 125, 71, 0.15)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${displayProgress}%`,
              backgroundColor: BRAND_TEXT,
            }}
          />
        </div>
      </div>
    </div>
  );
}
