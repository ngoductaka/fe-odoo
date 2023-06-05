import React, { useMemo } from 'react';
import { Button, Input, Table } from 'antd';
import './styles.css';
import { ArrowRightOutlined, ArrowLeftOutlined, ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { TableCustom } from 'com/table_temp/helper/styled_component';
import { LOCAL } from '_config/constant';
import BtnUpload from 'com/BtnUpload';

const App = () => {
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
                        <a href={`${LOCAL}/download/report3.xlsx`} download><Button className='flex items-center justify-center'> <ArrowDownOutlined /> 다운로드</Button></a>
                        <a href={`${LOCAL}/download/report3.xlsx`} download><Button icon={<PrinterOutlined />}>인쇄기</Button></a>
                        <BtnUpload />
                        </div>
                    </div>
                    <TableCustom pagination={{pageSize: 30}} dataSource={dataSource} columns={columns} />;
                </div>
            </div>
        </div>
    )
};

export default App;

const dataSource = new Array(20).fill(0).map((i, index) => {
    const rand = (Math.random() * 30).toFixed(0)
    return {

        key: index + 1,
        lading_code: `TBA04595780${rand}`,
        lading_date: `2002년 5월 ${rand}일`,
        shipping_unit: 'GHN',
        received_date: `2002년 5월 ${rand}일`,

    }
})

// const dataSource = [
//     {
//         key: '1',
//         lading_code: 'TBA064595780100',
//         lading_date: '2002년 5월 24일',
//         shipping_unit: 'GHN',
//         received_date: '2002년 5월 24일',
//     },
//     {
//         key: '2',
//         lading_code: 'TBA064595780101',
//         lading_date: '2002년 5월 24일',
//         shipping_unit: 'GHN',
//         received_date: '2002년 5월 24일',
//     },
//     {
//         key: '3',
//         lading_code: 'TBA064595780102',
//         lading_date: '2002년 5월 24일',
//         shipping_unit: 'GHN',
//         received_date: '2002년 5월 24일',
//     },
// ];

const columns = [
    {
        title: '선하 증권 코드',
        dataIndex: 'lading_code',
        key: 'lading_code',
    },
    {
        title: '선하 증권 일자',
        dataIndex: 'lading_date',
        key: 'lading_date',
    },
    {
        title: '배송 단위',
        dataIndex: 'shipping_unit',
        key: 'shipping_unit',
    },
    {
        title: '받은 날짜',
        dataIndex: 'received_date',
        key: 'received_date',
    },
];
