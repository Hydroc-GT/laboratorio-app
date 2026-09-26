import React, { useState, useEffect } from 'react';
import '../assets/styles/Validador/Dashboard.css';
import {
  getDashboardValidador,
  asignarAnalista,
  aprobarMuestra,
  desaprobarMuestra
} from '../services/muestras';

function ValidadorDashboard() {
  const [data, setData] = useState({
    porAsignar: [],
    analistas: [],
    porAprobar: [],
    historial: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalyst, setSelectedAnalyst] = useState({});
  const [comments, setComments] = useState({}); // Nuevo estado para los comentarios
  const [leidoChecked, setLeidoChecked] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardValidador();
        setData(response.data);
      } catch (err) {
        setError("No se pudieron cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnalystChange = (idMuestra, idAnalista) => {
    setSelectedAnalyst(prev => ({ ...prev, [idMuestra]: idAnalista }));
  };

  // Nuevo manejador para el cambio de comentarios
  const handleCommentsChange = (idMuestra, comment) => {
    setComments(prev => ({ ...prev, [idMuestra]: comment }));
  };

  const handleAsignarClick = async (idMuestra) => {
    setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Asignando..." }));
    try {
      await asignarAnalista({
        idMuestra,
        idAnalista: selectedAnalyst[idMuestra],
        comentarios: comments[idMuestra] || ''
      });
      setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Asignado con éxito" }));
      // Recargar datos o actualizar estado localmente
      const newData = { ...data };
      const muestra = newData.porAsignar.find(m => m.IdMuestra === idMuestra);
      if (muestra) {
        muestra.Estado = 'En análisis';
        newData.porAprobar.push(muestra);
        newData.porAsignar = newData.porAsignar.filter(m => m.IdMuestra !== idMuestra);
      }
      setData(newData);
    } catch (err) {
      setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Error al asignar" }));
      setError(err.message);
    }
  };

  const handleAprobarClick = async (idMuestra) => {
    setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Aprobando..." }));
    try {
      await aprobarMuestra(idMuestra);
      setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Aprobado con éxito" }));
      const newData = { ...data };
      const muestra = newData.porAprobar.find(m => m.IdMuestra === idMuestra);
      if (muestra) {
        muestra.Estado = 'Certificada';
        newData.historial.push(muestra);
        newData.porAprobar = newData.porAprobar.filter(m => m.IdMuestra !== idMuestra);
      }
      setData(newData);
    } catch (err) {
      setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Error al aprobar" }));
      setError(err.message);
    }
  };

  const handleDesaprobarClick = async (idMuestra) => {
    setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Desaprobando..." }));
    try {
      await desaprobarMuestra(idMuestra, comments[idMuestra] || 'Muestra devuelta por el validador');
      setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Desaprobado con éxito" }));
      const newData = { ...data };
      const muestra = newData.porAprobar.find(m => m.IdMuestra === idMuestra);
      if (muestra) {
        muestra.Estado = 'Devuelta';
        newData.historial.push(muestra);
        newData.porAprobar = newData.porAprobar.filter(m => m.IdMuestra !== idMuestra);
      }
      setData(newData);
    } catch (err) {
      setSubmissionStatus(prev => ({ ...prev, [idMuestra]: "Error al desaprobar" }));
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Cargando dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="validador-dashboard-container">
      <div className="card-list">
        <h2>Muestras por Validar</h2>
        {data.porAsignar.length > 0 ? (
          <table className="muestras-grid">
            <thead>
              <tr>
                <th>Código Único</th>
                <th>Tipo de Muestra</th>
                <th>Analista</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.porAsignar.map((muestra) => (
                <tr key={muestra.IdMuestra}>
                  <td>{muestra.CodigoUnico}</td>
                  <td>{muestra.TipoMuestra}</td>
                  <td>
                    <select
                      value={selectedAnalyst[muestra.IdMuestra] || ''}
                      onChange={(e) => handleAnalystChange(muestra.IdMuestra, e.target.value)}
                    >
                      <option value="">Asignar Analista</option>
                      {data.analistas.map((analista) => (
                        <option key={analista.IdUsuario} value={analista.IdUsuario}>
                          {analista.Nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Comentarios (opcional)"
                      value={comments[muestra.IdMuestra] || ''}
                      onChange={(e) => handleCommentsChange(muestra.IdMuestra, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleAsignarClick(muestra.IdMuestra)}
                      disabled={!selectedAnalyst[muestra.IdMuestra]}
                    >
                      Asignar
                    </button>
                    {submissionStatus[muestra.IdMuestra] && (
                      <span style={{ marginLeft: 8, fontSize: 12, color: '#1976d2', fontWeight: 500 }}>
                        {submissionStatus[muestra.IdMuestra]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay muestras pendientes de asignación.</p>
        )}
      </div>

      <div className="card-list">
        <h2>Muestras por Aprobar</h2>
        {data.porAprobar.length > 0 ? (
          <table className="muestras-grid">
            <thead>
              <tr>
                <th>Código Único</th>
                <th>Tipo de Muestra</th>
                <th>Leído</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.porAprobar.map((muestra) => (
                <tr key={muestra.IdMuestra}>
                  <td>{muestra.CodigoUnico}</td>
                  <td>{muestra.TipoMuestra}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={leidoChecked[muestra.IdMuestra] || false}
                      onChange={(e) => setLeidoChecked(prev => ({ ...prev, [muestra.IdMuestra]: e.target.checked }))}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Comentarios para desaprobar"
                      value={comments[muestra.IdMuestra] || ''}
                      onChange={(e) => handleCommentsChange(muestra.IdMuestra, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn-desaprobar"
                      onClick={() => handleDesaprobarClick(muestra.IdMuestra)}
                    >
                      Desaprobar
                    </button>
                    <button
                      onClick={() => handleAprobarClick(muestra.IdMuestra)}
                      disabled={!leidoChecked[muestra.IdMuestra]}
                    >
                      Aprobar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay muestras pendientes de aprobación.</p>
        )}
      </div>

      <div className="card-list">
        <h2>Historial de Trabajos</h2>
        {data.historial.length > 0 ? (
          <ul>
            {data.historial.map((muestra) => (
              <li key={muestra.IdMuestra} className="list-item">
                <div className="historial-info">
                  <span>**Cód. Muestra:** {muestra.CodigoUnico}</span>
                  <span>**Tipo:** {muestra.TipoMuestra}</span>
                  <span>**Estado:** {muestra.Estado}</span>
                  {muestra.FechaEmision && (
                    <span>**Fecha Emisión:** {new Date(muestra.FechaEmision).toLocaleDateString()}</span>
                  )}
                  {muestra.Comentarios && (
                    <p>
                      **Comentarios:** {muestra.Comentarios}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay trabajos en el historial.</p>
        )}
      </div>
    </div>
  );
}

export default ValidadorDashboard;