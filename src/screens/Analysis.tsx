import React, { useEffect, useState } from "react";
import jsonData from "../components/csvjson.json";
import { StockData } from "../components/AreaChart";
import { Datacard } from "../components/Datacard";

const Analysis = () => {
  const [yearlyAverages, setYearlyAverages] = useState<
    { year: string; average: number }[]
  >([]);


  useEffect(() => {
    const stockData = JSON.parse(JSON.stringify(jsonData));
    // setStockData(stockData);
    calculateYearlyAverage(stockData);
  }, []);

  function calculateYearlyAverage(stockData: StockData[]) {
    const groupedData = new Map<string, StockData[]>();

    // Group data by year
    stockData.forEach((entry) => {
      const year = entry.Date.substring(6, 10);
      if (!groupedData.has(year)) {
        groupedData.set(year, []);
      }
      groupedData.get(year)?.push(entry);
    });

    const yearlyAverages: { year: string; average: number }[] = [];

    // Calculate yearly averages
    for (const [year, data] of groupedData.entries()) {
      const prices = data.map((entry) => entry["Close/Last"]);
      const changes: number[] = [];

      for (let i = 1; i < prices.length; i++) {
        const change = ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100;
        changes.push(change);
      }

      const yearlyAverage =
        changes.reduce((sum, change) => sum + change, 0) / changes.length;
      yearlyAverages.push({ year: year, average: yearlyAverage });
    }

    setYearlyAverages(yearlyAverages);
  }
  if (!yearlyAverages) return null;

  return (
    <div className="p-60 flex max-h-full gap-8 flex-wrap overflow-hidden flex-col">
      <h3 className="font-medium text-secondary text-2xl">Year Wise Analysis</h3>
      <div className="grid grid-cols-2 gap-4 flex-wrap justify-between">
        {yearlyAverages.map((entry) => (
          <Datacard
            title={entry.year}
            isPositive={entry.average > 0}
            value={`${(entry.average * 100).toFixed(2)}%`}
            key={entry.year}
            />
        ))}
      </div>
    </div>
  );
};

export default Analysis;
