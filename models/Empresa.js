// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const companySchema = mongoose.Schema(
	{
		nombre:{
			type: String,
		},
		direccion:{
			type: String,
		},
		telefono:{
			type: String,
		},
		correo:{
			type: String,
		},
		slogan:{
			type: String,
		},
		aviso: {
			type: String,
		},
		terminos: {
			type: String,
		},
	
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Empresa = mongoose.model('Empresa', companySchema)

// 4. EXPORTACIÓN
module.exports = Empresa
