import React, { useState } from "react";
import "./App.css";
import axios from "axios";

type Message = {
  content: string;
  url: string;
  role: "user" | "assistant";
};

function ChatMessage(props: { message: Message }) {
  if (props.message.role === "assistant") {
    return (
      <div className="col-start-1 col-end-8 p-3 rounded-lg">
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
            A
          </div>
          <div className="relative ml-3 bg-transparent shadow-md rounded-xl">
            <img src={props.message.content} className="w-[20rem] rounded-xl" />
          </div>
        </div>
      </div>
    );
  } else if (props.message.role === "user") {
    return (
      <div className="col-start-6 col-end-13 p-3 rounded-lg">
        <div className="flex items-center justify-start flex-row-reverse">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 flex-shrink-0">
            U
          </div>
          <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl text-left">
            <div>{props.message.content}</div>
          </div>
        </div>
      </div>
    );
  }
}

export const App = () => {

  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [history, setHistory] = useState<Message[]>([]);
  const [botState, setBotState] = useState<object>({});

  const chatRequest = (history: Message[]) => {
    axios 
      .post("http://localhost:8080/imageGenerator", { prompt })
      .then((res) => {
        const msg = {content: res.data, role: "assistant"};
        setHistory([...history, msg]);
      }).catch((err) => {
        console.log(err);
      })
  };

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6 ">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="grid grid-cols-12 gap-y-2">
              {history.map((message) => (
                <ChatMessage message={message} />
              ))}
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    value={prompt}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPrompt(e.target.value);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        const newMessage: Message = {
                          content: prompt,
                          url: response,
                          role: "user",
                        };
                        setHistory([...history, newMessage]);
                        setPrompt("");
                        chatRequest([...history, newMessage], botState);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <button
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                  onClick={() => {
                    const newMessage: Message = {
                      content: prompt,
                      url: response,
                      role: "user",
                    };
                    setHistory([...history, newMessage]);
                    setPrompt("");
                    chatRequest([...history, newMessage], botState);
                  }
                }
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
