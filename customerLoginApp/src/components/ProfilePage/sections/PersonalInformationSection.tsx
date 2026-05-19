import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from "antd";
import type { FormInstance } from "antd";
import {
  Calendar,
  Globe,
  LogOut,
  Mail,
  MessageSquareText,
  Pencil,
  Phone,
  User,
  Users,
  X,
} from "lucide-react";
import type { CustomerPersonalInformation } from "../../../types/customerDto";
import { getCountryLabel } from "../countryOptions";
import { formatGenderValue } from "../heplerFunctions";
import type { ProfileFormValues } from "../profileFormTypes";
import AddressEditor from "./AddressEditor";
import { type ProfileFieldConfig } from "./profileSectionShared";

const { Text, Title } = Typography;

const genderOptions = [
  { label: "Not specified", value: 0 },
  { label: "Female", value: 1 },
  { label: "Male", value: 2 },
];

type PersonalInformationSectionProps = {
  cardClassName: string;
  form: FormInstance<ProfileFormValues>;
  personalFields: ProfileFieldConfig<ProfileFormValues>[];
  personalInformation: CustomerPersonalInformation;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onLogout: () => void;
  onSave: (values: any) => Promise<void>;
  lastChange?: string | null;
};

const formatBirthdate = (value: string) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const PersonalInformationSection = ({
  cardClassName,
  form,
  personalFields,
  personalInformation,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onLogout,
  onSave,
  lastChange,
}: PersonalInformationSectionProps) => {
  const birthdate = formatBirthdate(personalInformation.birthdate);
  const countryCode = personalInformation.address.country_code?.toUpperCase();
  const countryName = getCountryLabel(countryCode);
  const contactItems = [
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: personalInformation.email,
      fieldName: "email" as const,
    },
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: personalInformation.phone,
      fieldName: "phone" as const,
    },
    {
      icon: <Globe size={18} />,
      label: "Language",
      value: personalInformation.language_id,
      fieldName: "language_id" as const,
    },
  ].filter((item) => isEditing || (item.value && item.value.trim() !== ""));
  const subtitle = [
    formatGenderValue(personalInformation.gender),
    birthdate ? `Born ${birthdate}` : null,
    countryName ?? countryCode,
  ]
    .filter(Boolean)
    .join(" | ");
  const initials = [
    personalInformation.first_name?.[0],
    personalInformation.last_name?.[0],
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <Card className={`${cardClassName} h-full! w-full`}>
      <Space orientation="vertical" size={20} className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar
              size={68}
              src={personalInformation.photo_url || undefined}
              className="shrink-0 bg-cyan-700! text-xl! font-semibold!"
            >
              {initials || "?"}
            </Avatar>
            <div className="min-w-0">
              <Title level={4} className="mb-1! text-slate-950!">
                {personalInformation.first_name} {personalInformation.last_name}
              </Title>
              {subtitle ? (
                <Text className="text-sm! text-slate-500!">{subtitle}</Text>
              ) : null}
              {lastChange ? (
                <Text className="mt-0.5! block text-xs! text-slate-400!">
                  Updated{" "}
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(lastChange))}
                </Text>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start">
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  loading={isSaving}
                  onClick={() => void form.submit()}
                  className="rounded-xl!"
                >
                  Save changes
                </Button>
                <Button
                  icon={<X size={14} />}
                  onClick={onCancel}
                  className="rounded-xl!"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                icon={<Pencil size={14} />}
                onClick={onEdit}
                className="rounded-xl!"
              >
                Edit
              </Button>
            )}
            <Button
              type="primary"
              danger
              icon={<LogOut size={14} />}
              onClick={onLogout}
              className="rounded-xl! bg-slate-900! hover:bg-red-900!"
            >
              Logout
            </Button>
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={onSave}>
          <div className="border-t border-slate-200 pt-5">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-0">
              <section className="lg:pr-8">
                {isEditing && (
                  <>
                    <Text className="text-xs! font-semibold! uppercase tracking-wide text-slate-500!">
                      Personal
                    </Text>
                    <div className="mt-4 space-y-4">
                      {[
                        {
                          icon: <User size={18} />,
                          label: "First Name",
                          fieldName: "first_name" as const,
                          rules: [
                            { required: true, message: "Enter first name" },
                          ],
                        },
                        {
                          icon: <User size={18} />,
                          label: "Last Name",
                          fieldName: "last_name" as const,
                          rules: [
                            { required: true, message: "Enter last name" },
                          ],
                        },
                      ].map((item) => (
                        <div
                          key={item.fieldName}
                          className="grid grid-cols-[24px_78px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[24px_100px_minmax(0,1fr)]"
                        >
                          <span className="pt-0.5 text-slate-400">
                            {item.icon}
                          </span>
                          <Text className="font-medium! text-slate-500!">
                            {item.label}
                          </Text>
                          <Form.Item
                            name={item.fieldName}
                            rules={item.rules}
                            className="mb-0!"
                          >
                            <Input
                              size="middle"
                              className="rounded-xl! shadow-none!"
                            />
                          </Form.Item>
                        </div>
                      ))}
                      <div className="grid grid-cols-[24px_78px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[24px_100px_minmax(0,1fr)]">
                        <span className="pt-0.5 text-slate-400">
                          <Users size={18} />
                        </span>
                        <Text className="font-medium! text-slate-500!">
                          Gender
                        </Text>
                        <Form.Item name="gender" className="mb-0!">
                          <Select
                            options={genderOptions}
                            size="middle"
                            className="w-full rounded-xl!"
                          />
                        </Form.Item>
                      </div>
                      <div className="grid grid-cols-[24px_78px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[24px_100px_minmax(0,1fr)]">
                        <span className="pt-0.5 text-slate-400">
                          <Calendar size={18} />
                        </span>
                        <Text className="font-medium! text-slate-500!">
                          Birthdate
                        </Text>
                        <Form.Item name="birthdate" className="mb-0!">
                          <Input
                            type="date"
                            size="middle"
                            className="rounded-xl! shadow-none!"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </>
                )}
                <div className={isEditing ? "mt-6" : ""}>
                  <Text className="text-xs! font-semibold! uppercase tracking-wide text-slate-500!">
                    Contact
                  </Text>
                  <div className="mt-4 space-y-4">
                    {contactItems.map((item) => (
                      <div
                        key={item.label}
                        className="grid grid-cols-[24px_78px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[24px_100px_minmax(0,1fr)]"
                      >
                        <span className="pt-0.5 text-slate-400">
                          {item.icon}
                        </span>
                        <Text className="font-medium! text-slate-500!">
                          {item.label}
                        </Text>
                        {isEditing ? (
                          <Form.Item name={item.fieldName} className="mb-0!">
                            <Input
                              size="middle"
                              className="rounded-xl! shadow-none!"
                            />
                          </Form.Item>
                        ) : (
                          <Text className="break-all text-slate-900!">
                            {item.value}
                          </Text>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="border-t border-slate-200 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <Text className="text-xs! font-semibold! uppercase tracking-wide text-slate-500!">
                    Address
                  </Text>
                </div>
                <AddressEditor form={form} isEditing={isEditing} />
              </section>
            </div>

            <section className="mt-6 border-t border-slate-200 pt-5">
              <Text className="text-xs! font-semibold! uppercase tracking-wide text-slate-500!">
                Preferences
              </Text>
              <div className="mt-4">
                <div className="flex items-start gap-3">
                  <span className="pt-0.5 text-slate-400">
                    <MessageSquareText size={18} />
                  </span>
                  <Text className="font-medium! text-slate-500!">
                    Salutation:
                  </Text>
                  {isEditing ? (
                    <Form.Item name="salutation" className="mb-0! flex-1">
                      <Input
                        size="middle"
                        className="rounded-xl! shadow-none!"
                      />
                    </Form.Item>
                  ) : (
                    <Text className="break-all text-slate-900!">
                      {personalInformation.salutation || "Not specified"}
                    </Text>
                  )}
                </div>
              </div>
            </section>
          </div>
        </Form>
      </Space>
    </Card>
  );
};

export default PersonalInformationSection;
