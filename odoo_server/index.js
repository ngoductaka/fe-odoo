const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const odooClient = require('./odoo');

// 
const app = express();
// config body-parser (parse body) req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// config cors 
app.use(cors())
// 

// Odoo configuration

// const host = '20.255.60.135';
// const port = 8010;
// const username = 'admin';
// const password = 'admin';
// const path = '/xmlrpc/2/common';
// const db = 'pm';
// {
// "port": 8010,
//     "host": "20.255.60.135",
//         "username": "admin",
//             "password": "admin",
//                 "path": "/xmlrpc/2/common",
//                     "db": "pm",
// }

const client = {

};
// 

app.use('/login', async (req, res) => {
    try {
        const {
            host, port, path, db, username, password
        } = req.body;
        const odoo = new odooClient({});
        await odoo.config({ host, port, path });
        const uid = await odoo.login({ db, username, password });
        client[uid] = odoo;
        res.json({
            msg: 'login success',
            uid
        })

    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
});

app.use('/api/:uid', async (req, res) => {
    try {
        const { model, method, params } = req.body;
        const { uid } = req.params;
        const odoo = client[uid];
        console.log(Boolean(odoo), 'dddddddd');
        const result = await odoo.callMethod(model, method, params);
        res.json(result)
    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    };
})

app.listen('3002', (err) => {
    console.log({
        err,
        'port': 3002
    })
})

