/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Producto = require('../models/Producto') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const productos = await Producto.find({})
        res.json({productos})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Producto.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { 
		nombre,
		genero,
		edad,
		categoria,
		subcategoria,
		marca,
		tallas,
		colores,
		proveedor,
		foto_principal,
		fotos_carrusel,
		estatus,
		precio,
		almacen,
		estante,
		stock,
		apartado,
		estropeado,
		calificacion
	} = req.body 

	try {

		const ifExist = await Producto.find( { nombre: nombre } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El producto '+nombre+' ya existe',
			})	

		}else{

        	const nuevoProducto = await Producto.create({
			nombre,
			genero,
			edad,
			categoria,
			subcategoria,
			marca,
			tallas,
			colores,
			proveedor,
			foto_principal,
			fotos_carrusel,
			estatus,
			precio,
			almacen,
			estante,
			stock,
			apartado,
			estropeado,
			calificacion
			})
        	res.json(nuevoProducto)
		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error guardando los datos'+error,
		})
	}
})

// ACTUALIZAR
//app.put('/actualizar', auth, async (req, res) => {
app.put('/actualizar', async (req, res) => {
    const { 
		id,
		nombre,
		genero,
		edad,
		categoria,
		subcategoria,
		marca,
		tallas,
		colores,
		proveedor,
		foto_principal,
		fotos_carrusel,
		estatus,
		precio,
		almacen,
		estante,
		stock,
		apartado,
		estropeado,
		calificacion
	 } = req.body 
	try {

		const ifExist = await Producto.find( { nombre: nombre, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'El producto '+nombre+' ya existe',
			})	

		}else{

    		const updateProducto = await Producto.findByIdAndUpdate(id,{
			nombre,
			genero,
			edad,
			categoria,
			subcategoria,
			marca,
			tallas,
			colores,
			proveedor,
			foto_principal,
			fotos_carrusel,
			estatus,
			precio,
			almacen,
			estante,
			stock,
			apartado,
			estropeado,
			calificacion
			},{new:true})
        	res.json({updateProducto})
		}	

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el Producto',
		})
	}
})

// BORRAR
app.delete('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteProducto = await Producto.findByIdAndRemove({ _id: id })
		res.json(deleteProducto)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el Producto',
		})
	}
})

module.exports = app
