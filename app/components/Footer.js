"use client";

import React from "react";

export default function Footer() {
    const partners = [
        { name: "Rolex", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Rolex_logo.svg/512px-Rolex_logo.svg.png" },
        { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/512px-Oracle_logo.svg.png" },
        { name: "Emirates", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/512px-Emirates_logo.svg.png" },
        { name: "MSC", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/MSC_Cruises_logo.svg/512px-MSC_Cruises_logo.svg.png" },
        { name: "Qatar Airways", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Qatar_Airways_Logo.svg/512px-Qatar_Airways_Logo.svg.png" },
        { name: "Pirelli", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pirelli_logo.svg/512px-Pirelli_logo.svg.png" },
        { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/512px-Amazon_Web_Services_Logo.svg.png" }
    ];

    return (
        <footer style={{ background: '#15151e', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Global Partners Section */}
            <div style={{ background: '#fff', padding: '2.5rem 0' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    <div className="michroma" style={{ color: '#000', fontSize: '0.6rem', opacity: 0.5, letterSpacing: '4px' }}>GLOBAL PARTNERS</div>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
                        {partners.map(p => (
                            <img
                                key={p.name}
                                src={p.logo}
                                alt={p.name}
                                style={{
                                    height: p.name === "Rolex" ? '35px' : '20px',
                                    filter: 'grayscale(100%) brightness(0.2)',
                                    opacity: 0.8,
                                    maxWidth: '120px',
                                    objectFit: 'contain'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '6rem 2rem 4rem' }}>
                {/* Download App Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
                    <h2 style={{
                        fontFamily: 'Michroma, sans-serif',
                        fontSize: '2.2rem',
                        fontWeight: 900,
                        margin: 0,
                        letterSpacing: '-2px',
                        lineHeight: 1
                    }}>
                        DOWNLOAD THE<br />OFFICIAL F1 APP
                    </h2>
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <a href="#" className="badge-hover">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                alt="App Store"
                                style={{ height: '48px' }}
                            />
                        </a>
                        <a href="#" className="badge-hover">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                alt="Google Play"
                                style={{ height: '48px' }}
                            />
                        </a>
                    </div>
                </div>

                {/* Navigation Links Row */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2.5rem',
                    marginBottom: '4rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '3rem'
                }}>
                    {["Schedule", "Drivers", "News", "Teams", "Fantasy & Gaming", "Cookie Preferences", "More"].map(item => (
                        <a key={item} href="#" style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            letterSpacing: '0.5px'
                        }}>
                            {item.toUpperCase()} {item === "More" && <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>▼</span>}
                        </a>
                    ))}
                </div>

                {/* The Signature F1 Red Divider */}
                <div style={{ position: 'relative', height: '12px', background: 'var(--f1-red)', marginBottom: '4rem', borderRadius: '1px' }}>
                    <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '-15px',
                        background: '#15151e',
                        padding: '0 15px 0 0',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/512px-F1.svg.png"
                            style={{ height: '18px' }}
                            alt="F1"
                        />
                    </div>
                </div>

                {/* Social and Utility Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
                    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                        {["facebook", "twitter", "instagram", "youtube"].map(social => (
                            <a key={social} href="#" style={{ opacity: 0.8, transition: '0.3s' }} className="social-icon">
                                <img
                                    src={`https://cdn.simpleicons.org/${social}/white`}
                                    alt={social}
                                    style={{ width: '22px', height: '22px' }}
                                />
                            </a>
                        ))}
                    </div>

                    <button className="michroma" style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: '#fff',
                        padding: '12px 28px',
                        fontSize: '0.65rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontWeight: 700
                    }}>
                        Display mode <span style={{ opacity: 0.5 }}>▼</span>
                    </button>
                </div>

                <div style={{
                    marginTop: '5rem',
                    fontSize: '0.7rem',
                    opacity: 0.3,
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <span>© 2003-2026 Formula One World Championship Limited</span>
                    <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                    <span style={{ color: 'var(--f1-red)' }}>PRO_LICENSE_ACTIVE</span>
                </div>
            </div>

            <style jsx>{`
                .container {
                    max-width: 1300px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                .badge-hover:hover { transform: scale(1.02); }
                .social-icon:hover { opacity: 1 !important; transform: translateY(-2px); }
            `}</style>
        </footer>
    );
}
