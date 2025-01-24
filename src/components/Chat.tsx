import React, { useEffect, useState, useRef } from "react";
import { askQuestion } from "../api"; // API Call
import { Card } from "@/components/ui/card";
import { UserCircle, Bot, Send, UploadCloud } from "lucide-react";

interface ChatProps {
  documents: { id: number; name: string; url: string }[];
  onUpload: (doc: { id: number; name: string; url: string }) => void;
}

export const Chat: React.FC<ChatProps> = ({ documents, onUpload }) => {
  const [messages, setMessages] = useState<{ sender: "User" | "AI"; text: string }[]>([
    { sender: "AI", text: "Please ask me any question related to the document you uploaded or any question in general." },
  ]);
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Handle sending a question
  const handleSend = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { sender: "User", text: question }]);
    setIsThinking(true);

    try {
      const res = await askQuestion(question);
      setMessages((prev) => [...prev, { sender: "AI", text: res.data.response }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { sender: "AI", text: "⚠️ Error fetching response from AI." }]);
    } finally {
      setIsThinking(false);
    }

    setQuestion(""); // Clear input after sending
    inputRef.current?.focus(); // Auto-focus input for next question
  };

  // Handle uploading a new document
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDoc = {
        id: documents.length + 1,
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      };
      onUpload(newDoc);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      {/* Chat Messages (Fixed Height with Internal Scroll) */}
      <div
        ref={chatContainerRef}
        id="chat-container"
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: "calc(100% - 64px)" }} // Ensures internal scrolling
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "AI" ? "items-start" : "items-end justify-end"} space-x-3`}>
            {msg.sender === "AI" && <Bot className="w-8 h-8 text-gray-500" />}
            <div className={`p-3 rounded-lg max-w-[75%] ${msg.sender === "AI" ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-500 text-white"}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.sender === "User" && <UserCircle className="w-8 h-8 text-gray-500" />}
          </div>
        ))}

        {/* AI Thinking Indicator */}
        {isThinking && (
          <div className="flex items-start space-x-3">
            <Bot className="w-8 h-8 text-gray-500" />
            <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
              <p className="text-sm italic text-gray-500">AI is thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input (Fixed at Bottom) */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center space-x-4 bg-gray-100 dark:bg-gray-800">
        <input
          ref={inputRef}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-2 rounded-lg bg-transparent outline-none text-gray-900 dark:text-white"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center hover:bg-blue-600"
        >
          <Send className="w-5 h-5" />
        </button>
        <button
          className="bg-gray-300 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-center hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <UploadCloud className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
};
