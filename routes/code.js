/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Codigo = require('../models/Codigo') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const codigos = await Codigo.find({})
        res.json({codigos})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Codigo.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { codigo, porcentaje } = req.body 

	try {

		const ifExist = await Codigo.find( { codigo: codigo } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El código '+codigo+' ya existe',
			})	

		}else{

		    const nuevoCodigo = await Codigo.create({
				codigo, porcentaje				
			})
        	res.json(nuevoCodigo)

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
		codigo,
		porcentaje
	 } = req.body 
	try {

		const ifExist = await Codigo.find( { codigo: codigo, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'El código '+codigo+' ya existe',
			})	

		}else{

		    const updateCodigo = await Codigo.findByIdAndUpdate(id,{
				codigo, porcentaje
			},{new:true})
			res.json({updateCodigo})

		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el código',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteCodigo = await Codigo.findByIdAndRemove({ _id: id })
		res.json(deleteCodigo)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el código',
		})
	}
})


// VALIDAR
app.get('/validar/:code', async (req, res) => {
			
	try {
		const single = await Codigo.find({codigo:req.params.code}) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.code+' error: '+error })
	}

})

module.exports = app
