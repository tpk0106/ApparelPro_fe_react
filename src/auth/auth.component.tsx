import { useState } from "react";
import SignInForm from "../user/sign-in/sign-in.form.component";
import SignUpForm from "../user/sign-up/sign-up.form.component";
import SignIn from "../user/sign-in/signin.component";

const Auth = () => {
  const [signIn, setSignIn] = useState(true);
  const [signUp, setSignUp] = useState(false);

  return (
    <>
      {signIn && (
        // <SignIn />
        <SignInForm
          setParentStatus={() => {
            setSignIn(false);
            setSignUp(true);
          }}
        />
      )}
      {signUp && (
        <SignUpForm
          setParentStatus={() => {
            setSignIn(true);
            setSignUp(false);
          }}
        />
      )}
    </>
  );
};

export default Auth;
