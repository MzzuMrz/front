import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000/api" });

// Aquí podemos añadir un interceptor para incluir el token en todas las peticiones
API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

export default API;
