import axios from "axios";

// Dynamically set API_URL based on environment
const API_URL = import.meta.env.VITE_API_URL?.trim() || "/api";

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
