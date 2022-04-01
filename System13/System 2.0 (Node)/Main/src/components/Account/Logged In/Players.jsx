import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { modalActions } from "../../../context/modalSlice";

const Players = (props) => {
  const dispatch = useDispatch();
  const codenameRef = useRef("");
  const nameRef = useRef("");
  const tierRef = useRef("");

  const submitHandler = async (event) => {
    event.preventDefault();
    const name = nameRef.current.value;
    const tier = tierRef.current.value;
    const codename = codenameRef.current.value;

    if (!name) dispatch(modalActions.open("addPEmpName"));
    if (!tier) dispatch(modalActions.open("addPEmpTier"));
    if (codename.length !== 3) dispatch(modalActions.open("addPEmpCodename"));

    await fetch("http://apis.ssdevelopers.xyz/system13/addPlayer", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accToken"),
      },
      body: JSON.stringify({
        realName: name.trim(),
        score: tier.trim(),
        codeName: codename.slice(0, 3).toUpperCase(),
      }),
    })
      .then((data) => data.json())
      .then((data) => console.log(data));

    nameRef.current.value = "";
    tierRef.current.value = "";
    codenameRef.current.value = "";
  };
  return (
    <React.Fragment>
      <motion.form onSubmit={submitHandler} className={`account__addPlayer`}>
        <input type="number" min="1" max="4" placeholder="tier" ref={tierRef} />
        <input type="text" placeholder="codename" ref={codenameRef} />
        <input type="text" placeholder="full name" ref={nameRef} />
        <button type="submit">+</button>
      </motion.form>
    </React.Fragment>
  );
};

export default Players;
