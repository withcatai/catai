import {useEffect, useState} from "react";
import Hero from "./components/Hero";
import Input from "./components/Input";
import Messages from "./components/Messages";
import Message from "./components/Message";
import {bool} from "prop-types";

export type Message = {
    msg: string; me?: boolean; img: string | undefined; _id: string;
};

type User = {
    apiKey: string; avatar: string; createdAt: string; queries: string; uid: string; updatedAt: string; username: string; _id: string;
};


export default function App() {
    const [ready, setReady] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [current, setCurrent] = useState<string | null>("");
    const [botMessage, setBotMessage] = useState<Message|undefined>(undefined);
    const [connection, setConnection] = useState<WebSocket>();
    const [chatLoading, setChatloading] = useState(true);
    const [lastQuestion, setLastquestion] = useState<string|undefined>(undefined);

    const [auth, setAuth] = useState<User | undefined>(() => {
        const user = localStorage.getItem("auth");
        if (!user) return undefined;
        return JSON.parse(user);
    });

    function addMessage(msg: Message) {
        setMessages((prev) => [...prev, msg]);
        if (msg.me && ready && connection) {
            console.log("sending message:", msg.msg)
            connection.send(JSON.stringify({"question":msg.msg}));
        } else if(msg.me) {
            console.log("buffering question");
            setLastquestion(msg.msg);
        }
    }

    useEffect(() => {
        /*
        in case user sent message while the chat is loading,
        the message will be buffered. after the loading ended,
        send the buffered question and set the buffer to none.
         */
        console.log("checking buffered question");
        if(connection && lastQuestion) {
            console.log("send buffered question:", lastQuestion);
            connection.send(JSON.stringify({"question":lastQuestion}));
            setLastquestion(undefined);
        }
    }, [chatLoading]);

    useEffect(() => {
        console.log("Connecting to websocket server");
        const myConnection = new WebSocket('ws://localhost:3000');
        myConnection.addEventListener('message', event => {
            let message = JSON.parse(event.data)
            console.log(message.value);
            if(message.value != "\n> ") {
                setCurrent(message.value);
                setChatloading(false);
            }
            else {
                setReady(true);
            }
        })
        setConnection(myConnection);
    }, [])

    useEffect(() => {
            // end of bot message:
            if (current == null) {
                console.log("reset current message")
                setBotMessage(undefined);
            }
            else {
                if(botMessage) {
                    botMessage.msg += current;
                } else if(current){
                    const msg = {
                        msg: current,
                        me: false,
                        img: undefined,
                        _id: Math.random().toString(),
                    };
                    addMessage(msg);
                    setBotMessage(msg)
                }
            }
        }, [current]);

    return (<>
        <div
            className="main_cont"
            style={{
                width: "50%", margin: "auto", height: "100vh", position: "relative",
            }}
        >
            {messages.length != 0 ? (<div
                className="inner_cont"
                style={{
                    height: "88%", overflowY: "scroll",
                }}
            >
                <Messages messages={messages} show={chatLoading}/>
            </div>) : (<Hero/>)}
            <Input
                img={"https://pbs.twimg.com/profile_images/1430135961724375055/MUaARC5h_400x400.jpg"}
                addMessage={addMessage}
                toggleLoading={setChatloading}
                chatLoading={chatLoading}
            />
        </div>
    </>);
}
