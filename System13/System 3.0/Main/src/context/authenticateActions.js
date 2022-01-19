import { accountActions } from "./accountSlice";

export const authenticateAccount = ({
  email = false,
  pass = false,
  token = false,
}) => {
  return async (dispatch) => {
    let auth;
    if (!token) {
      auth = async () => {
        dispatch(accountActions.error(false));
        await fetch("https://apis.ssdevelopers.xyz/auth/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            pass,
          }),
        })
          .then((data) => {
            switch (data.status) {
              case 521:
                throw new Error("Server is down");
              case 401:
                throw new Error("Not authenticated");
              case 403:
                throw new Error("Not authorized");
              default:
                return data;
            }
          })
          .then((data) => data.json())
          .then((data) => {
            dispatch(
              accountActions.login({
                token: data.token,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                img: `https://apis.ssdevelopers.xyz/${data.img}`,
              })
            );
          });
      };
    }

    if (!email && !pass) {
      auth = async () => {
        dispatch(accountActions.error(false));
        await fetch("https://apis.ssdevelopers.xyz/auth/getUserData", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accToken"),
          },
        })
          .then((data) => data.json())
          .then((data) => {
            dispatch(
              accountActions.login({
                token: data.token,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                img: `https://apis.ssdevelopers.xyz/${data.img}`,
              })
            );
          });
      };
    }

    try {
      await auth();
    } catch (err) {
      dispatch(accountActions.error(true));
    }
  };
};
