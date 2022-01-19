import React, { Fragment, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticateAccount } from "./context/authenticateActions";

import Navigation from "./components/Layout/Navigation";
import Footer from "./components/Layout/Footer";
import System13 from "./pages/System13";
import Github from "./pages/Github";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./components/Account/Signup";
import Modal from "./components/Layout/Modal";
import ChangeProfilePic from "./components/Account/Logged In/ProfilePic";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accToken");
    if (token === undefined) {
      localStorage.removeItem("accToken");
    }
    if (token) {
      dispatch(
        authenticateAccount({ token: localStorage.getItem("accToken") })
      );
    }
  }, [dispatch]);

  return (
    <Fragment>
      <Modal />
      <Navigation />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="system" element={<System13 />} />
        <Route path="github" element={<Github />} />
        <Route path="profile" element={<Profile />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="/profile/changeProfilePicture"
          element={<ChangeProfilePic />}
        />
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default App;
