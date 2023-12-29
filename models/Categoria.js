// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const categorySchema = mongoose.Schema(
	{
		nombre: {
			type: String,
			required: [true,'El nombre es obligatorio']
		},
		imagen: {
			type: String,
			required: true
		}, 
		indexViewUp: {
			type: String,
		},
		indexViewDown: {
			type: String,
		}
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Categoria = mongoose.model('Categoria', categorySchema)

// 4. EXPORTACIÓN
module.exports = Categoria
