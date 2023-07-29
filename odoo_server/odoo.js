const xmlrpc = require('xmlrpc');

class odoo {
    constructor({
        db,
        username,
        password,
        host,
        port,
        path,
    }) {
        this.db = db || null;
        this.username = username || null;
        this.password = password || null;
        this.host = host || null;
        this.port = port || null;
        this.path = path || '/xmlrpc/2/common';
    }

    async config({
        host, port, path
    }) {
        this.host = host || null;
        this.port = port || null;
        this.path = path || '/xmlrpc/2/common';
        this.odoo = xmlrpc.createSecureClient({ host, port, path: '/xmlrpc/2/common' });
    }

    async login({
        db,
        username,
        password,
    }) {
        this.db = db || null;
        this.username = username || null;
        this.password = password || null;
        return new Promise((res, rej) => {
            const { host, port, db, username, password, } = this;
            this.odoo.methodCall('authenticate', [db, username, password, {}], (error, uid) => {
                if (error) {
                    console.error('Authentication error:', error);
                    rej(error);
                    return;
                }
                this.models = xmlrpc.createSecureClient({ host, port, path: '/xmlrpc/2/object' });
                this.uid = uid;
                res(uid);
            })
        })
    }


    callMethod(dbModels, method, params) {
        return new Promise((resolve, reject) => {
            // console.log({
            //     'this.db': this.db,
            //     'this.uid': this.uid,
            //     'this.password': this.password,
            //     'this.models': this.models,
            //     'method': method,
            //     'params': params,
            // })
            this.models.methodCall(
                'execute_kw',
                [this.db, this.uid, this.password, dbModels, method, params],
                (error, value) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(value);
                    }
                }
            );

        });

    }
}


module.exports = odoo;


// 
// const host = '172.174.226.12';

// const port = 8010;

// const db = 'admin';

// const username = 'admin';

// const password = 'admin';

// const fn = async () => {
//     await odoo.config(
//         {
//             host, port, path
//         }
//     )
//     const data = await odoo.login(
//         {
//             db, username, password
//         }
//     )
//     // const result = await callMethod
//     //                 console.log('Matching records:', result);
//     const result = await odoo.callMethod('stock.picking', 'web_search_read', [[
//         //                 // 'picking_type_id', '=', 1
//     ], ["activity_exception_icon", "company_id", "priority", "name", "location_id"], 0, 3]);

//     console.log('result', result)
// }