import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Button,
  Typography,
  MenuItem,
  styled,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { register } from "../../services/userService";
import { AxiosError } from "axios";
import { z } from "zod";
//import InputLabel from "@mui/material/InputLabel";
//import FormHelperText from "@mui/material/FormHelperText";

import { loadCountries } from "../../services/country.service";
import { Country } from "../../models/references/Country";
import { User } from "../../models/register/User";

import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";

import { Gender } from "../../defs/defs";

//import { useDispatch } from "react-redux";
import { useDispatch } from "react-redux";
import {
  signUpFailed,
  signUpStart,
  signUpSuccess,
} from "../../sagaStore/user/user.action";

const defaultSignupForm: User = {
  knownAs: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  phoneNumber: "",
  city: "",
  country: "",
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
    email,
    password,
    confirmPassword,
    gender,
    phoneNumber,
    city,
    country,
    userName,
    dateOfBirth,
    photo,
  }: User = signupForm;

  const [signUp] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<signupFormErrors>({});

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const imageDataUrl = (data: unknown): string => {
    const url: string = "data:image/jpeg;base64," + data;
    return url;
  };

  const signUpFormSchema = z
    .object({
      knownAs: z.coerce.string().min(2, "Username required"),
      email: z.coerce.string().min(5, "email required"),
      password: z.coerce.string().min(5, "Password required."),
      confirmPassword: z.coerce.string().min(5, "confirm password required"),
      country: z.coerce.string().min(2, "Country Required"),
      gender: z.coerce.string().min(4, "Please select Gender"),
      dateOfBirth: z.coerce.date(),
      city: z.coerce.string().nullable(),
      userName: z.coerce.string().nullable(),
      phoneNumber: z.coerce.string().nullable(),
      photo: z.coerce.string().nullable(),
    })
    .superRefine(({ password }, checkPassword) => {
      if (password.length <= 5) {
        checkPassword.addIssue({
          code: "custom",
          message: "Password must be at least 5 characters long",
        });
      }
    });

  type signupFormData = z.infer<typeof signUpFormSchema>;
  type signupFormErrors = Partial<Record<keyof signupFormData, string[]>>;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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

  const validateForm = (data: signupFormData): signupFormErrors => {
    try {
      //    console.log("Input Data : ", data);
      signUpFormSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.flatten().fieldErrors;
      }
      return {};
    }
  };

  const resetForm = () => {
    setSignupForm(defaultSignupForm);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    //console.log("name change ", event.target);
    const { name, value } = event.target;
    setSignupForm({ ...signupForm, [name]: value });
    //console.log("signup form : ", { ...signupForm });
    const newErrors = validateForm(signupForm);
    setErrors(newErrors);
  };

  // const handleCountryChange = (event: SelectChangeEvent) => {
  //   console.log("event ", event);
  //   console.log("Country selected ", event.target.value);
  //   setSignupForm({ ...signupForm, country: event.target.value });
  //   console.log("signup form : ", { ...signupForm });
  // };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const newErrors = validateForm(signupForm);
    setErrors(newErrors);
    console.log("Errors : ", errors);
    if (Object.keys(newErrors).length !== 0) {
      return;
    }
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, proceed with submission
    }

    if (password.toLowerCase() !== confirmPassword.toLowerCase()) {
      alert("your password do not match");
      return;
    }

    try {
      console.log("Submit Value :", { ...signupForm });
      const form = signupForm;

      // redux
      console.log("dispatchng form....", { ...form });
      dispatch(signUpStart({ ...form }));
      //

      // register(form)
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((error) => {
      //     console.log(error.message);
      //     // if (error.code === "ERR_CANCELED" && error.signal) {
      //     //   // console.log("Request timed out");
      //     // } else {
      //     //   // console.log(error.name);
      //     //   console.log(error.message);
      //     //   //   console.log(error.code);
      //     //   //   console.log(error.status);
      //     //   //   console.log(error.stack);
      //     //   //   console.log(error.config);
      //     // }
      //   });

      navigate("/");
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
  };

  const GeneralTextField = styled(TextField)({
    "& input:valid + fieldset": {
      borderColor: "#0096ee",
      borderWidth: 1,
    },
    "& input:invalid + fieldset": {
      borderColor: "red",
      borderWidth: 1,
    },
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 3,
      padding: "3px !important", // override inline-style
    },
  });

  return (
    <>
      {signUp && (
        <Box className="flex flex-col justify-center drop-shadow-md m-2 border-2 border-gray- p-3  min-h-[640px] border1-4 border1-blue-600">
          <Typography variant="h4" color="blue-gray" className="text-center">
            Sign Up
          </Typography>
          <div className="flex w-full justify-around">
            <Box
              component="form"
              className="flex mx-auto border1-4 border1-violet-500 w-full"
            >
              <FormControl
                sx={{
                  m: 0,
                  borderRadius: "4px",
                  // border: "4px solid red",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "80%",
                }}
                variant="outlined"
              >
                <div className="flex sm:flex-col md:flex-row w-full p-0 m-0">
                  <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 border1-4 border1-yellow-300 mx-5">
                    <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 drop-shadow-lg">
                      <FormControl>
                        {/* <GeneralTextField
                          name="knownAs"
                          label="Your Name"
                          margin="normal"
                          size="small"
                          value={knownAs}
                          onChange={handleChange}
                          // style={{ border: "2px blue", borderRadius: "4px" }}
                        /> */}
                        <TextField
                          name="knownAs"
                          label="Your Name"
                          margin="normal"
                          size="small"
                          defaultValue={knownAs}
                          onChange={handleChange}
                          // style={{ border: "2px solid red" }}
                        />
                      </FormControl>
                    </div>
                    <div className="flex sm:flex-col md:flex1-col w-full p-0 m-0 mt-3 borer-4 border-green-500">
                      <FormControl
                        style={{
                          display: "inline",
                          // margin: "auto",
                          clear: "right",
                          float: "left",
                          border: "4px solid yellow",
                          // margin: "auto",
                          // height: "10px",
                        }}
                      >
                        <div>
                          <FormLabel
                            className="flex"
                            style={{
                              width: "20%",
                              border: "3px solid red",
                              // align: "middle",

                              marginTop: "10px",
                              marginLeft: "10px",
                              clear: "right",
                              float: "left",
                              // padding: "auto, 0px, auto, 0px ",
                              // margin: "auto, 10px",
                              // paddingTop: "50px",
                            }}
                          >
                            Gender
                          </FormLabel>
                          <RadioGroup
                            style={{
                              display: "block",
                              clear: "both",
                              float: "left",
                              border: "3px solid blue",
                              width: "70%",

                              // height: "100%",
                              // marginTop: "10px",
                              // padding: "auto, 0px, auto, 0px ",
                              // marginBottom: "30px",
                              // paddingBottom: "50px",
                            }}
                            className="flex"
                            name="gender"
                            row
                            value={gender}
                            // defaultValue={gender}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              value={Gender.FEMALE}
                              label="Female"
                              control={<Radio size="small" />}
                            />
                            <FormControlLabel
                              // slotProps={{
                              //   controlLabel: {
                              //     startAdornment: (
                              //       <InputAdornment position="start">
                              //         <WcOutlinedIcon />
                              //       </InputAdornment>
                              //     ),
                              //   },
                              // }}
                              value={Gender.MALE}
                              label="Male"
                              control={<Radio size="small" />}
                            />
                          </RadioGroup>
                        </div>
                      </FormControl>
                      {errors.gender && (
                        <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10 1absolute top1-45">
                          {errors.gender}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                      <FormControl>
                        <TextField
                          select
                          error
                          name="country"
                          label="Country"
                          margin="normal"
                          size="small"
                          defaultValue={country}
                          onChange={handleChange}
                          variant="outlined"
                          type="text"
                        >
                          {countries!.map((country) => {
                            // Images were stored as hexadecimal numbers representation of base64 encoded string in Sql server as data type varbinary
                            const flag = country.flag;
                            const imageUrl = imageDataUrl(flag);
                            return (
                              <MenuItem value={country.code}>
                                <div className="flex justify-between w-full my-auto">
                                  {country.name}
                                  <img
                                    className="w-8 h-[20px] my-auto mt-0 rounded-sm"
                                    src={imageUrl}
                                    alt={`flag of ${country.code}`}
                                  />
                                </div>
                              </MenuItem>
                            );
                          })}
                        </TextField>
                        {errors.country && (
                          <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10">
                            {errors.country}
                          </div>
                        )}
                      </FormControl>
                    </div>
                  </div>

                  <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 border1-4 border1-red-600 mx-5">
                    <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                      <FormControl>
                        {/* <GeneralTextField
                          name="phoneNumber"
                          label="Phone number/Mobile Number"
                          type="number"
                          margin="normal"
                          size="small"
                          value={phoneNumber}
                          // defaultValue={phoneNumber}
                          onChange={handleChange}
                        /> */}
                        <TextField
                          name="phoneNumber"
                          label="Phone number/Mobile Number"
                          type="number"
                          margin="normal"
                          size="small"
                          defaultValue={phoneNumber}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </div>
                    <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                      <FormControl>
                        {/* <GeneralTextField
                          name="city"
                          label="City"
                          margin="normal"
                          size="small"
                          value={city}
                          onChange={handleChange}
                        /> */}
                        <TextField
                          name="city"
                          label="City"
                          margin="normal"
                          size="small"
                          defaultValue={city}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </div>

                    <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 mt1-5">
                      <FormControl>
                        <TextField
                          error
                          name="email"
                          label="Email"
                          margin="normal"
                          size="small"
                          defaultValue={email}
                          onChange={handleChange}
                        />
                        {/* <GeneralTextField
                          error
                          name="email"
                          label="Email"
                          margin="normal"
                          size="small"
                          defaultValue={email}
                          onChange={handleChange}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AlternateEmailOutlinedIcon />
                                </InputAdornment>
                              ),
                            },
                          }}
                        /> */}
                      </FormControl>
                      {errors.email && (
                        <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col md:flex-row w-full p-0 m-0">
                  <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 mx-5">
                    <FormControl>
                      <OutlinedInput
                        type={showPassword ? "text" : "password"}
                        style={{ marginBottom: 15, marginTop: 15 }}
                        error
                        name="password"
                        label="Password"
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    {errors.password && (
                      <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 mx-5">
                    <FormControl>
                      <OutlinedInput
                        type={showPassword ? "text" : "password"}
                        style={{ marginBottom: 15, marginTop: 15 }}
                        error
                        name="confirmPassword"
                        label="Confirm Password"
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {errors.confirmPassword && (
                        <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </FormControl>
                  </div>
                </div>
                <Typography
                  color="gray"
                  className="mt-6 text-center font-normal"
                >
                  <Button
                    variant="contained"
                    style={{ width: "100%", margin: "0px" }}
                    onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                      handleSubmit(event)
                    }
                    href="#"
                  >
                    Sign Up
                  </Button>
                </Typography>
              </FormControl>
            </Box>
          </div>
        </Box>
      )}
    </>
  );
};

export default SignUpForm;
