// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const orderSchema = mongoose.Schema(
	{
		usuario: {
			type: String,
			required: true
		},
		tipo_venta: {
			type: String,
			required: true
		},
        subtotal: {
			type: Number,
            required: true
		},
        descuento: {
			type: Number,
            required: true
		},
        iva: {
			type: Number,
            required: true
		},
        total: {
			type: Number,
            required: true
		},
        descripcion: {
            type: Array,
            required: true
		},
        correo: {
			type: String
		},
		entregar_a: {
			type: String
		},
        direccion_entrega: {
			type: String
		},
        costo_envio: {
			type: Number
		},
        telefono: {
			type: String
		},
        estatus_pago: {
			type: String
		},
        estatus_envio: {
			type: String
		},
        vendedor: {
			type: String
		},
        fecha: {
			type: String
		},
		forma_entrega: {
			type: String
		},
        forma_pago: {
			type: String
		},
        num_parcialidades: {
			type: Number
		},
        parcialidades: {
			type: Array
		}
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Pedido = mongoose.model('Pedido', orderSchema)

// 4. EXPORTACIÓN
module.exports = Pedido
