import { useRef } from "react";
import ChatbotEnterIcon from "./ChatbotEnterIcon";

interface Props {
  chatHistory?: string;
  setChatHistory?: string;
  generateBotResponse?: string
}

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>();
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;
    if(inputRef.current) inputRef.current.value = "";

    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "" },
      ]);

      // Call the function to generate the bot's response
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details provided above, please address this query: ${userMessage}`,
        },
      ]);
    }, 600);
  };

  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input
        ref={inputRef}
        placeholder="Message..."
        className="message-input"
        required
      />
      <button
        type="submit"
        id="send-message"
        className="material-symbols-rounded"
      >
        <ChatbotEnterIcon />
      </button>
    </form>
  );
};

export default ChatForm;
