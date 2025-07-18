import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useState } from "react";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import { signOutStart } from "../sagaStore/user/user.action";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../sagaStore/user/user.selector";
//import { PowerIcon } from "@heroicons/react/24/solid";
import { USER_CREDENTIALS } from "../defs/defs";

const Login = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem(USER_CREDENTIALS.USER_KEY)
  );
  const dispatch = useDispatch();
  const currUser = useSelector(getCurrentUser);

  const handleLogOut = () => {
    dispatch(signOutStart());
  };
  //   const [icon, setIcon] = useState<any>("Sign In");

  return (
    <div>
      {!(currentUser || currUser) ? (
        <Button
          // variant="gradient"
          variant="text"
          // size="sm"
          className="hidden lg:inline-block"
          onClick={() => {
            // setIcon("sign In");
            navigate("/sign-in");
            // navigate("/auth");
          }}
        >
          <span>Sign In</span>
        </Button>
      ) : (
        <Button
          // variant="gradient"
          variant="text"
          // size="sm"
          className="hidden lg:inline-block"
          onClick={() => {
            handleLogOut();
            setCurrentUser(null);
            navigate("/sign-in");
          }}
        >
          <span>
            {/* {icon} */}
            {/* <PowerIcon className="h-5 w-5" /> */}
            <PowerSettingsNewOutlinedIcon className="hover:text-white" />
          </span>
        </Button>
      )}
    </div>
  );
};

export default Login;
