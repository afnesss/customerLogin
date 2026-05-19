import type { FormInstance } from "antd";
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
import {
  Calendar,
  Camera,
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
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { CustomerPersonalInformation } from "../../../types/customerDto";
import { getCountryLabel } from "../../../utils/countryOptions";
import {
  formatDate,
  formatGenderValue,
  formatLanguage,
  formatPhone,
} from "../../../utils/heplerFunctions";
import type { ProfileFormValues } from "../../../types/profileFormTypes";
import AddressEditor from "./AddressEditor";
import type { Rule } from "antd/es/form";
import { SectionLabel } from "../../SectionLabel";
import { FieldRow } from "../FieldRow";

const { Text, Title } = Typography;

type PersonalEditField = {
  icon: ReactNode;
  label: string;
  fieldName: Extract<keyof ProfileFormValues, string>;
  control: ReactNode;
  rules?: Rule[];
};

const genderOptions = [
  { label: "Not specified", value: 0 },
  { label: "Female", value: 1 },
  { label: "Male", value: 2 },
];

const personalEditFields: PersonalEditField[] = [
  {
    icon: <User size={18} />,
    label: "First Name",
    fieldName: "first_name",
    control: <Input size="middle" className="rounded-xl! shadow-none!" />,
    rules: [{ required: true, message: "Enter first name" }],
  },
  {
    icon: <User size={18} />,
    label: "Last Name",
    fieldName: "last_name",
    control: <Input size="middle" className="rounded-xl! shadow-none!" />,
    rules: [{ required: true, message: "Enter last name" }],
  },
  {
    icon: <Users size={18} />,
    label: "Gender",
    fieldName: "gender",
    control: (
      <Select
        options={genderOptions}
        size="middle"
        className="w-full rounded-xl!"
      />
    ),
  },
  {
    icon: <Calendar size={18} />,
    label: "Birthdate",
    fieldName: "birthdate",
    control: (
      <Input type="date" size="middle" className="rounded-xl! shadow-none!" />
    ),
    rules: [
      {
        validator: (_: unknown, value: string) =>
          !value || new Date(value) <= new Date()
            ? Promise.resolve()
            : Promise.reject(new Error("Birthdate cannot be in the future")),
      },
    ],
  },
];

type PersonalInformationSectionProps = {
  cardClassName: string;
  form: FormInstance<ProfileFormValues>;
  personalInformation: CustomerPersonalInformation;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onLogout: () => void;
  onSave: (values: any) => Promise<void>;
  lastChange?: string | null;
};

const PersonalInformationSection = ({
  cardClassName,
  form,
  personalInformation,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onLogout,
  onSave,
  lastChange,
}: PersonalInformationSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) setPhotoPreview(null);
  }, [isEditing]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    form.setFieldValue("photo_url", url);
  };

  const birthdate = formatDate(personalInformation.birthdate);
  const countryCode = personalInformation.address.country_code?.toUpperCase();
  const countryName = getCountryLabel(countryCode);
  const contactItems = [
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: personalInformation.email,
      fieldName: "email" as const,
      rules: [
        { required: true, message: "Enter email" },
        { type: "email" as const, message: "Enter a valid email" },
      ],
    },
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: personalInformation.phone,
      displayValue: formatPhone(personalInformation.phone),
      fieldName: "phone" as const,
      rules: [{ required: true, message: "Enter phone number" }],
    },
    {
      icon: <Globe size={18} />,
      label: "Language",
      value: personalInformation.language_id,
      displayValue: formatLanguage(personalInformation.language_id),
      fieldName: "language_id" as const,
      rules: undefined,
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
            <div className="relative shrink-0">
              <Avatar
                size={68}
                src={photoPreview || personalInformation.photo_url || undefined}
                className="bg-cyan-700! text-xl! font-semibold!"
              >
                {initials || "?"}
              </Avatar>
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-0 bottom-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-700 text-white hover:bg-cyan-700"
                  >
                    <Camera size={12} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </>
              )}
            </div>
            <div className="min-w-0">
              <Title level={4} className="mb-1! text-slate-950!">
                {personalInformation.first_name} {personalInformation.last_name}
              </Title>
              {subtitle && (
                <Text className="text-sm! text-slate-500!">{subtitle}</Text>
              )}
              {lastChange && (
                <Text className="mt-0.5! block text-xs! text-slate-400!">
                  Updated {formatDate(lastChange)}
                </Text>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start">
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  loading={isSaving}
                  onClick={() => void form.submit()}
                  className="rounded-xl! bg-cyan-700! hover:bg-cyan-800!"
                >
                  Save changes
                </Button>
                <Button
                  icon={<X size={14} />}
                  onClick={onCancel}
                  className="rounded-xl! hover:border-cyan-800! hover:text-cyan-800!"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  icon={<Pencil size={14} />}
                  onClick={onEdit}
                  className="rounded-xl!  hover:border-cyan-800! hover:text-cyan-800!"
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<LogOut size={14} />}
                  onClick={onLogout}
                  className="rounded-xl! bg-slate-900! hover:bg-red-900!"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Form body */}
        <Form form={form} layout="vertical" onFinish={onSave}>
          <div className="border-t border-slate-200 pt-5">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-0">
              {/* Left column */}
              <section className="lg:pr-8">
                {isEditing && (
                  <>
                    <SectionLabel>Personal</SectionLabel>
                    <div className="mt-4 space-y-4">
                      {personalEditFields.map((field) => (
                        <FieldRow
                          key={field.fieldName}
                          icon={field.icon}
                          label={field.label}
                        >
                          <Form.Item
                            name={field.fieldName}
                            rules={field.rules}
                            className="mb-0!"
                          >
                            {field.control}
                          </Form.Item>
                        </FieldRow>
                      ))}
                    </div>
                  </>
                )}
                <div className={isEditing ? "mt-6" : ""}>
                  <SectionLabel>Contact</SectionLabel>
                  <div className="mt-4 space-y-4">
                    {contactItems.map((item) => (
                      <FieldRow
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                      >
                        {isEditing ? (
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
                        ) : (
                          <Text className="break-all text-slate-900!">
                            {"displayValue" in item
                              ? item.displayValue
                              : item.value}
                          </Text>
                        )}
                      </FieldRow>
                    ))}
                  </div>
                </div>
              </section>

              {/* Right column */}
              <section className="border-t border-slate-200 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                <SectionLabel>Address</SectionLabel>
                <AddressEditor form={form} isEditing={isEditing} />
              </section>
            </div>

            {/* Preferences */}
            <section className="mt-6 border-t border-slate-200 pt-5">
              <SectionLabel>Preferences</SectionLabel>
              <div className="mt-4">
                <FieldRow
                  icon={<MessageSquareText size={18} />}
                  label="Salutation"
                >
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
                </FieldRow>
              </div>
            </section>
          </div>
        </Form>
      </Space>
    </Card>
  );
};

export default PersonalInformationSection;
