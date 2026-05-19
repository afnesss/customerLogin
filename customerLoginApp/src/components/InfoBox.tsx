import type { ReactNode } from "react";

type InfoBoxProps = {
  label: string;
  value: string | number | null | undefined;
  breakAll?: boolean;
  noWrap?: boolean;
  variant?: "default" | "secondary";
  trailing?: ReactNode;
};

const InfoBox = ({
  label,
  value,
  breakAll = false,
  noWrap = false,
  variant = "default",
  trailing,
}: InfoBoxProps) => {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "Not specified"
      : value;
  const containerClassName =
    variant === "secondary"
      ? "rounded-xl  "
      : "rounded-xl bg-blue-50 px-3 py-2.5";

  return (
    <div className={containerClassName}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <p
            className={`mt-1 overflow-x-auto text-sm leading-5 text-slate-700 ${breakAll ? "break-all" : ""} ${noWrap ? "whitespace-nowrap" : ""}`}
          >
            {displayValue}
          </p>
        </div>
        {trailing}
      </div>
    </div>
  );
};

export default InfoBox;
