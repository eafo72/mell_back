/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Estante = require('../models/Estante') 
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')
const ObjectId = require('mongodb').ObjectId;

// LISTA
app.get('/obtener', async (req, res) => {
	try {
 		const estantes = await Estante.find({})
 
        res.json({estantes})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
				
	try {
		const single = await Estante.findById(req.params.id) 
		
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { nombre, almacen } = req.body 

	try {
		const ifExist = await Estante.find( { nombre: nombre } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El estante '+nombre+' ya existe',
			})	

		}else{

			const nuevoEstante = await Estante.create({
				almacen,
				nombre
			})
			res.json(nuevoEstante)
			
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
		almacen,
		nombre
	 } = req.body 
	try {

		const ifExist = await Estante.find( { nombre: nombre, _id: { $ne: id } } )
		

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El estante '+nombre+' ya existe',
			})	

		}else{

			const updateEstante = await Estante.findByIdAndUpdate(id,{
				almacen,
				nombre
			},{new:true})
			res.json({updateEstante})
			
		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el estante',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteEstante = await Estante.findByIdAndRemove({ _id: id })
		res.json(deleteEstante)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el estante',
		})
	}
})

module.exports = app
