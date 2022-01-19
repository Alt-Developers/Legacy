import { SpinnerInfinity } from "spinners-react";

const Starting = (props) => {
  return (
    <section className="starting">
      <h1>Starting System13</h1>
      <h3>Please wait</h3>
      <SpinnerInfinity size="500" color="#fa4454" />
    </section>
  );
};

export default Starting;
