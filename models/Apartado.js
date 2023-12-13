// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const apartadoSchema = mongoose.Schema(
	{
		id_almacen: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		id_pedido: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		estante: {
			type: String,
			required: true
		},
		codigo_producto: {
			type: String,
			required: true
		},
		codigo_talla: {
			type: String,
			required: true
		},
		codigo_color: {
			type: String,
			required: true
		},
		codigo: {
			type: String,
			required: true
		},
		apartado: {
			type: Number
		},
		status: {
			type: String
		},
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Apartado = mongoose.model('Apartado', apartadoSchema)

// 4. EXPORTACIÓN
module.exports = Apartado
