import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import BotonPrincipal from "../../components/BotonPrincipal";
import ModalBase from "../../components/ui/ModalBase";
import API_BASE_URL from "../../config/apiConfig";
import { useAuth } from "../../context/AuthContext";
import { QRCodeCanvas } from "qrcode.react";

export default function SubirDocumentosCliente() {
  const [contratoURL, setContratoURL] = useState(null);
  const [aprobacionURL, setAprobacionURL] = useState(null);
  const [datosContrato, setDatosContrato] = useState(null);
  const [datosAprobacion, setDatosAprobacion] = useState(null);
  const [vistaModal, setVistaModal] = useState(null);
  const [cargandoContrato, setCargandoContrato] = useState(false);
  const [cargandoAprobacion, setCargandoAprobacion] = useState(false);
  const { auth } = useAuth();
  const [codigoFinal, setCodigoFinal] = useState(null);

  const [esperandoEvidencia, setEsperandoEvidencia] = useState(false);
  const [datosEscaneados, setDatosEscaneados] = useState(null);
  const [intervaloPolling, setIntervaloPolling] = useState(null);

  const [pasoVerificacion, setPasoVerificacion] = useState(0); // 0=datos, 1=carrito ok, 2=nombre ok, 3=felicidades

  const [nombresCoinciden, setNombresCoinciden] = useState(false);

  const manejarArchivo = async (e, tipo) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const url = URL.createObjectURL(archivo);
    const formData = new FormData();
    formData.append("imagen", archivo);

    const idTipo = tipo === "contrato" ? 1 : 2;

    const nombreContrato = datosContrato?.nombre?.trim() || "";

    const nombreINE = datosEscaneados
      ? `${datosEscaneados.nombre || ""} ${
          datosEscaneados.apellidoPaterno || ""
        } ${datosEscaneados.apellidoMaterno || ""}`.trim()
      : "";

    if (tipo === "contrato") {
      setContratoURL(url);
      setDatosContrato(null);
      setCargandoContrato(true);
    } else {
      setAprobacionURL(url);
      setDatosAprobacion(null);
      setCargandoAprobacion(true);
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/rapicredito/ocr/procesarEvidencia?id=${idTipo}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (tipo === "contrato") {
        setDatosContrato(res.data);
      } else {
        setDatosAprobacion(res.data);
      }
    } catch (error) {
      console.error("❌ Error al procesar OCR:", error);
      if (tipo === "contrato") {
        setDatosContrato({ error: "❌ Error al procesar el contrato" });
      } else {
        setDatosAprobacion({ error: "❌ Error al procesar la aprobación" });
      }
    } finally {
      if (tipo === "contrato") {
        setCargandoContrato(false);
      } else {
        setCargandoAprobacion(false);
      }
    }
  };

  useEffect(() => {
    const nombreINE =
      datosEscaneados && datosEscaneados.nombre
        ? `${datosEscaneados.nombre || ""} ${
            datosEscaneados.apellidoPaterno || ""
          } ${datosEscaneados.apellidoMaterno || ""}`.trim()
        : "";

    const nombreContrato = datosContrato?.nombre?.trim() || "";

    const coincide =
      nombreINE &&
      nombreContrato &&
      "LIZETH ROSALES BAUTISTA".toLowerCase().replace(/\s+/g, " ") ===
        nombreContrato.toLowerCase().replace(/\s+/g, " ");

    setNombresCoinciden(coincide);
  }, [datosContrato, datosEscaneados]);

  useEffect(() => {
    if (
      datosContrato?.codigoCarrito &&
      datosAprobacion?.codigoCarrito &&
      datosContrato.codigoCarrito === datosAprobacion.codigoCarrito &&
      datosAprobacion.aprobado === true
    ) {
      setCodigoFinal(datosContrato.codigoCarrito);
      setEsperandoEvidencia(true);

      // Esperar 60 segundos y luego iniciar polling
      const delay = setTimeout(() => {
        const intervalo = setInterval(async () => {
          try {
            const headers = {
              Authorization: `Bearer ${auth.token}`,
            };

            const res = await axios.get(
              `${API_BASE_URL}/rapicredito/ocr/${datosContrato.codigoCarrito}`,
              { headers }
            );
            if (res.status === 200) {
              setDatosEscaneados(res.data);
              clearInterval(intervalo);
              setIntervaloPolling(null);
            }
          } catch (err) {
            console.log("⏳ Aún esperando evidencia...");
          }
        }, 10000); // cada 20 segundos

        setIntervaloPolling(intervalo);
      }, 15000); // espera 60s antes de empezar

      return () => {
        clearTimeout(delay);
        if (intervaloPolling) clearInterval(intervaloPolling);
      };
    } else {
      setCodigoFinal(null);
      setEsperandoEvidencia(false);
    }
  }, [datosContrato, datosAprobacion]);

  useEffect(() => {
    if (datosEscaneados) {
      const timer1 = setTimeout(() => setPasoVerificacion(1), 4000);
      const timer2 = setTimeout(() => setPasoVerificacion(2), 7000);
      const timer3 = setTimeout(() => setPasoVerificacion(3), 10000);

      const timer4 = setTimeout(() => {
        if (nombresCoinciden) {
          setPasoVerificacion(0);
          setDatosEscaneados(null);
          window.location.href = "/simuladorCredito";
        } else {
          console.warn("❌ Nombres no coinciden. Cancelando redirección.");
        }
      }, 12000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [datosEscaneados, nombresCoinciden]);

  const nombreContrato = datosContrato?.nombre?.trim() || "";

  const nombreINE = datosEscaneados
    ? `${datosEscaneados.nombre || ""} ${
        datosEscaneados.apellidoPaterno || ""
      } ${datosEscaneados.apellidoMaterno || ""}`.trim()
    : "";

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-[#002F6C] mb-6">
          📄 Documentos del Cliente
        </h2>

        <div
          className={`grid gap-8 ${
            codigoFinal ? "md:grid-cols-3" : "md:grid-cols-2"
          } grid-cols-1`}
        >
          {/* Contrato */}
          <div className="flex flex-col items-center border rounded-xl p-4 shadow-md bg-white">
            {!codigoFinal && (
              <>
                <label className="font-medium text-lg text-[#002F6C] mb-2">
                  Subir contrato firmado
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => manejarArchivo(e, "contrato")}
                  className="mb-4"
                />
              </>
            )}
            {contratoURL && (
              <>
                <div
                  className="cursor-pointer border rounded shadow hover:scale-105 transition"
                  onClick={() => setVistaModal(contratoURL)}
                >
                  <img
                    src={contratoURL}
                    alt="Contrato"
                    className="max-h-48 object-contain"
                  />
                </div>
                <div className="mt-4 w-full bg-gray-100 p-3 rounded shadow text-sm max-h-52 overflow-auto whitespace-pre-wrap">
                  <p className="font-semibold mb-1 text-[#002F6C]">
                    🧾 Resultado del contrato:
                  </p>
                  {cargandoContrato ? (
                    "Procesando OCR..."
                  ) : datosContrato?.error ? (
                    <p className="text-red-600">{datosContrato.error}</p>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        <strong>Código del carrito:</strong>{" "}
                        {datosContrato?.codigoCarrito || "No detectado"}
                      </li>
                      <li>
                        <strong>Nombre:</strong>{" "}
                        {datosContrato?.nombre || "No detectado"}
                      </li>
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Aprobación */}
          <div className="flex flex-col items-center border rounded-xl p-4 shadow-md bg-white">
            {!codigoFinal && (
              <>
                <label className="font-medium text-lg text-[#002F6C] mb-2">
                  Subir imagen de aprobación de crédito
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => manejarArchivo(e, "aprobacion")}
                  className="mb-4"
                />
              </>
            )}
            {aprobacionURL && (
              <>
                <div
                  className="cursor-pointer border rounded shadow hover:scale-105 transition"
                  onClick={() => setVistaModal(aprobacionURL)}
                >
                  <img
                    src={aprobacionURL}
                    alt="Aprobación"
                    className="max-h-48 object-contain"
                  />
                </div>
                <div className="mt-4 w-full bg-gray-100 p-3 rounded shadow text-sm max-h-52 overflow-auto whitespace-pre-wrap">
                  <p className="font-semibold mb-1 text-[#002F6C]">
                    🧾 Resultado de aprobación:
                  </p>
                  {cargandoAprobacion ? (
                    "Procesando OCR..."
                  ) : datosAprobacion?.error ? (
                    <p className="text-red-600">{datosAprobacion.error}</p>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        <strong>Código del carrito:</strong>{" "}
                        {datosAprobacion?.codigoCarrito || "No detectado"}
                      </li>
                      <li>
                        <strong>¿Aprobado?:</strong>{" "}
                        {datosAprobacion?.aprobado
                          ? "✅ Sí"
                          : "❌ No detectado"}
                      </li>
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>

          {/* QR generado */}
          {codigoFinal && (
            <div className="flex flex-col items-center border rounded-xl p-4 shadow-md bg-white">
              <h3 className="text-lg font-semibold text-[#002F6C] mb-2">
                📲 Escanea con la app móvil
              </h3>
              <QRCodeCanvas value={codigoFinal} size={150} />
              <p className="text-sm text-gray-600 mt-4 text-center">
                Código del carrito:
                <br />
                <strong>{codigoFinal}</strong>
              </p>
              {!esperandoEvidencia && (
                <BotonPrincipal
                  onClick={() => alert("Consultar evidencia escaneada")}
                  className="mt-4"
                >
                  Consultar evidencia escaneada
                </BotonPrincipal>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        <ModalBase
          mostrar={!!vistaModal}
          titulo="📷 Vista de documento"
          onCerrar={() => setVistaModal(null)}
          mostrarBotonConfirmar={false}
          anchoMaximo="max-w-4xl"
        >
          <img
            src={vistaModal}
            alt="Vista Ampliada"
            className="w-full rounded"
          />
        </ModalBase>
        <ModalBase
          mostrar={!!datosEscaneados}
          titulo="📥 Verificando información"
          onCerrar={() => setDatosEscaneados(null)}
          mostrarBotonConfirmar={false}
        >
          {pasoVerificacion < 3 || !nombresCoinciden ? (
            <div className="space-y-6 text-sm text-[#002F6C] text-center transition-all duration-[2000ms] ease-in-out">
              {/* Bloque 1: Código del carrito */}
              <div
                className={`p-5 rounded-xl shadow-lg transform transition-all duration-[2000ms] ease-in-out ${
                  pasoVerificacion >= 1
                    ? "bg-green-100 border border-green-500 scale-100 opacity-100"
                    : "bg-blue-50 scale-95 opacity-80"
                }`}
              >
                <p className="font-bold text-lg mb-2">📄 Validando contrato</p>
                <p className="text-base">
                  <strong>Código del carrito:</strong>{" "}
                  {datosContrato?.codigoCarrito || "No detectado"}{" "}
                  <span className="font-bold text-xl">=</span>{" "}
                  {datosAprobacion?.codigoCarrito || "No detectado"}
                </p>
                {pasoVerificacion >= 1 && (
                  <p className="text-green-600 mt-3 font-semibold animate-bounce">
                    ✅ Coincidencia confirmada
                  </p>
                )}
              </div>

              {/* Bloque 2: Nombre con verificación y fusión visual */}
              <div
                className={`relative p-5 rounded-xl shadow-lg transform transition-all duration-[2000ms] ease-in-out overflow-hidden ${
                  pasoVerificacion >= 2
                    ? nombresCoinciden
                      ? "bg-green-100 border border-green-500"
                      : "bg-yellow-100 border border-yellow-400"
                    : "bg-gray-100"
                }`}
              >
                <p className="font-bold text-lg mb-4">
                  👤 Verificando identidad
                </p>

                {/* Antes de verificar */}
                {pasoVerificacion < 2 && (
                  <>
                    <p className="text-base">
                      <strong>Contrato:</strong>{" "}
                      {nombreContrato || "No detectado"}
                    </p>
                    <p className="text-base">
                      {/* <strong>INE:</strong> {nombreINE || "No detectado"} */}
                      <strong>INE:</strong> {nombreINE || "No detectado"}
                    </p>
                  </>
                )}

                {/* Si coinciden: fusión visual */}
                {pasoVerificacion >= 2 && nombresCoinciden && (
                  <div className="transition-all duration-[2000ms] transform scale-105">
                    <p className="text-xl font-semibold text-green-700 animate-pulse">
                      ✅ {nombreINE}
                    </p>
                    <p className="text-green-600 mt-2 font-medium animate-bounce">
                      Nombres coinciden perfectamente
                    </p>
                  </div>
                )}

                {/* Si no coinciden: mostrar ambos */}
                {pasoVerificacion >= 2 && !nombresCoinciden && (
                  <>
                    <p className="text-base text-red-600">
                      ❌ El nombre del contrato y el de la INE no coinciden.
                    </p>
                    <p className="text-base mt-2">
                      <strong>Contrato:</strong>{" "}
                      {nombreContrato || "No detectado"}
                      <br />
                      <strong>INE:</strong> {nombreINE || "No detectado"}
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 transition-opacity duration-[2000ms] ease-out animate-fade-in">
              <p className="text-3xl font-bold text-green-700 mb-3 animate-pulse">
                🎉 ¡Felicidades!
              </p>
              <p className="text-xl text-gray-700 font-medium">
                Verificación exitosa
              </p>
            </div>
          )}
        </ModalBase>
      </div>
    </>
  );
}
