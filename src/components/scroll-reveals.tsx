import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function ScrollReveals() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.remove("reveal-pending"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll("[data-scroll-reveal]").forEach((element) => { element.classList.add("reveal-pending"); observer.observe(element); });
    return () => { observer.disconnect(); document.querySelectorAll(".reveal-pending").forEach((element) => element.classList.remove("reveal-pending")); };
  }, [path]);
  return null;
}