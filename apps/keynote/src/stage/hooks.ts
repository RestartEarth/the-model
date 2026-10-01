import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return reduced;
}

export function useAudienceMode(): boolean {
  const [audience, setAudience] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const file = window.location.pathname;
    if (params.get("presenter") === "1" || /presenter\.html$/i.test(file)) {
      setAudience(false);
      return;
    }
    if (params.get("audience") === "1" || /audience\.html$/i.test(file)) {
      setAudience(true);
      return;
    }
    setAudience(import.meta.env.VITE_PACK === "1");
  }, []);
  return audience;
}
