/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Marca = require('../models/Marca') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const marcas = await Marca.find({}).sort( { "nombre": 1 })
        res.json({marcas})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Marca.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { nombre } = req.body 

	try {

		const ifExist = await Marca.find( { nombre: nombre } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'La marca '+nombre+' ya existe',
			})	

		}else{

		    const nuevaMarca = await Marca.create({
				nombre				
			})
        	res.json(nuevaMarca)

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

		const ifExist = await Marca.find( { nombre: nombre, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'La marca '+nombre+' ya existe',
			})	

		}else{

		    const updateMarca = await Marca.findByIdAndUpdate(id,{
				nombre
			},{new:true})
			res.json({updateMarca})

		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando la Marca',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteMarca = await Marca.findByIdAndRemove({ _id: id })
		res.json(deleteMarca)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando la Marca',
		})
	}
})

module.exports = app
