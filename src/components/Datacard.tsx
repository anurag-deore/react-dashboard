import clsx from "clsx";
import { TrendIconDown, TrendIconUp } from "../icons/ChartIcon";

export const Datacard = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  const isPositive = Number(value) < 0 ? false : true;
  return (
    <div
      className={clsx(
        "dark:bg-mainBg-dark rounded cursor-pointer",
        "flex flex-col gap-2 text-secondary dark:text-textDark p-3",
        "border border-gray200 dark:border-gray-600 pr-10"
      )}
    >
      <div className="flex items-center justify-between ">
        <span className="text-primary">{title}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
      {isPositive ? (
        <span className={"text-success"}>
          <TrendIconUp />
        </span>
      ) : (
        <span className={"text-error"}>
          <TrendIconDown />
        </span>
      )}
    </div>
  );
};
