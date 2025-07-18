export const navbarData = [
  // {
  //   routerLink: "/",
  //   icon: "../assets/order-management/Order-Management.png",
  //   label: "Home",
  //   subMenus: [],
  //   tag: null,
  // },
  // {
  //   routerLink: "sign-up",
  //   icon: "../assets/order-management/Order-Management.png",
  //   label: "Register",
  //   subMenus: null,
  //   tag: null,
  // },
  {
    routerLink: "general",
    icon: "../assets/order-management/Order-Management.png",
    label: "General",
    subMenus: [
      { routerLink: "currency", icon: null, label: "Currency" },
      { routerLink: "country", icon: null, label: "Country" },
      {
        routerLink: "garment-type",
        icon: null,
        label: "Garment Type",
      },
      {
        routerLink: "currency-exchange",
        icon: null,
        label: "Currency Exchange",
      },
      {
        routerLink: "currency-conversion",
        icon: "",
        label: "Currency Conversion",
      },
      {
        routerLink: "unit",
        icon: null,
        label: "Unit",
      },
      {
        routerLink: "bank",
        icon: null,
        label: "Bank",
      },
    ],
    tag: "general",
  },
  {
    routerLink: "ordermanagementref",
    icon: "../assets/order-management/Order-Management.png",
    label: "Order Management Reference",
    subMenus: [
      {
        routerLink: "buyers",
        icon: null,
        label: "Buyer",
      },
      { routerLink: "supplier", icon: null, label: "Supplier" },
      {
        routerLink: "port-destination",
        icon: null,
        label: "Country wise Dest./Port",
      },
      // {
      //   routerLink: "garment-type",
      //   icon: null,
      //   label: "Garment Type",
      // },
      {
        routerLink: "featurereference",
        icon: null,
        label: "Feature Reference",
      },
      {
        routerLink: "itemfeature",
        icon: null,
        label: "Item / Feature",
      },
      {
        routerLink: "style-details",
        icon: null,
        label: "Style Details",
      },
    ],
    tag: "ordermanagementref",
  },

  {
    routerLink: "ordermanagement",
    icon: "../assets/order-management/Order-Management.png",
    label: "Order Management",
    subMenus: [
      {
        routerLink: "po",
        icon: "../assets/order-management/Order-Management.png",
        label: "Order Confirmation Routine",
      },
      {
        routerLink: "material",
        icon: "../assets/order-management/Order-Management.png",
        label: "Material Consumptions",
      },
      {
        routerLink: "additional",
        icon: "../assets/order-management/Order-Management.png",
        label: "Additional Costs per Garment",
      },
      {
        routerLink: "subcont",
        icon: "../assets/order-management/Order-Management.png",
        label: "Sub Contracts",
      },
      {
        routerLink: "po",
        icon: "../assets/order-management/Order-Management.png",
        label: "Purchase Order Entry",
      },
      {
        routerLink: "styleevents",
        icon: "../assets/order-management/Order-Management.png",
        label: "Style-wise Events",
      },
      {
        routerLink: "reports",
        icon: "../assets/order-management/Order-Management.png",
        label: "Reports",
      },
    ],
    tag: "ordermanagement",
  },
  {
    routerLink: "generalinventory",
    icon: "../assets/inventory/Inventory-Management.png",
    label: "General Inventory",
    subMenus: [
      {
        routerLink: "srn",
        icon: null,
        label: "Stores Requisition Note",
      },
      {
        routerLink: "gin",
        icon: null,
        label: "Goods Issue        Note",
      },
      {
        routerLink: "grcn",
        icon: null,
        label: "Goods Receive     Note",
      },
      {
        routerLink: "grtn",
        icon: null,
        label: "Goods Return      Note",
      },
      {
        routerLink: "gtn",
        icon: null,
        label: "Goods Transfer     Note",
      },
      {
        routerLink: "srn",
        icon: null,
        label: "Supplier Return    Note",
      },
      {
        routerLink: "dgn",
        icon: null,
        label: "Damaged Goods      Note",
      },
      {
        routerLink: "ain",
        icon: null,
        label: "Additional issue   Note",
      },
      {
        routerLink: "dtn",
        icon: null,
        label: "Direct Transfer    Note",
      },
      {
        routerLink: "san",
        icon: null,
        label: "Stock Adjustments  Note ",
      },
      {
        routerLink: "reports",
        icon: null,
        label: "Reports",
        subMenus: [
          {
            routerLink: "stockValuation",
            icon: null,
            label: "Stock Valuation Report",
          },
          {
            routerLink: "stockValuationMonthly",
            icon: null,
            label: "Stock Valuation Report(monthly)",
          },
          {
            routerLink: "stockStatus",
            icon: null,
            label: "Stock Status Report",
          },
          {
            routerLink: "stock-movement-item",
            icon: null,
            label: "Stock Movement (for an Item) ",
          },
          {
            routerLink: "stock-movement",
            icon: null,
            label: "Stock Movement (for an Order)",
          },
          {
            routerLink: "srnReport",
            icon: null,
            label: "List of Transactions",
          },
          {
            routerLink: "itemWiseReport",
            icon: null,
            label: "Item-wise Stock Balances",
          },
          {
            routerLink: "rmReport",
            icon: null,
            label: "Raw Material Control Sheet",
          },
          {
            routerLink: "stockSummary",
            icon: null,
            label: "Stock Summary Report - Basis wise",
          },
          { routerLink: "grnlist", icon: null, label: "GRN Listings " },
        ],
      },
    ],
  },
  {
    routerLink: "orderwiseinventory",
    icon: "../assets/order-management/Order-Management.png",
    label: "Order Wise Inventory",
    subMenus: [
      {
        routerLink: "srn",
        icon: null,
        label: "Stores Requisition Note",
      },
      {
        routerLink: "gin",
        icon: null,
        label: "Goods Issue        Note",
      },
      {
        routerLink: "grcn",
        icon: null,
        label: "Goods Receive     Note",
      },
      {
        routerLink: "grtn",
        icon: null,
        label: "Goods Return      Note",
      },
      {
        routerLink: "gtn",
        icon: null,
        label: "Goods Transfer     Note",
      },
      {
        routerLink: "srn",
        icon: null,
        label: "Supplier Return    Note",
      },
      {
        routerLink: "dgn",
        icon: null,
        label: "Damaged Goods      Note",
      },
      {
        routerLink: "ain",
        icon: null,
        label: "Additional issue   Note",
      },
      {
        routerLink: "dtn",
        icon: null,
        label: "Direct Transfer    Note",
      },
      {
        routerLink: "san",
        icon: null,
        label: "Stock Adjustments  Note ",
      },
    ],
    tag: "orderwiseinventory",
  },
  {
    routerLink: "productioncontrol",
    icon: "../assets/production/Inventory-Management.png",
    label: "Production Control",
    subMenus: [
      { routerLink: "srn", icon: null, label: "Daily Production Time Ticket" },
      { routerLink: "srn", icon: null, label: "Actual Production entry " },
      { routerLink: "srn", icon: null, label: "Estimated Production entry" },
      { routerLink: "srn", icon: null, label: "Production Line Allocation" },
      {
        routerLink: "srn",
        icon: null,
        label: "Style wise Component Breakdown",
      },
      {
        routerLink: "srn",
        icon: null,
        label: "Style wise Operation Breakdown",
      },
      {
        routerLink: "srn",
        icon: null,
        label: "End of Production Confirmation",
      },
      { routerLink: "srn", icon: null, label: "Est. Prod. Line Allocation" },
    ],
    tag: "productioncontrol",
  },
  {
    routerLink: "quotaregister",
    icon: "../assets/order-management/Order-Management.png",
    label: "Quota register",
    subMenus: [
      { routerLink: "quotregister", icon: null, label: "Quota Register" },
      {
        routerLink: "quota-transfe-in",
        icon: null,
        label: "Quota Transfers In",
      },
      {
        routerLink: "quota-transfe-out",
        icon: null,
        label: "Quota Transfers Out",
      },
      {
        routerLink: "surrender-quota",
        icon: null,
        label: "Surrender of Quota",
      },
      { routerLink: "quota-cat-change", icon: null, label: "Category Change" },
      {
        routerLink: "quota-deffered",
        icon: null,
        label: "Transfer of Defered Quota",
      },
      { routerLink: "quota-reports", icon: null, label: "Reports" },
    ],
    tag: "quotaregister",
  },
  // {
  //   routerLink: 'importexportdoc',
  //   icon: '',
  //   label: 'Import/Export Documentation',
  //   subMenus: null,
  // },
  {
    routerLink: "reports",
    icon: "../assets/order-management/Order-Management.png",
    label: "Reports",
    subMenus: [
      { routerLink: "Order Detail", icon: null, label: "Order Detail" },
      { routerLink: "Colour/Size", icon: null, label: "Colour/Size" },
      {
        routerLink: "Scheduled Shipments",
        icon: null,
        label: "Scheduled Shipments",
      },
      {
        routerLink: "Shipment status Report",
        icon: null,
        label: "Shipment status Report",
      },
      { routerLink: "Trim Sheet", icon: null, label: "Trim Sheet" },
      {
        routerLink: "Year/Season Wise Orders",
        icon: null,
        label: "Year/Season Wise Orders",
      },
      { routerLink: "Pending Events", icon: null, label: "Pending Events" },
      {
        routerLink: "Order/Quota Detail",
        icon: null,
        label: "Order/Quota Detail",
      },
      {
        routerLink: "Stock Arrival Status",
        icon: null,
        label: "Stock Arrival Status",
      },
      {
        routerLink: "Cost of Production",
        icon: null,
        label: "Cost of Production",
      },
      {
        routerLink: "Monthly Actual Shipments",
        icon: null,
        label: "Monthly Actual Shipments",
      },
      { routerLink: "List of P/O's", icon: null, label: "List of P/O's" },
      {
        routerLink: "List of Outstanding P/O's",
        icon: null,
        label: "List of Outstanding P/O's",
      },
      {
        routerLink: "Post Order Cost Sheet",
        icon: null,
        label: "Post Order Cost Sheet",
      },
    ],
  },
  // { routerLink: 'aboutus', icon: '', label: 'About Us', subMenus: null },
  // { routerLink: 'contactus', icon: '', label: 'Contact Us', subMenus: null },
  // {
  //   routerLink:'profile', icon:'', label:'Profile',
  //   subMenus:[
  //       { routerLink:'settings', icon:'', label:'Settings'},
  //       { routerLink:'logout', icon:'', label:'Logout'}
  //   ]
  // },
];
