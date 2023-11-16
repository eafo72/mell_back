/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Almacen = require('../models/Almacen') 
const Entrada = require('../models/Entrada') 
const Producto = require('../models/Producto')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const almacenes = await Almacen.find({})
        res.json({almacenes})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Almacen.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { nombre } = req.body 

	try {

		const ifExist = await Almacen.find( { nombre: nombre } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El almacén '+nombre+' ya existe',
			})	

		}else{

		    const nuevoAlmacen = await Almacen.create({
				nombre				
			})
        	res.json(nuevoAlmacen)

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

		const ifExist = await Almacen.find( { nombre: nombre, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'El almacén '+nombre+' ya existe',
			})	

		}else{

		    const updateAlmacen = await Almacen.findByIdAndUpdate(id,{
				nombre
			},{new:true})
			res.json({updateAlmacen})

		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el almacén',
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteAlmacen = await Almacen.findByIdAndRemove({ _id: id })
		res.json(deleteAlmacen)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el almacén',
		})
	}
})

// STOCK
app.get('/stock/:id', async (req, res) => {
				
	try {
		const stock = await Producto.find({almacen: { $elemMatch: { id_almacen: req.params.id }}});
		res.json({stock})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})

// APARTADOS
app.get('/apartados/:id', async (req, res) => {
				
	try {
		const apartados = await Producto.find({almacen: { $elemMatch: { id_almacen: req.params.id }}, almacen: { $elemMatch: { apartado: { $gt: 0 } }}});
		res.json({apartados})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})

// APARTADOS
app.get('/estropeados/:id', async (req, res) => {
				
	try {
		const estropeados = await Producto.find({almacen: { $elemMatch: { id_almacen: req.params.id }}, almacen: { $elemMatch: { estropeado: { $gt: 0 } }}});
		res.json({estropeados})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+req.params.id+' error: '+error })
	}

})

/////////////////////////////////////////////////// ENTRADAS ////////////////////////////////////////////////////////////

// LISTA
app.post('/entradas', async (req, res) => {
	
	const { almacen } = req.body 

	try {
		//const entradas = await Entrada.find( { almacen: almacen } )

		const entradas = await Entrada.aggregate([
			{ $match: {
				nombre_almacen: almacen 
				} 
			},
			{ 
			$lookup: {
			 from: 'productos',
			 localField: 'producto',
			 foreignField: 'nombre',
			 as: 'datos_producto'
			}},
			{ 
				$unwind: '$datos_producto'
 		    }
		]);



        res.json({entradas})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// ALTA DE ENTRADA
app.post('/entrada-alta', async (req, res) => {
	const { producto, fechaEntrada, cantidad, proveedor, id_almacen, nombre_almacen, estante } = req.body 

	try {

		
		const single = await Producto.find({nombre: producto}) 
		
		const oldalmacen = single[0].almacen;
		//console.log(oldalmacen)
       
		const newarray = [];

		if(oldalmacen.length == 0){
			newarray.push({
				apartado:0,
				estante:estante,
				estropeado:0,
				id_almacen,
				nombre_almacen,
				stock:parseInt(cantidad)
			})
		}else{
		
			
			for(let i = 0; i < oldalmacen.length; i++){
				if(oldalmacen[i].nombre_almacen == nombre_almacen){
					newarray.push({
					apartado:oldalmacen[i].apartado,
					estante:oldalmacen[i].estante,
					estropeado:oldalmacen[i].estropeado,
					id_almacen:oldalmacen[i].id_almacen,
					nombre_almacen:oldalmacen[i].nombre_almacen,
					stock:oldalmacen[i].stock + parseInt(cantidad),
					})	
				}else{
					newarray.push({
					apartado:oldalmacen[i].apartado,
					estante:oldalmacen[i].estante,
					estropeado:oldalmacen[i].estropeado,
					id_almacen:oldalmacen[i].id_almacen,
					nombre_almacen:oldalmacen[i].nombre_almacen,
					stock:oldalmacen[i].stock,
					})
				}
			}
		}

		const nuevoStock = await Producto.updateOne(
			{nombre: producto},
			{
			  $set: { almacen: newarray },
			  $currentDate: { lastModified: true }
			}
		); 

	    const nuevaEntradaAlmacen = await Entrada.create({
			producto, fechaEntrada, cantidad, proveedor, id_almacen, nombre_almacen, estante
		})
       	res.json(nuevaEntradaAlmacen)

		
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error guardando los datos'+error,
		})
	}
})

// BORRAR
app.post('/entrada-borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteAlmacenEntrada = await Entrada.findByIdAndRemove({ _id: id })
		res.json(deleteAlmacenEntrada)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando la entrada de almacén',
		})
	}
})


//////////////////////////////////////////////////////////////// ESTANTES  ///////////////////////////////////////////////////////////////////////////
// Alta
app.put('/estante-alta', async (req, res) => {
    const { 
		id_almacen,
		nombre
	 } = req.body 
	try {

	    const updateAlmacen = await Almacen.findByIdAndUpdate(
			id_almacen,
			{ $push: { estantes: {nombre:nombre}   } },
			{ upsert: true, new: true }
			)
		res.json({updateAlmacen})


	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el almacén',
		})
	}
})

// Editar
app.put('/estante-editar', async (req, res) => {
    const { 
		id_almacen,
		nombre_anterior,
		nombre_nuevo
	 } = req.body 
	try {

		const single = await Almacen.findById(id_almacen);

		const estantes = single.estantes;
		
		const newarray = [];

		for(let i = 0; i < estantes.length; i++){
			if(estantes[i].nombre == nombre_anterior){
				newarray.push({
				nombre:nombre_nuevo,
				})	
			}else{
				newarray.push({
				nombre:estantes[i].nombre,
				
				})
			}
		}

	    const updateAlmacen = await Almacen.findByIdAndUpdate(
			id_almacen,
			{
				$set: { estantes: newarray },
				$currentDate: { lastModified: true }
		    }
		)
		res.json({updateAlmacen})


	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el almacén',
		})
	}
})

// borrar
app.put('/estante-borrar', async (req, res) => {
    const { 
		id_almacen,
		nombre
	 } = req.body 
	try {

		const single = await Almacen.findById(id_almacen);

		const estantes = single.estantes;
		
		const newarray = [];

		for(let i = 0; i < estantes.length; i++){
			if(estantes[i].nombre != nombre){
				newarray.push({
				nombre:estantes[i].nombre,
				})
			}
		}

	    const updateAlmacen = await Almacen.findByIdAndUpdate(
			id_almacen,
			{
				$set: { estantes: newarray },
				$currentDate: { lastModified: true }
		    }
		)
		res.json({updateAlmacen})


	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el almacén',
		})
	}
})


module.exports = app
