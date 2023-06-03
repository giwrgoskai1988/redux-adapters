import axios from "axios";

const getUrl = (url) => `https://localhost:4000/${url}`;

const request = ({ method, url, params, data = {} }) => {
  let appUrl = getUrl(url);
  const options = {
    url: appUrl,
    method,
    params,
    data,
  };

  return axios.request(options);
};

export const get = ({ url, params }) => request({ method: "get", url, params });

export const post = ({ url, params, data }) =>
  request({ method: "post", url, params, data });

export const patch = ({ url, params, data }) =>
  request({ method: "patch", url, params, data });

export const put = ({ url, params, data }) =>
  request({ method: "put", url, params, data });

export const deleteRequest = ({ url, params, data }) =>
  request({ method: "delete", url, params, data });

