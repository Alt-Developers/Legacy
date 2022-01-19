import React from "react";
import Login from "../components/Account/Login";
import Account from "../components/Account/Logged In/Account";
import { useSelector } from "react-redux";

const Profile = (props) => {
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);
  return (
    <>
      {!isLoggedIn && <Login />}
      {isLoggedIn && <Account />}
    </>
  );
};

export default Profile;
