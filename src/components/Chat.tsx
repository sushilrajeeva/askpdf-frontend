import React, { useState } from "react";
import { askQuestion } from "../api";

const Chat: React.FC = () => {
    const [question, setQuestion] = useState<string>("");
    const [response, setResponse] = useState<string>("");

    const handleAsk = async () => {
        if (!question) return;
        try {
            const res = await askQuestion(question);
            setResponse(res.data.response);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch response.");
        }
    };

    return (
        <div>
            <h2>Chat with PDF</h2>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
            />
            <button onClick={handleAsk}>Ask</button>
            {response && <p><strong>AI:</strong> {response}</p>}
        </div>
    );
};

export default Chat;
