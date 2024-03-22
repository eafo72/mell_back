/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Pedidos = require('../models/Pedidos') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const Stock = require('../models/Stock')
const Apartado = require('../models/Apartado')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authorization')
const mailer = require('../controller/mailController')

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


// Checar si hay stock suficiente para surtir el pedido
app.post('/checkStock', async (req, res) => {
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

	
	try {

		//primero revisamos si hay existencia de cada producto
		for(let i=0; i < descripcion.length; i++){

			//primer filtro si existe el codigo y hay stock pero sin considerar aun los apartados			
			const ifAvailableOne = await Stock.find({ codigo: descripcion[i]['codigo'], stock: {$gte : descripcion[i]['cantidad'] } });
			  
			if (ifAvailableOne.length == 0) {
				res.json({
					disponible: false,
					msg: "El producto " + descripcion[i]['codigo'] + " no tiene el stock necesario para este pedido",
				})
				return;
			}

			//aqui faltaria que recorriera todo el arreglo de productos ya que puede haber en varios almacenes
			//segundo filtro calcular stock - apartado y ver si alcanza
			const calculo = (ifAvailableOne[0].stock - ifAvailableOne[0].apartado) -  descripcion[i]['cantidad'];
						  
			if (calculo < 0) {
				res.json({
					disponible: false,
					msg: "El producto " + descripcion[i]['codigo'] + " no tiene el stock necesario para este pedido",
				})
				return;
			}
		}

		res.json({
			disponible: true,
			msg: "Stock suficiente",
		})
		
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error revisando los datos'+error,
		})
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


		/*
		ya revisamos stock en el endpoint de arriba antes de comprar
		//primero revisamos si hay existencia de cada producto
		for(let i=0; i < descripcion.length; i++){

			//primer filtro si existe el codigo y hay stock pero sin considerar aun los apartados			
			const ifAvailableOne = await Stock.find({ codigo: descripcion[i]['codigo'], stock: {$gte : descripcion[i]['cantidad'] } });
			  
			if (ifAvailableOne.length == 0) {
			  	res.status(500).json({
					msg: "El producto " + descripcion[i]['codigo'] + " no tiene el stock necesario para este pedido",
				});
				return;
			}

			//aqui faltaria que recorriera todo el arreglo de productos ya que puede haber en varios almacenes
			//segundo filtro calcular stock - apartado y ver si alcanza
			const calculo = (ifAvailableOne[0].stock - ifAvailableOne[0].apartado) -  descripcion[i]['cantidad'];
			
			  
			if (calculo < 0) {
			  	res.status(500).json({
					msg: "El producto " + descripcion[i]['codigo'] + " no tiene el stock necesario para este pedido",
				});
				return;
			}
		}
		*/

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
        
		const id_pedido = nuevoPedido._id;


		//apartamos cada producto
		for(let i=0; i < descripcion.length; i++){

			//buscamos en stock  
			const stock_single = await Stock.find({ codigo: descripcion[i]['codigo'], stock: {$gte : descripcion[i]['cantidad'] } });
		  

			const id_almacen  = stock_single[0].id_almacen;
			const estante  = stock_single[0].estante;
			const idoldapartado  = stock_single[0]._id;
			const oldapartado = stock_single[0].apartado;
			const newapartado = oldapartado + descripcion[i]['cantidad'];

			//actualizamos apartados
			const updateStock = await Stock.findByIdAndUpdate(idoldapartado,{
				apartado:newapartado
			},{new:true});

			//creamos registro de apartado
			const nuevoApartado = await Apartado.create({
				id_almacen,
				id_pedido,
				estante,
				codigo_producto:descripcion[i]['codigo_producto'],
				codigo_talla:descripcion[i]['codigo_talla'],
				codigo_color:descripcion[i]['codigo_color'],
				codigo:descripcion[i]['codigo'],
				apartado:descripcion[i]['cantidad'],
				status:"Pendiente"
			})
		
		}	

		


		//mandamos correo a mell y al cliente
		let details = "";
		for(let i=0; i < descripcion.length; i++){
			details += `<p>${descripcion[i]['nombre_producto']} Cantidad: ${descripcion[i]['cantidad']}  Precio: $ ${descripcion[i]['precio']}  Total: $ ${descripcion[i]['total']}</p>`;
		}
		

		const messageToMell = {
			from: process.env.MAIL, // sender address
			to: process.env.MAIL, // list of receivers
			subject: "Un cliente ha realizado una compra", // Subject line
			text: "", // plain text body
			html: `<p><strong>Fecha: <strong>${date}</p>
			       <p><strong>Forma de entrega: <strong>${forma_entrega}</p>
				   <p><strong>Entregar a: <strong>${entregar_a}</p>
				   <p><strong>Dirección: <strong> ${direccion_entrega}</p>
				   <p><strong>Teléfono: <strong> ${telefono}</p>
				   <p><strong>Correo: <strong> ${correo}</p>
				   <p><strong>Subtotal: <strong> ${subtotal}</p>
				   <p><strong>Descuento: <strong> ${descuento}</p>
				   <p><strong>I.V.A: <strong> ${iva}</p>
				   <p><strong>Total: <strong> ${total}</p>
				   <p><strong>Descripcion: <strong> ${details}</p>`, // html body
		}

		await mailer.sendMail(messageToMell);

		if(correo != null){
			const messageToClient = {
				from: process.env.MAIL, // sender address
				to: correo, // list of receivers
				subject: "Estamos preparando tu pedido", // Subject line
				text: "", // plain text body
				html: `<p><strong>Fecha: <strong>${date}</p>
					   <p><strong>Forma de entrega: <strong>${forma_entrega}</p>
					   <p><strong>Entregar a: <strong>${entregar_a}</p>
					   <p><strong>Dirección: <strong> ${direccion_entrega}</p>
					   <p><strong>Teléfono: <strong> ${telefono}</p>
					   <p><strong>Correo: <strong> ${correo}</p>
					   <p><strong>Subtotal: <strong> ${subtotal}</p>
					   <p><strong>Descuento: <strong> ${descuento}</p>
					   <p><strong>I.V.A: <strong> ${iva}</p>
					   <p><strong>Total: <strong> ${total}</p>
					   <p><strong>Descripcion: <strong> ${details}</p>`, // html body
			}
			await mailer.sendMail(messageToClient);
		}	
		

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
				estatus_pago:1,
				parcialidades:1
			},
			
		)

        res.json({ventas})

	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos '+error })
	}
})

module.exports = app
