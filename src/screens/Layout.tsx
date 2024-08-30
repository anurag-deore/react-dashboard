import React from "react";
import { useChartStore } from "../store/useStore";
import Summary from "./Summary";
import Analysis from "./Analysis";
import { NavTabsValues } from "../store/types";
import Settings from "./Settings";
import AreaChart from "../components/AreaChart";

const Layout = () => {
  const selectedTab = useChartStore().selectedTab;

  switch (selectedTab) {
    case NavTabsValues.Summary:
      return <Summary />;
    case NavTabsValues.Analysis:
      return <Analysis />;
    case NavTabsValues.Chart:
    case NavTabsValues.Statistics:
      return <AreaChart />;
    case NavTabsValues.Settings:
      return <Settings />;
    default:
      return <div>Unknown tab</div>;
  }
};

export default Layout;
