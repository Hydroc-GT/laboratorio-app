import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/styles/Analista/AnalisisForm.css';
import { getParametrosPorMuestra, enviarResultados } from '../services/muestras';

function AnalisisForm() {
  const { idMuestra } = useParams();
  const navigate = useNavigate();
  const [parametros, setParametros] = useState([]);
  const [valores, setValores] = useState({});
  const [aptoConsumo, setAptoConsumo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [paramErrors, setParamErrors] = useState({});

  useEffect(() => {
    const fetchParametros = async () => {
      try {
        const response = await getParametrosPorMuestra(idMuestra);
        const fetchedParametros = response.data;
        setParametros(fetchedParametros);

        const initialValores = fetchedParametros.reduce((acc, param) => {
          acc[param.IdParametroNorma] = {
            valorObtenido: '',
            cumple: false,
            nombreParametro: param.NombreParametro // Para usar en el backend
          };
          return acc;
        }, {});
        setValores(initialValores);
      } catch (err) {
        console.error('Error fetching parameters:', err);
        setError("No se pudieron cargar los parámetros de la muestra: " + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };
    fetchParametros();
  }, [idMuestra]);

  const handleInputChange = (id, field, value) => {
    if (field === 'valorObtenido') {
      const param = parametros.find(p => p.IdParametroNorma === id);
      let errorMsg = '';
      let autoCumple = false;

      if (value !== '' && !isNaN(Number(value))) {
        const numValor = Number(value);
        const minVal = param?.ValorMinimo !== undefined ? param?.ValorMinimo : param?.ValorMin;
        const maxVal = param?.ValorMaximo !== undefined ? param?.ValorMaximo : param?.ValorMax;

        let withinRange = true;
        if (typeof minVal === 'number' && numValor < minVal) {
          errorMsg = `No puede ser menor que ${minVal}.`;
          withinRange = false;
        }
        if (typeof maxVal === 'number' && numValor > maxVal) {
          errorMsg = `No puede ser mayor que ${maxVal}.`;
          withinRange = false;
        }

        autoCumple = withinRange;
      } else if (value !== '') {
        errorMsg = `Debe ingresar un valor numérico.`;
      }

      setValores(prevValores => ({
        ...prevValores,
        [id]: {
          ...prevValores[id],
          valorObtenido: value,
          cumple: autoCumple
        }
      }));

      setParamErrors(prev => ({ ...prev, [id]: errorMsg }));
    } else {
      setValores(prevValores => ({
        ...prevValores,
        [id]: {
          ...prevValores[id],
          [field]: value
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("Enviando...");

    // Validación: todos los campos deben estar completos, ser números válidos y estar dentro del rango min/max
    const errores = [];
    Object.keys(valores).forEach(key => {
      const valor = valores[key].valorObtenido;
      const param = parametros.find(p => p.IdParametroNorma === parseInt(key));
      if (valor === '' || isNaN(Number(valor))) {
        errores.push(`El parámetro "${valores[key].nombreParametro}" debe tener un valor numérico.`);
      } else {
        const numValor = Number(valor);
        const minVal = param.ValorMinimo !== undefined ? param.ValorMinimo : param.ValorMin;
        const maxVal = param.ValorMaximo !== undefined ? param.ValorMaximo : param.ValorMax;
        if (typeof minVal === 'number' && numValor < minVal) {
          errores.push(`El parámetro "${valores[key].nombreParametro}" no puede ser menor que ${minVal}.`);
        }
        if (typeof maxVal === 'number' && numValor > maxVal) {
          errores.push(`El parámetro "${valores[key].nombreParametro}" no puede ser mayor que ${maxVal}.`);
        }
      }
    });
    if (errores.length > 0) {
      setSubmissionStatus("Corrige los errores antes de enviar.");
      setError(errores.join(' '));
      return;
    }

    const resultadosParaEnviar = Object.keys(valores).map(key => ({
      idParametroNorma: parseInt(key),
      valorObtenido: Number(valores[key].valorObtenido),
      cumple: valores[key].cumple,
      nombreParametro: valores[key].nombreParametro // Incluir el nombre
    }));

    try {
      await enviarResultados({
        idMuestra: parseInt(idMuestra),
        resultados: resultadosParaEnviar,
        aptoConsumo
      });
      setSubmissionStatus("Resultados enviados y certificado generado con éxito.");
      setTimeout(() => navigate('/analista'), 2000); // Redirige al dashboard
    } catch (err) {
      setSubmissionStatus("Error al enviar los resultados.");
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Cargando formulario...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="analisis-form-container">
      <h2>Análisis de Muestra: {idMuestra}</h2>
      <form onSubmit={handleSubmit}>
        <h3>Parámetros</h3>
        <ul className="parametros-list">
          {parametros.map(param => (
            <li key={param.IdParametroNorma} className="param-item">
              <label>
                {param.NombreParametro} ({param.Unidad})
                {typeof (param.ValorMinimo !== undefined ? param.ValorMinimo : param.ValorMin) === 'number' &&
                  <span style={{ marginLeft: '10px', color: '#888' }}>
                    Mín: {param.ValorMinimo !== undefined ? param.ValorMinimo : param.ValorMin}
                  </span>
                }
                {typeof (param.ValorMaximo !== undefined ? param.ValorMaximo : param.ValorMax) === 'number' &&
                  <span style={{ marginLeft: '10px', color: '#888' }}>
                    Máx: {param.ValorMaximo !== undefined ? param.ValorMaximo : param.ValorMax}
                  </span>
                }
              </label>
              <input
                type="text"
                value={valores[param.IdParametroNorma]?.valorObtenido || ''}
                onChange={(e) => handleInputChange(param.IdParametroNorma, 'valorObtenido', e.target.value)}
                placeholder="Valor obtenido"
              />
              {paramErrors[param.IdParametroNorma] &&
                <div className="param-error" style={{ color: 'red', fontSize: '0.9em', marginTop: '2px' }}>
                  {paramErrors[param.IdParametroNorma]}
                </div>
              }
              <span className="cumple-norma-row">
                <span style={{ marginRight: '0.5rem' }}>Cumple Norma</span>
                <input
                  type="checkbox"
                  checked={valores[param.IdParametroNorma]?.cumple || false}
                  onChange={(e) => handleInputChange(param.IdParametroNorma, 'cumple', e.target.checked)}
                  className="cumple-norma-checkbox"
                  disabled={!!paramErrors[param.IdParametroNorma]}
                />
              </span>
            </li>
          ))}
        </ul>

        <div className="aptitud-section">
          <label>
            <input
              type="checkbox"
              checked={aptoConsumo}
              onChange={(e) => setAptoConsumo(e.target.checked)}
            />
            Apto para el consumo
          </label>
        </div>

        <button type="submit" disabled={submissionStatus === "Enviando..."}>
          Enviar
        </button>

        {submissionStatus && <p className="submission-status">{submissionStatus}</p>}
      </form>
    </div>
  );
}

export default AnalisisForm;