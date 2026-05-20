import { Card, Empty, Space, Tag, Typography } from "antd";
import InfoBox from "../../InfoBox";
import type { CustomerConsent } from "../../../types/customerDto";
import { formatAgreementValue } from "../../../utils/heplerFunctions";

const { Text, Title } = Typography;

type AgreementsSectionProps = {
  agreement: CustomerConsent;
  cardClassName: string;
};

const AgreementsSection = ({
  agreement,
  cardClassName,
}: AgreementsSectionProps) => (
  <Card className={cardClassName}>
    <Space orientation="vertical" size={15} className="w-full">
      <Title level={4} className="mb-1! text-slate-950!">
        Agreements
      </Title>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {[
            ["GTC", formatAgreementValue(agreement.agreement_gtc)],
            ["Profiling", formatAgreementValue(agreement.agreement_profiling)],
            [
              "Marketing",
              formatAgreementValue(agreement.agreement_marketing_communication),
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
            >
              <Text className="text-sm! text-slate-700!">{label}</Text>
              <Text strong>{value}</Text>
            </div>
          ))}
        </div>

        <Card size="small" title="Custom Agreements" className="rounded-2xl!">
          {agreement.custom_agreements.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No custom agreements"
            />
          ) : (
            <div className="space-y-3">
              {agreement.custom_agreements.map((item) => (
                <InfoBox
                  key={item.agreement_id}
                  label="Agreement ID"
                  value={item.agreement_id}
                  noWrap
                  trailing={
                    <Tag className="m-0! rounded-full self-start">
                      {formatAgreementValue(item.agreement_value)}
                    </Tag>
                  }
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </Space>
  </Card>
);

export default AgreementsSection;
