import axios from "axios";

// No need to import VITE_API_URL, just use relative path
const API_URL = "http://localhost:8000/api";

export const uploadPDF = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await axios.post(`${API_URL}/pdf/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const askQuestion = async (question: string) => {
    return await axios.post(`${API_URL}/chat/ask/`, { question });
};
