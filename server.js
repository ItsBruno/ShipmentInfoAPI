const express = require('express');
const ShipmentRouter = require('./shipmentIdRouter');
const https = require('https');
const fs = require('fs')
let app = express();

//nedostaje realizacija autentifikacije i autorizacije kako bi samo odogvarajuci korisnik te djelatnici u pozivnom centru
//imali pristup podacima spomenutog korisnika

https
  .createServer(
    {
    //key.pem i cert.pem je potrebno generirati
      key: fs.readFileSync("key.pem"), 
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(8080, () => {
    console.log("server is runing at port 8080");
  });

app.use(express.json())

app.use('/shipment:id', ShipmentRouter);