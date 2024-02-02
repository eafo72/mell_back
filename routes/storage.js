/* Importing the express module and creating an instance of it. */
const express = require("express");
const app = express.Router();
const Almacen = require("../models/Almacen");
const Entrada = require("../models/Entrada");
const Salida = require("../models/Salida");
const Producto = require("../models/Producto");
const Stock = require("../models/Stock");
const Apartado = require("../models/Apartado");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authorization");

const ObjectId = require("mongodb").ObjectId;

// LISTA
app.get("/obtener", async (req, res) => {
  try {
    const almacenes = await Almacen.find({});
    res.json({ almacenes });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
  }
});

// SINGLE
app.get("/single/:id", async (req, res) => {
  try {
    const single = await Almacen.findById(req.params.id);
    res.json({ single });
  } catch (error) {
    res
      .status(500)
      .json({
        msg:
          "Hubo un error obteniendo los datos del id " +
          req.params.id +
          " error: " +
          error,
      });
  }
});

// CREAR
app.post("/crear", async (req, res) => {
  const { nombre } = req.body;

  try {
    const ifExist = await Almacen.find({ nombre: nombre });

    if (ifExist.length > 0) {
      res.status(500).json({
        msg: "El almacén " + nombre + " ya existe",
      });
    } else {
      const nuevoAlmacen = await Almacen.create({
        nombre,
      });
      res.json(nuevoAlmacen);
    }
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error guardando los datos" + error,
    });
  }
});

// ACTUALIZAR
app.put("/actualizar", async (req, res) => {
  const { id, nombre } = req.body;
  try {
    const ifExist = await Almacen.find({ nombre: nombre, _id: { $ne: id } });

    if (ifExist.length > 0) {
      res.status(500).json({
        msg: "El almacén " + nombre + " ya existe",
      });
    } else {
      const updateAlmacen = await Almacen.findByIdAndUpdate(
        id,
        {
          nombre,
        },
        { new: true }
      );
      res.json({ updateAlmacen });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error actualizando el almacén",
    });
  }
});

// BORRAR
app.post("/borrar", async (req, res) => {
  const { id } = req.body;

  try {
    const deleteAlmacen = await Almacen.findByIdAndRemove({ _id: id });
    res.json(deleteAlmacen);
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error borrando el almacén",
    });
  }
});

///////////////////////////////////////////////// STOCK

//stock por almacen
app.get("/stock/:id", async (req, res) => {
  try {
    //const stock = await Producto.find({almacen: { $elemMatch: { id_almacen: req.params.id }}});

    const stock = await Stock.aggregate([
      {
        $match: {
          id_almacen: ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "productos",
          localField: "codigo_producto",
          foreignField: "codigo",
          as: "datos_producto",
        },
      },
	  {
        $unwind: "$datos_producto"
      },
      {
        $lookup: {
          from: "tallas",
          localField: "codigo_talla",
          foreignField: "codigo",
          as: "datos_talla",
        },
      },
	  {
        $unwind: "$datos_talla"
      },
      {
        $lookup: {
          from: "colors",
          localField: "codigo_color",
          foreignField: "codigo",
          as: "datos_color",
        },
      },
      {
        $unwind: "$datos_color",
      },
    ]);

    res.json({ stock });
  } catch (error) {
    res
      .status(500)
      .json({
        msg:
          "Hubo un error obteniendo los datos del id " +
          req.params.id +
          " error: " +
          error,
      });
  }
});

//stock por id stock
app.get("/stock-single/:id", async (req, res) => {
  try {
    const single = await Stock.findById(req.params.id);
    
    res.json({ single });

  } catch (error) {
    res
      .status(500)
      .json({
        msg:
          "Hubo un error obteniendo los datos del id " +
          req.params.id +
          " error: " +
          error,
      });
  }
});

