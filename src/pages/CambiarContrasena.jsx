import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiLock, FiLogIn } from "react-icons/fi";
import logo from "../assets/logos/logoTransparentev1.png";
import loginBackground from "../assets/images/LoginAguila.jpg";
import { cambiarContrasena } from "../services/authService";

export default function CambiarContrasena() {
  const { usuarioId } = useParams();
  const navigate = useNavigate();

  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const validarContrasena = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarContrasena(nueva)) {
      setError(
        "⚠️ La nueva contraseña debe contener una mayúscula, una minúscula, un número y un signo."
      );
      return;
    }

    setError("");
    try {
      const res = await cambiarContrasena(parseInt(usuarioId), actual, nueva);
      if (res.codigo === 200) {
        setMensaje("✅ Contraseña cambiada. Redirigiendo a Login");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(res.mensaje || "Error inesperado");
      }
    } catch (err) {
      const msg = err.response?.data?.mensaje;

      if (msg === "La contraseña actual no es correcta") {
        setError("⚠️ La contraseña actual que ingresaste no es válida.");
      } else if (
        msg === "La nueva contraseña no cumple con los requisitos mínimos"
      ) {
        setError(
          "⚠️ La nueva contraseña debe contener una mayúscula, una minúscula, un número y un signo."
        );
      } else {
        setError("❌ No se pudo cambiar la contraseña.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dce5f3]">
      <div className="flex flex-col lg:flex-row rounded-[30px] border border-blue-200 shadow-[inset_0_8px_20px_rgba(0,0,0,0.1)] overflow-hidden max-w-6xl w-full bg-white">
        {/* Imagen institucional */}
        <div className="hidden lg:block lg:w-1/2 h-80 lg:h-auto overflow-hidden">
          <img
            src={loginBackground}
            alt="Águila"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Formulario flotante */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-white">
          <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.25)] ring-1 ring-gray-200 transform -translate-y-2">
            <div className="flex justify-center mb-5">
              <img
                src={logo}
                alt="Logo Rapicredito"
                className="h-16 drop-shadow-lg"
              />
            </div>

            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Cambiar contraseña
            </h2>

            <div className="h-12 mb-4">
              {mensaje && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-sm font-medium shadow transition-all duration-300">
                  {mensaje}
                </div>
              )}
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium shadow transition-all duration-300">
                  {error}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={mostrar ? "text" : "password"}
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  placeholder="Contraseña actual"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD600] transition text-sm"
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={mostrar ? "text" : "password"}
                  value={nueva}
                  onChange={(e) => setNueva(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD600] transition text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  id="mostrarContrasena"
                  checked={mostrar}
                  onChange={() => setMostrar(!mostrar)}
                  className="accent-yellow-400"
                />
                <label htmlFor="mostrarContrasena">Mostrar contraseña</label>
              </div>

              <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded mt-1 leading-snug">
                La nueva contraseña debe contener al menos:
                <ul className="list-disc list-inside ml-2">
                  <li>Una letra mayúscula</li>
                  <li>Una letra minúscula</li>
                  <li>Un número</li>
                  <li>Un signo especial (ej. ! @ # $)</li>
                </ul>
              </div>

              <button
                type="submit"
                className="relative group w-full overflow-hidden font-semibold py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-700 text-[#002F6C] bg-[#FFD600] shadow-lg"
              >
                <span className="z-10 flex items-center gap-2 group-hover:text-white transition-all duration-700">
                  <FiLogIn /> Cambiar contraseña
                </span>
                <span className="absolute inset-0 bg-[#002F6C] scale-0 group-hover:scale-100 transition-transform duration-700 origin-center z-0 rounded-md" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
