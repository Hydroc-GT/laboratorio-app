const Muestra = require('../modelos/muestra');
const Solicitante = require('../modelos/solicitante');
const TipoMuestra = require('../modelos/tipomuestra');

// Controlador para crear una nueva muestra
const createMuestra = async (req, res) => {
  try {
    const {
      IdTipoMuestra,
      CodigoUnico,
      Origen,
      CondicionesTransporte,
      IdSolicitante,
      IdResponsable
    } = req.body;

    const nuevaMuestra = await Muestra.create({
      IdTipoMuestra,
      CodigoUnico,
      Origen,
      CondicionesTransporte,
      IdSolicitante,
      IdResponsable,
      Estado: 'Recibida', // Estado inicial
    });

    res.status(201).json(nuevaMuestra);
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear la muestra.',
      error: error.message
    });
  }
};

// Controlador para obtener todas las muestras
const getMuestras = async (req, res) => {
  try {
    const muestras = await Muestra.findAll({
      // Puedes incluir las relaciones para traer datos de otras tablas
      include: [{
        model: Solicitante
      }, {
        model: TipoMuestra
      }],
    });
    res.status(200).json(muestras);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las muestras.',
      error: error.message
    });
  }
};

// Exporta las funciones para usarlas en las rutas
module.exports = {
  createMuestra,
  getMuestras,
};
