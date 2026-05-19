import { Card, Space, Typography } from "antd";
import InfoBox from "../InfoBox";
import type { ProfileFieldConfig } from "./sections/profileSectionShared";

const { Paragraph, Title } = Typography;

type SystemInfoSectionProps = {
  cardClassName: string;
  systemFields: ProfileFieldConfig<Record<string, never>>[];
};

const SystemInfoSection = ({
  cardClassName,
  systemFields,
}: SystemInfoSectionProps) => (
  <Card className={`${cardClassName} h-full! w-full`}>
    <Space orientation="vertical" size={15} className="w-full">
      <div>
        <Title level={4} className="mb-1! text-slate-950!">
          System Info
        </Title>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {systemFields.map((field) => (
          <div key={field.key} className={field.wrapperClassName}>
            <InfoBox
              label={field.label}
              value={field.value}
              breakAll={field.breakAll}
              noWrap={field.noWrap}
              variant={field.variant}
            />
          </div>
        ))}
      </div>
    </Space>
  </Card>
);

export default SystemInfoSection;
