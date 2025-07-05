import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

import usuarioImg from "../assets/images/usuarioPanel.png";
import catalogoImg from "../assets/images/catalogoPanel.png";
import inventarioImg from "../assets/images/inventarioPanel.png";
import pedidoImg from "../assets/images/pedidoPanel.png";
import reporteImg from "../assets/images/reportePanel.png";
import dashboardImg from "../assets/images/dashboardPanel.png";

const panelOpciones = [
  { nombre: "Usuarios", img: usuarioImg, ruta: "/usuarios" },
  { nombre: "Catálogos", img: catalogoImg, ruta: "/catalogos" },
  { nombre: "Inventario", img: inventarioImg, ruta: "/inventario" },
  { nombre: "Pedidos", img: pedidoImg, ruta: "/pedidos" },
  { nombre: "Reportes", img: reporteImg, ruta: "/reportes" },
  { nombre: "Dashboard", img: dashboardImg, ruta: "/dashboard" },
];

export default function PanelAdministrador() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    }
  }, [auth, navigate]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-[#f5f8fc] min-h-screen">
        <h1 className="text-2xl font-semibold text-[#002F6C] mb-6 text-center">
          Panel del Administrador
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {panelOpciones.map((opcion, index) => (
            <motion.div
              key={opcion.nombre}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => navigate(opcion.ruta)}
              className="cursor-pointer bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:translate-y-1 hover:shadow-inner hover:border-[#FFD600] border border-gray-200 p-4 flex flex-col items-center text-center"            >
              <img
                src={opcion.img}
                alt={opcion.nombre}
                className="h-32 object-contain mb-4"
              />
              <span className="text-[#002F6C] font-semibold text-lg">
                {opcion.nombre}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
