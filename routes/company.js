/* Importing the express module and creating an instance of it. */
const express = require("express");
const app = express.Router();
const Empresa = require("../models/Empresa"); 


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
    const empresas = await Empresa.find({});
    res.json({ empresas });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
  }
});

// SINGLE
app.get("/single/:id", async (req, res) => {
  try {
    const single = await Empresa.findById(req.params.id);
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
  const { nombre } = req.body;
  
  try {
   
    const nuevaEmpresa = await Empresa.create({
        nombre
    });
    res.json(nuevaEmpresa);
    
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error guardando los datos" + error,
    });
  }
});

// ACTUALIZAR
app.put("/actualizar", async (req, res) => {
  const { id, slogan, aviso, terminos } = req.body;

	try {
	
		  const updateEmpresa = await Empresa.findByIdAndUpdate(
			id,
			{
        slogan,
			  aviso,
			  terminos
			},
			{ new: true }
		  );

      res.json(updateEmpresa);

     
	} catch (error) {
		  res.status(500).json({
		    msg: "Hubo un error actualizando la Empresa "+error,
		  });
	}

});

// BORRAR
app.post("/borrar", async (req, res) => {
  const { id } = req.body;

  try {
    const deleteEmpresa = await Empresa.findByIdAndRemove({ _id: id });
    res.json(deleteEmpresa);
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error borrando la Empresa",
    });
  }
});

module.exports = app;
