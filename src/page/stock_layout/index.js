import { Input, Modal, Tabs, Form, Skeleton, Button, Popover, Dropdown, Space, Menu, InputNumber, Select, Tag } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { GeneralHeader } from 'com/app_layout/general_header';
import { apiClient } from 'helper/request/api_client';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import _, { get, isEmpty } from 'lodash';
// import { } from '@ant-design/icons'
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { handleErr } from "helper/request/handle_err_request";
import { getItem, insertObj, setItem } from 'helper/local_storage/storage';
import { KEY_STORE } from 'helper/local_storage/key';

import { get as getArea } from 'page/material-in/area_table/services'
import * as services from "./services";
import { apiClientMongo } from 'helper/request/api_client_v1';
import axios from 'axios';

const dataMap = [
    {
        column: 10,
        createdAt: "2023-05-19T07:38:14.737Z",
        descriptions: "",
        id: "1",
        name: "지역 A",
        row: 10,
    },
    {
        column: 15,
        createdAt: "2023-05-19T07:38:14.737Z",
        descriptions: "",
        id: "2",
        name: "지역 B",
        row: 5,
    },
    {
        column: 10,
        createdAt: "2023-05-19T07:38:14.737Z",
        descriptions: "",
        id: "3",
        name: "BU 지역",
        row: 10,
    }
]

const App = ({ handleClickCell, show }) => {
    const [area, setArea] = useState(dataMap);
    return (
        <div>
            {handleClickCell ? null : <GeneralHeader title='Warehouse Layout' />}
            <div style={{ padding: '0px 15px' }}>
                <Tabs size="small" type="card" destroyInactiveTabPane>
                    {area.map(item => {
                        return (<Tabs.TabPane
                            key={item.id}
                            tab={`${item.name}`}>
                            <RenderMap onOkModal={handleClickCell} data={item} />
                        </Tabs.TabPane>)
                    })}
                </Tabs>
            </div>
        </div>
    )
}

export default App;

