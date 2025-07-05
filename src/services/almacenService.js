import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

export async function obtenerAlmacenes(token) {
  const response = await axios.get(`${API_BASE_URL}/almacenes/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function validarClaveAlmacen(almacenId, clave, token) {
  const response = await axios.post(
    `${API_BASE_URL}/almacenes/validar-clave`,
    { almacenId, clave },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
