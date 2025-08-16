"use client";
import { Theme } from "@radix-ui/themes";
import React, { createContext, ReactNode, useState } from "react";

export const ThemeContext = createContext<{
  isDark: boolean;
  setIsDark: ((value: boolean) => void) | null;
}>({
  isDark: true,
  setIsDark: null,
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  return (
    <div>
      <ThemeContext.Provider value={{ isDark, setIsDark }}>
        <Theme appearance={isDark ? "dark" : "light"}>{children}</Theme>
      </ThemeContext.Provider>
    </div>
  );
}

export default ThemeProvider;
