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
      const response = await uploadPDF(file);
      const newDoc = { id: Math.random(), name: file.name, url: response.data.url };

      // Store in cache
      const storedDocs = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]");
      storedDocs.push(newDoc);
      localStorage.setItem("uploadedDocuments", JSON.stringify(storedDocs));

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
