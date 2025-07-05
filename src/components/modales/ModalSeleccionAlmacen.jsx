import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiLock, FiLogIn, FiHome } from "react-icons/fi";
import BotonPrincipal from "../BotonPrincipal";
import { API_BASE_URL } from "../../config/apiConfig";

export default function ModalSeleccionAlmacen({ isOpen, onClose, token, onSuccess }) {
  const [almacenes, setAlmacenes] = useState([]);
  const [almacenId, setAlmacenId] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${API_BASE_URL}/rapicredito/almacenes/todos`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAlmacenes(res.data?.data || []))
        .catch(() => setError("Error al cargar almacenes"));
    }
  }, [isOpen, token]);

  const handleValidar = async (e) => {
    e.preventDefault();
    setError("");

    if (!almacenId || !clave) {
      setError("Selecciona un almacén e ingresa la clave");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/rapicredito/almacenes/validar-clave`,
        { almacenId: parseInt(almacenId), clave },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.codigo === 200 && res.data.data === true) {
        sessionStorage.setItem("almacenId", almacenId);
        onSuccess(); // redirección o cierre del modal
      } else {
        setError("Clave incorrecta para este almacén");
      }
    } catch (err) {
      setError("Error de validación con el servidor");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-[0_12px_30px_rgba(0,0,0,0.3)] ring-1 ring-gray-300">
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4 flex items-center justify-center gap-2">
          <FiHome /> Inicio de sesión en tienda
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm font-medium shadow">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleValidar} className="space-y-4">
          <select
            value={almacenId}
            onChange={(e) => setAlmacenId(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
            required
          >
            <option value="">Selecciona un almacén</option>
            {almacenes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre} - {a.ubicacion}
              </option>
            ))}
          </select>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Clave de acceso"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD600] text-sm"
              required
            />
          </div>

          <div className="w-full">
            <BotonPrincipal type="submit">
              <FiLogIn /> Entrar a tienda
            </BotonPrincipal>
          </div>
        </form>
      </div>
    </div>
  );
}
