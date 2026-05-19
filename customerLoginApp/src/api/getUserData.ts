import { api } from "./clientConfig";
import type { User } from "./customerDto";

export type GetUserDataResponse = {
  data: {
    customers: User[];
    total_items: number;
  };
};

export const getUserData = async () => {
  const response = await api.get<GetUserDataResponse>("/customers");
  console.log(response.data);

  return response.data;
};
