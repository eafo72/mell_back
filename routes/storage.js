/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Almacen = require('../models/Almacen') 
const Producto = require('../models/Producto')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const almacenes = await Almacen.find({})
        res.json({almacenes})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Almacen.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { nombre } = req.body 

	try {

		const ifExist = await Almacen.find( { nombre: nombre } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El almacén '+nombre+' ya existe',
			})	

		}else{

		    const nuevoAlmacen = await Almacen.create({
				nombre				
			})
        	res.json(nuevoAlmacen)

		}
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error guardando los datos'+error,
		})
	}
})

// ACTUALIZAR
app.put('/actualizar', async (req, res) => {
    const { 
		id,
		nombre
	 } = req.body 
	try {

		const ifExist = await Almacen.find( { nombre: nombre, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'El almacén '+nombre+' ya existe',
			})	

		}else{

		    const updateAlmacen = await Almacen.findByIdAndUpdate(id,{
				nombre
			},{new:true})
			res.json({updateAlmacen})

		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el almacén',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteAlmacen = await Almacen.findByIdAndRemove({ _id: id })
		res.json(deleteAlmacen)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el almacén',
		})
	}
})

// STOCK
app.get('/stock/:id', async (req, res) => {
				
	try {
		const stock = await Producto.find({almacen: { $elemMatch: { id_almacen: req.params.id }}});
		res.json({stock})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+id+' error: '+error })
	}

})

// APARTADOS
app.get('/apartados/:id', async (req, res) => {
				
	try {
		const apartados = await Producto.find({almacen: { $elemMatch: { id_almacen: req.params.id }}, almacen: { $elemMatch: { apartado: { $gt: 0 } }}});
		res.json({apartados})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+id+' error: '+error })
	}

})

// APARTADOS
app.get('/estropeados/:id', async (req, res) => {
				
	try {
		const estropeados = await Producto.find({almacen: { $elemMatch: { id_almacen: req.params.id }}, almacen: { $elemMatch: { estropeado: { $gt: 0 } }}});
		res.json({estropeados})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+id+' error: '+error })
	}

})


module.exports = app
