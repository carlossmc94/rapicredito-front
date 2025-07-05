import React from 'react';

export default function ModalBase({
  mostrar,
  titulo = '',
  children,
  onCerrar,
  onConfirmar,
  mostrarBotonConfirmar = true,
  textoBotonConfirmar = 'Guardar',
  deshabilitarConfirmar = false,
  anchoMaximo = 'max-w-lg' // 👉 puedes usar 'max-w-xl', 'max-w-4xl', etc.
}) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl shadow-xl w-full ${anchoMaximo} mx-4 sm:mx-0 animate-fade-in`}>
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-[#002F6C] rounded-t-xl">
          <h2 className="text-white text-lg font-semibold">{titulo}</h2>
          <button onClick={onCerrar} className="text-white text-xl font-bold hover:scale-125 transition-transform">
            ✕
          </button>
        </div>

        {/* Contenido personalizado */}
        <div className="p-6">{children}</div>

        {/* Footer con botones */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onCerrar}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
          >
            Cancelar
          </button>

          {mostrarBotonConfirmar && (
            <button
              onClick={onConfirmar}
              disabled={deshabilitarConfirmar}
              className={`px-4 py-2 rounded-md bg-[#FFD600] text-[#002F6C] hover:bg-[#ffcc00] text-sm font-semibold ${
                deshabilitarConfirmar ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {textoBotonConfirmar}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
