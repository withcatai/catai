import React, {useEffect, useRef} from "react";
import {Message as MessageType} from "../App";
import loader from "../assets/loader.gif"
import Message from "./Message";


type MessagesProps = {
    messages: MessageType[];
    show: boolean;
};

export default function Messages({messages, show}: MessagesProps) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    useEffect(updateScroll, [messages]);

    function updateScroll() {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }

    return (
        <div
            className="msg_cont"
            style={{
                width: "85%",
                margin: "auto",
                marginTop: "2.5vh",
                overflowY: "scroll",
            }}
        >
            <>
                {messages.map((item) => {
                    return (
                        <div ref={scrollRef} key={item._id}>
                            <Message
                                me={item.me}
                                msg={item.msg}
                                img={item.img}
                                _id={item._id}
                                key={item._id}
                            />
                        </div>
                    );
                })}
            </>
            {show && (
                <p style={{textAlign: "center", margin: "28px 0", fontSize: "14px"}}>
                    <img style={{width: "23px"}} src={loader} alt=""/>
                </p>
            )}
        </div>
    );
}