// src/pages/pedidos/PagarPedido.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import API_BASE_URL from "../../config/apiConfig";
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

export default function PagarPedido() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const pedidoId = params.get("pedidoId");

  const [pedido, setPedido] = useState(null);
  const [formaPago, setFormaPago] = useState(1);
  const [uuidOperacion] = useState(uuidv4());

  const [mostrarModalImei, setMostrarModalImei] = useState(false);
  const [imei, setImei] = useState("");

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/rapicredito/pedidos/${pedidoId}`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setPedido(res.data.data);
      } catch (error) {
        console.error("Error al obtener pedido:", error);
      }
    };

    if (pedidoId) fetchPedido();
  }, [pedidoId, auth.token]);

  const registrarPago = async () => {
    if (!pedido) return;

    const usuarioId = pedido.usuarioVendedor?.id;
    const montoPagado =
      pedido.metodoPago.id === 2 ? pedido.enganche : pedido.montoTotal;

    const payload = {
      montoPagado,
      fechaPago: new Date().toISOString(),
      estadoPago: "Pagado",
      formaPago: {
        id: formaPago,
        nombre: ["", "Efectivo", "Tarjeta", "Transferencia"][formaPago],
      },
      uuidOperacion,
    };

    try {
      await axios.post(
        `${API_BASE_URL}/rapicredito/pagos/${pedidoId}/pagar?usuarioId=${usuarioId}`,
        payload,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      alert("✅ Pago registrado correctamente");

      if (pedido.metodoPago?.id === 1) {
        navigate("/homeproductos");
      } else {
        setMostrarModalImei(true); // Mostrar modal para ingresar IMEI
      }
    } catch (err) {
      console.error("Error al registrar pago:", err);
      alert("❌ Error al registrar el pago");
    }
  };

  const registrarDispositivo = async () => {
    if (!imei) return alert("⚠️ Ingresa el IMEI del dispositivo");

    try {
      await axios.post(
        `${API_BASE_URL}/rapicredito/dispositivos/registrar?usuarioId=${pedido.usuarioVendedor.id}`,
        {
          pedidoId: pedido.id,
          usuarioClienteId: pedido.usuarioCliente.id,
          imei: imei,
          marca:
            pedido.productos?.[0]?.productoVariacion?.producto?.marca?.nombre ||
            "N/A",
          modelo:
            pedido.productos?.[0]?.productoVariacion?.producto?.modelo
              ?.nombre || "N/A",
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      alert("✅ Dispositivo registrado correctamente");
      setMostrarModalImei(false);
      navigate("/homeproductos");
    } catch (err) {
      console.error("❌ Error al registrar el dispositivo:", err);
      alert("❌ Error al registrar el dispositivo");
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 p-6 min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto border border-gray-300">
          <h1 className="text-2xl font-bold text-center text-[#002F6C] mb-6">
            Registrar Pago
          </h1>

          {pedido ? (
            <>
              <div className="mb-6 space-y-2 text-sm">
                <p>
                  <strong>ID Pedido:</strong> {pedido.id}
                </p>
                <p>
                  <strong>Cliente:</strong>{" "}
                  {pedido.usuarioCliente?.detalleUsuario?.nombre}{" "}
                  {pedido.usuarioCliente?.detalleUsuario?.apellidoPaterno}
                </p>
                <p>
                  <strong>Vendedor:</strong>{" "}
                  {pedido.usuarioVendedor?.detalleUsuario?.nombre}{" "}
                  {pedido.usuarioVendedor?.detalleUsuario?.apellidoPaterno}
                </p>
                <p>
                  <strong>Método de Pago:</strong> {pedido.metodoPago?.nombre}
                </p>
                <p>
                  <strong>Monto a Pagar:</strong> $
                  {pedido.metodoPago?.id === 2
                    ? pedido.enganche
                    : pedido.montoTotal}
                </p>
                <p>
                  <strong>UUID Operación:</strong> {uuidOperacion}
                </p>
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2 text-sm">
                  Forma de Pago
                </label>
                <select
                  value={formaPago}
                  onChange={(e) => setFormaPago(parseInt(e.target.value))}
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value={1}>Efectivo</option>
                  <option value={2}>Tarjeta</option>
                  <option value={3}>Transferencia</option>
                </select>
              </div>

              <div className="flex justify-center mt-6">
                <BotonPrincipal className="w-auto px-6" onClick={registrarPago}>
                  Confirmar Pago
                </BotonPrincipal>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Cargando pedido...</p>
          )}
        </div>
      </main>
      {mostrarModalImei && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-[#003366] mb-4">
              Ingresar IMEI del dispositivo
            </h2>
            <input
              type="text"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
              placeholder="IMEI del equipo"
            />
            <div className="flex justify-center gap-4">
              <BotonPrincipal
                className="w-auto px-6"
                onClick={registrarDispositivo}
              >
                Confirmar
              </BotonPrincipal>
              <button
                className="text-sm text-gray-500 hover:text-red-600 transition"
                onClick={() => setMostrarModalImei(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
