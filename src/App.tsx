import React, { useState, useEffect } from "react";
import { Upload } from "./components/Upload";
import { Chat } from "./components/Chat";
import { UploadCloud, Moon, Sun, FileText, Loader2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const App: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [documents, setDocuments] = useState<{ id: number; name: string; url: string }[]>([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state

  useEffect(() => {
    // This effect will run exactly once on component mount
    // Removing the chat_id forces a new session on every page refresh
    localStorage.removeItem("chatId");
  }, []);

  // Handle theme switching
  const toggleTheme = (mode: string) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);
    document.documentElement.classList.remove("light", "dark");
    if (mode !== "system") document.documentElement.classList.add(mode);
  };

  const handleUpload = (newDoc: { id: number; name: string; url: string }) => {
    setIsProcessing(true); // Start processing loader

    setTimeout(() => {
      setDocuments((prev) => [...prev, newDoc]);
      setFileUploaded(true);
      setIsProcessing(false); // Stop processing loader
    }, 2000); // Simulating API response delay
  };

  return (
    <div className="flex w-screen h-screen bg-background text-foreground">
      {/* Left Sidebar (30%) */}
      <aside className="w-[30%] h-full bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg flex flex-col justify-center items-center p-10 transition-colors duration-300">
  {/* Centered Content */}
  <div className="flex flex-col items-center text-center space-y-6">
    {/* Title */}
    <h1 className="text-4xl font-bold">📄 AskPDF AI</h1>

    {/* Description */}
    <p className="text-lg text-gray-700 dark:text-gray-300">
      Welcome to <span className="font-semibold text-gray-900 dark:text-white">AskPDF AI</span> developed by 
      <span className="text-blue-500 flex items-center gap-2 justify-center mt-2">
        Sushil Bhandary
        {/* LinkedIn Icon */}
        <a href="https://linkedin.com/in/sushilrajeeva" target="_blank" rel="noopener noreferrer">
          <svg className="w-5 h-5 text-[#0077b5] hover:opacity-80 transition-opacity" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
            <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/>
          </svg>
        </a>
        {/* GitHub Icon */}
        <a href="https://github.com/sushilrajeeva" target="_blank" rel="noopener noreferrer">
          <svg className="w-5 h-5 text-[#333] hover:opacity-80 transition-opacity" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 496 512">
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/>
          </svg>
        </a>
      </span>
    </p>

    {/* App Details */}
    <p className="text-lg text-gray-700 dark:text-gray-300">
      This app leverages <strong>LangChain, OpenAI LLM, </strong> and <strong>HuggingFace</strong> to process documents, store data in <strong>Pinecone VectorDB</strong>, and retrieve insights and answers using <strong>RAG</strong>.
    </p>

    {/* Theme Selection Section */}
    <div className="w-full flex flex-col items-center gap-4 mt-8">
      <div className="w-[80%] bg-gray-300 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-center gap-4">
        <button
          onClick={() => toggleTheme("light")}
          className={`p-3 rounded-lg flex items-center justify-center ${
            theme === "light" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <Sun className="w-6 h-6" />
        </button>
        <button
          onClick={() => toggleTheme("dark")}
          className={`p-3 rounded-lg flex items-center justify-center ${
            theme === "dark" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <Moon className="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</aside>

      {/* Right Side (70%) */}
      <main className="w-[70%] h-full flex flex-col">
        {/* Section 1: PDF Previews (15% Height) */}
        <div className="h-[15%] flex items-center space-x-4 px-6 overflow-x-auto scrollbar-hide">
          {documents.map((doc, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <div className="relative flex flex-col items-center cursor-pointer">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                  </div>
                  <span className="text-sm mt-1 text-gray-600 dark:text-gray-300">Doc {index + 1}</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-96 h-96 p-2 bg-white dark:bg-gray-800 shadow-lg">
                <iframe
                  src={doc.url}
                  className="w-full h-full rounded-lg"
                  title={`Preview of ${doc.name}`}
                ></iframe>
              </PopoverContent>
            </Popover>
          ))}
        </div>

        {/* Section 2: Chat Window (85% Height) with UploadCloud loader */}
        <div className="h-[85%] flex flex-col overflow-hidden">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 text-gray-500 animate-spin mt-4" />
              <p className="text-gray-500 mt-2">Uploading and processing your document...</p>
            </div>
          ) : fileUploaded ? (
            <Chat documents={documents} onUpload={handleUpload} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <UploadCloud className="w-24 h-24 text-gray-500 animate-pulse" />
              <Upload onUpload={handleUpload} />
            </div>          )}
        </div>
      </main>
    </div>
  );
};

export default App;
