import React from "react";
import ModalBase from "../ui/ModalBase";

export default function ModalDetalleProducto({ mostrar, onCerrar, producto }) {
  if (!producto) return null;

  return (
    <ModalBase
      mostrar={mostrar}
      titulo={`Detalle del producto: ${producto.nombre}`}
      onCerrar={onCerrar}
      mostrarBotonConfirmar={false}
      anchoMaximo="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-64 object-contain border rounded"
          />
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Descripción:</strong> {producto.descripcion}</p>
          <p><strong>Marca:</strong> {producto.marca?.nombre}</p>
          <p><strong>Modelo:</strong> {producto.modelo?.nombre}</p>
          <p><strong>Categoría:</strong> {producto.categoriaProducto?.nombre}</p>
          <p><strong>Proveedor:</strong> {producto.proveedor?.nombre}</p>
          <p><strong>Especificaciones:</strong> {producto.especificaciones}</p>
          <p><strong>Sistema Operativo:</strong> {producto.sistemaOperativo?.nombre}</p>
          <p><strong>Precio Base:</strong> ${producto.precioBase}</p>
          <p><strong>Peso:</strong> {producto.peso} kg</p>
          <p><strong>Cámara:</strong> {producto.camara?.especificaciones}</p>
          <p><strong>Batería:</strong> {producto.bateria?.especificaciones}</p>
          <p><strong>Dimensiones:</strong> {producto.dimensiones?.especificaciones}</p>
        </div>
      </div>
    </ModalBase>
  );
}
