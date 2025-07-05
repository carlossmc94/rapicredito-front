import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import TablaGenerica from "../../components/ui/TablaGenerica";
import ModalBase from "../../components/ui/ModalBase";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SistemaOperativo() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [mensajeExito, setMensajeExito] = useState("");
  const [datos, setDatos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroActual, setRegistroActual] = useState(null);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    } else {
      cargarRegistros();
    }
  }, [auth]);

  const cargarRegistros = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rapicredito/sistema-operativo/todos`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setDatos(response.data.data);
    } catch (error) {
      console.error("Error al cargar sistemas operativos:", error);
    }
  };

  const columnas = [
    { campo: "id", titulo: "ID" },
    { campo: "nombre", titulo: "Nombre" },
  ];

  const acciones = {
    editar: (fila) => {
      setModoEdicion(true);
      setRegistroActual(fila);
      setNombre(fila.nombre);
      setMostrarModal(true);
    },
    eliminar: async (fila) => {
      if (confirm(`¿Deseas eliminar el sistema operativo con ID ${fila.id}?`)) {
        try {
          await axios.delete(`${API_BASE_URL}/rapicredito/sistema-operativo/eliminar/${fila.id}`, {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          setMensajeExito("Sistema operativo eliminado correctamente");
          cargarRegistros();
          setTimeout(() => setMensajeExito(""), 3000);
        } catch (error) {
          alert("Error al eliminar sistema operativo.");
        }
      }
    },
  };

  const filtroFuncion = (fila, texto) =>
    fila.nombre?.toLowerCase().includes(texto.toLowerCase());

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setRegistroActual(null);
    setNombre("");
    setMostrarModal(true);
  };

  const guardarRegistro = async () => {
    try {
      const payload = { nombre };
      if (modoEdicion && registroActual) {
        await axios.put(
          `${API_BASE_URL}/rapicredito/sistema-operativo/actualizar/${registroActual.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setMensajeExito("Sistema operativo actualizado correctamente");
      } else {
        await axios.post(`${API_BASE_URL}/rapicredito/sistema-operativo/crear`, payload, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setMensajeExito("Sistema operativo creado correctamente");
      }
      setMostrarModal(false);
      cargarRegistros();
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      alert("Error al guardar sistema operativo.");
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
          <button
            onClick={() => navigate("/catalogos")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#002F6C] hover:underline"
          >
            ← Panel de catálogos
          </button>

          <div className="mt-2 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#002F6C]">
              Catálogo: Sistemas Operativos
            </h1>
            <div className="w-auto">
              <BotonPrincipal onClick={abrirModalCrear}>
                Crear sistema operativo
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
          titulo={modoEdicion ? "Editar sistema operativo" : "Crear sistema operativo"}
          onCerrar={() => setMostrarModal(false)}
          onConfirmar={guardarRegistro}
        >
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </ModalBase>
      </main>
    </>
  );
}
