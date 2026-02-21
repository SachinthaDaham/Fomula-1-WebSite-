/**
 * app/page.js — "Absolute Pro" F1 Manager Landing Page (Cinematic Edition)
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play, Trophy, Users, MonitorSmartphone } from "lucide-react";
import Footer from "./components/Footer";
import { DriversMegaMenu, TeamsMegaMenu } from "./components/MegaMenus";

// ─── Constants ────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { pos: "P1", name: "VER", time: "+0.000", team: "Red Bull" },
  { pos: "P2", name: "LEC", time: "+1.243", team: "Ferrari" },
  { pos: "P3", name: "HAM", time: "+2.817", team: "Ferrari" },
  { pos: "P4", name: "NOR", time: "+3.594", team: "McLaren" },
  { pos: "P5", name: "RUS", time: "+4.120", team: "Mercedes" },
  { pos: "P6", name: "PIA", time: "+5.672", team: "McLaren" },
  { pos: "P7", name: "ALO", time: "+7.890", team: "Aston Martin" },
  { pos: "P8", name: "SAI", time: "+9.001", team: "Williams" },
  { pos: "P9", name: "TSU", time: "+11.340", team: "RB" },
  { pos: "P10", name: "ALB", time: "+12.809", team: "Williams" },
];

const FIA_LINKS = ["AUTHENTICS", "STORE", "TICKETS", "HOSPITALITY", "EXPERIENCES"];

const NAV_ITEMS = [
  { name: "RESULTS", href: "/dashboard?tab=intelligence", megaMenu: null },
  { name: "NEWS", href: "/dashboard?tab=editorial", megaMenu: null },
  { name: "DRIVERS", href: "/dashboard?tab=paddock", megaMenu: "drivers" },
  { name: "TEAMS", href: "/dashboard?tab=paddock", megaMenu: "teams" },
];

const FEATURED_NEWS = [
  {
    id: 1, category: "INTEL", title: "Hamilton's Ferrari Debut: Maranello Prepares",
    href: "/dashboard?tab=editorial",
    imageUrl: "/images/drivers/hamilton-cover.jpg",
  },
  {
    id: 2, category: "LIVE", title: "Max Verstappen: Dominance Continues in 2025?",
    href: "/dashboard?tab=intelligence",
    imageUrl: "/images/drivers/verstappen-cover.jpg",
  },
  {
    id: 3, category: "TECH", title: "Newey's Aston Martin: The Technical Shift",
    href: "/dashboard?tab=paddock",
    imageUrl: "/images/drivers/alonso-cover.jpg",
  },
];

const HERO_IMG = "https://cdn-media.theathletic.com/cdn-cgi/image/width=1200%2Cquality=75%2Cformat=auto/https://cdn-media.theathletic.com/yrzOgqAxDUmx_UJNVKigS3tyR_1440x810.jpeg";

// ─── Animation Variants ────────────────────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70, damping: 20 } }
};

// ─── Main Home Page ───────────────────────────────────────────────────────────
export default function Home() {
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Mouse tracking for parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setUser(res.data);
        }
      })
      .catch(err => console.error("Session check failed", err));

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="absolute-pro-layout">
      {/* Background FX */}
      <div className="fluid-bg" />
      <div className="scanline" />
      <div className="noise-overlay" />

      {/* ── FIA Official Top Bar ──────────────────────────────────────────── */}
      <div className="fia-bar">
        {FIA_LINKS.map(link => (
          <a key={link} href="#" className="fia-link">{link}</a>
        ))}
        <span className="fia-badge">FIA</span>
      </div>

      {/* ── Header + Mega Menus ───────────────────────────────────────────── */}
      <header
        style={{ position: "sticky", top: 0, zIndex: 1000 }}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <nav className="navbar" style={{ background: "var(--glass-panel)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border-glass)" }}>
          <div className="container navbar-inner">

            {/* Brand */}
            <Link href="/" className="nav-brand">
              <span className="nav-brand-f1">F1</span>
              <span className="nav-brand-text">MANAGER</span>
            </Link>

            {/* Nav Links */}
            <div className="nav-links">
              {NAV_ITEMS.map(item =>
                item.megaMenu ? (
                  <button
                    key={item.name}
                    className={`nav-link-pro${activeMegaMenu === item.megaMenu ? " active" : ""}`}
                    onMouseEnter={() => setActiveMegaMenu(item.megaMenu)}
                    style={{ fontWeight: 700 }}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="nav-link-pro"
                    onMouseEnter={() => setActiveMegaMenu(null)}
                    style={{ fontWeight: 700 }}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* Auth CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="michroma" style={{ fontSize: '0.45rem', opacity: 0.5, letterSpacing: '1px' }}>{user.role?.toUpperCase()}_IDENT</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px', color: '#fff' }}>{user.name}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="michroma"
                    style={{
                      background: 'rgba(225,6,0,0.1)',
                      border: '1px solid rgba(225,6,0,0.3)',
                      color: 'var(--f1-red)',
                      fontSize: '0.45rem',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      letterSpacing: '1px',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--f1-red)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(225,6,0,0.1)'; e.currentTarget.style.color = 'var(--f1-red)'; }}
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="nav-link-pro michroma" style={{ fontWeight: 700, fontSize: "0.6rem", letterSpacing: "1.5px" }}>
                    SIGN_IN
                  </Link>
                  <Link href="/register" className="nav-cta michroma" style={{ boxShadow: '0 0 20px rgba(225,6,0,0.2)' }}>
                    REGISTER
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Mega Menus */}
        <DriversMegaMenu active={activeMegaMenu === "drivers"} onClose={() => setActiveMegaMenu(null)} />
        <TeamsMegaMenu active={activeMegaMenu === "teams"} onClose={() => setActiveMegaMenu(null)} />
      </header>

      {/* ── HUD Data Ticker ───────────────────────────────────────────────── */}
      <div className="ticker-wrapper" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: "rgba(0,0,0,0.8)" }}>
        <div className="ticker-content">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker-item">
              <span className="t-pos">{item.pos}</span>
              <span className="t-sep">·</span>
              <span className="t-name">{item.name}</span>
              <span className="t-sep">—</span>
              <span style={{ color: "var(--telemetry-cyan)" }}>{item.time}</span>
              <span className="t-sep">|</span>
              <span style={{ opacity: 0.5 }}>{item.team}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>

        {/* Live Session Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="magnetic-glass-panel"
          style={{
            display: "flex", alignItems: "center", gap: "1.5rem",
            borderLeft: "3px solid var(--f1-red)",
            padding: "0.9rem 1.5rem",
            marginBottom: "2.5rem",
          }}>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="live-dot"
          />
          <span className="michroma" style={{ fontSize: "0.55rem", color: "var(--f1-red)", letterSpacing: "3px" }}>
            LIVE: BAHRAIN PRE-SEASON TESTING — DAY 2
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: "2.5rem" }}>
            {[["SESSION", "FP1", MonitorSmartphone], ["TRACK", "SAKHIR", Trophy], ["TEMP", "28°C"], ["TIME", "14:09:33"]].map(([l, v, Icon]) => (
              <div key={l} className="stat-readout" style={{ gap: "4px", display: "flex", alignItems: "center" }}>
                {Icon && <Icon size={12} strokeWidth={1.5} color="var(--telemetry-cyan)" style={{ opacity: 0.7 }} />}
                <div>
                  <div className="label" style={{ fontSize: "0.45rem", letterSpacing: "1px" }}>{l}</div>
                  <div style={{ fontSize: "0.8rem", fontFamily: "Michroma, sans-serif", color: "var(--text-main)" }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bento Hero Grid ───────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="dash-grid-absolute"
        >

          {/* Hero Spotlight — col-8 */}
          <motion.div
            variants={fadeUp}
            className="col-8 magnetic-glass-panel"
            style={{
              position: "relative",
              overflow: "hidden",
              height: "660px",
              padding: 0 // Remove default glass panel padding so image flush hits edges
            }}
          >
            {/* Background Image with subtle mouse parallax */}
            <motion.img
              src={HERO_IMG}
              alt="F1 Season"
              className="hero-hud-bg"
              animate={{
                x: mousePos.x * -20,
                y: mousePos.y * -20,
                scale: 1.05
              }}
              transition={{ type: "tween", ease: "linear", duration: 0.2 }}
              style={{ width: "105%", height: "105%", objectFit: "cover", position: "absolute", top: "-2.5%", left: "-2.5%", zIndex: 0 }}
            />

            {/* Gradient Overlay */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(to right, rgba(2,4,8,0.98) 0%, rgba(2,4,8,0.4) 60%, transparent 100%), linear-gradient(to top, rgba(2,4,8,0.9) 0%, transparent 40%)",
            }} />

            {/* HUD Corners */}
            <div className="hud-corner hud-tl" style={{ zIndex: 2 }} />
            <div className="hud-corner hud-tr" style={{ zIndex: 2 }} />
            <div className="hud-corner hud-bl" style={{ zIndex: 2 }} />
            <div className="hud-corner hud-br" style={{ zIndex: 2 }} />

            {/* Content */}
            <div style={{ position: "absolute", bottom: 0, left: 0, padding: "3.5rem 4rem", maxWidth: "620px", zIndex: 2 }}>
              <motion.div variants={fadeUp} style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
                <span style={{ background: "var(--f1-red)", color: "#fff", padding: "4px 14px", fontSize: "0.5rem", fontFamily: "Michroma, sans-serif", borderRadius: "3px", letterSpacing: "2px" }}>
                  FEATURED
                </span>
                <span className="telemetry-chip" style={{ border: "1px solid var(--telemetry-cyan)", color: "var(--telemetry-cyan)", background: "rgba(0,242,255,0.05)" }}>S2026</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="michroma text-gradient-cinematic" style={{ fontSize: "4.2rem", lineHeight: "0.95", marginBottom: "1.5rem", textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}>
                2026 TECHNICAL<br />
                REVOLUTION
              </motion.h1>

              <motion.p variants={fadeUp} style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: "1.8", marginBottom: "2.5rem", maxWidth: "90%" }}>
                Audi and Cadillac arrive. 100% sustainable fuel. The ground rules of Formula 1 completely rewritten for a defining new era.
              </motion.p>

              <motion.div variants={fadeUp} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/dashboard?tab=editorial&season=2026" style={{
                  padding: "14px 32px", background: "#fff", color: "#000",
                  fontFamily: "Michroma, sans-serif", fontSize: "0.65rem",
                  fontWeight: "bold", borderRadius: "4px", letterSpacing: "2px",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: "8px",
                  transition: "all 0.3s", boxShadow: "0 10px 30px rgba(255,255,255,0.2)"
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,255,255,0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,255,255,0.2)'; }}
                >
                  EXPLORE INTEL <ChevronRight size={14} />
                </Link>
                <Link href="/dashboard" style={{
                  padding: "14px 32px",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", fontFamily: "Michroma, sans-serif",
                  fontSize: "0.65rem", borderRadius: "4px", letterSpacing: "2px",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: "8px",
                  transition: "all 0.3s"
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                >
                  DASHBOARD <Users size={14} />
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="status-bar" style={{ marginTop: "3rem", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", padding: "16px 24px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                {[["ROUNDS", "24"], ["TEAMS", "11"], ["PILOTS", "22"], ["ERA", "2026"]].map(([l, v]) => (
                  <div key={l} className="status-item">
                    <span className="status-label" style={{ color: "var(--telemetry-cyan)", opacity: 0.8 }}>{l}</span>
                    <span className="status-value" style={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}>{v}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Sidebar Feed — col-4 */}
          <div className="col-4" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* News Cards */}
            {FEATURED_NEWS.map((news, idx) => (
              <motion.div key={news.id} variants={slideInRight} custom={idx}>
                <Link
                  href={news.href}
                  style={{ textDecoration: "none", display: "block", height: "100%" }}
                >
                  <div className="magnetic-glass-panel" style={{
                    padding: 0, display: "flex", height: "148px",
                    overflow: "hidden", cursor: "pointer",
                  }}>
                    <div style={{ width: "40%", flexShrink: 0, height: "100%", overflow: "hidden", position: "relative" }}>
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        src={news.imageUrl} alt={news.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={e => { e.currentTarget.style.background = "#0d1117"; }}
                      />
                      {news.category === "LIVE" && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(225,6,0,0.2)", pointerEvents: "none" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span className={`news-tag${news.category === "LIVE" ? " red" : ""}`} style={{ marginBottom: "10px", width: "fit-content" }}>
                        {news.category === "LIVE" && <span className="live-dot" style={{ width: "6px", height: "6px", marginRight: "6px", verticalAlign: "middle" }} />}
                        {news.category}
                      </span>
                      <span className="news-title" style={{ fontSize: "0.85rem", lineHeight: 1.4, color: "rgba(255,255,255,0.9)" }}>{news.title.toUpperCase()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* F1 TV Promo Banner */}
            <motion.div
              variants={slideInRight}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                flex: 1, borderRadius: "16px", padding: "2rem",
                background: "linear-gradient(135deg, #e10600 0%, #7a0300 100%)",
                position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.15)",
                minHeight: "150px",
                boxShadow: "0 20px 40px rgba(225,6,0,0.3)"
              }}>
              <div style={{
                position: "absolute", right: "-1rem", top: "50%", transform: "translateY(-50%)",
                fontSize: "12rem", fontWeight: 900, fontStyle: "italic", opacity: 0.1, color: "#fff",
                lineHeight: 1, userSelect: "none", zIndex: 0
              }}>F1</div>

              <div style={{ zIndex: 1, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                  <Play fill="#fff" size={14} />
                  <div className="michroma" style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.9)", letterSpacing: "3px" }}>
                    PRO_ACCESS
                  </div>
                </div>
                <h3 className="michroma" style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "1.2rem", lineHeight: 1.3, textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>
                  EVERY CORNER.<br />MULTIPLE ANGLES.
                </h3>
                <button style={{
                  width: "fit-content", padding: "10px 24px",
                  background: "#fff", color: "var(--f1-red)",
                  border: "none", borderRadius: "4px",
                  fontFamily: "Michroma, sans-serif",
                  fontSize: "0.65rem", letterSpacing: "2px",
                  cursor: "pointer", fontWeight: "bold",
                  transition: "all 0.2s",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  SUBSCRIBE
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Inline scoped styles */}
      <style>{`
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 2rem;
        }
        .nav-brand { flex-shrink: 0; }
        .nav-links { flex: 1; justify-content: center; }
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}
