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

                    {error && <div style={{ color: "#ff4d4d", marginBottom: "1rem", fontSize: "0.8rem" }}>{error}</div>}
                    {success && <div style={{ color: "#00ff88", marginBottom: "1rem", fontSize: "0.8rem" }}>{success}</div>}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input name="name" placeholder="Full Name" onChange={handleChange} required
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", color: "#fff", borderRadius: "4px" }} />
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} required
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", color: "#fff", borderRadius: "4px" }} />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", color: "#fff", borderRadius: "4px" }} />
                        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", color: "#fff", borderRadius: "4px" }} />

                        <button type="submit" disabled={loading}
                            style={{ background: "#E10600", border: "none", padding: "1rem", color: "#fff", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
                            {loading ? "PROCESSSING..." : "REGISTER"}
                        </button>
                    </form>

                    <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", opacity: 0.6, textAlign: "center" }}>
                        Already have an account? <Link href="/login" style={{ color: "#E10600" }}>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