const RenderMap = React.memo(({ data: areaData, onOkModal }) => {
    const dataMap = useMemo(() => new Array(areaData.row).fill(new Array(areaData.column).fill(0)), [areaData]);

    const [loading, setLoading] = useState(false);
    const [reloadMaterialList, setReloadMaterialList] = useState(false)
    const [location, setLocation] = useState([]);
    const [select, setSelect] = useState(false);
    const [listItem, setListItem] = useState([]);
    const [itemSelected, setItemSelected] = useState('');
    const [form] = Form.useForm();
    const [formLocation] = Form.useForm();


    const [curSelect, setCurSelect] = useState([]);

    const unAvailableCount = useMemo(() => {

        if (isEmpty(location)) return 0;
        return Object.keys(location).length
    }, [location])

    const getLocation = async () => {
        try {
            setLoading(true)
            // const data = getItem("LOCATION");
            // const { data } = await services.get({ areaId: areaData.id })
            // console.log('asdfasdfasdf', data.data);

            // const data =
            // {
            //     "1-001":
            //     {
            //         'D104000030': 10,
            //         'D10400003': 10,
            //         'D10400030': 10,
            //     },
            // }
            const { data } = await axios.get('http://localhost:3909/map')


            setLocation(data || {});
            setLoading(false)
        } catch (err) {
            setLoading(true)
        }
    }

    const onOk = async () => {
        try {
            const locationData = formLocation.getFieldsValue();
            setItemSelected('')
            // locationData
            const dataMaterial = getItem(KEY_STORE.item_code_list);

            if (!itemSelected) {
                openNotificationWithIcon('error', 'Please select item code')
                return
            }
            const materialSelected = listItem.find(i => i.id === itemSelected);
            if (!materialSelected) {
                alert('material not found')
                return 0;
            }

            const listBox = materialSelected.list_box

            // create list of locations
            await Promise.all(curSelect.map((locationName, cur) => services.post({
                locationName,
                itemcodeID: itemSelected,
                itemcode: materialSelected.itemcode,
                ge_no: materialSelected.ge_no,
                areaId: areaData.id,
                count: locationData[locationName],
            })))

            openNotificationWithIcon("success", "Save locations successfully!")

            const listKey = [];
            Object.keys(locationData).map(lo => {
                const count = locationData[lo];
                new Array(count).fill(0).map(() => {
                    listKey.push(lo)
                })
            })

            // let indexCount = 0;

            // listBox.forEach((box, index) => {
            //     box.location = listKey[indexCount];
            //     indexCount = indexCount + 1;
            // })

            const updateBoxes = listKey.map((key, index) => ({
                ...listBox[index],
                location: key,
            }))

            const dataBoxLocation = _.groupBy(updateBoxes, 'location');
            const dataUpdate = Object.keys(dataBoxLocation).map(lo => {
                const listMaterial = dataBoxLocation[lo];
                return {
                    boxIds: listMaterial.map(i => i.id),
                    location: lo,
                };
            })
            apiClientMongo.patch(`box-material/location-update`, dataUpdate)

            getLocation();
            setCurSelect([]);
            setSelect(false);
            onOkModal();
        } catch (err) {
            setSelect(false);
            handleErr(err);
        }
    }

    useEffect(() => {
        getLocation();
        const interval = setInterval(() => {
            getLocation();
        }, 1000*5)
        return () => {
            clearInterval(interval);
            setSelect(false)
        };
    }, []);

    useEffect(() => form.resetFields(), [form]);
    useEffect(() => {
        if (!select) { //close
            form.resetFields();
        } else {
        }
    }, [select, form])

    const _handleDelete = async () => {
        try {
            await services.deleteMany({ locationNames: curSelect })
            services.freeBoxMaterial({ locationNames: curSelect })

            openNotificationWithIcon("success", "Free locations successfully!")
            setCurSelect([])
            getLocation();
        } catch (err) {
            console.log(err)
        }

    }
    const _handleChangeItemCode = async (itemId) => {
        if (!itemId) {
            openNotificationWithIcon('error', 'Please select item code')
            return 0;
        }
        setItemSelected(itemId);
        const isExit = listItem.find(i => i.id === itemId)
        if (_.isEmpty(isExit)) {
            openNotificationWithIcon('error', 'Item code not found')
            return 0;
        }
        const dataBox = isExit.list_box
        // return 0
        const dataCount = Math.ceil(dataBox.length / curSelect.length)
        const locationMap = curSelect.map((i, index) => {
            let count = dataCount;
            if (index === curSelect.length - 1) {
                count = dataBox.length - dataCount * (curSelect.length - 1)
            }
            return {
                name: i,
                value: count,
                errors: null
            };
        });
        formLocation.setFields(locationMap);
    }
    return <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>
                <Tag color="default">{areaData.row} Row</Tag>
                <Tag color="default">{areaData.column} Column</Tag>
                <Tag color="default">{areaData.row * areaData.column} Position</Tag>
                <Tag color="success">{areaData.row * areaData.column - unAvailableCount} Available</Tag>
                <Tag color="error">{unAvailableCount} Unavailable</Tag>
            </p>
            {_.isEmpty(curSelect) ? null :
                <Dropdown overlay={
                    <div style={{ border: '1px solid #ccc', borderRadius: 5 }}>
                        <Menu>
                            <Menu.Item onClick={() => {
                                setSelect(curSelect)
                                setReloadMaterialList(true)
                            }}>Set material to position</Menu.Item>
                            <Menu.Item onClick={() => {
                                Modal.confirm({
                                    title: 'Confirm remove',
                                    icon: <ExclamationCircleOutlined />,
                                    content: `Remove item in: ${curSelect} `,
                                    onOk: _handleDelete
                                });
                            }
                            }>Free Location</Menu.Item>
                        </Menu>
                    </div>
                }>
                    <Button type="primary" style={{ borderRadius: 5 }}>
                        <Space>
                            Select action
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            }
        </div>
        <div style={{ overflow: 'scroll', minHeight: 'calc(100vh - 180px)' }}>
            {dataMap.map((row, rowInd) => (
                <div key={rowInd + ''} style={{ display: 'flex', }}>
                    {row.map((col, colInd) => {
                        const position = `${(colInd + 1) + (rowInd * areaData.column)}`.padStart(3, '0');
                        const locationPick = `${areaData.name}-${position}`.padStart(3, '0');
                        const locationId = `${areaData.id}-${position}`.padStart(3, '0');
                        const dataItem = get(location, [locationId]);
                        return <Popover
                            title={<>Position: <Tag style={{ fontSize: '1.1em', fontWeight: '500' }} color="gold">${locationPick}</Tag></>} content={
                                <div>
                                    {dataItem ?
                                        <div>
                                            <div className='flex justify-between'>
                                                <div className='w-30'>
                                                    Name
                                                </div>
                                                <div>
                                                    Count
                                                </div>
                                            </div>
                                            {Object.keys(dataItem).map(key => {
                                                return (
                                                    <div className='flex justify-between'>
                                                        <Tag color="cyan" style={{ fontSize: '1.1em', fontWeight: '500' }}>
                                                            {key}
                                                        </Tag>
                                                        <Tag>
                                                            {dataItem[key]}
                                                        </Tag>
                                                    </div>
                                                )
                                            })}

                                        </div>
                                        : <Tag color="success" style={{ fontSize: '1.1em', fontWeight: '500' }}>Location empty!</Tag>
                                    }
                                </div>
                            }>
                            <Box
                                // available={!get(location, locationPick, '')}
                                available={!dataItem}
                                selected={curSelect.includes(locationPick)}
                                // onClick={() => _handleClickBox(locationPick)}
                                key={rowInd + '' + colInd}>
                                {locationPick}
                            </Box>
                        </Popover>
                    })}
                </div>
            ))}
        </div>
        {loading ? <Skeleton /> : null}
        <Modal onOk={onOk} visible={!!select} onCancel={() => {
            setItemSelected('')
            setSelect(false);
            form.resetFields();
            formLocation.resetFields();
        }} title={"Set material for position"}>
            <div>
                <p style={{ fontSize: 16, fontWeight: '500' }}>
                    Please enter Item Code to continue
                </p>
                <Select loading={reloadMaterialList} disabled={reloadMaterialList} value={itemSelected} allowClear style={{ width: 400 }} onChange={val => _handleChangeItemCode(val)}>
                    {listItem?.map(i => {
                        return <Select.Option value={i.id}>{i.itemcode} - (G.E.NO: {i.ge_no}) - {_.get(i, 'list_box.length')} box</Select.Option>
                    })}
                </Select>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>Setting location selected:</div>
                <Form
                    autoComplete="off"
                    form={formLocation}>
                    {
                        !select ? null : select.map(i => {
                            return (<Form.Item
                                label={i}
                                name={i}
                            >
                                <InputNumber />
                            </Form.Item>)
                        })
                    }
                </Form>
            </div>

        </Modal >
    </div >
});

const Box = styled.div`

min-height: 5vh;
 /* min-width: 13vh; */
 padding: 0px 8px;
  background: ${({ available, selected }) => selected ? '#c9c909' : (available ? 'green' : 'red')};
   margin: 0.5vh;
   border: 1px solid #eee;
   border-radius: 5px;
   display: flex;
    color: #fff;
   justify-content: center;
   align-items: center;
   font-weight: bold;
   cursor: pointer;
   &:hover {
    opacity: .8;
   }
`