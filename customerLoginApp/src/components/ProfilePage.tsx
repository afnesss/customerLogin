import { Button, Card, Col, Empty, Row, Space, Tag, Typography } from "antd";
import { LogOut, Pencil } from "lucide-react";
import type { CustomerPersonalInformation, User } from "../api/customerDto";
import InfoBox from "./InfoBox";
import { useAuth } from "../context/AuthContext";

const { Paragraph, Text, Title } = Typography;

const formatAgreementValue = (value: number) => {
  if (value === 1) {
    return "Yes";
  }

  if (value === 2) {
    return "No";
  }

  return String(value);
};

const formatGenderValue = (value: number) => {
  if (value === 2) {
    return "Male";
  }

  if (value === 1) {
    return "Female";
  }

  return "Not specified";
};

const getAddressLines = (address: {
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  address7: string;
  zip: string;
  city: string;
  country_code: string;
}) => {
  const lines = [
    address.address1,
    address.address2,
    address.address3,
    address.address4,
    address.address5,
    address.address6,
    address.address7,
    [address.zip, address.city].filter(Boolean).join(" ").trim(),
    address.country_code?.toUpperCase(),
  ].filter((line) => Boolean(line && line.trim()));

  return lines.length > 0 ? lines : ["Not specified"];
};

const cardClassName =
  "rounded-3xl! border-white/70! bg-white/90! shadow-lg! backdrop-blur";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <Card
          className="w-full max-w-md rounded-lg! border-white/70! bg-white/90! text-center shadow-lg backdrop-blur"
          styles={{ body: { padding: 32 } }}
        >
          <Space orientation="vertical" size={12}>
            <Text className="text-sm! font-medium! uppercase tracking-wide text-cyan-700!">
              Profile
            </Text>
            <Title level={2} className="m-0! text-slate-950!">
              No user data
            </Title>
            <Paragraph className="m-0! text-slate-500!">
              User details are not available yet.
            </Paragraph>
          </Space>
        </Card>
      </main>
    );
  }

  const {
    customer_id,
    last_change,
    personal_information,
    state,
    password,
    social_network_credentials,
  } = user as User;
  const { address, agreement } =
    personal_information as CustomerPersonalInformation;
  const addressLines = getAddressLines(address);

  const handleLogout = () => {
    void logout();
  };

  return (
    <main className="relative min-h-screen bg-blue-50 px-4 py-5 ">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <Card className={cardClassName}>
          <Space orientation="vertical" size={24} className="w-full">
            <div className="flex flex-col">
              <div className="flex  gap-3 flex-row items-start justify-between">
                <div>
                  <Text className="text-xs! font-medium! uppercase text-cyan-700!">
                    Profile
                  </Text>
                  <Title level={2} className="mt-2! mb-0! text-slate-950!">
                    {personal_information.first_name}{" "}
                    {personal_information.last_name}
                  </Title>
                </div>
                <Space wrap>
                  <Button
                    icon={<Pencil size={16} />}
                    size="large"
                    className="rounded-2xl!"
                  >
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<LogOut size={16} />}
                    size="large"
                    onClick={handleLogout}
                    className="rounded-2xl! bg-slate-900! hover:bg-red-900!"
                  >
                    Logout
                  </Button>
                </Space>
              </div>
              <Paragraph className="mt-2! mb-0! text-slate-500!">
                Customer profile loaded from the customer interface.
              </Paragraph>
            </div>

            <Card
              size="small"
              title="Address"
              className="rounded-2xl! bg-slate-50!"
              variant="borderless"
            >
              <div className="space-y-1">
                {addressLines.map((line) => (
                  <Text key={line} className="block text-slate-700!">
                    {line}
                  </Text>
                ))}
              </div>
            </Card>
          </Space>
        </Card>

        <Row gutter={[16, 0]} align="stretch">
          <Col xs={24} xl={16} className="flex">
            <Card className={`${cardClassName} h-full! w-full`}>
              <Space orientation="vertical" size={15} className="w-full">
                <div className="flex flex-col ">
                  <div className="flex flex-row items-center justify-between">
                    <Title level={4} className="mb-1! text-slate-950!">
                      Personal Information
                    </Title>
                    <Tag
                      color="green"
                      className="m-0! rounded-full px-3 py-2 text-xs! w-fit!"
                    >
                      State: {state}
                    </Tag>
                  </div>
                  <Paragraph className="m-0! text-slate-500!">
                    Primary customer details first. System identifiers stay
                    secondary.
                  </Paragraph>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoBox
                    label="Pre-nominals"
                    value={personal_information.pre_nominals}
                  />
                  <InfoBox
                    label="First Name"
                    value={personal_information.first_name}
                  />
                  <InfoBox
                    label="Last Name"
                    value={personal_information.last_name}
                  />
                  <InfoBox
                    label="Post-nominals"
                    value={personal_information.post_nominals}
                  />
                  <InfoBox
                    label="Salutation"
                    value={personal_information.salutation}
                  />
                  <InfoBox
                    label="Email"
                    value={personal_information.email}
                    breakAll
                  />
                  <InfoBox label="Phone" value={personal_information.phone} />
                  <InfoBox
                    label="Birthdate"
                    value={personal_information.birthdate}
                  />
                  <InfoBox
                    label="Gender"
                    value={formatGenderValue(personal_information.gender)}
                  />
                  <InfoBox
                    label="Language"
                    value={personal_information.language_id}
                  />
                  <InfoBox
                    label="Photo URL"
                    value={personal_information.photo_url}
                    breakAll
                  />
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} xl={8} className="flex">
            <Card className={`${cardClassName} h-full! w-full`}>
              <Space orientation="vertical" size={15} className="w-full">
                <div>
                  <Title level={4} className="mb-1! text-slate-950!">
                    System Info
                  </Title>
                  <Paragraph className="m-0! text-slate-500!">
                    Internal and integration metadata.
                  </Paragraph>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <InfoBox
                    label="Customer ID"
                    value={customer_id}
                    noWrap
                    variant="secondary"
                  />
                  <InfoBox
                    label="Last Change"
                    value={last_change}
                    variant="secondary"
                  />
                  <InfoBox
                    label="Store ID"
                    value={personal_information.store_id}
                    noWrap
                    variant="secondary"
                  />
                  <InfoBox
                    label="Country"
                    value={address.country_code?.toUpperCase()}
                    variant="secondary"
                  />
                  {password && (
                    <InfoBox
                      label="Password"
                      value={password}
                      breakAll
                      variant="secondary"
                    />
                  )}
                  {social_network_credentials?.social_network_id && (
                    <InfoBox
                      label="Social Network"
                      value={social_network_credentials?.social_network_id}
                      variant="secondary"
                    />
                  )}
                  {social_network_credentials?.social_network_token && (
                    <InfoBox
                      label="Social Token"
                      value={social_network_credentials?.social_network_token}
                      breakAll
                      variant="secondary"
                    />
                  )}
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card className={cardClassName}>
          <Space orientation="vertical" size={15} className="w-full">
            <div>
              <Title level={4} className="mb-1! text-slate-950!">
                Agreements
              </Title>
              <Paragraph className="m-0! text-slate-500!">
                Compact consent overview.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                ["GTC", formatAgreementValue(agreement.agreement_gtc)],
                [
                  "Profiling",
                  formatAgreementValue(agreement.agreement_profiling),
                ],
                [
                  "Marketing",
                  formatAgreementValue(
                    agreement.agreement_marketing_communication,
                  ),
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

            <Card
              size="small"
              title="Custom Agreements"
              className="rounded-2xl!"
            >
              {agreement.custom_agreements.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No custom agreements"
                />
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {agreement.custom_agreements.map((item) => (
                    <InfoBox
                      key={item.agreement_id}
                      label="Agreement ID"
                      value={item.agreement_id}
                      noWrap
                      variant="secondary"
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
          </Space>
        </Card>
      </div>
    </main>
  );
};

export default ProfilePage;
