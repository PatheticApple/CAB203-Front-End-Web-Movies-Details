import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";



export default function Home() {
  const [selectedPage, setSelectedPage] = useState(localStorage.getItem("selectedPage"));

  const settingSelectedPage = (value) => {
    localStorage.setItem("selectedPage", value);
    const selectedPage2 = localStorage.getItem("selectedPage");
    setSelectedPage(selectedPage2);

  };

  return (
    <div className="main">
      <div className="main_content">
        <h1>Gary Nguyen's</h1>
        <h1>Fabulous Movie Searching Website</h1>

      {/* Buttons on Home Page */}
        <Link onClick={() => {
          settingSelectedPage('Movie');

        }}
          to="/Movies">Movies</Link>
        <Link onClick={() => {
          settingSelectedPage('Register');

        }}
          to="/Register">Register</Link>
        <Link onClick={() => {
          settingSelectedPage('Login');

        }}
          to="/Login">Login</Link>
      </div>
    </div>

  );
}