/**
 * app/teams/[id]/page.js — "Absolute Pro" Refined Team Detail
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ImageWithFallback({ src, alt, className, style }) {
    const [status, setStatus] = useState("loading");
    useEffect(() => { setStatus("loading"); }, [src]);

    return (
        <div className={`${className} image-container`} style={{ position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.01)", ...style }}>
            {status === "loading" && (
                <div className="img-overlay" style={{ display: "grid", placeItems: "center", background: 'var(--bg-obsidian)' }}>
                    <div className="pulse" style={{ width: "24px", height: "1px", background: "var(--f1-red)" }}></div>
                </div>
            )}
            {status === "error" && (
                <div className="img-overlay glass-overlay" style={{ display: "grid", placeItems: "center" }}>
                    <div className="michroma" style={{ opacity: 0.1, fontSize: "0.5rem" }}>LINK_LOST</div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={className}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                style={{
                    opacity: status === "success" ? 0.75 : 0,
                    transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: status === "error" ? "none" : "block",
                    transform: status === "loading" ? "scale(1.05)" : "scale(1)",
                    ...style
                }}
                onLoad={() => setStatus("success")}
                onError={() => setStatus("error")}
            />
        </div>
    );
}

const TEAM_THEMES = {
    "Red Bull Racing": { primary: "#0600ef", accent: "#ffec00", glow: "rgba(6, 0, 239, 0.3)" },
    "Ferrari": { primary: "#ef1a2d", accent: "#ffeb3b", glow: "rgba(239, 26, 45, 0.3)" },
    "Mercedes": { primary: "#27f4d2", accent: "#fff", glow: "rgba(39, 244, 210, 0.2)" },
    "McLaren": { primary: "#ff8000", accent: "#000000", glow: "rgba(255, 128, 0, 0.3)" },
    "Aston Martin": { primary: "#229971", accent: "#cedc00", glow: "rgba(34, 153, 113, 0.3)" },
    "Alpine": { primary: "#0093cc", accent: "#ff80ba", glow: "rgba(0, 147, 204, 0.3)" },
    "Williams": { primary: "#64c4ff", accent: "#fff", glow: "rgba(100, 196, 255, 0.3)" },
    "Sauber": { primary: "#52e252", accent: "#000", glow: "rgba(82, 226, 82, 0.3)" },
    "Haas": { primary: "#b6babd", accent: "#e6002b", glow: "rgba(182, 186, 189, 0.2)" },
    "RB": { primary: "#6692ff", accent: "#fff", glow: "rgba(102, 146, 255, 0.3)" },
    "Audi": { primary: "#000000", accent: "#f50537", glow: "rgba(245, 5, 55, 0.3)" },
    "Cadillac": { primary: "#fbaf41", accent: "#fff", glow: "rgba(251, 175, 65, 0.3)" }
};

export default function TeamDetailPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const season = searchParams.get("season") || "2024";
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/teams/${id}`)
            .then(res => res.json())
            .then(res => {
                if (res.success) setTeam(res.data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div style={{ height: "100vh", display: "grid", placeItems: "center", background: 'var(--bg-obsidian)' }}>
            <div className="michroma" style={{ color: 'var(--telemetry-cyan)', fontSize: '0.6rem', letterSpacing: '4px' }}> [ DECRYPTING_CONSTRUCTOR_STREAM ] </div>
        </div>
    );

    if (!team) return (
        <div style={{ height: "100vh", display: "grid", placeItems: "center", background: 'var(--bg-obsidian)' }}>
            <div className="michroma" style={{ color: 'var(--f1-red)', fontSize: '0.6rem' }}> ERROR: PACKET_LOSS </div>
        </div>
    );

    const theme = TEAM_THEMES[team.name] || { primary: 'var(--f1-red)', accent: '#fff', glow: 'rgba(225,6,0,0.2)' };

    return (
        <div style={{ minHeight: "100vh", position: 'relative', background: '#020408' }}>
            {/* AMBIENT LAYERS */}
            <div className="fluid-bg" style={{ opacity: 0.1 }} />
            <div className="scanline" />
            <div className="noise-overlay" style={{ opacity: 0.03 }} />

            {/* TEAM BRANDING BACKGROUND */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '25vw',
                fontFamily: 'Michroma',
                color: theme.primary,
                opacity: 0.03,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 0,
                letterSpacing: '-0.05em'
            }}>
                {team.name.split(' ')[0].toUpperCase()}
            </div>

            <nav className="navbar" style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', width: '100%', position: 'fixed', top: 0, zIndex: 100 }}>
                <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: '80px', maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 2rem' }}>
                    <Link href={`/dashboard?tab=paddock&subtab=teams&season=${season}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: '0.6rem', fontFamily: 'Michroma', letterSpacing: '2px', transition: 'color 0.3s' }}>
                        <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>&larr;</span>
                        <span className="nav-text">INTELLIGENCE_RETURN</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div className="michroma" style={{ fontSize: '0.75rem', color: theme.primary, letterSpacing: '2px', textAlign: 'right' }}>
                            <span style={{ opacity: 0.5 }}>CONSTRUCTOR_INTEL //</span> {team.name.toUpperCase()}
                        </div>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                            <img src={team.logoUrl} alt="Logo" style={{ height: "20px", filter: 'brightness(1.2)' }} referrerPolicy="no-referrer" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ paddingTop: "8rem", position: 'relative', zIndex: 1, paddingBottom: '10rem' }}>
                <div className="dash-grid-absolute">

                    {/* ── HERO CAR STAGE ────────────────────────────────────── */}
                    <div className="pro-card-absolute col-12" style={{ padding: 0, background: 'rgba(2,4,8,0.4)', borderRadius: '24px', overflow: 'hidden' }}>
                        <div className="hud-corner hud-tl" />
                        <div className="hud-corner hud-tr" />
                        <div className="hud-corner hud-bl" />
                        <div className="hud-corner hud-br" />

                        <div style={{ position: 'relative', height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* RADIAL GLOW */}
                            <div style={{
                                position: 'absolute',
                                width: '80%',
                                height: '80%',
                                background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
                                zIndex: 0
                            }} />

                            <div style={{ position: 'relative', width: '85%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageWithFallback src={team.carImageUrl} alt={team.fullName} style={{ width: "100%", height: "100%", objectFit: "contain", filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' }} />

                                {/* HUD ELEMENTS ON IMAGE */}
                                <div style={{ position: 'absolute', bottom: '15%', left: '5%', borderLeft: `2px solid ${theme.primary}`, paddingLeft: '1.5rem' }}>
                                    <div className="michroma" style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: '4px' }}>AERO_PROFILE</div>
                                    <div className="michroma" style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>L-TYPE_V2</div>
                                </div>
                                <div style={{ position: 'absolute', top: '15%', right: '5%', textAlign: 'right', borderRight: `2px solid ${theme.primary}`, paddingRight: '1.5rem' }}>
                                    <div className="michroma" style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: '4px' }}>POWER_UNIT_STREAM</div>
                                    <div className="michroma" style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>{team.powerunit.toUpperCase()}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: "4rem", borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.02))' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div className="telemetry-chip" style={{ background: theme.primary, color: '#fff', marginBottom: '1.5rem' }}>VERIFIED_PADDOCK_INTEL</div>
                                    <h1 className="michroma" style={{ fontSize: "3rem", marginBottom: '2rem', lineHeight: 1, letterSpacing: '-2px' }}>{team.fullName.toUpperCase()}</h1>
                                    <p style={{ color: 'var(--text-main)', opacity: 0.6, fontSize: '1.05rem', lineHeight: 1.8, fontWeight: 300, maxWidth: '800px' }}>{team.history}</p>
                                </div>
                                <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {[
                                        { l: 'BASE', v: team.nationality },
                                        { l: 'BUDGET_CAP', v: `$${team.budgetCap}M` },
                                        { l: 'PRINCIPAL', v: team.teamPrincipal }
                                    ].map((spec, i) => (
                                        <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                                            <div className="michroma" style={{ fontSize: '0.5rem', opacity: 0.4, marginBottom: '8px' }}>{spec.l}</div>
                                            <div className="michroma" style={{ fontSize: '0.85rem', color: theme.primary }}>{spec.v.toUpperCase()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── BENTO GRID SECTION ────────────────────────────────── */}
                    <div className="col-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* ACHIEVEMENTS */}
                        <div className="pro-card-absolute" style={{ height: '100%' }}>
                            <div className="hud-corner hud-tl" />
                            <div className="pro-card-label">HISTORICAL_ACHIEVEMENTS</div>
                            <div style={{ padding: '1rem' }}>
                                {team.achievements?.map((a, i) => (
                                    <div key={i} style={{ marginBottom: '1.5rem', display: 'flex', gap: '15px' }}>
                                        <div style={{ width: '2px', height: 'auto', background: `linear-gradient(to bottom, ${theme.primary}, transparent)` }} />
                                        <div style={{ opacity: 0.8, fontSize: '0.85rem', lineHeight: 1.5 }}>{a}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* IMPROVEMENTS */}
                        <div className="pro-card-absolute" style={{ height: '100%' }}>
                            <div className="hud-corner hud-tr" />
                            <div className="pro-card-label">LATEST_DEVELOPMENTS</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1rem' }}>
                                {team.improvements?.map((imp, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div className="pulse" style={{ width: '8px', height: '8px', background: theme.primary, borderRadius: '50%', boxShadow: `0 0 10px ${theme.primary}` }} />
                                        <div className="michroma" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>{imp.toUpperCase()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DEBRIEF STREAM */}
                        <div className="pro-card-absolute col-span-2" style={{ gridColumn: '1 / span 2', background: `linear-gradient(45deg, rgba(2,4,8,0.8) 0%, ${theme.glow} 100%)` }}>
                            <div className="hud-corner hud-bl" />
                            <div className="pro-card-label">PILOT_RADIO_DEBRIEF</div>
                            <div style={{ display: 'flex', gap: '2.5rem', padding: '1.5rem', alignItems: 'center' }}>
                                <div style={{ background: theme.primary, padding: '1.5rem', borderRadius: '12px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
                                </div>
                                <div>
                                    <p className="michroma" style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#fff', fontStyle: 'italic', letterSpacing: '0.5px' }}>
                                        "{team.driverComments || "ENCRYPTED_DATA_PACKET_PENDING"}"
                                    </p>
                                    <div className="michroma" style={{ marginTop: '1rem', fontSize: '0.5rem', color: theme.primary, opacity: 0.8 }}>SOURCE: PADDOCK_COMMS_v4.2</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── PILOT GRID ────────────────────────────────────────── */}
                    <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="pro-card-label" style={{ marginBottom: '-1rem' }}>SECURED_PILOT_STREAM</div>
                        {team.drivers?.map(d => (
                            <Link href={`/drivers/${d.id}?season=${season}`} key={d.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="pro-card-absolute" style={{ display: 'flex', height: '160px', padding: 0, cursor: 'pointer', overflow: 'hidden', group: 'true' }}>
                                    <div className="hud-corner hud-tl" />
                                    <div style={{ width: '4px', height: '100%', background: theme.primary }} />
                                    <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div className="michroma" style={{ fontSize: '0.5rem', opacity: 0.5, marginBottom: '4px' }}>PILOT_[{d.number}]</div>
                                        <div className="michroma" style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{d.name.split(' ')[1]?.toUpperCase() || d.name}</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.4, letterSpacing: '3px' }}>{d.name.split(' ')[0].toUpperCase()}</div>
                                    </div>
                                    <div style={{ width: '130px', height: '100%', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                                        <img src={d.imageUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', filter: 'grayscale(0.2) contrast(1.1)' }} referrerPolicy="no-referrer" />
                                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, rgba(2,4,8,1) 0%, transparent 100%)` }} />
                                    </div>
                                </div>
                            </Link>
                        ))}

                        <div className="pro-card-absolute" style={{ flex: 1, minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem', border: `1px dashed ${theme.glow}` }}>
                            <div className="michroma" style={{ fontSize: '0.5rem', opacity: 0.3, letterSpacing: '4px', marginBottom: '20px' }}>SYSTEM_TELEMETRY</div>
                            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                <div className="pulse" style={{ position: 'absolute', inset: 0, border: `2px solid ${theme.primary}`, borderRadius: '50%', opacity: 0.2 }} />
                                <div style={{ position: 'absolute', inset: '10px', border: `1px solid ${theme.primary}`, borderRadius: '50%', opacity: 0.4 }} />
                                <div className="michroma" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '0.6rem', color: theme.primary }}>SYNC</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer style={{ padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: '4rem', background: 'rgba(2,4,8,0.3)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="michroma" style={{ color: theme.primary, fontSize: "0.5rem", letterSpacing: '6px', opacity: 0.4 }}>SECURED_CONSTRUCTOR_STREAM // ERA_{season} // ACCESS_ALPHA</div>
                </div>
            </footer>
        </div>
    );
}
