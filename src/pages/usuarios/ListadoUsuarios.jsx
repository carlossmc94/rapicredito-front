import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TablaGenerica from "../../components/ui/TablaGenerica";
import Navbar from "../../components/Navbar";
import ModalBase from "../../components/ui/ModalBase";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../../config/apiConfig";
import ModalVerUsuario from "../../components/modales/ModalVerUsuario";

export default function ListadoUsuarios() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState(true);

  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [usuarioDetalle, setUsuarioDetalle] = useState(null);

  useEffect(() => {
    const idNuevo = location.state?.idNuevoUsuario;
    if (idNuevo && auth?.token) {
      const fetchDetalleNuevo = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/rapicredito/usuarios/${idNuevo}`,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
          const detalle = response.data?.data;
          setUsuarioDetalle(detalle);
          setMostrarModalVer(true);

          // Limpiar el location.state para que no se repita
          window.history.replaceState({}, document.title);
        } catch (error) {
          toast.error("❌ No se pudo cargar el detalle del nuevo usuario");
          console.error(error);
        }
      };

      fetchDetalleNuevo();
    }
  }, [location, auth]);

  // 🔒 Validación de rol
  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    }
  }, [auth, navigate]);

  // 🌐 Obtener usuarios desde la API
  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!auth?.token) {
        console.warn("⚠️ Token no disponible todavía");
        return;
      }

      const url = `${API_BASE_URL}/rapicredito/usuarios/todos`;
      console.log("🌐 Consultando usuarios en:", url);
      console.log("🔐 Token enviado:", auth.token);

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        console.log("📦 Respuesta de API:", response.data);

        const datos = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        const mapeados = datos.map((u) => ({
          id: u.id,
          nombreUsuario: u.nombreUsuario || "",
          nombreCompleto: `${u.detalleUsuario?.nombre || ""} ${
            u.detalleUsuario?.apellidoPaterno || ""
          } ${u.detalleUsuario?.apellidoMaterno || ""}`.trim(),
          rol: u.rol?.nombreRol || "",
          activo: u.activo ? "Sí" : "No",
          requiereCambio: u.requiereCambioContrasena ? "Sí" : "No",
        }));

        console.log("👥 Usuarios mapeados:", mapeados);
        setUsuarios(mapeados);
      } catch (error) {
        toast.error("❌ Error al obtener usuarios");
        console.error("❌ Error en la petición GET:", error);
      }
    };

    fetchUsuarios();
  }, [auth]);

  // 🔁 Confirmar actualización de estado
  const actualizarEstadoUsuario = async () => {
    if (!auth?.token) return;

    const url = `${API_BASE_URL}/rapicredito/usuarios/actualizar/${usuarioSeleccionado.id}`;
    console.log("📝 PUT:", url, "| Estado:", nuevoEstado);

    try {
      await axios.put(
        url,
        { activo: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioSeleccionado.id
            ? { ...u, activo: nuevoEstado ? "Sí" : "No" }
            : u
        )
      );

      toast.success("✅ Estatus del usuario actualizado correctamente");
      setMostrarModal(false);
      setUsuarioSeleccionado(null);
    } catch (error) {
      toast.error("❌ Error al actualizar el estado del usuario");
      console.error("❌ Error en la petición PUT:", error);
    }
  };

  // 🧾 Columnas de la tabla
  const columnas = [
    { campo: "id", titulo: "ID" },
    { campo: "nombreUsuario", titulo: "Nombre de Usuario" },
    { campo: "nombreCompleto", titulo: "Nombre Completo" },
    { campo: "rol", titulo: "Rol" },
    { campo: "activo", titulo: "¿Activo?" },
    { campo: "requiereCambio", titulo: "¿Requiere Cambio?" },
  ];

  // ⚙️ Acciones por fila
  const acciones = {
    ver: async (usuario) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/rapicredito/usuarios/${usuario.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        const detalle = response.data?.data;
        setUsuarioDetalle(detalle);
        setMostrarModalVer(true);
      } catch (error) {
        toast.error("❌ Error al obtener detalle del usuario");
        console.error(error);
      }
    },
    editar: (usuario) => {
      setUsuarioSeleccionado(usuario);
      setNuevoEstado(usuario.activo === "Sí");
      setMostrarModal(true);
    },
    eliminar: null,
  };

  // 🔍 Filtro general
  const filtroFuncion = (fila, texto) => {
    const t = texto.toLowerCase();
    return (
      fila.nombreUsuario?.toLowerCase().includes(t) ||
      fila.nombreCompleto?.toLowerCase().includes(t) ||
      fila.rol?.toLowerCase().includes(t)
    );
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#e9f1fa] min-h-screen p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-white shadow-xl rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#002F6C]">
              Listado de Usuarios
            </h1>
            <button
              onClick={() => navigate("/usuarios")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#002F6C] hover:underline"
            >
              ← Panel usuarios
            </button>
          </div>

          <TablaGenerica
            columnas={columnas}
            datos={usuarios}
            acciones={acciones}
            filtroFuncion={filtroFuncion}
          />
        </div>
      </main>

      {/* 🟨 Modal para activar/inactivar */}
      <ModalBase
        mostrar={mostrarModal}
        titulo={`Actualizar estado de "${usuarioSeleccionado?.nombreUsuario}"`}
        onCerrar={() => setMostrarModal(false)}
        onConfirmar={actualizarEstadoUsuario}
        textoBotonConfirmar="Guardar"
      >
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700">
            Estado del usuario:
          </label>
          <select
            value={nuevoEstado ? "activo" : "inactivo"}
            onChange={(e) => setNuevoEstado(e.target.value === "activo")}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </ModalBase>
      <ModalVerUsuario
        mostrar={mostrarModalVer}
        onCerrar={() => setMostrarModalVer(false)}
        usuario={usuarioDetalle}
      />
    </>
  );
}
