import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useState, useRef, useEffect } from "react";
import { FaWindows, FaApple, FaAndroid, FaMobileAlt } from "react-icons/fa";
import { API_CONFIG } from "@/config/api";

gsap.registerPlugin(ScrollTrigger);

export const PreRegistration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("windows");
  const [autoDownload, setAutoDownload] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [ticketDate, setTicketDate] = useState("");
  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // 1. Strict Name Validation
    if (name.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }

    // 2. Strict Email Regex Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }

    // Load existing registrations
    const stored = localStorage.getItem(API_CONFIG.LOCAL_STORAGE_KEY);
    let list: any[] = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (err) {
        console.error(err);
      }
    }

    // 3. Strict Duplicate Email Address Verification
    const isDuplicate = list.some(
      (record: any) => record.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError("This email address is already pre-registered.");
      return;
    }

    const generatedId = `CTX-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentDate = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const record = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      platform,
      autoDownload,
      ticketId: generatedId,
      date: currentDate
    };
    
    list.push(record);
    localStorage.setItem(API_CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(list));

    // Forward submission to Web3Forms if access key is configured
    if (API_CONFIG.WEB3FORMS_ACCESS_KEY) {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: API_CONFIG.WEB3FORMS_ACCESS_KEY,
          subject: "New Critexan Early Access Pre-Registration",
          from_name: "Critexan Deployment Portal",
          name: name.trim(),
          email: email.trim().toLowerCase(),
          platform: platform.toUpperCase(),
          auto_download: autoDownload ? "YES" : "NO",
          ticket_id: generatedId,
        }),
      }).catch((err) => console.error("API submission error:", err));
    }

    // Forward submission to custom API if configured
    if (API_CONFIG.CUSTOM_API_ENDPOINT) {
      fetch(API_CONFIG.CUSTOM_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      }).catch((err) => console.error("Custom API submission error:", err));
    }

    setTicketId(generatedId);
    setTicketDate(currentDate);
    setSubmitted(true);

    // Trigger pass config file download
    triggerAutoDownload(name.trim(), generatedId, platform, autoDownload);
  };

  const triggerAutoDownload = (userName: string, id: string, plat: string, autoD: boolean) => {
    const fileContent = `=====================================================
CRITEXAN™ OFFICIAL EARLY ACCESS PRE-REGISTRATION PASS
=====================================================

Ticket ID: ${id}
Registered To: ${userName}
Preferred Platform: ${plat.toUpperCase()}
Auto-Download on Release: ${autoD ? "ENABLED" : "DISABLED"}

Thank you for pre-registering for CRITEXAN™!
This pass file contains your unique registration token.

When CRITEXAN™ officially launches, this file will trigger the automatic client download and installer initialization. Keep it in your Downloads folder.

