import { api } from "../clientConfig";
import type {
  CustomerPersonalInformation,
  User,
} from "../../types/customerDto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import type { FormInstance } from "antd";
import type { ProfileFormValues } from "../../types/profileFormTypes";
import { USER_QUERY_KEY } from "./getUserData";

export const updateUser = async (
  customerId: string,
  personalInfo: CustomerPersonalInformation,
) => {
  return api.put(`/customers/${customerId}`, {
    customer: {
      personal_information: {
        ...personalInfo,
        salutation: undefined,
        address: {
          ...personalInfo.address,
          country_code: personalInfo.address.country_code?.toLowerCase(),
        },
        agreement: {
          ...personalInfo.agreement,
          custom_agreements: personalInfo.agreement.custom_agreements.map(
            (agreement) => ({
              agreement_id: agreement.agreement_id,
              agreement_value: agreement.agreement_value,
            }),
          ),
        },
      },
    },
  });
};

type MutationVariables = {
  customerId: string;
  personalInfo: CustomerPersonalInformation;
};

type UseUpdateUserDataParams = {
  user: User | null;
  setIsEditingProfile: (value: boolean) => void;
  profileForm: FormInstance<ProfileFormValues>;
};

export const useUpdateUserData = ({
  user,
  setIsEditingProfile,
  profileForm,
}: UseUpdateUserDataParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, personalInfo }: MutationVariables) =>
      updateUser(customerId, personalInfo),
    onSuccess: (_, { personalInfo }) => {
      if (!user) return;
      queryClient.setQueryData(USER_QUERY_KEY, (old: any) => ({
        ...old,
        data: {
          ...old.data,
          customers: [
            {
              ...user,
              personal_information: personalInfo,
              last_change: new Date().toISOString(),
            },
          ],
        },
      }));
      setIsEditingProfile(false);
      toast.success("Profile updated");
    },
    onError: (error) => {
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
    },
  });
};
