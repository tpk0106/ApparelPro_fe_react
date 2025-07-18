import { useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { useContext } from "react";

// import Icon from '../generic/icon.component';

// import { ASSETS_FOLDER_LENGTH, SLASH } from "../defs/defs";
// import { MenuContext } from '../context/menuContext';
import { menuItem } from "../defs/defs";

// document.addEventListener('DOMContentLoaded', function (e) {});

const Menu = ({ label, routerLink, icon, subMenus }: menuItem) => {
  // const afterAssets = icon.substring(ASSETS_FOLDER_LENGTH);
  // const indexOfSubPath = afterAssets.indexOf(SLASH);
  // let path = afterAssets.substring(0, indexOfSubPath);
  // path = `${SLASH}${path}${SLASH}`;

  // const { setMenu, menu } = useContext(MenuContext);

  // useEffect(() => {
  //   console.log("using effect in menu compo");
  //   // menuClick((event) => handleMenuClick(event));

  //   // handleMenuClick(() => menuClick());
  // }, []);

  return (
    <li
      className="cursor-pointer flex border-2 border-gray-600 rounded-md hover:bg-black hover:text-blue-600 p-1 bg-blue-400 w-full text-black justify-center"
      onClick={(event) => {}}
    >
      <NavLink to={routerLink}>
        {/* <Icon iconUrl={icon} subpath={path} alt={label} /> */}
        {label}
      </NavLink>
    </li>
  );
};

export default Menu;
