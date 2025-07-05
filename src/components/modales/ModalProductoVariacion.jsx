import React from "react";
import ModalBase from "../ui/ModalBase";

export default function ModalProductoVariacion({ mostrar, onCerrar, variacion }) {
  if (!variacion) return null;

  const producto = variacion.producto || {};
  const color = variacion.color || {};
  const ram = variacion.ram || {};
  const capacidad = variacion.capacidadAlmacenamiento || {};

  return (
    <ModalBase
      mostrar={mostrar}
      titulo="Detalles de la variación de producto"
      onCerrar={onCerrar}
      onConfirmar={onCerrar}
      textoBotonConfirmar="Cerrar"
      mostrarBotonConfirmar={true}
      anchoMaximo="max-w-5xl"
    >
      {/* 🔷 Información del producto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Nombre:</label>
          <input
            value={producto.nombre || ""}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Descripción:</label>
          <input
            value={producto.descripcion || ""}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Marca:</label>
          <input
            value={producto.marca?.nombre || ""}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Modelo:</label>
          <input
            value={producto.modelo?.nombre || ""}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Precio base:</label>
          <input
            value={producto.precioBase ? `$${producto.precioBase.toFixed(2)}` : ""}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Imagen:</label>
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt="Producto"
              className="w-full h-28 object-contain border rounded shadow-sm bg-white p-1"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/imagenes/productos/default.png";
              }}
            />
          ) : (
            <div className="text-gray-500 italic">No disponible</div>
          )}
        </div>
      </div>

      {/* 🔸 Datos de la variación */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-[#002F6C] mb-3">Datos de la variación</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Color:</label>
            <input
              value={color.nombre || ""}
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">RAM:</label>
            <input
              value={ram.valor || ""}
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Capacidad:</label>
            <input
              value={capacidad.nombre || ""}
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Precio variación:</label>
            <input
              value={variacion.precio ? `$${variacion.precio.toFixed(2)}` : ""}
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
