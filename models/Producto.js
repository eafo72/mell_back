// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const productSchema = mongoose.Schema(
	{
		codigo: {
			type: String,
			required: false
		},
		nombre: {
			type: String,
			required: [true,'El nombre es obligatorio']
		},
		descripcion: {
			type: String,
			required: false
		},
		genero: {
			type: String,
			required: false,
		}, 
		edad: {
			type: String,
			required: false,
		}, 
		categoria: {
			type: String,
			required: [true,'La categoría es obligatoria']
		},
		subcategoria: {
			type: String,
			required: [true,'La subcategoría es obligatoria']
		},
		marca: {
			type: String,
			required: false,
		}, 
		talla: {
			type: Array,
			required: false,
		}, 
		color: {
			type: Array,
			required: false,
		}, 
		proveedor: {
			type: String,
			required: false,
		}, 
		foto_principal: {
			type: String,
			required: false,
		}, 
		fotos_carrusel: {
			type: Array,
			required: false,
		}, 
		estatus: {
			type: String,
			required: false,
		}, 
		precio: {
			type: Number,
			required: false,
		}, 
		calificacion: {
			type: Array,
			required: false,
		}, 
	},
	{
		timestamps: true, 
	}
)

// 3. MODELO
const Producto = mongoose.model('Producto', productSchema)

// 4. EXPORTACIÓN
module.exports = Producto
