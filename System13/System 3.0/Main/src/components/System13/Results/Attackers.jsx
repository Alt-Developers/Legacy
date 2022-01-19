import React from "react";
import ResultItem from "./ResultsItem";

const Attackers = (props) => {
  return (
    <div className="attackers-wrapper">
      <div className="attackers__label">
        <h2>Attackers</h2>
      </div>
      <div className="attackers">
        <div className="attackers__row">
          <div className="attackers--label">Player Name</div>
          <div className="attackers__row--label">Score</div>
        </div>
        {props.atkPlayers.map((cur) => (
          <ResultItem
            key={Math.random().toString()}
            team="atk"
            playerName={cur[0]}
            playerNumber={cur[1]}
          ></ResultItem>
        ))}
      </div>
    </div>
  );
};

export default Attackers;
