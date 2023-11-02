// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const supplierSchema = mongoose.Schema(
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
const Proveedor = mongoose.model('Proveedor', supplierSchema)

// 4. EXPORTACIÓN
module.exports = Proveedor
