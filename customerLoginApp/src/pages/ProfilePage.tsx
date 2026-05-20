import { Form, Row } from "antd";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { updateUser } from "../api/user/updateUserQuery";
import ProfileEmptyState from "../components/ProfilePage/ProfileEmptyState";
import AgreementsSection from "../components/ProfilePage/sections/AgreementsSection";
import PersonalInformationSection from "../components/ProfilePage/sections/PersonalInformationSection";
import { useAuth } from "../context/AuthContext";
import type { CustomerPersonalInformation, User } from "../types/customerDto";
import type { ProfileFormValues } from "../types/profileFormTypes";

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

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
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
        <ProfileEmptyState />
      </>
    );
  }

  const { customer_id, last_change, personal_information } = user as User;
  const { agreement } = personal_information;
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
      toast.success("Profile updated");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const invalidParams =
          error.response?.data?.error?.error_data?.invalid_params;
        if (invalidParams?.length > 0) {
          profileForm.setFields(
            invalidParams.map(
              ({ name, message }: { name: string; message: string }) => ({
                name,
                errors: [message],
              }),
            ),
          );
        } else {
          toast.error(
            error.response?.data?.error?.title ?? "Failed to update profile",
          );
        }
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <>
      <main className="relative min-h-screen bg-blue-50 px-4 py-5">
        <div className="mx-auto w-full max-w-6xl space-y-3">
          <Row gutter={[16, 16]} align="stretch" className="m-0!">
            <PersonalInformationSection
              cardClassName={cardClassName}
              form={profileForm}
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
