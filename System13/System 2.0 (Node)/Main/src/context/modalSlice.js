import { createSlice } from "@reduxjs/toolkit";

const initialModalState = {
  isOpen: false,
  info: {
    header: "default",
    text: "default",
    icon: "bx bxs-bell",
    button: null,
    navlink: {
      to: null,
      text: null,
    },
  },
};

const modalSlice = createSlice({
  name: "account",
  initialState: initialModalState,
  reducers: {
    close(state) {
      state.isOpen = false;
      state.info.button = false;
      state.info.navlink = { to: null, text: "Okay..." };
    },
    open(state, action) {
      switch (action.payload) {
        // System13 error vvv
        case "err0":
          state.info.header = "Odd amount of players";
          state.info.text =
            "For system13 to randomize the team players needs to be even";
          state.info.button = "Try again?";
          break;
        case "err1":
          state.info.header = "Sum of tiers are odd";
          state.info.text =
            "This team is an impossible team , please try a new team";
          state.info.button = "Try again?";
          break;
        case "err2":
          state.info.header = "These 2 players are not a match";
          state.info.text =
            "This team is an impossible team , please try a new team";
          state.info.button = "Try again?";
          break;
        case "err3":
          state.info.header = "Player doesn't exist!";
          state.info.text =
            "Seems like you misspelled or that player isn't registered in the database or you probably forgot to login";
          state.info.button = "Try again?";
          break;
        case "err4":
          state.info.header = "Odd amount of tiers";
          state.info.text = "Apparently this team cant be randomized";
          state.info.button = "Try again?";
          break;
        // Server side errors vvv
        case "500":
          state.info.header = "Internal server error";
          state.info.text =
            "The server returned an error code of 500. Please try again in a few seconds";
          state.info.navlink = { to: "/", text: "Back home" };
          state.info.icon = "bx bx-error";
          break;
        case "521":
          state.info.header = "Database seems to be down";
          state.info.text =
            "The server didn't respond at all. Please come back later or try refreshing";
          state.info.navlink = { to: "/", text: "Back home" };
          state.info.icon = "bx bx-error";
          break;
        case "503":
          state.info.header = "Database down for maintenance";
          state.info.text =
            "The server is currently unavailable due to temporary overload or server maintenance";
          state.info.navlink = { to: "/", text: "Back home" };
          state.info.icon = "bx bx-error";

          break;
        case "noP":
          state.info.header = "No players?";
          state.info.text = "System13 can't randomize a team without players";
          state.info.button = "Okay...";
          break;
        case "notLoggedIn":
          state.info.header = "Please login to SS Account";
          state.info.text = "Login to your SS account to unlock System13";
          state.info.navlink = { to: "/profile", text: "Login" };
          break;
        case "addPEmpName":
          state.info.header = "Player name missing";
          state.info.text = "Please enter all fields to add your player";
          state.info.button = "Okay...";
          break;
        case "addPEmpTier":
          state.info.header = "Tier missing";
          state.info.text = "Please enter all fields to add your player";
          state.info.button = "Okay...";
          break;
        case "addPEmpCodename":
          state.info.header = "Invalid player codename length";
          state.info.text = "Player codenames must be 3 characters long";
          state.info.button = "Okay...";
          break;
        // Reminder modal
        default:
          state.info.header = "Reminder";
          state.info.text =
            "This program isn't perfect, this program might lag or worse crash your computer.";
          state.info.button = "I Understand all of the possible consequence";
          break;
      }
      state.isOpen = true;
    },
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice;
