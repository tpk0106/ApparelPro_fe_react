import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import { navbarData } from "../data/nav-data";
import Menu from "./menu.component";

import { ThemeProvider } from "@material-tailwind/react";

export function SidebarMenu() {
  // const customTheme = {
  //   select: {
  //     styles: {
  //       base: {
  //         container: {
  //           backgroundColor: "red",
  //           marginLeft: "ml-2",
  //         },
  //       },
  //     },
  //   },
  // };

  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: number) => {
    // console.log("open : ", open);
    // console.log("value : ", value);
    // console.log("open ?: ", open === value);
    setOpen(open === value ? 0 : value);
  };

  let counter = 0;

  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.2 },
  };

  return (
    // <ThemeProvider value={customTheme}>
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue">
          ApparelPro
        </Typography>
      </div>
      <List>
        {navbarData.map((menu) => {
          counter++;

          return (
            <Accordion
              animate={CUSTOM_ANIMATION}
              open={open === counter}
              icon={
                counter !== 1 && (
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      open === counter ? "rotate-180" : ""
                    }`}
                  />
                )
              }
            >
              <ListItem
                className="p-0"
                selected={open === counter}
                id={counter.toString()}
                style={{ backgroundColor: "black", color: "white" }}
              >
                <AccordionHeader
                  onClick={(e: any) => {
                    let passValue = 0;
                    console.log("ele :", e.target);
                    console.log("ele :", e.target.textContent);
                    console.log("inside onclick");
                    console.log("open : ", open);
                    console.log("open === counter", open === counter);
                    console.log("counter :", counter);
                    //console.log("counter1", counter1);
                    switch (e.target.textContent) {
                      case "General":
                        passValue = 2;
                        break;
                      case "Order Management Reference":
                        passValue = 3;
                        console.log("inside switch: ", passValue);
                        break;
                      case "order Management":
                        passValue = 4;
                        break;
                      case "General Inventory":
                        passValue = 5;
                        break;
                      case "Order Wise Inventory":
                        passValue = 6;
                        break;
                      case "Production Control":
                        passValue = 7;
                        break;
                      case "Quota":
                        passValue = 8;
                        break;
                      case "Reports":
                        passValue = 9;
                        break;
                    }

                    handleOpen(passValue);
                  }}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    <PresentationChartBarIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography
                    variant="small"
                    color="blue"
                    textGradient
                    className="mr-auto font1-normal font-semibold"
                  >
                    {menu.label}
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  {menu.subMenus &&
                    menu.subMenus.map((subMenu) => {
                      return (
                        <ListItem>
                          <ListItemPrefix>
                            <ChevronRightIcon
                              strokeWidth={0}
                              className="h-3 w-5"
                            />
                          </ListItemPrefix>
                          <Menu
                            subMenus={null}
                            label={subMenu.label}
                            icon=""
                            routerLink={subMenu.routerLink}
                          />
                        </ListItem>
                      );
                    })}
                </List>
              </AccordionBody>
            </Accordion>
          );
        })}

        <hr className="my-2 border-blue-gray-50" />
        <ListItem>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
    // </ThemeProvider>
  );
}
