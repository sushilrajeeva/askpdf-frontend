import React, { useEffect, useState } from "react";
import { askQuestion } from "../api"; // Import API call function
import { Card } from "@/components/ui/card";
import { UserCircle, Bot, Send, UploadCloud } from "lucide-react";

interface ChatProps {
  documents: { id: number; name: string; url: string }[];
  onUpload: (doc: { id: number; name: string; url: string }) => void;
}

export const Chat: React.FC<ChatProps> = ({ documents, onUpload }) => {
  const [messages, setMessages] = useState<{ sender: "User" | "AI"; text: string }[]>([]);
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Auto-scroll to the latest message
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Handle sending a question
  const handleSend = async () => {
    if (!question.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { sender: "User", text: question }]);
    setIsThinking(true);

    try {
      // Call the backend API
      const res = await askQuestion(question);
      const aiResponse = res.data.response;

      // Add AI's response
      setMessages((prev) => [...prev, { sender: "AI", text: aiResponse }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { sender: "AI", text: "⚠️ Error fetching response from AI." }]);
    } finally {
      setIsThinking(false);
    }

    setQuestion(""); // Clear input after sending
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
    <Card className="p-6 shadow-lg w-full h-full flex flex-col">
      {/* Chat Messages (Scrollable) */}
      <div id="chat-container" className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-center space-x-3 ${msg.sender === "AI" ? "" : "justify-end"}`}>
            {msg.sender === "AI" && <Bot className="w-8 h-8 text-gray-500" />}
            <div className={`p-4 rounded-lg ${msg.sender === "AI" ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-500 text-white"}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.sender === "User" && <UserCircle className="w-8 h-8 text-gray-500" />}
          </div>
        ))}
        
        {/* AI Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-gray-500" />
            <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
              <p className="text-sm italic text-gray-500">AI is thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-2 rounded-lg bg-transparent outline-none text-gray-900 dark:text-white"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center">
          <Send className="w-5 h-5" />
        </button>
        <button
          className="bg-gray-300 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-center"
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
