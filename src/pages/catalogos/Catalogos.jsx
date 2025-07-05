import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import ModuloCard from "../../components/ModuloCard";
import catalogosImg from "../../assets/images/catalogosPanel.png";

export default function Catalogos() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.rolId !== 1) {
      navigate("/unauthorized");
    }
  }, [auth, navigate]);

  const catalogos = [
    { texto: "Batería", path: "/catalogos/bateria" },
    { texto: "Cámara", path: "/catalogos/camara" },
    { texto: "Capacidad de Almacenamiento", path: "/catalogos/capacidadalmacenamiento" },
    { texto: "Categoría de Producto", path: "/catalogos/categoriaproducto" },
    { texto: "Color", path: "/catalogos/color" },
    { texto: "Dimensiones", path: "/catalogos/dimensiones" },
    { texto: "Marca", path: "/catalogos/marca" },
    { texto: "Modelo", path: "/catalogos/modelo" },
    { texto: "Proveedor", path: "/catalogos/proveedor" },
    { texto: "RAM", path: "/catalogos/ram" },
    { texto: "Sistema Operativo", path: "/catalogos/sistemaoperativo" },
    { texto: "Producto", path: "/catalogos/producto" },

  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#e9f1fa] flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-3xl font-bold text-[#002F6C] mb-8">
          Gestión de Catálogos
        </h1>

        <ModuloCard
          imagen={catalogosImg}
          acciones={catalogos.map((cat) => ({
            texto: `${cat.texto}`,
            onClick: () => navigate(cat.path),
          }))}
        />
      </div>
    </>
  );
}
