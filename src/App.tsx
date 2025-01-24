import React, { useState, useEffect } from "react";
import { Upload } from "./components/Upload";
import { Chat } from "./components/Chat";
import { UploadCloud, Moon, Sun, Monitor } from "lucide-react";

const App: React.FC = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");

  // Handle theme switching
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("light", "dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Sidebar - Updated with a Chalky Grey Theme */}
      <aside className="w-1/3 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg flex flex-col items-center justify-center p-10 transition-colors duration-300">
        <h1 className="text-4xl font-bold mb-4">📄 AskPDF AI</h1>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          Hey, welcome to <span className="font-semibold text-gray-900 dark:text-white">AskPDF AI</span> developed by <span className="text-blue-500">Sushil</span>.
        </p>
        <p className="text-center text-md text-gray-600 dark:text-gray-400 mt-4">
          This app leverages <span className="font-semibold">LangChain, OpenAI LLM,</span>  
          and <span className="font-semibold">HuggingFace</span>  
          to process documents, store data in <span className="text-blue-500">Pinecone VectorDB</span>,  
          and retrieve answers using <span className="font-semibold">RAG</span>.
        </p>
      </aside>

      {/* Right Content - Theme Toggle & Upload/Chat */}
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        {/* Theme Toggle Button (Top Right) */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-3 bg-gray-300 dark:bg-gray-700 p-2 rounded-lg shadow-md">
            <button onClick={() => setTheme("light")} className={`p-2 rounded ${theme === "light" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}>
              <Sun className="w-5 h-5" />
            </button>
            <button onClick={() => setTheme("dark")} className={`p-2 rounded ${theme === "dark" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}>
              <Moon className="w-5 h-5" />
            </button>
            <button onClick={() => setTheme("system")} className={`p-2 rounded ${theme === "system" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}>
              <Monitor className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!fileUploaded ? (
          <div className="flex flex-col items-center space-y-4">
            <UploadCloud className="w-24 h-24 text-gray-500 animate-pulse" />
            <Upload onUpload={() => setFileUploaded(true)} />
          </div>
        ) : (
          <Chat />
        )}
      </main>
    </div>
  );
};

export default App;
