// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const codeSchema = mongoose.Schema(
	{
		codigo: {
			type: String,
			required: [true,'El código es obligatorio']
		},
		porcentaje: {
			type: Number,
			required: [true,'El porcentaje es obligatorio']
		},
	
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Codigo = mongoose.model('Codigo', codeSchema)

// 4. EXPORTACIÓN
module.exports = Codigo
