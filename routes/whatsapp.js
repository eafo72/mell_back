const express = require("express");
const app = express.Router();
const https = require("https");

function EnviarMensajeWhastpapp(texto,number){

  texto = texto.toLowerCase();
  let data = "";

  if (texto.includes("hola")){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "text",
          "text": {
              "preview_url": false,
              "body": "🚀 Hola, Como estas, Bienvenido."
          }
      });
  }else if (texto=="1"){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "text",
          "text": {
              "preview_url": false,
              "body": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
          }
      });
  }else if(texto=="2"){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "to": number,
          "type": "location",
          "location": {
          "latitude": "-12.067158831865067",
          "longitude": "-77.03377940839486",
          "name": "Estadio Nacional del Perú",
          "address": "Cercado de Lima"
          }
      });
  }else if(texto=="3"){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "document",
          "document": {
              "link": "http://jornadasciberseguridad.riasc.unileon.es/archivos/ejemplo_esp.pdf",
              "caption": "Temario del Curso #001"
          }
      });
  }else if(texto=="4"){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "audio",
          "audio": {
              "link": "https://filesamples.com/samples/audio/mp3/sample1.mp3"
          }
      });
  }else if(texto=="5"){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "to": number,
          "text": {
              "preview_url": true,
              "body": "Introduccion al curso! https://youtu.be/6ULOE2tGlBM"
          }
      });
  }else if(texto=="6"){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "text",
          "text": {
              "preview_url": false,
              "body": "🤝 En breve me pondre en contacto contigo. 🤓"
          }
      });
  }else if(texto=="7"){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "text",
          "text": {
              "preview_url": false,
              "body": "📅 Horario de Atención : Lunes a Viernes. \n🕜 Horario : 9:00 am a 5:00 pm 🤓"
          }
      });
  }else if(texto.includes("gracias")){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "text",
          "text": {
              "preview_url": false,
              "body": "Gracias a ti por contactarme. 🤩"
          }
      });
  }else if(texto.includes("adios") || texto.includes("bye") || texto.includes("nos vemos")){
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "text",
          "text": {
              "preview_url": false,
              "body": "Hasta luego. 🌟"
          }
      });
  }else{
      data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": number,
          "type": "text",
          "text": {
              "preview_url": false,
              "body": "🚀 Hola, visita mi web anderson-bastidas.com para mas información.\n \n📌Por favor, ingresa un numero #️⃣ para recibir información.\n \n1️⃣. Información del Curso. ❔\n2️⃣. Ubicación del local. 📍\n3️⃣. Enviar temario en pdf. 📄\n4️⃣. Audio explicando curso. 🎧\n5️⃣. Video de Introducción. ⏯️\n6️⃣. Hablar con AnderCode. 🙋‍♂️\n7️⃣. Horario de Atención. 🕜"
          }
      });
  }

  const options = {
      host : "graph.facebook.com",
      path : "/v17.0/197145163483349/messages",
      method : "POST",
      body : data,
      headers : {
          "Content-Type" : "application/json",
          Authorization :"Bearer EAATBOAU5ZA6QBOZCdcCUYqqMXIDYPXrAe2luqZAdZBzBkWfd3jZCQRrNrK7NFzaWcVVobhjHlE10jibZCWUJbfxZAPi74KhBvzDRZCNXTw8ZCtzwG2ZBUIwBaSva1scrQzublENJKZAU3jT0hLaWqmCb5ziHpoIHJfSU1BvpCAScFkGCouvD5UbZClUBmLsj3p8znPpumDYv4pZAvKWx83WZCQCPX2omR4biqkvcAey3IZD"
      }
  };

  const req = https.request(options,res => {
      res.on("data",d=>{
          process.stdout.write(d);
      });
  });

  req.write(data);
  req.end();
}

app.post("/", (req, res) => {
  try {
    //en la informacion que llega buscamos el texto y numero de telefono
    const entry = req.body["entry"][0];
    const changes = entry["changes"][0];
    const value = changes["value"];
    const objetoMensaje = value["messages"];

    if (typeof objetoMensaje != "undefined") {
      const messages = objetoMensaje[0];
      const texto = messages["text"]["body"];
      const numero = messages["from"];

      EnviarMensajeWhastpapp(texto, numero);
    }

    res.send("EVENT_RECEIVED");
  } catch (e) {
    console.log(e);
    res.send("EVENT_RECEIVED");
  }
});

//este endpoint solo sirve para que meta verifique el funcionamiento (es solo una vez)
app.get("/", (req, res) => {
  try {
    const tokenMell = "MELLAPIMETA"; //poner este token en la api de meta (webhook)
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

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
