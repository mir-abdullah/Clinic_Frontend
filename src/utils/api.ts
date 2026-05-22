import axios from "axios";

export const API    = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
  
})

export const visitAPI = axios.create({
    baseURL: "http://localhost:5000/api/visits",
    withCredentials: true,
  
})

export const patientAPI = axios.create({
    baseURL: "http://localhost:5000/api/patients",
    withCredentials: true,
  
})

export const appointmentAPI = axios.create({
    baseURL: "http://localhost:5000/api/appointment",
    withCredentials: true,
  
})