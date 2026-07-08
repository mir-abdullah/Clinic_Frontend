import axios from "axios";

export const API    = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
  
})

export const visitAPI = axios.create({
    baseURL: "http://localhost:5000/api/visits",
  
})

export const patientAPI = axios.create({
    baseURL: "http://localhost:5000/api/patients",
  
})

export const appointmentAPI = axios.create({
    baseURL: "http://localhost:5000/api/appointments",
  
})

export const paymentAPI =axios.create({
    baseURL: "http://localhost:5000/api/payments",
  
})

export const reportAPI =axios.create({
    baseURL: "http://localhost:5000/api/reports",
  
})