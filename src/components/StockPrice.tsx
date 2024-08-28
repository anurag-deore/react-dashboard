import React from "react";
import { useChartStore } from "../store/useStore";

const StockPrice = () => {
  const stockPrice = useChartStore().latestPrice;

  return (
    <div className="flex flex-col gap-2 font-medium px-60 pt-60">
      <div className="flex items-start gap-2">
        <div className="text-huge leading-none text-secondary">
          {stockPrice}
        </div>
        <div className="text-2xl pt-1 text-gray200">USD</div>
      </div>
      <div className="text-success text-md">+2161.43</div>
    </div>
  );
};

export default StockPrice;
