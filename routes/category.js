/* Importing the express module and creating an instance of it. */
const express = require("express");
const app = express.Router();
const Categoria = require("../models/Categoria"); // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const imageController = require("../controller/imageController");
let FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authorization");

// LISTA
app.get("/obtener", async (req, res) => {
  try {
    const categorias = await Categoria.find({});
    res.json({ categorias });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
  }
});

// SINGLE
app.get("/single/:id", async (req, res) => {
  try {
    const single = await Categoria.findById(req.params.id);
    res.json({ single });
  } catch (error) {
    res.status(500).json({
      msg:
        "Hubo un error obteniendo los datos del id " +
        req.params.id +
        " error: " +
        error,
    });
  }
});

// CREAR
app.post("/crear", imageController.upload, async (req, res) => {
  const { nombre } = req.body;

  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  let tituloImage = `${date}-${req.files[0].originalname}`;
  let thumb = `${process.env.URLFRONT}/categorias/${tituloImage}`;

  let file = fs.readFileSync(req.files[0].path, { encoding: "base64" });

  let formdata = new FormData();
  formdata.append("thumb", file);
  formdata.append("nombre_thumb", tituloImage);

  let response = await fetch(
    `${process.env.URLFRONT}/categorias/api_categories_base64.php`,
    {
      method: "POST",
      body: formdata,
    }
  );

  let result = await response.json();

  if (result.error) {
    return res.status(500).json({
      error: true,
      msg: "No se agregó la foto, inténtalo nuevamente",
      details: result.error,
    });
  }

  try {
    const ifExist = await Categoria.find({ nombre: nombre });

    if (ifExist.length > 0) {
      res.status(500).json({
        msg: "La categoría " + nombre + " ya existe",
      });
    } else {
      const nuevaCategoria = await Categoria.create({
        nombre,
        imagen: thumb,
      });
      res.json(nuevaCategoria);
    }
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error guardando los datos" + error,
    });
  }
});

// ACTUALIZAR
app.put("/actualizar", imageController.upload, async (req, res) => {
  const { id, nombre } = req.body;

  if (req.files.length != 0) {
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    let tituloImage = `${date}-${req.files[0].originalname}`;
    let thumb = `${process.env.URLFRONT}/categorias/${tituloImage}`;

    let file = fs.readFileSync(req.files[0].path, { encoding: "base64" });

    let formdata = new FormData();
    formdata.append("thumb", file);
    formdata.append("nombre_thumb", tituloImage);

    let response = await fetch(
      `${process.env.URLFRONT}/categorias/api_categories_base64.php`,
      {
        method: "POST",
        body: formdata,
      }
    );

    let result = await response.json();

    if (result.error) {
      return res.status(500).json({
        error: true,
        msg: "No se agregó la foto, inténtalo nuevamente",
        details: result.error,
      });
    }

	try {
		const ifExist = await Categoria.find({
		  nombre: nombre,
		  _id: { $ne: id },
		});
  
		if (ifExist.length > 0) {
		  res.status(500).json({
			msg: "La categoría " + nombre + " ya existe",
		  });
		} else {
		  const updateCategoria = await Categoria.findByIdAndUpdate(
			id,
			{
			  nombre,
			  imagen:thumb,
			},
			{ new: true }
		  );
		  res.json({ updateCategoria });
		}
	  } catch (error) {
		res.status(500).json({
		  msg: "Hubo un error actualizando la Categoría",
		});
	  }

  } else {
    try {
      const ifExist = await Categoria.find({
        nombre: nombre,
        _id: { $ne: id },
      });

      if (ifExist.length > 0) {
        res.status(500).json({
          msg: "La categoría " + nombre + " ya existe",
        });
      } else {
        const updateCategoria = await Categoria.findByIdAndUpdate(
          id,
          {
            nombre
          },
          { new: true }
        );
        res.json({ updateCategoria });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Hubo un error actualizando la Categoría",
      });
    }
  }
});

// BORRAR
app.post("/borrar", async (req, res) => {
  const { id } = req.body;

  try {
    const deleteCategoria = await Categoria.findByIdAndRemove({ _id: id });
    res.json(deleteCategoria);
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error borrando la Categoría",
    });
  }
});

module.exports = app;
