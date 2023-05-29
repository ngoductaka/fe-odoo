import { useState, useEffect } from 'react';

import { DownOutlined, DeleteOutlined, UpOutlined } from '@ant-design/icons';
import { Card, Input, Button, Popconfirm } from 'antd';
import styled from 'styled-components';
import { createEntry, deleteEntry } from 'page/material-in/services';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { useDispatch } from 'react-redux';
import { fetchMasterData } from 'app_state/master';

export default function Item({ dataItem, dataSaved }) {
    const dispatch = useDispatch();

    const [show, setShow] = useState(true);
    const [newItem, setNewItem] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(dataSaved);
    }, [dataSaved]);

    // const _saveData = (data) => {
    //     localStorage.setItem(dataItem.dataKey, JSON.stringify(data));
    // };

    const _handleAddNew = async () => {
        try {
            await createEntry(dataItem.url, { name: newItem, descriptions: '' });
            setNewItem('');
            dispatch(fetchMasterData());
        } catch (error) {
            openNotificationWithIcon('error', error?.message);
        }

        // _saveData(newData);
        // const newData = Array.from(new Set([...data, newItem]));
        // setData(newData);
    };

    const _handleDel = async (id) => {
        try {
            await deleteEntry(dataItem.url, { id });
            dispatch(fetchMasterData());
        } catch (error) {
            openNotificationWithIcon('error', error?.message);
        }

        // const newData = data.filter((item) => item.id !== id);
        // setData(newData);
        // _saveData(newData);
    };
    return (
        <CardCustom style={{ width: '30vw' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                    alignItems: 'center',
                }}
            >
                <span>{dataItem?.title || ''}</span>
                {!show ? (
                    <DownOutlined onClick={() => setShow(!show)} />
                ) : (
                    <UpOutlined onClick={() => setShow(!show)} />
                )}
            </div>
            {show ? (
                <div className='body'>
                    <Input.Group compact>
                        <Input
                            value={newItem}
                            onChange={(val) => setNewItem(val.target.value)}
                            onPressEnter={_handleAddNew}
                            style={{ width: 'calc(100% - 95px)' }}
                            placeholder='New value'
                        />
                        <Button onClick={_handleAddNew} type='primary'>
                            Add new
                        </Button>
                    </Input.Group>

                    <div>
                        {Array.isArray(data)
                            ? data.map((item) => (
                                  <div
                                      style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          borderBottom: '1px solid #ddd',
                                          padding: '8px 4px',
                                      }}
                                  >
                                      <div style={{ overflow: 'hidden', flex: 1 }}>{item.name}</div>

                                      <Popconfirm
                                          placement='rightTop'
                                          title={'Are you sure to delete this task?'}
                                          onConfirm={() => _handleDel(item.id)}
                                          okText='Yes'
                                          cancelText='No'
                                      >
                                          <DeleteOutlined style={{ color: 'red' }} />
                                      </Popconfirm>
                                  </div>
                              ))
                            : null}
                    </div>
                </div>
            ) : null}
        </CardCustom>
    );
}

export const CardCustom = styled(Card)`
    margin: 0px;
    border-radius: 10px;
    margin-top: 20px;
    padding: 16px;
    & .ant-card-head {
        padding: 0px;
        min-height: 41px;
    }
    & .ant-card-body {
        padding: 0px;
    }
    & .ant-card-head-title {
        padding: 1px 0px;
    }
    & .ant-card-extra {
        padding: 10px 0px;
    }
    & .body {
        border-top: 1px solid #ddd;
        padding-top: 16px;
    }
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
