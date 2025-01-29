import React, { useState } from "react";
import { uploadPDF } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface UploadProps {
  onUpload: (doc: { id: number; name: string; url: string }) => void;
}

export const Upload: React.FC<UploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first.");
    setIsLoading(true); // Show loader

    try {

      // 1. Check if we already have a chatId from a previous session
      const storedChatId = localStorage.getItem("chatId") || undefined;
      
      // 2. Upload the PDF, passing storedChatId if it exists
      const response = await uploadPDF(file, storedChatId);

      /*
        The backend returns a JSON like:
        {
          "message": "File processed successfully",
          "num_chunks": 9,
          "chat_id": "efe245e9-61b8-4f65-b960-c56e118fcdd5"
        }
      */

      const { chat_id } = response.data;
      if (chat_id) {
        // 3. Store or overwrite the localStorage chatId so we can reuse it
        localStorage.setItem("chatId", chat_id);
      }

      // 4. Construct the doc object for the UI (the backend might not return `url`, so we handle that)
      const newDoc = { 
        id: Math.random(),
        name: file.name,
        // For now, the backend doesn't return a direct URL to the PDF,
        // so we can just store an empty string or a local objectURL
        url: response.data.url || URL.createObjectURL(file),
      };

      // 5. (Optional) Store the document reference in localStorage
      const storedDocs = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]");
      storedDocs.push(newDoc);
      localStorage.setItem("uploadedDocuments", JSON.stringify(storedDocs));

      // Simulate processing delay
      setTimeout(() => {
        setIsLoading(false); // Hide loader when processing completes
        onUpload(newDoc);
      }, 2000); // Extra time to simulate processing
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("Upload failed.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {/* Show loading state */}
      {isLoading ? (
        <Card className="w-full max-w-sm p-6 flex flex-col items-center justify-center text-center bg-gray-100 dark:bg-gray-900 shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Uploading & Processing...</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Skeleton className="w-20 h-20 rounded-full animate-spin">
              <Loader className="w-full h-full text-gray-500 dark:text-gray-400" />
            </Skeleton>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your file is being uploaded and processed. Please wait...
            </p>
          </CardContent>
        </Card>
      ) : (
        // Upload form
        <div className="flex items-center space-x-4">
          <Input type="file" accept="application/pdf" onChange={handleFileChange} className="flex-1" />
          <Button onClick={handleUpload} variant="outline">
            <FileUp className="w-5 h-5" />
            <span className="ml-2">Upload</span>
          </Button>
        </div>
      )}
    </div>
  );
};
