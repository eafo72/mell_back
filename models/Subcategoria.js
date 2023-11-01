// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const subcategorySchema = mongoose.Schema(
	{
		categoria:{
			type: String,
			required: [true,'La categoría es obligatoria']
		},
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
const Subcategoria = mongoose.model('Subcategoria', subcategorySchema)

// 4. EXPORTACIÓN
module.exports = Subcategoria
