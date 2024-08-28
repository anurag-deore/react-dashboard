// app.tsx
import React from "react";
import AreaChart from "./components/AreaChart";
import StockPrice from "./components/StockPrice";
import NavTabs from "./components/NavTabs";

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-max w-screen items-center bg-gray50">
      <div className="flex flex-col lg:w-[1000px] md:w-[1000px] w-full h-full bg-white gap-10">
        <StockPrice />
        <div>
          <NavTabs />
          <AreaChart />
        </div>
      </div>
    </div>
  );
};

export default App;
