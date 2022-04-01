// FIXME: not yet fixed
// const checker = { score: [] };
// calc.forEach((score, i) => {
//   console.warn(score, i);
//   // Analyze the object / find the existing score
//   console.info(checker, score);
//   const existingScoreIndex = checker.score.findIndex(
//     (score) => score.score === score
//   );
//   console.log(existingScoreIndex);
//   const existingScore = checker.score[existingScoreIndex];
//   console.log(existingScore);
//   let updatedScore;
//   // Add new score type / add quantity
//   if (existingScore) {
//     updatedScore = { ...existingScore };
//     updatedScore.qty = updatedScore.qty + 1;
//     checker.score = [...checker];
//     checker.score[existingScoreIndex] = updatedScore;
//     console.log("entered the exsisted score", updatedScore);
//   } else {
//     updatedScore = { score: score, qty: 1 };
//     checker.score = [...checker.score, updatedScore];
//     console.log("entered the new score", updatedScore);
//   }
//   console.log(checker);
// });
