// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const faqSchema = mongoose.Schema(
	{
		pregunta: {
			type: String,
			required: [true,'La pregunta es obligatoria']
		},
		respuesta: {
			type: String,
			required: [true,'La respuesta es obligatoria']
		},
		
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Faq = mongoose.model('Faq', faqSchema)

// 4. EXPORTACIÓN
module.exports = Faq
