import React, {useState} from "react";
import {Message} from "../App";
import {send} from "../assets/icons";

type InputProps = {
    addMessage: (msg: Message) => void;
    img: string;
    toggleLoading: (value: boolean) => void;
    chatLoading: boolean;
};


export default function Input({addMessage, img, toggleLoading, chatLoading}: InputProps) {
    const [input, setInput] = useState<string>("");

    function handleInput() {
        addMessage({
            msg: input,
            me: true,
            img,
            _id: Math.random().toString(),
        });
        setInput("");
        toggleLoading(true);
    }

    return (
        <div
            className="botm"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "absolute",
                bottom: "10px",
                width: "100%",
            }}
        >
            <div
                className="input_box"
                style={{
                    width: "86%",
                    backgroundColor: "#40414f",
                    height: "45px",
                    borderRadius: "7px",
                    marginTop: "8px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <input
                    autoFocus={true}
                    onKeyDown={(e) => e.keyCode === 13 && input != "" && handleInput()}
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    type="text"
                    style={{
                        width: "97%",
                        height: "100%",
                        outline: "none",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "white",
                        paddingLeft: "8px",
                    }}
                    placeholder=""
                />
                <button
                    onClick={() => handleInput()}
                    style={{
                        rotate: "90deg",
                        marginRight: "13px",
                        backgroundColor: "transparent",
                        outline: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    {send}
                </button>
            </div>
            <p
                className="hide"
                style={{
                    fontSize: "12.6px",
                    textAlign: "center",
                    marginTop: "19px",
                    color: "rgb(185 185 185)",
                    maxWidth: "85%",
                }}
            >
                ChatGPT . Free Research Preview. Our goal is to make AI systems more
                natural and safe to interact with. Your feedback will help us improve.
            </p>
            <p
                style={{
                    fontSize: "13.5px",
                    marginTop: "9px",
                    cursor: "pointer",
                    color: "#bf3838",
                    fontWeight: "bold",
                }}
            >
                Logout
            </p>
        </div>
    );
}
