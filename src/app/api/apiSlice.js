import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice"
import { setSessionExpired } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://technotes-api-dt.onrender.com",
  validateStatus: (response, result) => {
    return response.status >= 200 && response.status < 300 && !result?.isError;
  },
  credentials: "include",
  prepareHeaders: (headers, api) => {
    const token = api.getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
/*   console.log(args)
  console.log(api)
  console.log(extraOptions) */
  let result = await baseQuery(args, api, extraOptions);

  if(result?.error?.status === 403) {
    console.log(result.error.data);
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if(refreshResult?.data) {
      api.dispatch(setCredentials({...refreshResult.data}))
      result = await baseQuery(args, api, extraOptions)
    } else {
      if(refreshResult?.error?.status === 403) {
        console.log(refreshResult.error.data)
        refreshResult.error.data.message = "Your login has expired."
        api.dispatch(setSessionExpired())
      }
      return refreshResult
    }
  }

  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  // eslint-disable-next-line no-unused-vars
  endpoints: (builder) => ({}),
});