//stock por codigo producto
app.get("/stock-codigo/:codigo", async (req, res) => {
  try {
    const stock = await Stock.aggregate(
      [
        {
          $match: {
            codigo : req.params.codigo,
          },
        },
        {
          $group:
            {
              _id : null,
              stockTotal: { $sum: "$stock" },
            }
        }
      ]
      );
    
    res.json({ stock });

  } catch (error) {
    res
      .status(500)
      .json({
        msg:
          "Hubo un error obteniendo los datos del id " +
          req.params.codigo +
          " error: " +
          error,
      });
  }
});





app.put("/stock-editar", async (req, res) => {
  const { id, stock, apartado, estropeado } = req.body;
  try {
    const updateStock = await Stock.findByIdAndUpdate(id, {
      $set: { 
        stock: stock, 
        apartado:apartado,
        estropeado:estropeado
      },
      $currentDate: { lastModified: true },
    });
    res.json({ updateStock });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error actualizando el almacén",
    });
  }
});

//stock borrar
app.post("/stock-borrar", async (req, res) => {
  const { id } = req.body;

  try {
    const deleteStock = await Stock.findByIdAndRemove({ _id: id });
    res.json(deleteStock);
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error borrando el stock",
    });
  }
});


//////////////////////////////////////////////////// APARTADOS (TODOS)


app.get("/apartado/:id", async (req, res) => {
  try {
    
    const apartado = await Apartado.aggregate([
      {
        $match: {
          id_almacen: ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "productos",
          localField: "codigo_producto",
          foreignField: "codigo",
          as: "datos_producto",
        },
      },
	  {
        $unwind: "$datos_producto"
      },
      {
        $lookup: {
          from: "tallas",
          localField: "codigo_talla",
          foreignField: "codigo",
          as: "datos_talla",
        },
      },
	  {
        $unwind: "$datos_talla"
      },
      {
        $lookup: {
          from: "colors",
          localField: "codigo_color",
          foreignField: "codigo",
          as: "datos_color",
        },
      },
      {
        $unwind: "$datos_color",
      },
    ]);

    res.json({ apartado });

  } catch (error) {
    res
      .status(500)
      .json({
        msg:
          "Hubo un error obteniendo los datos del id " +
          req.params.id +
          " error: " +
          error,
      });
  }
});

// APARTADOS (solo los que no se han procesado)
app.get("/apartadoOrdenDia/:id", async (req, res) => {
  try {
    
    const apartadoOrdenDia = await Apartado.aggregate([
      {
        $match: {
          id_almacen: ObjectId(req.params.id),
          status:"Pendiente"
        },
      },
      {
        $lookup: {
          from: "productos",
          localField: "codigo_producto",
          foreignField: "codigo",
          as: "datos_producto",
        },
      },
	  {
        $unwind: "$datos_producto"
      },
      {
        $lookup: {
          from: "tallas",
          localField: "codigo_talla",
          foreignField: "codigo",
          as: "datos_talla",
        },
      },
	  {
        $unwind: "$datos_talla"
      },
      {
        $lookup: {
          from: "colors",
          localField: "codigo_color",
          foreignField: "codigo",
          as: "datos_color",
        },
      },
      {
        $unwind: "$datos_color",
      },
    ]);

    res.json({ apartadoOrdenDia });

  } catch (error) {
    res
      .status(500)
      .json({
        msg:
          "Hubo un error obteniendo los datos del id " +
          req.params.id +
          " error: " +
          error,
      });
  }
});

///////////////////////////////////////////////////////////// ESTROPEADOS
//estropeados por almacen
app.get("/estropeados/:id", async (req, res) => {
  try {
    
    const estropeados = await Stock.aggregate([
      {
        $match: {
          id_almacen: ObjectId(req.params.id),
          estropeado: { $gt: 0 } 
        },
      },
      {
        $lookup: {
          from: "productos",
          localField: "codigo_producto",
          foreignField: "codigo",
          as: "datos_producto",
        },
      },
	  {
        $unwind: "$datos_producto"
      },
      {
        $lookup: {
          from: "tallas",
          localField: "codigo_talla",
          foreignField: "codigo",
          as: "datos_talla",
        },
      },
	  {
        $unwind: "$datos_talla"
      },
      {
        $lookup: {
          from: "colors",
          localField: "codigo_color",
          foreignField: "codigo",
          as: "datos_color",
        },
      },
      {
        $unwind: "$datos_color",
      },
    ]);

    res.json({ estropeados });
  } catch (error) {
    res
      .status(500)
      .json({
        msg:
          "Hubo un error obteniendo los datos del id " +
          req.params.id +
          " error: " +
          error,
      });
  }
});

