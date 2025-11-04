import { useEffect, useRef } from "react";

export const useReloadOncePerSession = (key = "pageReloaded") => {
  const hasReloaded = useRef(false);

  useEffect(() => {
    if (hasReloaded.current) return;
    hasReloaded.current = true;

    const alreadyReloaded = sessionStorage.getItem(key);

    if (!alreadyReloaded) {
      sessionStorage.setItem(key, "true");
      window.location.replace(window.location.href);
    } else {
      sessionStorage.removeItem(key);
    }
  }, [key]);
};
