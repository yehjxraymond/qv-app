import { API_BASE_URL } from "../config";
import axios from "axios";

export const createElection = async election => {
  const res = await axios.post(`${API_BASE_URL}/election`, election);
  return res.data;
};

export const getElection = async electionId => {
  const res = await axios.get(`${API_BASE_URL}/election/${electionId}`);
  return res.data;
};

export const submitVotes = async vote => {
  const res = await axios.post(`${API_BASE_URL}/vote`, vote);
  return res.data;
};
