/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Categoria = require('../models/Categoria') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const categorias = await Categoria.find({})
        res.json({categorias})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Categoria.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { nombre, imagen} = req.body 

	try {
        const nuevaCategoria = await Categoria.create({
			nombre,
			imagen
		})
        res.json(nuevaCategoria)
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
		imagen
	 } = req.body 
	try {
    	const updateCategoria = await Categoria.findByIdAndUpdate(id,{
			nombre,
			imagen
		},{new:true})
        res.json({updateCategoria})

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando la Categoría',
		})
	}
})

// BORRAR
app.delete('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteCategoria = await Categoria.findByIdAndRemove({ _id: id })
		res.json(deleteCategoria)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando la Categoría',
		})
	}
})

module.exports = app
