import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Analista/Dashboard.css';
import { useAuth } from '../context/AuthContext';

function AnalistaDashboard() {
  const [muestrasPorAnalizar, setMuestrasPorAnalizar] = useState([]);
  const [historialMuestras, setHistorialMuestras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Obtener el ID del analista del contexto de autenticación
  const idAnalista = usuario?.IdUsuario;

  useEffect(() => {
    const fetchMuestras = async () => {
      if (!idAnalista) {
        setError("No se ha identificado un analista activo.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/analista/muestras/${idAnalista}`);
        setMuestrasPorAnalizar(response.data.porAnalizar);
        setHistorialMuestras(response.data.historial);
      } catch (err) {
        setError("No se pudieron cargar las muestras.");
      } finally {
        setLoading(false);
      }
    };
    fetchMuestras();
  }, [idAnalista]);

  const handleAnalizarClick = (idMuestra) => {
    navigate(`/analista/analisis/${idMuestra}`);
  };

  if (loading) return <div className="loading">Cargando muestras...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="card-list">
        <h2>Muestras por Analizar</h2>
        {muestrasPorAnalizar.length > 0 ? (
          <ul>
            {muestrasPorAnalizar.map((muestra) => (
                <li key={muestra.IdMuestra} className="list-item">
                  <span>{muestra.CodigoUnico} - {muestra.TipoMuestra}</span>
                  {muestra.Comentarios && (
                    <span className="comentario">
                      (Comentario del Validador: {muestra.Comentarios})
                    </span>
                  )}
                  <button onClick={() => handleAnalizarClick(muestra.IdMuestra)}>
                    Analizar
                  </button>
                </li>
            ))}
          </ul>
        ) : (
          <p>No hay muestras pendientes de análisis.</p>
        )}
      </div>

      <div className="card-list">
        <h2>Historial de Muestras</h2>
        {historialMuestras.length > 0 ? (
          <ul>
            {historialMuestras.map((muestra) => (
              <li key={muestra.IdMuestra} className="list-item">
                <span>{muestra.CodigoUnico} - {muestra.TipoMuestra}</span>
                <span className={`estado-badge ${muestra.Estado.toLowerCase()}`}>{muestra.Estado}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay muestras en el historial.</p>
        )}
      </div>
    </div>
  );
}

export default AnalistaDashboard;