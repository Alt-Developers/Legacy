import React from "react";
import { motion } from "framer-motion";

const ResultItem = (props) => {
  const teamClass = `${props.team === "atk" ? "attackers" : "defenders"}`;
  return (
    <motion.div
      className={`${teamClass}__row row-doe`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${teamClass}__row--add`}>{props.playerName}</div>
      <div className={`${teamClass}__row--add`}>{props.playerNumber}</div>
    </motion.div>
  );
};

export default ResultItem;
