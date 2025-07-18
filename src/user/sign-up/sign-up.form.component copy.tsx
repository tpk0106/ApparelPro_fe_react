import { useState, useEffect } from "react";

import { Card, Button, Typography, Input } from "@mui/material";

import { APPARELPRO_ENDPOINTS } from "../../defs/api-configurations";
import { client } from "../../auth/axiosClient";
import { loadCountries } from "../../services/country.service";
import { Country } from "../../models/references/Country";

import { register } from "../../services/userService";
import { AxiosError } from "axios";
import { User } from "../../models/register/User";
import { ZodError } from "zod";

const defaultSignupForm = {
  knownAs: "",
  email: "",
  gender: "",
  phoneNumber: "",
  city: "",
  country: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: new Date(),
  userName: "",
  photo: null,
};

type auth = {
  setParentStatus: () => void;
};

const SignUpForm = ({ setParentStatus }: auth) => {
  const [signupForm, setSignupForm] = useState(defaultSignupForm);
  const {
    knownAs,
    gender,
    phoneNumber,
    city,
    country,
    userName,
    email,
    password,
    confirmPassword,
    dateOfBirth,
    photo,
  }: User = signupForm;

  //const signupForm : User = {}

  const [loginError, setLoginError] = useState(null);
  const [signUp] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);

  const imageDataUrl = (data: unknown): string => {
    const url: string = "data:image/jpeg;base64," + data;
    return url;
  };

  useEffect(() => {
    const getAllCountries = async () => {
      try {
        await loadCountries({
          pageNumber: 0,
          pageSize: 100,
          sortColumn: null,
          sortOrder: null,
          filterColumn: null,
          filterQuery: null,
        }).then((countries) => {
          setCountries(countries.data.items);
        });
      } catch (error: unknown) {
        setCountries([]);
        throw new Error((error as AxiosError).message);
      }
    };

    getAllCountries();
  }, []);

  // try {
  //   // console.log("Submit Value :", { ...signInForm });
  //   // console.log("client Value axios Instance :", client.axiosInstance);

  //   const res = await client.get(
  //     APPARELPRO_ENDPOINTS.REGISTRATION.USER.LOGIN,
  //     signInForm
  //   );

  //   console.log("response Data : ", res.data);
  //   const { token, refreshToken } = res.data;
  //   console.log("token :", token);
  //   console.log("refresh token :", refreshToken);
  //   localStorage.setItem(tokenKey, token);
  //   localStorage.setItem(refreshTokenKey, refreshToken);
  //   setAuthenticated(true);
  //   if (authenticated) {
  //     return <Navigate to={"/home"} />;
  //   }

  const resetForm = () => {
    setSignupForm(defaultSignupForm);
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    if (password.toLowerCase() !== confirmPassword.toLowerCase()) {
      alert("your password do not match");
      return;
    }

    try {
      try {
        console.log("Submit Value :", { ...signupForm });
        const form = signupForm;
        // console.log("client Value axios Instance :", client.axiosInstance);

        register(form)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error.message);
            // if (error.code === "ERR_CANCELED" && error.signal) {
            //   // console.log("Request timed out");
            // } else {
            //   // console.log(error.name);
            //   console.log(error.message);
            //   //   console.log(error.code);
            //   //   console.log(error.status);
            //   //   console.log(error.stack);
            //   //   console.log(error.config);
            // }
          });

        // const res = await client.post(
        //   APPARELPRO_ENDPOINTS.REGISTRATION.USER.POST,
        //   signupForm
        // );
        //   console.log("response Data : ", res.data);
        // const { token, refreshToken } = res.data;
        // console.log("token :", token);
        // console.log("refresh token :", refreshToken);
        // //localStorage.setItem(tokenKey, token);
        //localStorage.setItem(refreshTokenKey, refreshToken);
        //setAuthenticated(true);
        // if (authenticated) {
        //   return <Navigate to={"/home"} />;
        // }

        // //setCurrentUser(user);

        resetForm();
      } catch (error: unknown) {
        // if (error.code === "auth/email-already-in-use") {
        //   // alert("auth/email-already-in-use");
        // }
        console.log("Error !", error);
        console.log("Error !", typeof error);
        //console.error(error.response.data);
        //   setLoginError((error as ZodError).response.data);
        // alert(error.response.data);
      }

      resetForm();
    } catch (error: unknown) {
      // if (error.code === "auth/email-already-in-use") {
      //   alert("auth/email-already-in-use");
      // }
      console.log("Error !", error);
    }
  };

  const handleChange = (event: any) => {
    console.log("name change ", event.target);
    const { name, value } = event.target;
    console.log("name : ", name);
    console.log("name : ", { ...signupForm });

    setSignupForm({ ...signupForm, [name]: value });
  };

  return (
    <>
      {signUp && (
        <Card
          //  shadow={true}
          className="flex flex-col justify-center m-2 border-2 border-gray- p-3  min-h-[640px]"
        >
          <Typography variant="h4" color="blue-gray" className="text-center">
            Sign Up
          </Typography>
          <div className="flex justify-around">
            <form className="flex  flex-col w-[50%] mt-5 mb1-2 m-auto max-w1-screen-lg sm:w1-96 p-0">
              <div className="mb1-1 w-full justify-around p-0 m-0">
                <div className="flex sm:flex-col md:flex-row w-full p-0 m-0">
                  <div className="flex flex-col gap-6 w-[50%] pb-3 mr-3">
                    <Typography variant="h6" className="">
                      Your Name
                    </Typography>
                    <Input
                      //      label="your name"
                      //  size="lg"
                      onChange={handleChange}
                      required
                      name="knownAs"
                      value={knownAs}
                      className="sm:w-[60%] md:w-[100%]"
                      // className="shadow-lg shadow-gray-900/5 ring-4 ring-transparent "
                      //   className="mb1-3 border-3 border-red-700 p1-2"
                      //   labelProps={{
                      //     className: "before:content-none after:content-none",
                      //   }}
                    />
                  </div>
                  {/* <div className="flex flex-col gap-6 w-[50%] pb-3">
                    <Typography variant="h6" className="">
                      Gender
                    </Typography>
                    <div>
                      <Select
                        variant="outlined"
                        label="Select Gender"
                        name="gender"
                        value={gender}
                        onChange={(val) => {
                          setSignupForm({ ...signupForm, gender: val! });
                          console.log({ ...signupForm });
                        }}
                        className="sm:w-[60%] md:w-[100%]"
                      ></Select>
                    </div>
                  </div>
                </div> */}
                  <div className="flex sm:flex-col md:flex-row justify-around m-auto w-full1 ">
                    <div className="flex flex-col gap-6 w-[50%] pb-3 mr-3">
                      <Typography variant="h6" className="">
                        Phone Number
                      </Typography>
                      <Input
                        //    label="Phone Number"
                        //   size="lg"
                        onChange={handleChange}
                        required
                        // name="phoneNumber"
                        value={phoneNumber}
                        className="sm:w-[60%] md:w-[100%]"
                      />
                    </div>
                    <div className="flex flex-col gap-6 w-[50%] pb-3">
                      <Typography variant="h6" className="">
                        City
                      </Typography>
                      <Input
                        //   label="City"
                        // size="lg"
                        onChange={handleChange}
                        required
                        //   name="city"
                        value={city}
                        className="sm:w-[60%] md:w-[100%]"
                      />
                    </div>
                  </div>

                  <div
                    className="flex sm:flex-col md:flex-row justify-around m-auto w-full1 max-h-40 "
                    id="ddl1"
                  >
                    {/* <div className="flex flex-col gap-6 w-[50%] pb-3 mr-3">
                    <Typography variant="h6" className="">
                      Country
                    </Typography>
                    <div>
                      <Select
                        variant="outlined"
                        label="Select Country"
                        name="country"
                        value={country}
                       
                        onChange={(val) => {
                        }}
                        className="sm:w-[60%] md:w1-[100%]"
                      >
                        {countries!.map((country) => {
                          // Images were stored as hexadecimal numbers representation of base64 encoded string in Sql server as data type varbinary
                          const flag = country.flag;
                          const imageUrl = imageDataUrl(flag);
                          return (
                            <div>
                              <Option
                                value={country.code}
                                className="flex border1-2 border-blue-200 h-[35px] mb-1"
                              >
                                <div className="flex justify-between w-full my-auto">
                                  {country.name}
                                  <img
                                    className="w-8 h-[20px] my-auto mt-0 rounded-sm"
                                    src={imageUrl}
                                    alt={`flag of ${country.code}`}
                                  />
                                </div>
                              </Option>
                            </div>
                          );
                        })}
                      </Select>
                    </div> */}
                  </div>

                  <div className="flex flex-col gap-6 w-[50%] pb-3">
                    <Typography variant="h6" className="mb1-3">
                      Your Email
                    </Typography>
                    <Input
                      //  label="your email"
                      //   size="lg"
                      onChange={handleChange}
                      required
                      name="email"
                      value={email}
                      className="sm:w-[60%] md:w-[100%]"
                    />
                  </div>
                </div>

                <div className="flex sm:flex-col md:flex-row justify-around m-auto w-full1 ">
                  <div className="flex flex-col gap-6 w-[50%] pb-3 mr-3">
                    <Typography variant="h6" className="mb1-3">
                      Password
                    </Typography>
                    <Input
                      type="password"
                      //   size="lg"
                      //   label="password"
                      onChange={handleChange}
                      required
                      name="password"
                      value={password}
                      className="sm:w-[60%] md:w-[100%]"
                    />
                  </div>
                  <div className="flex flex-col gap-6 w-[50%] pb-3">
                    <Typography variant="h6" className="mb1-3">
                      Confirm Password
                    </Typography>
                    <Input
                      type="password"
                      //  size="lg"
                      //     label="confirm password"
                      onChange={handleChange}
                      required
                      name="confirmPassword"
                      value={confirmPassword}
                      className="sm:w-[60%] md:w-[100%]"
                    />
                  </div>
                </div>

                <Button href="#" onClick={(e: any) => handleSubmit(e)}>
                  Sign Up
                </Button>
                {/* <Button
                  // type="button"
                  onClick={(e: Event) => handleSubmit(e)}
                  className="mt-6"
                  href=""
                  // fullWidth
                >
                  Sign up
                </Button> */}
                <Typography
                  color="gray"
                  className="mt-4 text-center font-normal"
                >
                  Need to Sign In?
                  <Button
                    variant="text"
                    // size="sm"
                    className="bg-white text-gray-700"
                    onClick={() => {
                      setParentStatus();
                    }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </div>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};

export default SignUpForm;

/* <div className="flex justify-end  mr-0">
<div className="flex border-3 border-red-800 m-auto justify-between">
  <div className="border-3 border-red-800 m-auto px-2 w-[200px]">
    {country.name}
  </div>
  <div className="border-2 border-red-800 m-auto w1-10 h-[20px] mx1-auto my1-auto mt1-0 rounded-sm mr-0 justify1-end w-[40px] ">
    <img
      className="w1-10 h-[20px] mx1-auto my1-auto mt1-0 rounded-sm mr-0 justify1-end w-[40px]"
      src={imageUrl}
      alt={`flag of ${country.code}`}
    />
  </div>
</div>
</div> */

// selected part
// selected={(e) => {
//   console.log("e : ", e);
//   console.log("key : ", e?.key);
//   console.log("props : ", e?.props);
//   return (
//     <div className="flex">
//       {" "}
//       <div className="flex border-3 border-red-800 m-auto justify-between">
//         <div className="border-3 border-red-800 m-auto px-2 w-[200px]">
//           {e?.key}
//         </div>
//         <div className="border-2 border-red-800 m-auto w1-10 h-[20px] mx1-auto my1-auto mt1-0 rounded-sm mr-0 justify1-end w-[40px] ">
//           <img
//             className="w1-10 h-[20px] mx1-auto my1-auto mt1-0 rounded-sm mr-0 justify1-end w-[40px]"
//             src={e?.props}
//             alt={`flag of ${e?.key}`}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }}
