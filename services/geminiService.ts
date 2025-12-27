import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Chat with Saska (JWT Protected)
 */
export const chatWithSaska = async (history, message) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const res = await axios.post(
    `${API_BASE}/api/ai/chat`,
    { history, message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000,
    }
  );

  return res.data.answer;
};
