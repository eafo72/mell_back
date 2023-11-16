// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const instorageSchema = mongoose.Schema(
	{
		producto: {
			type: String,
			required: [true,'El producto es obligatorio']
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
		nombre_almacen:{
			type: String,
			required: [true,'El nombre_almacen es obligatorio']
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