const { Pool } = require('pg')

let pool = new Pool({
    user: 'NodeJs', //username
    password: 'node', //password
    database: 'ShipmentInfo',
    host: 'localhost',
    port: 5432
});

//priznanjem nije najbolje rjesnje,
//bolje rjesenje bi bio Dynamic SQL
async function selectQuery(status, dateFrom, dateTo) {
    
    if(status === undefined && dateFrom === undefined) {
        return await pool.query({
            text: 'SELECT * FROM shipment NATURAL JOIN customer NATURAL JOIN tracking WHERE customerId = $1', 
            values: [id]
        });
    }

    else if(status !== undefined && dateFrom === undefined) {
        return await pool.query({
            text: `SELECT * FROM shipment NATURAL JOIN customer NATURAL JOIN tracking
                        WHERE status = $1`,
            values: [status]
        });
    }
    else if(status === undefined && dateFrom !== undefined) {
        return await pool.query({
            text: `SELECT * FROM shipment NATURAL JOIN customer NATURAL JOIN tracking
                        WHERE createDate BETWEEN $1 AND $2`,
            values: [dateFrom, dateTo]
        });
    }
    else {
        return await pool.query({
            text: `SELECT * FROM shipment NATURAL JOIN customer NATURAL JOIN tracking
                        WHERE status = $1 AND 
                            createDate BETWEEN $2 AND $3`,
            values: [status ,dateFrom, dateTo]
        });
    }
}

async function insertQuery(tracking, customer, shipment) {
    await pool.query({
        text:  `INSERT INTO tracking (trackingCode, carrierTrackingURL, trackingDate)
                    VALUES($1, $2, $3);
                INSERT INTO customer (customerID, customerName, customerDescription)
                    VALUES($4, $5, $6)
                INSERT INTO shipment (shipmentID, trackingCode, carrier, status, weight, addressTo, addressFrom, createDate, customerID)
                    VALUES($7, $8, $9, $10, $11, $12, $13, $14, $15);`,
        values: tracking.values.concat(customer.values, shipment.values)
    })
}

module.exports = {
    selectQuery: selectQuery,
    insertQuery: insertQuery
}
