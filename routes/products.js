/* Importing the express module and creating an instance of it. */
const express = require("express");
const app = express.Router();
const Producto = require("../models/Producto"); // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
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
    const productos = await Producto.find({});
    res.json({ productos });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
  }
});

// SINGLE POR ID
app.get("/single/:id", async (req, res) => {
  try {
    const single = await Producto.findById(req.params.id);
    const categoria = single.categoria;

    const related_products = await Producto.find({categoria: categoria}).limit(5);

    res.json({ single, related_products });

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

// SINGLE POR CODIGO DE PRODUCTO
app.get("/single-codigo/:codigo", async (req, res) => {

  try {
    const single = await Producto.find({codigo:req.params.codigo});

    const categoria = single[0].categoria;

    const related_products = await Producto.find({categoria: categoria}).limit(5);

    res.json({ single, related_products });

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
  const {
    codigo,
    nombre,
    descripcion,
    genero,
    edad,
    categoria,
    subcategoria,
    marca,
    talla,
    color,
    name,
    imgbase64,
    proveedor,
    estatus,
    precio,
    calificacion,
  } = req.body;

  let today = new Date();
  let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  //let tituloImage = `${date}-${name}`;
  let file_extension = name.split(".").pop();
  let tituloImage = `${codigo}.${file_extension}`;
  let thumb = `${process.env.URLFRONT}/productos/${tituloImage}`;

  let formdata = new FormData();
  formdata.append("thumb", imgbase64);
  formdata.append("nombre_thumb", tituloImage);

  let response = await fetch(
    `${process.env.URLFRONT}/productos/api_products_base64.php`,
    {
      method: "POST",
      body: formdata,
    }
  );

  let result = await response.json();

  if (result.error) {
    return res
      .status(500)
      .json({
        error: true,
        msg: "No se agregó la foto, inténtalo nuevamente",
        details: result.error,
      });
  }

  try {
    const ifExist = await Producto.find({
      $or: [
        {
          nombre: nombre,
        },
        {
          codigo: codigo,
        },
      ],
    });

    if (ifExist.length > 0) {
      res.status(500).json({
        msg: "El nombre o código del producto ya existe",
      });
    } else {
      const nuevoProducto = await Producto.create({
        codigo,
        nombre,
        descripcion,
        genero,
        edad,
        categoria,
        subcategoria,
        marca,
        talla,
        color,
        proveedor,
        foto_principal: thumb,
        estatus,
        precio,
        calificacion,
      });
      res.json(nuevoProducto);
    }
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error guardando los datos" + error,
    });
  }
});

// ACTUALIZAR
//app.put('/actualizar', auth, async (req, res) => {
app.put("/actualizar", async (req, res) => {
  const {
    id,
    codigo,
    nombre,
    descripcion,
    genero,
    edad,
    categoria,
    subcategoria,
    marca,
    talla,
    color,
    name,
    imgbase64,
    proveedor,
    estatus,
    precio,
  } = req.body;

  if (imgbase64 != null) {
    let today = new Date();
    let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

    //let tituloImage = `${date}-${name}`;
    let file_extension = name.split(".").pop();
    let tituloImage = `${codigo}.${file_extension}`;
    let thumb = `${process.env.URLFRONT}/productos/${tituloImage}`;

    let formdata = new FormData();
    formdata.append("thumb", imgbase64);
    formdata.append("nombre_thumb", tituloImage);

    let response = await fetch(
      `${process.env.URLFRONT}/productos/api_products_base64.php`,
      {
        method: "POST",
        body: formdata,
      }
    );

    let result = await response.json();

    if (result.error) {
      return res
        .status(500)
        .json({
          error: true,
          msg: "No se agregó la foto, inténtalo nuevamente",
          details: result.error,
        });
    }

    try {
      const ifExist = await Producto.find({ nombre: nombre, _id: { $ne: id } });

      if (ifExist.length > 0) {
        res.status(500).json({
          msg: "El producto " + nombre + " ya existe",
        });
      } else {
        const updateProducto = await Producto.findByIdAndUpdate(
          id,
          {
            codigo,
            nombre,
            descripcion,
            genero,
            edad,
            categoria,
            subcategoria,
            marca,
            talla,
            color,
            proveedor,
            foto_principal: thumb,
            estatus,
            precio,
          },
          { new: true }
        );
        res.json({ updateProducto });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Hubo un error actualizando el Producto " + error,
      });
    }
  } else {
    try {
      const ifExist = await Producto.find({ nombre: nombre, _id: { $ne: id } });

      if (ifExist.length > 0) {
        res.status(500).json({
          msg: "El producto " + nombre + " ya existe",
        });
      } else {
        const updateProducto = await Producto.findByIdAndUpdate(
          id,
          {
            codigo,
            nombre,
            descripcion,
            genero,
            edad,
            categoria,
            subcategoria,
            marca,
            talla,
            color,
            proveedor,
            estatus,
            precio,
          },
          { new: true }
        );
        res.json({ updateProducto });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Hubo un error actualizando el Producto " + error,
      });
    }
  }
});

