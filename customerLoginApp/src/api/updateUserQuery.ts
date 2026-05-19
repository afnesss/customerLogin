import { api } from "./clientConfig";
import type { CustomerPersonalInformation } from "../types/customerDto";

export const updateUser = async (
  customerId: string,
  personalInfo: CustomerPersonalInformation,
) => {
  return api.put(`/customers/${customerId}`, {
    customer: {
      personal_information: {
        ...personalInfo,
        address: {
          ...personalInfo.address,
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
