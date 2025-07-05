import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import ModuloCard from "../../components/ModuloCard";
import inventarioImg from "../../assets/images/inventariosPanel.png";

export default function Inventario() {
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
          Gestión de Inventario
        </h1>

        <ModuloCard
          imagen={inventarioImg}
          acciones={[
            {
              texto: "Registrar variación producto",
              onClick: () => navigate("/inventario/variacionproducto"),
            },
            {
              texto: "Ver inventario",
              onClick: () => navigate("/inventario/stockinventario"),
            },
          ]}
        />
      </div>
    </>
  );
}
