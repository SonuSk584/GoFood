// src/animations/useLogoBikeAnimation.js
//
// The GoFood navbar logo has a small delivery bike riding under it,
// bouncing each letter as it passes underneath. This was a requestAnimationFrame
// loop written inline inside Home.jsx — pulled out here so any page that
// wants the same navbar effect can reuse it instead of re-writing the loop.
//
// Usage:
//   const { lettersRef, roadRef } = useLogoBikeAnimation({ letterCount: 6 });
//   ...
//   <div ref={roadRef} className="gf-road-dashes">
//     {letters.map((ch, i) => (
//       <span key={i} ref={el => (lettersRef.current[i] = el)} className="gf-letter">{ch}</span>
//     ))}
//   </div>

import { useEffect, useRef } from "react";

export function useLogoBikeAnimation({
  letterCount,
  duration = 3200,
  from = -20,
  to = 138,
}) {
  const lettersRef = useRef([]);
  const roadRef = useRef(null);
  const triggeredRef = useRef([]);
  const lastXRef = useRef(-999);
  const animStartRef = useRef(null);

  useEffect(() => {
    triggeredRef.current = new Array(letterCount).fill(false);

    function loop(ts) {
      if (!animStartRef.current) animStartRef.current = ts;
      const elapsed = (ts - animStartRef.current) % duration;
      const bikeX = from + (to - from) * (elapsed / duration);

      if (bikeX < lastXRef.current) {
        triggeredRef.current = new Array(letterCount).fill(false);
      }
      lastXRef.current = bikeX;

      const road = roadRef.current;
      if (road) {
        const roadRect = road.getBoundingClientRect();
        lettersRef.current.forEach((l, i) => {
          if (!l) return;
          const lr = l.getBoundingClientRect();
          const letterX = lr.left - roadRect.left + lr.width / 2;
          if (!triggeredRef.current[i] && bikeX >= letterX - 2) {
            triggeredRef.current[i] = true;
            l.classList.remove("bounce");
            void l.offsetWidth;
            l.classList.add("bounce");
            l.addEventListener("animationend", () => l.classList.remove("bounce"), { once: true });
          }
        });
      }

      requestAnimationFrame(loop);
    }

    const raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [letterCount, duration, from, to]);

  return { lettersRef, roadRef };
}