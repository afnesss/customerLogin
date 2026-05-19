import { Card, Space, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

const ProfileEmptyState = () => (
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

export default ProfileEmptyState;
