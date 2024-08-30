import { useChartStore } from "../store/useStore";
import clsx from "clsx";

const StockPrice = () => {
  const stockPrice = useChartStore().latestPrice;

  return (
    <div className="flex gap-5 w-full">
      {stockPrice.map((price, index) => (
        <div
          key={price.chart}
          className={clsx(
            "flex flex-col gap-2 font-medium px-60 pt-60",
            stockPrice.length - 1 !== index ? "border-r" : ""
          )}
        >
          <div className="flex items-start gap-2">
            <div className="text-huge leading-none text-secondary dark:text-secondaryDark">
              {price.value}
            </div>
            <div className="text-2xl pt-1 text-gray200">USD</div>
          </div>
          <div className="text-success text-md">{price.difference}</div>
        </div>
      ))}
    </div>
  );
};

export default StockPrice;
