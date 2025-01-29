import axios from "axios";

// No need to import VITE_API_URL, just use relative path
const API_URL = "http://localhost:8000/api"; // use this while testing locally
//const API_URL = "api"; // use this while deploying to production or while in docker

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
