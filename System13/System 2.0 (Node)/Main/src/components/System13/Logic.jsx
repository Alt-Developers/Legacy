import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { modalActions } from "../../context/modalSlice";

const Logic = (props) => {
  const playerInpRef1 = useRef("");
  const playerInpRef2 = useRef("");
  const playerInpRef3 = useRef("");
  const playerInpRef4 = useRef("");
  const playerInpRef5 = useRef("");
  const playerInpRef6 = useRef("");
  const playerInpRef7 = useRef("");
  const playerInpRef8 = useRef("");
  const playerInpRef9 = useRef("");
  const playerInpRef10 = useRef("");

  const [playerNamesData, setPlayerNamesData] = useState();
  const [playerScoreData, setPlayerScoreData] = useState();

  const userInfo = useSelector((state) => state.account.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const display = (resultArr, score) => {
    const newScore = [];
    const reactFormatArr = [];

    // Old format to ["John Doe", 3] format
    score.forEach((_, i) => {
      newScore.push(...score[i]);
    });
    // Changes codenames to full names
    resultArr.forEach((result, i) => {
      const fullName = playerScoreData.hasOwnProperty(result)
        ? playerNamesData[result]
        : result;
      reactFormatArr.push([fullName, newScore[i]]);
    });

    const teamPlayerAmount = reactFormatArr.length / 2;
    const atkFreshResults = reactFormatArr.slice(0, teamPlayerAmount);
    const defFreshResults = reactFormatArr.slice(teamPlayerAmount);

    // Lifts processed results to System13 component
    props.liftResults(atkFreshResults, defFreshResults);
  };

  const checkScore = function (arr) {
    const calc = [];
    const playerPerTeam = arr.length / 2;
    arr.forEach((cur) => {
      calc.push(playerScoreData[cur]);
    });

    const attackers = calc.slice(0, playerPerTeam);
    const defenders = calc.slice(playerPerTeam);
    const attackerScore = attackers.reduce((acc, cur) => acc + cur);
    const defenderScore = defenders.reduce((acc, cur) => acc + cur);
    if (attackerScore === defenderScore) {
      return [attackers, defenders];
    } else {
      return false;
    }
  };

  const endl = () => {
    console.log("--------------------------------");
  };
  const boldEndl = () => {
    console.warn("============================");
  };

  const checkForImpossible = (arr) => {
    console.log("Checking if team is possible ---");
    const calc = [];
    arr.forEach(function (cur, i) {
      calc.push(playerScoreData[cur]);
    });

    // Does player exist?
    let err3 = false;
    calc.forEach((cur) => {
      if (cur === undefined) {
        console.log("❌ : This player doesn't exist");
        err3 = "err3";
      } else {
        console.log("✅ : This player exist");
      }
    });
    if (err3) {
      endl();
      console.info("🗂 : Troubleshooted Code [err3]");
      return "err3";
    }

    // Are players odd?
    if (calc.length % 2 === 0) {
      console.log("✅ : Players amount aren't odd");
    } else {
      console.log("❌ : Players amount are odd");
      endl();
      console.info("🗂 : Troubleshooted Code [err0]");
      return "err0";
    }

    // Are tier scores odd?
    if (calc.reduce((acc, cur) => acc + cur) % 2 === 0) {
      console.log("✅ : Tiers add up to even");
    } else {
      console.log("❌ : Tiers add up to odd");
      endl();
      console.info("🗂 : Troubleshooted Code [err1]");
      return "err1";
    }

    const scoreExisted = [];
    const timesExisted = [];
    let err4 = false;
    scoreExisted.push(calc[0]);
    timesExisted.push([calc[0], 0]);
    calc.forEach((score) => {
      if (scoreExisted.includes(score)) {
        let whereExisted = scoreExisted.indexOf(score);
        timesExisted[whereExisted][1]++;
      } else {
        scoreExisted.push(score);
        timesExisted.push([score, 1]);
      }
    });
    timesExisted.forEach((existed) => {
      if (existed[1] % 2 !== 0) {
        console.log("❌ : Odd amount of tier(s)");
        console.info("🗂 : Troubleshooted Code [err4]");
        err4 = true;
      } else {
        console.log("✅ : Even amount of tier(s)");
      }
    });
    if (err4) return "err4";

    if (calc.length === 2) {
      // 2 players are not a match
      if (calc[0] !== calc[1]) {
        console.log("❌ : 2 players are not a match");
        endl();
        console.info("🗂 : Troubleshooted Code [err2]");
        return "err2";
      } else {
        console.log("✅ : These 2 players are a match");
      }
    } else {
      console.log("🔎 : There's more than 2 players");
    }

    console.info("✅ : Passed all tests!");
    endl();
  };

  const randomizer = function (array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  const main = function (players) {
    let finishedEqualling = false;
    let timesEqualized = 0;
    let processingPlayers;
    let checkForError = checkForImpossible(players);

    if (checkForError === "err1") {
      dispatch(modalActions.open("err1"));
      return false;
    } else if (checkForError === "err2") {
      dispatch(modalActions.open("err2"));
      return false;
    } else if (checkForError === "err0") {
      dispatch(modalActions.open("err0"));
      return false;
    } else if (checkForError === "err3") {
      dispatch(modalActions.open("err3"));
      return false;
    } else if (checkForError === "err4") {
      dispatch(modalActions.open("err4"));
      return false;
    }

    while (finishedEqualling === false && timesEqualized <= 200) {
      processingPlayers = randomizer(players);
      finishedEqualling = checkScore(processingPlayers);
      timesEqualized++;
    }
    console.info(
      `Found a perfect team with ${timesEqualized} ${
        timesEqualized === 1 ? "iteration" : "iterations"
      }.`
    );
    display(processingPlayers, finishedEqualling);
  };

  const startSystem = (event) => {
    event.preventDefault();
    console.clear();
    console.warn("Start System ===============");
    const players = [
      playerInpRef1.current.value,
      playerInpRef2.current.value,
      playerInpRef3.current.value,
      playerInpRef4.current.value,
      playerInpRef5.current.value,
      playerInpRef6.current.value,
      playerInpRef7.current.value,
      playerInpRef8.current.value,
      playerInpRef9.current.value,
      playerInpRef10.current.value,
    ]
      .filter((player) => player !== "")
      .map((player) =>
        player.trim().replaceAll(" ", "").toUpperCase().slice(0, 3)
      );

    if (players.length === 0) {
      dispatch(modalActions.open("noP"));
    } else {
      main(players);
    }
    boldEndl();
  };

  useEffect(() => {
    console.warn("Server Connection ==========");
    const token = localStorage.getItem("accToken")
      ? localStorage.getItem("accToken")
      : localStorage.removeItem("accToken");
    if (token && token !== undefined) {
      console.log("✅ : User is logged in");
      (async () => {
        const data = await fetch(
          "https://apis.ssdevelopers.xyz/system13/getRealNameList",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accToken"),
            },
          }
        );
        const response = await data.json();
        console.log(response.playersList);
        setPlayerNamesData(response.playersList);
        console.log("✅ : Player names data fetched");
      })();
      (async () => {
        const data = await fetch(
          "https://apis.ssdevelopers.xyz/system13/getPlayersList",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accToken"),
            },
          }
        )
          .then((response) => {
            if (response.status === 500) {
              dispatch(modalActions.open("500"));
            }
            if (response.status === 503) {
              dispatch(modalActions.open("503"));
            }
            if (response.status === 403) {
              dispatch(modalActions.open("403"));
            }
            return response;
          })
          .catch(() => {
            dispatch(modalActions.open("521"));
          });
        const response = await data.json();
        console.log(response.playersList);
        setPlayerScoreData(response.playersList);
        console.log("✅ : Player score data fetched");
      })();
    } else {
      dispatch(modalActions.open("notLoggedIn"));
    }
  }, [navigate, dispatch]);

  return (
    <div className="start__wrapper">
      <div className="start__text">
        <h1>
          Welcome to System13
          {userInfo.firstName ? `, ${userInfo.firstName}` : ""}
        </h1>
        <p>To start input all players that are playing</p>
        <p>Not all fields need to be filled</p>
      </div>

      <form className="start__form" onSubmit={startSystem}>
        <div className="start__form--left">
          <input type="text" placeholder="Player 1" ref={playerInpRef1} />
          <input type="text" placeholder="Player 2" ref={playerInpRef2} />
          <input type="text" placeholder="Player 3" ref={playerInpRef3} />
          <input type="text" placeholder="Player 4" ref={playerInpRef4} />
          <input type="text" placeholder="Player 5" ref={playerInpRef5} />
        </div>
        <div className="start__form--right">
          <input type="text" placeholder="Player 6" ref={playerInpRef6} />
          <input type="text" placeholder="Player 7" ref={playerInpRef7} />
          <input type="text" placeholder="Player 8" ref={playerInpRef8} />
          <input type="text" placeholder="Player 9" ref={playerInpRef9} />
          <input type="text" placeholder="Player 10" ref={playerInpRef10} />
        </div>
        <button type="submit" className="submit__form--start dark-btn btn">
          Start the randomization!
        </button>
      </form>
    </div>
  );
};

export default Logic;
