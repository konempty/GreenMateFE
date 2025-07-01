import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthError, ForbiddenError, NotFoundError } from "./error";
import { useEffect, useState } from "react";

const HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;
const PORT = process.env.NEXT_PUBLIC_API_SERVER_PORT;
export const BASE_URL = `${HOST}:${PORT}`;

export interface RequestConfig extends AxiosRequestConfig {
  suppressStatusCode?: number[];
}

function AxiosAuthInterceptor<T>(response: AxiosResponse<T>): AxiosResponse {
  const status = response.status;

  if (status === 404) {
    throw new NotFoundError();
  }

  if (status === 403) {
    localStorage.removeItem("accessToken");
    throw new ForbiddenError();
  }

  if (status === 401) {
    localStorage.removeItem("accessToken");
    window.location.reload();
    throw new AuthError();
  }

  return response;
}

function AxiosErrorAuthInterceptor<T>(error: AxiosError<T>) {
  localStorage.removeItem("accessToken");
  window.location.reload();
  throw error;
}

export default async function withAxios(requestConfig: RequestConfig) {
  const instance = axios.create();

  instance.interceptors.response.use(
    (response) => AxiosAuthInterceptor(response),
    (error) => AxiosErrorAuthInterceptor(error),
  );

  const response = await instance.request({
    ...requestConfig,
    baseURL: BASE_URL,
    validateStatus: (status) =>
      [...(requestConfig.suppressStatusCode || [])].includes(status) ||
      status < 500,
  });
  return response;
}
export const useLocalStorage = (key: string) => {
  const [data, setData] = useState(() => {
    let item = localStorage.getItem(key);
    return item === null ? "" : item;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      let item = localStorage.getItem(key);
      setData(item === null ? "" : item);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [data, setData];
};

export function statusToKorean(status: string) {
  switch (status) {
    case "RECRUITING":
      return "모집중";
    case "CLOSED":
      return "모집 완료";
    case "DEADLINE_SOON":
      return "마감 임박";
    default:
      return status;
  }
}
