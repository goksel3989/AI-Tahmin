async function getMatches() {
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer/odds?apiKey=${process.env.ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`,
      { cache: "no-store" }
    );

    const data = await res.json();
    return data.slice(0, 15);
  } catch {
    return [];
  }
}

function calculateEV(odds) {
  const probability = 1 / odds;
  return probability * odds - 1;
}

export default async function Home() {
  const matches = await getMatches();

  const processed = matches
    .map((m) => {
      const outcome = m.bookmakers?.[0]?.markets?.[0]?.outcomes?.[0];
      if (!outcome) return null;

      const odds = outcome.price;
      const ev = calculateEV(odds);

      return {
        match: `${m.home_team} vs ${m.away_team}`,
        odds,
        ev,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.ev - a.ev);

  const bestCoupon = processed.slice(0, 4);
  const totalOdds = bestCoupon.reduce((acc, m) => acc * m.odds, 1);

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: 40, color: "white", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>🤖 AI Bahis Analiz Paneli</h1>

      <h2 style={{ marginBottom: 15 }}>📊 AI Analizli Maçlar</h2>

      {processed.map((m, i) => (
        <div key={i} style={{
          background: "#1e293b",
          padding: 20,
          marginBottom: 15,
          borderRadius: 10,
          display: "flex",
          justifyContent: "space-between"
        }}>
          <div>
            <h3>{m.match}</h3>
            <p>Oran: {m.odds.toFixed(2)}</p>
          </div>
          <div style={{
            background: m.ev > 0 ? "#16a34a" : "#dc2626",
            padding: "10px 15px",
            borderRadius: 8
          }}>
            EV: {m.ev.toFixed(2)}
          </div>
        </div>
      ))}

      <h2 style={{ marginTop: 40 }}>🎯 En Mantıklı 4’lü Kupon</h2>

      {bestCoupon.map((m, i) => (
        <div key={i} style={{
          background: "#2563eb",
          padding: 15,
          marginBottom: 10,
          borderRadius: 8
        }}>
          {m.match} — {m.odds.toFixed(2)}
        </div>
      ))}

      <div style={{
        marginTop: 20,
        background: "#16a34a",
        padding: 15,
        borderRadius: 8,
        fontSize: 18
      }}>
        Toplam Oran: {totalOdds.toFixed(2)}
      </div>
    </div>
  );
}
