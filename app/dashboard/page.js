/**
 * app/dashboard/page.js — "Absolute Pro" HUD & Seasonal Intelligence
 */

"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import { DriversMegaMenu, TeamsMegaMenu } from "../components/MegaMenus";

// ─── Constants ────────────────────────────────────────────────────────────────
const SEASONS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

const SEASON_INTROS = {
    2020: {
        title: "INTRODUCTION TO F1 2020",
        heroImageUrl: "https://www.esquireme.com/wp-content/uploads/sites/9/cloud/2021/09/08/F1-review-Abu-Dhabi-2019-4-1536x922.jpg",
        description: "The year Lewis Hamilton equaled Michael Schumacher's record of 7 World Titles. Amidst a disrupted global calendar, we witnessed Pierre Gasly's shock Monza victory and Sergio Perez's maiden win from last place in Sakhir.",
        moments: ["HAM EQUALS 7 TITLES", "GASLY MONZA WIN", "COVID_CALENDAR_RESET"]
    },
    2021: {
        title: "INTRODUCTION TO F1 2021",
        heroImageUrl: "https://external-preview.redd.it/ZD9gYaVhG5KKz5b9J08FXswpB262ns777F0ZIg1JcfE.jpg?width=1080&crop=smart&auto=webp&s=7c701d517e607b6f701da7b0b8a91404cb800190",
        description: "A legendary season defined by the intense, season-long duel between Max Verstappen and Lewis Hamilton. The championship was decided on the very last lap of the final race in Abu Dhabi, marking a new era of dominance.",
        moments: ["VER vs HAM DUEL", "ABU DHABI FINALE", "SILVERSTONE COLLISION"]
    },
    2022: {
        title: "INTRODUCTION TO F1 2022",
        heroImageUrl: "https://media.licdn.com/dms/image/v2/C4E22AQFFghMgfcBtvw/feedshare-shrink_800/feedshare-shrink_800/0/1668944663612?e=1773273600&v=beta&t=8R6KkrSbmHGAHKxyaxK89TbcBGHo7EHKH0uTaWQjABc",
        description: "The dawn of the Ground Effect era. Technical regulations were completely reset to encourage closer racing. Ferrari returned to the front early on, but Max Verstappen and Red Bull eventually achieved records for dominance.",
        moments: ["GROUND_EFFECT_RESET", "FERRARI REDEMPTION", "RED_BULL_DOMINANCE"]
    },
    2023: {
        title: "INTRODUCTION TO F1 2023",
        heroImageUrl: "https://preview.redd.it/formula-one-class-of-2023-v0-zkhyob5rco2c1.png?width=1080&crop=smart&auto=webp&s=5eb88a149e9b1f7ccb98763e2ce4e29411d001b4",
        description: "The Year of Records. Max Verstappen achieved an unprecedented 10 consecutive wins and 19 victories out of 22 rounds. Red Bull Racing nearly completed a clean sweep, failing to win only a single race in Singapore.",
        moments: ["10 WINS IN A ROW", "VER 3X CHAMPION", "SAINZ SINGAPORE WIN"]
    },
    2024: {
        title: "INTRODUCTION TO F1 2024",
        heroImageUrl: "https://e0.365dm.com/24/02/2048x1152/skysports-f1-drivers-2024-bahrain-testing_6471410.jpg?20240227200127",
        description: "The season of convergence. McLaren emerged as a genuine title challenger to Red Bull, with Lando Norris taking his maiden win in Miami. Lewis Hamilton delivered an emotional farewell victory for Mercedes at Silverstone.",
        moments: ["MCLAREN TITLE CHARGE", "HAM SILVERSTONE EXIT", "PIASTRI FIRST WIN"]
    },
    2025: {
        title: "INTRODUCTION TO F1 2025",
        heroImageUrl: "https://preview.redd.it/f1-the-class-of-2025-v0-vrbk067pnyoe1.jpeg?width=1080&crop=smart&auto=webp&s=7f5bfee5ffc06113ba7a7ccf40bd59f1568ff3be",
        description: "The Great Realignment. Lewis Hamilton shocked the world by making his race debut for Scuderia Ferrari. The championship battle broadened into a four-way fight between Red Bull, McLaren, Ferrari, and Mercedes.",
        moments: ["HAM_FERRARI_DEBUT", "4_WAY_TITLE_BATTLE", "LAST_ERA_TECHNICAL"]
    },
    2026: {
        title: "INTRODUCTION TO F1 2026",
        heroImageUrl: "https://cdn-media.theathletic.com/cdn-cgi/image/width=1000%2cquality=70%2cformat=auto/https://cdn-media.theathletic.com/yrzOgqAxDUmx_UJNVKigS3tyR_1440x810.jpeg",
        description: "The Technical Revolution. F1 enters its most sustainable era yet with 100% renewable fuel and increased electrical power. Audi and Cadillac join the grid as works entries, resetting the hierarchy of the world's elite constructors.",
        moments: ["AUDI_CADILLAC_ENTRY", "SUSTAINABLE_FUEL_v1", "E-POWER_RELIANCE"]
    }
};

const SCHEDULE_2026 = [
    { round: 1, gp: "Australian", circuit: "Albert Park, Melbourne", date: "March 6–8", sprint: false },
    { round: 2, gp: "Chinese", circuit: "Shanghai International Circuit", date: "March 13–15", sprint: true },
    { round: 3, gp: "Japanese", circuit: "Suzuka Circuit", date: "March 27–29", sprint: false },
    { round: 4, gp: "Bahrain", circuit: "Bahrain International Circuit", date: "April 10–12", sprint: false },
    { round: 5, gp: "Saudi Arabian", circuit: "Jeddah Street Circuit", date: "April 17–19", sprint: false },
    { round: 6, gp: "Miami", circuit: "Miami International Autodrome", date: "May 1–3", sprint: true },
    { round: 7, gp: "Canadian", circuit: "Circuit Gilles Villeneuve", date: "May 22–24", sprint: true },
    { round: 8, gp: "Monaco", circuit: "Circuit de Monaco", date: "June 5–7", sprint: false },
    { round: 9, gp: "Barcelona-Catalunya", circuit: "Circuit de Barcelona-Catalunya", date: "June 12–14", sprint: false },
    { round: 10, gp: "Austrian", circuit: "Red Bull Ring", date: "June 26–28", sprint: false },
    { round: 11, gp: "British", circuit: "Silverstone", date: "July 3–5", sprint: true },
    { round: 12, gp: "Belgian", circuit: "Spa-Francorchamps", date: "July 17–19", sprint: false },
    { round: 13, gp: "Hungarian", circuit: "Hungaroring", date: "July 24–26", sprint: false },
    { round: 14, gp: "Dutch", circuit: "Circuit Zand Zandvoort", date: "Aug 21–23", sprint: true },
    { round: 15, gp: "Italian", circuit: "Autodromo Nazionale Monza", date: "Sept 4–6", sprint: false },
    { round: 16, gp: "Spanish (Madrid)", circuit: "IFEMA Madrid Street Circuit*", date: "Sept 11–13", sprint: false },
    { round: 17, gp: "Azerbaijan", circuit: "Baku City Circuit", date: "Sept 24–26", sprint: false },
    { round: 18, gp: "Singapore", circuit: "Marina Bay Street Circuit", date: "Oct 9–11", sprint: true },
    { round: 19, gp: "United States", circuit: "Circuit of the Americas", date: "Oct 23–25", sprint: false },
    { round: 20, gp: "Mexico City", circuit: "Autódromo Hermanos Rodríguez", date: "Oct 30 – Nov 1", sprint: false },
    { round: 21, gp: "São Paulo", circuit: "Autódromo de Interlagos", date: "Nov 6–8", sprint: false },
    { round: 22, gp: "Las Vegas", circuit: "Las Vegas Street Circuit", date: "Nov 19–21", sprint: false },
    { round: 23, gp: "Qatar", circuit: "Lusail International Circuit", date: "Nov 27–29", sprint: false },
    { round: 24, gp: "Abu Dhabi", circuit: "Yas Marina Circuit", date: "Dec 4–6", sprint: false },
];

