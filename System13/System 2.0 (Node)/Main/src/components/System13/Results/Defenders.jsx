import React from "react";
import ResultItem from "./ResultsItem";

const Defenders = (props) => {
  return (
    <div className="defenders-wrapper">
      <div className="defenders__label">
        <h2>Defenders</h2>
      </div>
      <div className="defenders">
        <div className="defenders__row">
          <div className="defenders--label">Player Name</div>
          <div className="defenders__row--label">Score</div>
        </div>
        {props.defPlayers.map((cur, i) => (
          <ResultItem
            key={Math.random()}
            team="def"
            playerName={cur[0]}
            playerNumber={cur[1]}
          ></ResultItem>
        ))}
      </div>
    </div>
  );
};

export default Defenders;
