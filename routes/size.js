/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Talla = require('../models/Talla') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const tallas = await Talla.find({})
        res.json({tallas})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Talla.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { nombre, codigo } = req.body 

	try {
		const ifExist = await Talla.find( { 
			$or: [{
				nombre: nombre
			}, {
				codigo: codigo
			}]
		 } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'La talla o el código ya existen',
			})	

		}else{

		    const nuevaTalla = await Talla.create({
				nombre,
				codigo				
			})
        	res.json(nuevaTalla)

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

		const ifExist = await Talla.find( { nombre: nombre, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'La talla '+nombre+' ya existe',
			})	

		}else{

		    const updateTalla = await Talla.findByIdAndUpdate(id,{
				nombre
			},{new:true})
			res.json({updateTalla})

		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando la Talla',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteTalla = await Talla.findByIdAndRemove({ _id: id })
		res.json(deleteTalla)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando la Talla',
		})
	}
})

module.exports = app
