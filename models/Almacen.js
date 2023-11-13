// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const storageSchema = mongoose.Schema(
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
const Storage = mongoose.model('Storage', storageSchema)

// 4. EXPORTACIÓN
module.exports = Storage
