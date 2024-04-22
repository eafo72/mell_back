// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const preOrderSchema = mongoose.Schema(
	{
        descripcion: {
            type: Array,
            required: true
		},
		fecha: {
			type: String
		},
		status: {
			type: String
		}

	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const PrePedido = mongoose.model('PrePedido', preOrderSchema)

// 4. EXPORTACIÓN
module.exports = PrePedido
