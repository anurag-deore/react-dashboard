import React, { useEffect, useState } from "react";
import jsonData from "../components/csvjson.json";
import { StockData } from "../components/AreaChart";
import { StatsCard } from "../components/StatsCard";

interface SummaryData {
  lastPrice: { title: string; value: number | null } | null;
  high52Weeks: { title: string; value: number | null } | null;
  low52Weeks: { title: string; value: number | null } | null;
  marketCap: { title: string; value: number | null } | null;
  dividendYield: { title: string; value: number | null } | null;
  peRatio: { title: string; value: number | null } | null;
}

const Summary = () => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    lastPrice: null,
    high52Weeks: null,
    low52Weeks: null,
    marketCap: null,
    dividendYield: null,
    peRatio: null,
  });

  useEffect(() => {
    const stockData = JSON.parse(JSON.stringify(jsonData));
    calculateSummary(stockData);
  }, []);

  const calculateSummary = (data: StockData[]) => {
    // Extract necessary data
    const prices = data.map((entry) => entry["Close/Last"]);
    const volumes = data.map((entry) => entry.Volume);
    const dates = data.map((entry) => new Date(entry.Date));

    // Calculate last price
    const lastPrice = prices[0];

    // Calculate 52-week high/low
    const high52Weeks = Math.max(...prices.slice(52));
    const low52Weeks = Math.min(...prices.slice(52));

    // Calculate market cap (assuming you have shares outstanding)
    const sharesOutstanding = 10000000; // Replace with actual value
    const marketCap = lastPrice * sharesOutstanding;

    // Calculate dividend yield (assuming you have dividend per share)
    const dividendPerShare = 0.5; // Replace with actual value
    const dividendYield = (dividendPerShare / lastPrice) * 100;

    // Calculate P/E ratio (assuming you have earnings per share)
    const earningsPerShare = 2; // Replace with actual value
    const peRatio = lastPrice / earningsPerShare;

    setSummaryData({
      lastPrice: {
        title: "Last Price",
        value: lastPrice,
      },
      high52Weeks: {
        title: "52-Week High",
        value: high52Weeks,
      },
      low52Weeks: {
        title: "52-Week Low",
        value: low52Weeks,
      },
      marketCap: {
        title: "Market Cap",
        value: marketCap,
      },
      dividendYield: {
        title: "Dividend Yield",
        value: dividendYield,
      },
      peRatio: {
        title: "P/E Ratio",
        value: peRatio,
      },
    });
  };

  if (!summaryData.lastPrice) return null;

  return (
    <div className="flex flex-wrap p-60 gap-10 justify-between w-full">
      {Object.keys(summaryData).map((val, idx) => {
        const { title, value } = summaryData[val];
        return (
          <div key={idx} className="grow basis-1/3">
            <StatsCard
              title={title}
              value={value}
              showDivider={idx % 2 === 0}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
