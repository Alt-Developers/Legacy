import { Formik, Form, Field } from "formik";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SpinnerCircularSplit } from "spinners-react";
import { useSelector } from "react-redux";

const ChangeProfilePic = (props) => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const submitRef = useRef();
  const curRoute = useLocation();
  const [isLoading, setIsLoading] = useState(null);
  const userInfo = useSelector((state) => state.account.userInfo);

  const sendReq = async (values) => {
    if (canSubmit) {
      setIsLoading(true);
      const changeImgData = new FormData();
      const token = localStorage.getItem("accToken");
      changeImgData.append("image", image);

      if (token && token !== undefined) {
        await fetch(
          "https://apis.ssdevelopers.xyz/auth/updateUserProfilePicture",
          // "http://localhost:80/auth/updateUserProfilePicture",
          {
            method: "POST",
            body: changeImgData,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accToken"),
            },
          }
        );

        navigate("../profile");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <motion.div
        className="signup"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <section className="signup-con">
          <div className="signup-left">
            <div className="signup-text">
              <h1>Change profile picture</h1>
              <p>
                for {userInfo.firstName} {userInfo.lastName}'s account
              </p>
            </div>
            <Formik
              initialValues={{
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                image: "",
              }}
              validate={(values) => {
                setCanSubmit(true);
              }}
              onSubmit={(values, { setSubmitting }) => {
                sendReq(values);
                console.log("SUBMITTED");
                curRoute.push("/profile");
              }}
            >
              {({ isSubmitting }) => (
                <Form className="signup-form">
                  <div className="signup-formWrapper profilePicLeft">
                    <img
                      src={userInfo.img}
                      style={{
                        objectFit: "cover",
                        height: "25rem",
                        width: "25rem",
                      }}
                      className="previewImg"
                      alt="user profile preview"
                    ></img>
                    <i className="bx bxs-chevron-right rightArrow"></i>
                  </div>
                  <button className="signup-form__imgWrapper" type="button">
                    {!image && <i className="bx bx-image-add"></i>}
                    {image && (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="userProfile"
                        height="150px"
                        width="150px"
                        className="previewImg"
                      />
                    )}
                    <Field
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(event) => {
                        setImage(event.currentTarget.files[0]);
                      }}
                      className="signup-form__img"
                    />
                  </button>

                  <button
                    type="submit"
                    className={`${
                      canSubmit
                        ? "login-form__submit"
                        : "login-form__cantSubmit"
                    }`}
                    disabled={isSubmitting}
                    ref={submitRef}
                  >
                    {!isLoading && <>&raquo;</>}
                    {isLoading && (
                      <SpinnerCircularSplit
                        color="#fff"
                        thickness="150"
                        speed="150"
                      />
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default ChangeProfilePic;
