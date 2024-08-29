// app.tsx
import React from "react";
import AreaChart from "./components/AreaChart";
import StockPrice from "./components/StockPrice";
import NavTabs from "./components/NavTabs";
import { useChartStore } from "./store/useStore";
import clsx from "clsx";

const App: React.FC = () => {
  const isFullScreen = useChartStore().isFullScreen;

  return (
    <div className="flex flex-col h-max max-w-[100vw] items-center bg-gray50">
      <div
        className={clsx(
          "flex flex-col  h-full bg-white gap-10",
          isFullScreen ? "w-full" : "lg:w-[1000px] md:w-[1000px] w-full"
        )}
      >
        {!isFullScreen && <StockPrice />}
        <div>
          {!isFullScreen && <NavTabs />}
          <AreaChart />
        </div>
      </div>
    </div>
  );
};

export default App;