//recibe imagen desde files[]
app.put("/foto", imageController.upload, async (req, res) => {
  const { id } = req.body;

  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  let tituloImage = `${date}-${req.files[0].originalname}`;
  let thumb = `${process.env.URLFRONT}/productos/${tituloImage}`;

  let file = fs.readFileSync(req.files[0].path, { encoding: "base64" });

  let formdata = new FormData();
  formdata.append("thumb", file);
  formdata.append("nombre_thumb", tituloImage);

  let response = await fetch(
    `${process.env.URLFRONT}/productos/api_products_base64.php`,
    {
      method: "POST",
      body: formdata,
    }
  );

  let result = await response.json();

  if (result.error) {
    return res
      .status(500)
      .json({
        error: true,
        msg: "No se agregaron las fotos, intenterlo nuevamente",
        details: result.error,
      });
  }

  try {
    const updateProducto = await Producto.findByIdAndUpdate(
      id,
      { $push: { fotos_carrusel: { image: thumb } } },
      { upsert: true, new: true }
    );
    res.json({ updateProducto });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error actualizando el Producto " + error,
    });
  }
});

//recibe imagen base64
app.put("/fotobase64", async (req, res) => {
  const { id, name, imgbase64 } = req.body;

  let today = new Date();
  let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  let tituloImage = `${date}-${name}`;
  let thumb = `${process.env.URLFRONT}/productos/${tituloImage}`;

  let formdata = new FormData();
  formdata.append("thumb", imgbase64);
  formdata.append("nombre_thumb", tituloImage);

  let response = await fetch(
    `${process.env.URLFRONT}/productos/api_products_base64.php`,
    {
      method: "POST",
      body: formdata,
    }
  );

  let result = await response.json();

  if (result.error) {
    return res
      .status(500)
      .json({
        error: true,
        msg: "No se agregaron las fotos, intenterlo nuevamente",
        details: result.error,
      });
  }

  try {
    const updateProducto = await Producto.findByIdAndUpdate(
      id,
      { $push: { fotos_carrusel: { image: thumb } } },
      { upsert: true, new: true }
    );
    res.json({ updateProducto });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error actualizando el Producto " + error,
    });
  }
});

// BORRAR
app.post("/borrar", async (req, res) => {
  const { id } = req.body;

  try {
    const deleteProducto = await Producto.findByIdAndRemove({ _id: id });
    res.json(deleteProducto);
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error borrando el Producto",
    });
  }
});

// BORRAR FOTO
app.post("/borrar-foto", async (req, res) => {
  const { id, photoindex } = req.body;
  const parsedphotoindex = parseInt(photoindex);
  console.log(parsedphotoindex);

  try {
    //obtenemos el arreglo
    const single = await Producto.findById(id);
    //console.log(single.fotos_carrusel);
    const fotos_carrusel = single.fotos_carrusel;
    fotos_carrusel.splice(parsedphotoindex, 1);

    const updateProducto = await Producto.findByIdAndUpdate(
      id,
      { fotos_carrusel: fotos_carrusel },
      { new: true }
    );
    res.json({ updateProducto });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error borrando la foto del Producto " + error,
    });
  }
});

module.exports = app;
