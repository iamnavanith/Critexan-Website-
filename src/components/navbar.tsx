import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";
import { FaInstagram, FaYoutube } from "react-icons/fa";

import { NAV_ITEMS } from "@/constants";

export const Navbar = () => {
  const navContainerRef = useRef<HTMLDivElement>(null);

  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);

  const { y: currentScrollY } = useWindowScroll();

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <header
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <div className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <a href="#hero" className="transition-opacity duration-300 hover:opacity-60">
              <img src="/img/logo.svg" alt="Critexan Logo" className="w-10" />
            </a>
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:flex items-center">
              {NAV_ITEMS.map(({ label, href }) => (
                <a key={href} href={href} className="nav-hover-btn">
                  {label}
                </a>
              ))}
              <div className="h-4 w-px bg-rose-200/50 ms-8 me-4" />
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/critexan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:text-pink-500 hover:scale-110"
                  style={{ color: "#8c7379" }}
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="https://www.youtube.com/@critexan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:text-red-500 hover:scale-110"
                  style={{ color: "#8c7379" }}
                >
                  <FaYoutube size={16} />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
