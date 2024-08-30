import { RangeValues } from "../store/types";
import clsx from "clsx";
import { useChartStore } from "../store/useStore";
import IconButton from "./IconButton";
import { FullScreen } from "../icons/FullScreen";
import { CompareMenu } from "./CompareMenu";

const RangeTabs = () => {
  const selectedRange = useChartStore().currentRange;
  const setSelectedRange = useChartStore().setCurrentRange;
  const toggleFullScreen = useChartStore().toggleFullScreen;

  return (
    <div className="flex justify-between items-center pr-32">
      <div className="flex items-center gap-3">
        <IconButton
          onClick={() => toggleFullScreen()}
          icon={<FullScreen />}
          title="Full Screen"
        />
        <CompareMenu />
      </div>
      <div className="flex gap-1 w-1/2 items-center justify-evenly">
        {Object.values(RangeValues).map((value) => (
          <button
            key={value}
            className={clsx(
              "rounded text-md font-medium flex-1",
              selectedRange === value
                ? "bg-primary text-white rounded"
                : "text-textLight dark:text-textDark hover:text-secondary"
            )}
            onClick={() => setSelectedRange(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RangeTabs;
