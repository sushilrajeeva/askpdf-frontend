import React, { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { FileText } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// Ensure PDFs are loaded correctly
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFDocument {
  id: number;
  name: string;
  url: string;
  base64?: string; // Optional base64 field
}

interface PDFPreviewProps {
  id: number;
  name: string;
  url: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ id, name, url }) => {
  const [pdfData, setPdfData] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage with explicit typing
    const storedDocs: PDFDocument[] = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]");
    const foundDoc = storedDocs.find((doc) => doc.url === url);

    if (foundDoc?.base64) {
      setPdfData(foundDoc.base64);
    } else {
      // Fetch the PDF as Blob and convert it to base64
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setPdfData(base64data);

            // Save back to localStorage with base64
            const updatedDocs: PDFDocument[] = storedDocs.map((doc) =>
              doc.url === url ? { ...doc, base64: base64data } : doc
            );
            localStorage.setItem("uploadedDocuments", JSON.stringify(updatedDocs));
          };
          reader.readAsDataURL(blob);
        })
        .catch((err) => console.error("Error loading PDF:", err));
    }
  }, [url]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative flex flex-col items-center cursor-pointer">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-800 dark:text-gray-200" />
          </div>
          <span className="text-sm mt-1 text-gray-600 dark:text-gray-300">Doc {id}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 h-96 p-2 bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{name}</p>
        {pdfData ? (
          <Document file={pdfData} className="w-full">
            <Page pageNumber={1} width={350} />
          </Document>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Loading PDF...</p>
        )}
      </PopoverContent>
    </Popover>
  );
};
