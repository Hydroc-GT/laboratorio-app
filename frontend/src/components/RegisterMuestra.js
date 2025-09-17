// Estado para filtro independiente de solicitante en "Mis Muestras"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const RegisterMuestra = () => {
    // Estado para filtro independiente de solicitante en "Mis Muestras"
    const [filtroSolicitante, setFiltroSolicitante] = useState('');

    const [form, setForm] = useState({
        tipo: '',
        origen: '',
        condiciones: '',
        solicitanteId: ''
    });
    const [codigoUnico, setCodigoUnico] = useState('');
    const [solicitantes, setSolicitantes] = useState([]);
    const [nuevoSolicitante, setNuevoSolicitante] = useState(false);
    const [solicitanteData, setSolicitanteData] = useState({
        Nombre: '',
        TipoSolicitante: '',
        DocumentoIdentidad: '',
        Direccion: '',
        Telefono: '',
        Correo: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [agregandoSolicitante, setAgregandoSolicitante] = useState(false);
    const [tab, setTab] = useState('registro');
    const [muestras, setMuestras] = useState([]);
    
    useEffect(() => {
        let url = 'http://localhost:3001/api/muestras';
        if (filtroSolicitante) {
            url += `?solicitanteId=${filtroSolicitante}`;
        }
        axios.get(url)
            .then(res => setMuestras(res.data))
            .catch(() => setMuestras([]));
    }, [filtroSolicitante, success]);

    // Cargar responsables técnicos y solicitantes al montar el componente
    // Autocompletar el código único al seleccionar tipo
    useEffect(() => {
        if (!form.tipo) {
            setCodigoUnico('');
            return;
        }
        let idTipo = 0, prefijo = '';
        if (form.tipo === 'Agua') { idTipo = 1; prefijo = 'AGU-'; }
        else if (form.tipo === 'Alimento') { idTipo = 2; prefijo = 'ALI-'; }
        else if (form.tipo === 'Bebida Alcohólica') { idTipo = 3; prefijo = 'ALC-'; }
        if (idTipo) {
            axios.get(`http://localhost:3001/api/muestras/siguiente-numero?idTipoMuestra=${idTipo}`)
                .then(res => {
                    setCodigoUnico(prefijo + res.data.siguienteNumero);
                })
                .catch(() => {
                    setCodigoUnico(prefijo + '1');
                });
        }
    }, [form.tipo]);
    useEffect(() => {
    // Generar código único automáticamente cuando cambia el tipo

        
        axios.get('http://localhost:3001/api/solicitantes/listar')
            .then(res => {
                setSolicitantes(res.data);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    };

    const handleSolicitanteChange = (e) => {
        setSolicitanteData({ ...solicitanteData, [e.target.name]: e.target.value });
    };

    const handleNuevoSolicitante = () => {
        setNuevoSolicitante(true);
        setForm({ ...form, solicitanteId: '' });
    };

    const handleSolicitanteSelect = (e) => {
        setForm({ ...form, solicitanteId: e.target.value });
        setNuevoSolicitante(false);
    };

    const handleAgregarSolicitante = async () => {
        setError('');
        setSuccess('');
        setAgregandoSolicitante(true);

        // Validar campos obligatorios
        if (
            !solicitanteData.Nombre ||
            !solicitanteData.TipoSolicitante ||
            !solicitanteData.DocumentoIdentidad
        ) {
            setError('Completa todos los campos obligatorios del solicitante.');
            setAgregandoSolicitante(false);
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/solicitantes/crear', solicitanteData);
            setSuccess('Solicitante agregado correctamente. Selecciónalo en la lista.');
            setSolicitanteData({
                Nombre: '',
                TipoSolicitante: '',
                DocumentoIdentidad: '',
                Direccion: '',
                Telefono: '',
                Correo: ''
            });
            setNuevoSolicitante(false);
            // Recargar la lista de solicitantes
            axios.get('http://localhost:3001/api/solicitantes/listar')
                .then(res => {
                    setSolicitantes(res.data);
                });
        } catch (err) {
            setError('Error al agregar el solicitante. Verifica que no exista ya.');
        }
        setAgregandoSolicitante(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        let idSolicitante = form.solicitanteId;

    // Usar el código único autogenerado
    const codigoUnicoFinal = codigoUnico;

        try {
            // Si es nuevo solicitante, primero créalo
            if (nuevoSolicitante) {
                const res = await axios.post('http://localhost:3001/api/solicitantes/crear', solicitanteData);
                idSolicitante = res.data.idSolicitante || res.data.IdSolicitante || res.data.insertId;
            }

            // Ahora registra la muestra vinculando el idSolicitante
            await axios.post('http://localhost:3001/api/muestras/registrar', {
                IdTipoMuestra: tipoMuestraToId(form.tipo),
                CodigoUnico: codigoUnicoFinal,
                Origen: form.origen,
                CondicionesTransporte: form.condiciones,
                IdSolicitante: idSolicitante
            });
            setSuccess('Muestra registrada correctamente');
            setForm({
                tipo: '',
                codigoNumero: '',
                origen: '',
                condiciones: '',
                responsableId: '',
                solicitanteId: ''
            });
            setSolicitanteData({
                Nombre: '',
                TipoSolicitante: '',
                DocumentoIdentidad: '',
                Direccion: '',
                Telefono: '',
                Correo: ''
            });
            setNuevoSolicitante(false);
        } catch (err) {
            setError('Error al registrar la muestra');
        }
    };

    const tipoMuestraToId = (tipo) => {
    switch (tipo) {
        case 'Agua': return 1;
        case 'Alimento': return 2;
        case 'Bebida Alcohólica': return 3;
        default: return null;
    }
};

    return (
        <div className="form-container">
            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                <button type="button" onClick={() => setTab('registro')} style={{ fontWeight: tab === 'registro' ? 'bold' : 'normal' }}>Registrar Muestra</button>
                <button type="button" onClick={() => setTab('muestras')} style={{ fontWeight: tab === 'muestras' ? 'bold' : 'normal' }}>Mis Muestras</button>
            </div>
            {tab === 'registro' && (
            <>
            <h2>Registro de Muestra</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tipo:</label>
                    <select name="tipo" value={form.tipo} onChange={handleChange} required>
                        <option value="">Seleccione</option>
                        <option value="Alimento">Alimento</option>
                        <option value="Agua">Agua</option>
                        <option value="Bebida Alcohólica">Bebida Alcohólica</option>
                    </select>
                </div>
                <div>
                    <label>Código único:</label>
                    <input
                        type="text"
                        value={codigoUnico}
                        disabled
                        style={{ width: 120, background: '#f6f8fa', border: 'none', color: '#1976d2', fontWeight: 'bold', fontSize: '1.1em' }}
                        tabIndex={-1}
                    />
                </div>
                <div>
                    <label>Origen:</label>
                    <input type="text" name="origen" value={form.origen} onChange={handleChange} required />
                </div>
                <div>
                    <label>Condiciones de transporte y almacenamiento:</label>
                    <textarea name="condiciones" value={form.condiciones} onChange={handleChange} required />
                </div>
                <div>
                    <label>Solicitante:</label>
                    <select name="solicitanteId" value={form.solicitanteId} onChange={handleSolicitanteSelect} required={!nuevoSolicitante} disabled={nuevoSolicitante}>
                        <option value="">Seleccione un solicitante</option>
                        {solicitantes.map(s => (
                            <option key={s.IdSolicitante} value={s.IdSolicitante}>{s.Nombre}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button type="button" onClick={handleNuevoSolicitante} style={{marginTop: 10}}>Nuevo Solicitante</button>
                </div>
                {nuevoSolicitante && (
                    <div style={{border: '1px solid #ccc', padding: 10, marginTop: 10, borderRadius: 6}}>
                        <h4>Datos del nuevo solicitante</h4>
                        <div>
                            <label>Nombre:</label>
                            <input type="text" name="Nombre" value={solicitanteData.Nombre} onChange={handleSolicitanteChange} required />
                        </div>
                        <div>
                            <label>Tipo de Solicitante:</label>
                            <input type="text" name="TipoSolicitante" value={solicitanteData.TipoSolicitante} onChange={handleSolicitanteChange} required />
                        </div>
                        <div>
                            <label>Documento Identidad:</label>
                            <input type="text" name="DocumentoIdentidad" value={solicitanteData.DocumentoIdentidad} onChange={handleSolicitanteChange} required />
                        </div>
                        <div>
                            <label>Dirección:</label>
                            <input type="text" name="Direccion" value={solicitanteData.Direccion} onChange={handleSolicitanteChange} />
                        </div>
                        <div>
                            <label>Teléfono:</label>
                            <input type="text" name="Telefono" value={solicitanteData.Telefono} onChange={handleSolicitanteChange} />
                        </div>
                        <div>
                            <label>Correo:</label>
                            <input type="email" name="Correo" value={solicitanteData.Correo} onChange={handleSolicitanteChange} />
                        </div>
                        <button
                            type="button"
                            onClick={handleAgregarSolicitante}
                            style={{marginTop: 10, width: '100%'}}
                            disabled={agregandoSolicitante}
                        >
                            {agregandoSolicitante ? 'Agregando...' : 'Agregar'}
                        </button>
                    </div>
                )}
                {/* Eliminado campo de responsable técnico */}
                <button type="submit" disabled={nuevoSolicitante}>Registrar Muestra</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            </>
            )}
            {tab === 'muestras' && (
                <div style={{ minHeight: 500, minWidth: 800, padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                    <h2>Mis Muestras</h2>
                    <div style={{ marginBottom: 18 }}>
                        <label htmlFor="filtroSolicitante" style={{ fontWeight: 500, marginRight: 8 }}>Filtrar por solicitante:</label>
                        <select id="filtroSolicitante" value={filtroSolicitante} onChange={e => setFiltroSolicitante(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}>
                            <option value="">Todos</option>
                            {solicitantes.map(s => (
                                <option key={s.IdSolicitante} value={s.IdSolicitante}>{s.Nombre}</option>
                            ))}
                        </select>
                    </div>
                    {muestras.length > 0 ? (
                        <div style={{ overflowX: 'auto', marginTop: 10 }}>
                            <table className="muestras-grid" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                                <thead>
                                    <tr style={{ background: '#f8f8f8' }}>
                                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Código</th>
                                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Tipo</th>
                                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Origen</th>
                                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {muestras.map(m => (
                                        <tr key={m.IdMuestra} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                                            <td style={{ padding: '10px', fontWeight: 500 }}>{m.CodigoUnico}</td>
                                            <td style={{ padding: '10px' }}>{m.TipoMuestra}</td>
                                            <td style={{ padding: '10px' }}>{m.Origen}</td>
                                            <td style={{ padding: '10px', color: m.Estado === 'Certificada' ? 'green' : m.Estado === 'Devuelta' ? 'red' : '#333', fontWeight: 500 }}>{m.Estado}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No tienes muestras registradas.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default RegisterMuestra;