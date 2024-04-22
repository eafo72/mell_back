const express = require('express')
const app = express.Router()
const InstagramUsuario = require('../models/InstagramUsers') 

let FormData = require("form-data");
const fetch = require("node-fetch");


app.post("/userinfo", async (req, res) => {

    const client_id = "451501287304003";
    const client_secret = "7253909d53e1ec5617c5e30de36cf4ce";
    const redirect_uri = "https://landing.flagasamascotas.com/";
    
    const { code } = req.body;

    //console.log(code)
    if(code == null || code == undefined){
        res.json({msj : "No se recibió el código"});
        return;
    }


    let formdata = new FormData();
    formdata.append("client_id", client_id);
    formdata.append("client_secret", client_secret);
    formdata.append("grant_type", "authorization_code");
    formdata.append("redirect_uri", redirect_uri);
    formdata.append("code", code);
  
    try {
        let response = await fetch(
        'https://api.instagram.com/oauth/access_token',
        {
          method: "POST",
          body: formdata,
          headers: {'Access-Control-Allow-Origin': 'https://landing.flagasamascotas.com'}, 
          
        }
        );
        let result = await response.json();
        if(result.error_message){
            res.json(result.error_message);
            return;  
        }
        //console.log(result);

        const { access_token } = result;

        if(access_token == null || access_token == undefined){
            res.json({msj : "No se recibió el token"});
            return;
        }

       
        // Fetch user profile using the access token
        const profileResponse = await fetch(
            `https://graph.instagram.com/me?fields=id,username&access_token=${access_token}`,
            {
              method: "GET"
            }
            );
          
        //info del usuario
        let finalresult = await profileResponse.json();
        //console.log(finalresult);
        res.json(finalresult);
       
    } catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
      
    
  });

app.post('/adduser', async (req, res) => {
    const { user, email } = req.body 
    
    try {
  
      const ifExist = await InstagramUsuario.find( { email: email } )
  
      if(ifExist.length > 0){
  
        res.status(500).json({
          msg: 'El correo '+ email +' ya existe',
        })	
  
      }else{
  
        const respuesta = await InstagramUsuario.create({
          user,
          email
        });

        res.json({respuesta})
        
      }
      
    } catch (error) {
      return res.status(500).json({
        msg: 'Hubo un error al guardar la información' + error,
      })
    }
  })  


  module.exports = app