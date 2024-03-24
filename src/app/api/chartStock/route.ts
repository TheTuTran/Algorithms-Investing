import yahooFinance from "yahoo-finance2";

export async function POST(req: Request) {
  const { symbol, period1, period2 } = await req.json();
  const queryOptions = { period1, period2, interval: "1m" };
  // @ts-ignore
  const result = await yahooFinance.chart(symbol, queryOptions);
  const body = JSON.stringify(result);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
