import { token } from "./../app/AppSettings";
import { isValidUrl } from "./../common";
interface IResponse extends Response {
  data: any;
}

export const hostApi = "http://139.162.50.214:6969";
export const baseUrl = `${hostApi}/api/v1`;
declare global {
  interface Window {
    fetchAPI: any;
  }
}

!("fetchAPI" in window) && (window.fetchAPI = fetch);
console.log(window.fetchAPI);
const createMethod = async (
  point: string,
  method: string,
  body?: any,
  headers?: Headers
): Promise<IResponse> => {
  const getBody = () => {
    const isObject = typeof body === "object";
    const isEmpty = !Boolean(body);
    const isFormData = body instanceof FormData;
    if (isFormData) return body;
    if (isEmpty) return undefined;
    if (isObject) return JSON.stringify(body);
    return body;
  };
  let result = await window.fetchAPI(`${baseUrl}${point}`, {
    method,
    body: getBody(),
    mode: "cors",
    headers: headers
      ? headers
      : {
          "Content-Type": "application/json",
        },
  });
  let isOk = result.ok;
  console.log(result);
  result = await result.json();

  if (!isOk) {
    return Promise.reject(result);
  }

  return result as IResponse;
};

const createMethodAuth = async (point: string, method: string, body = null) =>
  await createMethod(
    point,
    method,
    body,
    new Headers({
      Authorization: `Bearer ${token.get()}`,
      "Content-Type": "application/json",
    })
  );

export const uploadfile = async (point: string, data: File) => {
  const formData = new FormData();

  for (let [name, value] of Object.entries(data)) {
    formData.append(name, value);
  }
  return await createMethod(
    point,
    "POST",
    formData,
    new Headers({
      Authorization: `Bearer ${token.get()}`,
    })
  );
};

const paramToString = (params: any) => {
  if (!params) return "";

  return "?" + new URLSearchParams(params).toString();
};
export interface IOptions {
  params?: any;
  body?: any;
}
const client = {
  GET: (point: string, options: IOptions = {}) =>
    createMethod(point + paramToString(options.params), "GET"),
  POST: (point: string, options: IOptions = {}) =>
    createMethod(point + paramToString(options.params), "POST", options.body),
  PUT: (point: string, options: IOptions = {}) =>
    createMethod(point + paramToString(options.params), "PUT", options.body),
  DELETE: (point: string, options: IOptions = {}) =>
    createMethod(point + paramToString(options.params), "DELETE"),
};

export const clientAuth = {
  GET: (point: string, options: IOptions = {}) =>
    createMethodAuth(point + paramToString(options.params), "GET"),
  POST: (point: string, options: IOptions = {}) =>
    createMethodAuth(
      point + paramToString(options.params),
      "POST",
      options.body
    ),
  PUT: (point: string, options: IOptions = {}) =>
    createMethodAuth(
      point + paramToString(options.params),
      "PUT",
      options.body
    ),
  DELETE: (point: string, options: IOptions = {}) =>
    createMethodAuth(point + paramToString(options.params), "DELETE"),
};

export default client;

export const getMedia = (url: string) => {
  if (!url) return;
  if (isValidUrl(url)) {
    return url;
  } else {
    return `${hostApi}/${url}`;
  }
};
