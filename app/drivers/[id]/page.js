/**
 * app/drivers/[id]/page.js — "Absolute Pro" Driver Intelligence Profile
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const proxy = (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=800&fit=cover`;

const apiFetch = async (url) => {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Fetch failed");
    return json;
};

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
                crossOrigin="anonymous"
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

export default function DriverProfile() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const season = searchParams.get("season") || "2024";
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(`/api/drivers/${id}`)
            .then(res => {
                setDriver(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
            <div className="michroma" style={{ color: 'var(--f1-red)', fontSize: '0.6rem', letterSpacing: '8px' }}>[ SYNCHRONIZING_DRIVER_INTEL ]</div>
        </div>
    );

    if (!driver) return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
            <div className="michroma" style={{ color: 'var(--f1-red)', fontSize: '0.6rem' }}>LINK_LOST: DATA_PACKET_NOT_FOUND</div>
        </div>
    );

    return (
        <div className="driver-profile-view">
            <div className="fluid-bg" />
            <div className="scanline" />
            <div className="noise-overlay" />

            <nav className="navbar">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Link href={`/dashboard?tab=paddock&subtab=drivers&season=${season}`} style={{ textDecoration: 'none' }}>
                        <div className="nav-link-pro active" style={{ fontSize: '0.6rem', letterSpacing: '3px', whiteSpace: 'nowrap' }}>
                            {"< PADDOCK_RETURN"}
                        </div>
                    </Link>
                    <div className="michroma" style={{ fontSize: '0.5rem', color: 'var(--text-main)', opacity: 0.5, letterSpacing: '4px', textAlign: 'right', marginLeft: '2rem' }}>
                        SECURE_LINK // ID_{driver.id.toString().padStart(4, '0')}
                    </div>
                </div>
            </nav>

            <main className="container" style={{ paddingTop: '1rem' }}>
                {/* CINEMATIC COVER HERO */}
                {driver.coverImageUrl && (
                    <div className="pro-card-absolute col-12" style={{ padding: 0, height: '400px', marginBottom: '1.5rem', overflow: 'hidden', position: 'relative' }}>
                        <div className="hud-corner hud-tl" />
                        <div className="hud-corner hud-tr" />
                        <div className="hud-corner hud-bl" />
                        <div className="hud-corner hud-br" />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent 60%, var(--bg-obsidian))', zIndex: 5 }} />
                        <ImageWithFallback src={driver.coverImageUrl} alt={`${driver.name} Cover`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: '2rem', left: '3rem', zIndex: 10 }}>
                            <div className="michroma" style={{ fontSize: '0.6rem', color: 'var(--f1-red)', marginBottom: '0.5rem', letterSpacing: '4px' }}>// CINEMATIC_PROFILE_HERO</div>
                            <div className="michroma" style={{ fontSize: '1.2rem', color: 'var(--text-main)', opacity: 0.9 }}>{driver.name.toUpperCase()} // AT SPEED</div>
                        </div>
                    </div>
                )}

                <div className="dash-grid-absolute" style={{ paddingTop: 0 }}>
                    {/* HERO / PHOTO SECTION */}
                    <div className="pro-card-absolute col-6" style={{ padding: '0', position: 'relative', height: 'fit-content' }}>
                        <div className="hud-corner hud-tl" />
                        <div className="hud-corner hud-tr" />
                        <div style={{ position: 'absolute', top: '2rem', left: '2.5rem', zIndex: 10 }}>
                            <div className="michroma" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--f1-red)', marginBottom: '-0.5rem' }}>{driver.number}</div>
                            <div className="michroma" style={{ fontSize: '0.6rem', color: 'var(--text-main)', opacity: 0.6 }}>PERMANENT_NUMBER</div>
                        </div>
                        <ImageWithFallback src={driver.imageUrl} alt={driver.name} style={{ height: '700px', width: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* INTEL SECTION */}
                    <div className="pro-card-absolute col-6" style={{ padding: '4rem' }}>
                        <div className="hud-corner hud-br" />
                        <div className="pro-card-label">DRIVER_SPEC_ARCHIVE</div>

                        <h1 className="michroma" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1 }}>
                            {driver.name.split(' ')[0]}<br />
                            <span style={{ color: 'var(--f1-red)' }}>{driver.name.split(' ').slice(1).join(' ').toUpperCase()}</span>
                        </h1>
                        <div className="michroma" style={{ fontSize: '0.7rem', color: 'var(--telemetry-cyan)', marginBottom: '3rem' }}>
                            {driver.nationality} // {driver.teamName?.toUpperCase()}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                            {[
                                { label: 'CHAMPIONSHIPS', val: driver.championships },
                                { label: 'GRAND_PRIX_WINS', val: driver.careerWins },
                                { label: 'PODIUM_FINISHES', val: driver.podiums || '0' },
                                { label: 'POLE_POSITIONS', val: driver.poles || '0' },
                                { label: 'FASTEST_LAPS', val: driver.fastestLaps || '0' },
                                { label: 'ENTRY_ERA', val: driver.specs?.entry || 'TBC' }
                            ].map((s, i) => (
                                <div key={i} style={{ borderLeft: '2px solid rgba(255,255,255,0.05)', paddingLeft: '1.5rem' }}>
                                    <div className="michroma" style={{ fontSize: '0.4rem', opacity: 0.4, marginBottom: '8px' }}>{s.label}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.val}</div>
                                </div>
                            ))}
                        </div>

                        <div className="pro-card-label" style={{ position: 'static', marginBottom: '1.5rem' }}>TACTICAL_PROFILE</div>
                        <div className="telemetry-chip" style={{ width: '100%', padding: '1.2rem', marginBottom: '3rem', fontSize: '0.65rem' }}>
                            {driver.tacticalStyle || "ANALYSING_PILOT_BEHAVIOUR..."}
                        </div>

                        <div className="pro-card-label" style={{ position: 'static', marginBottom: '1.5rem' }}>NARRATIVE_INTELLIGENCE</div>
                        <p className="michroma" style={{ fontSize: '0.8rem', lineHeight: 2, opacity: 0.6, letterSpacing: '0.02em', marginBottom: '3rem' }}>
                            {driver.bio ? driver.bio.toUpperCase() : "NO_BIOGRAPHY_PACKET_SECURED."}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <div className="michroma" style={{ fontSize: '0.45rem', opacity: 0.4, marginBottom: '8px' }}>FAVORITE_CIRCUIT</div>
                                <div className="michroma" style={{ fontSize: '0.8rem', color: 'var(--telemetry-cyan)' }}>{driver.specs?.favTrack?.toUpperCase() || "UNSPECIFIED"}</div>
                            </div>
                            <div>
                                <div className="michroma" style={{ fontSize: '0.45rem', opacity: 0.4, marginBottom: '8px' }}>BIOMETRIC_HEIGHT_WEIGHT</div>
                                <div className="michroma" style={{ fontSize: '0.8rem' }}>{driver.specs?.height} / {driver.specs?.weight}</div>
                            </div>
                        </div>
                    </div>

                    {/* CAREER TIMELINE */}
                    <div className="pro-card-absolute col-12" style={{ padding: '4rem' }}>
                        <div className="hud-corner hud-tl" />
                        <div className="pro-card-label">KEY_CAREER_PROTOCOLS</div>
                        <div className="dash-grid-absolute" style={{ padding: '0', gap: '2rem' }}>
                            {driver.careerPoints ? driver.careerPoints.map((cp, i) => (
                                <div key={i} className="pro-card-absolute col-4" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem' }}>
                                    <div className="michroma" style={{ fontSize: '0.55rem', color: 'var(--f1-red)', marginBottom: '1rem' }}>SYSTEM_UPDATE_{cp.year}</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 }}>{cp.note.toUpperCase()}</div>
                                </div>
                            )) : (
                                <div className="col-12 michroma" style={{ opacity: 0.3, fontSize: '0.6rem', textAlign: 'center', padding: '4rem' }}>[ NO_HISTORICAL_DEEP_DATA_AVAILABLE ]</div>
                            )}
                        </div>
                    </div>

                    {/* SOCIAL TELEMETRY */}
                    <div className="pro-card-absolute col-12" style={{ padding: '3rem', background: 'linear-gradient(90deg, rgba(225,6,0,0.05) 0%, transparent 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="michroma" style={{ fontSize: '0.6rem', letterSpacing: '4px' }}>SOCIAL_RADAR_STATUS: <span style={{ color: 'var(--telemetry-cyan)' }}>ONLINE</span></div>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                {driver.socials ? Object.entries(driver.socials).map(([platform, url]) => (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="michroma social-link-pro"
                                        style={{
                                            fontSize: '0.5rem',
                                            opacity: 0.4,
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            color: '#fff',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        // {platform.toUpperCase()}
                                    </a>
                                )) : (
                                    ['INSTAGRAM', 'TWITTER', 'WEB_OFFICIAL'].map(p => (
                                        <div key={p} className="michroma" style={{ fontSize: '0.5rem', opacity: 0.1 }}>// {p}</div>
                                    ))
                                )}
                            </div>
                            <style jsx>{`
                                .social-link-pro:hover {
                                    opacity: 1 !important;
                                    color: var(--f1-red) !important;
                                    text-shadow: 0 0 10px rgba(225,6,0,0.5);
                                    transform: translateX(5px);
                                }
                            `}</style>
                        </div>
                    </div>
                </div>
            </main>

            <footer style={{ padding: '8rem 0', marginTop: '8rem', borderTop: '1px solid var(--border-glass)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="michroma" style={{ opacity: 0.2, fontSize: '0.5rem', letterSpacing: '4px' }}>
                        © 2026 F1_MANAGER // PILOT_ID_{driver.id} // VERIFIED
                    </div>
                </div>
            </footer>
        </div>
    );
}
