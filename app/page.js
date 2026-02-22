async function getMatches() {
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer/odds?apiKey=${process.env.ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return { error: "API bağlantı hatası" };
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return { error: "Maç bulunamadı veya plan yetersiz" };
    }

    return data.slice(0, 10);

  } catch (e) {
    return { error: "Sunucu hatası" };
  }
}

export default async function Home() {
  const matches = await getMatches();

  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", padding: 40 }}>
      <h1>🤖 AI Bahis Sistemi</h1>

      {matches.error && (
        <p style={{ color: "red" }}>{matches.error}</p>
      )}

      {!matches.error &&
        matches.map((m, i) => {
          const odds =
            m.bookmakers?.[0]?.markets?.[0]?.outcomes?.[0]?.price || 1.5;

          return (
            <div key={i} style={{ background: "#222", padding: 15, marginBottom: 10 }}>
              <h3>{m.home_team} vs {m.away_team}</h3>
              <p>Oran: {odds}</p>
            </div>
          );
        })}
    </div>
  );
}
