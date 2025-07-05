import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import TablaGenerica from "../../components/ui/TablaGenerica";
import ModalBase from "../../components/ui/ModalBase";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StockInventario() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const almacenId = sessionStorage.getItem("almacenId");

  const [datos, setDatos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modo, setModo] = useState("entrada"); // entrada o salida
  const [productoVariacionId, setProductoVariacionId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    } else {
      cargarStock();
    }
  }, [auth]);

  const cargarStock = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/rapicredito/inventario/todos?almacenId=${almacenId}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setDatos(response.data.data);
    } catch (error) {
      alert("Error al cargar el stock del inventario.");
    }
  };

  const columnas = [
    { campo: "productoVariacionId", titulo: "Variación ID" },
    { campo: "cantidadDisponible", titulo: "Disponible" },
    { campo: "cantidadReservada", titulo: "Reservada" },
    { campo: "cantidadVendida", titulo: "Vendida" },
    { campo: "cantidadDevuelta", titulo: "Devuelta" },
    { campo: "cantidadEntrada", titulo: "Entradas" },
    { campo: "cantidadSalida", titulo: "Salidas" },
  ];

  const acciones = {
    entrada: (fila) => {
      setModo("entrada");
      setProductoVariacionId(fila.productoVariacionId);
      setCantidad("");
      setComentario("");
      setMostrarModal(true);
    },
    salida: (fila) => {
      setModo("salida");
      setProductoVariacionId(fila.productoVariacionId);
      setCantidad("");
      setComentario("");
      setMostrarModal(true);
    },
  };

  const filtroFuncion = (fila, texto) =>
    Object.values(fila).some((val) =>
      String(val).toLowerCase().includes(texto.toLowerCase())
    );

  const registrarMovimiento = async () => {
    try {
      const payload = {
        productoVariacionId: parseInt(productoVariacionId),
        almacenId: parseInt(almacenId),
        cantidad: parseInt(cantidad),
        usuarioId: auth.usuarioId,
        comentario,
      };

      if (modo === "entrada") {
        payload.cantidadDisponible = payload.cantidad;
        await axios.post(`${API_BASE_URL}/rapicredito/inventario/entrada`, payload, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setMensajeExito("Entrada registrada correctamente");
      } else {
        payload.cantidadSalida = payload.cantidad;
        await axios.post(`${API_BASE_URL}/rapicredito/inventario/salida`, payload, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setMensajeExito("Salida registrada correctamente");
      }

      setMostrarModal(false);
      cargarStock();
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      alert("Error al registrar el movimiento de inventario.");
    }
  };

  return (
    <>
      <Navbar />
      {mensajeExito && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-md shadow-lg">
          {mensajeExito}
        </div>
      )}

      <main className="p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/inventario")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#002F6C] hover:underline"
          >
            ← Panel de inventario
          </button>

          <div className="mt-2 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#002F6C]">
              Inventario por Almacén
            </h1>
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
          titulo={
            modo === "entrada"
              ? "Registrar entrada de inventario"
              : "Registrar salida de inventario"
          }
          onCerrar={() => setMostrarModal(false)}
          onConfirmar={registrarMovimiento}
        >
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">
              Cantidad:
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <label className="text-sm font-medium text-gray-700">
              Comentario:
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              rows={3}
            ></textarea>
          </div>
        </ModalBase>
      </main>
    </>
  );
}
