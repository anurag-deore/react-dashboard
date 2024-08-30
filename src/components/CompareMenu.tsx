import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { AddCircle } from "../icons/AddCircle";
import { useChartStore } from "../store/useStore";
import { AvailableCharts } from "../store/types";
import { CheckTick } from "../icons/Check";
import { chartColors } from "../utils/constants";
import clsx from "clsx";

export function CompareMenu() {
  const selectedCharts = useChartStore().selectedCharts;
  const updateSelectedCharts = useChartStore().updateSelectedCharts;

  const onSelect = (chart: AvailableCharts) => {
    if (chart === AvailableCharts.Chart1) return;
    updateSelectedCharts(
      selectedCharts.includes(chart)
        ? selectedCharts.filter((c) => c !== chart)
        : [...selectedCharts, chart]
    );
  };

  return (
    <Menu>
      <MenuButton
        className={
          "flex items-center gap-2 rounded text-md" +
          "font-medium text-textLight dark:text-textDark hover:text-secondary"
        }
      >
        <span className="h-5 w-5 shrink-0">
          <AddCircle />
        </span>
        <span className="text-md font-medium leading-none">Compare</span>
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        className="border dark:border-mainBg-dark  bg-white dark:bg-appbg-dark  shadow-xl rounded-md p-1 mt-3 w-40 flex flex-col gap-1"
      >
        {Object.values(AvailableCharts).map((chart, index) => {
          const isSelected = selectedCharts.includes(chart);
          return (
            <MenuItem key={chart}>
              <div
                onClick={() => onSelect(chart)}
                className={clsx(
                  "flex px-2 items-center text-textLight dark:text-textDark justify-between",
                  "gap-2 rounded-md hover:bg-gray-100 hover:dark:bg-zinc-600 p-1",
                  index === 0 ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                <span className="font-medium">{chart}</span>
                <div className="flex gap-2 shrink-0">
                  <div className="!h-4 !w-4">{isSelected && <CheckTick />}</div>
                  <div
                    className="h-4 w-4 text-white rounded"
                    style={{ background: chartColors[index] }}
                  ></div>
                </div>
              </div>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
