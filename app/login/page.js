"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Login failed.");
                setLoading(false);
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("Connection error.");
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#020408",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            color: "#fff",
            fontFamily: "sans-serif"
        }}>
            <div style={{ width: "100%", maxWidth: "400px" }}>
                <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "2rem",
                    borderRadius: "8px",
                    position: "relative"
                }}>
                    <h1 style={{ marginBottom: "0.5rem", letterSpacing: "2px" }}>SIGN_IN</h1>
                    <p style={{ opacity: 0.5, fontSize: "0.8rem", marginBottom: "2rem" }}>Access the F1 Manager Command Centre.</p>

                    {error && (
                        <div style={{
                            background: 'rgba(225, 6, 0, 0.1)',
                            borderLeft: '4px solid var(--f1-red)',
                            padding: '12px 16px',
                            color: '#ff4d4d',
                            marginBottom: '1.5rem',
                            fontSize: '0.8rem',
                            fontFamily: 'Space Grotesk',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ fontFamily: 'Michroma', fontSize: '0.6rem', letterSpacing: '1px' }}>ERR</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '0.6rem', fontFamily: 'Michroma', color: 'var(--text-mute)', marginBottom: '6px', letterSpacing: '1px' }}>SECURE_EMAIL</div>
                            <input name="email" type="email" className="hud-input" placeholder="pilot@f1.com" onChange={handleChange} required />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '0.6rem', fontFamily: 'Michroma', color: 'var(--text-mute)', marginBottom: '6px', letterSpacing: '1px' }}>ACCESS_CODE</div>
                            <input name="password" type="password" className="hud-input" placeholder="Enter credentials" onChange={handleChange} required />
                        </div>

                        <button type="submit" className="hud-btn" disabled={loading} style={{ marginTop: '1rem' }}>
                            {loading ? "AUTHENTICATING_LINK..." : "AUTHORIZE_ACCESS"}
                        </button>
                    </form>

                    <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.6, textAlign: "center" }}>
                        NO_IDENTIFICATION_FOUND? <Link href="/register" style={{ color: "var(--f1-red)", textDecoration: 'none', fontWeight: 'bold' }}>REQUEST_ACCESS</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
