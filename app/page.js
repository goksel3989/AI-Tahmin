"use client";
import { useState } from "react";

export default function Home() {
  const [risk, setRisk] = useState("low");
  const [stake, setStake] = useState(100);

  // Simüle AI analiz motoru
  const generateAI = () => {
    const sampleLeagues = [
      "Bundesliga",
      "LaLiga",
      "Serie A",
      "Süper Lig",
      "Ligue 1",
      "Eredivisie"
    ];

    const matches = [];

    for (let i = 0; i < 15; i++) {
      const odds =
        risk === "low"
          ? (1.30 + Math.random() * 0.40)
          : risk === "medium"
          ? (1.70 + Math.random() * 0.60)
          : (2.30 + Math.random() * 1.50);

      const confidence =
        risk === "low"
          ? 75 + Math.random() * 20
          : risk === "medium"
          ? 60 + Math.random() * 20
          : 45 + Math.random() * 25;

      matches.push({
        league: sampleLeagues[Math.floor(Math.random() * sampleLeagues.length)],
        match: `Takım ${i + 1} vs Takım ${i + 2}`,
        prediction: "MS1 & KG VAR",
        odds: odds.toFixed(2),
        confidence: confidence.toFixed(0),
        banko: confidence > 80
      });
    }

    return matches;
  };

  const aiMatches = generateAI();

  const bestCoupon = [...aiMatches]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4);

  const totalOdds = bestCoupon.reduce((acc, m) => acc * m.odds, 1);
  const potentialWin = totalOdds * stake;

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: 40, color: "white" }}>
      <h1 style={{ fontSize: 30 }}>🤖 AI Tahmin Paneli</h1>

      <div style={{ marginTop: 20 }}>
        <label>Risk Seviyesi: </label>
        <select value={risk} onChange={(e) => setRisk(e.target.value)}>
          <option value="low">Düşük (Banko)</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
      </div>

      <h2 style={{ marginTop: 30 }}>📊 AI Analiz Sonuçları</h2>

      {aiMatches.map((m, i) => (
        <div key={i} style={{
          background: "#1e293b",
          padding: 15,
          marginBottom: 10,
          borderRadius: 8
        }}>
          <strong>{m.league}</strong> <br/>
          {m.match} <br/>
          Tahmin: {m.prediction} <br/>
          Oran: {m.odds} <br/>
          Güven: %{m.confidence} {m.banko && "🔥 BANKO"}
        </div>
      ))}

      <h2 style={{ marginTop: 40 }}>🎯 En Mantıklı 4’lü Kupon</h2>

      {bestCoupon.map((m, i) => (
        <div key={i} style={{
          background: "#2563eb",
          padding: 10,
          marginBottom: 8,
          borderRadius: 6
        }}>
          {m.match} — {m.odds}
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <label>Bahis Tutarı: </label>
        <input
          type="number"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
        />
      </div>

      <div style={{
        marginTop: 15,
        background: "#16a34a",
        padding: 15,
        borderRadius: 8
      }}>
        Toplam Oran: {totalOdds.toFixed(2)} <br/>
        Olası Kazanç: {potentialWin.toFixed(2)} ₺
      </div>
    </div>
  );
}
