import React, { useMemo, useState } from 'react';
import { Button, Input, Table, Tag } from 'antd';
import { ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { TableCustom } from 'com/table_temp/helper/styled_component';
import { images } from 'helper/static/images';
const App = () => {
    const [val, setVal] = useState(0);
    return (
        <div>
            <GeneralHeader title='Process flow​' />
            <div className="h-screen bg-gray-100 p-4">
                <div className='h-full bg-white p-4 rounded-md'>
                    <div className='flex mb-3 '>
                        {[0, 1, 2, 3].map((i) => {
                            return (
                                <div
                                    key={i}
                                    onClick={() => setVal(i)}
                                    className='border-sold border-gray-300 border p-3 rounded-lg mr-5 hover:bg-slate-50 cursor-pointer'>
                                    <div className='mb-3'>수입품 <span className='text-cyan-700'>(4 제품 사용)</span></div>
                                    <div>
                                        <div>WH/IN/01 2002년 5월 24일</div>
                                        <div>WH/IN/01 2002년 5월 24일</div>
                                        <div>WH/IN/01 2002년 5월 24일</div>
                                        <div>WH/IN/01 2002년 5월 24일</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className=' mb-4 flex justify-between' >
                        <Input.Search placeholder='일이삼사오' style={{ width: 400 }} />
                        <div>
                            <Button style={{ background: '#3A5BB8', color: '#fff' }}> 데이터를 얻다</Button>
                            <Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드</Button>
                            <Button icon={<PrinterOutlined />}>인쇄기</Button>
                        </div>
                    </div>
                    <TableCustom dataSource={dataSource[val]} columns={columns} />;
                </div>
            </div>
        </div>
    )
};

export default App;


const dataSource = [
    [
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

    ],
    [
        {
            key: '1',
            stt: '1',
            Name_of_NVL: 'ASF2',
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
            Name_of_NVL: 'ASF2',
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
            Name_of_NVL: 'ASF2',
            ERP: 'D104000030',
            barcode: '11234567',
            TK: 'WH/IN/01',
            divide: '재료',
            situation: '준비가 된',
            injection: '',
        },

    ],
    [
        {
            key: '1',
            stt: '1',
            Name_of_NVL: 'ASF3',
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
            Name_of_NVL: 'ASF3',
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
            Name_of_NVL: 'ASF3',
            ERP: 'D104000030',
            barcode: '11234567',
            TK: 'WH/IN/01',
            divide: '재료',
            situation: '준비가 된',
            injection: '',
        },

    ],
    [
        {
            key: '1',
            stt: '1',
            Name_of_NVL: 'ASF4',
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
            Name_of_NVL: 'ASF4',
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
            Name_of_NVL: 'ASF4',
            ERP: 'D104000030',
            barcode: '11234567',
            TK: 'WH/IN/01',
            divide: '재료',
            situation: '준비가 된',
            injection: '',
        },

    ],
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
        render: (val) => {
            return <Tag color="success">{val}</Tag>
        }
    },
    {
        title: '주사',
        dataIndex: 'injection',
        key: 'injection',
        render: () => <img src={images.barcode} />
    },
];