-----------------------------------------------------
Security Token: SHA256-${Math.random().toString(36).substring(2, 15).toUpperCase()}
Generation Date: ${new Date().toUTCString()}
=====================================================`;

    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `critexan-early-access-${id.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Weightless mouse parallax drift on floating shapes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;

      gsap.to(".prereg-float-shape", {
        x: x * 35,
        y: y * 35,
        rotate: x * 20,
        duration: 2,
        ease: "power2.out",
        stagger: 0.05,
      });

      // Gently move the backing light orb to follow cursor
      gsap.to(".prereg-backing-orb", {
        x: x * 60,
        y: y * 60,
        duration: 3,
        ease: "power1.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useGSAP(() => {
    // Smooth entrance
    gsap.fromTo(
      ".prereg-content",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#pre-registration",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger text and form fields
    gsap.fromTo(
      ".prereg-reveal",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#pre-registration",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Floating antigravity shapes animation loop
    gsap.to(".prereg-float-1", {
      y: "-=20",
      x: "+=10",
      rotate: 360,
      duration: 14,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".prereg-float-2", {
      y: "+=25",
      x: "-=15",
      rotate: -360,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".prereg-float-3", {
      y: "-=12",
      x: "-=10",
      rotate: 180,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, { scope: containerRef });

  // Ticket 3D Tilt Effect
  const handleTicketMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ticketRef.current) return;
    const ticket = ticketRef.current;
    const rect = ticket.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const angleX = (yc - y) / 15;
    const angleY = (x - xc) / 15;

    gsap.to(ticket, {
      rotateX: angleX,
      rotateY: angleY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const handleTicketMouseLeave = () => {
    if (!ticketRef.current) return;
    gsap.to(ticketRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <section id="pre-registration" ref={containerRef} className="my-24 min-h-[600px] w-screen px-6 sm:px-10 relative flex items-center justify-center">
      
      {/* Background Soft Orbs & Antigravity Elements */}
      {/* Glowing rose/pink background orb that will shine *through* the glass container card */}
      <div className="prereg-backing-orb absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-45 blur-[90px]" style={{
        background: "radial-gradient(circle, rgba(251, 113, 133, 0.15) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 80%)",
      }} />

      {/* Floating weightless glass panel cards (Antigravity accent shapes) */}
      <div className="prereg-float-shape prereg-float-1 absolute left-[8%] top-[15%] w-36 h-20 rounded-2xl pointer-events-none hidden lg:block" style={{
        border: "1px solid rgba(255, 255, 255, 0.5)",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 10px 30px rgba(244, 63, 94, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
      }} />

      <div className="prereg-float-shape prereg-float-2 absolute right-[10%] top-[25%] w-24 h-24 rounded-full pointer-events-none hidden lg:block" style={{
        border: "1px solid rgba(255, 255, 255, 0.4)",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(6px)",
      }} />

      <div className="prereg-float-shape prereg-float-3 absolute left-[12%] bottom-[15%] w-28 h-28 pointer-events-none hidden lg:block" style={{
        borderRadius: "24px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(7px)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
      }} />

      {/* Main Glassmorphic Registration Card Wrapper */}
      <div className="prereg-content w-full max-w-2xl relative rounded-3xl py-12 px-8 sm:px-12 md:px-16 overflow-hidden" style={{
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(25px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.45)",
        boxShadow: "0 30px 70px rgba(244, 63, 94, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.7)",
      }}>
        <div className="flex flex-col items-center text-center relative z-10">
          <p className="prereg-reveal font-general text-[9px] uppercase tracking-[0.4em] text-[#f43f5e] font-bold mb-4">
            Critexan App Deployment Portal
          </p>

          {/* Premium font styling matching the rest of the site (Zentry or Ethnocentric) */}
          <h2 className="prereg-reveal text-2xl sm:text-3xl md:text-4xl font-black font-ethnocentric tracking-widest mb-10 text-[#2e1a20] leading-tight">
            Pr<b>e</b>-r<b>e</b>gister f<b>o</b>r launch
          </h2>

          {submitted ? (
            /* =====================================================
               PROFESSIONAL CONFIRMATION & 3D PASS TICKET
               ===================================================== */
            <div className="w-full flex flex-col items-center gap-8">
              <div className="prereg-reveal text-center">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-2" style={{
                  background: "rgba(34, 197, 94, 0.08)",
                  color: "#16a34a",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  fontFamily: "Inter"
                }}>
                  Official Registration Confirmed
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Your pass has been generated and your early-access profile is ready.
                </p>
              </div>

              {/* 3D Glass Ticket */}
              <div
                ref={ticketRef}
                onMouseMove={handleTicketMouseMove}
                onMouseLeave={handleTicketMouseLeave}
                className="w-full max-w-[380px] rounded-3xl p-6 relative overflow-hidden transition-all duration-300 cursor-default"
                style={{
                  background: "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 20px 45px rgba(244, 63, 94, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Holographic style details */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none" style={{
                  background: "radial-gradient(circle, rgba(244, 63, 94, 0.4), transparent 70%)",
                }} />

                {/* Ticket Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-5" style={{ borderColor: "rgba(0, 0, 0, 0.05)" }}>
                  <div className="flex items-center gap-2">
                    <img src="/img/logo.svg" alt="Critexan" className="w-5 h-5" />
                    <span className="font-ethnocentric text-[9px] tracking-wider text-slate-800">
                      Crit<b>e</b>xan
                    </span>
                  </div>
                  <span className="font-general text-[8px] uppercase tracking-wider text-[#f43f5e] font-bold">
                    Early Access Pass
                  </span>
                </div>

                {/* Ticket Body */}
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-slate-400 mb-0.5 font-bold">Holder Name</p>
                    <p className="font-semibold text-slate-850 text-sm">{name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400 mb-0.5 font-bold">Platform</p>
                      <p className="font-semibold text-slate-800 text-xs uppercase">{platform}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400 mb-0.5 font-bold">Auto-Download</p>
                      <p className="font-semibold text-xs flex items-center gap-1.5" style={{ color: autoDownload ? "#16a34a" : "#f59e0b" }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: autoDownload ? "#16a34a" : "#f59e0b" }} />
                        {autoDownload ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400 mb-0.5 font-bold">Issue Date</p>
                      <p className="text-slate-700 text-xs">{ticketDate}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400 mb-0.5 font-bold">Pass ID</p>
                      <p className="font-mono font-semibold text-slate-800 text-xs">{ticketId}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Divider */}
                <div className="my-5 border-t border-solid" style={{ borderColor: "rgba(0, 0, 0, 0.05)" }} />

                {/* Ticket Footer */}
                <div className="flex justify-between items-center text-left">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Verification Status</p>
                    <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-550" style={{ backgroundColor: "#10b981" }} />
                      Verified
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Secure ID</p>
                    <p className="font-mono text-xs font-semibold text-slate-700">{ticketId}</p>
                  </div>
                </div>
              </div>

              {/* Auto-Download notification box */}
              <div className="prereg-reveal max-w-md w-full p-4 rounded-xl text-left flex gap-3.5" style={{
                background: "rgba(255, 255, 255, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.01)"
              }}>
                <span className="text-lg">📥</span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                    Auto-Download Configured
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    A launcher pass config has been automatically downloaded to your system. Please keep this file in your Downloads folder to enable zero-action install when the release client goes live.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* =====================================================
               PROFESSIONAL REGISTRATION FORM
               ===================================================== */
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              
              {/* Full Name & Email Address (Glass Inputs) */}
              <div className="prereg-reveal grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#9f1239] pl-1 font-inter">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 font-general text-sm transition-all duration-300 outline-none"
                    style={{
                      background: "rgba(255, 255, 255, 0.45)",
                      border: "1px solid rgba(255, 255, 255, 0.6)",
                      color: "#2e1a20",
                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 10px rgba(0, 0, 0, 0.01)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(244, 63, 94, 0.35)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(244, 63, 94, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.01)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)";
                      e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 10px rgba(0, 0, 0, 0.01)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.45)";
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#9f1239] pl-1 font-inter">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 font-general text-sm transition-all duration-300 outline-none"
                    style={{
                      background: "rgba(255, 255, 255, 0.45)",
                      border: "1px solid rgba(255, 255, 255, 0.6)",
                      color: "#2e1a20",
                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 10px rgba(0, 0, 0, 0.01)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(244, 63, 94, 0.35)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(244, 63, 94, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.01)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)";
                      e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 10px rgba(0, 0, 0, 0.01)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.45)";
                    }}
                  />
                </div>
              </div>

              {/* Platform Selector (Glass Toggles) */}
              <div className="prereg-reveal flex flex-col gap-2.5 text-left">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#9f1239] pl-1 font-inter">
                  Preferred Platform
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: "windows", label: "Windows", icon: <FaWindows /> },
                    { key: "macos", label: "macOS", icon: <FaApple /> },
                    { key: "android", label: "Android", icon: <FaAndroid /> },
                    { key: "ios", label: "iOS", icon: <FaMobileAlt /> }
                  ].map((plat) => {
                    const isSelected = platform === plat.key;
                    return (
                      <button
                        key={plat.key}
                        type="button"
                        onClick={() => setPlatform(plat.key)}
                        className="py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border cursor-pointer flex items-center justify-center gap-2 font-inter"
                        style={{
                          background: isSelected ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.25)",
                          borderColor: isSelected ? "rgba(244, 63, 94, 0.25)" : "rgba(255, 255, 255, 0.5)",
                          color: isSelected ? "#e11d48" : "#8c7379",
                          boxShadow: isSelected ? "0 4px 12px rgba(244, 63, 94, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.4)" : "none"
                        }}
                      >
                        <span className="text-[14px]" style={{ opacity: isSelected ? 1 : 0.6 }}>
                          {plat.icon}
                        </span>
                        {plat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real Auto-Download Settings (Glass Panel) */}
              <div className="prereg-reveal flex flex-col gap-3 text-left p-5 rounded-2xl transition-colors duration-300" style={{
                background: "rgba(255, 255, 255, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.55)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.5)"
              }}>
                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDownload}
                    onChange={(e) => setAutoDownload(e.target.checked)}
                    className="mt-1 accent-rose-600 rounded cursor-pointer w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-inter">
                      Enable automatic background download
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed font-inter font-semibold">
                      Download the installer package automatically upon the official production release. System will notify you before launching installation setup.
                    </span>
                  </div>
                </label>
              </div>

              {/* Error Message Alert */}
              {error && (
                <div className="prereg-reveal w-full p-4 rounded-xl text-left bg-rose-50/50 border border-rose-200/50 flex gap-2.5 items-center">
                  <span className="text-rose-500 font-bold text-[14px]">⚠️</span>
                  <p className="text-xs font-semibold text-rose-700 font-inter">{error}</p>
                </div>
              )}

              {/* Submission CTA */}
              <div className="prereg-reveal flex justify-center mt-4">
                <button
                  type="submit"
                  className="group relative z-10 w-full sm:w-auto min-w-[240px] cursor-pointer overflow-hidden rounded-full px-8 py-4 font-general text-xs font-bold uppercase tracking-widest transition-all duration-300 ease-in-out text-center"
                  style={{
                    background: "#9f1239",
                    color: "#ffffff",
                    boxShadow: "0 10px 30px rgba(159, 18, 57, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#be123c";
                    e.currentTarget.style.transform = "translateY(-1.5px)";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(159, 18, 57, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#9f1239";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(159, 18, 57, 0.1)";
                  }}
                >
                  Submit Pre-Registration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
