// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const sizeSchema = mongoose.Schema(
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
const Talla = mongoose.model('Talla', sizeSchema)

// 4. EXPORTACIÓN
module.exports = Talla
