import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginAPI } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiLock, FiLogIn } from "react-icons/fi";
import logo from "../assets/logos/logoTransparentev1.png";
import loginBackground from "../assets/images/LoginAguila.jpg";
import BotonPrincipal from "../components/BotonPrincipal";
import API_BASE_URL from "../config/apiConfig";

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mostrarModalAlmacen, setMostrarModalAlmacen] = useState(false);
  const [almacenes, setAlmacenes] = useState([]);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState("");
  const [claveAlmacen, setClaveAlmacen] = useState("");
  const [errorAlmacen, setErrorAlmacen] = useState("");
  const [tokenTemporal, setTokenTemporal] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    if (auth) {
      sessionStorage.clear();
      navigate("/login", { replace: true });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginAPI(nombreUsuario, contrasena);
      if (res.codigo === 200) {
        const { usuario, token } = res.data;
        login({
          usuarioId: usuario.id,
          rolId: usuario.rol.id,
          rol: usuario.rol.nombreRol,
          token,
        });

        if (usuario.rol.id === 1 || usuario.rol.id === 2) {
          setTokenTemporal(token); // Guardamos el token temporal
          await obtenerAlmacenes(token);
          setMostrarModalAlmacen(true);
        } else {
          navigate("/home");
        }
      } else {
        setError(res.mensaje || "Error inesperado");
      }
    } catch (err) {
      if (
        err.response?.data?.codigo === 403 &&
        err.response?.data?.data?.tipo === "CAMBIO_CONTRASENA_REQUERIDO"
      ) {
        const usuarioId = err.response.data.data.usuarioId;
        let countdown = 5;

        setError(
          `Debes cambiar tu contraseña para continuar. Redireccionando en ${countdown}`
        );

        const interval = setInterval(() => {
          countdown -= 1;
          setError(
            `Debes cambiar tu contraseña para continuar. Redireccionando en ${countdown}`
          );
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
          navigate(`/cambiar-contrasena/${usuarioId}`);
        }, 5000);
      } else {
        if (err.response?.status === 401) {
          setError("Usuario o contraseña incorrectos");
        } else {
          setError("Error de conexión con el servidor");
        }
      }
    }
  };

  const obtenerAlmacenes = async (token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/rapicredito/almacenes/todos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await response.json();
      if (json.codigo === 200) {
        setAlmacenes(json.data);
      } else {
        setErrorAlmacen("Error al cargar almacenes.");
      }
    } catch (err) {
      setErrorAlmacen("No se pudieron cargar los almacenes.");
    }
  };

  const validarClaveAlmacen = async () => {
    setErrorAlmacen("");

    if (!almacenSeleccionado || !claveAlmacen) {
      setErrorAlmacen("Debes seleccionar un almacén y escribir la clave.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/rapicredito/almacenes/validar-clave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenTemporal}`,
          },
          body: JSON.stringify({
            almacenId: parseInt(almacenSeleccionado),
            clave: claveAlmacen,
          }),
        }
      );

      const json = await res.json();
      if (json.codigo === 200 && json.data === true) {
        sessionStorage.setItem("almacenId", almacenSeleccionado);
        navigate("/paneladministrador");
      } else {
        setErrorAlmacen("Clave incorrecta.");
      }
    } catch (err) {
      setErrorAlmacen("Error al validar la clave del almacén.");
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

        {/* Formulario blanco flotante con sombra marcada */}
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
              Iniciar sesión en tu cuenta
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm font-medium shadow">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  placeholder="Usuario"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD600] transition text-sm"
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD600] transition text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  id="mostrarContrasena"
                  checked={mostrarContrasena}
                  onChange={() => setMostrarContrasena(!mostrarContrasena)}
                  className="accent-yellow-400"
                />
                <label htmlFor="mostrarContrasena">Mostrar contraseña</label>
              </div>

              <div className="w-full">
                <BotonPrincipal type="submit">
                  <FiLogIn /> Entrar
                </BotonPrincipal>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Modal de selección de almacén */}
      {mostrarModalAlmacen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="Logo Rapicredito"
                className="h-14 drop-shadow"
              />
            </div>

            <h2 className="text-lg font-semibold mb-4 text-center">
              Inicio de sesión en tienda
            </h2>

            {errorAlmacen && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm font-medium shadow">
                {errorAlmacen}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Selecciona el almacén
              </label>
              <select
                value={almacenSeleccionado}
                onChange={(e) => setAlmacenSeleccionado(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">-- Selecciona --</option>
                {almacenes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Clave del almacén</label>
              <input
                type="password"
                value={claveAlmacen}
                onChange={(e) => setClaveAlmacen(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <BotonPrincipal onClick={validarClaveAlmacen}>
              <FiLogIn /> Entrar al panel
            </BotonPrincipal>
          </div>
        </div>
      )}
    </div>
  );
}
