import Text from "antd/es/typography/Text";
import type { ReactNode } from "react";

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <Text className="text-xs! font-semibold! uppercase tracking-wide text-slate-500!">
    {children}
  </Text>
);
