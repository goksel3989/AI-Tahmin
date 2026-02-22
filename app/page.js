"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");
      setMatches([]);

      const res = await axios.get(
        "https://api.the-odds-api.com/v4/sports/soccer/odds",
        {
          params: {
            apiKey: process.env.a08c833cf6ec998e96139816197460c5,
            regions: "eu",
            markets: "h2h",
            oddsFormat: "decimal",
          },
        }
      );

      if (!res.data || res.data.length === 0) {
        setError("Maç bulunamadı. Plan veya lig erişimini kontrol et.");
        return;
      }

      const data = res.data.slice(0, 10).map((m) => {
        const bookmaker = m.bookmakers?.[0];
        const market = bookmaker?.markets?.[0];
        const outcome = market?.outcomes?.[0];

        if (!outcome) return null;

        const odds = outcome.price;
        const probability = 1 / odds;
        const ev = probability * odds - 1;

        return {
          match: `${m.home_team} vs ${m.away_team}`,
          odds,
          ev: ev.toFixed(2),
        };
      }).filter(Boolean);

      setMatches(data);

    } catch (err) {
      setError("API hatası oluştu. Key veya planı kontrol et.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bestCoupon = () => {
    return [...matches]
      .sort((a, b) => b.ev - a.ev)
      .slice(0, 4);
  };

  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", padding: 40 }}>
      <h1>🤖 AI Bahis Sistemi</h1>

      <button
        onClick={loadMatches}
        style={{ padding: 10, background: "green", marginTop: 20 }}
      >
        Maçları Getir
      </button>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 30 }}>
        {matches.map((m, i) => (
          <div key={i} style={{ background: "#222", padding: 15, marginBottom: 10 }}>
            <h3>{m.match}</h3>
            <p>Oran: {m.odds}</p>
            <p>EV: {m.ev}</p>
          </div>
        ))}
      </div>

      {matches.length > 0 && (
        <>
          <h2 style={{ marginTop: 40 }}>🎯 En Mantıklı 4’lü Kupon</h2>
          {bestCoupon().map((m, i) => (
            <div key={i} style={{ background: "#0044cc", padding: 10, marginBottom: 5 }}>
              {m.match}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
