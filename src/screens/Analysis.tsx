import React, { useEffect, useState } from "react";
import jsonData from "../components/csvjson.json";
import { StockData } from "../components/AreaChart";
import { Datacard } from "../components/Datacard";

const Analysis = () => {
  const [yearlyAverages, setYearlyAverages] = useState<
    { year: string; average: number }[]
  >([]);
  const [monthlyAverages, setMonthlyAverages] = useState<
    { month: string; average: number }[]
  >([]);

  const handleYearClick = (year: string) => {
    calculateMonthlyAverageForYear(jsonData, year);
  };

  useEffect(() => {
    const stockData = JSON.parse(JSON.stringify(jsonData));
    calculateMonthlyAverageForYear(stockData, "2020");
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

  function calculateMonthlyAverageForYear(
    stockData: StockData[],
    year: string
  ) {
    const filteredData = stockData.filter(
      (entry) => entry.Date.substring(6, 10) === year
    );

    const groupedData = new Map<string, StockData[]>();

    // Group data by month
    filteredData.forEach((entry) => {
      const month = entry.Date.substring(3, 5);
      if (!groupedData.has(month)) {
        groupedData.set(month, []);
      }
      groupedData.get(month)?.push(entry);
    });

    const monthlyAverages: { month: string; average: number }[] = [];

    // Calculate monthly averages
    for (const [month, data] of groupedData.entries()) {
      const prices = data.map((entry) => entry["Close/Last"]);
      const changes: number[] = [];

      for (let i = 1; i < prices.length; i++) {
        const change = ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100;
        changes.push(change);
      }

      const monthlyAverage =
        changes.reduce((sum, change) => sum + change, 0) / changes.length;
      monthlyAverages.push({ month: month, average: monthlyAverage });
    }
    setMonthlyAverages(monthlyAverages);
    return monthlyAverages;
  }

  if (!yearlyAverages) return null;

  return (
    <div className="p-60 flex max-h-full overflow-hidden">
      <div className="flex-[0.3] flex-col flex gap-4 overflow-y-auto">
        {yearlyAverages.map((entry) => (
          <Datacard
            title={entry.year}
            value={`${(entry.average * 100).toFixed(2)}%`}
            key={entry.year}
          />
        ))}
      </div>
      <div className="flex-[0.3]">
        {monthlyAverages.map((entry, index) => (
          <Datacard
            title={entry.month + index}
            value={`${(entry.average * 100).toFixed(2)}%`}
            key={entry.month + index}
          />
        ))}
      </div>
    </div>
  );
};

export default Analysis;
