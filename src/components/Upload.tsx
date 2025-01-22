import React, { useState } from "react";
import { uploadPDF } from "../api";

const Upload: React.FC = () => {
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
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert("Upload failed.");
        }
    };

    return (
        <div>
            <h2>Upload PDFs</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default Upload;
