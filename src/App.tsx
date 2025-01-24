import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "./components/Upload";
import { Chat } from "./components/Chat";
import { Moon, Sun } from "lucide-react";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-10">
      {/* Theme Toggle */}
      <div className="flex justify-end w-full max-w-3xl">
        <Button variant="outline" onClick={toggleTheme}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="ml-2">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </Button>
      </div>

      {/* Header */}
      <Card className="p-6 shadow-lg w-full max-w-3xl text-center mt-6">
        <h2 className="text-3xl font-semibold text-primary">📄 PDF Chat AI</h2>
        <p className="text-muted-foreground mt-2">
          AI-powered PDF assistant using <strong>LangChain, OpenAI, HuggingFace,</strong> 
          and <strong>Pinecone VectorDB</strong> to provide instant document insights.
        </p>
      </Card>

      {/* Upload & Chat Sections */}
      <div className="w-full max-w-3xl mt-10 space-y-8">
        <Upload />
        <Chat />
      </div>
    </div>
  );
};

export default App;
