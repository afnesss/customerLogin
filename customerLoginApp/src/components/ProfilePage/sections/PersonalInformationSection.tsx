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

const { Paragraph, Title } = Typography;

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

      <Form form={personalForm} layout="vertical" onFinish={onSave}>
        {renderInfoBoxGrid(personalFields, isEditingPersonal)}

        {isEditingPersonal ? (
          <Space className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={isSavingPersonal}
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
          </Space>
        ) : null}
      </Form>
    </Space>
  </Card>
);

export default PersonalInformationSection;
