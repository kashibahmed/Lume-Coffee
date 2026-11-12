"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecorativeSun from "./DecorativeSun";
import CoffeeBeanSvg from "./CoffeeBeanSvg";
import { usePreload } from "@/context/PreloadContext";

const TOTAL_FRAMES = 850;
const INITIAL_BUFFER_COUNT = 15;
const MAX_CONCURRENT_REQUESTS = 8;

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

  // Master image array (indices 1 to 850)
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  // Uint8Array: 1 = loaded, 0 = not loaded
  const loadedFlagsRef = useRef<Uint8Array>(new Uint8Array(TOTAL_FRAMES + 1));
  const activeRequestsRef = useRef<Set<number>>(new Set());
  const priorityQueueRef = useRef<number[]>([]);
  const backgroundQueueRef = useRef<number[]>([]);
  const activeWorkerCountRef = useRef<number>(0);

  const currentFrameRef = useRef<number>(1);
  const lastRenderedFrameRef = useRef<number>(-1);
  const scrollDirectionRef = useRef<"down" | "up">("down");

  // Path resolver: WebP with mobile/desktop resolution
  const getFrameUrl = useCallback(
    (index: number) => {
      const padded = String(index).padStart(3, "0");
      const folder = isMobile ? "/hero-frames-mobile" : "/hero-frames";
      return `${folder}/frame_${padded}.webp`;
    },
    [isMobile]
  );

  // Fallback path resolver
  const getFallbackUrl = (index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/hero-frames/frame_${padded}.jpg`;
  };

  // Direct paint to Canvas with hardware smoothing and low latency
  const drawImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    if (canvasWidth <= 0 || canvasHeight <= 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;
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
  }, []);

  // Dispatch queue processor for controlled concurrent loading
  const processLoadQueue = useCallback(() => {
    while (
      activeWorkerCountRef.current < MAX_CONCURRENT_REQUESTS &&
      (priorityQueueRef.current.length > 0 || backgroundQueueRef.current.length > 0)
    ) {
      // Priority queue takes precedence over background queue
      const idx =
        priorityQueueRef.current.shift() ?? backgroundQueueRef.current.shift();
      if (idx === undefined) break;

      // Skip if already loaded or actively downloading
      if (loadedFlagsRef.current[idx] === 1 || activeRequestsRef.current.has(idx)) {
        continue;
      }

      activeRequestsRef.current.add(idx);
      activeWorkerCountRef.current++;

      const img = new Image();
      const primaryUrl = getFrameUrl(idx);

      const onImageSuccess = () => {
        imagesRef.current[idx] = img;
        loadedFlagsRef.current[idx] = 1;
        activeRequestsRef.current.delete(idx);
        activeWorkerCountRef.current--;

        // If the newly loaded frame is the current frame, or closer to the current frame than
        // what is currently displayed, immediately repaint!
        const currentTarget = currentFrameRef.current;
        const currentDrawn = lastRenderedFrameRef.current;
        if (
          idx === currentTarget ||
          (currentDrawn !== -1 &&
            Math.abs(currentTarget - idx) < Math.abs(currentTarget - currentDrawn))
        ) {
          drawImageToCanvas(img);
          lastRenderedFrameRef.current = idx;
        }

        processLoadQueue();
      };

      img.onload = () => {
        // Asynchronously decode off main thread before completing
        if (typeof img.decode === "function") {
          img.decode().then(onImageSuccess).catch(onImageSuccess);
        } else {
          onImageSuccess();
        }
      };

      img.onerror = () => {
        // Fallback to original JPG if WebP encounters any error
        const fallbackImg = new Image();
        fallbackImg.src = getFallbackUrl(idx);
        fallbackImg.onload = () => {
          imagesRef.current[idx] = fallbackImg;
          loadedFlagsRef.current[idx] = 1;
          activeRequestsRef.current.delete(idx);
          activeWorkerCountRef.current--;

          const currentTarget = currentFrameRef.current;
          if (idx === currentTarget) {
            drawImageToCanvas(fallbackImg);
            lastRenderedFrameRef.current = idx;
          }
          processLoadQueue();
        };
        fallbackImg.onerror = () => {
          activeRequestsRef.current.delete(idx);
          activeWorkerCountRef.current--;
          processLoadQueue();
        };
      };

      img.src = primaryUrl;
    }
  }, [getFrameUrl, drawImageToCanvas]);

  // Request a specific frame with immediate top priority
  const requestFrameWithPriority = useCallback(
    (idx: number) => {
      if (idx < 1 || idx > TOTAL_FRAMES) return;
      if (loadedFlagsRef.current[idx] === 1 || activeRequestsRef.current.has(idx)) return;

      // Insert at the front of priority queue
      if (!priorityQueueRef.current.includes(idx)) {
        priorityQueueRef.current.unshift(idx);
      }
      processLoadQueue();
    },
    [processLoadQueue]
  );

  // Render frame onto canvas with closest-available neighbor fallback
  const renderFrame = useCallback(
    (targetIndex: number) => {
      const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(targetIndex)));
      currentFrameRef.current = clamped;

      // Avoid redundant redraw if this exact frame is already drawn on canvas
      if (clamped === lastRenderedFrameRef.current) {
        return;
      }

      // 1. Exact match available
      if (loadedFlagsRef.current[clamped] === 1 && imagesRef.current[clamped]) {
        drawImageToCanvas(imagesRef.current[clamped]!);
        lastRenderedFrameRef.current = clamped;
        return;
      }

      // 2. Exact match not ready: search outward for the closest available frame
      let fallbackImg: HTMLImageElement | null = null;
      let fallbackIndex = -1;

      for (let d = 1; d < TOTAL_FRAMES; d++) {
        const prev = clamped - d;
        if (prev >= 1 && loadedFlagsRef.current[prev] === 1 && imagesRef.current[prev]) {
          fallbackIndex = prev;
          fallbackImg = imagesRef.current[prev]!;
          break;
        }
        const next = clamped + d;
        if (next <= TOTAL_FRAMES && loadedFlagsRef.current[next] === 1 && imagesRef.current[next]) {
          fallbackIndex = next;
          fallbackImg = imagesRef.current[next]!;
          break;
        }
      }

      if (fallbackImg) {
        drawImageToCanvas(fallbackImg);
        lastRenderedFrameRef.current = fallbackIndex;
      }

      // Request exact missing frame immediately
      requestFrameWithPriority(clamped);
    },
    [drawImageToCanvas, requestFrameWithPriority]
  );

  // Update canvas size matching viewport and DPR
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetWidth = Math.min(1920, Math.round(rect.width * dpr));
    const targetHeight = Math.round(targetWidth / (16 / 9));

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      lastRenderedFrameRef.current = -1; // force paint
      renderFrame(currentFrameRef.current);
    }
  }, [renderFrame]);

  // Initial Buffer Preloader: Frames 1 to 15 + Document Fonts
  useEffect(() => {
    let isCancelled = false;

    // Initialize arrays
    imagesRef.current = new Array(TOTAL_FRAMES + 1);
    loadedFlagsRef.current = new Uint8Array(TOTAL_FRAMES + 1);

    const loadInitialBuffer = async () => {
      let loaded = 0;

      // 1. Load Frame 1 immediately
      const firstImg = new Image();
      firstImg.onload = () => {
        if (isCancelled) return;
        imagesRef.current[1] = firstImg;
        loadedFlagsRef.current[1] = 1;
        drawImageToCanvas(firstImg);
        lastRenderedFrameRef.current = 1;
        loaded++;
        setInitialBufferProgress(Math.round((loaded / INITIAL_BUFFER_COUNT) * 100));
      };
      firstImg.src = getFrameUrl(1);

      // 2. Preload frames 2 through 15
      const promises: Promise<any>[] = [];
      for (let i = 2; i <= INITIAL_BUFFER_COUNT; i++) {
        const p = new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (!isCancelled) {
              imagesRef.current[i] = img;
              loadedFlagsRef.current[i] = 1;
              loaded++;
              setInitialBufferProgress(Math.round((loaded / INITIAL_BUFFER_COUNT) * 100));
            }
            resolve();
          };
          img.onerror = () => {
            // fallback
            const fb = new Image();
            fb.onload = () => {
              if (!isCancelled) {
                imagesRef.current[i] = fb;
                loadedFlagsRef.current[i] = 1;
                loaded++;
                setInitialBufferProgress(Math.round((loaded / INITIAL_BUFFER_COUNT) * 100));
              }
              resolve();
            };
            fb.onerror = () => resolve();
            fb.src = getFallbackUrl(i);
          };
          img.src = getFrameUrl(i);
        });
        promises.push(p);
      }

      // 3. Ensure document fonts are loaded
      if (typeof document !== "undefined" && document.fonts) {
        promises.push(document.fonts.ready);
      }

      await Promise.all(promises);

      if (!isCancelled) {
        setInitialBufferProgress(100);
        setIsInitialReady(true);
      }
    };

    loadInitialBuffer();

    return () => {
      isCancelled = true;
    };
  }, [getFrameUrl, drawImageToCanvas, setInitialBufferProgress, setIsInitialReady]);

  // Directional & Proximity Lookahead Frame Queue Updater
  const scheduleLookaheadBatch = useCallback(
    (current: number, direction: "down" | "up") => {
      const priorityBatch: number[] = [];
      const backgroundBatch: number[] = [];

      const isDown = direction === "down";
      const forwardStart = isDown ? current + 1 : current - 1;
      const forwardEnd = isDown
        ? Math.min(TOTAL_FRAMES, current + 65)
        : Math.max(1, current - 50);
      const step = isDown ? 1 : -1;

      // 1. Immediate forward lookahead
      for (let i = forwardStart; isDown ? i <= forwardEnd : i >= forwardEnd; i += step) {
        if (loadedFlagsRef.current[i] === 0) {
          priorityBatch.push(i);
        }
      }

      // 2. Reverse buffer (for responsive backward scrubbing)
      const backwardStart = isDown ? Math.max(1, current - 25) : Math.min(TOTAL_FRAMES, current + 25);
      const backwardEnd = current;
      for (let i = backwardStart; i <= backwardEnd; i++) {
        if (loadedFlagsRef.current[i] === 0 && !priorityBatch.includes(i)) {
          priorityBatch.push(i);
        }
      }

      // 3. Wider keyframe stride to ensure coverage throughout the timeline
      for (let i = Math.max(1, current - 80); i <= Math.min(TOTAL_FRAMES, current + 150); i += 3) {
        if (loadedFlagsRef.current[i] === 0 && !priorityBatch.includes(i)) {
          backgroundBatch.push(i);
        }
      }

      priorityQueueRef.current = priorityBatch;
      backgroundQueueRef.current = backgroundBatch;
      processLoadQueue();
    },
    [processLoadQueue]
  );

  // Proactive background loader: continuously stream in remaining frames with saturated workers
  useEffect(() => {
    let isCancelled = false;

    const idleStreamer = setInterval(() => {
      if (isCancelled) return;
      if (priorityQueueRef.current.length === 0) {
        const current = currentFrameRef.current;
        let added = 0;

        // Forward stream from current frame
        for (let i = current + 1; i <= TOTAL_FRAMES && added < 24; i++) {
          if (
            loadedFlagsRef.current[i] === 0 &&
            !activeRequestsRef.current.has(i) &&
            !backgroundQueueRef.current.includes(i)
          ) {
            backgroundQueueRef.current.push(i);
            added++;
          }
        }

        // Backward stream to cover start
        if (added < 24) {
          for (let i = current - 1; i >= 1 && added < 24; i--) {
            if (
              loadedFlagsRef.current[i] === 0 &&
              !activeRequestsRef.current.has(i) &&
              !backgroundQueueRef.current.includes(i)
            ) {
              backgroundQueueRef.current.push(i);
              added++;
            }
          }
        }

        if (added > 0) {
          processLoadQueue();
        }
      }
    }, 80);

    return () => {
      isCancelled = true;
      clearInterval(idleStreamer);
    };
  }, [processLoadQueue]);

  // Window resize handler
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize, { passive: true });
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  // GSAP ScrollTrigger Integration
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
        scrub: 0.65, // Silky smooth 650ms momentum scrub for liquid, cinematic playback
        onUpdate: (self) => {
          // Track scroll direction
          const dir = self.progress >= previousProgress ? "down" : "up";
          scrollDirectionRef.current = dir;
          previousProgress = self.progress;

          // Map 0 -> 1 progress to 1 -> 850 frames accurately
          const targetFrame = Math.round(1 + self.progress * (TOTAL_FRAMES - 1));

          // Render target frame directly in sync with GSAP/Lenis ticker
          renderFrame(targetFrame);

          // Update directional lookahead window
          scheduleLookaheadBatch(targetFrame, dir);

          // Update DOM directly without triggering React re-renders
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }

          if (journeyPillTextRef.current) {
            journeyPillTextRef.current.textContent =
              targetFrame < TOTAL_FRAMES ? "Scroll the Journey" : "Journey Complete ↓";
          }

          // Initial hero glass fades out gracefully as scroll starts
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
  }, [renderFrame, scheduleLookaheadBatch]);

  // Refresh and draw when preloader completes
  useEffect(() => {
    if (isPreloaderComplete) {
      updateCanvasSize();
      ScrollTrigger.refresh();
      renderFrame(1);
    }
  }, [isPreloaderComplete, updateCanvasSize, renderFrame]);

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
