import React, { useState, useEffect } from "react";
import { registrarMuestra, listarMuestras } from "./services/muestras";

export default function RegistroMuestra() {
  const [form, setForm] = useState({ IdTipoMuestra: 1, CodigoUnico: "", Origen: "", IdSolicitante: 1 });
  const [muestras, setMuestras] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrarMuestra(form);
    const res = await listarMuestras();
    setMuestras(res.data);
  };

  useEffect(() => {
    listarMuestras().then(res => setMuestras(res.data));
  }, []);

  return (
    <div>
      <h2>Registrar Muestra</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Código" value={form.CodigoUnico}
          onChange={(e) => setForm({ ...form, CodigoUnico: e.target.value })} />
        <input placeholder="Origen" value={form.Origen}
          onChange={(e) => setForm({ ...form, Origen: e.target.value })} />
        <button type="submit">Registrar</button>
      </form>

      <h3>Listado de muestras</h3>
      <ul>
        {muestras.map((m) => <li key={m.IdMuestra}>{m.CodigoUnico} - {m.Origen}</li>)}
      </ul>
    </div>
  );
}
