import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button className="align-middle min-h-full rounded-full bg-stone-400 p-2 shadow-md border-black hover:bg-stone-700 hover:text-gray-200" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out 
    </button>
  );
};

export default LogoutButton;