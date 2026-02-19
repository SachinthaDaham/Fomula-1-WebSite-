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

                    {error && <div style={{ color: "#ff4d4d", marginBottom: "1rem", fontSize: "0.8rem" }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} required
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", color: "#fff", borderRadius: "4px" }} />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.8rem", color: "#fff", borderRadius: "4px" }} />

                        <button type="submit" disabled={loading}
                            style={{ background: "#E10600", border: "none", padding: "1rem", color: "#fff", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
                            {loading ? "AUTHENTICATING..." : "SIGN IN"}
                        </button>
                    </form>

                    <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", opacity: 0.6, textAlign: "center" }}>
                        No account? <Link href="/register" style={{ color: "#E10600" }}>Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
