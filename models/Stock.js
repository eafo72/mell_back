// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const stockSchema = mongoose.Schema(
	{
		id_almacen: {
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
		stock: {
			type: Number
		},
		apartado: {
			type: Number
		},
		estropeado: {
			type: Number
		}
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Stock = mongoose.model('Stock', stockSchema)

// 4. EXPORTACIÓN
module.exports = Stock
