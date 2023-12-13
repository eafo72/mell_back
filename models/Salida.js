// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const outstorageSchema = mongoose.Schema(
	{
		codigo: {
			type: String,
			required: [true,'El codigo es obligatorio']
		},
		codigo_producto: {
			type: String,
			required: true
		},
		codigo_talla: {
			type: String,
			required: true
		},
		codigo_color: {
			type: String,
			required: true
		},
		fechaSalida:{
			type: Date,
			required: [true,'La fecha de salida es obligatoria']
		},
		cantidad:{
			type: Number,
			required: [true,'La cantidad es obligatoria']
		},
		id_almacen:{
			type: mongoose.Schema.Types.ObjectId,
			required: [true,'El id_almacen es obligatorio']
		},
		estante:{
			type: String,
			required: [true,'El estante es obligatorio']
		},
		id_apartado:{
			type: mongoose.Schema.Types.ObjectId,
			required: [true,'El id_apartado es obligatorio']
		},
		id_pedido:{
			type: mongoose.Schema.Types.ObjectId,
			required: [true,'El id_pedido es obligatorio']
		},

	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Salida = mongoose.model('Salida', outstorageSchema)

// 4. EXPORTACIÓN
module.exports = Salida