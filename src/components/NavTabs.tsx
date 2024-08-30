import clsx from "clsx";
import { NavTabsValues } from "../store/types";
import { useChartStore } from "../store/useStore";

const NavTabs = () => {
  const openTab = useChartStore().selectedTab;
  const setSelectedTab = useChartStore().setSelectedTab;

  return (
    <div className="border-b dark:border-zinc-700 px-60">
      <div className="flex gap-4 w-1/2 justify-evenly text-textLight dark:text-textDark">
        {Object.values(NavTabsValues).map((value) => (
          <button
            onClick={() => setSelectedTab(value)}
            key={value}
            className={clsx(
              " font-medium flex-1 border-b-2 pb-3",
              value === openTab ? " border-primary" : "border-transparent"
            )}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavTabs;
