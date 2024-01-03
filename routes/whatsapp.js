const express = require("express");
const app = express.Router();

app.post("/recibir", (req, res) => {});

app.get("/verificar", (req, res) => {
  try {
    var tokenMell = "MELLAPIMETA";
    var token = req.query["hub.verify_token"];
    var challenge = req.query["hub.challenge"];

    if (challenge != null && token != null && token == tokenMell) {
      res.send(challenge);
    } else {
      res.status(400).send();
    }
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = app;