/*
app.get("/estropeados/:id", async (req, res) => {
  try {
    const estropeados = await Producto.find({
      almacen: { $elemMatch: { id_almacen: req.params.id } },
      almacen: { $elemMatch: { estropeado: { $gt: 0 } } },
    });
    res.json({ estropeados });
  } catch (error) {
    res
      .status(500)
      .json({
        msg:
          "Hubo un error obteniendo los datos del id " +
          req.params.id +
          " error: " +
          error,
      });
  }
});
*/
/////////////////////////////////////////////////// ENTRADAS ////////////////////////////////////////////////////////////

// LISTA
app.get("/entradas/:id", async (req, res) => {
  
  try {
    
	const entradas = await Entrada.aggregate([
		{
		  $match: {
			id_almacen: ObjectId(req.params.id),
		  },
		},
		{
		  $lookup: {
			from: "productos",
			localField: "codigo_producto",
			foreignField: "codigo",
			as: "datos_producto",
		  },
		},
		{
		  $unwind: "$datos_producto"
		},
		{
		  $lookup: {
			from: "tallas",
			localField: "codigo_talla",
			foreignField: "codigo",
			as: "datos_talla",
		  },
		},
		{
		  $unwind: "$datos_talla"
		},
		{
		  $lookup: {
			from: "colors",
			localField: "codigo_color",
			foreignField: "codigo",
			as: "datos_color",
		  },
		},
		{
		  $unwind: "$datos_color",
		},
	  ]);
  
	  res.json({ entradas });



  } catch (error) {
    res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
  }
});

// SINGLE
app.get("/entrada-single/:id", async (req, res) => {
	try {
	  const single = await Entrada.aggregate([
		{
			$match: {
			  _id: ObjectId(req.params.id),
			},
		  },
		  {
			$lookup: {
			  from: "productos",
			  localField: "codigo_producto",
			  foreignField: "codigo",
			  as: "datos_producto",
			},
		  },
		  {
			$unwind: "$datos_producto"
		  },
		  {
			$lookup: {
			  from: "tallas",
			  localField: "codigo_talla",
			  foreignField: "codigo",
			  as: "datos_talla",
			},
		  },
		  {
			$unwind: "$datos_talla"
		  },
		  {
			$lookup: {
			  from: "colors",
			  localField: "codigo_color",
			  foreignField: "codigo",
			  as: "datos_color",
			},
		  },
		  {
			$unwind: "$datos_color",
		  },
	  ]);
	  res.json({ single });
	} catch (error) {
	  res
		.status(500)
		.json({
		  msg:
			"Hubo un error obteniendo los datos del id " +
			req.params.id +
			" error: " +
			error,
		});
	}
  });

// ALTA DE ENTRADA
app.post("/entrada-alta", async (req, res) => {
  const {
    producto,
    talla,
    color,
    fechaEntrada,
    cantidad,
    proveedor,
    id_almacen,
    estante,
  } = req.body;

  const codigo = producto + "-" + talla + "-" + color;

  try {
    const single = await Stock.find({
      codigo: codigo,
      id_almacen: id_almacen,
      estante: estante,
    });

    if (single.length > 0) {
      const oldstock = single[0].stock;
      const newstock = oldstock + parseInt(cantidad);

      const nuevoStock = await Stock.updateOne(
        { codigo: codigo, id_almacen: id_almacen, estante: estante },
        {
          $set: { stock: newstock },
          $currentDate: { lastModified: true },
        }
      );
    } else {
      const nuevoStock = await Stock.create({
        id_almacen,
        estante,
        codigo_producto: producto,
        codigo_talla: talla,
        codigo_color: color,
        codigo,
        stock: cantidad,
        apartado: 0,
        estropeado: 0,
      });
    }

    const nuevaEntradaAlmacen = await Entrada.create({
      codigo,
	  codigo_producto: producto,
	  codigo_talla: talla,
	  codigo_color: color,
      fechaEntrada,
      cantidad,
      proveedor,
      id_almacen,
      estante,
    });
    res.json(nuevaEntradaAlmacen);
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error guardando los datos" + error,
    });
  }
});

