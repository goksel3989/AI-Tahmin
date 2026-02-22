export async function GET() {
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer/odds?apiKey=${process.env.ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`
    );

    const data = await res.json();

    return Response.json(data);

  } catch (error) {
    return Response.json({ error: "API error" }, { status: 500 });
  }
}
