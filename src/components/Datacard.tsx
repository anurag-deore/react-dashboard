import clsx from "clsx";
import { TrendIconDown, TrendIconUp } from "../icons/ChartIcon";

export const Datacard = ({
  title,
  value,
  isPositive,
}: {
  title: string;
  value: string;
  isPositive: boolean;
}) => {
  return (
    <div
      className={clsx(
        "dark:bg-mainBg-dark rounded cursor-pointer flex-wrap w-full",
        "flex justify-between gap-2 text-secondary dark:text-textDark p-3",
        "border border-gray100 dark:border-gray-600 pr-10"
      )}
    >
      <div className="flex items-center w-full justify-between ">
        <span className="text-primary">{title}</span>
        {isPositive ? (
        <span className={"text-success h-6 w-6"}>
          <TrendIconUp />
        </span>
      ) : (
        <span className={"text-error h-6 w-6"}>
          <TrendIconDown />
        </span>
      )}
      </div>
      <span className="text-2xl font-bold">{value}</span>
      
    </div>
  );
};
