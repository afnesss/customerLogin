import { Typography } from "antd";
import type { ReactNode } from "react";

const { Text } = Typography;

type InfoBoxProps = {
  label: string;
  value: string | number | null | undefined;
  breakAll?: boolean;
  noWrap?: boolean;
  trailing?: ReactNode;
};

const InfoBox = ({
  label,
  value,
  breakAll = false,
  noWrap = false,
  trailing,
}: InfoBoxProps) => {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "Not specified"
      : value;

  return (
    <div className="rounded-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <Text
            className={`mt-1! block overflow-x-auto text-sm! leading-5! text-slate-700! ${breakAll ? "break-all" : ""} ${noWrap ? "whitespace-nowrap" : ""}`}
          >
            {displayValue}
          </Text>
        </div>
        {trailing}
      </div>
    </div>
  );
};

export default InfoBox;
