import React from "react";
import { alert, sun, thunder } from "../assets/icons";

export default function Hero() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h1 style={{ marginTop: "18vh", marginBottom: "5vh" }}>ChatGPT</h1>
      <div
        className="cols"
        style={{ display: "flex", flexDirection: "row", gap: "58px" }}
      >
        <div
          className="row"
          style={{
            width: "225px",
            height: "150px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {sun}
          <p style={{ fontSize: "18px", marginTop: "5px" }}>Examples</p>
          <div
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              lineHeight: "18px",
              marginTop: "18px",
              fontSize: "14px",
            }}
          >
            "Explain quantum computing in simple terms"
          </div>
          <div
            className=""
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              lineHeight: "18px",
              fontSize: "14px",
            }}
          >
            "Got any creative ideas for a 10 year old’s birthday?"
          </div>
          <div
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              lineHeight: "18px",
              fontSize: "14px",
            }}
          >
            "How do I make an HTTP request in Javascript?"
          </div>
        </div>
        <div
          className="row hiderow"
          style={{
            width: "225px",
            height: "150px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {thunder}
          <p style={{ fontSize: "18px", marginTop: "5px" }}>Capabilities</p>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
            }}
          >
            Remembers what user said earlier in the conversation
          </div>
          <div
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
            }}
          >
            Allows user to provide follow-up corrections
          </div>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
            }}
          >
            Trained to decline inappropriate requests
          </div>
        </div>
        <div
          className="row hiderow"
          style={{
            width: "225px",
            height: "150px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {alert}
          <p style={{ fontSize: "18px", marginTop: "5px" }}>Limitations</p>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
            }}
          >
            May occasionally generate incorrect information
          </div>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
            }}
          >
            May occasionally produce harmful instructions or biased content
          </div>
          <div
            className="hiderow"
            style={{
              backgroundColor: "#3e3f4b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px",
              marginTop: "18px",
              fontSize: "14px",
              lineHeight: "18px",
            }}
          >
            Limited knowledge of world and events after 2021
          </div>
        </div>
      </div>
    </div>
  );
}
