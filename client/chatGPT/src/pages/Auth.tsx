import React from "react";
import { logo } from "../assets/icons";
import { Link } from "react-router-dom";
export default function Auth() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <div
        className="buttons"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {logo}
        <p style={{ marginTop: "28px", marginBottom: "8px", fontSize: "18px" }}>
          Welcometo chatGPT
        </p>
        <p>Login to continue</p>
        <div
          className="same_line"
          style={{ display: "flex", flexDirection: "row", marginTop: "25px" }}
        >
          <Link
            to="/login"
            style={{
              fontSize: "16px",
              outline: "none",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#10a37f",
              color: "white",
              padding: "8px 10px",
              marginRight: "15px",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            style={{
              fontSize: "16px",
              outline: "none",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#10a37f",
              color: "white",
              padding: "8px 10px",
              textDecoration: "none",
              marginRight: "-7px",
            }}
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
