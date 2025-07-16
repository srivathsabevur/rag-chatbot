"use client";
import React from "react";
import { useChat } from "@ai-sdk/react";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import LoadingBubble from "./components/LoadingBubble";
import Bubble from "./components/Bubble";
import { Message } from "ai";
import { BiSolidSend } from "react-icons/bi";

const Page = () => {
  const {
    handleInputChange,
    handleSubmit,
    input,
    isLoading,
    messages,
    append,
  } = useChat();

  const noMessages = !messages || messages.length === 0;

  const handlePromptSuggestions = (promptText: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg);
    console.log(msg);
  };

  return (
    <main className=" bg-black text-white flex flex-col h-[80vh] w-[80vw] justify-between items-center mx-auto rounded-lg border-2 border-white/30 shadow z-10">
      <h1 className="text-4xl font-light u mt-12 pixelify">
        ChatBotLite (Powered By Gemini)
      </h1>
      <section
        className={`${
          noMessages ? "" : "h-full flex  justify-end flex-col"
        } w-[80%]`}
      >
        {noMessages ? (
          <>
            <div className="flex flex-col justify-between px-3 py-2 p-3 w-[80%] mx-auto gap-y-5 ">
              <p className="text-lg font-medium leading-snug  text-justify">
                ChatBotLite (Powered by Gemini) is an intelligent and
                user-friendly chatbot designed to provide quick and accurate
                responses to your queries. Whether you need assistance with
                general inquiries, tech support, or interactive conversations,
                ChatBotLite leverages the power of Gemini AI to deliver seamless
                and engaging interactions. With its advanced natural language
                processing capabilities, it understands context, provides
                relevant answers, and enhances user experience with a smooth and
                intuitive interface. Perfect for businesses, customer support,
                or personal use, ChatBotLite ensures efficient communication and
                problem-solving at your fingertips.
              </p>
              <PromptSuggestionsRow onPromptClick={handlePromptSuggestions} />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col overflow-y-scroll scrollbar-thin scrollbar-track-black scrollbar-thumb-rounded-lg scrollbar-thumb-white gap-y-4 max-h-[50vh] p-3">
              {messages.map((message, id) => (
                <Bubble key={`message-${id}`} message={message} />
              ))}
            </div>
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>
      <form className="flex justify-end w-[80%] mt-4" onSubmit={handleSubmit}>
        <div className="flex mb-7 w-full">
          <input
            className="input-text px-3 py-2 p-3 text-lg bg-white/10 backdrop-blur-md placeholder:text-lg rounded-l-lg w-full border-2 border-white/10 focus:outline-none"
            onChange={handleInputChange}
            placeholder="Ask any questions..."
            value={input}
          />
          <button
            type="submit"
            className="pixelify flex gap-2 justify-center items-center bg-white font-medium text-black px-3 py-2 p-3 rounded-r-lg cursor-pointer"
          >
            Submit
            <span className="text-lg">
              <BiSolidSend />
            </span>
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
