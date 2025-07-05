import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import ModuloCard from "../../components/ModuloCard";
import reportesImg from "../../assets/images/reportesPanel.png";

export default function Reportes() {
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
          Gestión de Reportes
        </h1>

        <ModuloCard
          imagen={reportesImg}
          acciones={[
            {
              texto: "Reportes de pedidos",
              onClick: () => navigate("/reportes/pedidos"),
            },
            {
              texto: "Reportes de pagos",
              onClick: () => navigate("/reportes/pagos"),
            },
          ]}
        />
      </div>
    </>
  );
}
