import { useState } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

interface FooterProps {
  onAdminTrigger?: () => void;
}

export const Footer = ({ onAdminTrigger }: FooterProps) => {
  const [clickCount, setClickCount] = useState(0);

  const handleAdminClick = () => {
    if (!onAdminTrigger) return;
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    // Trigger on 5 clicks
    if (newCount >= 5) {
      onAdminTrigger();
      setClickCount(0);
    }
    
    // Reset click count after 3 seconds of inactivity
    setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  return (
    <footer className="w-screen py-8 relative" style={{
      background: "#fffafb",
      borderTop: "1px solid rgba(244, 63, 94, 0.05)",
    }}>
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-8 md:flex-row">
        {/* Copyright */}
        <p className="text-center text-sm md:text-left text-slate-500 order-2 md:order-1 select-none">
          &copy;{" "}
          <strong
            className="font-semibold cursor-pointer active:scale-95 transition-transform"
            style={{ color: "#2e1a20" }}
            onClick={handleAdminClick}
            title="Critexan Official"
          >
            Critexan
          </strong>{" "}
          {new Date().getFullYear()}. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-4 order-1 md:order-2">
          <a
            href="https://www.instagram.com/critexan/"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow Critexan on Instagram"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-100 hover:border-pink-200 hover:bg-pink-50/50"
            style={{ color: "#8c7379" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#db2777"; // Instagram Pink/Rose accent
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(219, 39, 119, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8c7379";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FaInstagram size={18} />
          </a>

          <a
            href="https://www.youtube.com/@critexan"
            target="_blank"
            rel="noopener noreferrer"
            title="Subscribe to Critexan on YouTube"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-100 hover:border-red-200 hover:bg-red-50/50"
            style={{ color: "#8c7379" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#dc2626"; // YouTube Red accent
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8c7379";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FaYoutube size={18} />
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-2 order-3">
          <a
            href="#"
            className="text-center text-sm transition-colors duration-300 hover:underline md:text-right text-slate-500"
            style={{ color: "#8c7379" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f43f5e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#8c7379"; }}
          >
            Privacy Policy
          </a>

          <b style={{ color: "#ffd1d7" }}>|</b>

          <a
            href="#"
            className="text-center text-sm transition-colors duration-300 hover:underline md:text-right text-slate-500"
            style={{ color: "#8c7379" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f43f5e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#8c7379"; }}
          >
            Terms &amp; Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};
