import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
import axios, { AxiosError } from "axios";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { LoginRequest } from "../../models/login/loginRequest";
import { signInStart } from "../../sagaStore/user/user.action";

import { getCurrentError } from "../../sagaStore/user/user.selector";

const defaultSignInForm: LoginRequest = {
  email: "",
  password: "",
};

// type auth = {
//   setParentStatus: () => void;
// };

// https://blog.logrocket.com/schema-validation-typescript-zod/

const SignInForm = () => {
  const [signInForm, setSignInForm] = useState<LoginRequest>(defaultSignInForm);
  const [errors, setErrors] = useState<signInFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  //const navigate = useNavigate();
  const dispatch = useDispatch();

  let error = useSelector(getCurrentError);
  //const user = useSelector(getCurrentUser);

  // https://www.reddit.com/r/react/comments/y03qew/useselector_returns_undefined_at_first_render_but/?rdt=63144

  const signInFormSchema = z.object({
    email: z.coerce.string().min(5, "email required"),
    password: z.coerce.string().min(8, "password required"),
  });

  type signInFormData = z.infer<typeof signInFormSchema>;
  type signInFormErrors = Partial<Record<keyof signInFormData, string[]>>;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validateForm = (data: signInFormData): signInFormErrors => {
    try {
      signInFormSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.flatten().fieldErrors;
      }
      return {};
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignInForm({ ...signInForm, [name]: value });

    const newErrors = validateForm(signInForm);
    setErrors(newErrors);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const newErrors = validateForm(signInForm);
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      return;
    }

    try {
      // redux
      dispatch(signInStart(signInForm));
      //

      //   setCurrentUser(currentUser);
      //  console.log("current User : ", currentUser);

      return;
      //  const successMsg = `${user.email} logged in successfully`;
      //  setLoginError(successMsg);
      //   console.log(successMsg);
      //setCurrentUser(localStorage.getItem(USER_CREDENTIALS.USER_KEY));
      // return;
      // navigate("/bank");
      //setAuthenticated(success);
      // navigate("/");
      //  console.log("Authnticated : ", authenticated);
      // if (authenticated === true) {
      //   console.log("routing......");
      //   //GlobalRouter.navigate("/");
      // }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.request && "request" in error) {
        console.log("network related error");
        console.log("Request Error !", error);
      }
      if (axios.isAxiosError(error) && error.response && "response" in error) {
        //  setLoginError(error.response?.data);
        console.log("server responded");
        console.log("Response Error !******************************", error);
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
      {/* {signIn && ( */}
      {
        <div className="flex min-h-[640px] mb-0 drop-shadow-md border-2 border-gray-300 mt-1 rounded-md">
          <Box component="form" className="flex mx-auto">
            <div className="flex justify-around mt-10">
              <form className="w-80 max-w-screen-lg sm:w-96">
                <div className="flex flex-col gap1-4 justify-around">
                  {/* {success && (
                    <div
                      className="error-label flex border-2  border-gray-600 w-[350px] -1mr-[200px] -right1-[250px] p-auto px-2 py-2 bg-red-50 shadow-lg rounded-md 
                text-green-600 m1-auto absolute  top-5 z-30 hover:cursor-pointer justify-around"
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

                      {success}
                    </div>
                  )} */}

                  {error && (
                    <div
                      className="error-label flex border-2  border-gray-600 w-[350px] -1mr-[200px] -right1-[250px] p-auto px-2 py-2 bg-red-50 shadow-lg rounded-md 
                text-red-600 m1-auto absolute  top-5 z-30 hover:cursor-pointer justify-around"
                    >
                      <span
                        className="pr1-2"
                        onClick={() => {
                          error = "";
                          // setLoginError("");
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

                      {/* {loginError} */}
                      {error}
                    </div>
                  )}
                  <FormControl
                    sx={{
                      m: 0,
                      borderRadius: "4px",
                    }}
                    variant="outlined"
                  >
                    <Typography
                      variant="h4"
                      color="blue-gray"
                      // style={{ marginBottom: "13px" }}
                    >
                      Sign In
                    </Typography>
                    <Typography
                      style={{ marginTop: "30px" }}
                      variant="h6"
                      className="flex flex-col"
                    >
                      Your Email
                    </Typography>
                    <TextField
                      error
                      name="email"
                      label="email"
                      margin="normal"
                      size="small"
                      //    defaultValue={email}
                      onChange={handleChange}
                      //   helperText="Incorrect entry."
                    />
                    {errors.email && (
                      <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10">
                        {errors.email}
                      </div>
                    )}

                    <Typography variant="h6" className="flex flex-col mb-2">
                      Password
                    </Typography>

                    <OutlinedInput
                      type={showPassword ? "text" : "password"}
                      style={{ marginTop: 15 }}
                      error
                      name="password"
                      label="password"
                      size="small"
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.password && (
                      <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10">
                        {errors.password}
                      </div>
                    )}

                    <Typography
                      color="gray"
                      className="mt-6 text-center font-normal pt-5"
                    >
                      <Button
                        variant="contained"
                        style={{
                          width: "100%",
                          margin: "0px",
                        }}
                        onClick={(event: any) => handleSubmit(event)}
                        href="#"
                      >
                        Sign in
                      </Button>
                    </Typography>
                  </FormControl>
                </div>
              </form>
            </div>
          </Box>
        </div>
      }
    </>
  );
};

export default SignInForm;
