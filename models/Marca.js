// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const brandSchema = mongoose.Schema(
	{
		nombre: {
			type: String,
			required: [true,'El nombre es obligatorio']
		},
	
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Marca = mongoose.model('Marca', brandSchema)

// 4. EXPORTACIÓN
module.exports = Marca
