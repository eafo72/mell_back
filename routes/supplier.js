/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Proveedor = require('../models/Proveedor') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const proveedores = await Proveedor.find({})
        res.json({proveedores})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Proveedor.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { nombre } = req.body 

	try {

		const ifExist = await Proveedor.find( { nombre: nombre } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El proveedor '+nombre+' ya existe',
			})	

		}else{

		    const nuevoProveedor = await Proveedor.create({
				nombre				
			})
        	res.json(nuevoProveedor)

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

		const ifExist = await Proveedor.find( { nombre: nombre, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'El proveedor '+nombre+' ya existe',
			})	

		}else{

		    const updateProveedor = await Proveedor.findByIdAndUpdate(id,{
				nombre
			},{new:true})
			res.json({updateProveedor})

		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el proveedor',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteProveedor = await Proveedor.findByIdAndRemove({ _id: id })
		res.json(deleteProveedor)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el proveedor',
		})
	}
})

module.exports = app
