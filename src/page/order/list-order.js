import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Table, Tag } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { TableCustom } from 'com/table_temp/helper/styled_component';
import axios from 'axios';
import _ from 'lodash';
import { dataMaterial } from 'assets/data/material';
import { LOCAL } from '_config/constant';
import BtnUpload from 'com/BtnUpload';
import { DownloadExcelBtn } from 'com/excel/gen_excel';


const App = () => {
    const [data, setData] = useState([]);
    const getData = async () => {
        const { data } = await axios.get(LOCAL + '/map');
        const mapObj = {};
        Object.keys(data).map(lo => {
            Object.keys(data[lo]).map(ma => {
                data[lo][ma].map(i => {
                    mapObj[i] = lo;
                })
            })
        })
        const mapLocation = ['지역 A'
            , "지역 B"
            , 'BU 지역']
        setData(dataMaterial.map((i, index) => {
            const dataIndex = mapObj[i.id];
            let lo = '';
            if (dataIndex) {
                const [index, position] = dataIndex.split('-')
                lo = mapLocation[index - 1] + '-' + position;
            }
            return {
                key: index + 1,
                stt: index + 1,
                Name_of_NVL: i.name,
                ERP: i.material,
                barcode: i.id,
                TK: 'WH/IN/01' + index,
                divide: '재료',
                situation: '준비가 된',
                dry: (1 + (i.count + 1) % 3) * 26,
                location: lo
            }
        }))

    }

    useEffect(() => {
        getData();
        const interval = setInterval(() => {
            getData();
        }, 1000 * 5);
        return () => {
            clearInterval(interval)
        }
    }, [])
    const dnd = ['stt',
        'Name_of_NVL',
        'ERP',
        'divide',
        'situation',
        'dry',]
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
                            <h5>제품</h5>
                            <Input.Search style={{ width: 600 }} />
                            <div />
                        </div>
                        <div>
                            {/* <Button style={{ background: '#3A5BB8', color: '#fff' }}> 데이터를 얻다</Button> */}
                            {/* <a href={`${LOCAL}/download/report3.xlsx`} download><Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드</Button></a> */}
                            <DownloadExcelBtn
                                element={<Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드.</Button>}
                                data={data}
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
                                        label: '나누다',
                                        value: 'divide',
                                    },
                                    {
                                        label: '상태',
                                        value: 'situation',
                                    },
                                    {
                                        label: '재고량',
                                        value: 'dry',
                                    },
                                ]}
                            />
                            <Button onClick={() => { window.print(); }} icon={<PrinterOutlined />}>인쇄기</Button>
                            <BtnUpload handleFile={handleExcelUpload} />
                        </div>
                    </div>
                    <TableCustom
                        pagination={{ pageSize: 30 }} dataSource={data} columns={columns}
                        expandable={{
                            expandedRowRender: (record) => {
                                const dataFake = new Array(9).fill(record).map((i, index) => {
                                    return {
                                        ...record,
                                        Name_of_NVL: i.Name_of_NVL,
                                        ERP: i.ERP,
                                        barcode: i.barcode + index,
                                        TK: 'WH/IN/01' + index,
                                        divide: '재료',
                                        situation: '준비가 된',
                                        dry: (index + 1) * (i.dry % 6),
                                        location: ''
                                    }
                                })
                                return <div className='p-5 bg-gray-200'>
                                    <h4 className=''>List box of {record.Name_of_NVL} in warehouse:</h4>
                                    <TableCustom
                                        pagination={{ hideOnSinglePage: true }} dataSource={[record, ...dataFake]} columns={columns2}
                                    />
                                </div>
                            },

                        }}

                    />;
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
        title: '재고량',
        dataIndex: 'dry',
        key: 'dry',
        // render: () => (Math.random() * 1000).toFixed(0)
    },
];


const columns2 = [
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
    // {
    //     title: 'TK',
    //     dataIndex: 'TK',
    //     key: 'TK',
    // },
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
        title: '재고량',
        dataIndex: 'dry',
        key: 'dry',
        // render: () => (Math.random() * 1000).toFixed(0)
    },
    {
        title: '위치',
        dataIndex: 'location',
        key: 'location',
        render: (val) => val ? <Tag color='success'> {val}</Tag> : <Tag color='error'> N/A </Tag>
    },
];
