"use client";

import { useEffect } from "react";

export default function SetMainOverflow() {
  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement;
    if (main) {
      main.style.overflow = "hidden";
    }
    return () => {
      if (main) {
        main.style.overflow = "";
      }
    };
  }, []);

  return null;
}