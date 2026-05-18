type InfoBoxProps = {
  label: string;
  value: string | number | null | undefined;
  breakAll?: boolean;
};

const InfoBox = ({ label, value, breakAll = false }: InfoBoxProps) => {
  const displayValue =
    value === null || value === undefined || value === "" ? "Not specified" : value;

  return (
    <div className="rounded-xl bg-blue-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1.5 text-sm leading-5 text-slate-700 ${breakAll ? "break-all" : ""}`}
      >
        {displayValue}
      </p>
    </div>
  );
};

export default InfoBox;
