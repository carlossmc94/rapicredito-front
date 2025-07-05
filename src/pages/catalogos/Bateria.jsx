import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import TablaGenerica from "../../components/ui/TablaGenerica";
import ModalBase from "../../components/ui/ModalBase";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Bateria() {
  
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [mensajeExito, setMensajeExito] = useState("");

  const [datos, setDatos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [bateriaActual, setBateriaActual] = useState(null);
  const [especificaciones, setEspecificaciones] = useState("");

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    } else {
      cargarRegistros();
    }
  }, [auth]);

  const cargarRegistros = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rapicredito/baterias`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log("📦 Baterías obtenidas:", response.data.data);
      setDatos(response.data.data);
    } catch (error) {
      console.error("Error al cargar baterías:", error);
    }
  };

  const columnas = [
    { campo: "id", titulo: "ID" },
    { campo: "especificaciones", titulo: "Especificaciones" },
  ];

  const acciones = {
    editar: (fila) => {
      setModoEdicion(true);
      setBateriaActual(fila);
      setEspecificaciones(fila.especificaciones);
      setMostrarModal(true);
    },
    eliminar: async (fila) => {
      if (confirm(`¿Deseas eliminar la batería con ID ${fila.id}?`)) {
        try {
          await axios.delete(
            `${API_BASE_URL}/rapicredito/baterias/eliminar/${fila.id}`,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
          setMensajeExito("Batería eliminada correctamente");
          cargarRegistros();
          setTimeout(() => setMensajeExito(""), 3000);
        } catch (error) {
          alert("Error al eliminar batería.");
        }
      }
    },
  };

  const filtroFuncion = (fila, texto) =>
    fila.especificaciones?.toLowerCase().includes(texto.toLowerCase());

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setBateriaActual(null);
    setEspecificaciones("");
    setMostrarModal(true);
  };

  const guardarBateria = async () => {
    try {
      const payload = { especificaciones };
      if (modoEdicion && bateriaActual) {
        await axios.put(
          `${API_BASE_URL}/rapicredito/baterias/actualizar/${bateriaActual.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setMensajeExito("Batería actualizada correctamente");
      } else {
        await axios.post(
          `${API_BASE_URL}/rapicredito/baterias/crear`,
          payload,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setMensajeExito("Batería creada correctamente");
      }
      setMostrarModal(false);
      cargarRegistros();

      setTimeout(() => setMensajeExito(""), 3000); // 🔄 limpiar mensaje
    } catch (error) {
      alert("Error al guardar batería.");
    }
  };

  return (
    <>
      <Navbar />
      {mensajeExito && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-md shadow-lg animate-fade-in">
          {mensajeExito}
        </div>
      )}

      <main className="p-6">
        <div className="mb-6">
          {/* Botón de regreso */}
          <button
            onClick={() => navigate("/catalogos")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#002F6C] hover:underline"
          >
            ← Panel de catálogos
          </button>

          {/* Título y botón crear */}
          <div className="mt-2 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#002F6C]">
              Catálogo: Baterías
            </h1>
            <div className="w-auto">
              <BotonPrincipal onClick={abrirModalCrear}>
                Crear batería
              </BotonPrincipal>
            </div>
          </div>
        </div>

        <TablaGenerica
          columnas={columnas}
          datos={datos}
          acciones={acciones}
          filtroFuncion={filtroFuncion}
        />

        <ModalBase
          mostrar={mostrarModal}
          titulo={modoEdicion ? "Editar batería" : "Crear batería"}
          onCerrar={() => setMostrarModal(false)}
          onConfirmar={guardarBateria}
        >
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">
              Especificaciones:
            </label>
            <input
              type="text"
              value={especificaciones}
              onChange={(e) => setEspecificaciones(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </ModalBase>
      </main>
    </>
  );
}
