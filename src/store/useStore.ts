import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { StoreApi, UseBoundStore } from "zustand";
import { NavTabsValues, RangeValues } from "./types";

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
  latestPrice: number;
  currentRange: RangeValues;
  selectedTab: NavTabsValues;
};

type Actions = {
  setCurrentRange: (range: RangeValues) => void;
  setLatestPrice: (price: number) => void;
  setSelectedTab: (tab: NavTabsValues) => void;
};

export const useCountStore = create<State & Actions>()(
  devtools(
    immer((set) => ({
      latestPrice: 0,
      currentRange: RangeValues["6m"],
      selectedTab: NavTabsValues.Chart,
      setCurrentRange: (range: RangeValues) =>
        set((state) => {
          state.currentRange = range;
        }),
      setLatestPrice: (price: number) =>
        set((state) => {
          state.latestPrice = price;
        }),
      setSelectedTab: (tab: NavTabsValues) =>
        set((state) => {
          state.selectedTab = tab;
        }),
    }))
  )
);

export const useChartStore = createSelectors(useCountStore);
