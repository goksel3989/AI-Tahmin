"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [matches, setMatches] = useState([]);

  const loadMatches = async () => {
    const res = await axios.get(
      `https://api.the-odds-api.com/v4/sports/soccer_epl/odds`,
      {
        params: {
          apiKey: process.env.NEXT_PUBLIC_ODDS_API_KEY,
          regions: "eu",
          markets: "h2h",
          oddsFormat: "decimal",
        },
      }
    );

    const data = res.data.slice(0, 10).map((m) => {
      const homeOdds =
        m.bookmakers?.[0]?.markets?.[0]?.outcomes?.[0]?.price || 1.5;

      const probability = 1 / homeOdds;
      const ev = probability * homeOdds - 1;

      return {
        match: `${m.home_team} vs ${m.away_team}`,
        odds: homeOdds,
        ev: ev.toFixed(2),
      };
    });

    setMatches(data);
  };

  const bestCoupon = () => {
    return [...matches].sort((a, b) => b.ev - a.ev).slice(0, 4);
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

      <div style={{ marginTop: 30 }}>
        {matches.map((m, i) => (
          <div key={i} style={{ background: "#222", padding: 15, marginBottom: 10 }}>
            <h3>{m.match}</h3>
            <p>Oran: {m.odds}</p>
            <p>EV: {m.ev}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>🎯 En Mantıklı 4’lü Kupon</h2>
      {bestCoupon().map((m, i) => (
        <div key={i} style={{ background: "#0044cc", padding: 10, marginBottom: 5 }}>
          {m.match}
        </div>
      ))}
    </div>
  );
}
