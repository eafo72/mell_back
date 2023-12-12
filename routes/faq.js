/* Importing the express module and creating an instance of it. */
const express = require("express");
const app = express.Router();
const Faq = require("../models/Faq"); // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
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
    const faqs = await Faq.find({});
    res.json({ faqs });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
  }
});

// SINGLE
app.get("/single/:id", async (req, res) => {
  try {
    const single = await Faq.findById(req.params.id);
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
app.post("/crear", async (req, res) => {
  const { pregunta, respuesta } = req.body;
  
  try {
    
      const nuevaFaq = await Faq.create({
        pregunta,
        respuesta
      });
      res.json(nuevaFaq);
    
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error guardando los datos" + error,
    });
  }
});

// ACTUALIZAR
app.put("/actualizar", async (req, res) => {
  
  const { id, pregunta, respuesta } = req.body;

   console.log(id); 
   console.log(pregunta); 
   console.log(respuesta); 

  try {
	
		  const updateFaq = await Faq.findByIdAndUpdate(
			id,
			{
			  pregunta,
			  respuesta
			},
			{ new: true }
		  );
		  res.json({ updateFaq });
	
	  } catch (error) {
		res.status(500).json({
		  msg: "Hubo un error actualizando la Faq",
		});
	  }

  
});

// BORRAR
app.post("/borrar", async (req, res) => {
  const { id } = req.body;

  try {
    const deleteFaq = await Faq.findByIdAndRemove({ _id: id });
    res.json(deleteFaq);
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error borrando la Faq",
    });
  }
});

module.exports = app;
