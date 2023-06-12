import React, { useMemo, useState } from 'react';
import { Button, Input, Table, Tag } from 'antd';
import _ from 'lodash';
import { ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { TableCustom } from 'com/table_temp/helper/styled_component';
import { images } from 'helper/static/images';
import { DownloadExcelBtn } from 'com/excel/gen_excel';
import { LOCAL } from '_config/constant';

import { dataMaterial } from 'assets/data/material';
import BtnUpload from 'com/BtnUpload';
const dnd = [
    'stt',
    'Name_of_NVL',
    'ERP',
    'barcode',
    'TK',
    'divide',
]
const App = () => {
    const [val, setVal] = useState(0);

    const [dataSource, setState] = useState([
        dataS1(1),
        dataS1(2),
        dataS1(3),
        dataS1(4),
    ]);
    const handleExcelUpload = (data) => {

        const [_, ...dataExcel] = data;
        console.log('dataExcel__', dataExcel);
        const dataResult = dataExcel.map((item, index) => {
            const dataReturn = {};
            dnd.map((i, ind) => {
                dataReturn[i] = item[ind]
            })
            return dataReturn;
        });
        console.log('dataResult', dataResult);
        dataSource[val] = dataResult;
        setState([...dataSource]);
    }
    return (
        <div>
            <div className="h-screen bg-gray-100 p-4">
                <div className='h-full bg-white p-4 rounded-md'>
                    <div className='flex mb-3 '>
                        {[0, 1, 2, 3].map((i, index) => {
                            return (
                                <div
                                    key={i}
                                    onClick={() => setVal(i)}
                                    className='border-sold border-gray-300 border p-3 rounded-lg mr-5 hover:bg-slate-50 cursor-pointer'>
                                    <div className='mb-3'>수입품 <span className='text-cyan-700'>({index + 2} 제품 사용)</span></div>
                                    <div>
                                        <div>WH/IN/0{index + 1} 2002년 5월 2{index + 1}일</div>
                                        <div>WH/IN/0{index + 1} 2002년 5월 2{index + 1}일</div>
                                        <div>WH/IN/0{index + 1} 2002년 5월 2{index + 1}일</div>
                                        <div>WH/IN/0{index + 1} 2002년 5월 2{index + 1}일</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className=' mb-4 flex justify-between' >
                        <div className='flex justify-between flex-1'>
                            <h5>일하다</h5>
                            <Input.Search style={{ width: 600 }} />
                            <div />
                        </div>
                        <div>
                            {/* <Button style={{ background: '#3A5BB8', color: '#fff' }}> 데이터를 얻다</Button> */}
                            <DownloadExcelBtn
                                element={<Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드.</Button>}
                                data={dataSource[val]}
                                format={[
                                    {
                                        label: '숫자 순서',
                                        value: 'stt',
                                    },
                                    {
                                        label: 'NVL의 이름',
                                        value: 'Name_of_NVL',
                                    },
                                    {
                                        label: 'ERP',
                                        value: 'ERP',
                                    },
                                    {
                                        label: '바코드',
                                        value: 'barcode',
                                    },
                                    {
                                        label: 'TK',
                                        value: 'TK',
                                    },
                                    {
                                        label: '나누다',
                                        value: 'divide',
                                    },
                                ]}
                            />
                            <Button onClick={() => { window.print(); }} icon={<PrinterOutlined />}>인쇄기</Button>
                            <BtnUpload handleFile={handleExcelUpload} />
                        </div>
                    </div>
                    <TableCustom pagination={{ pageSize: 30 }} dataSource={dataSource[val]} columns={columns} />;
                </div>
            </div>
        </div>
    )
};

export default App;

const dataS1 = (count) => _.shuffle(dataMaterial).map((i, index) => {
    return {
        key: index + 1,
        stt: index + 1,
        Name_of_NVL: i.name,
        ERP: 'D104000' + i.material,
        barcode: i.id,
        TK: 'WH/IN/0' + count,
        divide: '재료',
        situation: '준비가 된',
        injection: '',
    }
})

const columns = [
    {
        title: '숫자 순서',
        dataIndex: 'stt',
        key: 'stt',
    },
    {
        title: 'NVL의 이름',
        dataIndex: 'Name_of_NVL',
        key: 'Name_of_NVL',
    },
    {
        title: 'ERP',
        dataIndex: 'ERP',
        key: 'ERP',
    },
    {
        title: '바코드',
        dataIndex: 'barcode',
        key: 'barcode',
    },
    {
        title: 'TK',
        dataIndex: 'TK',
        key: 'TK',
    },
    {
        title: '나누다',
        dataIndex: 'divide',
        key: 'divide',
    },
    {
        title: '상태',
        dataIndex: 'situation',
        key: 'situation',
        render: (val) => {
            return Math.random() > 0.5 ? <Tag color="success">준비가 된</Tag> : <Tag color="error">준비되지 않았다</Tag>
        }
    },
    {
        title: '주사',
        dataIndex: 'injection',
        key: 'injection',
        render: () => <img src={images.barcode} />
    },
];


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
