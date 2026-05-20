import { Alert, Button, Card, Form, Input, Space, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserLoginError, userLogin } from "../api/user/loginQuery";
import { createTokenId } from "../api/tokenQuery";
import { useAuth } from "../context/AuthContext";
import { useTokenHook } from "../hooks/useToken";

const { Paragraph, Text, Title } = Typography;

const LoginForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparingToken, setIsPreparingToken] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { token } = useTokenHook();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (!token) {
        try {
          setIsPreparingToken(true);
          await createTokenId();
        } finally {
          setIsPreparingToken(false);
        }
      }

      await userLogin(values.email, values.password);
      await refreshUser();
      navigate("/profile", { replace: true });
    } catch (error) {
      if (error instanceof UserLoginError) {
        if (error.status === 400) {
          try {
            await refreshUser();
            navigate("/profile", { replace: true });
            return;
          } catch {
            // if not auth => original error
          }
        }

        setSubmitError(error.message);
        return;
      }

      setSubmitError("Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      className="w-full max-w-md rounded-[28px]! border-white/70! bg-white/90! shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur"
      styles={{ body: { padding: 32 } }}
    >
      <Space orientation="vertical" size={28} className="w-full">
        <div className="text-center">
          <Text className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px]! font-semibold! uppercase tracking-[0.32em] text-cyan-700!">
            Customer Portal
          </Text>
          <Title level={2} className="mt-4! mb-0! text-slate-950!">
            Welcome back
          </Title>
          <Paragraph className="mt-2! mb-0! text-slate-500!">
            Sign in to access your account and continue your work.
          </Paragraph>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          size="large"
        >
          <Space orientation="vertical" size={16} className="w-full">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
              className="mb-0!"
            >
              <Input
                placeholder="name@company.com"
                className="rounded-2xl! px-4! py-3!"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
              className="mb-0!"
            >
              <Input.Password
                placeholder="Enter password"
                className="rounded-2xl! px-4! py-3!"
              />
            </Form.Item>

            {submitError ? (
              <Alert
                title={submitError}
                type="error"
                showIcon
                className="rounded-2xl!"
              />
            ) : null}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting || isPreparingToken}
              disabled={isPreparingToken}
              className="h-12! w-full! rounded-2xl! border-0! bg-slate-950! font-semibold! hover:bg-cyan-800!"
            >
              Sign in
            </Button>
          </Space>
        </Form>
      </Space>
    </Card>
  );
};

export default LoginForm;
