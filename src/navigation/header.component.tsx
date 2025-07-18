import { useState } from "react";

import { AddCircleOutline, ExpandMoreOutlined } from "@mui/icons-material";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import {
  Card,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  List,
  ListItem,
  ThemeProvider,
  Button,
} from "@mui/material";

//import logo from "../assets/logo/SmallLogo.jpg";
import logoTransparent from "../assets/logo/Logo.png";
import menuLogo from "../assets/logo/Logo8.png";
import { navbarData } from "../data/nav-data";

import Login from "../auth/login.component";

import Menu from "./menu.component";
//import { useNavigate } from "react-router-dom";

const handleMouseEnter = () => {
  const ele = document.getElementById("show-mobileMenu")!;

  ele.style.left = "0px";
  ele.style.width = "20%";
  ele.style.transition = "width 1000ms ";
  ele.style.animation = "linear";
};

const handleMouseLeave = () => {
  const ele = document.getElementById("show-mobileMenu")!;

  ele.style.width = "150px";
  ele.style.left = "-140px";
  ele.style.transition = "width 1000ms ";
  ele.style.animation = "linear";
};

import { createTheme } from "@mui/material";
import MenuIcon from "./menu-icon.component";
// declare module "@mui/material/Card" {
//   interface CardProps
// }

// declare module '@mui/material/Button' {
//   interface ButtonPropsVariantOverrides {
//     dashed: true;
//   }
// }

const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          background: "#9e9e9e",
          borderRadius: "10px",
          boxShadow:
            " 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); ",
        },
      },
    },
  },
});

const asideMenuTitleTypographyTheme = createTheme({
  // typography: {
  //   fontSize: 14,
  //   // fontWeightMedium: 600,
  //   h6: {
  //     fontWeight: 600,
  //   },

  //   // "letterSpacing": 0.32,
  // },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: "0.7em",
          fontWeight: 600,
        },
      },
    },
  },
});

const asideSubMenuTypographyTheme = createTheme({
  // typography: {
  //   fontSize: 14,
  //   // fontWeightMedium: 600,
  //   h6: {
  //     fontWeight: 600,
  //   },

  //   // "letterSpacing": 0.32,
  // },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          // variants: "h6",
          color: "#42a5f5",
          fontWeight: 600,
          textAlign: "center",
          margin: "auto",
          padding: "auto",
          ":hover": { color: "#fff", fontWeight: "500" },
        },
      },
    },
  },
});

