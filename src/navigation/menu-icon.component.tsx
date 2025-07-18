import React, { Component } from "react";

import { AddCircleOutline, ExpandMoreOutlined } from "@mui/icons-material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { ReorderOutlined } from "@mui/icons-material";
import { ProductionQuantityLimitsOutlined } from "@mui/icons-material";
import { ReportOutlined } from "@mui/icons-material";
import { RoomPreferencesOutlined } from "@mui/icons-material";
import { RequestQuoteOutlined } from "@mui/icons-material";
import { ReportProblemOutlined } from "@mui/icons-material";

type Icn = {
  name: string;
};
const MenuIcon = ({ name }: Icn) => {
  switch (name) {
    case "General":
      return <RoomPreferencesOutlined className="text-blue-400" />;
    case "Order Management Reference":
      return <ReorderOutlined className="text-blue-400" />;
    case "Order Management":
      return <ReorderOutlined className="text-blue-400" />;
    case "General Inventory":
      return <Inventory2OutlinedIcon className="text-blue-400" />;
    case "Order Wise Inventory":
      return <Inventory2OutlinedIcon className="text-blue-400" />;
    case "Production Control":
      return <ProductionQuantityLimitsOutlined className="text-blue-400" />;
    case "Quota register":
      return <RequestQuoteOutlined className="text-blue-400" />;
    case "Reports":
      return <ReportProblemOutlined className="text-blue-400" />;
  }
};

export default MenuIcon;
