"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecorativeSun from "./DecorativeSun";
import CoffeeBeanSvg from "./CoffeeBeanSvg";
import { usePreload } from "@/context/PreloadContext";

const TOTAL_FRAMES = 850;
const INITIAL_BUFFER_COUNT = 15;
const MAX_CACHE_SIZE = 100; // LRU memory limit: max 100 decoded frames in RAM (~80-120 frames per spec)

export default function Hero() {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Content layers
  const heroCardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const journeyPillTextRef = useRef<HTMLSpanElement>(null);

  const { setInitialBufferProgress, setIsInitialReady, isPreloaderComplete, isMobile } =
    usePreload();

  // LRU Decoded Frames Cache: Map<frameIndex, ImageBitmap | HTMLImageElement>
  const frameCacheRef = useRef<Map<number, ImageBitmap | HTMLImageElement>>(new Map());
  const activeRequestsRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const scrollDirectionRef = useRef<"down" | "up">("down");
  const rafIdRef = useRef<number | null>(null);

  // Helper to determine asset URL (720p WebP for mobile, 1080p WebP for desktop, with JPG fallback)
  const getFrameUrl = useCallback(
    (index: number) => {
      const padded = String(index).padStart(3, "0");
      const folder = isMobile ? "/hero-frames-mobile" : "/hero-frames";
      return `${folder}/frame_${padded}.webp`;
    },
    [isMobile]
  );

  // Evict furthest frames when cache exceeds capacity (Priority 5: Memory Management)
  const pruneCache = useCallback(() => {
    const cache = frameCacheRef.current;
    if (cache.size <= MAX_CACHE_SIZE) return;

    const current = currentFrameRef.current;
    // Sort cached keys by distance from currentFrame descending
    const keysByDistance = Array.from(cache.keys()).sort((a, b) => {
      return Math.abs(b - current) - Math.abs(a - current);
    });

    const toRemove = cache.size - MAX_CACHE_SIZE;
    for (let i = 0; i < toRemove; i++) {
      const key = keysByDistance[i];
      const item = cache.get(key);
      if (item) {
        // If it's an ImageBitmap, close it to free GPU memory
        if (typeof (item as ImageBitmap).close === "function") {
          (item as ImageBitmap).close();
        }
        cache.delete(key);
      }
    }
  }, []);

  // Fetch and decode a single frame into the LRU cache
  const loadAndDecodeFrame = useCallback(
    async (idx: number): Promise<ImageBitmap | HTMLImageElement | null> => {
      if (idx < 1 || idx > TOTAL_FRAMES) return null;

      const cache = frameCacheRef.current;
      if (cache.has(idx)) {
        return cache.get(idx)!;
      }

      if (activeRequestsRef.current.has(idx)) {
        return null;
      }

      activeRequestsRef.current.add(idx);

      try {
        const url = getFrameUrl(idx);
        let decoded: ImageBitmap | HTMLImageElement;

        if (typeof window !== "undefined" && "createImageBitmap" in window) {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          decoded = await createImageBitmap(blob);
        } else {
          decoded = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => {
              // Fallback to JPG if WebP fails
              const fallback = new Image();
              const padded = String(idx).padStart(3, "0");
              fallback.src = `/hero-frames/frame_${padded}.jpg`;
              fallback.onload = () => resolve(fallback);
              fallback.onerror = reject;
            };
          });
        }

        cache.set(idx, decoded);
        pruneCache();
        return decoded;
      } catch {
        return null;
      } finally {
        activeRequestsRef.current.delete(idx);
      }
    },
    [getFrameUrl, pruneCache]
  );

  // Draw a frame onto the Canvas (Priority 4)
  const drawOnCanvas = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
    currentFrameRef.current = clamped;

    if (clamped === lastDrawnFrameRef.current) return;

    // Check exact frame or closest cached neighbor in rolling window
    let img: ImageBitmap | HTMLImageElement | undefined = frameCacheRef.current.get(clamped);

    if (!img) {
      for (let offset = 1; offset <= 30; offset++) {
        const prev = frameCacheRef.current.get(clamped - offset);
        if (prev) {
          img = prev;
          break;
        }
        const next = frameCacheRef.current.get(clamped + offset);
        if (next) {
          img = next;
          break;
        }
      }
    }

    if (!img) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = "width" in img ? img.width : (img as HTMLImageElement).naturalWidth;
    const imgHeight = "height" in img ? img.height : (img as HTMLImageElement).naturalHeight;

    if (!imgWidth || !imgHeight) return;

    const imgRatio = imgWidth / imgHeight;
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
    lastDrawnFrameRef.current = clamped;
  }, []);

  // Batched render via requestAnimationFrame
  const queueRender = useCallback(
    (frameIndex: number) => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        drawOnCanvas(frameIndex);
        rafIdRef.current = null;
      });
    },
    [drawOnCanvas]
  );

  // Resize canvas backing store with DPR capping to prevent VRAM explosion
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Cap backing store width to 1920 to match source resolution
    const targetWidth = Math.min(1920, Math.round(rect.width * dpr));
    const targetHeight = Math.round(targetWidth / (16 / 9));

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      lastDrawnFrameRef.current = -1; // force redraw
      drawOnCanvas(currentFrameRef.current);
    }
  }, [drawOnCanvas]);

  // Initial Loading Buffer (Frames 1-15 + Fonts) for Preloader (Priority 3 & 7)
  useEffect(() => {
    let isCancelled = false;

    const loadInitialBuffer = async () => {
      // 1. Load and draw Frame 1 immediately
      const first = await loadAndDecodeFrame(1);
      if (isCancelled) return;
      if (first) {
        drawOnCanvas(1);
      }

      // 2. Preload frames 2 to 15 in parallel
      let loaded = 1;
      const initialPromises: Promise<any>[] = [];

      for (let i = 2; i <= INITIAL_BUFFER_COUNT; i++) {
        const p = loadAndDecodeFrame(i).then(() => {
          if (!isCancelled) {
            loaded++;
            setInitialBufferProgress(Math.round((loaded / INITIAL_BUFFER_COUNT) * 100));
          }
        });
        initialPromises.push(p);
      }

      // Also ensure document fonts are ready
      if (typeof document !== "undefined" && document.fonts) {
        initialPromises.push(document.fonts.ready);
      }

      await Promise.all(initialPromises);

      if (!isCancelled) {
        setInitialBufferProgress(100);
        setIsInitialReady(true);
      }
    };

    loadInitialBuffer();

    return () => {
      isCancelled = true;
    };
  }, [loadAndDecodeFrame, drawOnCanvas, setInitialBufferProgress, setIsInitialReady]);

  // Progressive Rolling Background Loader around currentFrame (Priority 3)
  useEffect(() => {
    let isCancelled = false;
    let isWorkerRunning = false;

    const workerQueue: number[] = [];

    // Prioritize upcoming frames based on scroll direction & proximity
    const scheduleProximityBatch = () => {
      if (isCancelled) return;
      const current = currentFrameRef.current;
      const isDown = scrollDirectionRef.current === "down";

      workerQueue.length = 0; // clear stale queue

      // Lookahead window (30-40 frames ahead) & Lookbehind buffer (15-20 frames behind)
      const forwardStart = isDown ? current + 1 : current - 1;
      const forwardEnd = isDown ? Math.min(TOTAL_FRAMES, current + 35) : Math.max(1, current - 25);
      const step = isDown ? 1 : -1;

      // 1. Immediate neighborhood
      for (let i = forwardStart; isDown ? i <= forwardEnd : i >= forwardEnd; i += step) {
        if (!frameCacheRef.current.has(i) && !activeRequestsRef.current.has(i)) {
          workerQueue.push(i);
        }
      }

      // 2. Keyframe stride across sequence (every 3rd frame)
      for (let i = Math.max(1, current - 50); i <= Math.min(TOTAL_FRAMES, current + 90); i += 3) {
        if (!frameCacheRef.current.has(i) && !activeRequestsRef.current.has(i)) {
          if (!workerQueue.includes(i)) {
            workerQueue.push(i);
          }
        }
      }

      runConcurrentBatch();
    };

    // Controlled concurrency pool (4-6 parallel requests)
    const runConcurrentBatch = async () => {
      if (isWorkerRunning || isCancelled || workerQueue.length === 0) return;
      isWorkerRunning = true;

      const CONCURRENCY = 5;

      const worker = async () => {
        while (workerQueue.length > 0 && !isCancelled) {
          const idx = workerQueue.shift();
          if (idx === undefined) break;
          await loadAndDecodeFrame(idx);
        }
      };

      const workers = Array.from({ length: CONCURRENCY }, () => worker());
      await Promise.all(workers);
      isWorkerRunning = false;
    };

    // Periodically update proximity buffer
    const interval = setInterval(scheduleProximityBatch, 250);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [loadAndDecodeFrame]);

  // Handle window resize
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize, { passive: true });
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  // Setup GSAP ScrollTrigger (Priority 6)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let previousProgress = 0;

    const ctx = gsap.context(() => {
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: outerWrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1, // Tight, buttery sync with Lenis
        onUpdate: (self) => {
          // Track scroll direction for directional frame prioritization
          if (self.progress > previousProgress) {
            scrollDirectionRef.current = "down";
          } else if (self.progress < previousProgress) {
            scrollDirectionRef.current = "up";
          }
          previousProgress = self.progress;

          // Map 0 -> 1 progress to 1 -> 850 frames
          const targetFrame = Math.round(
            1 + self.progress * (TOTAL_FRAMES - 1)
          );

          queueRender(targetFrame);

          // Update HUD progress bar directly on DOM without triggering React re-renders
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }

          if (journeyPillTextRef.current) {
            journeyPillTextRef.current.textContent =
              targetFrame < TOTAL_FRAMES ? "Scroll the Journey" : "Journey Complete ↓";
          }

          // Hero card fades out gracefully as scrolling starts
          if (heroCardRef.current) {
            if (self.progress < 0.16) {
              const opacity = Math.max(0, 1 - self.progress / 0.12);
              heroCardRef.current.style.opacity = `${opacity}`;
              heroCardRef.current.style.transform = `translateY(-${self.progress * 80}px) scale(${
                1 - self.progress * 0.08
              })`;
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
      }, 400);

      return () => {
        clearTimeout(timer);
        scrollTriggerInstance.kill();
      };
    }, outerWrapperRef);

    return () => ctx.revert();
  }, [queueRender]);

  // Refresh and draw when preloader completes
  useEffect(() => {
    if (isPreloaderComplete) {
      updateCanvasSize();
      ScrollTrigger.refresh();
      drawOnCanvas(1);
    }
  }, [isPreloaderComplete, updateCanvasSize, drawOnCanvas]);

  return (
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
        {/* Fullscreen HTML5 Canvas */}
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

        {/* Main Hero: Glass of Coffee */}
        <div
          ref={heroCardRef}
          className="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-6 md:px-12 pointer-events-auto pt-20 sm:pt-24 pb-10"
        >
          <div className="relative shrink-0 flex items-center justify-center animate-float translate-y-2 sm:translate-y-4">
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
            <span
              ref={journeyPillTextRef}
              className="text-brand-blush font-semibold tracking-wide"
            >
              Scroll the Journey
            </span>
          </div>

          {/* Real-time Progress Bar */}
          <div className="w-full sm:w-72 h-2 bg-white/30 backdrop-blur-md rounded-full overflow-hidden border border-white/20 shadow-inner">
            <div
              ref={progressBarRef}
              className="h-full bg-brand-blush rounded-full transition-all duration-75 ease-out"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
