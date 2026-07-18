import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { AnimatedTitle } from "./animated-title";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

export const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });

    // Logo blend animation — starts hidden, scales and fades in with blend
    gsap.fromTo(
      ".logo-blend-layer",
      { opacity: 0, scale: 1.2, filter: "blur(20px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#clip",
          start: "top 60%",
          end: "center center",
          scrub: true,
        },
      }
    );

    // Logo glow pulse on clip expand
    gsap.fromTo(
      ".logo-glow",
      { opacity: 0 },
      {
        opacity: 0.6,
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#clip",
          start: "center center",
          end: "+=400 center",
          scrub: true,
        },
      }
    );

    // Scroll-triggered text reveal
    gsap.utils.toArray<HTMLElement>(".about-reveal-text").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: i * 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Heading underline slide
    gsap.fromTo(
      ".about-heading-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-heading-line",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  return (
    <div id="about" className="min-h-screen w-screen bg-white">
      <div className="relative mt-36 mb-8 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px] tracking-[0.3em]" style={{ color: "#fda4af" }}>
          Welcome to Critexan
        </p>

        <AnimatedTitle containerClass="mt-5 !text-[#2e1a20] text-center">
          {"Ab<b>o</b>ut"}
        </AnimatedTitle>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image flex items-center justify-center overflow-hidden" style={{
          background: "transparent",
          border: "none",
        }}>
          {/* Animated glow behind logo */}
          <div className="logo-glow absolute inset-0 opacity-0" style={{
            background: "radial-gradient(circle at center, rgba(244, 63, 94, 0.08), transparent 70%)",
          }} />

          {/* Critexan Logo with blend animation */}
          <div className="logo-blend-layer relative z-10 flex items-center justify-center size-full">
            <img
              src="/img/critexan-logo.jpg"
              alt="Critexan Logo"
              className="w-[60%] max-w-[400px] h-auto object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        </div>
      </div>

      <div className="w-screen py-28 relative" style={{ background: "linear-gradient(180deg, #fffafb 0%, #ffffff 100%)" }}>
        {/* Subtle gradient orb */}
        <div
          className="gradient-orb gradient-orb-animate"
          style={{
            width: "300px", height: "300px",
            top: "-50px", right: "10%",
            background: "radial-gradient(circle, rgba(244, 63, 94, 0.04), transparent 70%)",
            ["--orb-dx" as string]: "20px", ["--orb-dy" as string]: "-30px",
            ["--orb-duration" as string]: "18s",
          }}
        />

        <div className="container mx-auto max-w-4xl px-8 flex flex-col gap-8 text-center md:text-left relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black font-ethnocentric mb-3 uppercase tracking-wider" style={{ color: "#2e1a20" }}>
              About CRITEXAN™
            </h2>
            <div className="about-heading-line h-[2px] w-24 mx-auto md:mx-0 origin-left" style={{
              background: "linear-gradient(90deg, #f43f5e, #fda4af)",
            }} />
          </div>
          <p className="about-reveal-text text-lg md:text-xl font-circular-web leading-relaxed" style={{ color: "#4c3b40" }}>
            CRITEXAN™ is an upcoming all-in-one gaming and creator platform built to bring the entire gaming ecosystem together in one place. Whether you're a gamer, content creator, esports enthusiast, or community leader, CRITEXAN™ is designed to help you watch gaming videos, discover shorts, livestream gameplay, participate in tournaments, build communities, chat with friends, showcase your profile, and grow your audience through a modern, high-performance platform.
          </p>
          <p className="about-reveal-text text-base font-circular-web leading-relaxed" style={{ color: "#8c7379" }}>
            Our vision is to eliminate the need for multiple apps by creating a single destination where gaming, content creation, esports, social interaction, and creator growth work seamlessly together. Every experience is designed with speed, simplicity, security, and a premium user experience in mind.
          </p>
          <p className="about-reveal-text text-base font-circular-web leading-relaxed" style={{ color: "#8c7379" }}>
            CRITEXAN™ is currently in development, with our team focused on building a platform that is reliable, scalable, and ready for the future of interactive digital entertainment.
          </p>
        </div>
      </div>
    </div>
  );
};
