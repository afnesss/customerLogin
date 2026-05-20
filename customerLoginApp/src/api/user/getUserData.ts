import { api } from "../clientConfig";
import type { User } from "../../types/customerDto";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../hooks/useToken";

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

export const USER_QUERY_KEY = ["user"] as const;

export const useUserData = () =>
  useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getUserData,
    enabled: Boolean(getToken()),
    select: (data) => data.data.customers[0] ?? null,
  });
