// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const instagramUserSchema = mongoose.Schema(
	{
		user: {
			type: String,
			required: [true,'El user es obligatorio']
		},
		email: {
			type: String,
			required: [true,'El correo es obligatorio'],
			match: [/\S+@\S+\.\S+/, 'Correo inválido' ],
		},
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const InstagramUsuario = mongoose.model('InstagramUsuario', instagramUserSchema)

// 4. EXPORTACIÓN
module.exports = InstagramUsuario

