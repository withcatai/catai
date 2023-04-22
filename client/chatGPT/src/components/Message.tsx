import React from "react";
import { Message as MessageProps } from "../App";
import { logo } from "../assets/icons";

export default function Message({ me, msg, img }: MessageProps) {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: !me ? "#444654" : "transparent",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        padding: "18px 0",
        borderRadius: "5px",
      }}
    >
      <div
        style={{ width: "25px", marginLeft: "15px", alignItems: "flex-start" }}
      >
        {img ? (
          <img
            style={{ borderRadius: "3px", width: "32px" }}
            src={img}
            alt=""
          />
        ) : (
          <div
            style={{
              backgroundColor: "#10a37f",
              width: "fit-content",
              padding: "3px",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {logo}
          </div>
        )}
      </div>
      <pre
        style={{
          marginLeft: me ? "35px" : "28px",
          marginRight: "15px",
          fontSize: "14px",
          lineHeight: "20px",
          width: "100%",
          marginTop: "6.5px",
        }}
      >
        {msg.trim()}
      </pre>
    </div>
  );
}
