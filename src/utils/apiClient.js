import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL); // check the value in console

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});