import axios from "axios";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

export const API = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export const visitAPI = axios.create({
  baseURL: `${apiBaseUrl}/api/visits`,
});

export const patientAPI = axios.create({
  baseURL: `${apiBaseUrl}/api/patients`,
});

export const appointmentAPI = axios.create({
  baseURL: `${apiBaseUrl}/api/appointments`,
});

export const paymentAPI = axios.create({
  baseURL: `${apiBaseUrl}/api/payments`,
});

export const reportAPI = axios.create({
  baseURL: `${apiBaseUrl}/api/reports`,
});