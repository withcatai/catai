import React, { useState } from "react";
import { logo } from "../assets/icons";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../url";

export type AuthPropType = {
  handleAuth: (value: any) => void;
};

export default function Login({ handleAuth }: AuthPropType) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  function handleLogin() {
    if (!username || !password) return toast.error("All credentials required");
    axios
      .post(`${url}/auth/login`, { username, password })
      .then((res) => {
        localStorage.setItem("auth", JSON.stringify(res.data));
        handleAuth(res.data);
        navigate("/chat");
      })
      .catch((err) => toast.error(err.response.data.message));
  }

  return (
    <>
      <Toaster />
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="box_auth"
          style={{
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "24vh",
          }}
        >
          <p style={{ position: "absolute", top: "20px", fontSize: "28px" }}>
            {logo}
          </p>
          <h1 style={{ color: "black", marginBottom: "18px" }}>Welcome back</h1>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              marginTop: "15px",
              width: "270px",
              height: "41px",
              paddingLeft: "8px",
              fontSize: "16px",
              outline: "none",
              border: "1px solid gray",
              marginBottom: "18px",
              borderRadius: "4px",
            }}
            type="text"
            placeholder="Username"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginTop: "15px",
              width: "270px",
              height: "41px",
              paddingLeft: "8px",
              fontSize: "16px",
              outline: "none",
              border: "1px solid gray",
              borderRadius: "4px",
              marginBottom: "18px",
            }}
            type="password"
            placeholder="Password"
          />
          <button
            onClick={() => handleLogin()}
            style={{
              marginTop: "15px",
              width: "285px",
              height: "41px",
              fontSize: "16px",
              outline: "none",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#10a37f",
              color: "white",
              marginBottom: "12px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <p style={{ marginTop: "14px", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link
              style={{ color: "#10a37f", textDecoration: "none" }}
              to="/signup"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
