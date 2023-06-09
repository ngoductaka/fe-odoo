import React, { useMemo, useState } from 'react';
import { Button, Input, Table } from 'antd';
import './styles.css';
import { ArrowRightOutlined, ArrowLeftOutlined, ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { TableNoPadding } from 'com/table_temp/helper/styled_component';
import { LOCAL } from '_config/constant';
import BtnUpload from 'com/BtnUpload';
import { DownloadExcelBtn } from 'com/excel/gen_excel';

import { dataMaterial } from 'assets/data/material';
import moment from 'moment';
const App = () => {
    const [dataSource, setData] = useState(dataSourceD);

    const dnd = ['name',
        'ERP',
        ...dateCol1.map(i => i.value)
    ]
    // 숫자 순서	NVL의 이름	ERP	나누다	상태	재고량
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
        setData(dataResult);

    }
    return (
        <div>
            <GeneralHeader title='Process flow​' />
            <div className="h-screen bg-gray-100 p-4">
                <div className='h-full bg-white p-4 rounded-md'>
                    <div className=' mb-4 flex justify-between' >
                        <div className='flex justify-between flex-1'>
                            <h5>물류 센터</h5>
                            <Input.Search style={{ width: 600 }} />
                            <div />
                        </div>
                        <div>

                            <DownloadExcelBtn
                                element={<Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드.</Button>}
                                data={dataSource}
                                format={[
                                    {
                                        label: 'NVL의 이름',
                                        value: 'name',
                                    },
                                    {
                                        label: 'ERP',
                                        value: 'ERP',
                                    },
                                    ...dateCol1,
                                ]}
                            />
                            <Button onClick={() => { window.print(); }} icon={<PrinterOutlined />}>인쇄기</Button>
                            <BtnUpload handleFile={handleExcelUpload} />
                        </div>
                    </div>
                    <TableNoPadding
                        pagination={{ pageSize: 30 }}
                        dataSource={dataSource}
                        columns={columns}
                        scroll={{
                            y: '90vw'
                        }}
                    />;
                </div>
            </div>
        </div>
    )
};

export default App;
const D = 15;
const dataSourceD = dataMaterial.map((i, index) => {
    const rand = (Math.random() * 30).toFixed(0);
    const dateNum = {};
    new Array(D).fill(0).map((i, index) => {

        dateNum['num' + index] = rand * (10 - index)
    });
    return {
        key: index + 1,
        name: i.name,
        ERP: i.material,
        ...dateNum,
    }
})
const dateCol = new Array(D).fill(0).map((i, index) => {
    console.log('dndndnd', (index + 3), moment().get("D"))
    if ((index + 3) == moment().get("D")) {
        return {
            title: () =>
                <div className="bg-indigo-300 p-1">
                    2023년 6월 ${index + 3}일
                </div>,
            dataIndex: 'num' + index,
            key: 'num' + index,
            width: 120,
            renderHeader: () => {
                return (
                    <div>ddd</div>
                )
            },
            render: (val) => (
                <div className="bg-indigo-300  p-1">
                    {val}
                </div>
            ),


        }
    }
    return {
        title: `2023년 6월 ${index + 3}일`,
        dataIndex: 'num' + index,
        key: 'num' + index,
        width: 120,

    }
})
const dateCol1 = new Array(D).fill(0).map((i, index) => {
    return {
        label: `2023년 6월 ${index + 3}일`,
        value: 'num' + index,
    }
})


const columns = [
    {
        title: 'NVL의 이름',
        dataIndex: 'name',
        key: 'name',
        width: 150,
    },
    {
        title: 'ERP',
        dataIndex: 'ERP',
        key: 'ERP',
        width: 120,

    },
    ...dateCol
];
