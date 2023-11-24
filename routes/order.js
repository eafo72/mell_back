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
		const pedidos = await Pedidos.find({},
			{
				tipo_venta:1,
				fecha:1,
				forma_entrega:1,
				estatus_envio:1,
				num_parcialidades:1,
				total_parcialidades: {
				  $sum: "$parcialidades.importe"
				},
				descripcion:1,
				estatus_pago:1,
				subtotal:1,
				descuento:1,
				iva:1,
				total:1
			}
		)

        res.json({pedidos})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos '+error })
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
		tipo_venta,
        subtotal,
        descuento,
        iva,
        total,
        descripcion,
        usuario,
        correo,
		entregar_a,
        direccion_entrega,
		costo_envio,
        telefono,
        estatus_pago,
        estatus_envio,
        vendedor,
		forma_entrega,
        forma_pago,
        num_parcialidades,
        parcialidades
	} = req.body 

	let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); 

	let array_parcialidades = [];
	if(num_parcialidades == 1){
		array_parcialidades = [{"fecha":date,"importe":total}];
	}else{
		array_parcialidades = [{"fecha":date,"importe":parcialidades}];
	}	

	try {

		const nuevoPedido = await Pedidos.create({
			usuario,
			tipo_venta,
			subtotal,
			descuento,
			iva,
			total,
			descripcion,
			correo,
			entregar_a,
			direccion_entrega,
			costo_envio,
			telefono,
			estatus_pago,
			estatus_envio,
			vendedor,
			fecha:date,
			forma_entrega,
			forma_pago,
			num_parcialidades,
			parcialidades:array_parcialidades
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
		
	 } = req.body 
	try {


		const updatePedido = await Pedidos.findByIdAndUpdate(id,{
			
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


app.put('/abonar', async (req, res) => {
    const { 
		id,
		cantidad
	 } = req.body 
	try {

		const single = await Pedidos.findById(id)
		const new_parcialidades = single.parcialidades;

		let today = new Date();
    	let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); 

		new_parcialidades.push({"fecha":date ,"importe":parseFloat(cantidad)});

		const updatePedido = await Pedidos.findByIdAndUpdate(id,{
			parcialidades:new_parcialidades
			
		},{new:true})

		res.json({updatePedido})

		

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el Pedido',
		})
	}
})

app.get('/ventas', async (req, res) => {
	try {
		const ventas = await Pedidos.find({},
			{
				fecha:1,
				descripcion:1,
			},
			
		)

        res.json({ventas})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos '+error })
	}
})

module.exports = app
