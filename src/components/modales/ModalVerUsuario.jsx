import React from 'react';
import ModalBase from '../ui/ModalBase';

export default function ModalVerUsuario({ mostrar, onCerrar, usuario }) {
  if (!usuario) return null;

  return (
    <ModalBase
      mostrar={mostrar}
      titulo={`Detalle del usuario "${usuario.nombreUsuario}"`}
      onCerrar={onCerrar}
      mostrarBotonConfirmar={false}
      anchoMaximo="max-w-4xl" // más ancho para columnas balanceadas
    >
      <div className="grid gap-6 md:grid-cols-2 text-sm text-gray-800">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-4">
          <section>
            <h3 className="font-semibold text-[#002F6C] mb-1">🧾 Información de Usuario</h3>
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Rol:</strong> {usuario.rol?.nombreRol}</p>
            <p><strong>Activo:</strong> {usuario.activo ? 'Sí' : 'No'}</p>
            <p><strong>Requiere cambio de contraseña:</strong> {usuario.requiereCambioContrasena ? 'Sí' : 'No'}</p>
            <p><strong>Fecha de creación:</strong> {usuario.fechaCreacion}</p>
          </section>

          <section>
            <h3 className="font-semibold text-[#002F6C] mb-1">📞 Contacto</h3>
            <p><strong>Email:</strong> {usuario.contacto?.email}</p>
            <p><strong>Teléfono:</strong> {usuario.contacto?.telefono}</p>
          </section>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-4">
          <section>
            <h3 className="font-semibold text-[#002F6C] mb-1">👤 Datos personales</h3>
            <p><strong>Nombre completo:</strong> {`${usuario.detalleUsuario?.nombre || ''} ${usuario.detalleUsuario?.apellidoPaterno || ''} ${usuario.detalleUsuario?.apellidoMaterno || ''}`}</p>
            <p><strong>CURP:</strong> {usuario.detalleUsuario?.curp}</p>
            <p><strong>Fecha de nacimiento:</strong> {usuario.detalleUsuario?.fechaNacimiento}</p>
            <p><strong>Género:</strong> {usuario.detalleUsuario?.genero?.nombre}</p>
          </section>

          <section>
            <h3 className="font-semibold text-[#002F6C] mb-1">🏠 Dirección</h3>
            <p><strong>Calle:</strong> {usuario.direccion?.calle}</p>
            <p><strong>Número:</strong> {usuario.direccion?.numeroExterior}</p>
            <p><strong>Interior:</strong> {usuario.direccion?.numeroInterior}</p>
            <p><strong>Código postal:</strong> {usuario.direccion?.codigoPostal?.codigoPostal}</p>
            <p><strong>Asentamiento:</strong> {usuario.direccion?.codigoPostal?.asentamiento}</p>
            <p><strong>Municipio:</strong> {usuario.direccion?.codigoPostal?.municipio}</p>
            <p><strong>Estado:</strong> {usuario.direccion?.codigoPostal?.estado}</p>
          </section>
        </div>
      </div>
    </ModalBase>
  );
}
