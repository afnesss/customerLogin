import { useEffect, useState } from "react";
import { Col, Form, Row, message } from "antd";
import { updateUser } from "../../api/updateUserQuery";
import type {
  CustomerPersonalInformation,
  User,
} from "../../types/customerDto";
import { useAuth } from "../../context/AuthContext";
import { formatGenderValue } from "./heplerFunctions";
import type { ProfileFormValues } from "./profileFormTypes";
import AgreementsSection from "./sections/AgreementsSection";
import PersonalInformationSection from "./sections/PersonalInformationSection";
import ProfileEmptyState from "./ProfileEmptyState";
import { type ProfileFieldConfig } from "./sections/profileSectionShared";
import SystemInfoSection from "./SystemInfoSection";

const getProfileFormValues = (
  personalInformation: CustomerPersonalInformation,
): ProfileFormValues => ({
  pre_nominals: personalInformation.pre_nominals,
  first_name: personalInformation.first_name,
  last_name: personalInformation.last_name,
  post_nominals: personalInformation.post_nominals,
  salutation: personalInformation.salutation,
  email: personalInformation.email,
  phone: personalInformation.phone,
  birthdate: personalInformation.birthdate,
  gender: personalInformation.gender,
  language_id: personalInformation.language_id,
  photo_url: personalInformation.photo_url,
  ...personalInformation.address,
});

const cardClassName =
  "rounded-3xl! border-white/70! bg-white/90! shadow-lg! backdrop-blur mb-5!";

const formItemClassName = "mb-0!";

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [profileForm] = Form.useForm<ProfileFormValues>();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    profileForm.setFieldsValue(getProfileFormValues(user.personal_information));
  }, [profileForm, user]);

  if (!user) {
    return (
      <>
        {contextHolder}
        <ProfileEmptyState />
      </>
    );
  }

  const {
    customer_id,
    last_change,
    personal_information,
    password,
    social_network_credentials,
  } = user as User;
  const { address, agreement } = personal_information;
  const personalFields: ProfileFieldConfig<ProfileFormValues>[] = [
    {
      key: "pre_nominals",
      label: "Pre-nominals",
      value: personal_information.pre_nominals,
      formItemProps: {
        name: "pre_nominals",
        className: formItemClassName,
      },
    },
    {
      key: "first_name",
      label: "First Name",
      value: personal_information.first_name,
      formItemProps: {
        name: "first_name",
        rules: [{ required: true, message: "Enter first name" }],
        className: formItemClassName,
      },
    },
    {
      key: "last_name",
      label: "Last Name",
      value: personal_information.last_name,
      formItemProps: {
        name: "last_name",
        rules: [{ required: true, message: "Enter last name" }],
        className: formItemClassName,
      },
    },
    {
      key: "post_nominals",
      label: "Post-nominals",
      value: personal_information.post_nominals,
      formItemProps: {
        name: "post_nominals",
        className: formItemClassName,
      },
    },
    {
      key: "salutation",
      label: "Salutation",
      value: personal_information.salutation,
      formItemProps: {
        name: "salutation",
        className: formItemClassName,
      },
    },
    {
      key: "email",
      label: "Email",
      value: personal_information.email,
      breakAll: true,
      formItemProps: {
        name: "email",
        rules: [
          { required: true, message: "Enter email" },
          { type: "email", message: "Enter a valid email" },
        ],
        className: formItemClassName,
      },
    },
    {
      key: "phone",
      label: "Phone",
      value: personal_information.phone,
      formItemProps: {
        name: "phone",
        className: formItemClassName,
      },
    },
    {
      key: "birthdate",
      label: "Birthdate",
      value: personal_information.birthdate,
      editFieldType: "date",
      formItemProps: {
        name: "birthdate",
        className: formItemClassName,
      },
    },
    {
      key: "gender",
      label: "Gender",
      value: formatGenderValue(personal_information.gender),
      editFieldType: "select",
      selectProps: {
        options: [
          { label: "Not specified", value: 0 },
          { label: "Female", value: 1 },
          { label: "Male", value: 2 },
        ],
      },
      formItemProps: {
        name: "gender",
        className: formItemClassName,
      },
    },
    {
      key: "language_id",
      label: "Language",
      value: personal_information.language_id,
      formItemProps: {
        name: "language_id",
        className: formItemClassName,
      },
    },

    {
      key: "photo_url",
      label: "Photo URL",
      value: personal_information.photo_url,
      breakAll: true,
      formItemProps: {
        name: "photo_url",
        className: formItemClassName,
      },
    },
  ];
  const systemFields: ProfileFieldConfig<Record<string, never>>[] = [
    {
      key: "customer_id",
      label: "Customer ID",
      value: customer_id,
      noWrap: true,
      variant: "secondary",
      wrapperClassName: "sm:col-span-2",
    },
    {
      key: "last_change",
      label: "Last Change",
      value: last_change,
      variant: "secondary",
      wrapperClassName: "sm:col-span-2",
    },
    {
      key: "store_id",
      label: "Store ID",
      value: personal_information.store_id,
      noWrap: true,
      variant: "secondary",
    },

    {
      key: "password",
      label: "Password",
      value: password,
      breakAll: true,
      variant: "secondary",
    },
    {
      key: "social_network_id",
      label: "Social Network",
      value: social_network_credentials?.social_network_id,
      variant: "secondary",
    },
    {
      key: "social_network_token",
      label: "Social Token",
      value: social_network_credentials?.social_network_token,
      breakAll: true,
      variant: "secondary",
    },
  ];
  const handleLogout = () => {
    void logout();
  };

  const handleCancelProfile = () => {
    profileForm.setFieldsValue(getProfileFormValues(personal_information));
    setIsEditingProfile(false);
  };

  const saveProfile = async (
    nextPersonalInformation: CustomerPersonalInformation,
  ) => {
    await updateUser(customer_id, nextPersonalInformation);
    setUser({
      ...user,
      personal_information: nextPersonalInformation,
      last_change: new Date().toISOString(),
    });
  };

  const handleSaveProfile = async (values: ProfileFormValues) => {
    setIsSavingProfile(true);

    try {
      const {
        address1,
        address2,
        address3,
        address4,
        address5,
        address6,
        address7,
        zip,
        city,
        country_code,
        ...nextPersonalValues
      } = values;
      const nextPersonalInformation: CustomerPersonalInformation = {
        ...personal_information,
        ...nextPersonalValues,
        address: {
          address1,
          address2,
          address3,
          address4,
          address5,
          address6,
          address7,
          zip,
          city,
          country_code,
        },
      };

      await saveProfile(nextPersonalInformation);
      setIsEditingProfile(false);
      messageApi.success("Profile updated");
    } catch {
      messageApi.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <>
      {contextHolder}
      <main className="relative min-h-screen bg-blue-50 px-4 py-5">
        <div className="mx-auto w-full max-w-6xl space-y-3">
          <Row gutter={[16, 16]} align="stretch">
            <PersonalInformationSection
              cardClassName={cardClassName}
              form={profileForm}
              personalFields={personalFields}
              personalInformation={personal_information}
              lastChange={last_change}
              isEditing={isEditingProfile}
              isSaving={isSavingProfile}
              onEdit={() => setIsEditingProfile(true)}
              onCancel={handleCancelProfile}
              onLogout={handleLogout}
              onSave={handleSaveProfile}
            />
          </Row>

          <AgreementsSection
            agreement={agreement}
            cardClassName={cardClassName}
          />
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
