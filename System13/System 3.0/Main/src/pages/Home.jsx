import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import valorantLearn1 from "../assets/img/valorantLearn1.jpeg";
import valorantLearn2 from "../assets/img/valorantLearn2.png";

const Home = (props) => {
  return (
    <Fragment>
      <section className="hero" id="hero">
        <div className="hero__content">
          <div className="hero__text-wrapper">
            <h1 className="hero__text--1">
              What if <br />
              Matchmaking <br />
              Was Easy?
            </h1>
            <p>It's time to end "My team isn't fair"</p>
          </div>
          <a href="#learnMore">
            <button className="u-remove-a-eff">Learn More &darr;</button>
          </a>
        </div>
      </section>
      <section className="learn-more" id="learnMore">
        <div className="learn-more__odd">
          <div className="big1">
            <img src={valorantLearn1} alt="Valorant White" />
          </div>

          <div className="p1">
            <h3>Simple, Flawless, Fast.</h3>
            <p>
              System13 is a web-application for doing manual Valorant <br />
              fair team matchmaking. <br />
              Using is as easy as <br />
              inputting team member names.
            </p>
            <NavLink to="./system">
              <button className="btn">Launch Now &rarr;</button>
            </NavLink>
          </div>
        </div>
        <div className="learn-more__even">
          <div className="p2">
            <h3>Why System13?</h3>
            <p>
              Because System13 provides a seamless experience throughout the
              process of making teams. Valorant tournaments like{" "}
              <b>VR Valoleague </b>
              uses System13 for matchmaking.
            </p>
          </div>
          <div className="big2">
            <img src={valorantLearn2} alt="" />
          </div>
        </div>
      </section>
      <section className="other">
        <h1>
          Check out other products from <br />
          SS Developers
        </h1>
        <div className="other__List">
          <a
            href="https://ssdevelopers.xyz/"
            className="other__List--Portal u-remove-a-eff"
          >
            <h3>Portals</h3>
            <p>Home to all our products</p>
          </a>
          <a
            href="https://ssdevelopers.xyz/Dev_News/"
            className="other__List--DevNews u-remove-a-eff"
          >
            <h3>
              Developer <br />
              News
            </h3>
            <p>Fresh News from developers</p>
          </a>
          <a
            href="https://www.youtube.com/channel/UCO1fVzQocrlgTuehucWi31g"
            className="other__List--ValoLeague u-remove-a-eff"
          >
            <h3>
              Valo <br />
              League
            </h3>
            <p>Where players compete for the throne</p>
          </a>
        </div>
      </section>
    </Fragment>
  );
};
export default Home;
