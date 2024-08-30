import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { StoreApi, UseBoundStore } from "zustand";
import { AvailableCharts, NavTabsValues, RangeValues } from "./types";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as Record<string, unknown>)[k] = () =>
      store((s) => s[k as keyof typeof s]);
  }

  return store;
};

type State = {
  theme: "light" | "dark";
  latestPrice: Array<{
    chart: AvailableCharts;
    value: number;
    difference?: string;
  }>;
  isFullScreen: boolean;
  currentRange: RangeValues;
  selectedTab: NavTabsValues;
  selectedCharts: AvailableCharts[];
};

type Actions = {
  setTheme: (theme: "light" | "dark") => void;
  setCurrentRange: (range: RangeValues) => void;
  setLatestPrice: (
    chart: AvailableCharts,
    price: number,
    difference?: string
  ) => void;
  setSelectedTab: (tab: NavTabsValues) => void;
  updateSelectedCharts: (charts: AvailableCharts[]) => void;
  toggleFullScreen: () => void;
};

export const useCountStore = create<State & Actions>()(
  devtools(
    immer((set) => ({
      latestPrice: [{ chart: AvailableCharts.Chart1, value: 0 }],
      currentRange: RangeValues["6m"],
      selectedTab: NavTabsValues.Chart,
      selectedCharts: [AvailableCharts.Chart1],
      isFullScreen: false,
      theme: "light",
      setCurrentRange: (range: RangeValues) =>
        set((state) => {
          state.currentRange = range;
        }),
      setLatestPrice: (
        chart: AvailableCharts,
        price: number,
        difference?: string
      ) =>
        set((state) => {
          if (price < 0 || !chart) return;
          const index = state.latestPrice.findIndex((lp) => lp.chart === chart);
          if (index >= 0) {
            state.latestPrice[index] = { chart, value: price, difference };
          } else {
            state.latestPrice.push({ chart, value: price, difference });
          }
        }),
      setSelectedTab: (tab: NavTabsValues) =>
        set((state) => {
          state.selectedTab = tab;
        }),
      updateSelectedCharts: (charts: AvailableCharts[]) =>
        set((state) => {
          state.selectedCharts = charts;
          if (state.latestPrice.length > state.selectedCharts.length) {
            state.latestPrice = state.latestPrice.filter((lp) =>
              state.selectedCharts.includes(lp.chart)
            );
          }
        }),
      toggleFullScreen: () =>
        set((state) => {
          state.isFullScreen = !state.isFullScreen;
        }),
      setTheme: (theme: "light" | "dark") => set(() => ({ theme })),
    }))
  )
);

export const useChartStore = createSelectors(useCountStore);
