import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="dark-footer">
    <h3>MPL2.0 Lisence &copy;2021 Prawich & Jirat</h3>
    <ul>
      <a href="https://ssdevelopers.xyz">
        <li>Portals</li>
      </a>
      <Link to="/">
        <li>Home</li>
      </Link>
      <Link to="/github">
        <li>GitHub</li>
      </Link>
      <Link to="/system">
        <li>System</li>
      </Link>
      <li>Version 3.0</li>
    </ul>
  </footer>
);

export default React.memo(Footer);
