import { fetchHistoricalData } from "@/lib/utils";

export async function POST(req: Request) {
  const { symbol, period1, period2 } = await req.json();

  const historicalData = await fetchHistoricalData(symbol, {
    period1,
    period2,
  });
  const body = JSON.stringify(historicalData);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
