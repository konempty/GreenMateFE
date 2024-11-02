import axios from "../util";
import { AxiosResponse } from "axios";

export const signUp = (
  request: SignUpRequest,
  profileImage: File | null,
): Promise<AxiosResponse<AccessTokenResponse>> => {
  const formData = new FormData();
  formData.append("signUpRequest", JSON.stringify(request));
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  return axios({
    method: "post",
    url: "/api/v1/users",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};

export const checkNicknameDuplicate = (
  nickname: string,
): Promise<AxiosResponse<{ isDuplicate: boolean }>> => {
  return axios({
    method: "get",
    url: `/api/v1/users/nickname-duplicate`,
    params: { nickname },
  });
};

export const login = (email: string, password: string) => {
  return axios({
    method: "post",
    url: "/api/v1/users/login",
    data: { email, password },
  });
};
