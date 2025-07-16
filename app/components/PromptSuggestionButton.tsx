import React, { MouseEventHandler } from "react";

const PromptSuggestionButton = ({
  text,
  onclick,
}: {
  text: string;
  onclick: MouseEventHandler;
}) => {
  return (
    <button
      className="bg-white text-black rounded-lg px-3 py-2 p-3 m-2 font-medium"
      onClick={onclick}
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
