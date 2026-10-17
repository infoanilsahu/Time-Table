import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_URL;

if (!baseURL) {
    throw new Error("Base URL not found");
}

export const api = axios.create({
    baseURL,
    withCredentials: true
});