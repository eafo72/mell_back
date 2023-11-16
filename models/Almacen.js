// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const storageSchema = mongoose.Schema(
	{
		nombre: {
			type: String,
			required: [true,'El nombre es obligatorio']
		},
		estantes: {
			type: Array,
		},
	
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Almacen = mongoose.model('Almacen', storageSchema)

// 4. EXPORTACIÓN
module.exports = Almacen
