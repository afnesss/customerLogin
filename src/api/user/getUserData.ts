import axios from "axios";
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
  try {
    const response = await api.get<GetUserDataResponse>("/customers");
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const USER_QUERY_KEY = ["user"] as const;

export const useUserData = () =>
  useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getUserData,
    enabled: Boolean(getToken()),
    select: (data) => data.data.customers[0] ?? null,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
