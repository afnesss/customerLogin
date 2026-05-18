import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { UserLoginError, userLogin } from "../api/loginQuery";

type LoginFormProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = ({ setIsLoggedIn }: LoginFormProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await userLogin(values.email, values.password);
      localStorage.setItem("auth_user", JSON.stringify(response));
      setIsLoggedIn(true);
      navigate("/profile", { replace: true });
    } catch (error) {
      if (error instanceof UserLoginError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError("Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full max-w-md rounded-[28px] border border-white/70 bg-white/90 p-7 shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur md:p-9">
      <div className="mb-8 text-center">
        <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-700">
          Customer Portal
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to access your account and continue your work.
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
      >
        <Form.Item
          label={
            <span className="text-sm font-medium text-slate-700">Email</span>
          }
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input
            size="large"
            placeholder="name@company.com"
            className="rounded-2xl! px-4! py-3!"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-sm font-medium text-slate-700">Password</span>
          }
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            size="large"
            placeholder="Enter password"
            className="rounded-2xl! px-4! py-3!"
          />
        </Form.Item>

        <div className="mt-6 flex flex-col gap-4">
          {submitError ? (
            <Alert
              message={submitError}
              type="error"
              showIcon
              className="rounded-2xl!"
            />
          ) : null}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
            className="h-12! w-full! rounded-2xl! border-0! bg-slate-950! font-semibold! hover:bg-cyan-800!"
          >
            Sign in
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default LoginForm;
