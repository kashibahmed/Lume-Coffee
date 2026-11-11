"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecorativeSun from "./DecorativeSun";
import CoffeeBeanSvg from "./CoffeeBeanSvg";
import { usePreload } from "@/context/PreloadContext";

const TOTAL_FRAMES = 850;

export default function Hero() {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Content layers
  const heroCardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [currentFrame, setCurrentFrame] = useState(1);
  const { setVideoProgress, setVideoReady, isPreloaderComplete } = usePreload();

  // Cached HTMLImageElement array
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);
  const pendingFrameRef = useRef<number>(1);

  // Helper to format frame path
  const getFramePath = (index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/hero-frames/frame_${padded}.jpg`;
  };

  // Immediate draw on canvas
  const drawOnCanvas = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
    currentFrameRef.current = clamped;
    setCurrentFrame(clamped);

    // Look for exact image or nearest cached neighbor
    let img = imagesRef.current[clamped];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 35; offset++) {
        const prev = imagesRef.current[clamped - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[clamped + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let renderWidth = canvasWidth;
    let renderHeight = canvasHeight;
    let x = 0;
    let y = 0;

    if (canvasRatio > imgRatio) {
      renderHeight = canvasWidth / imgRatio;
      y = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgRatio;
      x = (canvasWidth - renderWidth) / 2;
    }

    ctx.drawImage(img, x, y, renderWidth, renderHeight);
  }, []);

  // Batched frame render via rAF to ensure 60fps locked to display refresh
  const renderFrame = useCallback(
    (frameIndex: number) => {
      pendingFrameRef.current = frameIndex;
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        drawOnCanvas(pendingFrameRef.current);
        rafIdRef.current = null;
      });
    },
    [drawOnCanvas]
  );

  // Update canvas dimensions matching DPR
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawOnCanvas(currentFrameRef.current);
    }
  }, [drawOnCanvas]);

  // Progressive tiered frame loader connected to Preloader
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(TOTAL_FRAMES + 1);

    // 1. Immediately load Frame 1 & paint canvas
    const firstImg = new Image();
    firstImg.src = getFramePath(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[1] = firstImg;
      drawOnCanvas(1);
    };

    // 2. Build prioritized queues:
    // Tier 1: Initial scrub sequence (frames 1 to 40)
    // Tier 2: Keyframe stride (every 3rd frame: 42, 45, 48... up to 850)
    // Tier 3: All intermediate frames (loaded continuously in background)
    const tier1: number[] = [];
    for (let i = 2; i <= 40; i++) {
      tier1.push(i);
    }

    const tier2: number[] = [];
    for (let i = 42; i <= TOTAL_FRAMES; i += 3) {
      tier2.push(i);
    }

    const tier3: number[] = [];
    for (let i = 41; i <= TOTAL_FRAMES; i++) {
      if (i % 3 !== 0) {
        tier3.push(i);
      }
    }

    const criticalQueue = [...tier1, ...tier2];
    const totalCritical = criticalQueue.length;
    let criticalLoaded = 0;

    // Helper to fetch a single frame with retry
    const loadSingleImage = (idx: number): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (imagesRef.current[idx]?.complete) {
          resolve();
          return;
        }
        const img = new Image();
        img.src = getFramePath(idx);
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current[idx] = img;
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    // Worker pool for high concurrency
    const runWorkerPool = async (queue: number[], concurrency: number, onEach?: () => void) => {
      const runWorker = async () => {
        while (queue.length > 0 && !isCancelled) {
          const idx = queue.shift();
          if (idx === undefined) break;
          await loadSingleImage(idx);
          if (onEach && !isCancelled) {
            onEach();
          }
        }
      };

      const workers = Array.from({ length: concurrency }, () => runWorker());
      await Promise.all(workers);
    };

    const loadExperience = async () => {
      // Load critical buffer with high concurrency
      await runWorkerPool(criticalQueue, 14, () => {
        criticalLoaded++;
        const pct = Math.min(100, Math.round((criticalLoaded / totalCritical) * 100));
        setVideoProgress(pct);
      });

      if (isCancelled) return;

      // Critical frames ready! Tell preloader it's safe to lift curtain
      setVideoReady(true);
      drawOnCanvas(1);
      ScrollTrigger.refresh();

      // Background fill-in for remaining frames (lower concurrency so browser stays light)
      await runWorkerPool(tier3, 6);

      if (!isCancelled) {
        ScrollTrigger.refresh();
      }
    };

    loadExperience();

    return () => {
      isCancelled = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawOnCanvas, setVideoProgress, setVideoReady]);

  // Handle window resize
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  // Setup ScrollTrigger on the 700vh sticky container with tight scrub
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: outerWrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.15, // Tight sync with Lenis smooth scroll
        onUpdate: (self) => {
          // Map 0 -> 1 progress to 1 -> 850 frames
          const targetFrame = Math.round(
            1 + self.progress * (TOTAL_FRAMES - 1)
          );
          renderFrame(targetFrame);

          // Update progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }

          // Initial Hero Card fades out gracefully as scrolling starts (0.0 -> 0.15)
          if (heroCardRef.current) {
            if (self.progress < 0.16) {
              const opacity = Math.max(0, 1 - self.progress / 0.12);
              heroCardRef.current.style.opacity = `${opacity}`;
              heroCardRef.current.style.transform = `translateY(-${self.progress * 80}px) scale(${1 - self.progress * 0.08})`;
              heroCardRef.current.style.pointerEvents = opacity > 0.3 ? "auto" : "none";
            } else {
              heroCardRef.current.style.opacity = "0";
              heroCardRef.current.style.pointerEvents = "none";
            }
          }
        },
      });

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        clearTimeout(timer);
        scrollTriggerInstance.kill();
      };
    }, outerWrapperRef);

    return () => ctx.revert();
  }, [renderFrame]);

  // Whenever preloader finishes, refresh ScrollTrigger and trigger redraw
  useEffect(() => {
    if (isPreloaderComplete) {
      updateCanvasSize();
      ScrollTrigger.refresh();
    }
  }, [isPreloaderComplete, updateCanvasSize]);

  return (
    // Outer scroll track: 700vh ensures all 850 frames play through completely before unlocking next section
    <div
      id="home"
      ref={outerWrapperRef}
      className="relative w-full"
      style={{ height: "700vh" }}
    >
      {/* Sticky Fullscreen Viewport */}
      <div
        ref={stickyContainerRef}
        className="sticky top-0 h-screen w-full overflow-hidden select-none bg-brand-cream"
      >
        {/* Fullscreen HTML5 Canvas drawing all 850 frames */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Subtle Vignette Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/60 via-transparent to-brand-espresso/25 pointer-events-none z-10" />

        {/* Decorative Sun Icon */}
        <div className="absolute top-28 right-8 md:top-32 md:right-16 pointer-events-none opacity-85 z-20">
          <DecorativeSun
            size={90}
            color="#FFF9F2"
            variant="hand-drawn"
            className="animate-spin-slow drop-shadow-md"
          />
        </div>

        <div className="absolute bottom-1/4 left-10 pointer-events-none z-20 animate-float opacity-75">
          <CoffeeBeanSvg size={28} rotate={-25} color="#FFF9F2" />
        </div>

        {/* Main Hero: Glass of Coffee replacing the white card (fades out gracefully on scroll) */}
        <div
          ref={heroCardRef}
          className="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-6 md:px-12 pointer-events-auto pt-20 sm:pt-24 pb-10"
        >
          <div className="relative shrink-0 flex items-center justify-center animate-float translate-y-2 sm:translate-y-4">
            {/* Subtle soft ambient glow behind the glass */}
            <div className="absolute -inset-8 bg-brand-peach/30 rounded-full blur-3xl pointer-events-none -z-10" />
            <img
              src="/images/lume-hero-glass.png"
              alt="Lume Specialty Iced Coffee"
              className="h-[360px] sm:h-[440px] md:h-[520px] lg:h-[580px] xl:h-[620px] max-h-[66vh] w-auto object-contain drop-shadow-[0_25px_40px_rgba(43,37,32,0.45)] select-none -rotate-[22deg] transform-gpu origin-center"
            />
          </div>
        </div>

        {/* Bottom Interactive HUD */}
        <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
          {/* Scroll Journey Pill */}
          <div className="flex items-center gap-2.5 bg-brand-espresso/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-brand-cream text-xs shadow-lg">
            <div className="w-2 h-2 rounded-full bg-brand-blush animate-pulse" />
            <span className="text-brand-blush font-semibold tracking-wide">
              {currentFrame < TOTAL_FRAMES
                ? "Scroll the Journey"
                : "Journey Complete ↓"}
            </span>
          </div>

          {/* Real-time Progress Bar */}
          <div className="w-full sm:w-72 h-2 bg-white/30 backdrop-blur-md rounded-full overflow-hidden border border-white/20 shadow-inner">
            <div
              ref={progressBarRef}
              className="h-full bg-brand-blush rounded-full transition-all duration-75 ease-out"
              style={{ width: `${(currentFrame / TOTAL_FRAMES) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
