import clsx from "clsx";
import React from "react";

export const StatsCard = ({
  title,
  value,
  showDivider = true,
}: {
  title: string;
  value: string;
  showDivider?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "flex-grow dark:bg-mainBg-dark",
        "w-full flex flex-col gap-2 text-secondary dark:text-textDark p-3",
        showDivider && "border-r border-gray200 dark:border-gray-600 pr-10"
      )}
    >
      <div className="flex items-center justify-between ">
        <span className="text-primary">{title}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
};
