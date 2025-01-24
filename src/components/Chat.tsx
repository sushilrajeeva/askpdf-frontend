import React, { useState } from "react";
import { askQuestion } from "../api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "ai";
}

export const Chat: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleAsk = async () => {
    if (!question) return;
    setMessages((prev) => [...prev, { text: question, sender: "user" }]);
    setQuestion("");

    try {
      const res = await askQuestion(question);
      setMessages((prev) => [...prev, { text: res.data.response, sender: "ai" }]);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch response.");
    }
  };

  return (
    <Card className="p-6 shadow-lg w-full max-w-2xl flex flex-col">
      <h2 className="text-xl font-bold text-primary mb-4">💬 Chat with PDF</h2>
      
      <div className="flex-1 overflow-y-auto max-h-80 space-y-4 p-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg p-3 ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="resize-none flex-1"
        />
        <Button onClick={handleAsk}>
          <Send className="w-5 h-5" />
          <span className="ml-2">Ask</span>
        </Button>
      </div>
    </Card>
  );
};
