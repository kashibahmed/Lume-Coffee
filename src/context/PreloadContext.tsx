"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface PreloadContextType {
  videoProgress: number; // 0 to 100
  videoReady: boolean;
  isPreloaderComplete: boolean;
  setVideoProgress: (progress: number) => void;
  setVideoReady: (ready: boolean) => void;
  markPreloaderComplete: () => void;
}

const PreloadContext = createContext<PreloadContextType>({
  videoProgress: 0,
  videoReady: false,
  isPreloaderComplete: false,
  setVideoProgress: () => {},
  setVideoReady: () => {},
  markPreloaderComplete: () => {},
});

export function PreloadProvider({ children }: { children: React.ReactNode }) {
  const [videoProgress, setProgress] = useState(0);
  const [videoReady, setReady] = useState(false);
  const [isPreloaderComplete, setIsComplete] = useState(false);

  const setVideoProgress = useCallback((val: number) => {
    setProgress((prev) => Math.max(prev, Math.min(100, Math.round(val))));
  }, []);

  const setVideoReady = useCallback((ready: boolean) => {
    setReady(ready);
    if (ready) setProgress(100);
  }, []);

  const markPreloaderComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  return (
    <PreloadContext.Provider
      value={{
        videoProgress,
        videoReady,
        isPreloaderComplete,
        setVideoProgress,
        setVideoReady,
        markPreloaderComplete,
      }}
    >
      {children}
    </PreloadContext.Provider>
  );
}

export const usePreload = () => useContext(PreloadContext);
