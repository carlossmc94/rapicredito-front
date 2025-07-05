import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import TablaGenerica from "../../components/ui/TablaGenerica";
import ModalProducto from "../../components/modales/ModalProducto";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalBase from "../../components/ui/ModalBase";
import ModalDetalleProducto from "../../components/modales/ModalDetalleProducto";

export default function Producto() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [mensajeExito, setMensajeExito] = useState("");
  const [datos, setDatos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioBase, setPrecioBase] = useState("");

  const [marcaId, setMarcaId] = useState("");
  const [modeloId, setModeloId] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  const [categoriaId, setCategoriaId] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [imagen, setImagen] = useState("");
  const [especificaciones, setEspecificaciones] = useState("");
  const [peso, setPeso] = useState("");

  const [sistemaOperativoId, setSistemaOperativoId] = useState("");
  const [camaraId, setCamaraId] = useState("");
  const [bateriaId, setBateriaId] = useState("");
  const [dimensionesId, setDimensionesId] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [sistemasOperativos, setSistemasOperativos] = useState([]);
  const [camaras, setCamaras] = useState([]);
  const [baterias, setBaterias] = useState([]);
  const [dimensiones, setDimensiones] = useState([]);

  const [archivoImagen, setArchivoImagen] = useState(null);

  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);

  const cargarCatalogosAdicionales = async () => {
    const endpoints = [
      { url: "categorias-producto", set: setCategorias, usarTodos: false },
      { url: "proveedores/todos", set: setProveedores, usarTodos: true },
      {
        url: "sistema-operativo/todos",
        set: setSistemasOperativos,
        usarTodos: true,
      },
      { url: "camaras", set: setCamaras, usarTodos: false }, // ✅ sin /todos
      { url: "baterias", set: setBaterias, usarTodos: false }, // ✅ sin /todos
      { url: "dimensiones/todos", set: setDimensiones, usarTodos: true },
    ];

    for (const { url, set, usarTodos } of endpoints) {
      try {
        const res = await axios.get(`${API_BASE_URL}/rapicredito/${url}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        set(res.data.data);
      } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
      }
    }
  };

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    } else {
      cargarRegistros();
      cargarMarcas();
      cargarModelos();
      cargarCatalogosAdicionales();
    }
  }, [auth]);

  const cargarRegistros = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/rapicredito/productos/todos`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setDatos(response.data.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const verDetalleProducto = async (id) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/rapicredito/productos/obtener/${id}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setProductoDetalle(res.data.data);
      setMostrarModalDetalle(true);
    } catch (error) {
      alert("No se pudo cargar el detalle del producto.");
    }
  };

  const cargarMarcas = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/rapicredito/marcas/todas`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setMarcas(res.data.data);
    } catch (error) {
      console.error("Error al cargar marcas:", error);
    }
  };

  const cargarModelos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/rapicredito/modelos/todos`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setModelos(res.data.data);
    } catch (error) {
      console.error("Error al cargar modelos:", error);
    }
  };

  const columnas = [
    { campo: "id", titulo: "ID" },
    { campo: "nombre", titulo: "Nombre" },
    { campo: "descripcion", titulo: "Descripción" },
    { campo: "marca.nombre", titulo: "Marca" },
    { campo: "modelo.nombre", titulo: "Modelo" },
    { campo: "precioBase", titulo: "Precio Base" },
  ];
  const acciones = {
    ver: (fila) => {
      verDetalleProducto(fila.id);
    },
    editar: (fila) => {
      setModoEdicion(true);
      setProductoActual(fila);
      setNombre(fila.nombre || "");
      setDescripcion(fila.descripcion || "");
      setMarcaId(fila.marca?.id || "");
      setModeloId(fila.modelo?.id || "");
      setCategoriaId(fila.categoriaProducto?.id || "");
      setProveedorId(fila.proveedor?.id || "");
      setImagen(fila.imagen || "");
      setEspecificaciones(fila.especificaciones || "");
      setPrecioBase(fila.precioBase || "");
      setPeso(fila.peso || "");
      setSistemaOperativoId(fila.sistemaOperativo?.id || "");
      setCamaraId(fila.camara?.id || "");
      setBateriaId(fila.bateria?.id || "");
      setDimensionesId(fila.dimensiones?.id || "");
      setMostrarModal(true);
    },
    eliminar: async (fila) => {
      if (confirm(`¿Deseas eliminar el producto con ID ${fila.id}?`)) {
        try {
          await axios.delete(
            `${API_BASE_URL}/rapicredito/productos/eliminar/${fila.id}`,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
          setMensajeExito("Producto eliminado correctamente");
          cargarRegistros();
          setTimeout(() => setMensajeExito(""), 3000);
        } catch (error) {
          alert("Error al eliminar producto.");
        }
      }
    },
  };

  const filtroFuncion = (fila, texto) =>
    fila.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
    fila.descripcion?.toLowerCase().includes(texto.toLowerCase()) ||
    fila.marca?.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
    fila.modelo?.nombre?.toLowerCase().includes(texto.toLowerCase());

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProductoActual(null);
    setNombre("");
    setDescripcion("");
    setPrecioBase("");

    // ✅ Reiniciar todos los selects y campos relacionados
    setMarcaId("");
    setModeloId("");
    setProveedorId("");
    setCategoriaId("");
    setSistemaOperativoId("");
    setCamaraId("");
    setBateriaId("");
    setDimensionesId("");

    setImagen("");
    setEspecificaciones("");
    setPeso("");

    setMostrarModal(true);
  };

  const subirImagen = async (archivo) => {
    const formData = new FormData();
    formData.append("file", archivo);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/rapicredito/productos/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data; // /imagenes/productos/...
    } catch (error) {
      console.error("Error al subir imagen:", error);
      throw new Error("Fallo al subir imagen");
    }
  };

  const guardarProducto = async () => {
    try {
      if (!archivoImagen && !modoEdicion) {
        alert("Debes seleccionar una imagen para el producto.");
        return;
      }

      let rutaImagenFinal = imagen;

      if (archivoImagen) {
        rutaImagenFinal = await subirImagen(archivoImagen);
        setImagen(rutaImagenFinal); // opcional para el preview
      }

      const payload = {
        nombre,
        descripcion,
        marca: { id: parseInt(marcaId) },
        categoriaProducto: { id: parseInt(categoriaId) },
        proveedor: { id: parseInt(proveedorId) },
        imagen: rutaImagenFinal,
        fechaCreacion: new Date().toISOString(),
        activo: true,
        especificaciones,
        peso: parseFloat(peso),
        sistemaOperativo: { id: parseInt(sistemaOperativoId) },
        modelo: { id: parseInt(modeloId) },
        camara: { id: parseInt(camaraId) },
        bateria: { id: parseInt(bateriaId) },
        dimensiones: { id: parseInt(dimensionesId) },
        precioBase: parseFloat(precioBase),
      };

      if (modoEdicion && productoActual) {
        await axios.put(
          `${API_BASE_URL}/rapicredito/productos/actualizar/${productoActual.id}`,
          payload,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setMensajeExito("Producto actualizado correctamente");
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/rapicredito/productos/crear`,
          payload,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setMensajeExito("Producto creado correctamente");

        // 👁️ Mostrar modal de detalle del producto recién creado
        const nuevoId = res.data?.data?.id;
        if (nuevoId) {
          verDetalleProducto(nuevoId);
        }
      }

      setMostrarModal(false);
      setArchivoImagen(null); // 🧹 limpiar la imagen después del guardado
      cargarRegistros();

      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      alert("Error al guardar producto.");
      console.error(error);
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
              Catálogo: Productos
            </h1>
            <div className="w-auto">
              <BotonPrincipal onClick={abrirModalCrear}>
                Crear producto
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

        <ModalProducto
          mostrar={mostrarModal}
          modoEdicion={modoEdicion}
          onCerrar={() => setMostrarModal(false)}
          onConfirmar={guardarProducto}
          anchoMaximo="max-w-5xl"
          nombre={nombre}
          setNombre={setNombre}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          marcaId={marcaId}
          setMarcaId={setMarcaId}
          modeloId={modeloId}
          setModeloId={setModeloId}
          categoriaId={categoriaId}
          setCategoriaId={setCategoriaId}
          proveedorId={proveedorId}
          setProveedorId={setProveedorId}
          imagen={imagen}
          setImagen={setImagen}
          archivoImagen={archivoImagen}
          setArchivoImagen={setArchivoImagen}
          especificaciones={especificaciones}
          setEspecificaciones={setEspecificaciones}
          precioBase={precioBase}
          setPrecioBase={setPrecioBase}
          peso={peso}
          setPeso={setPeso}
          sistemaOperativoId={sistemaOperativoId}
          setSistemaOperativoId={setSistemaOperativoId}
          camaraId={camaraId}
          setCamaraId={setCamaraId}
          bateriaId={bateriaId}
          setBateriaId={setBateriaId}
          dimensionesId={dimensionesId}
          setDimensionesId={setDimensionesId}
          marcas={marcas}
          modelos={modelos}
          categorias={categorias}
          proveedores={proveedores}
          sistemasOperativos={sistemasOperativos}
          camaras={camaras}
          baterias={baterias}
          dimensiones={dimensiones}
        />
        <ModalDetalleProducto
          mostrar={mostrarModalDetalle}
          onCerrar={() => setMostrarModalDetalle(false)}
          producto={productoDetalle}
        />
      </main>
    </>
  );
}
