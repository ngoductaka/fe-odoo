const express = require('express');
var fs = require('fs');
const path = require('path');

var cors = require('cors')
var app = express()

app.use(cors())

var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const port = 3909;

app.post(
    '/order-list', // đường dẫn 
    (
        req,// request ( yêu cầu cái gì )
        res // res ( trả về thông tin đc yêu cầu  )
    ) => { // xử lý yêu cầu và trả lại kết quả 
        try {
            addNewPromise(req.body)
            res.status(200).json({
                token: 'token name',
                name: 'dnd',
                age: 222,
            })

        } catch (err) {
            res.status(400).json({ msg: JSON.stringify(err) })
        }
    }
);
app.get(
    '/order-list/:orderName', // đường dẫn 
    async (
        req,// request ( yêu cầu cái gì )
        res // res ( trả về thông tin đc yêu cầu  )
    ) => { // xử lý yêu cầu và trả lại kết quả 
        try {
            const listData = await getBYName(req.params.orderName)
            res.status(200).json({
                msg: 'oke',
                data: listData,
            });
        }
        catch (err) {
            res.status(400).json({ msg: JSON.stringify(err) })
        }
    }
);

app.get(
    '/order-list', // đường dẫn 
    async (
        req,// request ( yêu cầu cái gì )
        res // res ( trả về thông tin đc yêu cầu  )
    ) => { // xử lý yêu cầu và trả lại kết quả 
        try {
            const listData = await getAll(req.params.orderName)
            res.status(200).json({
                msg: 'oke',
                data: listData,
            });
        }
        catch (err) {
            res.status(400).json({ msg: JSON.stringify(err) })
        }
    }
);


const getAll = async (orderName) => {
    try {
        console.log(orderName);
        // return 0
        const data = await fs.promises.readFile('order.json', 'utf8');
        const dataConvert = JSON.parse(data);
        return dataConvert
    } catch (err) {
        throw err;
    }
}
const getBYName = async (orderName) => {
    try {
        console.log(orderName);
        // return 0
        const data = await fs.promises.readFile('order.json', 'utf8');
        const dataConvert = JSON.parse(data);
        const listData = dataConvert.filter(i => i.order === orderName);
        return listData
    } catch (err) {
        throw err;
    }
}



const addNewPromise = async student => {
    try {
        // b1 check sự tồn tại file 
        const isExit = await fs.existsSync('order.json');
        if (!isExit) {
            const newList = [student];
            const dataToSave = JSON.stringify(newList)
            await fs.promises.writeFile('order.json', dataToSave);
            return 1;
        }
        const data = await fs.promises.readFile('order.json', 'utf8');

        const dataConvert = JSON.parse(data);
        const newList = [...dataConvert, student];

        await fs.promises.writeFile('order.json', JSON.stringify(newList));
        console.log('THêm mới học sinh thành công');

    } catch (err) {
        console.log('THêm mới học sinh thất bại');
        throw err;

    }
}


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

