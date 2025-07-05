import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import TablaGenerica from "../../components/ui/TablaGenerica";
import ModalBase from "../../components/ui/ModalBase";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Proveedor() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [mensajeExito, setMensajeExito] = useState("");
  const [datos, setDatos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroActual, setRegistroActual] = useState(null);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [terminoPago, setTerminoPago] = useState("");
  const [historial, setHistorial] = useState("");

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    } else {
      cargarRegistros();
    }
  }, [auth]);

  const cargarRegistros = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rapicredito/proveedores/todos`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setDatos(response.data.data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };

  const columnas = [
    { campo: "id", titulo: "ID" },
    { campo: "nombre", titulo: "Nombre" },
    { campo: "contacto", titulo: "Contacto" },
    { campo: "terminoPago", titulo: "Término de Pago" },
    { campo: "historial", titulo: "Historial" },
  ];

  const acciones = {
    editar: (fila) => {
      setModoEdicion(true);
      setRegistroActual(fila);
      setNombre(fila.nombre);
      setContacto(fila.contacto);
      setTerminoPago(fila.terminoPago);
      setHistorial(fila.historial);
      setMostrarModal(true);
    },
    eliminar: async (fila) => {
      if (confirm(`¿Deseas eliminar el proveedor con ID ${fila.id}?`)) {
        try {
          await axios.delete(
            `${API_BASE_URL}/rapicredito/proveedores/eliminar/${fila.id}`,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
          setMensajeExito("Proveedor eliminado correctamente");
          cargarRegistros();
          setTimeout(() => setMensajeExito(""), 3000);
        } catch (error) {
          alert("Error al eliminar proveedor.");
        }
      }
    },
  };

  const filtroFuncion = (fila, texto) => {
    const t = texto.toLowerCase();
    return (
      fila.nombre?.toLowerCase().includes(t) ||
      fila.contacto?.toLowerCase().includes(t) ||
      fila.terminoPago?.toLowerCase().includes(t) ||
      fila.historial?.toLowerCase().includes(t)
    );
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setRegistroActual(null);
    setNombre("");
    setContacto("");
    setTerminoPago("");
    setHistorial("");
    setMostrarModal(true);
  };

  const guardarRegistro = async () => {
    try {
      const payload = { nombre, contacto, terminoPago, historial };
      if (modoEdicion && registroActual) {
        await axios.put(
          `${API_BASE_URL}/rapicredito/proveedores/actualizar/${registroActual.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setMensajeExito("Proveedor actualizado correctamente");
      } else {
        await axios.post(`${API_BASE_URL}/rapicredito/proveedores/crear`, payload, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setMensajeExito("Proveedor creado correctamente");
      }
      setMostrarModal(false);
      cargarRegistros();
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      alert("Error al guardar proveedor.");
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
              Catálogo: Proveedores
            </h1>
            <div className="w-auto">
              <BotonPrincipal onClick={abrirModalCrear}>
                Crear proveedor
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
          titulo={modoEdicion ? "Editar proveedor" : "Crear proveedor"}
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

            <label className="text-sm font-medium text-gray-700">Contacto:</label>
            <input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <label className="text-sm font-medium text-gray-700">Término de Pago:</label>
            <input
              type="text"
              value={terminoPago}
              onChange={(e) => setTerminoPago(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <label className="text-sm font-medium text-gray-700">Historial:</label>
            <textarea
              value={historial}
              onChange={(e) => setHistorial(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 resize-none"
            />
          </div>
        </ModalBase>
      </main>
    </>
  );
}
