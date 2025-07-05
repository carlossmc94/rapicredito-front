import React from "react";
import ModalBase from "../ui/ModalBase";

export default function ModalProducto({
  mostrar,
  modoEdicion,
  onCerrar,
  onConfirmar,
  anchoMaximo = "max-w-5xl",

  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  precioBase,
  setPrecioBase,
  marcaId,
  setMarcaId,
  modeloId,
  setModeloId,
  proveedorId,
  setProveedorId,
  categoriaId,
  setCategoriaId,
  especificaciones,
  setEspecificaciones,
  peso,
  setPeso,
  imagen,
  setImagen,
  archivoImagen, // ✅ AGREGAR
  setArchivoImagen, // ✅ AGREGAR
  sistemaOperativoId,
  setSistemaOperativoId,
  camaraId,
  setCamaraId,
  bateriaId,
  setBateriaId,
  dimensionesId,
  setDimensionesId,

  marcas,
  modelos,
  proveedores,
  categorias,
  sistemasOperativos,
  camaras,
  baterias,
  dimensiones,
}) {
  return (
    <ModalBase
      mostrar={mostrar}
      titulo={modoEdicion ? "Editar producto" : "Crear producto"}
      onCerrar={onCerrar}
      onConfirmar={onConfirmar}
      anchoMaximo={anchoMaximo}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Nombre:</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Proveedor:
          </label>
          <select
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Especificaciones:
          </label>
          <input
            value={especificaciones}
            onChange={(e) => setEspecificaciones(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Descripción:
          </label>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Categoría:
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Peso (kg):
          </label>
          <input
            type="number"
            step="0.01"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Marca:</label>
          <select
            value={marcaId}
            onChange={(e) => setMarcaId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Imagen:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setArchivoImagen(file);
                const previewUrl = URL.createObjectURL(file);
                setImagen(previewUrl); // Solo para vista previa
              }
            }}
            className="input"
          />

          {/* Preview visual */}
          {imagen && (
            <img
              src={imagen}
              alt="Imagen del producto"
              className="mt-2 h-28 w-full object-contain border rounded shadow-sm bg-gray-100 p-1"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/imagenes/productos/default.png"; // opcional: imagen fallback si falla
              }}
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Sistema Operativo:
          </label>
          <select
            value={sistemaOperativoId}
            onChange={(e) => setSistemaOperativoId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione</option>
            {sistemasOperativos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Modelo:</label>
          <select
            value={modeloId}
            onChange={(e) => setModeloId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione</option>
            {modelos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Precio Base:
          </label>
          <input
            type="number"
            step="0.01"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Cámara:</label>
          <select
            value={camaraId}
            onChange={(e) => setCamaraId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione</option>
            {camaras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.especificaciones}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Batería:</label>
          <select
            value={bateriaId}
            onChange={(e) => setBateriaId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione</option>
            {baterias.map((b) => (
              <option key={b.id} value={b.id}>
                {b.especificaciones}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Dimensiones:
          </label>
          <select
            value={dimensionesId}
            onChange={(e) => setDimensionesId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccione</option>
            {dimensiones.map((d) => (
              <option key={d.id} value={d.id}>
                {d.especificaciones}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ModalBase>
  );
}
