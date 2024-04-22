const express = require("express");
const app = express.Router();

const mercadopago = require("mercadopago");

const client = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MPACCESSTOKEN,
});


// CREAR Preference
app.post("/create_preference", (req, res) => {
  const { total } = req.body;

  const preference = new mercadopago.Preference(client);

  preference.create({ body: 
    {
      "items": [
        {
          "title": "Compra desde punto de venta",
          "unit_price": Number(total),
          "quantity": 1
        }
      ],
  
      "back_urls": {
        "success": "https://mell-panel.web.app/ventas/ventas_alta",
        "failure": "https://mell-panel.web.app/ventas/ventas_alta",
        "pending": "https://mell-panel.web.app/ventas/ventas_alta"
      },
      "auto_return": "approved"
    }
  })
  .then(function(response){
    //console.log(response);
    res.json({
      id:response.id
    });
  
  }).catch(function(error){
    console.log(error);
  });
});




// CREAR PAGO DESDE SITIO WEB
app.post("/process_payment", (req, res) => {
  const { transaction_amount, token, installments, payment_method_id, issuer_id, payer} = req.body;
  
  const payment = new mercadopago.Payment(client);

  const paymentData = {
    transaction_amount,
    token,
    description: "Pago desde sitio Web",
    installments,
    payment_method_id,
    issuer_id, 
    payer
  };

  payment
    .create({ body: paymentData })
    .then(function (data) {
      res.status(201).json({
        detail: data.status_detail,
        status: data.status,
        id: data.id,
      });
    })
    .catch(function (error) {
      console.log(error);
      const { errorMessage, errorStatus } = validateError(error);
      res.status(errorStatus).json({ error_message: errorMessage });
    });
});

function validateError(error) {
  let errorMessage = "Unknown error cause";
  let errorStatus = 400;

  if (error.cause) {
    const sdkErrorMessage = error.cause[0].description;
    errorMessage = sdkErrorMessage || errorMessage;

    const sdkErrorStatus = error.status;
    errorStatus = sdkErrorStatus || errorStatus;
  }

  return { errorMessage, errorStatus };
}


module.exports = app;








