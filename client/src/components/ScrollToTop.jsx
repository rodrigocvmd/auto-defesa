import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTarget = () => {
      const infoWarning = document.getElementById("infoWarning");
      if (infoWarning) {
        window.scrollTo(0, infoWarning.offsetHeight);
      } else {
        window.scrollTo(0, 0);
      }
    };

    // Use a small delay to ensure the DOM has updated and layout is calculated
    const timer = setTimeout(scrollToTarget, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
