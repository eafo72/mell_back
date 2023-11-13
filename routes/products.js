/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Producto = require('../models/Producto') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const imageController = require('../controller/imageController')
let FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')

// LISTA
app.get('/obtener', async (req, res) => {
	try {
		const productos = await Producto.find({})
        res.json({productos})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// SINGLE
app.get('/single/:id', async (req, res) => {
			
	try {
		const single = await Producto.findById(req.params.id) 
		res.json({single})
		

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos del id '+id+' error: '+error })
	}

})


// CREAR
app.post('/crear', async (req, res) => {
	const { 
		nombre,
		descripcion,
		codigo_comun,
		genero,
		edad,
		categoria,
		subcategoria,
		marca,
		talla,
		color,
		proveedor,
		foto_principal,
		fotos_carrusel,
		estatus,
		precio,
		almacen,
		estante,
		stock,
		apartado,
		estropeado,
		calificacion
	} = req.body 

	try {

		const ifExist = await Producto.find( { nombre: nombre } )

		if(ifExist.length > 0){

			res.status(500).json({
				msg: 'El producto '+nombre+' ya existe',
			})	

		}else{

        	const nuevoProducto = await Producto.create({
			nombre,
			descripcion,
			codigo_comun,
			genero,
			edad,
			categoria,
			subcategoria,
			marca,
			talla,
			color,
			proveedor,
			foto_principal,
			fotos_carrusel,
			estatus,
			precio,
			almacen,
			estante,
			stock,
			apartado,
			estropeado,
			calificacion
			})
        	res.json(nuevoProducto)
		}

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error guardando los datos'+error,
		})
	}
})

// ACTUALIZAR
//app.put('/actualizar', auth, async (req, res) => {
app.put('/actualizar', async (req, res) => {
    const { 
		id,
		nombre,
		descripcion,
		codigo_comun,
		genero,
		edad,
		categoria,
		subcategoria,
		marca,
		talla,
		color,
		proveedor,
		foto_principal,
		fotos_carrusel,
		estatus,
		precio,
		almacen,
		estante,
		stock,
		apartado,
		estropeado,
		calificacion
	 } = req.body 
	try {

		const ifExist = await Producto.find( { nombre: nombre, _id: { $ne: id } } )

		if(ifExist.length > 0){
			
			res.status(500).json({
				msg: 'El producto '+nombre+' ya existe',
			})	

		}else{

    		const updateProducto = await Producto.findByIdAndUpdate(id,{
			nombre,
			descripcion,
			codigo_comun,
			genero,
			edad,
			categoria,
			subcategoria,
			marca,
			talla,
			color,
			proveedor,
			foto_principal,
			fotos_carrusel,
			estatus,
			precio,
			almacen,
			estante,
			stock,
			apartado,
			estropeado,
			calificacion
			},{new:true})
        	res.json({updateProducto})
		}	

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el Producto '+error,
		})
	}
})

app.put('/foto',imageController.upload, async (req, res) => {
    const { 
		id,
	 } = req.body 

	let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

	let tituloImage = `${date}-${req.files[0].originalname}`;
    let thumb = `${process.env.URLFRONT}/productos/${tituloImage}`;

    let file = fs.readFileSync(req.files[0].path, { encoding: "base64" });

    let formdata = new FormData();
    formdata.append('thumb', file);
    formdata.append('nombre_thumb', tituloImage);

    let response = await fetch(`${process.env.URLFRONT}/productos/api_products_base64.php`, {
        method: 'POST',
    	body: formdata
    });

    let result = await response.json();

    if (result.error) {
        return res.status(500).json({ error: true, msg: "No se agregaron las fotos, intenterlo nuevamente", details: result.error })
    }


	try {

   	const updateProducto = await Producto.findByIdAndUpdate(id,
		{$push: {"fotos_carrusel": {image: thumb}}},
        {upsert: true, new : true})
        res.json({updateProducto})
			
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando el Producto '+error,
		})
	}
})

// BORRAR
app.post('/borrar', async (req, res) => {
	const { id } = req.body

	try {
		const deleteProducto = await Producto.findByIdAndRemove({ _id: id })
		res.json(deleteProducto)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el Producto',
		})
	}
})

// BORRAR FOTO
app.post('/borrar-foto', async (req, res) => {
	const { id, photoindex } = req.body
	const parsedphotoindex = parseInt(photoindex);
	console.log(parsedphotoindex);


	try {
		//obtenemos el arreglo
		const single = await Producto.findById(id) 
		//console.log(single.fotos_carrusel);
		const fotos_carrusel = single.fotos_carrusel;
		fotos_carrusel.splice(parsedphotoindex,1)  
		
		const updateProducto = await Producto.findByIdAndUpdate(id,
			{ fotos_carrusel: fotos_carrusel}, 
			{new : true})
			res.json({updateProducto})

	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando la foto del Producto '+ error,
		})
	}
})

module.exports = app
