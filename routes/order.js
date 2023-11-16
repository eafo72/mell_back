/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Pedidos = require('../models/Pedidos') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const pedidos = await Pedidos.find({})
        res.json({pedidos})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Pedidos.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { 
		usuario,
		subtotal,
		descuento,
		iva,
		total,
		descripcion,
		correo,
		direccion_entrega,
		costo_envio,
		telefono,
		estatus_pago,
		estatus_envio,
		vendedor,
		fecha,
		tipo_pago,
		numero_parcialidades,
		parcialidades
	} = req.body 

	try {

		const nuevoPedido = await Pedidos.create({
			usuario,
			subtotal,
			descuento,
			iva,
			total,
			descripcion,
			correo,
			direccion_entrega,
			costo_envio,
			telefono,
			estatus_pago,
			estatus_envio,
			vendedor,
			fecha,
			tipo_pago,
			numero_parcialidades,
			parcialidades
		})
        res.json(nuevoPedido)

		
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
		usuario,
		subtotal,
		descuento,
		iva,
		total,
		descripcion,
		correo,
		direccion_entrega,
		costo_envio,
		telefono,
		estatus_pago,
		estatus_envio,
		vendedor,
		fecha,
		tipo_pago,
		numero_parcialidades,
		parcialidades
	 } = req.body 
	try {


		const updatePedido = await Pedidos.findByIdAndUpdate(id,{
			usuario,
			subtotal,
			descuento,
			iva,
			total,
			descripcion,
			correo,
			direccion_entrega,
			costo_envio,
			telefono,
			estatus_pago,
			estatus_envio,
			vendedor,
			fecha,
			tipo_pago,
			numero_parcialidades,
			parcialidades
		},{new:true})

		res.json({updatePedido})

		

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el Pedido',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deletePedido = await Pedidos.findByIdAndRemove({ _id: id })
		res.json(deletePedido)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el Pedido',
		})
	}
})

module.exports = app
