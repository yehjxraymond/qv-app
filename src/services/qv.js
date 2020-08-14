import axios from "axios";
import { API_BASE_URL } from "../config";

export const createElection = async (election, userId) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/election`, election, {
      headers: { Authorization: userId },
    });
    return res.data;
  } catch (e) {
    if (e.response) {
      throw new Error(e.response.data.error);
    }
  }
};

export const getElection = async (electionId, userId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/election/${electionId}`, {
      headers: { Authorization: userId },
    });
    return res.data;
  } catch (e) {
    if (e.response) {
      throw new Error(e.response.data.error);
    }
  }
};

export const submitVotes = async (vote, userId) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/vote`, vote, {
      headers: { Authorization: userId },
    });
    return res.data;
  } catch (e) {
    if (e.response) {
      throw new Error(e.response.data.error);
    }
  }
};
