import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import ModuloCard from "../../components/ModuloCard";
import usuariosImg from "../../assets/images/usuariosPanel.png";

export default function Usuarios() {
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
      <div className="min-h-screen bg-[#e9f1fa] flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-3xl font-bold text-[#002F6C] mb-8">
          Gestión de Usuarios
        </h1>

        <ModuloCard
          titulo="Usuarios"
          imagen={usuariosImg}
          acciones={[
            { texto: "Crear usuario", onClick: () => navigate("/usuarios/crearusuario") },
            { texto: "Consultar usuarios", onClick: () => navigate("/usuarios/listadousuarios") },
          ]}
        />
      </div>
    </>
  );
}
