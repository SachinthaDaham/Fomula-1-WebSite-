"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Registration failed.");
                setLoading(false);
                return;
            }

            setSuccess("Account created! Redirecting...");
            setTimeout(() => router.push("/login"), 1500);
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
                    <h1 style={{ marginBottom: "0.5rem", letterSpacing: "2px" }}>CREATE_ACCOUNT</h1>
                    <p style={{ opacity: 0.5, fontSize: "0.8rem", marginBottom: "2rem" }}>Enter your credentials to join the grid.</p>

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
                    {success && (
                        <div style={{
                            background: 'rgba(0, 255, 148, 0.1)',
                            borderLeft: '4px solid var(--telemetry-green)',
                            padding: '12px 16px',
                            color: 'var(--telemetry-green)',
                            marginBottom: '1.5rem',
                            fontSize: '0.8rem',
                            fontFamily: 'Space Grotesk',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ fontFamily: 'Michroma', fontSize: '0.6rem', letterSpacing: '1px' }}>SYS</span>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '0.6rem', fontFamily: 'Michroma', color: 'var(--text-mute)', marginBottom: '6px', letterSpacing: '1px' }}>FULL_NAME</div>
                            <input name="name" className="hud-input" placeholder="Enter given name" onChange={handleChange} required />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '0.6rem', fontFamily: 'Michroma', color: 'var(--text-mute)', marginBottom: '6px', letterSpacing: '1px' }}>SECURE_EMAIL</div>
                            <input name="email" type="email" className="hud-input" placeholder="pilot@f1.com" onChange={handleChange} required />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '0.6rem', fontFamily: 'Michroma', color: 'var(--text-mute)', marginBottom: '6px', letterSpacing: '1px' }}>ACCESS_CODE</div>
                            <input name="password" type="password" className="hud-input" placeholder="Minimum 6 characters" onChange={handleChange} required minLength="6" />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '0.6rem', fontFamily: 'Michroma', color: 'var(--text-mute)', marginBottom: '6px', letterSpacing: '1px' }}>VERIFY_CODE</div>
                            <input name="confirmPassword" type="password" className="hud-input" placeholder="Re-enter access code" onChange={handleChange} required minLength="6" />
                        </div>

                        <button type="submit" className="hud-btn" disabled={loading} style={{ marginTop: '1rem' }}>
                            {loading ? "PROCESSING_TELEMETRY..." : "INITIALIZE_REGISTRATION"}
                        </button>
                    </form>

                    <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.6, textAlign: "center" }}>
                        ALREADY_REGISTERED? <Link href="/login" style={{ color: "var(--f1-red)", textDecoration: 'none', fontWeight: 'bold' }}>ESTABLISH_LINK</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
