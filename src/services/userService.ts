import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { User } from "../models/register/User";
import { LoginRequest } from "../models/login/loginRequest";
import { USER_CREDENTIALS } from "../defs/defs";
const NOTHING = "";

const register = async (newUser: User) => {
  return await client.post(APPARELPRO_ENDPOINTS.REGISTRATION.USER.POST, {
    ...newUser,
  });
};

const login = async (credentials: LoginRequest) => {
  return await client.post(APPARELPRO_ENDPOINTS.REGISTRATION.USER.LOGIN, {
    ...credentials,
  });
};

const logOut = async () => {
  localStorage.setItem(USER_CREDENTIALS.TOKEN_KEY, NOTHING);
  localStorage.setItem(USER_CREDENTIALS.REFRESH_TOKEN, NOTHING);
  localStorage.setItem(USER_CREDENTIALS.USER_KEY, NOTHING);
  const success = true;
  return success;
};

export { register, login, logOut };
