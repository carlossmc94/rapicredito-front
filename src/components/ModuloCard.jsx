import React from "react";
import BotonPrincipal from "./BotonPrincipal";
import { FiArrowLeft } from "react-icons/fi";

export default function ModuloCard({ imagen, acciones = [] }) {
  const anchoCard =
    acciones.length > 4
      ? "max-w-[1100px]"
      : acciones.length > 2
      ? "max-w-[950px]"
      : "max-w-[750px]";

  const columnas =
    acciones.length >= 6
      ? "grid-cols-3"
      : acciones.length >= 3
      ? "grid-cols-2"
      : "grid-cols-1";

  // Definir proporción dinámica
  const clasesImagen =
    acciones.length >= 3 ? "md:w-2/5" : "md:w-1/2"; // 40% si 2 columnas, si no 50%
  const clasesFormulario =
    acciones.length >= 3 ? "md:w-3/5" : "md:w-1/2"; // 60% si 2 columnas, si no 50%

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Botón volver */}
      <div className={`w-full ${anchoCard} flex justify-end`}>
        <button
          onClick={() => window.location.assign("/paneladministrador")}
          className="flex items-center gap-2 text-[#002F6C] hover:text-[#f35b04] transition-colors duration-300 text-sm font-medium"
        >
          <FiArrowLeft className="text-base" />
          Volver al Panel
        </button>
      </div>

      {/* Tarjeta completa */}
      <div
        className={`w-full ${anchoCard} bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-transform duration-300 hover:scale-[1.01]`}
      >
        {/* Imagen lateral */}
        <div className={`${clasesImagen} w-full`}>
          <img
            src={imagen}
            alt="Módulo"
            className="w-full h-full object-cover md:rounded-l-3xl rounded-t-3xl md:rounded-t-none"
          />
        </div>

        {/* Botones */}
        <div className={`${clasesFormulario} w-full flex items-center justify-center p-6`}>
          <div className="w-full bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className={`grid gap-4 ${columnas}`}>
              {acciones.map(({ texto, onClick, ruta }, idx) => (
                <BotonPrincipal
                  key={idx}
                  onClick={onClick || (() => ruta && window.location.assign(ruta))}
                >
                  {texto}
                </BotonPrincipal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
