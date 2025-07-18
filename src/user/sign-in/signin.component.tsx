import { Navigate, redirect, useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
//import { TextField } from "@mui/material";
import { z } from "zod";
import axios, { AxiosError } from "axios";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
//import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Card, Typography, Button, Input } from "@mui/material";

//import { RedirectFunction } from "react-router-dom";
//import { LockClosedIcon } from "@heroicons/react/24/outline";

import { client } from "../../auth/axiosClient";
import { LoginRequest } from "../../models/login/loginRequest";
import { login } from "../../services/userService";

import { LoginResponse } from "../models/login/loginResponse";
//import { APPARELPRO_ENDPOINTS } from "../../defs/api-configurations";

import GlobalRouter from "../../auth/globalRouter";

import { useDispatch } from "react-redux";
import { signInStart } from "../../sagaStore/user/user.action";

const tokenKey: string = "token";
const refreshTokenKey: string = "refreshToken";
const userKey: string = "user";

const defaultSignInForm: LoginRequest = {
  email: "",
  password: "",
};

type auth = {
  setParentStatus: () => void;
};

// https://blog.logrocket.com/schema-validation-typescript-zod/

const SignInForm = ({ setParentStatus }: auth) => {
  const [signInForm, setSignInForm] = useState<UserLogin>(defaultSignInForm);
  const { email, password } = signInForm;
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem(userKey));
  const [loginError, setLoginError] = useState(null);

  const signInFormSchema = z.object({
    email: z.coerce.string().min(5, "email required"),
    password: z.coerce.string().min(5, "password required"),
  });

  type signInFormData = z.infer<typeof signInFormSchema>;
  type signInFormErrors = Partial<Record<keyof signInFormData, string[]>>;

  // const [formData, setFormData] = useState<signInFormData>({
  //   email: "",
  //   password: "",
  // });

  const dispatch = useDispatch();

  const [errors, setErrors] = useState<signInFormErrors>({});

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validateForm = (data: signInFormData): signInFormErrors => {
    try {
      console.log("Input Data : ", data);
      signInFormSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("ZOD Error : ", errors);
        return error.flatten().fieldErrors;
      }
      return {};
    }
  };

  const [signIn] = useState(true);
  const navigate = useNavigate();

  // const resetForm = () => {
  //   setSignInForm(defaultSignInForm);
  // };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignInForm({ ...signInForm, [name]: value });

    // setFormData(signInForm);

    const newErrors = validateForm(signInForm);
    setErrors(newErrors);
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const newErrors = validateForm(signInForm);
    setErrors(newErrors);
    console.log("Errors : ", errors);
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, proceed with submission
    }

    try {
      //console.log("Submit Value :", { ...signInForm });
      //console.log("client Value axios Instance :", client.axiosInstance);

      //const res = await login(signInForm);

      // redux
      dispatch(signInStart(signInForm));

      //

      //console.log("response Data : ", { ...res });
      //console.log("type of response Data : ", typeof res);
      //console.log("Known As : ", knownAs);

      // const { token, refreshToken, knownAs } = res.data;
      // localStorage.setItem(tokenKey, token);
      // localStorage.setItem(refreshTokenKey, refreshToken);
      // localStorage.setItem(userKey, knownAs);

      setCurrentUser(localStorage.getItem(userKey));

      // setAuthenticated(res.success);
      // if (authenticated === true) {
      //   navigate("/");
      // }

      if (currentUser) {
        navigate("/");
      }

      //resetForm();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.request && "request" in error) {
        console.log("network related error");
        console.log("Request Error !", error);
      }
      if (axios.isAxiosError(error) && error.response && "response" in error) {
        setLoginError(error.response?.data);
        console.log("server responded");
        console.log("Response Error !", error);
      } else {
        console.log("Another type of Error !", error);
      }

      if (error instanceof AxiosError) {
        console.log("Error !", error.toJSON());
        // setLoginError(error.response?.data);
      }
    }
  };

  return (
    <>
      {signIn && (
        <Card
          // shadow={true}
          className="flex flex-col justify-center m-2 border-2 border-gray- p-3 min-h-[640px]"
        >
          {loginError && (
            <div
              className="error-label flex border-2  border-gray-600 w-[250px] -1mr-[200px] -right1-[250px] p-auto px-2 py-2 bg-red-50 shadow-lg rounded-md 
                text-red-600 m1-auto absolute  top-5 z-30 hover:cursor-pointer justify-around"
            >
              <span
                className="pr1-2"
                onClick={() => {
                  setLoginError(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              {loginError}
            </div>
          )}
          <Typography variant="h4" color="blue-gray" className="text-center">
            Sign In
          </Typography>

          <div className="flex justify-around border-4 border-red-700">
            <form className="mt-5 mb-2 w-80 max-w-screen-lg sm:w-96 text1-center">
              <div className="mb-1 flex flex-col gap-4 justify-around border-4 border-blue-700">
                <Typography
                  // variant="h6"
                  className="flex flex-col border-4 border-yellow-700"
                >
                  Your Email
                </Typography>
                <TextField
                  error
                  name="email"
                  //   id="outlined-error-helper-text"
                  label="email"
                  defaultValue={email}
                  onChange={handleChange}
                  //   helperText="Incorrect entry."
                />
                {errors.email && (
                  <div
                    className="flex border-2 border-red-200 w-full p-auto px-2 py1-2 bg-red-50 shadow-lg rounded-sm
                text-red-600 justify-around"
                  >
                    {errors.email}
                  </div>
                )}
                {/* {loginError && (
                  <div className="mr1-0 border-2  border-gray-200 w-100px bg-red-50 rounded-sm  text-red-600 justify1-end m-auto pr1-0 z1-30">
                    <span
                      className="pr-4"
                      onClick={() => {
                        setLoginError(null);
                      }}
                    >
                      X
                    </span>{" "}
                    {loginError}
                  </div>
                )} */}

                {/* <Typography variant="h6" className="mb1-3">
                  Password
                </Typography>
                <TextField
                  error
                  name="password"
                  //   id="outlined-error-helper-text"
                  label="password"
                  defaultValue={password}
                  onChange={handleChange}

                  //   helperText="Incorrect entry."
                ></TextField>

                {errors.password && (
                  <div
                    className="flex border-2  border-red-200 w-full p-auto px-2 py1-2 bg-red-50 shadow-lg rounded-sm
                text-red-600 justify-around"
                  >
                    {errors.password}
                  </div>
                )} */}

                <FormControl
                  sx={{
                    m: 0,
                    width: "45ch",
                    border: "1px solid red",
                    borderRadius: "4px",
                  }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    // id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          //onMouseDown={handleMouseDownPassword}
                          //onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />

                  {errors.password && (
                    <div
                      className="flex border-2  border-red-200 w-full p-auto px-2 py1-2 bg-red-50 shadow-lg rounded-sm
                text-red-600 justify-around"
                    >
                      {errors.password}
                    </div>
                  )}
                </FormControl>

                {/* <FormControl
                  sx={{
                    m: 0,
                    width: "45ch",
                  }}
                  variant="outlined"
                > */}
                <Typography
                  color="gray"
                  className="mt-4 text-center font-normal"
                >
                  <Button
                    variant="contained"
                    style={{ width: "45", margin: "0px" }}
                    onClick={(event: any) => {
                      handleSubmit(event);
                    }}
                    href="#"
                  >
                    Sign in
                  </Button>
                </Typography>
                {/* </FormControl> */}
              </div>

              {/* <Typography color="gray" className="mt-4 text-center font-normal">
                Not registered?
                <Button
                  variant="text"
                  // size="sm"
                  className="bg-white text-gray-700"
                  onClick={() => {
                    setParentStatus();
                  }}
                >
                  Sign Up
                </Button>
              </Typography> */}
            </form>
          </div>
        </Card>
      )}
    </>
  );
};

export default SignInForm;

// export function NavbarDefault() {
//   const [openNav, setOpenNav] = useState(false);

//   useEffect(() => {
//     window.addEventListener(
//       "resize",
//       () => window.innerWidth >= 960 && setOpenNav(false)
//     );
//   }, []);

//   const navList = (
//     <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
//       {/* <Typography
//         as="li"
//         variant="small"
//         color="blue-gray"
//         className="flex items-center gap-x-2 p-1 font-medium"
//       >
//         <svg
//           width="16"
//           height="15"
//           viewBox="0 0 16 15"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M5 0.5C4.73478 0.5 4.48043 0.605357 4.29289 0.792893C4.10536 0.98043 4 1.23478 4 1.5C4 1.76522 4.10536 2.01957 4.29289 2.20711C4.48043 2.39464 4.73478 2.5 5 2.5H11C11.2652 2.5 11.5196 2.39464 11.7071 2.20711C11.8946 2.01957 12 1.76522 12 1.5C12 1.23478 11.8946 0.98043 11.7071 0.792893C11.5196 0.605357 11.2652 0.5 11 0.5H5ZM2 4.5C2 4.23478 2.10536 3.98043 2.29289 3.79289C2.48043 3.60536 2.73478 3.5 3 3.5H13C13.2652 3.5 13.5196 3.60536 13.7071 3.79289C13.8946 3.98043 14 4.23478 14 4.5C14 4.76522 13.8946 5.01957 13.7071 5.20711C13.5196 5.39464 13.2652 5.5 13 5.5H3C2.73478 5.5 2.48043 5.39464 2.29289 5.20711C2.10536 5.01957 2 4.76522 2 4.5ZM0 8.5C0 7.96957 0.210714 7.46086 0.585786 7.08579C0.960859 6.71071 1.46957 6.5 2 6.5H14C14.5304 6.5 15.0391 6.71071 15.4142 7.08579C15.7893 7.46086 16 7.96957 16 8.5V12.5C16 13.0304 15.7893 13.5391 15.4142 13.9142C15.0391 14.2893 14.5304 14.5 14 14.5H2C1.46957 14.5 0.960859 14.2893 0.585786 13.9142C0.210714 13.5391 0 13.0304 0 12.5V8.5Z"
//             fill="#90A4AE"
//           />
//         </svg>

//         <a href="#" className="flex items-center">
//           Pages
//         </a>
//       </Typography> */}
//       <Typography
//         // as="li"
//         variant="6"
//         color="blue-gray"
//         className="flex items-center gap-x-2 p-1 font-medium"
//       >
//         <svg
//           width="16"
//           height="17"
//           viewBox="0 0 16 17"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fill-rule="evenodd"
//             clip-rule="evenodd"
//             d="M16 8.5C16 10.6217 15.1571 12.6566 13.6569 14.1569C12.1566 15.6571 10.1217 16.5 8 16.5C5.87827 16.5 3.84344 15.6571 2.34315 14.1569C0.842855 12.6566 0 10.6217 0 8.5C0 6.37827 0.842855 4.34344 2.34315 2.84315C3.84344 1.34285 5.87827 0.5 8 0.5C10.1217 0.5 12.1566 1.34285 13.6569 2.84315C15.1571 4.34344 16 6.37827 16 8.5ZM10 5.5C10 6.03043 9.78929 6.53914 9.41421 6.91421C9.03914 7.28929 8.53043 7.5 8 7.5C7.46957 7.5 6.96086 7.28929 6.58579 6.91421C6.21071 6.53914 6 6.03043 6 5.5C6 4.96957 6.21071 4.46086 6.58579 4.08579C6.96086 3.71071 7.46957 3.5 8 3.5C8.53043 3.5 9.03914 3.71071 9.41421 4.08579C9.78929 4.46086 10 4.96957 10 5.5ZM8 9.5C7.0426 9.49981 6.10528 9.77449 5.29942 10.2914C4.49356 10.8083 3.85304 11.5457 3.454 12.416C4.01668 13.0706 4.71427 13.5958 5.49894 13.9555C6.28362 14.3152 7.13681 14.5009 8 14.5C8.86319 14.5009 9.71638 14.3152 10.5011 13.9555C11.2857 13.5958 11.9833 13.0706 12.546 12.416C12.147 11.5457 11.5064 10.8083 10.7006 10.2914C9.89472 9.77449 8.9574 9.49981 8 9.5Z"
//             fill="#90A4AE"
//           />
//         </svg>
//         <a href="#" className="flex items-center">
//           Profile
//         </a>
//       </Typography>
//     </ul>
//   );

//   return (
//     <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
//       <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
//         {/* <div className="hidden lg:block">{navList}</div> */}
//         <div className="flex items-center gap-x-1">
//           <Button variant="text" size="sm" className="hidden lg:inline-block">
//             <span>Log In</span>
//           </Button>
//           {/* <Button
//             variant="gradient"
//             size="sm"
//             className="hidden lg:inline-block"
//           >
//             <span>Sign in</span>
//           </Button> */}
//         </div>
//         <IconButton
//           variant="text"
//           className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
//           ripple={false}
//           onClick={() => setOpenNav(!openNav)}
//         >
//           {openNav ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               className="h-6 w-6"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           )}
//         </IconButton>
//       </div>
//       <MobileNav open={openNav}>
//         <div className="container mx-auto">
//           {navList}
//           <div className="flex items-center gap-x-1">
//             <Button fullWidth variant="text" size="sm" className="">
//               <span>Log In</span>
//             </Button>
//             {/* <Button fullWidth variant="gradient" size="sm" className="">
//               <span>Sign in</span>
//             </Button> */}
//           </div>
//         </div>
//       </MobileNav>
//     </Navbar>
//   );
// }
