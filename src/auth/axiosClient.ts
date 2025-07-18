import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { TokenAPIModel } from "./tokenAPIModel";

import GlobalRouter from "./globalRouter";
const abortSignal = AbortSignal.timeout(2000);
class AxiosInterceptor {
  axiosInstance: AxiosInstance;
  accessToken: string = "";
  get: any;
  post: any;
  put: any;
  delete: any;

  tokenKey: string = "token";
  refreshTokenKey: string = "refreshToken";
  refreshSubscribers = [];

  isRefreshing: boolean = false;

  constructor(instanceConfig: {}) {
    // Initialize Axios instance with provided configuration

    this.axiosInstance = axios.create({
      ...instanceConfig,
      // signal: abortSignal,
    });

    // add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        const accessToken = this.getAccessToken();
        if (accessToken) {
          //console.log("token", accessToken);
          //console.log("token available:");
          //config.headers.authorization = `Bearer ${accessToken}`;
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          //console.log("request bearer token set complete ");
        }
        return config;
      },
      (error: unknown) => {
        //    console.log("Error in interceptor constructor in REQUEST : ", error);
        Promise.reject(error);
      }
    );

    // https://github.com/axios/axios/issues/6597
    // add response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // console.log("RESPONSE in interceptor OK....");
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        console.log("ERROR in RESPONSE ====> : ");
        console.log(error.response);
        if (
          error.response &&
          error.response.status === 401 &&
          (error.response.data === "Username does not exist" ||
            error.response.data === "Invalid password")
        ) {
          return Promise.reject(error);
        }
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          console.log("token EXPIRED, trying to refresh..... !");
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const token = this.getAccessToken();
              const refreshToken = this.getRefreshToken();

              const tokenAPIModel: TokenAPIModel = {
                token: token!,
                refreshToken: refreshToken!,
              };

              // call web api
              // this sets new token and refresh token in refreshToken function and set both
              const newTokens = await this.refreshToken(tokenAPIModel);
              //   console.log("after web api call to refresh token :");
              //   console.log("Returned both tokens on web api :", newTokens);
              //   console.log("Returned NEW token on web api :", newTokens.token);
              // console.log(
              //   "Returned NEW refreshed token on web api :",
              //   newTokens.refreshToken
              // );

              // added on 23/2/25
              // write newly issued refresh token to browser as same written to database with expire date
              this.setAccessToken(newTokens!.token);
              this.setRefreshToken(newTokens!.refreshToken);
              //

              //const newTokens = await this.refreshToken();
              //  this.setAccessToken(newTokens!.token);
              //  this.setRefreshToken(newTokens!.refreshToken);
              // console.log("new resfreshed both tokens set complete :");
              // this.refreshSubscribers.forEach((accessToken) => {
              //   this.refreshSubscribers.push(accessToken);
              //   // return accessToken;
              // });
              // this.refreshSubscribers = [];
              return this.axiosInstance(originalRequest);
            } catch (err) {
              console.log("Error on getting web api token ---->", err);
              // if (
              //   error.response.status === 400 &&
              //   error.response.data ===
              //     "Invalid token and invalid refresh token"
              //   //&&                 GlobalRouter.navigate
              // ) {
              //   //GlobalRouter.navigate("/auth");
              // }

              return Promise.reject(err);
            } finally {
              this.isRefreshing = false;
            }
          }

          //   return new Promise((resolve) => {
          //     this.refreshSubscribers.push((newAccessToken) => {
          //       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          //       originalRequest._retry = true;
          //       resolve(this.axiosInstance(originalRequest));
          //     });
          //   });
        } else if (
          error.response.status === 401
          // error.response.status === 400
          // &&
          // error.response.data === "Invalid token and invalid refresh token" &&
          //  GlobalRouter.navigate
        ) {
          console.log("Error 401 !! : ", error.response.data);
          //  GlobalRouter.navigate("/auth");
        } else if (
          error.response.data === "Refresh token expired....Please login"
          //&&
          //  // GlobalRouter.navigate
        ) {
          console.log(error.response.data);
          //  GlobalRouter && GlobalRouter.navigate("/auth");
        } else if (error.request) {
          // Request was made but no response received
          console.log("Request was made but no response received", error);
          if (error.response.status === 400 && GlobalRouter.navigate) {
            //  GlobalRouter.navigate("/auth");
          }
        } else {
          // Error was triggered by something else
          console.log("other error", error);
        }
        console.log("reject......");
        return Promise.reject(error);
      }
    );

    // Bind instance methods for convenience
    //  {require('axios').axiosInstance['get']}
    this.get = this.axiosInstance.get.bind(this.axiosInstance);
    this.post = this.axiosInstance.post.bind(this.axiosInstance);
    this.put = this.axiosInstance.put.bind(this.axiosInstance);
    this.delete = this.axiosInstance.delete.bind(this.axiosInstance);
  }

  refreshToken = async (tokenAPIModel: TokenAPIModel) => {
    // console.log("passed old token.......");
    // console.log(tokenAPIModel.token);
    // console.log("passed old refresh token .....");
    // console.log(tokenAPIModel.refreshToken);
    // console.log("get refresh token from api.......");
    // const existingToken = this.getAccessToken();
    // tokenAPIModel.token = existingToken!;
    // tokenAPIModel.refreshToken = this.getRefreshToken()!;
    // console.log("get existing token .....", existingToken);
    // console.log("get existing refresh token .....", tokenAPIModel.refreshToken);

    const model = await this.post(
      APPARELPRO_ENDPOINTS.TOKEN.REFRESH,
      tokenAPIModel
    );
    //   console.log("RESULTS : newly refreshed api token : ", model.data);
    //localStorage.setItem(this.refreshTokenKey, model.data.refreshToken);
    //localStorage.setItem(this.tokenKey, model.data.token);
    //return localStorage.getItem(this.refreshTokenKey);
    return model.data;
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem(this.tokenKey);
    // console.log("get access token.......", accessToken);
    return accessToken;
  };

  getRefreshToken = () => {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    // console.log("get refresh token.......", refreshToken);
    return refreshToken;
  };

  // refreshToken1 = async (tokenAPIModel: TokenAPIModel) => {
  //   const refreshToken = this.getRefreshToken();
  //   if (!refreshToken) {
  //     throw new Error("no refresh token available");
  //   }

  //   const response = await this.axiosInstance.post(
  //     APPARELPRO_ENDPOINTS.TOKEN.REFRESH,
  //     { refreshToken }
  //   );
  //   return response.data;
  // };

  setAccessToken = (token: string) => {
    localStorage.setItem(this.tokenKey, token);
  };

  setRefreshToken = (refreshToken: string) => {
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  };
}

export const client = new AxiosInterceptor({
  baseURL: APPARELPRO_ENDPOINTS.URLS.BASEURL,
});
