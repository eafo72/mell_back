// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const productSchema = mongoose.Schema(
	{
		nombre: {
			type: String,
			required: [true,'El nombre es obligatorio']
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
		tallas: {
			type: String,
			required: false,
		}, 
		colores: {
			type: String,
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
			type: String,
			required: false,
		}, 
		estatus: {
			type: String,
			required: false,
		}, 
		precio: {
			type: String,
			required: false,
		}, 
		almacen: {
			type: String,
			required: false,
		}, 
		estante: {
			type: String,
			required: false,
		}, 
		stock: {
			type: String,
			required: false,
		}, 
		apartado: {
			type: String,
			required: false,
		}, 
		estropeado: {
			type: String,
			required: false,
		}, 
		calificacion: {
			type: String,
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
