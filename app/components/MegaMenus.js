"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── Mega Menu Data ───────────────────────────────────────────────────────────
export const MEGA_DRIVERS = [
    { id: 1, firstName: "Max", lastName: "Verstappen", img: "/images/drivers/verstappen-cover.jpg", teamId: 1 },
    { id: 4, firstName: "Lewis", lastName: "Hamilton", img: "/images/drivers/hamilton-profile.webp", teamId: 2 },
    { id: 5, firstName: "Charles", lastName: "Leclerc", img: "/images/drivers/leclerc-profile.webp", teamId: 2 },
    { id: 10, firstName: "Lando", lastName: "Norris", img: "/images/drivers/norris-profile.webp", teamId: 4 },
    { id: 68, firstName: "George", lastName: "Russell", img: "/images/drivers/russell-profile.webp", teamId: 3 },
    { id: 70, firstName: "Oscar", lastName: "Piastri", img: "/images/drivers/piastri-profile.webp", teamId: 4 },
    { id: 13, firstName: "Fernando", lastName: "Alonso", img: "/images/drivers/alonso-profile.webp", teamId: 5 },
    { id: 35, firstName: "Carlos", lastName: "Sainz", img: "/images/drivers/sainz-profile.webp", teamId: 7 },
    { id: 22, firstName: "Yuki", lastName: "Tsunoda", img: "/images/drivers/tsunoda-profile.webp", teamId: 8 },
    { id: 66, firstName: "Alex", lastName: "Albon", img: "/images/drivers/albon-profile.webp", teamId: 7 },
    { id: 82, firstName: "Oliver", lastName: "Bearman", img: "/images/drivers/bearman-profile.webp", teamId: 9 },
    { id: 15, firstName: "Nico", lastName: "Hülkenberg", img: "/images/drivers/hulkenberg-profile.webp", teamId: 11 },
    { id: 72, firstName: "Liam", lastName: "Lawson", img: "/images/drivers/lawson-profile.webp", teamId: 8 },
    { id: 83, firstName: "Kimi", lastName: "Antonelli", img: "https://i0.wp.com/lagazzettadelticino.com/wp-content/uploads/2025/05/Kimi_Antonelli.webp?resize=768%2C640&ssl=1", teamId: 3 },
    { id: 84, firstName: "Isack", lastName: "Hadjar", img: "/images/drivers/hadjar-profile.webp", teamId: 1 },
    { id: 85, firstName: "Gabriel", lastName: "Bortoleto", img: "https://cdn-7.motorsport.com/images/mgl/27NQLaX0/s300/gabriel-bortoleto-audi-f1-team.webp", teamId: 11 },
    { id: 81, firstName: "Franco", lastName: "Colapinto", img: "https://blob.postadeportes.com/images/2025/06/04/franco-colapinto-divide-opiniones-tras-su-participacion-con-alpine-en-f1-5bd6c551-focus-0-0-1292-860.webp", teamId: 6 },
    { id: 45, firstName: "Lance", lastName: "Stroll", img: "/images/drivers/stroll-profile.webp", teamId: 5 },
    { id: 44, firstName: "Pierre", lastName: "Gasly", img: "/images/drivers/gasly-profile.webp", teamId: 6 },
    { id: 100, firstName: "Arvid", lastName: "Lindblad", img: "/images/drivers/albon-profile.webp", teamId: 1 },
];

