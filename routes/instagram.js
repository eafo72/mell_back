const express = require('express')
const app = express.Router()
const auth = require('../middlewares/authorization')

const fetch = require("node-fetch");


app.post("/usertoken", async (req, res) => {

    const client_id = "451501287304003";
    const client_secret = "7253909d53e1ec5617c5e30de36cf4ce";
    const redirect_uri = "https://landing.flagasamascotas.com";
    const { code } = req.body;

    let response = await fetch(
        `https://api.instagram.com/oauth/access_token`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id,
            client_secret,
            grant_type: "authorization_code",
            redirect_uri,
            code: code,
          }),
        }
      );
    
      let result = await response.json();
      const { access_token } = result.data;

      res.json(access_token);

    
  });


  module.exports = app