// EDITAR
app.put("/entrada-editar", async (req, res) => {
	const { 
		id, producto, talla, color, fechaEntrada, cantidad, cantidadAnterior, proveedor, id_almacen, nombre_almacen, estante
	 } = req.body;
  
	const codigo = producto + "-" + talla + "-" + color;

	try {
	   //buscamos en stock  PEROOOO TENDRIAMOS QUE BUSCAR EL PRODUCTO ANTERIOR NO EL QUE ESTA LLEGANDO COMO CAMBIO
	  	const stock_single = await Stock.find({
		  codigo: codigo,
		  id_almacen: id_almacen,
		  estante: estante,
		});
	
	  const oldstock = stock_single[0].stock;
  
	  const newstock = oldstock + cantidadAnterior;
  
	  //devolvemos lo que descontamos
	  const updateStock = await Stock.findOneAndUpdate(
		  {
			  codigo: codigo,
			  id_almacen: id_almacen,
			  estante: estante,
		  },
		  {
			stock:newstock,
		  },
		  { new: true }
		);
		
	  //descontar el nuevo producto dl stock
	  		  
	  //update de la entrada
	  




  
	} catch (error) {
	  res.status(500).json({
		msg: "Hubo un error borrando la entrada de almacén "+error,
	  });
	}
  });

// BORRAR
app.post("/entrada-borrar", async (req, res) => {
  const { id } = req.body;

  try {
	//primero buscamos los datos de la entrada para regresar la cantidad a stock
	const entrada_single = await Entrada.find({_id: id});

	const id_almacen = entrada_single[0].id_almacen;
	const estante = entrada_single[0].estante;
	const codigo = entrada_single[0].codigo;
	const cantidad = entrada_single[0].cantidad;

	const stock_single = await Stock.find({
		codigo: codigo,
		id_almacen: id_almacen,
		estante: estante,
	  });
  
	const oldstock = stock_single[0].stock;

	const newstock = oldstock - cantidad;

	const updateStock = await Stock.findOneAndUpdate(
        {
			codigo: codigo,
			id_almacen: id_almacen,
			estante: estante,
		},
        {
          stock:newstock,
        },
        { new: true }
      );
      

    const deleteAlmacenEntrada = await Entrada.findByIdAndRemove({ _id: id });
    res.json(deleteAlmacenEntrada);

  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error borrando la entrada de almacén "+error,
    });
  }
});


/////////////////////////////////////////////////// SALIDAS ////////////////////////////////////////////////////////////

// LISTA
app.get("/salidas/:id", async (req, res) => {
  
  try {
    
	const salidas = await Salida.aggregate([
		{
		  $match: {
			id_almacen: ObjectId(req.params.id),
		  },
		},
		{
		  $lookup: {
			from: "productos",
			localField: "codigo_producto",
			foreignField: "codigo",
			as: "datos_producto",
		  },
		},
		{
		  $unwind: "$datos_producto"
		},
		{
		  $lookup: {
			from: "tallas",
			localField: "codigo_talla",
			foreignField: "codigo",
			as: "datos_talla",
		  },
		},
		{
		  $unwind: "$datos_talla"
		},
		{
		  $lookup: {
			from: "colors",
			localField: "codigo_color",
			foreignField: "codigo",
			as: "datos_color",
		  },
		},
		{
		  $unwind: "$datos_color",
		},
	  ]);
  
	  res.json({ salidas });



  } catch (error) {
    res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
  }
});