export const MEGA_TEAMS = [
    { id: 1, name: "Red Bull Racing", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing.png" },
    { id: 2, name: "Ferrari", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/ferrari.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/ferrari.png" },
    { id: 3, name: "Mercedes", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/mercedes.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mercedes.png" },
    { id: 4, name: "McLaren", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/mclaren.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mclaren.png" },
    { id: 5, name: "Aston Martin", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/aston-martin.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/aston-martin.png" },
    { id: 6, name: "Alpine", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/alpine.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/alpine.png" },
    { id: 7, name: "Williams", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/williams.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/williams.png" },
    { id: 8, name: "RB", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/rb.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb.png" },
    { id: 9, name: "Haas", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team.png" },
    { id: 11, name: "Audi", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber.png" },
    { id: 12, name: "Cadillac", logoUrl: "https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team.png", carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team.png" },
];

// ─── Sanitization Helper ───────────────────────────────────────────────────
const sanitizeSearch = (query) => {
    return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
};

// ─── Animation Variants ────────────────────────────────────────────────────────
const menuVariants = {
    hidden: { opacity: 0, y: -20, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.05, delayChildren: 0.1 }
    },
    exit: {
        opacity: 0,
        y: -10,
        filter: "blur(10px)",
        transition: { duration: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } }
};

// ─── Shared Drivers Mega Menu ──────────────────────────────────────────────
export function DriversMegaMenu({ active, onClose, season }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTeamId, setActiveTeamId] = useState(null);
    const seasonParam = season ? `?season=${season}` : "";

    useEffect(() => {
        if (!active) {
            setSearchQuery("");
            setActiveTeamId(null);
        }
    }, [active]);

    const filteredDrivers = MEGA_DRIVERS.filter(d => {
        const sanitized = sanitizeSearch(searchQuery);
        const nameMatch = `${d.firstName} ${d.lastName}`.toLowerCase().includes(sanitized.toLowerCase());
        const teamMatch = activeTeamId ? d.teamId === activeTeamId : true;
        return nameMatch && teamMatch;
    });

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuVariants}
                    className="mega-menu-overlay active"
                    onMouseLeave={onClose}
                    style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--mega-bg)', backdropFilter: 'blur(40px)', borderBottom: '1px solid var(--border-glass)' }}
                >
                    <div className="container" style={{ padding: '2rem 2.5rem' }}>
                        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div className="mega-search-wrapper" style={{ marginBottom: 0, flex: 1, maxWidth: '500px' }}>
                                    <span className="mega-search-icon">⌕</span>
                                    <input
                                        type="text"
                                        placeholder="TYPE_TO_SEARCH_PILOTS..."
                                        className="mega-search-input"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus={active}
                                    />
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span className="michroma" style={{ fontSize: "0.5rem", color: "var(--text-mute)", letterSpacing: "3px", display: 'block', marginBottom: '4px' }}>
                                        STATUS: ACTIVE_INTEL_STREAM
                                    </span>
                                    <span className="michroma" style={{ fontSize: "0.6rem", color: "var(--f1-red)", letterSpacing: "1px" }}>
                                        {filteredDrivers.length} / {MEGA_DRIVERS.length} PILOTS_MATCHED
                                    </span>
                                </div>
                            </div>

                            {/* Team Filter Bar */}
                            <div className="team-filter-bar">
                                <button
                                    className={`team-filter-pill${activeTeamId === null ? ' active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); setActiveTeamId(null); }}
                                    style={{
                                        boxShadow: activeTeamId === null ? "0 0 15px rgba(225,6,0,0.3)" : "none"
                                    }}
                                >
                                    ALL
                                </button>
                                {MEGA_TEAMS.map(team => (
                                    <button
                                        key={team.id}
                                        className={`team-filter-pill${activeTeamId === team.id ? ' active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); setActiveTeamId(team.id); }}
                                    >
                                        {team.name.split(' ')[0].toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mega-menu-grid">
                            <AnimatePresence>
                                {filteredDrivers.map(d => (
                                    <motion.div key={d.id} variants={itemVariants} layout>
                                        <Link
                                            href={`/drivers/${d.id}${seasonParam}`}
                                            className="driver-pill-pro"
                                            onClick={onClose}
                                            style={{ display: "flex" }}
                                        >
                                            <img
                                                src={d.img}
                                                alt={d.lastName}
                                                className="avatar-mini"
                                                loading="lazy"
                                                onError={e => { e.currentTarget.style.background = "#0d1117"; e.currentTarget.style.display = "flex"; }}
                                            />
                                            <div className="pill-info">
                                                <span className="first-name">{d.firstName}</span>
                                                <span className="last-name">{d.lastName.toUpperCase()}</span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {filteredDrivers.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{
                                        gridColumn: '1 / -1',
                                        padding: '4rem 2rem',
                                        textAlign: 'center',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '8px',
                                        border: '1px dashed rgba(255,255,255,0.1)'
                                    }}>
                                    <div className="michroma" style={{ fontSize: '1.2rem', color: 'var(--f1-red)', marginBottom: '1rem', opacity: 0.8 }}>
                                        [ ! ] NO_MATCH_FOUND
                                    </div>
                                    <p className="michroma" style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', marginBottom: '2rem' }}>
                                        TARGET_DRIVER: "{searchQuery}" NOT_DETECTED_IN_DATABASE
                                    </p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setActiveTeamId(null); }}
                                        className="mega-btn"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        RESET_FILTERS
                                    </button>
                                </motion.div>
                            )}
                        </div>
                        <div className="mega-menu-footer" style={{ marginTop: '2rem' }}>
                            <Link href={`/dashboard?tab=paddock&subtab=drivers${season ? `&season=${season}` : ""}`} className="mega-btn" onClick={onClose}>
                                ALL_PILOTS
                            </Link>
                            <Link href={`/dashboard?tab=paddock&subtab=drivers${season ? `&season=${season}` : ""}`} className="mega-btn" onClick={onClose}>
                                HALL_OF_FAME
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Shared Teams Mega Menu ────────────────────────────────────────────────
export function TeamsMegaMenu({ active, onClose, season }) {
    const [searchQuery, setSearchQuery] = useState("");
    const seasonParam = season ? `?season=${season}` : "";

    useEffect(() => {
        if (!active) setSearchQuery("");
    }, [active]);

    const filteredTeams = MEGA_TEAMS.filter(t => {
        const sanitized = sanitizeSearch(searchQuery);
        return t.name.toLowerCase().includes(sanitized.toLowerCase());
    });

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuVariants}
                    className="mega-menu-overlay active"
                    onMouseLeave={onClose}
                    style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--mega-bg)', backdropFilter: 'blur(40px)', borderBottom: '1px solid var(--border-glass)' }}
                >
                    <div className="container" style={{ padding: '2rem 2.5rem' }}>
                        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="mega-search-wrapper" style={{ marginBottom: 0, flex: 1, maxWidth: '500px' }}>
                                    <span className="mega-search-icon">⌕</span>
                                    <input
                                        type="text"
                                        placeholder="TYPE_TO_SEARCH_TEAMS..."
                                        className="mega-search-input"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus={active}
                                    />
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span className="michroma" style={{ fontSize: "0.5rem", color: "var(--text-mute)", letterSpacing: "3px", display: 'block', marginBottom: '4px' }}>
                                        STATUS: CONSTRUCTOR_INTEL_LIVE
                                    </span>
                                    <span className="michroma" style={{ fontSize: "0.6rem", color: "var(--f1-red)", letterSpacing: "1px" }}>
                                        {filteredTeams.length} / {MEGA_TEAMS.length} TEAMS_MATCHED
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="team-mega-grid">
                            <AnimatePresence>
                                {filteredTeams.map(t => (
                                    <motion.div key={t.id} variants={itemVariants} layout>
                                        <Link
                                            href={`/teams/${t.id}${seasonParam}`}
                                            className="team-card-pro"
                                            onClick={onClose}
                                        >
                                            <div className="team-card-header">
                                                <img
                                                    src={t.logoUrl} alt={t.name}
                                                    className="team-logo-mini"
                                                    loading="lazy"
                                                    onError={e => { e.currentTarget.style.display = "none"; }}
                                                />
                                                <span className="team-name-pro">{t.name.toUpperCase()}</span>
                                            </div>
                                            <div className="car-profile-container">
                                                <img
                                                    src={t.carImageUrl} alt={`${t.name} car`}
                                                    className="car-profile-img"
                                                    loading="lazy"
                                                    onError={e => { e.currentTarget.style.display = "none"; }}
                                                />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredTeams.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{
                                        gridColumn: '1 / -1',
                                        padding: '4rem 2rem',
                                        textAlign: 'center',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '8px',
                                        border: '1px dashed rgba(255,255,255,0.1)'
                                    }}>
                                    <div className="michroma" style={{ fontSize: '1.2rem', color: 'var(--f1-red)', marginBottom: '1rem', opacity: 0.8 }}>
                                        [ ! ] NO_MATCH_FOUND
                                    </div>
                                    <p className="michroma" style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', marginBottom: '2rem' }}>
                                        CONSTRUCTOR: "{searchQuery}" NOT_FOUND_IN_GRID
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mega-btn"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        RESET_FILTERS
                                    </button>
                                </motion.div>
                            )}
                        </div>
                        <div className="mega-menu-footer" style={{ marginTop: '2rem' }}>
                            <Link href={`/dashboard?tab=paddock&subtab=teams${season ? `&season=${season}` : ""}`} className="mega-btn" onClick={onClose}>
                                ALL_CONSTRUCTORS
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
