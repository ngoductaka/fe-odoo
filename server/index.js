const express = require('express');
var fs = require('fs').promises;
const path = require('path');

var cors = require('cors')
var app = express()

app.use(cors())

var bodyParser = require('body-parser');
const { create } = require('lodash');


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const port = 3909;

const read = async () => {
    const data = await fs.readFile('./data.json', 'utf-8');
    return JSON.parse(data);
}
const readMaterial = async () => {
    const data = await fs.readFile('./material.json', 'utf-8');
    return JSON.parse(data);
}

const update = async input => {
    await fs.writeFile('./data.json', JSON.stringify(input, null, 4));
}


app.patch(
    '/map', // đường dẫn 
    async (
        req,// request ( yêu cầu cái gì )
        res // res ( trả về thông tin đc yêu cầu  )
    ) => { // xử lý yêu cầu và trả lại kết quả 
        try {
            await update(req.body);
            const dataReturn = await read();
            res.json(dataReturn);
        } catch (err) {
            res.status(400).json({ msg: JSON.stringify(err) })
        }
    }
);

app.post(
    '/map', // đường dẫn 
    async (
        req,// request ( yêu cầu cái gì )
        res // res ( trả về thông tin đc yêu cầu  )
    ) => { // xử lý yêu cầu và trả lại kết quả 
        try {
            const newItem = req.body;
            if (!newItem.location) {
                res.status(400).json({ msg: 'err' })
                return 0
            }
            const oldLocation = await read() || {};
            const allMaterial = await readMaterial();
            // 

            const dataConvert = newItem.barCode.reduce((cal, cur) => {
                const material = allMaterial.find(i => i.id === cur);
                if (material)
                    cal[material.material] = cal[material.material] ? [...(new Set([...cal[material.material], cur]))] : [cur]
                return cal;
            }, {});
            const dataSave = oldLocation;

            if (oldLocation[newItem.location]) {
                Object.keys(dataConvert).map(key => {
                    if (oldLocation[newItem.location][key]) {
                        oldLocation[newItem.location][key] = [...(new Set([...dataConvert[key], ...oldLocation[newItem.location][key]]))];
                    } else {
                        oldLocation[newItem.location][key] = dataConvert[key];
                    }
                })

            } else {
                dataSave[newItem.location] = dataConvert;
            }
            await update(dataSave)
            const dataView = await read();
            res.json(dataView)
        } catch (err) {

            console.log('ddd', err);
            res.status(400).json({ msg: err })
        }
    }
);

app.get(
    '/map', // đường dẫn 
    async (
        req,// request ( yêu cầu cái gì )
        res // res ( trả về thông tin đc yêu cầu  )
    ) => { // xử lý yêu cầu và trả lại kết quả 
        try {
            const data = await read();
            res.json(data);
        } catch (err) {
            console.log('adf', err)
            res.status(400).json({ msg: JSON.stringify(err) })
        }
    }
);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
