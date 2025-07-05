import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import TablaGenerica from "../../components/ui/TablaGenerica";
import ModalBase from "../../components/ui/ModalBase";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalProductoVariacion from "../../components/modales/ModalProductoVariacion";

export default function VariacionProducto() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [datos, setDatos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [variacionActual, setVariacionActual] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  const [productoId, setProductoId] = useState("");
  const [colorId, setColorId] = useState("");
  const [ramId, setRamId] = useState("");
  const [capacidadId, setCapacidadId] = useState("");
  const [precio, setPrecio] = useState("");

  const [productos, setProductos] = useState([]);
  const [colores, setColores] = useState([]);
  const [rams, setRams] = useState([]);
  const [capacidades, setCapacidades] = useState([]);

  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [variacionSeleccionada, setVariacionSeleccionada] = useState(null);

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    } else {
      cargarRegistros();
      cargarCatalogos();
    }
  }, [auth]);

  const cargarRegistros = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/rapicredito/producto-variacion/todos`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setDatos(response.data.data);
    } catch (error) {
      console.error("Error al cargar variaciones:", error);
    }
  };

  const cargarCatalogos = async () => {
    try {
      const headers = { Authorization: `Bearer ${auth.token}` };

      const [prodRes, colRes, ramRes, capRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/rapicredito/productos/todos`, { headers }),
        axios.get(`${API_BASE_URL}/rapicredito/colores/todos`, { headers }),
        axios.get(`${API_BASE_URL}/rapicredito/ram/todos`, { headers }),
        axios.get(`${API_BASE_URL}/rapicredito/capacidad-almacenamiento`, {
          headers,
        }),
      ]);

      setProductos(prodRes.data.data);
      setColores(colRes.data.data);
      setRams(ramRes.data.data);
      setCapacidades(capRes.data.data);
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
    }
  };

  const columnas = [
    { campo: "id", titulo: "ID" },
    { campo: "producto.nombre", titulo: "Producto" },
    { campo: "color.nombre", titulo: "Color" },
    { campo: "ram.valor", titulo: "RAM" },
    { campo: "capacidadAlmacenamiento.nombre", titulo: "Capacidad" },
    { campo: "precio", titulo: "Precio" },
  ];

  const acciones = {
    ver: async (fila) => {
      try {
        const headers = { Authorization: `Bearer ${auth.token}` };
        const productoId = fila.producto?.id;

        const response = await axios.get(
          `${API_BASE_URL}/rapicredito/productos/obtener/${productoId}`,
          { headers }
        );

        const productoCompleto = response.data.data;

        // 🔁 Combinamos datos del producto con los de la variación
        const variacionConProducto = {
          ...fila,
          producto: productoCompleto,
        };

        setVariacionSeleccionada(variacionConProducto);
        setMostrarModalVer(true);
      } catch (error) {
        alert("No se pudo cargar la información del producto.");
      }
    },
    editar: (fila) => {
      setModoEdicion(true);
      setVariacionActual(fila);
      setProductoId(fila.producto.id);
      setColorId(fila.color.id);
      setRamId(fila.ram.id);
      setCapacidadId(fila.capacidadAlmacenamiento.id);
      setPrecio(fila.precio);
      setMostrarModal(true);
    },
    eliminar: null, // 🔒 Eliminar deshabilitado completamente
  };

  const filtroFuncion = (fila, texto) => {
    const t = texto.toLowerCase();
    return (
      fila.producto?.nombre?.toLowerCase().includes(t) ||
      fila.color?.nombre?.toLowerCase().includes(t) ||
      fila.ram?.valor?.toLowerCase().includes(t) ||
      fila.capacidadAlmacenamiento?.nombre?.toLowerCase().includes(t)
    );
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setVariacionActual(null);
    setProductoId("");
    setColorId("");
    setRamId("");
    setCapacidadId("");
    setPrecio("");
    setMostrarModal(true);
  };

  const guardarVariacion = async () => {
    try {
      const headers = { Authorization: `Bearer ${auth.token}` };

      if (modoEdicion && variacionActual) {
        // 🔁 Solo actualizar precio
        const payload = { precio: parseFloat(precio) };

        await axios.put(
          `${API_BASE_URL}/rapicredito/producto-variacion/actualizar/${variacionActual.id}`,
          payload,
          { headers }
        );

        setMensajeExito("Precio actualizado correctamente");
      } else {
        // 🆕 Crear variación completa
        const almacenId = parseInt(sessionStorage.getItem("almacenId"));

        const payload = {
          producto: { id: parseInt(productoId) },
          color: { id: parseInt(colorId) },
          ram: { id: parseInt(ramId) },
          capacidadAlmacenamiento: { id: parseInt(capacidadId) },
          precio: parseFloat(precio),
          almacenId: almacenId, // ✅ nuevo campo requerido por el backend
        };

        await axios.post(
          `${API_BASE_URL}/rapicredito/producto-variacion/crear`,
          payload,
          { headers }
        );

        setMensajeExito("Variación creada correctamente");
      }

      setMostrarModal(false);
      cargarRegistros();
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      alert("Error al guardar la variación.");
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
            onClick={() => navigate("/inventario")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#002F6C] hover:underline"
          >
            ← Panel de inventario
          </button>

          <div className="mt-2 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#002F6C]">
              Catálogo: Variaciones de producto
            </h1>
            <div className="w-auto">
              <BotonPrincipal onClick={abrirModalCrear}>
                Crear variación
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
          titulo={
            modoEdicion ? "Editar precio de variación" : "Crear variación"
          }
          onCerrar={() => setMostrarModal(false)}
          onConfirmar={guardarVariacion}
        >
          <div className="flex flex-col gap-4">
            <label>Producto:</label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              disabled={modoEdicion}
            >
              <option value="">-- Selecciona un producto --</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>

            <label>Color:</label>
            <select
              value={colorId}
              onChange={(e) => setColorId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              disabled={modoEdicion}
            >
              <option value="">-- Selecciona un color --</option>
              {colores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <label>RAM:</label>
            <select
              value={ramId}
              onChange={(e) => setRamId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              disabled={modoEdicion}
            >
              <option value="">-- Selecciona RAM --</option>
              {rams.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.valor}
                </option>
              ))}
            </select>

            <label>Capacidad de almacenamiento:</label>
            <select
              value={capacidadId}
              onChange={(e) => setCapacidadId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              disabled={modoEdicion}
            >
              <option value="">-- Selecciona capacidad --</option>
              {capacidades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <label>Precio:</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </ModalBase>
      </main>
      {/* 🔍 Modal de visualización de variación */}
      <ModalProductoVariacion
        mostrar={mostrarModalVer}
        onCerrar={() => setMostrarModalVer(false)}
        variacion={variacionSeleccionada}
      />
    </>
  );
}
