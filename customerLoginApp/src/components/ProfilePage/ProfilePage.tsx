import { useEffect, useState } from "react";
import { Col, Form, Row, message } from "antd";
import { updateUser } from "../../api/updateUserQuery";
import type {
  CustomerAddress,
  CustomerPersonalInformation,
  User,
} from "../../types/customerDto";
import { useAuth } from "../../context/AuthContext";
import { formatGenderValue } from "./heplerFunctions";
import AgreementsSection from "./sections/AgreementsSection";
import PersonalInformationSection from "./sections/PersonalInformationSection";
import ProfileEmptyState from "./ProfileEmptyState";
import ProfileHeaderCard from "./sections/ProfileHeaderCard";
import { type ProfileFieldConfig } from "./sections/profileSectionShared";
import SystemInfoSection from "./SystemInfoSection";

type PersonalInfoFormValues = Pick<
  CustomerPersonalInformation,
  | "pre_nominals"
  | "first_name"
  | "last_name"
  | "post_nominals"
  | "salutation"
  | "email"
  | "phone"
  | "birthdate"
  | "gender"
  | "language_id"
  | "photo_url"
>;

type AddressFormValues = CustomerAddress;

const getPersonalFormValues = (
  personalInformation: CustomerPersonalInformation,
): PersonalInfoFormValues => ({
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
});

const cardClassName =
  "rounded-3xl! border-white/70! bg-white/90! shadow-lg! backdrop-blur mb-5!";

const formItemClassName = "mb-0!";

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [personalForm] = Form.useForm<PersonalInfoFormValues>();
  const [addressForm] = Form.useForm<AddressFormValues>();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    personalForm.setFieldsValue(
      getPersonalFormValues(user.personal_information),
    );
    addressForm.setFieldsValue(user.personal_information.address);
  }, [addressForm, personalForm, user]);

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
    state,
    password,
    social_network_credentials,
  } = user as User;
  const { address, agreement } = personal_information;
  const personalFields: ProfileFieldConfig<PersonalInfoFormValues>[] = [
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
  const addressFields: ProfileFieldConfig<AddressFormValues>[] = [
    { key: "address1", label: "Address Line 1", value: address.address1 },
    { key: "address2", label: "Address Line 2", value: address.address2 },
    { key: "address3", label: "Address Line 3", value: address.address3 },
    { key: "address4", label: "Address Line 4", value: address.address4 },
    { key: "address5", label: "Address Line 5", value: address.address5 },
    { key: "address6", label: "Address Line 6", value: address.address6 },
    { key: "address7", label: "Address Line 7", value: address.address7 },
    { key: "zip", label: "ZIP", value: address.zip },
    { key: "city", label: "City", value: address.city },
    {
      key: "country_code",
      label: "Country",
      value: address.country_code?.toUpperCase(),
    },
  ].map((field) => ({
    ...field,
    formItemProps: {
      name: field.key as keyof AddressFormValues,
      className: formItemClassName,
    },
  }));
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
      key: "country_code",
      label: "Country",
      value: address.country_code?.toUpperCase(),
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
  const visibleAddressFields = isEditingAddress
    ? addressFields
    : addressFields.filter((field) => {
        if (field.value === null || field.value === undefined) {
          return false;
        }

        if (typeof field.value === "string") {
          return field.value.trim() !== "";
        }

        return true;
      });

  const handleLogout = () => {
    void logout();
  };

  const handleCancelPersonal = () => {
    personalForm.setFieldsValue(getPersonalFormValues(personal_information));
    setIsEditingPersonal(false);
  };

  const handleCancelAddress = () => {
    addressForm.setFieldsValue(address);
    setIsEditingAddress(false);
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

  const handleSavePersonal = async (values: PersonalInfoFormValues) => {
    setIsSavingPersonal(true);

    try {
      const nextPersonalInformation: CustomerPersonalInformation = {
        ...personal_information,
        ...values,
      };

      await saveProfile(nextPersonalInformation);
      setIsEditingPersonal(false);
      messageApi.success("Personal information updated");
    } catch {
      messageApi.error("Failed to update personal information");
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const handleSaveAddress = async (values: AddressFormValues) => {
    setIsSavingAddress(true);

    try {
      const nextPersonalInformation: CustomerPersonalInformation = {
        ...personal_information,
        address: values,
      };

      await saveProfile(nextPersonalInformation);
      setIsEditingAddress(false);
      messageApi.success("Address updated");
    } catch {
      messageApi.error("Failed to update address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <>
      {contextHolder}
      <main className="relative min-h-screen bg-blue-50 px-4 py-5">
        <div className="mx-auto w-full max-w-6xl space-y-3">
          <ProfileHeaderCard
            cardClassName={cardClassName}
            personalName={`${personal_information.first_name} ${personal_information.last_name}`}
            addressForm={addressForm}
            addressFields={visibleAddressFields}
            isEditingAddress={isEditingAddress}
            isSavingAddress={isSavingAddress}
            onEditAddress={() => setIsEditingAddress(true)}
            onCancelAddress={handleCancelAddress}
            onSaveAddress={handleSaveAddress}
            onLogout={handleLogout}
          />

          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} xl={16} className="flex">
              <PersonalInformationSection
                cardClassName={cardClassName}
                personalForm={personalForm}
                personalFields={personalFields}
                isEditingPersonal={isEditingPersonal}
                isSavingPersonal={isSavingPersonal}
                state={state}
                onEdit={() => setIsEditingPersonal(true)}
                onCancel={handleCancelPersonal}
                onSave={handleSavePersonal}
              />
            </Col>

            <Col xs={24} xl={8} className="flex">
              <SystemInfoSection
                cardClassName={cardClassName}
                systemFields={systemFields}
              />
            </Col>
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
