import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

// Antigravity floating shapes — soft, geometric, weightless
const FLOATING_SHAPES = [
  { type: "circle", x: 10, y: 20, size: 80, color: "rgba(244, 63, 94, 0.05)", duration: 16, delay: 0, drift: 1 },
  { type: "circle", x: 75, y: 15, size: 60, color: "rgba(236, 72, 153, 0.05)", duration: 20, delay: 2, drift: 2 },
  { type: "square", x: 85, y: 65, size: 40, color: "rgba(244, 63, 94, 0.04)", duration: 14, delay: 1, drift: 3 },
  { type: "circle", x: 20, y: 70, size: 50, color: "rgba(251, 113, 133, 0.04)", duration: 18, delay: 3, drift: 1 },
  { type: "square", x: 50, y: 10, size: 30, color: "rgba(244, 63, 94, 0.03)", duration: 22, delay: 4, drift: 2 },
  { type: "circle", x: 60, y: 80, size: 45, color: "rgba(236, 72, 153, 0.04)", duration: 15, delay: 1.5, drift: 3 },
];

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const controllerScrollRef = useRef<HTMLDivElement>(null);
  const headsetScrollRef = useRef<HTMLDivElement>(null);
  const keyboardScrollRef = useRef<HTMLDivElement>(null);

  const controllerMouseRef = useRef<HTMLDivElement>(null);
  const headsetMouseRef = useRef<HTMLDivElement>(null);
  const keyboardMouseRef = useRef<HTMLDivElement>(null);

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;

      gsap.to(controllerMouseRef.current, {
        x: x * 50,
        y: y * 50,
        duration: 1.8,
        ease: "power2.out",
      });

      gsap.to(headsetMouseRef.current, {
        x: -x * 65,
        y: -y * 65,
        duration: 2,
        ease: "power2.out",
      });

      gsap.to(keyboardMouseRef.current, {
        x: x * 35,
        y: -y * 35,
        duration: 1.6,
        ease: "power2.out",
      });

      // Floating shapes respond gently to cursor
      gsap.to(".antigrav-mouse-respond", {
        x: x * 15,
        y: y * 15,
        duration: 2.5,
        ease: "power1.out",
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  useGSAP(() => {
    // Morphing background clipPath
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });

    // Antigravity Scroll parallax — elements float upward as if weightless
    gsap.to(controllerScrollRef.current, {
      yPercent: -120,
      rotation: 30,
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(headsetScrollRef.current, {
      yPercent: -160,
      rotation: -25,
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(keyboardScrollRef.current, {
      yPercent: -90,
      rotation: 40,
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // === ENTRANCE ANIMATIONS — smooth, weightless ===

    // Title elegant fade-rise
    gsap.fromTo(
      ".hero-title-wrapper",
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.2 }
    );

    // Subtitle
    gsap.fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.6 }
    );

    // Scroll indicator
    gsap.fromTo(
      ".hero-scroll-indicator",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1 }
    );

    // Gaming elements float in gently
    gsap.fromTo(
      controllerScrollRef.current,
      { opacity: 0, y: 40, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out", delay: 0.4 }
    );

    gsap.fromTo(
      headsetScrollRef.current,
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out", delay: 0.6 }
    );

    gsap.fromTo(
      keyboardScrollRef.current,
      { opacity: 0, y: 35, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out", delay: 0.5 }
    );

    // Floating shapes fade in
    gsap.fromTo(
      ".antigrav-shape",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, stagger: 0.1, duration: 1.5, ease: "power2.out", delay: 0.3 }
    );
  });

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-dvh w-screen overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #fff5f6 0%, #ffffff 50%, #fff0f2 100%)" }}
    >
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #fff0f2 40%, #ffeef0 70%, #ffffff 100%)" }}
      >
        {/* Gradient orbs — soft background glow */}
        <div
          className="gradient-orb gradient-orb-animate"
          style={{
            width: "400px", height: "400px",
            top: "10%", right: "10%",
            background: "radial-gradient(circle, rgba(244, 63, 94, 0.06), transparent 70%)",
            ["--orb-dx" as string]: "40px", ["--orb-dy" as string]: "-50px",
            ["--orb-duration" as string]: "25s",
          }}
        />
        <div
          className="gradient-orb gradient-orb-animate"
          style={{
            width: "350px", height: "350px",
            bottom: "15%", left: "5%",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.05), transparent 70%)",
            ["--orb-dx" as string]: "-30px", ["--orb-dy" as string]: "35px",
            ["--orb-duration" as string]: "22s", ["--orb-delay" as string]: "3s",
          }}
        />

        {/* Antigravity floating shapes */}
        {FLOATING_SHAPES.map((shape, i) => (
          <div
            key={i}
            className={`antigrav-shape antigrav-shape-${shape.drift} antigrav-mouse-respond`}
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              borderRadius: shape.type === "circle" ? "50%" : "12px",
              background: shape.color,
              ["--ag-duration" as string]: `${shape.duration}s`,
              ["--ag-delay" as string]: `${shape.delay}s`,
              opacity: 0,
            }}
          />
        ))}

        {/* Floating Gaming Elements */}

        {/* 1. PS5 DualSense Controller */}
        <div
          ref={controllerScrollRef}
          className="absolute left-[8%] top-[25%] z-20 size-24 sm:size-32 md:size-40 lg:size-48 pointer-events-none"
        >
          <div
            ref={controllerMouseRef}
            className="animate-float-controller"
            style={{ filter: "drop-shadow(0 15px 30px rgba(244, 63, 94, 0.06))" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25,30 C35,28 65,28 75,30 C85,32 90,50 85,75 C83,82 72,82 65,72 C60,65 40,65 35,72 C28,82 17,82 15,75 C10,50 15,32 25,30 Z" fill="#fff9fa" stroke="#ffd1d7" strokeWidth="1.5" />
              <path d="M26,45 H32 M29,42 V48" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
              <circle cx="71" cy="42" r="2" fill="#fecdd3" />
              <circle cx="71" cy="48" r="2" fill="#fecdd3" />
              <circle cx="68" cy="45" r="2" fill="#fecdd3" />
              <circle cx="74" cy="45" r="2" fill="#fecdd3" />
              <circle cx="40" cy="55" r="7" fill="#fff5f6" stroke="#ffd1d7" strokeWidth="1" />
              <circle cx="60" cy="55" r="7" fill="#fff5f6" stroke="#ffd1d7" strokeWidth="1" />
              <path d="M43,35 H57" stroke="#ffd1d7" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* 2. Gaming Headset */}
        <div
          ref={headsetScrollRef}
          className="absolute left-[15%] bottom-[12%] z-20 size-20 sm:size-28 md:size-36 lg:size-44 pointer-events-none"
        >
          <div
            ref={headsetMouseRef}
            className="animate-float-headphones"
            style={{ filter: "drop-shadow(0 15px 30px rgba(236, 72, 153, 0.06))" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20,50 C20,25 80,25 80,50" stroke="#fff0f2" strokeWidth="4" strokeLinecap="round" />
              <path d="M18,50 C18,22 82,22 82,50" stroke="#fca5a5" strokeWidth="1" />
              <rect x="12" y="45" width="12" height="24" rx="6" fill="#fff9fa" stroke="#ffd1d7" strokeWidth="1.5" />
              <rect x="76" y="45" width="12" height="24" rx="6" fill="#fff9fa" stroke="#ffd1d7" strokeWidth="1.5" />
              <rect x="20" y="49" width="4" height="16" rx="2" fill="#fff5f6" />
              <rect x="76" y="49" width="4" height="16" rx="2" fill="#fff5f6" />
            </svg>
          </div>
        </div>

        {/* 3. Mechanical Keyboard */}
        <div
          ref={keyboardScrollRef}
          className="absolute right-[32%] top-[8%] z-20 size-28 sm:size-36 md:size-44 lg:size-52 pointer-events-none"
        >
          <div
            ref={keyboardMouseRef}
            className="animate-float-keyboard"
            style={{ filter: "drop-shadow(0 15px 30px rgba(244, 63, 94, 0.06))" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="30" width="80" height="40" rx="6" fill="#fff9fa" stroke="#ffd1d7" strokeWidth="1.5" />
              {/* Row 1 */}
              <rect x="16" y="36" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="26" y="36" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="36" y="36" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="46" y="36" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="56" y="36" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="66" y="36" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="76" y="36" width="8" height="6" rx="1.5" fill="#fda4af" stroke="#fda4af" strokeWidth="0.5" />
              {/* Row 2 */}
              <rect x="16" y="46" width="10" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="28" y="46" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="38" y="46" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="48" y="46" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="58" y="46" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="68" y="46" width="16" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              {/* Row 3 */}
              <rect x="16" y="56" width="12" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="30" y="56" width="36" height="6" rx="1.5" fill="#fda4af" stroke="#fda4af" strokeWidth="0.5" />
              <rect x="68" y="56" width="8" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
              <rect x="78" y="56" width="6" height="6" rx="1.5" fill="#fff5f6" stroke="#fecdd3" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        {/* Hero Text */}
        <div className="absolute top-0 left-0 z-40 size-full flex flex-col items-center justify-center md:items-end md:pr-8 sm:pr-16 md:pr-24 lg:pr-32">
          <div className="hero-title-wrapper" style={{ opacity: 0 }}>
            <h1 className="special-font hero-heading text-center md:text-right" style={{ color: "#2e1a20" }}>
              Crit<b>e</b>xan
            </h1>
          </div>

          <p className="hero-subtitle font-general text-xs md:text-sm uppercase tracking-[0.4em] mt-4 text-center md:text-right" style={{ color: "#fda4af", opacity: 0 }}>
            The Ultimate Gaming Platform
          </p>

          <div className="hero-scroll-indicator mt-10" style={{ opacity: 0 }}>
            <div className="flex flex-col items-center gap-2">
              <p className="font-general text-[9px] uppercase tracking-[0.5em]" style={{ color: "#fca5a5" }}>
                Scroll
              </p>
              <div className="w-px h-8 overflow-hidden">
                <div className="w-full h-full" style={{
                  background: "linear-gradient(180deg, #fecdd3, transparent)",
                  animation: "scrollPulse 2s ease-in-out infinite"
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  );
};
