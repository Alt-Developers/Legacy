import github from "../assets/img/github.jpg";

const Github = (props) => {
  return (
    <section className="github">
      <h1>This App's Repository</h1>
      <div className="github__container">
        <img src={github} alt="Gith" className="github__img" />
        <div className="github__text">
          <h2>Repository</h2>
          <p>
            All of the code of this website your seeing here is all on our
            Github! For re-using purposes please contact SS-Developers for info.
          </p>
          <h2>MPL 2.0 License</h2>
          <p>
            All of the code of this website your seeing here is all on our
            Github! For re-using purposes please contact SS-Developers for info.
          </p>
          <div className="github__btn-wrapper">
            <a href="https://github.com/SS-Developers/System13">
              <button className="btn github__btn">To Repository</button>
            </a>
            <a href="https://github.com/SS-Developers/System13/blob/main/LICENSE">
              <button className="btn github__btn">MPL 2.0 License</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Github;
