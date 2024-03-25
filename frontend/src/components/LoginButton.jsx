import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  
  return <button className="align-middle min-h-full rounded-full bg-stone-400 p-2 shadow-md border-black hover:bg-stone-700 hover:text-gray-200" onClick={() => loginWithRedirect()}>Log In </button>
};

export default LoginButton;
