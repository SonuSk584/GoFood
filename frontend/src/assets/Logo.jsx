import { useEffect, useRef } from "react";

function BurgerO() {
  return (
    <div className="gf-burger-o" title="O" style={{
      width: 68, height: 68, position: "relative",
      display: "inline-flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0, cursor: "pointer",
    }}>
      <div className="gf-bun-top" />
      <div className="gf-lettuce" />
      <div className="gf-tomato" />
      <div className="gf-patty" />
      <div className="gf-cheese" />
      <div className="gf-bun-bottom" />
    </div>
  );
}

function Road() {
  const roadRef     = useRef(null);
  const bikeRef     = useRef(null);
  const bikeIconRef = useRef(null);
  const rafRef      = useRef(null);

  useEffect(() => {
    const BIKE_W = 28;
    const MARGIN = 4;
    const SPEED  = 1.4;
    let   bikeX  = MARGIN;
    let   dir    = 1;

    function tick() {
      const road = roadRef.current;
      const bike = bikeRef.current;
      const icon = bikeIconRef.current;
      if (!road || !bike) { rafRef.current = requestAnimationFrame(tick); return; }

      const maxX = road.offsetWidth - BIKE_W - MARGIN;
      bikeX += SPEED * dir;

      if (bikeX >= maxX) {
        bikeX = maxX; dir = -1;
        if (icon) icon.style.transform = "scaleX(-1)";
      } else if (bikeX <= MARGIN) {
        bikeX = MARGIN; dir = 1;
        if (icon) icon.style.transform = "scaleX(1)";
      }

      bike.style.left = bikeX + "px";
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ width: 320, maxWidth: "88vw" }}>
      <div ref={roadRef} style={{
        height: 10, background: "#6F4E37",
        borderRadius: 5, position: "relative", overflow: "visible",
      }}>
        {/* Scrolling dashes */}
        <div style={{
          position: "absolute", top: "50%", transform: "translateY(-50%)",
          left: 0, right: 0, height: 2,
          background: "repeating-linear-gradient(to right, #D4A373 0px, #D4A373 10px, transparent 10px, transparent 20px)",
          animation: "gfDashMove 0.8s linear infinite",
          borderRadius: 2,
        }} />
        {/* Top edge highlight */}
        <div style={{
          position: "absolute", top: 1, left: 0, right: 0, height: 2,
          background: "rgba(212,163,115,0.3)", borderRadius: 2,
        }} />
        {/* Bike */}
        <div ref={bikeRef} style={{
          position: "absolute", bottom: 7, left: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <span ref={bikeIconRef} style={{
            fontSize: 24, lineHeight: 1, display: "block",
            transition: "transform 0.2s ease",
          }}>🛵</span>
          <div style={{
            width: 22, height: 4,
            background: "rgba(111,78,55,0.25)",
            borderRadius: "50%", marginTop: 1,
          }} />
        </div>
      </div>
    </div>
  );
}

export default function GoFoodLogo() {
  const letters = [
    // { char: "G", delay: "0s"    },
    { char: "F", delay: "0.08s" },
    { char: "o", delay: "0.16s" },
    { char: "o", delay: "0.24s" },
    { char: "d", delay: "0.32s" },
  ];

  return (
    <>
      <style>{`
        @keyframes gfLetterBounce {
          0%, 60%, 100% { transform: translateY(0) scaleX(1) scaleY(1); }
          30%  { transform: translateY(-18px) scaleX(0.92) scaleY(1.08); }
          45%  { transform: translateY(-6px) scaleX(1.04) scaleY(0.96); }
          52%  { transform: translateY(-10px) scaleX(0.96) scaleY(1.04); }
        }
        @keyframes gfBunBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%  { transform: translateY(-18px) rotate(-2deg); }
          45%  { transform: translateY(-6px); }
          52%  { transform: translateY(-10px); }
        }
        @keyframes gfDashMove {
          from { background-position: 0 0; }
          to   { background-position: 20px 0; }
        }
        .gf-logo-letter {
          font-size: 64px; font-weight: 700; color: #ffffff;
          display: inline-block; line-height: 1;
          -webkit-text-stroke: 2px #5A3D28;
          text-shadow: 3px 3px 0px #D4A373;
          animation: gfLetterBounce 2.4s ease-in-out infinite;
          font-family: Georgia, serif;
        }
        .gf-burger-o:hover .gf-bun-top    { transform: translateY(-10px) rotate(-6deg) !important; }
        .gf-burger-o:hover .gf-bun-bottom { transform: translateY(10px)  rotate(4deg)  !important; }
        .gf-bun-top {
          position: absolute; top: 0; left: 0; right: 0; height: 26px;
          background: #D4A373; border-radius: 50px 50px 8px 8px;
          border: 2px solid #5A3D28; z-index: 4; overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          animation: gfBunBounce 2.4s ease-in-out infinite; animation-delay: 0.1s;
        }
        .gf-bun-top::before {
          content: ''; position: absolute; top: 5px; left: 12px;
          width: 6px; height: 4px; background: #C49A5A; border-radius: 50%;
          box-shadow: 10px 2px 0 #C49A5A, 20px -1px 0 #C49A5A, 32px 2px 0 #C49A5A;
        }
        .gf-bun-top::after {
          content: ''; position: absolute; top: 4px; left: 8px;
          width: 20px; height: 6px; background: rgba(255,255,255,0.28);
          border-radius: 50%; transform: rotate(-10deg);
        }
        .gf-lettuce {
          position: absolute; top: 20px; left: -3px; right: -3px; height: 10px;
          background: #52B788; border-radius: 6px; border: 1.5px solid #2D6A4F; z-index: 3;
          animation: gfBunBounce 2.4s ease-in-out infinite; animation-delay: 0.05s;
        }
        .gf-lettuce::before {
          content: ''; position: absolute; top: -3px; left: 0; right: 0; height: 6px;
          background: #40916C; border-radius: 50%;
          clip-path: polygon(0% 100%,5% 0%,15% 80%,25% 0%,35% 80%,45% 0%,55% 80%,65% 0%,75% 80%,85% 0%,95% 80%,100% 0%,100% 100%);
        }
        .gf-tomato {
          position: absolute; top: 27px; left: 4px; right: 4px; height: 8px;
          background: #E63946; border-radius: 4px; border: 1.5px solid #C1121F; z-index: 2;
          animation: gfBunBounce 2.4s ease-in-out infinite; animation-delay: 0.02s;
        }
        .gf-patty {
          position: absolute; top: 30px; left: 2px; right: 2px; height: 12px;
          background: #8B4513; border-radius: 4px; border: 2px solid #5A2D0C; z-index: 1;
          animation: gfBunBounce 2.4s ease-in-out infinite; animation-delay: 0s;
        }
        .gf-patty::after {
          content: ''; position: absolute; top: 2px; left: 4px; right: 4px; height: 2px;
          background: rgba(255,255,255,0.12); border-radius: 2px;
        }
        .gf-cheese {
          position: absolute; top: 36px; left: 0; right: 0; height: 7px;
          background: #F4A623; border-radius: 3px; border: 1.5px solid #D4820A; z-index: 2;
          animation: gfBunBounce 2.4s ease-in-out infinite; animation-delay: -0.02s;
        }
        .gf-cheese::after {
          content: ''; position: absolute; bottom: -5px; left: 4px;
          width: 10px; height: 5px; background: #F4A623;
          clip-path: polygon(0 0,100% 0,50% 100%);
        }
        .gf-bun-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 18px;
          background: #C49A5A; border-radius: 8px 8px 50px 50px;
          border: 2px solid #5A3D28; z-index: 0;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          animation: gfBunBounce 2.4s ease-in-out infinite; animation-delay: -0.05s;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "Georgia, serif" }}>

        {/* Word */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 14 }}>
          <span className="gf-logo-letter" style={{ animationDelay: "0s" }}>G</span>
          <BurgerO />
          {letters.map(({ char, delay }) => (
            <span key={char + delay} className="gf-logo-letter" style={{ animationDelay: delay }}>
              {char}
            </span>
          ))}
        </div>

        {/* Road */}
        <Road />
      </div>
    </>
  );
}
