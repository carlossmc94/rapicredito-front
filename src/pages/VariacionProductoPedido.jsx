import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../config/apiConfig";
import BotonPrincipal from "./../components/BotonPrincipal";

export default function VariacionProductoPedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const almacenId = sessionStorage.getItem("almacenId");

  const [variaciones, setVariaciones] = useState([]);
  const [producto, setProducto] = useState(null);
  const [imagen, setImagen] = useState("/imagenes/productos/default.jpg");
  const [cantidad, setCantidad] = useState(1);

  const [colores, setColores] = useState([]);
  const [storages, setStorages] = useState([]);
  const [rams, setRams] = useState([]);

  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [storageSeleccionado, setStorageSeleccionado] = useState(null);
  const [ramSeleccionada, setRamSeleccionada] = useState(null);
  const [precio, setPrecio] = useState(null);
  const [selectedVariationId, setSelectedVariationId] = useState(null);

  const [mostrarModalCompra, setMostrarModalCompra] = useState(false);

  const [pasoCompra, setPasoCompra] = useState("tipo"); // "tipo" | "cliente"

  useEffect(() => {
    if (!id || !almacenId) return;

    const fetchVariaciones = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/rapicredito/producto-variacion/por-producto-y-almacen?productoId=${id}&almacenId=${almacenId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        const json = await res.json();
        if (json.codigo === 200) {
          setVariaciones(json.data);
          setProducto(json.data[0]?.producto);
          setImagen(
            json.data[0]?.producto?.imagen
              ? `/imagenes/productos/${json.data[0].producto.imagen
                  .split("/")
                  .pop()}`
              : "/imagenes/productos/default.jpg"
          );
          setColores([
            ...new Map(json.data.map((v) => [v.color.id, v.color])).values(),
          ]);
        }
      } catch (err) {
        console.error("Error al obtener variaciones:", err);
      }
    };

    fetchVariaciones();
  }, [id, almacenId, auth.token]);

  const seleccionarColor = (color) => {
    setColorSeleccionado(color);
    setStorageSeleccionado(null);
    setRamSeleccionada(null);
    setPrecio(null);
    setSelectedVariationId(null);

    const filtradas = variaciones.filter((v) => v.color.id === color.id);
    setStorages([
      ...new Map(
        filtradas.map((v) => [
          v.capacidadAlmacenamiento.id,
          v.capacidadAlmacenamiento,
        ])
      ).values(),
    ]);
    setRams([]);
  };

  const seleccionarStorage = (storage) => {
    setStorageSeleccionado(storage);
    setRamSeleccionada(null);
    setPrecio(null);
    setSelectedVariationId(null);

    const filtradas = variaciones.filter(
      (v) =>
        v.color.id === colorSeleccionado.id &&
        v.capacidadAlmacenamiento.id === storage.id
    );
    setRams([...new Map(filtradas.map((v) => [v.ram.id, v.ram])).values()]);
  };

  const seleccionarRam = (ram) => {
    setRamSeleccionada(ram);
    const seleccion = variaciones.find(
      (v) =>
        v.color.id === colorSeleccionado.id &&
        v.capacidadAlmacenamiento.id === storageSeleccionado.id &&
        v.ram.id === ram.id
    );
    setPrecio(seleccion?.precio || null);
    setSelectedVariationId(seleccion?.id || null);
  };

  const cambiarCantidad = (delta) => {
    setCantidad((prev) => Math.max(1, prev + delta));
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#f9f9f9] min-h-screen p-6">
        <div className="max-w-6xl mx-auto bg-white p-6 shadow rounded-xl flex flex-col md:flex-row gap-8 min-h-[580px]">
          <div className="w-full md:w-1/2 flex items-center justify-center h-full">
            <img
              src={imagen}
              alt="Producto"
              className="h-full max-h-[500px] object-contain rounded-md"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-[#003366] text-center mb-6">
              {producto?.nombre}
            </h1>

            {/* Color */}
            <div className="text-center mb-4">
              <h3 className="font-semibold mb-2 text-[#003366]">
                Elige tu color
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {colores.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => seleccionarColor(c)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                      colorSeleccionado?.id === c.id
                        ? "bg-[#ffcc00] text-[#003366] border-[#003366]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#003366]"
                    }`}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Almacenamiento */}
            {storages.length > 0 && (
              <div className="text-center mb-4">
                <h3 className="font-semibold mb-2 text-[#003366]">
                  Elige tu almacenamiento
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {storages.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => seleccionarStorage(s)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        storageSeleccionado?.id === s.id
                          ? "bg-[#ffcc00] text-[#003366] border-[#003366]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#003366]"
                      }`}
                    >
                      {s.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RAM */}
            {rams.length > 0 && (
              <div className="text-center mb-4">
                <h3 className="font-semibold mb-2 text-[#003366]">
                  Elige tu RAM
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {rams.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => seleccionarRam(r)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        ramSeleccionada?.id === r.id
                          ? "bg-[#ffcc00] text-[#003366] border-[#003366]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#003366]"
                      }`}
                    >
                      {r.valor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Precio */}
            <div className="text-center my-3 min-h-[48px]">
              {precio ? (
                <div>
                  <h3 className="font-semibold text-[#003366] mb-1">
                    Precio final:
                  </h3>
                  <p className="text-2xl font-bold text-[#0057B8]">
                    ${precio.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Completa la selección para ver el precio
                </p>
              )}
            </div>

            {/* Acción */}
            <div className="flex justify-center mt-4">
              <BotonPrincipal
                className="w-auto px-6"
                onClick={() => {
                  setPasoCompra("tipo");
                  setMostrarModalCompra(true);
                }}
              >
                Comprar ahora
              </BotonPrincipal>
            </div>
          </div>
        </div>
        {mostrarModalCompra && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center animate-fade-in">
              {pasoCompra === "tipo" && (
                <>
                  <h2 className="text-lg font-semibold text-[#003366] mb-4">
                    Selecciona el tipo de compra
                  </h2>
                  <div className="flex flex-col gap-4">
                    <BotonPrincipal
                      className="w-full"
                      onClick={() => {
                        setMostrarModalCompra(false);
                        navigate(
                          `/validacioncliente?idVariacion=${selectedVariationId}&pedidoCliente=1&metodoPago=2&precio=${precio}`
                          // `/usuarios/crearusuario?idVariacion=${selectedVariationId}&pedidoCliente=1&metodoPago=2&precio=${precio}`
                        );
                      }}
                    >
                      Crédito
                    </BotonPrincipal>
                    <BotonPrincipal
                      className="w-full"
                      onClick={() => setPasoCompra("cliente")} // Contado → paso 2
                    >
                      Contado
                    </BotonPrincipal>
                  </div>
                </>
              )}

              {pasoCompra === "cliente" && (
                <>
                  <h2 className="text-lg font-semibold text-[#003366] mb-4">
                    ¿Registrar cliente o continuar como anónimo?
                  </h2>
                  <div className="flex flex-col gap-4">
                    <BotonPrincipal
                      className="w-full"
                      onClick={() => {
                        setMostrarModalCompra(false);
                        navigate(
                          `/usuarios/crearusuario?idVariacion=${selectedVariationId}&pedidoCliente=1&metodoPago=1&precio=${precio}`
                        );
                      }}
                    >
                      Registrar cliente
                    </BotonPrincipal>
                    <BotonPrincipal
                      className="w-full"
                      onClick={() => {
                        setMostrarModalCompra(false);
                        navigate(
                          `/crearpedido?clienteId=10&idVariacion=${selectedVariationId}&metodoPago=1&precio=${precio}`
                        );
                      }}
                    >
                      Cliente anónimo
                    </BotonPrincipal>
                  </div>
                </>
              )}

              <button
                className="mt-4 text-sm text-gray-500 hover:text-red-600 transition"
                onClick={() => setMostrarModalCompra(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
