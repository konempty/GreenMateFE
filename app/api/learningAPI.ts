import { AxiosResponse } from "axios";
import axios from "@/app/util";

export const getLearningList = (): Promise<AxiosResponse<Learning[]>> => {
  return axios({
    method: "get",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/learnings`,
  });
};
