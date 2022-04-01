import { useSelector, useDispatch } from "react-redux";
import { accountActions } from "../../../context/accountSlice";
import Players from "./Players";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ExistingPlayerItem from "./ExistingPlayerItem";
import { useState } from "react";
import { SpinnerCircularSplit } from "spinners-react";

const Account = (props) => {
  const userInfo = useSelector((state) => state.account.userInfo);
  const dispatch = useDispatch();

  const [existingPlayer, setExistingPlayer] = useState();

  useEffect(() => {
    (async () => {
      await fetch("https://apis.ssdevelopers.xyz/system13/getUserPlayer", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accToken"),
        },
      })
        .then((data) => data.json())
        .then((data) => {
          setExistingPlayer(data.userPlayer);
        });
    })();
  }, []);

  return (
    <motion.section
      className="account"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="account__profile">
        <div className="account__profile-con">
          <Link to="/profile/changeProfilePicture">
            <span>
              <i className="bx bxs-image-add"></i>
            </span>
            <img src={userInfo.img} alt="User" />
          </Link>
          <div className="account__profile--text">
            <h1>
              {userInfo.firstName} {userInfo.lastName}
            </h1>
            <p>SS Account</p>
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            dispatch(accountActions.logout());
          }}
        >
          Logout
        </button>
      </div>
      <div className="account__right">
        <div className="account__players">
          <h2>Add player to System13</h2>
          <p>to your account</p>
          <Players />
        </div>
        <div className="account__existing">
          <h2>Existing Players</h2>
          <p>In your account</p>
          <ul className="account__existing--list">
            <li>
              <h3 style={{ fontWeight: "600", fontSize: "1.7rem" }}>
                Name &#8212; Codename
              </h3>
              <h2 style={{ fontWeight: "600", fontSize: "1.7rem" }}>Tier</h2>
            </li>
            {existingPlayer ? (
              existingPlayer.map((player) => (
                <ExistingPlayerItem
                  key={Math.random()}
                  name={player.realName}
                  tier={player.score}
                />
              ))
            ) : (
              <li style={{ display: "flex", justifyContent: "center" }}>
                <SpinnerCircularSplit color="#fff" />
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.section>
  );
};

export default Account;
