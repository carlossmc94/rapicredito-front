import React, { useState } from "react";

const obtenerValor = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "";
};

export default function TablaGenerica({
  columnas,
  datos,
  acciones = {},
  filtroFuncion,
}) {
  const mostrarVer = typeof acciones.ver === "function";
  const mostrarEditar = typeof acciones.editar === "function";
  const mostrarEliminar = typeof acciones.eliminar === "function";

  const mostrarEntrada = typeof acciones.entrada === "function";
  const mostrarSalida = typeof acciones.salida === "function";

  const mostrarAcciones =
    mostrarVer ||
    mostrarEditar ||
    mostrarEliminar ||
    mostrarEntrada ||
    mostrarSalida;

  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState("");
  const registrosPorPagina = 5;

  // 👉 Aplicar filtro externo (si se proporciona)
  const datosFiltrados = filtroFuncion
    ? datos.filter((item) => filtroFuncion(item, filtroTexto))
    : datos;

  const totalPaginas = Math.ceil(datosFiltrados.length / registrosPorPagina);
  const datosPaginados = mostrarTodos
    ? datosFiltrados
    : datosFiltrados.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
      );

  const handleSelector = (e) => {
    const valor = e.target.value;
    setMostrarTodos(valor === "todos");
    setPaginaActual(1);
  };

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 px-2">
        {/* 🔍 Input de búsqueda */}
        {filtroFuncion && (
          <div className="relative w-full sm:w-1/2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              value={filtroTexto}
              onChange={(e) => {
                setFiltroTexto(e.target.value);
                setPaginaActual(1);
              }}
              className="pl-9 border border-gray-300 rounded px-3 py-2 text-sm w-full"
            />
          </div>
        )}

        {/* 🔢 Selector de cantidad */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrar:</span>
          <select
            value={mostrarTodos ? "todos" : "5"}
            onChange={handleSelector}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="todos">Todos</option>
          </select>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-[#002F6C] text-white">
            {columnas.map((col, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {col.titulo}
              </th>
            ))}
            {mostrarAcciones && (
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                {/* Acciones */}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-800 text-sm">
          {datosPaginados.length === 0 ? (
            <tr>
              <td
                colSpan={columnas.length + (mostrarAcciones ? 1 : 0)}
                className="px-6 py-4 text-center text-gray-500"
              >
                No hay registros para mostrar
              </td>
            </tr>
          ) : (
            datosPaginados.map((fila, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                {columnas.map((col, j) => (
                  <td key={j} className="px-6 py-4">
                    {obtenerValor(fila, col.campo)}
                  </td>
                ))}
                {mostrarAcciones && (
                  <td className="px-6 py-4 flex gap-3">
                    {typeof acciones.ver === "function" && (
                      <button
                        onClick={() => acciones.ver(fila)}
                        className="text-xl hover:scale-110 transition-transform"
                        title="Ver"
                      >
                        👁️
                      </button>
                    )}
                    {mostrarEditar && (
                      <button
                        onClick={() => acciones.editar(fila)}
                        className="text-xl hover:scale-110 transition-transform"
                        title="Editar"
                      >
                        ✏️
                      </button>
                    )}
                    {mostrarEliminar && (
                      <button
                        onClick={() => acciones.eliminar(fila)}
                        className="text-xl hover:scale-110 transition-transform"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    )}
                    {mostrarEntrada && (
                      <button
                        onClick={() => acciones.entrada(fila)}
                        className="text-xl hover:scale-110 transition-transform"
                        title="Entrada de inventario"
                      >
                        ➕
                      </button>
                    )}
                    {mostrarSalida && (
                      <button
                        onClick={() => acciones.salida(fila)}
                        className="text-xl hover:scale-110 transition-transform"
                        title="Salida de inventario"
                      >
                        ➖
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔀 Controles de paginación */}
      {!mostrarTodos && totalPaginas > 1 && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            className="text-sm px-3 py-1 border rounded disabled:opacity-50"
          >
            ⬅️
          </button>
          <span className="text-sm pt-1">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() =>
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
            className="text-sm px-3 py-1 border rounded disabled:opacity-50"
          >
            ➡️
          </button>
        </div>
      )}
    </div>
  );
}
