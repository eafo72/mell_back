// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const colorSchema = mongoose.Schema(
	{
		nombre: {
			type: String,
			required: [true,'El nombre es obligatorio']
		},
		codigo: {
			type: String,
			required: [true,'El código es obligatorio']
		},
		colorhexa: {
			type: String,
			required: [true,'El color en hexadecimal es obligatorio']
		},
	
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Color = mongoose.model('Color', colorSchema)

// 4. EXPORTACIÓN
module.exports = Color
