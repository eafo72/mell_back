/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Color = require('../models/Color') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const colores = await Color.find({})
        res.json({colores})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Color.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { nombre, codigo, colorhexa } = req.body 


	try {

		const ifExist = await Color.find( { 
			$or: [{
				nombre: nombre
			}, {
				codigo: codigo
			}]
		 } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El color o el código ya existen',
			})	

		}else{

		    const nuevoColor = await Color.create({
				nombre,
				codigo,
				colorhexa				
			})
        	res.json(nuevoColor)

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
		nombre,
		colorhexa
	 } = req.body 
	try {

		const ifExist = await Color.find( { nombre: nombre, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'El color '+nombre+' ya existe',
			})	

		}else{

		    const updateColor = await Color.findByIdAndUpdate(id,{
				nombre,
				colorhexa
			},{new:true})
			res.json({updateColor})

		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el Color',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteColor = await Color.findByIdAndRemove({ _id: id })
		res.json(deleteColor)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el Color',
		})
	}
})

module.exports = app
