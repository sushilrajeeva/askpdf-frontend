import React, { useState } from "react";
import { uploadPDF } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";

interface UploadProps {
  onUpload: (doc: { id: number; name: string; url: string }) => void;
}

export const Upload: React.FC<UploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first.");
    try {
      const response = await uploadPDF(file);
      onUpload({ id: Math.random(), name: file.name, url: response.data.url });
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Input type="file" accept="application/pdf" onChange={handleFileChange} className="flex-1" />
      <Button onClick={handleUpload} variant="outline">
        <FileUp className="w-5 h-5" />
        <span className="ml-2">Upload</span>
      </Button>
    </div>
  );
};
