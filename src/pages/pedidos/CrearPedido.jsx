// src/pages/pedidos/CrearPedido.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import API_BASE_URL from "../../config/apiConfig";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function CrearPedido() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const clienteId = params.get("clienteId");
  const idVariacion = params.get("idVariacion");
  const metodoPago = parseInt(params.get("metodoPago"));
  const precioUnitario = parseFloat(params.get("precio"));

  const [cliente, setCliente] = useState(null);
  const [variacion, setVariacion] = useState(null);
  const [enganche, setEnganche] = useState(0);
  const [plazo, setPlazo] = useState(12);
  const [plazoPagoTipoId, setPlazoPagoTipoId] = useState(3); // mensual por defecto

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/rapicredito/usuarios/${clienteId}`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setCliente(res.data?.data);
      } catch (err) {
        console.error("Error al obtener cliente:", err);
      }
    };

    const fetchVariacion = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/rapicredito/producto-variacion/${idVariacion}`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setVariacion(res.data?.data);
      } catch (err) {
        console.error("Error al obtener variación:", err);
      }
    };

    if (clienteId) fetchCliente();
    if (idVariacion) fetchVariacion();
  }, [clienteId, idVariacion, auth.token]);

  const enviarPedido = async () => {
    try {
      const payload = {
        usuarioCliente: { id: parseInt(clienteId) },
        usuarioVendedor: { id: auth.usuarioId },
        estatusPedido: { id: 1 },
        metodoPago: { id: metodoPago },
        porcentajeEnganche: metodoPago === 1 ? 0 : enganche,
        plazoPago: plazo,
        plazoPagoTipo: { id: plazoPagoTipoId },
        productos: [
          {
            productoVariacion: { id: parseInt(idVariacion) },
            cantidad: 1,
            precioUnitario: precioUnitario,
          },
        ],
      };

      const res = await axios.post(
        `${API_BASE_URL}/rapicredito/pedidos/crear`,
        payload,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      const pedidoId = res.data?.data?.id;

      if (pedidoId) {
        alert("✅ Pedido creado correctamente");
        navigate(`/pagarpedido?pedidoId=${pedidoId}`);
      } else {
        alert("❌ Pedido creado pero no se recibió ID.");
      }
    } catch (err) {
      console.error("Error al crear pedido:", err);
      alert("❌ Error al crear el pedido");
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 p-6 min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-5xl mx-auto border border-gray-300">
          <h1 className="text-2xl font-bold text-center text-[#002F6C] mb-6">
            FORMULARIO DE PEDIDO RAPICRÉDITO
          </h1>

          <p className="text-sm text-right text-gray-500 mb-4">
            Fecha: {new Date().toLocaleDateString("es-MX")}
          </p>

          <div className="border border-gray-400 divide-y divide-gray-400 text-sm">
            {/* Datos del Cliente */}
            <div className="grid grid-cols-2 p-4">
              <div>
                <p className="font-semibold">ID Cliente:</p>
                <p>{cliente?.id}</p>
              </div>
              <div>
                <p className="font-semibold">CURP:</p>
                <p>{cliente?.detalleUsuario?.curp}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Nombre completo:</p>
                <p>
                  {cliente?.detalleUsuario?.nombre}{" "}
                  {cliente?.detalleUsuario?.apellidoPaterno}{" "}
                  {cliente?.detalleUsuario?.apellidoMaterno}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Teléfono:</p>
                <p>{cliente?.contacto?.telefono}</p>
              </div>
              <div className="col-span-2 mt-2">
                <p className="font-semibold">Dirección:</p>
                <p>
                  {cliente?.direccion?.calle} #
                  {cliente?.direccion?.numeroExterior},{" "}
                  {cliente?.direccion?.codigoPostal?.asentamiento},{" "}
                  {cliente?.direccion?.codigoPostal?.municipio},{" "}
                  {cliente?.direccion?.codigoPostal?.estado}. CP:{" "}
                  {cliente?.direccion?.codigoPostal?.codigoPostal}
                </p>
              </div>
            </div>

            {/* Producto y Variación */}
            <div className="grid grid-cols-2 p-4">
              <div>
                <p className="font-semibold">Producto:</p>
                <p>{variacion?.producto?.nombre}</p>
              </div>
              <div>
                <p className="font-semibold">Variación:</p>
                <p>
                  {variacion?.color?.nombre} / {variacion?.ram?.valor} /{" "}
                  {variacion?.capacidadAlmacenamiento?.nombre}
                </p>
              </div>
              <div>
                <p className="font-semibold">Precio Unitario:</p>
                <p>
                  ${isNaN(precioUnitario) ? "N/A" : precioUnitario.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Método de Pago:</p>
                <p>{metodoPago === 1 ? "Contado" : "Crédito"}</p>
              </div>
            </div>

            {/* Detalles del Pedido */}
            <div className="grid grid-cols-2 p-4">
              {metodoPago === 2 && (
                <>
                  <div>
                    <label className="font-semibold block mb-1">
                      Enganche (%)
                    </label>
                    <select
                      value={enganche}
                      onChange={(e) => setEnganche(parseInt(e.target.value))}
                      className="border border-gray-300 rounded p-2 w-full"
                    >
                      <option value={0}>Selecciona</option>
                      {[...Array(10)].map((_, i) => {
                        const val = (i + 1) * 5;
                        return (
                          <option key={val} value={val}>
                            {val}%
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">
                      Plazo (número de pagos)
                    </label>
                    <input
                      type="number"
                      value={plazo}
                      onChange={(e) => setPlazo(parseInt(e.target.value))}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">
                      Tipo de Plazo
                    </label>
                    <select
                      value={plazoPagoTipoId}
                      onChange={(e) =>
                        setPlazoPagoTipoId(parseInt(e.target.value))
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                    >
                      <option value={1}>Semanal</option>
                      <option value={2}>Quincenal</option>
                      <option value={3}>Mensual</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <BotonPrincipal onClick={enviarPedido} className="w-auto px-8">
              Confirmar Pedido
            </BotonPrincipal>
          </div>
        </div>
      </main>
    </>
  );
}
