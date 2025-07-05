import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CambiarContrasena from "./pages/CambiarContrasena";
import Dashboard from "./pages/Dashboard";
import PanelAdministrador from "./pages/PanelAdministrador";
import Usuarios from "./pages/usuarios/Usuarios";
import ListadoUsuarios from "./pages/usuarios/ListadoUsuarios";
import CrearUsuario from "./pages/usuarios/CrearUsuario";
import Catalogos from "./pages/catalogos/Catalogos";
import Inventario from "./pages/inventario/Inventario";
import Pedidos from "./pages/pedidos/Pedidos";
import Reportes from "./pages/reportes/Reportes";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Bateria from "./pages/catalogos/Bateria";
import Camara from "./pages/catalogos/Camara";
import CapacidadAlmacenamiento from "./pages/catalogos/CapacidadAlmacenamiento";
import CategoriaProducto from "./pages/catalogos/CategoriaProducto";
import Color from "./pages/catalogos/Color";
import Dimensiones from "./pages/catalogos/Dimensiones";
import Marca from "./pages/catalogos/Marca";
import Modelo from "./pages/catalogos/Modelo";
import Proveedor from "./pages/catalogos/Proveedor";
import Ram from "./pages/catalogos/Ram";
import SistemaOperativo from "./pages/catalogos/SistemaOperativo";
import Producto from "./pages/catalogos/Producto";
import VariacionProducto from "./pages/inventario/VariacionProducto";
import StockInventario from "./pages/inventario/StockInventario";
import HomeProductos from "./pages/HomeProductos";
import VariacionProductoPedido from "./pages/VariacionProductoPedido";
import CrearPedido from "./pages/pedidos/CrearPedido";
import PagoPedido from "./pages/pedidos/PagoPedido";
import ValidacionCliente from "./pages/pedidos/ValidacionCliente";

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/cambiar-contrasena/:usuarioId"
            element={<CambiarContrasena />}
          />

          <Route
            path="/homeproductos"
            element={
              <ProtectedRoute>
                <HomeProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/variacionproductopedido/:id"
            element={
              <ProtectedRoute>
                <VariacionProductoPedido />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paneladministrador"
            element={
              <ProtectedRoute>
                <PanelAdministrador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <Usuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/listadousuarios"
            element={
              <ProtectedRoute>
                <ListadoUsuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/crearusuario"
            element={
              <ProtectedRoute>
                <CrearUsuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos"
            element={
              <ProtectedRoute>
                <Catalogos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/bateria"
            element={
              <ProtectedRoute>
                <Bateria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/camara"
            element={
              <ProtectedRoute>
                <Camara />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/capacidadalmacenamiento"
            element={
              <ProtectedRoute>
                <CapacidadAlmacenamiento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/categoriaproducto"
            element={
              <ProtectedRoute>
                <CategoriaProducto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/color"
            element={
              <ProtectedRoute>
                <Color />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/dimensiones"
            element={
              <ProtectedRoute>
                <Dimensiones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/marca"
            element={
              <ProtectedRoute>
                <Marca />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/modelo"
            element={
              <ProtectedRoute>
                <Modelo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/proveedor"
            element={
              <ProtectedRoute>
                <Proveedor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/ram"
            element={
              <ProtectedRoute>
                <Ram />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/sistemaoperativo"
            element={
              <ProtectedRoute>
                <SistemaOperativo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogos/producto"
            element={
              <ProtectedRoute>
                <Producto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <ProtectedRoute>
                <Inventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario/variacionproducto"
            element={
              <ProtectedRoute>
                <VariacionProducto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario/stockinventario"
            element={
              <ProtectedRoute>
                <StockInventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <Pedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crearpedido"
            element={
              <ProtectedRoute>
                <CrearPedido />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagarpedido"
            element={
              <ProtectedRoute>
                <PagoPedido />
              </ProtectedRoute>
            }
          />
          <Route
            path="/validacioncliente"
            element={
              <ProtectedRoute>
                <ValidacionCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <Reportes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
