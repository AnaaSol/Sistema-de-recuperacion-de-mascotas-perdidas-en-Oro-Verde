import React, { useState } from "react";
import { geoService } from "../services/api";

export default function GeoPage() {
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [resultado, setResultado] = useState(null);

  const consultarUbicacion = async () => {
    try {
      const data = await geoService.consultarUbicacion(latitud, longitud);
      setResultado(data);
    } catch (error) {
      console.error("Error al consultar ubicación:", error);
      alert("No se pudo consultar la ubicación.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>UC23 - Consultar Ubicación</h2>
      <label>Latitud:</label>
      <input
        type="text"
        value={latitud}
        onChange={(e) => setLatitud(e.target.value)}
      />
      <br />
      <label>Longitud:</label>
      <input
        type="text"
        value={longitud}
        onChange={(e) => setLongitud(e.target.value)}
      />
      <br />
      <button onClick={consultarUbicacion}>Consultar</button>

      {resultado && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Resultado:</h3>
          <pre>{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