const Header = () => {
  // useEffect(() => {
  //   console.log('using effect');
  //   handleContentLoaded();
  // }, []);

  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  let counter = 0;

  // const CUSTOM_ANIMATION = {
  //   mount: { scale: 1 },
  //   unmount: { scale: 0.2 },
  // };

  const SignIn = () => {
    console.log("click");
  };

  const handleChange = (event: any) => {
    let passValue = 0;

    //const content = event.currentTarget;
    //const x = "xx";
    // console.log("content : ", content);

    // const t = event?.target;
    //  console.log("target : ", t?.textContent);

    switch (event.target?.textContent) {
      case "General":
        passValue = 1;
        break;
      case "Order Management Reference":
        passValue = 2;
        break;
      case "Order Management":
        passValue = 3;
        break;
      case "General Inventory":
        passValue = 4;
        break;
      case "Order Wise Inventory":
        passValue = 5;
        break;
      case "Production Control":
        passValue = 6;
        break;
      case "Quota register":
        passValue = 7;
        break;
      case "Reports":
        passValue = 8;
        break;
    }
    open === passValue ? setOpen(0) : setOpen(passValue);
  };

  //const navigate = useNavigate();
  return (
    <>
      <div className="flex w-[100%] overflow-hidden h-[100%]">
        <div className="flex w-full">
          <div className="container flex-wrap w-full flex 1 1 100% mx-5">
            <div className="w-[100%] flex justify-around h1-[10%]">
              {/* <ApparelProLogo /> */}

              <div className="flex w-[80%] m-auto ">
                <a href="/">
                  <img
                    src={logoTransparent}
                    alt="Lady beatrice fashions logo"
                    className="w-[17%] m-auto ml-5"
                  />
                </a>
              </div>

              <div className="flex flex-col justify-around w-[20%] m-auto align-middle">
                {/* <Navbar className="mx1-auto max-w1-screen-xl px1-4 py1-2 lg:px1-8 lg:py1-4 bg-black"> */}
                <div className="flex justify-end align-middle">
                  <Login />

                  {/* <Button
                    // variant="gradient"
                    variant="text"
                    className="hidden lg:inline-block"
                    onClick={() => {
                      navigate("/auth");
                    }}
                  >
                    <span>Sign in</span>
                  </Button> */}
                </div>
                {/* </Navbar> */}
              </div>
              {/* </Link> */}
            </div>

            {/* mobile width <= 767px
            tablet width >= 768px
            laptop width >= 1024px
            */}
            {/* https://www.joshwcomeau.com/animation/keyframe-animations/ */}

            {/* div with 150px then -left-[140px]  */}

            {/* vertical menu */}
            <div className="flex-1 w-[100%] mt-5 z-10">
              <nav className="flex flex-col flex-1">
                <div
                  className="flex flex-col flex-1 items-center w-[160px] text-sm rounded-md bg-blue-400
                  font-semibold border-2 border-gray-500 p-2 -left-[150px] top-1 absolute h-[100%]"
                  id="show-mobileMenu"
                  onMouseEnter={() => handleMouseEnter()}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  <img
                    src={menuLogo}
                    alt="Lady beatrice fashions logo"
                    className="m-auto justify-center top-0 px-0.5 p-0.3 rounded-md"
                  />

                  <div className="w-full mr-0 px-2 py-3 overflow-hidden">
                    <ThemeProvider theme={theme}>
                      <Card
                        className="m-auto h-[calc(100vh-2rem)] w-full p-4 shadow-xl shadow-blue-gray-900 border-1 border-blue-gray-900   overflow-hidden"
                        id="main-menu"
                      >
                        <div className="text-center ">
                          <ThemeProvider theme={asideMenuTitleTypographyTheme}>
                            <Typography
                              // variant="h6"
                              color="black"
                            >
                              Apparel Pro
                            </Typography>
                          </ThemeProvider>
                        </div>

                        <Box
                          sx={{
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          <List className="flex1 flex-col m-auto justify-around bg-[#9e9e9e] mt-0 mb-0">
                            {navbarData.map((menu) => {
                              counter++;

                              return (
                                <Accordion
                                  expanded={open === counter}
                                  onChange={(event) => handleChange(event)}
                                  key={menu.label}
                                  style={{
                                    backgroundColor: "#9e9e9e",
                                    margin: "0px",
                                    paddingLeft: "3px",
                                    paddingRight: "3px",
                                    paddingTop: "3px",
                                    paddingBottom: "3px",
                                    boxShadow:
                                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(128, 128,128, 0.08)",
                                    border: "4x solid #000",
                                  }}
                                >
                                  <ListItem
                                    className="p-0 duration-150 transition-[400ms] border-2 border-gray-600 flex justify-around"
                                    id={counter.toString()}
                                    style={{
                                      backgroundColor: "black",
                                      margin: 0,
                                      borderRadius: "8px",
                                      height: "40px",
                                      marginBottom: "2px",
                                      padding: "0",
                                    }}
                                  >
                                    {<MenuIcon name={menu.label} />}
                                    {/* <AddCircleOutline className="text-blue-400" /> */}

                                    <AccordionSummary
                                      expandIcon={
                                        <ExpandMoreOutlined
                                          htmlColor="#9e9e9e"
                                          style={{
                                            margin: "0px",
                                            height: "16px",
                                            width: "16px",
                                          }}
                                          className="w-full border1-4 border1-red-400"
                                        />
                                      }
                                    >
                                      <ThemeProvider
                                        theme={asideSubMenuTypographyTheme}
                                      >
                                        <Typography>{menu.label}</Typography>
                                      </ThemeProvider>
                                    </AccordionSummary>
                                  </ListItem>

                                  <AccordionDetails className="rounded-md">
                                    <List className="p-0">
                                      {menu.subMenus &&
                                        menu.subMenus.map((subMenu) => {
                                          return (
                                            <ListItem
                                              className="m-0 h-[2em] rounded-md my-1"
                                              key={subMenu.label}
                                            >
                                              <div className="w-full text-[14.5px]">
                                                <Menu
                                                  subMenus={null}
                                                  label={subMenu.label}
                                                  icon=""
                                                  routerLink={
                                                    subMenu.routerLink
                                                  }
                                                />
                                              </div>
                                            </ListItem>
                                          );
                                        })}
                                    </List>
                                  </AccordionDetails>
                                </Accordion>
                              );
                            })}

                            <Box
                              sx={{
                                margin: 0,
                                padding: 0,
                              }}
                            >
                              <List className="flex flex-col m-auto justify-around bg-[#9e9e9e] mt-0 mb-0 border1-4 border1-yellow-200">
                                <ListItem className="text-[#60a5fa] flex justify-around  m-auto border1-3 border1-red-500 p1-3 bg-black hover:text-white rounded-md">
                                  <div className="flex w-[45%]  justify-end px-2 my-1 h1-5 w1-5 border1-4 border1-orange-300">
                                    <HowToRegOutlinedIcon className="flex w-full justify-start h-5 w1-5 border1-4 border1-yellow-300" />
                                  </div>
                                  <a
                                    href="sign-up"
                                    className="border1-4 border1-green-300"
                                  >
                                    Register
                                  </a>
                                </ListItem>
                              </List>
                            </Box>
                          </List>
                        </Box>
                      </Card>
                    </ThemeProvider>
                  </div>

                  <div className="pb1-10 text-sm font-bold text-center">
                    We redfine fashions
                  </div>
                </div>
              </nav>
            </div>
            {/* end of vertical menu  */}

            {/* <div className="flex w-[100%] mt-3 border-4 border-blue-600 h-[80%]">
              <Outlet />
            </div> */}
            {/* <div className="flex flex-col w-[100%] max1-h-[14%] h-[12%] mt-2 bg1-[#f9f9] b1-3 border1-red-800 justify-center mb-0 ">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed nam
              nostrum, non quisquam maxime optio laborum delectus voluptate eos
              maiores rerum consectetur, laboriosam et. Quo recusandae
              voluptatem consequatur quam maiores!
              <Footer />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
