import axios from "axios";

// Dynamically set API_URL based on environment
// const API_URL = import.meta.env.VITE_API_URL?.trim() || "/api";
const API_URL = "/api";

export const uploadPDF = async (file: File, chatId?: string) => {
    const formData = new FormData();
    formData.append("file", file);

    // If we already have a chat_id, include it
    if (chatId) {
        formData.append("chat_id", chatId);
    }

    return await axios.post(`${API_URL}/pdf/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const askQuestion = async (question: string, chatId?: string) => {
    return await axios.post(`${API_URL}/chat/ask/`, {
      chat_id: chatId, // if undefined, backend might complain, so ideally pass empty string or null if not available
      question,
    });
};
