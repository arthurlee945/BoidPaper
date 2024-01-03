import { useEffect, useState } from "react";

//! REFACTOR THIS IMPORTED OLD CODE
export const useViewPortTracker = ({ mobile = 576, tablet = 1024 }: { mobile: number; tablet: number }) => {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    let prevWidth: number | undefined;
    const handleVPTrack = () => {
      const currentWidth = window.innerWidth;
      if (
        prevWidth &&
        ((currentWidth > tablet && prevWidth > tablet) ||
          (currentWidth <= tablet && currentWidth > mobile && prevWidth <= tablet && prevWidth > mobile) ||
          (currentWidth <= mobile && prevWidth <= mobile))
      )
        return;
      if (currentWidth > tablet) {
        setViewport("desktop");
      } else if (currentWidth > mobile && tablet >= currentWidth) {
        setViewport("tablet");
      } else {
        setViewport("mobile");
      }
      prevWidth = currentWidth;
    };
    window.addEventListener("resize", handleVPTrack);
    window.dispatchEvent(new Event("resize"));
    return () => {
      window.removeEventListener("resize", handleVPTrack);
    };
  }, [mobile, tablet]);

  return viewport;
};