// ALTA DE SALIDA
app.post("/salida-alta", async (req, res) => {
  const {
    id_apartado
  } = req.body;

  try {

    
    //buscamos en apartados la info
    const apartado = await Apartado.find({
      _id: id_apartado,
    });

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); 

    const producto = apartado[0].codigo_producto;
    const talla = apartado[0].codigo_talla;
    const color = apartado[0].codigo_color;
    const fechaSalida = date;
    const cantidad = apartado[0].apartado;
    const id_almacen = apartado[0].id_almacen;
    const estante = apartado[0].estante;
    const id_pedido = apartado[0].id_pedido;

    const codigo = producto + "-" + talla + "-" + color;

    const single = await Stock.find({
      codigo: codigo,
      id_almacen: id_almacen,
      estante: estante,
    });

    if (single.length > 0) {
      const oldstock = single[0].stock;
      const newstock = oldstock - parseInt(cantidad);

      const oldapartado = single[0].apartado;
      const newapartado = oldapartado - parseInt(cantidad);


      const nuevoStock = await Stock.updateOne(
        { codigo: codigo, id_almacen: id_almacen, estante: estante },
        {
          $set: { stock: newstock, apartado: newapartado },
          $currentDate: { lastModified: true },
        }
      );
    } else {
      const nuevoStock = await Stock.create({
        id_almacen,
        estante,
        codigo_producto: producto,
        codigo_talla: talla,
        codigo_color: color,
        codigo,
        stock: cantidad * (-1),
        apartado: 0,
        estropeado: 0,
      });
    }

    const nuevaSalidaAlmacen = await Salida.create({
      codigo,
	    codigo_producto: producto,
	    codigo_talla: talla,
	    codigo_color: color,
      fechaSalida,
      cantidad,
      id_almacen,
      estante,
      id_apartado,
      id_pedido
    });
    

    //actualizamos el status del apartado
    const updateAlmacen = await Apartado.findByIdAndUpdate(
      id_apartado,
      {
        status:"Entregado"
      },
      { new: true }
    );

    res.json(updateAlmacen);

  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error guardando los datos" + error,
    });
  }
});

















//////////////////////////////////////////////////////////////// ESTANTES  ///////////////////////////////////////////////////////////////////////////
// Alta
app.put("/estante-alta", async (req, res) => {
  const { id_almacen, nombre } = req.body;
  try {
    const updateAlmacen = await Almacen.findByIdAndUpdate(
      id_almacen,
      { $push: { estantes: { nombre: nombre } } },
      { upsert: true, new: true }
    );
    res.json({ updateAlmacen });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error actualizando el almacén",
    });
  }
});

// Editar
app.put("/estante-editar", async (req, res) => {
  const { id_almacen, nombre_anterior, nombre_nuevo } = req.body;
  try {
    const single = await Almacen.findById(id_almacen);

    const estantes = single.estantes;

    const newarray = [];

    for (let i = 0; i < estantes.length; i++) {
      if (estantes[i].nombre == nombre_anterior) {
        newarray.push({
          nombre: nombre_nuevo,
        });
      } else {
        newarray.push({
          nombre: estantes[i].nombre,
        });
      }
    }

    const updateAlmacen = await Almacen.findByIdAndUpdate(id_almacen, {
      $set: { estantes: newarray },
      $currentDate: { lastModified: true },
    });
    res.json({ updateAlmacen });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error actualizando el almacén",
    });
  }
});

// borrar
app.put("/estante-borrar", async (req, res) => {
  const { id_almacen, nombre } = req.body;
  try {
    const single = await Almacen.findById(id_almacen);

    const estantes = single.estantes;

    const newarray = [];

    for (let i = 0; i < estantes.length; i++) {
      if (estantes[i].nombre != nombre) {
        newarray.push({
          nombre: estantes[i].nombre,
        });
      }
    }

    const updateAlmacen = await Almacen.findByIdAndUpdate(id_almacen, {
      $set: { estantes: newarray },
      $currentDate: { lastModified: true },
    });
    res.json({ updateAlmacen });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error actualizando el almacén",
    });
  }
});

module.exports = app;
