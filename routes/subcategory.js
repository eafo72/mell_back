/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Subcategoria = require('../models/Subcategoria') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const subcategorias = await Subcategoria.find({})
        res.json({subcategorias})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Subcategoria.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { categoria, nombre, imagen} = req.body 

	try {
		const ifExist = await Subcategoria.find( { nombre: nombre, categoria:categoria } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'La combinación de la subcategoría '+nombre+' y la categoría '+categoria+' ya existe',
			})	

		}else{

			const nuevaSubcategoria = await Subcategoria.create({
				categoria,
				nombre,
				imagen
			})
			res.json(nuevaSubcategoria)
			
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
		categoria,
		nombre,
		imagen
	 } = req.body 
	try {

		const ifExist = await Subcategoria.find( { nombre: nombre, _id: { $ne: id } } )
		

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'La subcategoría '+nombre+' ya existe',
			})	

		}else{

			const updateSubcategoria = await Subcategoria.findByIdAndUpdate(id,{
				categoria,
				nombre,
				imagen
			},{new:true})
			res.json({updateSubcategoria})
			
		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando la subcategoría',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteSubcategoria = await Subcategoria.findByIdAndRemove({ _id: id })
		res.json(deleteSubcategoria)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando la subcategoría',
		})
	}
})

module.exports = app
