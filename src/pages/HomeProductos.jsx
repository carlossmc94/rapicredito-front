import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/apiConfig";
import { useNavigate } from "react-router-dom";

export default function HomeProductos() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [precioMaximo, setPrecioMaximo] = useState(50000);
  const [precioDesde, setPrecioDesde] = useState(0);
  const [precioHasta, setPrecioHasta] = useState(50000);

  const toggleMarca = (marca) => {
    if (marcasSeleccionadas.includes(marca)) {
      setMarcasSeleccionadas(marcasSeleccionadas.filter((m) => m !== marca));
    } else {
      setMarcasSeleccionadas([...marcasSeleccionadas, marca]);
    }
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const almacenId = sessionStorage.getItem("almacenId");
        if (!almacenId || !auth.token) return;

        const response = await axios.get(
          `${API_BASE_URL}/rapicredito/productos/disponibles-por-almacen/${almacenId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (response.data.codigo === 200) {
          const productosMapeados = response.data.data.map((p) => ({
            id: p.productoId,
            nombre: p.nombreModelo,
            marca: p.nombreMarca,
            imagen:
              p.imagen && p.imagen.trim() !== ""
                ? `/imagenes/productos/${p.imagen.split("/").pop()}`
                : "/imagenes/productos/default.jpg",
            precioBase: p.precioBase,
          }));

          setProductos(productosMapeados);

          // Marcas únicas
          const marcasUnicas = [
            ...new Set(response.data.data.map((p) => p.nombreMarca)),
          ];
          setMarcasDisponibles(marcasUnicas);
        }
      } catch (error) {
        console.error("Error al obtener productos disponibles:", error);
      }
    };

    fetchProductos();
  }, [auth.token]);

  const productosFiltrados = productos.filter((producto) => {
    const nombre = producto.nombre.toLowerCase();
    const marca = producto.marca.toLowerCase();
    const coincideBusqueda =
      nombre.includes(busqueda.toLowerCase()) ||
      marca.includes(busqueda.toLowerCase());

    const coincideMarca =
      marcasSeleccionadas.length === 0 ||
      marcasSeleccionadas.includes(producto.marca);

    const precio = producto.precioBase;
    const coincidePrecio =
      precio >= precioDesde && precio <= Math.min(precioHasta, precioMaximo);

    return coincideBusqueda && coincideMarca && coincidePrecio;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f4f4] px-6 py-10">
        <h1 className="text-3xl font-bold text-[#002F6C] mb-6 text-center">
          Elige tu nuevo celular con RAPICRÉDITO
        </h1>

        <div className="flex gap-6">
          {/* Filtros */}
          <aside className="hidden md:block w-1/4 bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-lg font-semibold mb-4 text-[#002F6C]">
              Filtros
            </h2>

            {/* Búsqueda */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar por marca o modelo:
              </label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            {/* Marcas dinámicas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              {marcasDisponibles.map((marca) => (
                <div key={marca}>
                  <label className="inline-flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      value={marca}
                      checked={marcasSeleccionadas.includes(marca)}
                      onChange={() => toggleMarca(marca)}
                      className="mr-2 accent-[#002F6C]"
                    />
                    {marca}
                  </label>
                </div>
              ))}
            </div>

            {/* 🎚 Rango de precios completo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona el rango de precios:
              </label>

              {/* Sliders */}
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Mín:</span>
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    value={precioDesde}
                    onChange={(e) =>
                      setPrecioDesde(
                        Number(e.target.value.replace(/^0+(?!$)/, ""))
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">${precioDesde}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Máx:</span>
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    value={precioHasta}
                    onChange={(e) =>
                      setPrecioHasta(
                        Number(e.target.value.replace(/^0+(?!$)/, ""))
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">${precioHasta}</span>
                </div>
              </div>

              {/* Inputs manuales */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Desde</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={precioDesde === 0 ? "" : precioDesde}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?!$)/, "");
                    setPrecioDesde(Number(val) || 0);
                  }}
                  placeholder="0"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <span className="text-sm text-gray-600">hasta</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={precioHasta === 0 ? "" : precioHasta}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?!$)/, "");
                    setPrecioHasta(Number(val) || 0);
                  }}
                  placeholder="50000"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </aside>

          {/* Productos */}
          <section className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.id}
                  onClick={() =>
                    navigate(`/variacionproductopedido/${producto.id}`)
                  }
                  className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="w-full h-52 flex items-center justify-center mb-4">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="max-h-full object-contain"
                      />
                    </div>

                    {/* Modelo */}
                    <h3 className="text-xl font-bold text-[#002F6C] mb-1">
                      {producto.nombre}
                    </h3>

                    {/* Marca */}
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-gray-700">Marca:</span>{" "}
                      {producto.marca}
                    </p>

                    {/* Precio */}
                    <div className="mt-auto">
                      <p className="text-[#0057B8] text-lg font-bold">
                        Precio desde: ${producto.precioBase.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
