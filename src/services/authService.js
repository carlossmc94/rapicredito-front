import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

const AUTH_API = `${API_BASE_URL}/rapicredito/auth`;

export const login = async (nombreUsuario, contrasena) => {
  const res = await axios.post(`${AUTH_API}/login`, { nombreUsuario, contrasena });
  return res.data;
};

export const cambiarContrasena = async (usuarioId, contrasenaActual, nuevaContrasena) => {
  const res = await axios.post(`${AUTH_API}/cambiar-contrasena`, {
    usuarioId,
    contrasenaActual,
    nuevaContrasena,
  });
  return res.data;
};
