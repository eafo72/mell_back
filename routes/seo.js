/* Importing the express module and creating an instance of it. */
const express = require("express");
const app = express.Router();
const Seo = require("../models/Seo"); // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const imageController = require("../controller/imageController");
let FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authorization");


// SINGLE
app.get("/single/:id", async (req, res) => {
  try {
    const single = await Seo.findById(req.params.id);
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

// ACTUALIZAR
app.put("/actualizar", async (req, res) => {
  
  const { id, title, words, description } = req.body;

  try {
	
		  const updateSeo = await Seo.findByIdAndUpdate(
			id,
			{
			  title,
			  words,
        description
			},
			{ new: true }
		  );
		  res.json({ updateSeo });
	
	  } catch (error) {
		res.status(500).json({
		  msg: "Hubo un error actualizando el Seo",
		});
	  }

  
});


module.exports = app;
