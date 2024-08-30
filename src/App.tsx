// app.tsx
import React, { useEffect } from "react";
import StockPrice from "./components/StockPrice";
import NavTabs from "./components/NavTabs";
import { useChartStore } from "./store/useStore";
import clsx from "clsx";
import ChatBox from "./components/ChartInfo";
import Layout from "./screens/Layout";

const App: React.FC = () => {
  const isFullScreen = useChartStore().isFullScreen;
  const darkMode = useChartStore().theme === "dark";

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={clsx(
        "flex flex-col h-max min-h-screen max-w-[100vw] items-center p-3",
        "bg-appbg-light dark:bg-appbg-dark text-textLight dark:text-textDark"
      )}
    >
      <div
        className={clsx(
          "flex flex-col grow h-full bg-white dark:bg-mainBg-dark gap-10 rounded-xl",
          isFullScreen ? "w-full" : "lg:w-[1000px] md:w-[1000px] w-full"
        )}
      >
        {!isFullScreen && <StockPrice />}
        <div className="overflow-hidden">
          {!isFullScreen && <NavTabs />}
          <Layout />
        </div>
      </div>
      {!isFullScreen && <ChatBox />}
    </div>
  );
};

export default App;
