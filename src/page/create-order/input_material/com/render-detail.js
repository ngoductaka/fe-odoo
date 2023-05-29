import { useEffect, useRef, useState } from 'react';

import { Button, Card, Form, Input, Modal, Skeleton } from 'antd';

import DownloadExcel from 'com/excel/gen_excel';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import _ from 'lodash';
import styled from 'styled-components';
import { createOrder, getListBox } from '../services';
import TablePreview from './list_box';
import Download from 'com/excel/gen_excel';

const mongoObjectId = function () {
    var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    return (
        timestamp +
        'xxxxxxxxxxxxxxxx'
            .replace(/[x]/g, function () {
                return ((Math.random() * 16) | 0).toString(16);
            })
            .toLowerCase()
    );
};

const RenderDetail = ({ data, onOk, handleSavePreview }) => {
    const [dataSource, setDataSource] = useState();
    const [showDownload, setShowDownload] = useState(null);
    const [loading, setLoading] = useState(false);

    const downloadRef = useRef();

    useEffect(() => {
        if (data.list_box) {
            setDataSource(data.list_box);
            return () => {};
        }

        const handleAutoCheckBox = async () => {
            try {
                setLoading(true);
                const { data: dataBox } = await getListBox({
                    itemcode: data.itemcode,
                    lot: data.lot,
                });

                setDataSource(dataBox);
            } catch (error) {
                if (error?.response?.status === 404) {
                    openNotificationWithIcon('error', error?.response?.data?.message);
                    return;
                }

                console.error({ ...error });
            } finally {
                setLoading(false);
            }
        };

        handleAutoCheckBox();
    }, [data]);

    const handleAutoCheckBox = async () => {
        let isDownload = false;
        setLoading(true);
        const { data: dataBox } = await getListBox({
            itemcode: data.itemcode,
            lot: data.lot,
        });

        const boxSelected = [];
        let quantity = data.quantity;

        // auto select box
        for (const box of dataBox) {
            const stock = box.stock_in_warehouse;

            if (quantity === 0) break;
            if (quantity === stock) {
                quantity -= stock;
                boxSelected.push(box);
                break;
            } else if (quantity >= stock) {
                quantity -= stock;
                boxSelected.push(box);
            } else if (quantity < stock) {
                isDownload = true;
                const id = mongoObjectId();
                const newBox = {
                    ...box,
                    id,
                    rfid: id,
                    stock_in_warehouse: quantity,
                    isUpdate: true,
                    isDuplicate: true,
                    update_id: box.id,
                };

                boxSelected.push(newBox);
                break;
            }
        }

        setDataSource(boxSelected);
        setLoading(false);

        if (isDownload) {
            downloadRef.current?.click();
        }

        handleSavePreview(boxSelected);
    };

    const handleSubmit = async (value) => {
        if (!value) return;

        try {
            await createOrder({
                orderCode: value,
                orderItems: [
                    {
                        itemcode: data.itemcode,
                        quantity: data.quantity,
                        box: dataSource.length,
                        material_name: dataSource.find((item) => item.material_name)?.material_name,
                        quantity_issued: dataSource?.reduce(
                            (total, item) => total + item.stock_in_warehouse,
                            0
                        ),
                        lot: data.lot,
                        list_box: dataSource.map((item) => ({ ...item, itemcode: data.itemcode })),
                    },
                ],
            });
            onOk();
        } catch (err) {
            openNotificationWithIcon('error', err?.response?.data?.message || `Update errors`);
        }
    };

    return (
        <CardCustom>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>List box in warehouse: </h3>
            </div>
            <div>
                {!dataSource || loading ? (
                    <Skeleton />
                ) : (
                    <TablePreview input={dataSource} handleAutoCheckBox={handleAutoCheckBox} />
                )}
            </div>
            <Modal visible={!!showDownload} footer={null}>
                <h2>Material {_.get(showDownload, 'itemcode', '')} saved</h2>
                <h3>Please download file to print RFID code and continue</h3>
                <DownloadExcel
                    data={_.get(showDownload, 'list_box', [])}
                    element={
                        <Button
                            onClick={() => {
                                setShowDownload(null);
                            }}
                            style={{}}
                            type='primary'
                        >
                            Download file data RFID
                        </Button>
                    }
                />
            </Modal>

            <div hidden>
                <Download
                    data={dataSource?.filter((item) => item.isDuplicate)}
                    element={
                        <div
                            ref={downloadRef}
                            // onClick={() => delete rowData.isDuplicate}
                            style={{
                                background: 'red',
                                borderRadius: 5,
                                fontWeight: 'bold',
                                color: '#fff',
                            }}
                        >
                            Download Data
                        </div>
                    }
                />
            </div>
        </CardCustom>
    );
};

export default RenderDetail;

const CardCustom = styled(Card)`
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
