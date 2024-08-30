import { Field, Label, Switch } from "@headlessui/react";
import React from "react";
import { useChartStore } from "../store/useStore";

const Settings = () => {
  const theme = useChartStore((state) => state.theme);
  const setTheme = useChartStore().setTheme;

  const handleChange = (value: boolean) => {
    setTheme(value ? "dark" : "light");
  };

  return (
    <div className="flex font-normal px-60 text-secondary dark:text-textDark justify-between mt-5">
      <Field className="w-full py-3 ">
        <Label className="flex cursor-pointer items-center justify-between">
          App Theme
          <div className="flex items-center gap-3">
            <span>Light</span>
            <Switch
              checked={theme === "dark"}
              onChange={handleChange}
              className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-primary"
            >
              <span
                aria-hidden="true"
                className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6"
              />
            </Switch>
            <span>Dark</span>
          </div>
        </Label>
      </Field>
    </div>
  );
};

export default Settings;
