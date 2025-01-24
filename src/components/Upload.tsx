import React, { useState } from "react";
import { uploadPDF } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FileUp } from "lucide-react";

export const Upload: React.FC<{ onUpload: () => void }> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first.");
    try {
      await uploadPDF(file);
      onUpload(); // Call function to switch to Chat UI
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  return (
    <Card className="p-6 shadow-lg flex flex-col items-center">
      <h2 className="text-xl font-bold text-primary mb-4">📤 Upload PDF</h2>
      <div className="flex items-center gap-4 w-full">
        <Input type="file" accept="application/pdf" onChange={handleFileChange} className="flex-1" />
        <Button onClick={handleUpload} variant="outline">
          <FileUp className="w-5 h-5" />
          <span className="ml-2">Upload</span>
        </Button>
      </div>
    </Card>
  );
};