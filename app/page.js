/**
 * app/page.js — "Absolute Pro" F1 Manager Landing Page
 * Full restoration of the original design with:
 *   - FIA Official Top Bar
 *   - Sticky Navbar with hover Mega Menus (Drivers & Teams)
 *   - HUD Data Ticker
 *   - Bento Hero Grid (Spotlight + Side Feed + F1 TV Banner)
 *   - Background FX (fluid, scanlines, noise)
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
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

// Mega Menu Data and Components moved to app/components/MegaMenus.js

// ─── Main Home Page ───────────────────────────────────────────────────────────
export default function Home() {
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

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
        <nav className="navbar">
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link href="/login" className="nav-link-pro michroma" style={{ fontWeight: 700, fontSize: "0.6rem", letterSpacing: "1.5px" }}>
                SIGN_IN
              </Link>
              <Link href="/register" className="nav-cta michroma">
                REGISTER
              </Link>
            </div>
          </div>
        </nav>

        {/* Mega Menus — rendered inside header so sticky z-index stacks correctly */}
        <DriversMegaMenu active={activeMegaMenu === "drivers"} onClose={() => setActiveMegaMenu(null)} />
        <TeamsMegaMenu active={activeMegaMenu === "teams"} onClose={() => setActiveMegaMenu(null)} />
      </header>

      {/* ── HUD Data Ticker ───────────────────────────────────────────────── */}
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker-item">
              <span className="t-pos">{item.pos}</span>
              <span className="t-sep">·</span>
              <span className="t-name">{item.name}</span>
              <span className="t-sep">—</span>
              <span>{item.time}</span>
              <span className="t-sep">|</span>
              <span style={{ opacity: 0.5 }}>{item.team}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>

        {/* Live Session Banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1.5rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border-glass)",
          borderLeft: "3px solid var(--f1-red)",
          padding: "0.9rem 1.5rem", borderRadius: "8px",
          marginBottom: "2.5rem",
        }}>
          <div className="live-dot" />
          <span className="michroma" style={{ fontSize: "0.55rem", color: "var(--f1-red)", letterSpacing: "3px" }}>
            LIVE: BAHRAIN PRE-SEASON TESTING — DAY 2
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: "2rem" }}>
            {[["SESSION", "FP1"], ["TRACK", "SAKHIR"], ["TEMP", "28°C"], ["TIME", "14:09:33"]].map(([l, v]) => (
              <div key={l} className="stat-readout" style={{ gap: "2px" }}>
                <span className="label" style={{ fontSize: "0.45rem" }}>{l}</span>
                <span style={{ fontSize: "0.75rem", fontFamily: "Michroma, sans-serif", color: "var(--text-main)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bento Hero Grid ───────────────────────────────────────────── */}
        <div className="dash-grid-absolute">

          {/* Hero Spotlight — col-8 */}
          <div className="col-8" style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "660px" }}>
            {/* Background Image */}
            <img
              src={HERO_IMG}
              alt="F1 2026 Season"
              className="hero-hud-bg"
              style={{ borderRadius: "16px" }}
            />
            {/* Gradient Overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, rgba(2,4,8,0.92) 0%, rgba(2,4,8,0.55) 55%, transparent 100%), linear-gradient(to top, rgba(2,4,8,0.7) 0%, transparent 40%)",
              borderRadius: "16px",
            }} />

            {/* HUD Corners */}
            <div className="hud-corner hud-tl" />
            <div className="hud-corner hud-tr" />
            <div className="hud-corner hud-bl" />
            <div className="hud-corner hud-br" />

            {/* Content */}
            <div style={{ position: "absolute", bottom: 0, left: 0, padding: "3.5rem 4rem", maxWidth: "620px" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
                <span style={{ background: "var(--f1-red)", color: "#fff", padding: "4px 14px", fontSize: "0.5rem", fontFamily: "Michroma, sans-serif", borderRadius: "3px", letterSpacing: "2px" }}>
                  FEATURED
                </span>
                <span className="telemetry-chip">S2026</span>
              </div>

              <h1 className="michroma" style={{ fontSize: "3.8rem", color: "#fff", lineHeight: "0.95", marginBottom: "1.5rem" }}>
                2026 TECHNICAL<br />
                <span style={{
                  background: "linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.35) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                }}>
                  REVOLUTION
                </span>
              </h1>

              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: "1.8", marginBottom: "2.5rem" }}>
                Audi and Cadillac arrive. 100% sustainable fuel. The ground rules of Formula 1 completely rewritten for a defining new era.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/dashboard?tab=editorial&season=2026" style={{
                  padding: "12px 28px", background: "#fff", color: "#000",
                  fontFamily: "Michroma, sans-serif", fontSize: "0.6rem",
                  fontWeight: "bold", borderRadius: "3px", letterSpacing: "2px",
                  textDecoration: "none", display: "inline-block",
                  transition: "all 0.3s"
                }}>
                  EXPLORE_INTEL
                </Link>
                <Link href="/dashboard" style={{
                  padding: "12px 28px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", fontFamily: "Michroma, sans-serif",
                  fontSize: "0.6rem", borderRadius: "3px", letterSpacing: "2px",
                  textDecoration: "none", display: "inline-block",
                }}>
                  ENTER_DASHBOARD
                </Link>
              </div>

              <div className="status-bar" style={{ marginTop: "2rem" }}>
                {[["ROUNDS", "24"], ["TEAMS", "11"], ["PILOTS", "22"], ["ERA", "2026"]].map(([l, v]) => (
                  <div key={l} className="status-item">
                    <span className="status-label">{l}</span>
                    <span className="status-value">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Feed — col-4 */}
          <div className="col-4" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* News Cards */}
            {FEATURED_NEWS.map(news => (
              <Link
                key={news.id}
                href={news.href}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div className="pro-card-absolute" style={{
                  padding: 0, display: "flex", height: "162px",
                  borderRadius: "12px", overflow: "hidden", cursor: "pointer",
                }}>
                  <div style={{ width: "38%", flexShrink: 0, height: "100%", overflow: "hidden" }}>
                    <img
                      src={news.imageUrl} alt={news.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => { e.currentTarget.style.background = "#0d1117"; }}
                    />
                  </div>
                  <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span className={`news-tag${news.category === "LIVE" ? " red" : ""}`}>
                      {news.category === "LIVE" && <span className="live-dot" style={{ width: "6px", height: "6px", marginRight: "6px", verticalAlign: "middle" }} />}
                      {news.category}
                    </span>
                    <span className="news-title" style={{ fontSize: "0.85rem" }}>{news.title.toUpperCase()}</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* F1 TV Promo Banner */}
            <div style={{
              flex: 1, borderRadius: "12px", padding: "2rem",
              background: "linear-gradient(135deg, #e10600 0%, #7a0300 100%)",
              position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.1)",
              minHeight: "130px",
            }}>
              <div style={{
                position: "absolute", right: "-1rem", top: "50%", transform: "translateY(-50%)",
                fontSize: "9rem", fontWeight: 900, fontStyle: "italic", opacity: 0.08, color: "#fff",
                lineHeight: 1, userSelect: "none",
              }}>F1</div>
              <div className="michroma" style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.7)", letterSpacing: "3px", marginBottom: "0.5rem" }}>
                EXCLUSIVE_OFFER
              </div>
              <h3 className="michroma" style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "1.2rem", lineHeight: 1.3 }}>
                EVERY SESSION.<br />LIVE &amp; ON DEMAND.
              </h3>
              <button style={{
                width: "fit-content", padding: "9px 20px",
                background: "#fff", color: "var(--f1-red)",
                border: "none", borderRadius: "3px",
                fontFamily: "Michroma, sans-serif",
                fontSize: "0.6rem", letterSpacing: "2px",
                cursor: "pointer", fontWeight: "bold",
              }}>
                SUBSCRIBE_NOW
              </button>
            </div>
          </div>
        </div>
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
