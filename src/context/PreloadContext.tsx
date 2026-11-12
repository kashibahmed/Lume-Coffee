"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface PreloadContextType {
  initialBufferProgress: number; // 0 to 100% of the initial 15-frame buffer
  isInitialReady: boolean;        // true as soon as frames 1-15 are ready
  isPreloaderComplete: boolean;   // true once preloader curtain has lifted
  isMobile: boolean;
  setInitialBufferProgress: (progress: number) => void;
  setIsInitialReady: (ready: boolean) => void;
  markPreloaderComplete: () => void;
}

const PreloadContext = createContext<PreloadContextType>({
  initialBufferProgress: 0,
  isInitialReady: false,
  isPreloaderComplete: false,
  isMobile: false,
  setInitialBufferProgress: () => {},
  setIsInitialReady: () => {},
  markPreloaderComplete: () => {},
});

export function PreloadProvider({ children }: { children: React.ReactNode }) {
  const [initialBufferProgress, setProgress] = useState(0);
  const [isInitialReady, setReady] = useState(false);
  const [isPreloaderComplete, setIsComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const setInitialBufferProgress = useCallback((val: number) => {
    setProgress((prev) => Math.max(prev, Math.min(100, Math.round(val))));
  }, []);

  const setIsInitialReady = useCallback((ready: boolean) => {
    setReady(ready);
    if (ready) setProgress(100);
  }, []);

  const markPreloaderComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  return (
    <PreloadContext.Provider
      value={{
        initialBufferProgress,
        isInitialReady,
        isPreloaderComplete,
        isMobile,
        setInitialBufferProgress,
        setIsInitialReady,
        markPreloaderComplete,
      }}
    >
      {children}
    </PreloadContext.Provider>
  );
}

export const usePreload = () => useContext(PreloadContext);
