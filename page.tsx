"use client";

import React, { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

type BgMode = "transparent" | "white" | "black" | "gray" | "gradient";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<BgMode>("transparent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResultUrl(null);

    if (!file) return setError("Choose a photo first.");
    if (!API_BASE) return setError("Missing NEXT_PUBLIC_API_BASE env var on Vercel.");

    try {
      setLoading(true);
      const form = new FormData();
      form.append("image", file);
      const url = `${API_BASE.replace(/\/$/, "")}/process?bg=${encodeURIComponent(mode)}`;
      const res = await fetch(url, { method: "POST", body: form });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Dealership BG Studio</h1>
      <p style={{ opacity: 0.7, marginBottom: 24 }}>
        Upload a car photo → pick a background → get studio-clean images.
      </p>

      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gap: 16,
          padding: 20,
          border: "1px solid #222",
          borderRadius: 12,
          background: "#121212"
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ padding: 10, borderRadius: 8, background: "#0b0b0b", border: "1px solid #222" }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["transparent", "white", "black", "gray", "gradient"] as BgMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid " + (mode === m ? "#7c5cff" : "#222"),
                background: mode === m ? "#1a1333" : "#0f0f0f",
                color: "white",
                cursor: "pointer"
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "#7c5cff",
            color: "white",
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? "Processing…" : "Make it studio"}
        </button>

        {error && (
          <div style={{ color: "#ff6b6b" }}>
            {error}
          </div>
        )}
      </form>

      {resultUrl && (
        <section style={{ marginTop: 24 }}>
          <h3>Result</h3>
          <img
            src={resultUrl}
            alt="Processed"
            style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid #222" }}
          />
          <div style={{ marginTop: 12 }}>
            <a
              href={resultUrl}
              download="studio-car.png"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "#0f0f0f",
                border: "1px solid #222",
                color: "white",
                textDecoration: "none"
              }}
            >
              Download PNG
            </a>
          </div>
        </section>
      )}

      <footer style={{ opacity: 0.6, marginTop: 32, fontSize: 12 }}>
        Backend: <code>{API_BASE || "not set"}</code>
      </footer>
    </main>
  );
}