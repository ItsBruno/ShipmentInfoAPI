const express = require('express');
const dbQueries = require('./db');
const { query, body, validationResult } = require('express-validator');
var router = express.Router();

router.get('/', [query('status').optional().notEmpty().isString().escape(),  //query validation
                query('createDateMin').optional().notEmpty().isDate().escape().custom(() => {return req.query.createDateMax !== undefined}), 
                query('createDateMax').optional().notEmpty().isDate().escape().custom(() => {return req.query.createDateMin !== undefined})],
async (req, res) => {
    //check for errors in validation
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({found_errors: errors})
    }

    //validate id
    let shipment_id = req.params.replace(':', '');
    if(typeof shipment_id != 'number') {
        res.status(404).json({status: 'File not found'});
        return;
    }
    let rows;
    try {
        rows = await dbQueries.query(req.query.status, req.query.createDateMin, req.query.createDateMax)
        res.status(200).send(rows);
    }
    catch(err) {
        res.status(500).json({error: `Internal server error: ${err}`});
    }

});

router.post('/',[
        body('shipment.shipmentID').exists().isNumeric().escape(),
        body('shipment.trackingCode').optional({values: 'null'}).isAlphanumeric().escape()
        //nastaviti ovako validaciju za sva ostala polja
        //primarni kljucevi obavezni, ostalo mora zadovoljavati tip ili biti null
    ], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({found_errors: errors})
    }
    if(!req.is('application/json')) res.status(400).json({error: 'Bad format'});

   try {
        await dbQueries.insertQuery(req.body.tracking, req.body.customer, req.body.shipment);
        res.status(200).json({insert_status: successful})
   }
   catch(err){
        res.status(500).json({error: `Internal server error: ${err}`});
   }
});


module.exports = router;
