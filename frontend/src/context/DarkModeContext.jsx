"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

export function DarkModeProvier({ children }) {
  // Start with false to avoid hydration mismatch
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read from localStorage or system preference
    const stored = localStorage.getItem("isDarkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialValue = stored ? JSON.parse(stored) : prefersDark;
    setIsDarkMode(initialValue);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode, mounted]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, mounted }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);

  if (context === undefined)
    throw new Error("DarkModeContext was used outside of DarkModeProvier");

  return context;
}
