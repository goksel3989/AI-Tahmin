async function getMatches() {
  try {
    const leagues = [
      "soccer_germany_bundesliga",
      "soccer_spain_la_liga",
      "soccer_italy_serie_a",
      "soccer_turkey_super_league",
      "soccer_france_ligue_one",
      "soccer_netherlands_eredivisie"
    ];

    let allMatches = [];

    for (const league of leagues) {
      const res = await fetch(
        `https://api.the-odds-api.com/v4/sports/${league}/odds?apiKey=${process.env.ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`,
        { cache: "no-store" }
      );

      if (!res.ok) continue;

      const data = await res.json();
      allMatches = [...allMatches, ...data];
    }

    return allMatches.slice(0, 20);

  } catch {
    return [];
  }
}

function analyzeMatch(match) {
  const outcomes = match.bookmakers?.[0]?.markets?.[0]?.outcomes;
  if (!outcomes || outcomes.length < 2) return null;

  const home = outcomes.find(o => o.name === match.home_team);
  const away = outcomes.find(o => o.name === match.away_team);

  if (!home || !away) return null;

  const best = home.price < away.price ? home : away;

  const impliedProb = 1 / best.price;
  const confidence = (impliedProb * 100).toFixed(0);

  return {
    league: match.sport_title,
    match: `${match.home_team} vs ${match.away_team}`,
    prediction: best.name === match.home_team ? "MS1 & KG VAR" : "MS2 & KG VAR",
    odds: best.price,
    confidence,
    banko: confidence > 65
  };
}

export default async function Home() {
  const rawMatches = await getMatches();

  const analyzed = rawMatches
    .map(analyzeMatch)
    .filter(Boolean)
    .sort((a, b) => b.confidence - a.confidence);

  const bestCoupon = analyzed.slice(0, 4);
  const totalOdds = bestCoupon.reduce((acc, m) => acc * m.odds, 1);

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: 40, color: "white" }}>
      <h1 style={{ fontSize: 30 }}>🤖 AI Profesyonel Bahis Analizi</h1>

      <h2 style={{ marginTop: 30 }}>📊 Analiz Edilen Maçlar</h2>

      {analyzed.slice(0, 12).map((m, i) => (
        <div key={i} style={{
          background: "#1e293b",
          padding: 15,
          marginBottom: 10,
          borderRadius: 8
        }}>
          <strong>{m.league}</strong> <br/>
          {m.match} <br/>
          Tahmin: {m.prediction} <br/>
          Oran: {m.odds.toFixed(2)} <br/>
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
          {m.match} — {m.odds.toFixed(2)}
        </div>
      ))}

      <div style={{
        marginTop: 15,
        background: "#16a34a",
        padding: 15,
        borderRadius: 8
      }}>
        Toplam Oran: {totalOdds.toFixed(2)}
      </div>
    </div>
  );
}
