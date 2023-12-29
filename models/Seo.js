// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const seoSchema = mongoose.Schema(
	{
		title: {
			type: String
		},
		words: {
			type: String
		},
		description: {
			type: String
		},
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Seo = mongoose.model('Seo', seoSchema)

// 4. EXPORTACIÓN
module.exports = Seo
