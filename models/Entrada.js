// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const instorageSchema = mongoose.Schema(
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
		fechaEntrada:{
			type: Date,
			required: [true,'La fecha de entrada es obligatoria']
		},
		cantidad:{
			type: Number,
			required: [true,'La cantidad es obligatoria']
		},
		proveedor:{
			type: String,
			required: [true,'El proveedor es obligatorio']
		},
		id_almacen:{
			type: mongoose.Schema.Types.ObjectId,
			required: [true,'El id_almacen es obligatorio']
		},
		estante:{
			type: String,
			required: [true,'El estante es obligatorio']
		}
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Entrada = mongoose.model('Entrada', instorageSchema)

// 4. EXPORTACIÓN
module.exports = Entrada