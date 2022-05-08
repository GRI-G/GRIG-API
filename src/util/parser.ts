import axios, { AxiosResponse, Method } from "axios";

export interface RequestObject {
  url: string;
  data: Object;
  method: Method;
  header: Object;
}

export const sendRequest: Function = (
  arg: RequestObject,
): Promise<AxiosResponse<any>> =>
  axios({
    method: arg.method,
    url: arg.url,
    data: arg.data,
    headers: arg.header,
  });
