import React from "react";
import { Message } from "ai";
const Bubble = ({ message }: { message: Message }) => {
  // const { content, id, role } = message;
  return (
    <div
      className={`${
        message.role === "user" ? "ml-auto" : "mr-auto"
      } flex bg-white/20 backdrop-blur-md text-white text-lg font-medium w-[45%] px-6 py-4 p-5 my-2 rounded-3xl`}
    >
      {message.content}
    </div>
  );
};

export default Bubble;
