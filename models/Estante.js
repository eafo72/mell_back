// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const shelfSchema = mongoose.Schema(
	{
		nombre: {
			type: String,
			required: [true,'El nombre es obligatorio']
		},
		almacen: {
			type: String,
			required: [true,'El almacén es obligatorio']
		},
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Estante = mongoose.model('Estante', shelfSchema)

// 4. EXPORTACIÓN
module.exports = Estante