const apiFetch = async (url) => {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Fetch failed");
    return json;
};

// ─── Shared Components ─────────────────────────────────────────────────────

function DataTicker({ stats }) {
    const [isPaused, setIsPaused] = useState(false);

    const newsItems = useMemo(() => {
        if (!stats || !stats.raceLogs) return ["ESTABLISHING TELEMETRY...", "DATA LINK SECURED"];
        return stats.raceLogs.map(log => `EVENT: ${log.name.toUpperCase()} // WIN_SYS: ${log.winner.toUpperCase()} // POL_SYS: ${log.pole.toUpperCase()}`);
    }, [stats]);

    const fullTicker = [...newsItems, ...newsItems];

    return (
        <div
            className={`ticker-wrapper ${isPaused ? "paused" : ""}`}
            onClick={() => setIsPaused(!isPaused)}
            title="Click to Pause/Resume Data Stream"
        >
            <div className="ticker-content">
                {fullTicker.map((text, i) => (
                    <div key={i} className="ticker-item">
                        <b>{isPaused ? "[STATIONARY]" : "📡"}</b> {text}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SeasonDropdown({ currentSeason, onSeasonChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="season-dropdown-wrapper">
            <button
                className={`season-dropdown-trigger michroma ${isOpen ? 'active' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <span className="label">ERA</span>
                <span className="value">{currentSeason}</span>
                <span className={`chevron ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="season-dropdown-menu">
                    <div className="hud-corner hud-tl" />
                    <div className="hud-corner hud-tr" />
                    <div className="hud-corner hud-bl" />
                    <div className="hud-corner hud-br" />

                    <div className="dropdown-search-meta michroma" style={{ fontSize: '0.45rem', opacity: 0.3, padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
                        SELECT_FISCAL_ERA
                    </div>

                    {SEASONS.map((s) => (
                        <button
                            key={s}
                            className={`season-option michroma ${Number(currentSeason) === s ? "active" : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("DROPDOWN_SELECTION:", s);
                                onSeasonChange(s);
                                setIsOpen(false);
                            }}
                        >
                            <span className="year-val">{s}</span>
                            {Number(currentSeason) === s ? (
                                <span className="active-dot" />
                            ) : (
                                <span className="inactive-line" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Click outside listener */}
            {isOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 2000 }}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}

function ImageWithFallback({ src, alt, className, style }) {
    const [status, setStatus] = useState("loading");
    const imgRef = React.useRef(null);

    useEffect(() => {
        if (imgRef.current?.complete) {
            setStatus("success");
        } else {
            setStatus("loading");
        }
    }, [src]);

    return (
        <div className={`${className} image-container`} style={{ position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.01)", ...style }}>
            {status === "loading" && (
                <div className="img-overlay" style={{ display: "grid", placeItems: "center", background: "var(--bg-obsidian)" }}>
                    <div className="pulse" style={{ width: "24px", height: "1px", background: "var(--f1-red)" }}></div>
                </div>
            )}
            {status === "error" && (
                <div className="img-overlay" style={{ display: "grid", placeItems: "center", background: "var(--bg-obsidian)" }}>
                    <div style={{ opacity: 0.2, fontSize: "0.5rem", fontFamily: "Michroma", letterSpacing: "2px" }}>LINK_LOST</div>
                </div>
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={className}
                referrerPolicy="no-referrer"
                style={{
                    opacity: status === "success" ? 0.8 : 0,
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: status === "loading" ? "scale(1.05)" : "scale(1)",
                    filter: status === "success" ? "contrast(1.1) brightness(0.9)" : "none",
                    ...style
                }}
                onLoad={() => setStatus("success")}
                onError={() => {
                    console.error("Image failed:", src);
                    setStatus("error");
                }}
            />
        </div>
    );
}

const DASHBOARD_NAV_ITEMS = [
    { name: "SCHEDULE", tab: "intelligence&subtab=schedule" },
    { name: "RESULTS", tab: "intelligence&subtab=results" },
    { name: "NEWS", tab: "editorial" },
    { name: "DRIVERS", tab: "paddock&subtab=drivers", megaMenu: "drivers" },
    { name: "TEAMS", tab: "paddock&subtab=teams", megaMenu: "teams" },
    { name: "MANAGEMENT", tab: "management", adminOnly: true }
];

function Navbar({ activeTab, season, setSelectedArticle, onSeasonChange, user, onLogout }) {
    const searchParams = useSearchParams();
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);

    return (
        <header
            style={{ position: 'sticky', top: 0, zIndex: 2000 }}
            onMouseLeave={() => setActiveMegaMenu(null)}
        >
            <nav className="navbar" style={{ borderBottom: activeMegaMenu ? 'none' : '1px solid var(--border-glass)' }}>
                <div className="container navbar-grid">
                    <div className="nav-side-col">
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <div className="brand-pro michroma" style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1 }}>
                                <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>F1</span>
                                <span style={{ letterSpacing: '1px' }}>MANAGER</span>
                            </div>
                        </Link>
                    </div>

                    <div className="nav-links-pro" style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem' }}>
                        {DASHBOARD_NAV_ITEMS.filter(item => {
                            if (item.name === "SCHEDULE" && season !== 2026) return false;
                            if (item.adminOnly && user?.role !== 'admin') return false;
                            return true;
                        }).map((item) => {
                            const itemTabBase = item.tab.split('&')[0];
                            const itemSubTab = item.tab.includes('subtab=') ? item.tab.split('subtab=')[1] : null;

                            const currentSubTab = searchParams.get("subtab");
                            const isActive = activeTab === itemTabBase && (itemSubTab === currentSubTab);

                            // Build URL preserving season
                            const finalParams = new URLSearchParams(searchParams.toString());

                            // Merge logic
                            if (item.tab.includes('subtab=')) {
                                const [tab, sub] = item.tab.split('&subtab=');
                                finalParams.set("tab", tab);
                                finalParams.set("subtab", sub);
                            } else {
                                finalParams.set("tab", item.tab);
                                finalParams.delete("subtab");
                            }
                            finalParams.set("season", season.toString());
                            finalParams.delete("articleId"); // Clean article on nav

                            return (
                                <Link
                                    key={item.name}
                                    href={`/dashboard?${finalParams.toString()}`}
                                    className={`nav-link-pro ${isActive ? "active" : ""} ${activeMegaMenu === item.megaMenu ? "active" : ""}`}
                                    scroll={false}
                                    onClick={() => {
                                        setSelectedArticle(null);
                                        setActiveMegaMenu(null);
                                    }}
                                    onMouseEnter={() => {
                                        if (item.megaMenu) setActiveMegaMenu(item.megaMenu);
                                        else setActiveMegaMenu(null);
                                    }}
                                    style={{ fontWeight: 'bold', fontSize: '0.62rem', textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '1.8px' }}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="nav-side-col right" style={{ gap: '1rem', flexShrink: 0 }}>
                        {user && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginRight: '0.5rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="michroma" style={{ fontSize: '0.45rem', opacity: 0.5, letterSpacing: '1px' }}>{user.role?.toUpperCase()}_IDENT</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>{user.name}</div>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="michroma"
                                    style={{
                                        background: 'rgba(225,6,0,0.1)',
                                        border: '1px solid rgba(225,6,0,0.3)',
                                        color: 'var(--f1-red)',
                                        fontSize: '0.45rem',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        borderRadius: '2px',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    LOGOUT
                                </button>
                            </div>
                        )}
                        <SeasonDropdown currentSeason={season} onSeasonChange={onSeasonChange} />
                    </div>
                </div>
            </nav>

            <DriversMegaMenu active={activeMegaMenu === "drivers"} onClose={() => setActiveMegaMenu(null)} season={season} />
            <TeamsMegaMenu active={activeMegaMenu === "teams"} onClose={() => setActiveMegaMenu(null)} season={season} />
        </header>
    );
}

// ─── Sub-Pages ─────────────────────────────────────────────────────────────

function IntelligenceView({ stats, season }) {
    const searchParams = useSearchParams();
    const subtab = searchParams.get("subtab");
    const isScheduleSubtab = subtab === "schedule";
    const [showMore, setShowMore] = useState(false);
    if (!stats) return null;

    const isSeasonNotStarted = (!stats.driverStandings || stats.driverStandings.length === 0) || (season === 2026 && (!stats.raceLogs || stats.raceLogs.length === 0));
    const noResults = !stats.driverStandings || stats.driverStandings.length === 0;
    const hideStandings = season === 2026 && isScheduleSubtab;

    return (
        <div className="dash-grid-absolute">
            {!hideStandings && (
                <>
                    {/* STAT NODES */}
                    <div id="schedule" className="pro-card-absolute col-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '2rem', gap: '1.5rem' }}>
                        {[
                            { label: 'ROUNDS', val: stats.totalRaces },
                            { label: 'TEAMS', val: stats.totalTeams },
                            { label: 'DRIVERS', val: stats.activeDrivers },
                            { label: 'PROTOCOL', val: (season === 2026 && (!stats.raceLogs || stats.raceLogs.length === 0)) ? 'READY' : (noResults ? 'PENDING' : 'ACTIVE'), color: (season === 2026 && (!stats.raceLogs || stats.raceLogs.length === 0)) ? 'var(--telemetry-cyan)' : (noResults ? 'var(--text-mute)' : 'var(--f1-red)') }
                        ].map((item, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                <div className="hud-corner hud-tl" />
                                <div style={{ padding: '1rem' }}>
                                    <div className="michroma" style={{ fontSize: '0.5rem', opacity: 0.5, marginBottom: '8px' }}>{item.label}_SYS</div>
                                    <div style={{ fontSize: '2.2rem', fontFamily: 'Michroma', color: item.color || '#fff', whiteSpace: 'nowrap' }}>{item.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DRIVERS FIELD */}
                    <div className="pro-card-absolute col-8">
                        <div className="hud-corner hud-tr" />
                        <div className="pro-card-label">PILOT_CLASSIFICATION_STREAM</div>

                        {isSeasonNotStarted && (
                            <div className="michroma" style={{ padding: '2rem 2.5rem', background: 'rgba(0,242,255,0.05)', border: '1px solid rgba(0,242,255,0.1)', color: 'var(--telemetry-cyan)', fontSize: '0.6rem', letterSpacing: '2px', marginBottom: '2rem' }}>
                                [ STATUS_BROADCAST: {season === 2026 ? "GRID_LOCKED // SEASON_START_PENDING" : "SEASON IS YET TO START // STANDINGS_PROTOCOL_PENDING"} ]
                            </div>
                        )}

                        <div style={{ overflowX: 'auto' }}>
                            <table className="standing-table-pro" style={{ minWidth: '450px' }}>
                                <tbody>
                                    {!noResults ? (
                                        (showMore ? stats.driverStandings : stats.driverStandings.slice(0, 10)).map((d, i) => (
                                            <tr key={d.id} className="standing-row-pro">
                                                <td className="pos-box">{(i + 1).toString().padStart(2, '0')}</td>
                                                <td className="name-box michroma" style={{ fontSize: '0.8rem' }}>
                                                    <Link href={`/drivers/${d.id}?season=${season}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        {d.name.split(' ')[0]} <b style={{ fontWeight: 900 }}>{d.name.split(' ')[1]}</b>
                                                    </Link>
                                                </td>
                                                <td className="pts-box">{d.points} <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>PTS</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        Array.from({ length: 10 }).map((_, i) => (
                                            <tr key={i} className="standing-row-pro" style={{ opacity: 0.3 }}>
                                                <td className="pos-box">{(i + 1).toString().padStart(2, '0')}</td>
                                                <td className="name-box michroma" style={{ fontSize: '0.8rem' }}>PILOT_PLACEHOLDER_0{i + 1} // TBC</td>
                                                <td className="pts-box">0 <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>PTS</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {!noResults && (
                            <button
                                className="michroma"
                                onClick={() => setShowMore(!showMore)}
                                style={{ width: '100%', marginTop: '3rem', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'var(--text-mute)', fontSize: '0.55rem', letterSpacing: '3px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                {showMore ? "COLLAPSE_QUERY" : "QUERY_FULL_FIELD_DATA"}
                            </button>
                        )}
                    </div>

                    {/* CONSTRUCTORS FIELD */}
                    <div className="pro-card-absolute col-4">
                        <div className="hud-corner hud-tl" />
                        <div className="pro-card-label">CONSTRUCTOR_STATS</div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="standing-table-pro" style={{ minWidth: '200px' }}>
                                <tbody>
                                    {!noResults ? (
                                        stats.constructorStandings.map((t, i) => (
                                            <tr key={t.id} className="standing-row-pro">
                                                <td className="pos-box" style={{ fontSize: '0.9rem' }}>{i + 1}</td>
                                                <td className="name-box michroma" style={{ fontSize: '0.7rem' }}>{t.name}</td>
                                                <td className="pts-box" style={{ fontSize: '0.8rem' }}>{t.points}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        Array.from({ length: 10 }).map((_, i) => (
                                            <tr key={i} className="standing-row-pro" style={{ opacity: 0.3 }}>
                                                <td className="pos-box" style={{ fontSize: '0.9rem' }}>{i + 1}</td>
                                                <td className="name-box michroma" style={{ fontSize: '0.7rem' }}>TEAM_PLACEHOLDER_0{i + 1}</td>
                                                <td className="pts-box" style={{ fontSize: '0.8rem' }}>0</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* GP INTELLIGENCE LOG / 2026 SCHEDULE */}
            {season === 2026 ? (
                <div id="schedule" className="col-12" style={{ marginTop: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <h2 className="michroma" style={{ fontSize: '1.5rem', letterSpacing: '1px', margin: 0 }}>2026 RACE CALENDAR</h2>
                        <span className="telemetry-chip" style={{ background: 'var(--f1-red)', color: '#fff' }}>CONFIRMED_PROTOCOL</span>
                    </div>

                    <div className="pro-card-absolute" style={{ padding: '0', background: 'rgba(2, 4, 8, 0.4)', position: 'relative' }}>
                        <div className="hud-corner hud-br" />
                        <div style={{ overflowX: 'auto' }}>
                            <table className="standing-table-pro" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        <th style={{ padding: '1.5rem 2.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '2px', width: '80px' }}>RND</th>
                                        <th style={{ padding: '1.5rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '2px' }}>GRAND PRIX</th>
                                        <th style={{ padding: '1.5rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '2px' }}>CIRCUIT</th>
                                        <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '2px', width: '180px' }}>DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SCHEDULE_2026.map((race) => (
                                        <tr key={race.round} className="standing-row-pro race-row-interactive">
                                            <td style={{ padding: '1.2rem 2.5rem', width: '80px' }}>
                                                <span style={{ fontSize: '0.9rem', fontFamily: 'Michroma', opacity: 0.5 }}>{race.round.toString().padStart(2, '0')}</span>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{race.gp.toUpperCase()}</span>
                                                    {race.sprint && (
                                                        <span style={{ fontSize: '0.45rem', padding: '2px 6px', background: 'var(--f1-red)', borderRadius: '2px', fontFamily: 'Michroma' }}>SPRINT</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-mute)' }}>{race.circuit}</td>
                                            <td style={{ padding: '1.2rem 2.5rem', textAlign: 'right', fontFamily: 'Michroma', fontSize: '0.75rem', color: 'var(--telemetry-cyan)' }}>
                                                {race.date.toUpperCase()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2026 META INFO */}
                    <div className="dash-grid-absolute" style={{ marginTop: '3rem' }}>
                        <div className="pro-card-absolute col-8">
                            <div className="hud-corner hud-tl" />
                            <div className="michroma" style={{ fontSize: '0.7rem', color: 'var(--f1-red)', marginBottom: '1.5rem', letterSpacing: '2px' }}>ERA_HIGHLIGHTS // KEY_CHANGES</div>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {[
                                    { h: "THE MADRID MOVE", p: "The Spanish Grand Prix moves to a brand-new street circuit in Madrid. Barcelona remains for 2026." },
                                    { h: "RAMADAN SHIFT", p: "Bahrain and Saudi Arabian races pushed to April; Australia returns as season opener." },
                                    { h: "SUSTAINABILITY SPRINTS", p: "Six Sprint events: China, Miami, Canada, Great Britain, Netherlands, Singapore." },
                                    { h: "TECHNICAL REVOLUTION", p: "New Power Unit regulations (increased electrical power) and 100% sustainable fuels." }
                                ].map((item, i) => (
                                    <li key={i} style={{ paddingLeft: '1.5rem', borderLeft: '2px solid rgba(225,6,0,0.3)' }}>
                                        <div style={{ fontWeight: 900, fontSize: '0.85rem', marginBottom: '4px', letterSpacing: '1px' }}>{item.h}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6, lineHeight: 1.5 }}>{item.p}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pro-card-absolute col-4">
                            <div className="hud-corner hud-tr" />
                            <div className="michroma" style={{ fontSize: '0.7rem', color: 'var(--telemetry-cyan)', marginBottom: '1.5rem', letterSpacing: '2px' }}>PRE-SEASON_TESTING</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[
                                    { l: "BARCELONA", v: "JAN 26–30", s: "SHAKEDOWN" },
                                    { l: "BAHRAIN 01", v: "FEB 11–13", s: "TEST_V1" },
                                    { l: "BAHRAIN 02", v: "FEB 18–20", s: "TEST_V2" }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span className="michroma" style={{ fontSize: '0.6rem' }}>{item.l}</span>
                                            <span style={{ fontSize: '0.5rem', color: 'var(--telemetry-cyan)', opacity: 0.5 }}>{item.s}</span>
                                        </div>
                                        <div className="michroma" style={{ fontSize: '1rem', fontWeight: 900 }}>{item.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div id="results" className="col-12" style={{ marginTop: '4rem' }}>
                    <h2 className="michroma" style={{ fontSize: '1.5rem', marginBottom: '2rem', letterSpacing: '1px' }}>{stats.season} RACE RESULTS</h2>

                    <div className="pro-card-absolute" style={{ padding: '0', background: 'rgba(2, 4, 8, 0.4)', position: 'relative' }}>
                        <div className="hud-corner hud-br" />

                        {noResults && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 10,
                                background: 'rgba(0,0,0,0.4)',
                                backdropFilter: 'blur(4px)',
                                display: 'grid',
                                placeItems: 'center',
                                textAlign: 'center',
                                padding: '4rem'
                            }}>
                                <div>
                                    <div className="michroma" style={{ fontSize: '0.8rem', color: 'var(--f1-red)', marginBottom: '1rem', letterSpacing: '4px' }}>[ DATA_LINK_OFFLINE ]</div>
                                    <div className="michroma" style={{ fontSize: '0.6rem', opacity: 0.5 }}>NO_HISTORICAL_DATA_PACKETS_CAPTURED_FOR_THIS_ERA.</div>
                                </div>
                            </div>
                        )}

                        <div style={{ overflowX: 'auto', opacity: noResults ? 0.3 : 1 }}>
                            <table className="standing-table-pro" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        <th style={{ padding: '1.5rem 2.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '1px', width: '280px' }}>GRAND PRIX</th>
                                        <th style={{ padding: '1.5rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '1px', width: '100px' }}>DATE</th>
                                        <th style={{ padding: '1.5rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '1px', width: '220px' }}>WINNER</th>
                                        <th style={{ padding: '1.5rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '1px', width: '200px' }}>TEAM</th>
                                        <th style={{ padding: '1.5rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '1px', width: '80px' }}>LAPS</th>
                                        <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right', fontSize: '0.65rem', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '1px' }}>TIME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.raceLogs?.map((log, idx) => (
                                        <tr key={idx} className="standing-row-pro race-row-interactive">
                                            <td style={{ padding: '1.2rem 2.5rem', width: '280px', position: 'relative' }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: '15%',
                                                    bottom: '15%',
                                                    width: '2px',
                                                    background: 'var(--f1-red)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                }} className="row-accent" />
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                                    <span style={{
                                                        fontSize: '0.6rem',
                                                        fontFamily: 'Michroma',
                                                        opacity: 0.4,
                                                        width: '24px',
                                                        textAlign: 'center',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        padding: '2px 0',
                                                        borderRadius: '2px'
                                                    }}>{log.countryCode}</span>
                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.5px' }}>{log.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-mute)', width: '100px' }}>{log.date}</td>
                                            <td style={{ padding: '1.2rem 1.5rem', width: '220px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,10,10,0.15)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                                                        {log.winnerImageUrl && (
                                                            <img src={log.winnerImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{log.winner}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', width: '200px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    <div style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        {log.teamLogoUrl ? (
                                                            <img src={log.teamLogoUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', filter: 'brightness(1.5)' }} />
                                                        ) : (
                                                            <div style={{ width: '12px', height: '2px', background: 'var(--text-mute)', opacity: 0.2 }} />
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-mute)' }}>{log.team}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-mute)', width: '80px' }}>{log.laps}</td>
                                            <td style={{ padding: '1.2rem 2.5rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: '#fff', letterSpacing: '0.5px' }}>
                                                {log.time}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <style jsx>{`
                                .race-row-interactive {
                                    transition: background 0.3s ease;
                                }
                                .race-row-interactive:hover {
                                    background: rgba(255,255,255,0.03);
                                }
                                .race-row-interactive:hover .row-accent {
                                    opacity: 1;
                                }
                            `}</style>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function EditorialView({ season, onOpenArticle }) {
    const [news, setNews] = useState([]);
    useEffect(() => {
        apiFetch(`/api/news?season=${season}`).then(res => setNews(res.data));
    }, [season]);

    return (
        <div className="dash-grid-absolute">
            {news.length === 0 ? (
                <div className="pro-card-absolute col-12" style={{ textAlign: "center", padding: "12rem", opacity: 0.2, fontFamily: 'Michroma', fontSize: '0.5rem', letterSpacing: '4px' }}> NO_DATA_PACKETS_CAPTURED_FOR_S{season} </div>
            ) : (
                news.map(item => (
                    <div
                        className="pro-card-absolute col-4 news-card-animated"
                        key={item.id}
                        style={{
                            padding: '0',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative'
                        }}
                        onClick={() => onOpenArticle(item)}
                    >
                        <div className="hud-corner hud-tr" style={{ zIndex: 10 }} />

                        <div style={{
                            height: '260px',
                            width: '100%',
                            overflow: 'hidden',
                            background: '#000'
                        }} className="img-block">
                            <ImageWithFallback
                                src={item.imageUrl}
                                alt={item.title}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.6s ease'
                                }}
                                className="news-img"
                            />
                        </div>

                        <div style={{ padding: '2.5rem', position: 'relative', zIndex: 5 }}>
                            <div className="telemetry-chip" style={{ marginBottom: '1.5rem', transition: 'all 0.3s ease' }}>{item.category.toUpperCase()}</div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.3, fontWeight: 700, transition: 'color 0.3s ease' }} className="news-title">{item.title}</h3>
                            <p style={{ color: 'var(--text-mute)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.summary}</p>
                        </div>

                        {/* Hover Accent Line */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '0%',
                            height: '4px',
                            background: 'var(--f1-red)',
                            transition: 'width 0.4s ease'
                        }} className="news-hover-line" />

                        <style jsx>{`
                            .news-card-animated:hover {
                                border-color: rgba(255,255,255,0.2) !important;
                                transform: translateY(-8px);
                                box-shadow: 0 15px 40px rgba(0,0,0,0.6);
                            }
                            .news-card-animated:hover .news-img {
                                transform: scale(1.08);
                                opacity: 0.8;
                            }
                            .news-card-animated:hover .news-title {
                                color: var(--f1-red);
                            }
                            .news-card-animated:hover .news-hover-line {
                                width: 100%;
                            }
                            .news-card-animated:hover .telemetry-chip {
                                background: var(--f1-red);
                                border-color: var(--f1-red);
                                color: #fff;
                            }
                        `}</style>
                    </div>
                ))
            )}
        </div>
    );
}

function ArticleReader({ article, onBack }) {
    if (!article) return null;

    return (
        <div className="fade-in-up" style={{ padding: '0 0 8rem' }}>
            <div style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <button
                    onClick={onBack}
                    className="michroma"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        padding: '12px 24px',
                        fontSize: '0.6rem',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}
                >
                    <span style={{ color: 'var(--f1-red)' }}>←</span> RETURN_TO_INTEL_INDEX
                </button>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
            </div>

            <div className="pro-card-absolute" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="hud-corner hud-tr" />
                <div style={{ height: '500px', width: '100%', position: 'relative' }}>
                    <ImageWithFallback src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '5rem', background: 'linear-gradient(to top, var(--bg-obsidian) 0%, transparent 100%)' }}>
                        <div className="telemetry-chip" style={{ marginBottom: '1.5rem', background: 'var(--f1-red)' }}>{article.category.toUpperCase()} // S_{article.season}</div>
                        <h1 className="michroma" style={{ fontSize: '3rem', fontWeight: 900, maxWidth: '900px', lineHeight: 1.1 }}>{article.title}</h1>
                    </div>
                </div>

                <div style={{ padding: '5rem', maxWidth: '1000px' }}>
                    <div style={{ display: 'flex', gap: '4rem', marginBottom: '4rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
                        <div>
                            <div className="michroma" style={{ fontSize: '0.55rem', opacity: 0.4, marginBottom: '8px' }}>PUBLISHED_DATE</div>
                            <div className="michroma" style={{ fontSize: '0.8rem' }}>{article.date}</div>
                        </div>
                        <div>
                            <div className="michroma" style={{ fontSize: '0.55rem', opacity: 0.4, marginBottom: '8px' }}>SOURCE_AUTH</div>
                            <div className="michroma" style={{ fontSize: '0.8rem' }}>PADDOCK_INTEL_V1</div>
                        </div>
                    </div>

                    <div style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.2px' }}>
                        <p style={{ marginBottom: '2.5rem', fontWeight: 600 }}>{article.summary}</p>
                        <p style={{ marginBottom: '2rem' }}>Formula 1 technology continues to evolve at a breakneck pace. This latest development marks a significant milestone in our ongoing seasonal analysis. Manufacturers and teams are now fully focused on the technical implications of these changes, which will redefine the competitive landscape for years to come.</p>
                        <p style={{ marginBottom: '2rem' }}>As we monitor the telemetry and feedback from the paddock, it becomes clear that the margin for error is shrinking. Every millisecond gained through technical optimization is a strategic advantage in the world&apos;s most elite racing category.</p>

                        <div style={{ margin: '4rem 0', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid var(--f1-red)', borderRadius: '4px' }}>
                            <div className="michroma" style={{ fontSize: '0.7rem', color: 'var(--f1-red)', marginBottom: '1rem' }}>SYSTEM_UPDATE // INTEL_CORNER</div>
                            <p style={{ fontSize: '1rem', fontStyle: 'italic', opacity: 0.8 }}>&quot;The technical regulations for the upcoming era are the most ambitious we have ever seen. They combine extreme sustainability with the high-performance DNA of Formula 1.&quot; — FIA Technical Delegate</p>
                        </div>

                        <p>Stay tuned to the F1 Manager suite for real-time updates as teams react to these latest intelligence packets. Full diagnostic reports will be available following the next testing session.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TEAM_THEMES = {
    1: { name: "Red Bull", color: "#0600EF", gradient: "linear-gradient(135deg, #0600EF 0%, #000030 100%)" },
    2: { name: "Ferrari", color: "#EF1A2D", gradient: "linear-gradient(135deg, #EF1A2D 0%, #8D0A0E 100%)" },
    3: { name: "Mercedes", color: "#00D2BE", gradient: "linear-gradient(135deg, #00D2BE 0%, #06080B 100%)" },
    4: { name: "McLaren", color: "#FF8700", gradient: "linear-gradient(135deg, #FF8700 0%, #000000 100%)" },
    5: { name: "Aston Martin", color: "#006F62", gradient: "linear-gradient(135deg, #006F62 0%, #00352F 100%)" },
    6: { name: "Alpine", color: "#0090FF", gradient: "linear-gradient(135deg, #0090FF 0%, #005699 100%)" },
    7: { name: "Williams", color: "#005AFF", gradient: "linear-gradient(135deg, #005AFF 0%, #002D80 100%)" },
    8: { name: "RB", color: "#6692FF", gradient: "linear-gradient(135deg, #6692FF 0%, #001F66 100%)" },
    9: { name: "Sauber", color: "#52E252", gradient: "linear-gradient(135deg, #52E252 0%, #000000 100%)" },
    10: { name: "Haas", color: "#B6BABD", gradient: "linear-gradient(135deg, #B6BABD 0%, #000000 100%)" },
    11: { name: "Audi", color: "#FF0000", gradient: "linear-gradient(135deg, #FF0000 0%, #000000 100%)" },
    12: { name: "Cadillac", color: "#FFFFFF", gradient: "linear-gradient(135deg, #EEEEEE 0%, #222222 100%)" }
};

function PaddockView({ teams, drivers, paddockTab, season }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubTabChange = (sub) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("subtab", sub);
        router.push(`/dashboard?${params.toString()}`, { scroll: false });
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* VIEW_SELECTOR */}
            <div style={{ display: "flex", gap: "3rem", marginBottom: "4rem" }}>
                <button
                    className={`nav-link-pro ${paddockTab === "teams" ? "active" : ""}`}
                    onClick={() => handleSubTabChange("teams")}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                    CONSTRUCTORS_CORE
                </button>
                <button
                    className={`nav-link-pro ${paddockTab === "drivers" ? "active" : ""}`}
                    onClick={() => handleSubTabChange("drivers")}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                    PILOT_ROSTER
                </button>
            </div>

            {/* HEADER_INFO */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 className="michroma" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>F1 DRIVERS {season}</h2>
                <p className="michroma" style={{ fontSize: '0.8rem', opacity: 0.6, letterSpacing: '1px' }}>Find the current Formula 1 drivers for the {season} season</p>
            </div>

            <div className="dash-grid-absolute" style={{ gap: '2rem' }}>
                {paddockTab === "teams" ? (
                    teams.map(t => (
                        <div className="pro-card-absolute col-4 team-card-animated" key={t.id} style={{
                            padding: '0',
                            overflow: 'hidden',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative'
                        }}>
                            <div className="hud-corner hud-bl" />

                            {/* Car Display Block */}
                            <div style={{
                                height: '180px',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1rem',
                                transition: 'all 0.4s ease'
                            }} className="car-block">
                                <ImageWithFallback
                                    src={t.carImageUrl}
                                    alt={t.name}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'contain',
                                        transition: 'transform 0.4s ease'
                                    }}
                                    className="car-img"
                                />
                            </div>

                            {/* Info Block */}
                            <div style={{ padding: '2.5rem' }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
                                    <div style={{
                                        width: '40px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={t.logoUrl}
                                            alt="logo"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain'
                                            }}
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="michroma" style={{ fontSize: "0.8rem", letterSpacing: '2px', fontWeight: 900 }}>{t.name.toUpperCase()}</div>
                                </div>

                                <Link href={`/teams/${t.id}?season=${season}`} style={{ textDecoration: "none" }}>
                                    <button className="michroma access-btn" style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        fontSize: '0.6rem',
                                        letterSpacing: '2px',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        ACCESS_INTEL_PROFILE
                                    </button>
                                </Link>
                            </div>

                            {/* Hover Accent Line */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '0%',
                                height: '2px',
                                background: 'var(--f1-red)',
                                transition: 'width 0.4s ease'
                            }} className="hover-line" />

                            <style jsx>{`
                                .team-card-animated:hover {
                                    border-color: rgba(255,6,0,0.3) !important;
                                    transform: translateY(-5px);
                                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                                }
                                .team-card-animated:hover .car-img {
                                    transform: scale(1.1) translateX(10px);
                                }
                                .team-card-animated:hover .car-block {
                                    background: rgba(255,255,255,0.04);
                                }
                                .team-card-animated:hover .hover-line {
                                    width: 100%;
                                }
                                .team-card-animated:hover .access-btn {
                                    background: var(--f1-red) !important;
                                    border-color: var(--f1-red) !important;
                                }
                            `}</style>
                        </div>
                    ))
                ) : (
                    drivers.map(d => {
                        const theme = TEAM_THEMES[d.teamId] || { gradient: 'linear-gradient(135deg, #1f1f1f 0%, #000 100%)' };
                        const [firstName, ...lastNames] = d.name.split(' ');
                        const lastName = lastNames.join(' ');

                        return (
                            <div className="col-6" key={d.id} style={{ borderRadius: '12px', overflow: 'hidden', height: '320px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Link href={`/drivers/${d.id}?season=${season}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: theme.gradient,
                                        position: 'relative'
                                    }}>
                                        {/* CARD_PATTERN_OVERLAY */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px)',
                                            zIndex: 1
                                        }} />

                                        {/* LEFT_INFO_STACK */}
                                        <div style={{ padding: '2.5rem', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            <div style={{ flex: 1 }}>
                                                <div className="michroma" style={{ fontSize: '1.2rem', fontWeight: 400, opacity: 0.9, lineHeight: 1 }}>{firstName}</div>
                                                <div className="michroma" style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.5rem' }}>{lastName.toUpperCase()}</div>
                                                <div className="michroma" style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '2px' }}>{d.teamName?.toUpperCase() || theme.name?.toUpperCase()}</div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                                <div className="michroma" style={{
                                                    fontSize: '3.5rem',
                                                    fontWeight: 900,
                                                    lineHeight: 0.8,
                                                    WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                                                    color: 'transparent'
                                                }}>
                                                    {d.number}
                                                </div>
                                                <div style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '50%',
                                                    border: '2px solid rgba(255,255,255,0.2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    fontSize: '0.6rem'
                                                }}>
                                                    {/* FLAG_PLACEHOLDER - IN REAL APP USE CSS FLAGS */}
                                                    {d.nationality?.slice(0, 2).toUpperCase()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* DRIVER_PORTRAIT */}
                                        <div style={{
                                            position: 'absolute',
                                            right: '-2rem',
                                            bottom: 0,
                                            height: '110%',
                                            width: '60%',
                                            zIndex: 5,
                                            pointerEvents: 'none'
                                        }}>
                                            <ImageWithFallback
                                                src={`${d.imageUrl}?s=${season}`}
                                                alt={d.name}
                                                style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'bottom right' }}
                                            />
                                        </div>

                                        {/* BOTTOM_ACCENT_LINE */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '4px',
                                            background: 'rgba(255,255,255,0.1)',
                                            zIndex: 10
                                        }} />
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// ─── Main Dashboard Wrapper ───────────────────────────────────────────────

function ManagementView({ season }) {
    const [activeSection, setActiveSection] = useState("drivers");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`/api/${activeSection}`);
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [activeSection]);

    const handleDelete = async (id) => {
        if (!confirm(`Are you sure you want to delete this ${activeSection.slice(0, -1)}?`)) return;
        try {
            await fetch(`/api/${activeSection}/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Simple numeric conversions
        if (data.id) data.id = Number(data.id);
        if (data.teamId) data.teamId = Number(data.teamId);
        if (data.points) data.points = Number(data.points);
        if (data.number) data.number = Number(data.number);

        try {
            const method = editingItem ? 'PUT' : 'POST';
            const url = editingItem ? `/api/${activeSection}/${editingItem.id}` : `/api/${activeSection}`;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setShowModal(false);
                setEditingItem(null);
                fetchData();
            } else {
                const err = await res.json();
                alert(err.message || "Operation failed.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <div style={{ display: "flex", gap: "3rem" }}>
                    {["drivers", "teams", "news", "races"].map(sec => (
                        <button
                            key={sec}
                            className={`nav-link-pro ${activeSection === sec ? "active" : ""}`}
                            onClick={() => setActiveSection(sec)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                            {sec.toUpperCase()}_CONTROL
                        </button>
                    ))}
                </div>
                <button
                    className="michroma"
                    onClick={() => { setEditingItem(null); setShowModal(true); }}
                    style={{
                        background: 'var(--f1-red)',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        fontSize: '0.6rem',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        borderRadius: '2px'
                    }}
                >
                    ADD_NEW_{activeSection.slice(0, -1).toUpperCase()}
                </button>
            </div>

            <div className="pro-card-absolute" style={{ padding: '0', background: 'rgba(2, 4, 8, 0.4)', position: 'relative' }}>
                <div className="hud-corner hud-bl" />
                <div style={{ overflowX: 'auto' }}>
                    <table className="standing-table-pro" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.5rem 2.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', letterSpacing: '1px' }}>ID</th>
                                <th style={{ padding: '1.5rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', letterSpacing: '1px' }}>NAME / TITLE</th>
                                <th style={{ padding: '1.5rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-mute)', letterSpacing: '1px' }}>METADATA</th>
                                <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right', fontSize: '0.65rem', color: 'var(--text-mute)', letterSpacing: '1px' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }} className="michroma">SYNCHRONIZING...</td></tr>
                            ) : items.map((item) => (
                                <tr key={item.id} className="standing-row-pro">
                                    <td style={{ padding: '1.2rem 2.5rem', opacity: 0.5, fontFamily: 'Michroma', fontSize: '0.7rem' }}>{item.id}</td>
                                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>{item.name || item.title}</td>
                                    <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-mute)' }}>
                                        {activeSection === 'drivers' && `${item.teamName} // ${item.status}`}
                                        {activeSection === 'teams' && `${item.teamPrincipal} // ${item.nationality}`}
                                        {activeSection === 'news' && `${item.category} // S${item.season}`}
                                        {activeSection === 'races' && `${item.circuit} // ${item.date} // S${item.season}`}
                                    </td>
                                    <td style={{ padding: '1.2rem 2.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => { setEditingItem(item); setShowModal(true); }}
                                                style={{ background: 'none', border: 'none', color: 'var(--telemetry-cyan)', cursor: 'pointer', fontSize: '0.6rem', fontFamily: 'Michroma' }}
                                            >
                                                EDIT
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--f1-red)', cursor: 'pointer', fontSize: '0.6rem', fontFamily: 'Michroma' }}
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 5000, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <div className="pro-card-absolute" style={{ width: '500px', padding: '3rem', position: 'relative' }}>
                        <div className="hud-corner hud-tl" />
                        <h2 className="michroma" style={{ fontSize: '1rem', marginBottom: '2rem' }}>{editingItem ? 'EDIT' : 'CREATE'}_{activeSection.slice(0, -1).toUpperCase()}</h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>NAME_{activeSection === 'news' ? 'TITLE' : 'IDENTITY'}</label>
                                <input name={activeSection === 'news' ? 'title' : 'name'} defaultValue={editingItem?.name || editingItem?.title} required className="hud-input" />
                            </div>

                            {activeSection === 'drivers' && (
                                <>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>TEAM_ID</label>
                                            <input name="teamId" type="number" defaultValue={editingItem?.teamId} required className="hud-input" />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>NUMBER</label>
                                            <input name="number" type="number" defaultValue={editingItem?.number} required className="hud-input" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>STATUS</label>
                                        <select name="status" defaultValue={editingItem?.status || "Active"} className="hud-input hud-select">
                                            <option value="Active">Active</option>
                                            <option value="Third">Third Driver</option>
                                            <option value="Reserve">Reserve</option>
                                            <option value="Retired">Retired</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>PROFILE_IMAGE_URL</label>
                                            <input name="imageUrl" defaultValue={editingItem?.imageUrl} placeholder="https://..." className="hud-input" />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>COVER_IMAGE_URL</label>
                                            <input name="coverImageUrl" defaultValue={editingItem?.coverImageUrl} placeholder="https://..." className="hud-input" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeSection === 'news' && (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>SUMMARY</label>
                                        <textarea name="summary" defaultValue={editingItem?.summary} required className="hud-input" style={{ minHeight: '100px', resize: 'vertical' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>HERO_IMAGE_URL</label>
                                        <input name="imageUrl" defaultValue={editingItem?.imageUrl} placeholder="https://..." className="hud-input" />
                                    </div>
                                </>
                            )}

                            {activeSection === 'races' && (
                                <>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>ROUND</label>
                                            <input name="round" type="number" defaultValue={editingItem?.round} required className="hud-input" />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>SEASON</label>
                                            <input name="season" type="number" defaultValue={editingItem?.season || season} required className="hud-input" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>CIRCUIT</label>
                                            <input name="circuit" defaultValue={editingItem?.circuit} required className="hud-input" />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>DATE (YYYY-MM-DD)</label>
                                            <input name="date" defaultValue={editingItem?.date} placeholder="2026-03-05" required className="hud-input" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>WINNER_NAME</label>
                                            <input name="winnerName" defaultValue={editingItem?.winnerName} className="hud-input" />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>POLE_NAME</label>
                                            <input name="poleName" defaultValue={editingItem?.poleName} className="hud-input" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="michroma" style={{ fontSize: '0.55rem', opacity: 0.5 }}>STATUS</label>
                                        <select name="status" defaultValue={editingItem?.status || "provisional"} className="hud-input hud-select">
                                            <option value="provisional">Provisional</option>
                                            <option value="finalized">Finalized</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="hud-btn" style={{ flex: 1 }}>EXECUTE_SAVE</button>
                                <button type="button" className="hud-btn" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'none' }}>ABORT</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Re-hydration logic from URL
    const initialTab = searchParams.get("tab") || "intelligence";
    const initialSubTab = searchParams.get("subtab") || (initialTab === "paddock" ? "teams" : "");
    const initialSeason = searchParams.get("season") ? Number(searchParams.get("season")) : 2024;

    const [activeTab, setActiveTab] = useState(initialTab);
    const [paddockTab, setPaddockTab] = useState(initialSubTab);
    const [season, setSeason] = useState(initialSeason);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [stats, setStats] = useState(null);
    const [teams, setTeams] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState("");
    const [user, setUser] = useState(null);

    // Fetch User Profile
    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(res => {
                console.log("DEBUG: User session fetched:", res);
                if (res.success) {
                    setUser(res.data);
                }
            })
            .catch(err => console.error("Session check failed", err));
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    useEffect(() => {
        const sTab = searchParams.get("tab");
        const sSub = searchParams.get("subtab");
        const sSeason = searchParams.get("season");

        if (sTab) setActiveTab(sTab);
        if (sSub) setPaddockTab(sSub);
        if (sSeason) setSeason(Number(sSeason));
    }, [searchParams]);

    useEffect(() => {
        const articleId = searchParams.get("articleId");
        if (articleId && stats?.news) {
            const art = stats.news.find(n => n.id === Number(articleId));
            if (art) setSelectedArticle(art);
        }
    }, [searchParams, stats]);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            apiFetch(`/api/stats?season=${season}`),
            apiFetch("/api/teams"),
            apiFetch(`/api/drivers?season=${season}`)
        ]).then(([sRes, tRes, dRes]) => {
            setStats(sRes.data);
            setTeams(tRes.data);
            setDrivers(dRes.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [season]);

    const intro = useMemo(() => SEASON_INTROS[season] || SEASON_INTROS[2024], [season]);

    return (
        <>
            <div className="fluid-bg" />
            <div className="scanline" />
            <div className="noise-overlay" />

            {/* Top Bar Navigation (Standardized) */}
            <div style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-glass)', height: '40px', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2001 }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', width: '100%' }}>
                    {["AUTHENTICS", "STORE", "TICKETS", "HOSPITALITY", "EXPERIENCES"].map(item => (
                        <button key={item} style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.55rem', fontWeight: 'bold', cursor: 'pointer', opacity: 0.7 }}>{item}</button>
                    ))}
                    <div style={{ height: '14px', width: '1px', background: 'var(--border-glass)' }} />
                    <div style={{ opacity: 0.4 }}>
                        <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/4/42/FIA_logotype.svg/langfr-500px-FIA_logotype.svg.png" style={{ height: '20px', filter: 'var(--theme-invert)' }} alt="FIA" />
                    </div>
                </div>
            </div>

            <DataTicker stats={stats} />

            <Navbar
                activeTab={activeTab}
                season={season}
                setSelectedArticle={setSelectedArticle}
                onSeasonChange={(s) => {
                    console.log("SWITCHING_SEASON_TO:", s);
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("season", s.toString());
                    params.delete("articleId"); // Clear any active article on season change
                    setSelectedArticle(null);
                    router.push(`/dashboard?${params.toString()}`, { scroll: false });
                }}
                user={user}
                onLogout={handleLogout}
            />


            <main>
                {(!selectedArticle && !searchParams.get("articleId")) ? (
                    <>
                        {activeTab !== "management" && (
                            <header className="hero-hud container">
                                <div className="hero-hud-content">
                                    <div className="hud-corner hud-tl" />
                                    <div className="hud-corner hud-tr" />
                                    <div className="hud-corner hud-bl" />
                                    <div className="hud-corner hud-br" />

                                    {intro.heroImageUrl ? (
                                        <div style={{
                                            marginBottom: '2rem',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            position: 'relative',
                                            maxHeight: '320px'
                                        }}>
                                            <div className="scanline" style={{ opacity: 0.1 }} />
                                            <img
                                                src={intro.heroImageUrl}
                                                alt="Season Hero"
                                                style={{
                                                    width: '100%',
                                                    height: '320px',
                                                    display: 'block',
                                                    objectFit: 'cover',
                                                    filter: 'brightness(0.8) contrast(1.2)'
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <h1 className="michroma">{intro.title.split(' ')[0]} {intro.title.split(' ')[1]}<br /><span style={{ color: 'var(--f1-red)' }}>{intro.title.split(' ').slice(2).join(' ')}.</span></h1>
                                    )}
                                    <p className="michroma" style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '4px', maxWidth: '800px', lineHeight: 2, marginBottom: '2rem' }}>
                                        {intro.description.toUpperCase()}
                                    </p>

                                    <div className="status-bar">
                                        <span>LOCAL_TIME: <b>{currentTime || "SYNCING..."}</b></span>
                                        {intro.moments.map((m, i) => (
                                            <span key={i}>KEY_MOMENT_0{i + 1}: <b style={{ color: 'var(--f1-red)' }}>{m}</b></span>
                                        ))}
                                    </div>
                                </div>
                            </header>
                        )}

                        <div className="container" style={{ minHeight: "900px" }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '12rem', color: 'var(--telemetry-cyan)', fontFamily: 'Michroma', fontSize: '0.6rem', letterSpacing: '6px' }}> [ QUERYING_CENTRAL_PADDOCK_INTEL ] </div>
                            ) : (
                                <>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)", y: 20 }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)", y: -20 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ width: "100%" }}
                                        >
                                            {activeTab === "intelligence" && <IntelligenceView stats={stats} season={season} />}
                                            {activeTab === "editorial" && <EditorialView season={season} onOpenArticle={setSelectedArticle} />}
                                            {activeTab === "paddock" && <PaddockView teams={teams} drivers={drivers} paddockTab={paddockTab} season={season} />}
                                            {activeTab === "management" && user?.role === "admin" && <ManagementView season={season} />}
                                        </motion.div>
                                    </AnimatePresence>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="container" style={{ paddingTop: '6rem', minHeight: '80vh' }}>
                        {selectedArticle ? (
                            <ArticleReader article={selectedArticle} onBack={() => {
                                setSelectedArticle(null);
                                // Clean URL
                                const url = new URL(window.location);
                                url.searchParams.delete("articleId");
                                window.history.pushState({}, '', url);
                            }} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '12rem', color: 'var(--telemetry-cyan)', fontFamily: 'Michroma', fontSize: '0.6rem', letterSpacing: '6px' }}> [ DATA_STREAM_LOADING_ARTICLE_CONTENT ] </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />

        </>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
