import React, { useMemo } from 'react';
import { Button, Input, Table } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { TableCustom } from 'com/table_temp/helper/styled_component';

const App = () => {
    return (
        <div>
            <GeneralHeader title='Process flow​' />
            <div className="h-screen bg-gray-100 p-4">
                <div className='h-full bg-white p-4 rounded-md'>
                    <div className=' mb-4 flex justify-between' >
                        <Input.Search style={{ width: 400 }} />
                        <div>
                            <Button style={{ background: '#3A5BB8', color: '#fff' }}> 데이터를 얻다</Button>
                            <Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드</Button>
                            <Button icon={<PrinterOutlined />}>인쇄기</Button>
                        </div>
                    </div>
                    <TableCustom dataSource={dataSource} columns={columns} />;
                </div>
            </div>
        </div>
    )
};

export default App;


const dataSource = [

    {
        key: '1',
        stt: '1',
        Name_of_NVL: 'ASF1',
        ERP: 'D104000030',
        barcode: '11234567',
        TK: 'WH/IN/01',
        divide: '재료',
        situation: '준비가 된',
        injection: '',
    },
    {
        key: '2',
        stt: '2',
        Name_of_NVL: 'ASF1',
        ERP: 'D104000030',
        barcode: '11234567',
        TK: 'WH/IN/01',
        divide: '재료',
        situation: '준비가 된',
        injection: '',
    },
    {
        key: '3',
        stt: '3',
        Name_of_NVL: 'ASF1',
        ERP: 'D104000030',
        barcode: '11234567',
        TK: 'WH/IN/01',
        divide: '재료',
        situation: '준비가 된',
        injection: '',
    },
];

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
        // render: (val) => {
        //     return <Tag color="success">{val}</Tag>
        // }
    },
    {
        title: '말랐다',
        dataIndex: 'dry',
        key: 'dry',
        // render: () => <img src={images.barcode} />
    },
];
