import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerCircularSplit } from "spinners-react";

import { authenticateAccount } from "../../context/authenticateActions";

const Login = (props) => {
  const dispatch = useDispatch();
  const failedAuth = useSelector((state) => state.account.failedAuth);

  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  const submitRef = useRef();

  useEffect(() => {
    if (failedAuth) {
      submitRef.current.blur();
      setIsLoading(false);
    }
  }, [failedAuth]);

  useEffect(() => {
    if (enteredEmail !== "" && enteredPassword !== "") {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [enteredEmail, enteredPassword]);

  const loginSubmitHandler = async (event) => {
    event.preventDefault();
    if (enteredEmail !== "" && enteredPassword !== "") {
      setIsLoading(true);
      dispatch(
        authenticateAccount({ email: enteredEmail, pass: enteredPassword })
      );
    }
  };

  const emailInputHandler = (event) => {
    setEnteredEmail(event.target.value);
  };
  const passwordInputHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  return (
    <motion.div
      className="login"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <motion.section
        className={`login-con`}
        initial={{ x: "-50%", y: "-50%" }}
        animate={
          !isLoading && isLoading !== null
            ? {
                x: ["-40%", "-60%", "-45%", "-55%", "-50%"],
                y: "-50%",
              }
            : { x: "-50%", y: "-50%" }
        }
        transition={{ ease: "easeOut", duration: 0.3 }}
      >
        <div className="login-text">
          <h1>Log In to SS Account</h1>
          <p>To unlock more features for System13</p>
        </div>

        <form className="login-form" onSubmit={loginSubmitHandler}>
          <input
            type="email"
            value={enteredEmail}
            onChange={emailInputHandler}
            placeholder="email"
            className="login-form__input"
          />
          <input
            type="password"
            value={enteredPassword}
            placeholder="password"
            onChange={passwordInputHandler}
            className="login-form__input"
          />
          <NavLink to="/signup" className="u-remove-a-eff login-form__signup">
            Don't have an account?
          </NavLink>
          <motion.button
            type="submit"
            className={`${
              canSubmit ? "login-form__submit" : "login-form__cantSubmit"
            }`}
            disabled={!canSubmit}
            ref={submitRef}
          >
            {!isLoading && <>&raquo;</>}
            {isLoading && (
              <SpinnerCircularSplit color="#fff" thickness="150" speed="150" />
            )}
          </motion.button>
        </form>
      </motion.section>
    </motion.div>
  );
};

export default Login;
