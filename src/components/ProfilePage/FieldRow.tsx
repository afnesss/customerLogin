import Text from "antd/es/typography/Text";
import type { ReactNode } from "react";

export const FieldRow = ({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) => (
  <div className="grid grid-cols-[24px_78px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[24px_100px_minmax(0,1fr)]">
    <span className="pt-0.5 text-slate-400">{icon}</span>
    <Text className="font-medium! text-slate-500!">{label}</Text>
    {children}
  </div>
);
