import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import API_BASE_URL from "../../config/apiConfig";
import BotonPrincipal from "../../components/BotonPrincipal";
import axios from "axios";
import toast from "react-hot-toast";

export default function CrearUsuario() {
  const { auth } = useAuth();

  const navigate = useNavigate();

  const [codigoPostal, setCodigoPostal] = useState("");
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [asentamientos, setAsentamientos] = useState([]);
  const [asentamientoSeleccionado, setAsentamientoSeleccionado] = useState("");

  const [calle, setCalle] = useState("");
  const [numeroExterior, setNumeroExterior] = useState("");
  const [numeroInterior, setNumeroInterior] = useState("");

  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [curp, setCurp] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [rol, setRol] = useState("");
  const [claveOCR, setClaveOCR] = useState("");

  // Rol y género definidos localmente
  const roles = [
    { id: 1, nombreRol: "Administrador" },
    { id: 2, nombreRol: "Vendedor" },
  ];

  const generos = [
    { id: 1, nombre: "Masculino", nomenclatura: "M" },
    { id: 2, nombre: "Femenino", nomenclatura: "F" },
  ];

  const buscarCodigoPostal = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${auth.token}`,
      };

      const response = await axios.get(
        `${API_BASE_URL}/rapicredito/codigos-postales/buscar/${codigoPostal}`,
        { headers }
      );

      const resultados = response.data?.data || [];

      if (resultados.length > 0) {
        setAsentamientos(resultados);
        setEstado(resultados[0].estado);
        setMunicipio(resultados[0].municipio);
        setCiudad(resultados[0].ciudad);
        setAsentamientoSeleccionado(resultados[0].id);
      } else {
        setAsentamientos([]);
        setEstado("");
        setMunicipio("");
        setCiudad("");
        setAsentamientoSeleccionado("");
      }
    } catch (error) {
      console.error("❌ Error al buscar el código postal:", error);
    }
  };

  const consultarOCR = async () => {
    if (!claveOCR) return toast.error("Debes ingresar una clave OCR");

    try {
      const headers = { Authorization: `Bearer ${auth.token}` };

      const res = await axios.get(
        `${API_BASE_URL}/rapicredito/ocr/${claveOCR}`,
        { headers }
      );

      const data = res.data;
      if (!data) {
        toast.error("❌ No se encontró información OCR");
        return;
      }

      // ✅ Mapear todos los campos
      setCurp(data.curp || "");
      setNombre(data.nombre || "");
      setApellidoPaterno(data.apellidoPaterno || "");
      setApellidoMaterno(data.apellidoMaterno || "");

      // Fecha de nacimiento: convertir a ISO (yyyy-MM-dd)
      if (data.fechaNacimiento && data.fechaNacimiento.includes("/")) {
        const [dd, mm, yyyy] = data.fechaNacimiento.split("/");
        setFechaNacimiento(
          `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`
        );
      }

      setCodigoPostal(data.codigoPostal || "");
      setCalle(data.calle || "");

      if (data.codigoPostal) await buscarCodigoPostal();

      toast.success("✅ Datos OCR recuperados correctamente");

      // 🧹 Eliminar el registro OCR tras procesarlo
      await axios.delete(`${API_BASE_URL}/rapicredito/ocr/${claveOCR}`, {
        headers,
      });
    } catch (err) {
      console.error("Error al consultar OCR:", err);
      toast.error("❌ Error al obtener datos OCR");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const esClienteDesdePedido = params.get("pedidoCliente") === "1";

    if (esClienteDesdePedido) {
      setRol("3"); // 3 = Cliente
    }
  }, []);

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    }
  }, [auth, navigate]);

  const validarCampos = () => {
    const errores = [];

    const telefonoLimpio = telefono.replace(/\D/g, ""); // elimina todo excepto dígitos

    if (telefonoLimpio.length !== 10) {
      errores.push("El teléfono debe tener exactamente 10 dígitos.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errores.push("El correo electrónico no es válido.");
    }

    if (!curp.match(/^[A-Z0-9]{18}$/i)) {
      errores.push(
        "El CURP debe tener exactamente 18 caracteres alfanuméricos."
      );
    }

    if (
      !nombre ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !fechaNacimiento ||
      !genero ||
      !rol ||
      !calle ||
      !numeroExterior ||
      !asentamientoSeleccionado ||
      !codigoPostal
    ) {
      errores.push("Todos los campos obligatorios deben estar llenos.");
    }

    return { errores, telefonoLimpio };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errores, telefonoLimpio } = validarCampos();
    if (errores.length > 0) {
      toast.error(errores[0]);
      return;
    }

    const nuevoUsuario = {
      rol: { id: parseInt(rol) },
      contacto: {
        telefono: telefonoLimpio,
        email,
      },
      detalleUsuario: {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        fechaNacimiento,
        curp,
        genero: {
          id: parseInt(genero),
        },
      },
      direccion: {
        calle,
        numeroExterior: parseInt(numeroExterior),
        numeroInterior: numeroInterior ? parseInt(numeroInterior) : 0,
        codigoPostal: {
          id: parseInt(asentamientoSeleccionado),
        },
      },
    };

    try {
      const headers = {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `${API_BASE_URL}/rapicredito/usuarios/crear`,
        nuevoUsuario,
        { headers }
      );

      const nuevoId = response.data?.data?.id;

      toast.success("✅ Usuario creado exitosamente");

      // 🧹 Limpiar todos los campos
      setTelefono("");
      setEmail("");
      setNombre("");
      setApellidoPaterno("");
      setApellidoMaterno("");
      setFechaNacimiento("");
      setCurp("");
      setGenero("");
      setRol("");
      setCalle("");
      setNumeroExterior("");
      setNumeroInterior("");
      setCodigoPostal("");
      setEstado("");
      setMunicipio("");
      setCiudad("");
      setAsentamientoSeleccionado("");
      setAsentamientos([]);

      // Opcional: Redirigir
      if (ocultarRol && idVariacion && metodoPago) {
        navigate(
          `/crearpedido?clienteId=${nuevoId}&idVariacion=${idVariacion}&metodoPago=${metodoPago}&precio=${precio}`
        );
      } else {
        navigate("/usuarios/listadousuarios", {
          state: { idNuevoUsuario: nuevoId },
        });
      }
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      toast.error("❌ Error al crear el usuario");
    }
  };

  const params = new URLSearchParams(window.location.search);
  const ocultarRol = params.get("pedidoCliente") === "1";

  const idVariacion = params.get("idVariacion");
  const metodoPago = params.get("metodoPago");
  const precio = params.get("precio");

  return (
    <>
      <Navbar />
      <main className="bg-[#f4f4f9] min-h-screen py-10 px-4 flex justify-center">
        <div className="w-full max-w-6xl bg-white p-8 rounded-2xl shadow-xl">
          {/* Título y botón volver */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#002F6C]">Crear Usuario</h1>
            <button
              onClick={() => navigate("/usuarios")}
              className="text-sm font-semibold text-[#002F6C] hover:underline"
            >
              ← Volver al panel
            </button>
          </div>
          <div className="mb-6">
            <label className="font-semibold text-[#153474] mb-1 block">
              Clave OCR
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={claveOCR}
                onChange={(e) => setClaveOCR(e.target.value)}
                placeholder="Ingresa la clave, ej. 95EZ"
                className="border-2 border-[#153474] rounded-lg p-2 w-full"
              />
              <button
                type="button"
                onClick={consultarOCR}
                className="bg-[#153474] text-white px-4 py-2 rounded-lg hover:bg-[#FFD600] hover:text-[#002F6C] transition"
              >
                Obtener datos OCR
              </button>
            </div>
          </div>

          {/* FORMULARIO */}
          <form className="space-y-10" onSubmit={handleSubmit}>
            {/* Rol */}
            {/* Rol (oculto si viene desde pedidoCliente=1) */}
            {!ocultarRol && (
              <section className="bg-[#f9fafb] rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#153474] border-b pb-2 mb-4 border-[#FFD600]">
                  Rol
                </h2>
                <div className="form-group w-full">
                  <label className="font-semibold text-[#153474] mb-1">
                    Selecciona el Rol
                  </label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full border-2 border-[#153474] rounded-lg p-2"
                  >
                    <option value="">Selecciona un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombreRol}
                      </option>
                    ))}
                  </select>
                </div>
              </section>
            )}

            {/* Contacto */}
            <section className="bg-[#f9fafb] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#153474] border-b pb-2 mb-4 border-[#FFD600]">
                Contacto
              </h2>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
              </div>
            </section>

            {/* Datos Personales */}
            <section className="bg-[#f9fafb] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#153474] border-b pb-2 mb-4 border-[#FFD600]">
                Datos Personales
              </h2>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    value={apellidoPaterno}
                    onChange={(e) => setApellidoPaterno(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    value={apellidoMaterno}
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>

                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    CURP
                  </label>
                  <input
                    type="text"
                    value={curp}
                    onChange={(e) => setCurp(e.target.value.toUpperCase())}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Género
                  </label>
                  <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  >
                    <option value="">Selecciona un género</option>
                    {generos.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Dirección */}
            <section className="bg-[#f9fafb] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#153474] border-b pb-2 mb-4 border-[#FFD600]">
                Dirección
              </h2>

              {/* Código Postal + Botón */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="font-semibold text-[#153474] mb-1 block">
                    Código Postal
                  </label>
                  <input
                    type="number"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2 w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={buscarCodigoPostal}
                  className="bg-[#153474] text-white px-4 py-2 rounded-lg mt-6 hover:bg-[#FFD600] hover:text-[#002F6C] transition"
                >
                  Buscar
                </button>
              </div>

              {/* Info geográfica */}
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={estado}
                    readOnly
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Municipio
                  </label>
                  <input
                    type="text"
                    value={municipio}
                    readOnly
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={ciudad}
                    readOnly
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>

                {/* Asentamiento */}
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Asentamiento
                  </label>
                  <select
                    value={asentamientoSeleccionado}
                    onChange={(e) =>
                      setAsentamientoSeleccionado(e.target.value)
                    }
                    className="border-2 border-[#153474] rounded-lg p-2"
                  >
                    <option value="">Seleccione un asentamiento</option>
                    {asentamientos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.asentamiento}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calle y números */}
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Calle
                  </label>
                  <input
                    type="text"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Número Exterior
                  </label>
                  <input
                    type="number"
                    value={numeroExterior}
                    onChange={(e) => setNumeroExterior(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[32%]">
                  <label className="font-semibold text-[#153474] mb-1">
                    Número Interior
                  </label>
                  <input
                    type="number"
                    value={numeroInterior}
                    onChange={(e) => setNumeroInterior(e.target.value)}
                    className="border-2 border-[#153474] rounded-lg p-2"
                  />
                </div>
              </div>
            </section>

            {/* Botón Guardar */}
            <BotonPrincipal type="submit">
              {ocultarRol ? "Registrar Cliente" : "Crear Usuario"}
            </BotonPrincipal>
          </form>
        </div>
      </main>
    </>
  );
}
