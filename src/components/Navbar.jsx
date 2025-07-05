import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BotonPrincipal from "./BotonPrincipal";
import logo from "../assets/logos/logoTransparentev1.png";
import { FiUser } from "react-icons/fi";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-[#002F6C] text-white px-8 py-3 flex items-center justify-between shadow-md font-poppins sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Rapicredito" className="h-10" />
      </div>

      {/* Menú central */}
      <ul className="hidden md:flex gap-6 text-white font-medium tracking-wide">
        {[
          { label: "Home", path: "/homeproductos" },
          { label: "Panel", path: "/paneladministrador" },
          { label: "Usuarios", path: "/usuarios" },
          { label: "Catálogos", path: "/catalogos" },
          { label: "Inventario", path: "/inventario" },
          { label: "Clientes", path: "/clientes" },
          { label: "Pedidos", path: "/pedidos" },
        ].map((item) => (
          <li key={item.label}>
            <a
              href={item.path}
              className="hover:text-[#FFD600] transition-colors duration-300"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {/* Rol como badge */}
        <span className="hidden md:flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm border border-white/20">
          <FiUser className="text-white text-base" />
          {auth?.rol || "Desconocido"}
        </span>

        {/* Botón logout */}
        <BotonPrincipal onClick={handleLogout}>Cerrar sesión</BotonPrincipal>
      </div>
    </nav>
  );
}
