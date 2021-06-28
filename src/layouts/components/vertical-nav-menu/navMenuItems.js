/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default [
  {
    url: "/dashboard",
    name: "Homeee",
    slug: "homeee",
    icon: "HomeIcon"
  },

  {
    url: "#",
    name: "Administration",
    slug: "Administration",
    icon: "UserIcon",
    submenu: [
      // {
      //   url: "/Admin/Users",
      //   name: "Users",
      //   slug: "users",
      //   i18n: "Users"
      // },
      {
        url: "/Administration/Partners",
        name: "Partners",
        slug: "partners",
        i18n: "Partners"
      },
      {
        url: "/Administration/Applications",
        name: "Applications",
        slug: "applications",
        i18n: "Applications"
      },
      {
        url: "/Administration/Accounts",
        name: "Bank Accounts",
        slug: "accounts",
        i18n: "Accounts"
      }
    ]
  },
  {
    url: "#",
    name: "Banks",
    slug: "Banks",
    icon: "AnchorIcon",
    submenu: [
      {
        url: "/Banks/Banks",
        name: "Banks",
        slug: "banks",
        i18n: "Banks"
      }
    ]
  },
  {
    url: "#",
    name: "Control",
    slug: "Control",
    icon: "SearchIcon",
    submenu: [
      {
        url: "/Control/BlackList",
        name: "BlackList",
        slug: "blackList",
        i18n: "BlackList"
      }
    ]
  },
  {
    url: "#",
    name: "Report",
    slug: "report",
    icon: "ActivityIcon",
    submenu: [
      {
        url: "/Report/Transfers",
        name: "Transfers",
        slug: "transfers",
        i18n: "Transfers"
      }
    ]
  }
];
