import { AxiosResponse } from "axios";
import axios from "../util";

export const getTeamRecruitList = (): Promise<
  AxiosResponse<TeamRecruitmentSimple[]>
> => {
  return axios({
    method: "get",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/teams`,
  });
};

export const createTeamRecruitment = (
  request: CreateRecruitmentRequest,
  reportPhotos: File[],
) => {
  const formData = new FormData();
  formData.append("request", JSON.stringify(request));
  reportPhotos.forEach((reportPhoto) => {
    formData.append("reportPhotos", reportPhoto);
  });

  return axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    url: `/api/v1/teams`,
    data: formData,
  });
};

export const getTeamRecruitDetail = (teamRecruitId: number) => {
  return axios({
    method: "get",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/teams/${teamRecruitId}`,
  });
};

export const joinTeamRecruitment = (
  teamRecruitId: number,
): Promise<AxiosResponse<{ joinCount: number; isJoin: boolean }>> => {
  return axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/teams/${teamRecruitId}/join`,
  });
};

export const createTeamRecruitmentComment = (
  teamRecruitId: number,
  content: string,
) => {
  return axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/teams/${teamRecruitId}/comment`,
    data: { content },
  });
};
