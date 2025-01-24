import React, { useState } from "react";
import { Upload } from "./components/Upload";
import { Chat } from "./components/Chat";
import { UploadCloud, Moon, Sun, FileText } from "lucide-react";

const App: React.FC = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [documents, setDocuments] = useState<{ id: number; name: string; url: string }[]>([]);

  // Handle theme switching
  const toggleTheme = (mode: string) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);
    document.documentElement.classList.remove("light", "dark");
    if (mode !== "system") document.documentElement.classList.add(mode);
  };

  const handleUpload = (newDoc: { id: number; name: string; url: string }) => {
    setDocuments((prev) => [...prev, newDoc]);
    setFileUploaded(true);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg flex flex-col items-center justify-center p-10 transition-colors duration-300">
        <h1 className="text-4xl font-bold mb-4">📄 AskPDF AI</h1>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          Welcome to <span className="font-semibold text-gray-900 dark:text-white">AskPDF AI</span> developed by <span className="text-blue-500">Sushil</span>.
        </p>
        <p className="text-center text-md text-gray-600 dark:text-gray-400 mt-4">
          Upload PDFs, extract insights, and ask questions using <strong>LangChain, OpenAI LLM, HuggingFace,</strong> and <strong>Pinecone VectorDB.</strong>
        </p>
      </aside>

      {/* Right Side - 3 Sections */}
      <main className="flex-1 flex flex-col relative">
        
        {/* Section 1: Theme Toggle (Floating Top Right) */}
        <div className="absolute top-4 right-4 flex items-center gap-3 bg-gray-300 dark:bg-gray-700 p-2 rounded-lg shadow-md">
          <button onClick={() => toggleTheme("light")} className={`p-2 rounded ${theme === "light" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}>
            <Sun className="w-5 h-5" />
          </button>
          <button onClick={() => toggleTheme("dark")} className={`p-2 rounded ${theme === "dark" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}>
            <Moon className="w-5 h-5" />
          </button>
        </div>

        {/* Section 2: PDF Previews (15% Height) */}
        {fileUploaded && (
          <div className="h-[15%] flex items-center justify-center space-x-4 px-6 overflow-x-auto scrollbar-hide">
            {documents.map((doc) => (
              <div key={doc.id} className="relative flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                </div>
                <span className="text-sm mt-1 text-gray-600 dark:text-gray-300">Doc {doc.id}</span>
              </div>
            ))}
          </div>
        )}

        {/* Section 3: Chat Window (85% Height) */}
        <div className="h-[85%] flex flex-col justify-end">
          {fileUploaded ? (
            <Chat documents={documents} onUpload={handleUpload} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <UploadCloud className="w-24 h-24 text-gray-500 animate-pulse" />
              <Upload onUpload={handleUpload} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
