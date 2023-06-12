import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Modal, Select } from 'antd';

import './styles.css';
import { fetchLocations, locationsSelector } from 'app_state/master';
import { updateLocation } from './services';
import { images } from 'helper/static/images';

import ListCell from './com/ListCell';
import LineNameWrapper from './com/LineNameWrapper';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { useDispatch } from 'react-redux';
import { GeneralHeader } from 'com/app_layout/general_header';

const App = ({ handleClickCell = null, show }) => {
    const locations = useSelector(locationsSelector);
    const dispatch = useDispatch();

    const [size, setSize] = useState(5);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [title, setTile] = useState();

    const [form] = Form.useForm();
    useEffect(() => form.resetFields(), [form]);

    useEffect(() => {
        if (show)
            dispatch(fetchLocations());
    }, [show])
    const openModal = (areaName, lineNumber, cellNumber) => {
        const title = areaName + '-' + lineNumber + '-' + cellNumber;
        setTile(title);

        const initData = locations.find((item) => item.name === title);

        if (!initData) {
            setIsOpenModal(false);
            openNotificationWithIcon('error', 'Lỗi, vui lòng thử lại!');
            return;
        }

        form.setFields(Object.keys(initData).map((key) => ({ name: key, value: initData[key] })));

        setIsOpenModal(true);
    };

    const handleSubmit = async (data) => {
        if (!title) {
            setIsOpenModal(false);
            openNotificationWithIcon('error', 'Không có dữ liệu!');
            return;
        }

        const oldData = locations.find((item) => item.name === title);
        const updateData = { ...oldData, ...data };


        if (handleClickCell) {
            handleClickCell(oldData);
            setIsOpenModal(false);
            return;
        }
        try {
            // fix value status
            setConfirmLoading(true);
            await updateLocation({
                ...updateData,
                status: 'unavailable'
            });

            dispatch(fetchLocations());
            setIsOpenModal(false);
            openNotificationWithIcon('success', 'Cập nhật thành công!');
        } catch (error) {
            openNotificationWithIcon('error', error?.message);
        } finally {
            setConfirmLoading(false);
        }
    };

    return (
        <>
            <Modal
                title={title || 'Title'}
                visible={isOpenModal}
                onOk={() => form.submit()}
                confirmLoading={confirmLoading}
                onCancel={() => setIsOpenModal(false)}
                okText={handleClickCell ? 'Chọn' : 'Lưu'}
                cancelText='Hủy'
            >
                <Form onFinish={handleSubmit} form={form} layout='vertical'>
                    {handleClickCell ? (
                        <h3>Xác nhận chọn vị trí: {title}</h3>
                    ) : (
                        <>
                            <Form.Item name='material' label='Nguyên liệu'>
                                <Input placeholder='name' disable={true} />
                            </Form.Item>

                            {/* <Form.Item name='status' label='Trạng thái'>
                                <Select>
                                    {MATERIAL_STATUS.map((item) => (
                                        <Select.Option
                                            key={item}
                                            value={item}
                                            style={{ color: item }}
                                        >
                                            {item}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item> */}
                        </>
                    )}
                </Form>
            </Modal>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', border: '2px solid', margin: 6 }}>
                    {/* backgrounds */}
                    <div
                        style={{
                            position: 'absolute',
                            zIndex: -10,
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,

                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div style={{ flex: 1, background: '#e2ffe2' }} />
                        <div
                            style={{
                                height: `${size * 20.5}vh`,
                                background: '#ffffcc',
                                borderTop: '6px dashed #ffff00',
                            }}
                        />
                    </div>

                    {/* cells */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        {/* ================ AP: 01, 02 ================  */}
                        <div className='flex'>
                            <LineNameWrapper
                                lineNumber='01'
                                renderComponent={(lineNumber) => (
                                    <>
                                        <ListCell
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            num={12}
                                            size={size}
                                        />
                                        <ListCell
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            num={12}
                                            size={size}
                                            countFrom={13}
                                        />
                                    </>
                                )}
                            />

                            <LiftOut size={size} />

                            <LineNameWrapper
                                lineNumber='02'
                                renderComponent={(lineNumber) => (
                                    <>
                                        <ListCell
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            num={10}
                                            size={size}
                                        />
                                        <ListCell
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            num={10}
                                            size={size}
                                            countFrom={11}
                                        />
                                    </>
                                )}
                                position='bottom'
                            />
                        </div>

                        {/* ================ AP: 03, 04, 09 ================  */}
                        <div className='flex'>
                            <div style={{ marginTop: `${size}vh` }}>
                                <LineNameWrapper
                                    lineNumber='03'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />

                                <LineNameWrapper
                                    lineNumber='04'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />
                            </div>
                            <Mid size={size} step={4} />

                            <div
                                style={{
                                    height: `${10 * size}vh`,
                                    border: '1px solid red',
                                    position: 'relative',
                                }}
                            >
                                <p
                                    style={{
                                        width: `${3 * size}vh`,
                                        fontSize: 20,
                                        fontWeight: 500,
                                        color: 'blue',
                                    }}
                                >
                                    Ram UP
                                </p>
                                <div
                                    style={{
                                        zIndex: 10,
                                        position: 'absolute',
                                        bottom: 0,
                                        right: `-${(4 * size) / 2}vh`,
                                        display: 'flex',
                                        width: `${(4 * size) / 2}vh`,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: `${size / 2}vh`,
                                                width: `${size / 2}vh`,
                                                background: 'red',
                                            }}
                                        />
                                        <div
                                            style={{
                                                height: `${size / 2}vh`,
                                                width: `${size / 2}vh`,
                                                background: 'red',
                                            }}
                                        />
                                    </div>

                                    <ListCell
                                        openModal={(cellNumber) =>
                                            openModal('AP', '12', cellNumber)
                                        }
                                        lineNumber='12'
                                        areaName='AP'
                                        row={false}
                                        num={7}
                                        size={size}
                                    />
                                </div>
                            </div>

                            <LineNameWrapper
                                lineNumber='12'
                                position='centerXY'
                                renderComponent={(lineNumber) => (
                                    <div className='flex'>
                                        <Mid size={size} step={4} />
                                        <div style={{ marginTop: `${size * 3}vh` }}>
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('AP', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='AP'
                                                row={false}
                                                num={10}
                                                size={size}
                                                countFrom={8}
                                            />
                                        </div>

                                        <Mid size={size} />
                                        <div style={{ marginTop: `${size * 3}vh` }}>
                                            <Nodes size={size} type='one-node' />
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('AP', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='AP'
                                                row={false}
                                                num={6}
                                                size={size}
                                                countFrom={18}
                                            />
                                            <Nodes size={size} type='one-node' />
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('AP', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='AP'
                                                row={false}
                                                num={3}
                                                size={size}
                                                countFrom={24}
                                            />
                                        </div>

                                        <Mid size={size} />
                                        <div style={{ marginTop: `${size * 3}vh` }}>
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('AP', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='AP'
                                                row={false}
                                                num={7}
                                                size={size}
                                                countFrom={27}
                                            />
                                        </div>
                                    </div>
                                )}
                            />

                            <div
                                style={{
                                    border: '1px solid red',
                                    height: `${12 * size}vh`,
                                    marginTop: `-${2 * size}vh`,
                                }}
                            >
                                <p
                                    style={{
                                        width: `${4 * size}vh`,
                                        fontSize: 20,
                                        fontWeight: 500,
                                        color: 'blue',
                                        marginRight: -4,
                                    }}
                                >
                                    Ram UP
                                </p>
                            </div>
                        </div>

                        {/* ================ AP: 05, 06, 13, 14, 22, 23  ================  */}
                        <div className='flex'>
                            <div>
                                <LineNameWrapper
                                    lineNumber='05'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />
                                <LineNameWrapper
                                    lineNumber='06'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />
                            </div>
                            <Mid size={size} />

                            <div>
                                <LineNameWrapper
                                    lineNumber='13'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            num={10}
                                        />
                                    )}
                                />

                                <LineNameWrapper
                                    lineNumber='14'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            num={10}
                                        />
                                    )}
                                />
                            </div>
                            <Mid size={size} />

                            <div>
                                <LineNameWrapper
                                    lineNumber='22'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />

                                <LineNameWrapper
                                    lineNumber='23'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* ================ AP: 07, 15, 24  ================  */}
                        <div className='flex'>
                            <LineNameWrapper
                                lineNumber='07'
                                renderComponent={(lineNumber) => (
                                    <Normal
                                        openModal={(cellNumber) =>
                                            openModal('AP', lineNumber, cellNumber)
                                        }
                                        lineNumber={lineNumber}
                                        areaName='AP'
                                        size={size}
                                    />
                                )}
                            />
                            <Mid size={size} />

                            <LineNameWrapper
                                lineNumber='15'
                                renderComponent={(lineNumber) => (
                                    <Normal
                                        openModal={(cellNumber) =>
                                            openModal('AP', lineNumber, cellNumber)
                                        }
                                        lineNumber={lineNumber}
                                        areaName='AP'
                                        size={size}
                                        num={10}
                                    />
                                )}
                            />
                            <Mid size={size} />

                            <div style={{ marginTop: `${size * 2}vh` }}>
                                <LineNameWrapper
                                    lineNumber='24'
                                    renderComponent={(lineNumber) => (
                                        <ListCell
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            num={8}
                                            size={size}
                                        />
                                    )}
                                />
                                <Nodes size={size} />

                                <div
                                    className=''
                                    style={{
                                        height: `${size * 4}vh`,
                                        paddingTop: 18,
                                        paddingLeft: 22,
                                        fontSize: 20,
                                        fontWeight: 500,
                                        color: 'blue',
                                        border: '1px solid blue',
                                    }}
                                >
                                    <p style={{ paddingLeft: 22 }}>UP ==&gt;</p>
                                    <p style={{ paddingTop: 12 }}>STAIR CASE</p>
                                </div>
                            </div>
                        </div>

                        {/* ================ AP: 08, 09, 10, 16, 17, 18, 24, 25, 26  ================  */}
                        <div className='flex'>
                            <div>
                                <LineNameWrapper
                                    lineNumber='08'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            margin={false}
                                        />
                                    )}
                                />
                                <LineNameWrapper
                                    lineNumber='09'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />
                                <LineNameWrapper
                                    lineNumber='10'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />
                            </div>
                            <Mid size={size} />

                            <div>
                                <LineNameWrapper
                                    lineNumber='16'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            num={10}
                                            margin={false}
                                        />
                                    )}
                                />
                                <LineNameWrapper
                                    lineNumber='17'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            num={10}
                                        />
                                    )}
                                />
                                <LineNameWrapper
                                    lineNumber='18'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            num={10}
                                        />
                                    )}
                                />
                            </div>
                            <Mid size={size} />

                            <div>
                                <LineNameWrapper
                                    lineNumber='24'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            margin={false}
                                            countFrom={9}
                                        />
                                    )}
                                />
                                <LineNameWrapper
                                    lineNumber='25'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />
                                <LineNameWrapper
                                    lineNumber='26'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* ================ AP: 11, 19, 27  ================  */}
                        <div className='flex'>
                            <div className='' style={{ marginTop: `${size * 2}vh` }}>
                                <LineNameWrapper
                                    lineNumber='11'
                                    renderComponent={(lineNumber) => (
                                        <ListCell
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            num={8}
                                            size={size}
                                        />
                                    )}
                                />
                                <Nodes size={size} />

                                <div
                                    style={{
                                        border: '1px solid',
                                        height: `${size * 5}vh`,
                                        paddingTop: 32,
                                        textAlign: 'center',
                                        fontSize: 20,
                                        fontWeight: 500,
                                        color: 'blue',
                                        background: 'white',
                                    }}
                                >
                                    <p style={{ paddingLeft: 22 }}>WEAR HOUSE OFFICE</p>
                                    <p style={{ marginTop: -12 }}>26'-6"X20'-6</p>

                                    <div>
                                        <span
                                            style={{ border: '2px solid blue', padding: '0 6px' }}
                                        >
                                            R01
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Mid size={size} />

                            <LineNameWrapper
                                lineNumber='19'
                                renderComponent={(lineNumber) => (
                                    <Normal
                                        openModal={(cellNumber) =>
                                            openModal('AP', lineNumber, cellNumber)
                                        }
                                        lineNumber={lineNumber}
                                        areaName='AP'
                                        size={size}
                                        num={10}
                                    />
                                )}
                            />

                            <Mid size={size} />

                            <LineNameWrapper
                                lineNumber='27'
                                renderComponent={(lineNumber) => (
                                    <Normal
                                        openModal={(cellNumber) =>
                                            openModal('AP', lineNumber, cellNumber)
                                        }
                                        lineNumber={lineNumber}
                                        areaName='AP'
                                        size={size}
                                    />
                                )}
                            />
                        </div>

                        {/* ================ AP: 20, 28  ================  */}
                        <div className='flex'>
                            <div
                                style={{
                                    height: `${size * 3.5}vh`,

                                    paddingTop: 12,

                                    fontSize: 20,
                                    fontWeight: 500,
                                    color: 'blue',
                                    border: '1px solid',
                                    background: 'white',
                                }}
                            >
                                <p
                                    style={{
                                        width: `${size * 8}vh`,
                                        paddingLeft: 62,
                                        paddingTop: 12,
                                    }}
                                >
                                    STAIR CASE
                                </p>
                                <p style={{ width: `${size * 8}vh`, paddingLeft: 82 }}>&lt;== UP</p>
                            </div>
                            <Mid size={size} />

                            <div style={{ marginTop: `${-size * 1}vh` }}>
                                <LineNameWrapper
                                    lineNumber='20'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            margin={false}
                                            num={10}
                                        />
                                    )}
                                />
                            </div>

                            <Mid size={size} />

                            <div style={{ marginTop: `${-size * 1}vh` }}>
                                <LineNameWrapper
                                    lineNumber='28'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('AP', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='AP'
                                            size={size}
                                            margin={false}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* ================ AP: 21, 29  ================  */}
                        <div className='flex'>
                            <div style={{ marginTop: `${size * 2}vh` }}>
                                <LineNameWrapper
                                    lineNumber='11'
                                    renderComponent={(lineNumber) => (
                                        <>
                                            <Nodes size={size} />
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('AP', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='AP'
                                                num={8}
                                                size={size}
                                                countFrom={9}
                                            />
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('AP', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='AP'
                                                num={8}
                                                size={size}
                                                countFrom={17}
                                            />

                                            <div style={{ marginTop: `${size * 2}vh` }}>
                                                <ListCell
                                                    openModal={(cellNumber) =>
                                                        openModal('AP', lineNumber, cellNumber)
                                                    }
                                                    lineNumber={lineNumber}
                                                    areaName='AP'
                                                    num={8}
                                                    size={size}
                                                    countFrom={25}
                                                />
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                            <Mid size={size} />

                            <div style={{ marginTop: `${-size * 1}vh` }}>
                                <LineNameWrapper
                                    lineNumber='21'
                                    renderComponent={(lineNumber) => (
                                        <>
                                            <Normal
                                                openModal={(cellNumber) =>
                                                    openModal('AP', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='AP'
                                                size={size}
                                                num={10}
                                            />
                                            <div style={{ marginTop: `${size * 2}vh` }}>
                                                <ListCell
                                                    openModal={(cellNumber) =>
                                                        openModal('AP', lineNumber, cellNumber)
                                                    }
                                                    lineNumber={lineNumber}
                                                    areaName='AP'
                                                    size={size}
                                                    countFrom={31}
                                                />
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                            <Mid size={size} />

                            <div style={{ marginTop: `${-size * 1}vh` }}>
                                <LineNameWrapper
                                    lineNumber='29'
                                    renderComponent={(lineNumber) => (
                                        <>
                                            <Normal
                                                openModal={(cellNumber) =>
                                                    openModal('AP', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='AP'
                                                size={size}
                                            />
                                            <div style={{ marginTop: `${size * 2}vh` }}>
                                                <ListCell
                                                    openModal={(cellNumber) =>
                                                        openModal('AP', lineNumber, cellNumber)
                                                    }
                                                    lineNumber={lineNumber}
                                                    areaName='AP'
                                                    num={8}
                                                    size={size}
                                                    countFrom={25}
                                                />
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        {/* ======================== QUARANTINE AREA =========================== */}
                        <div className='flex'>
                            <div>
                                <Nodes size={size} />
                                <LineNameWrapper
                                    lineNumber='01'
                                    renderComponent={(lineNumber) => (
                                        <>
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('QA', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='QA'
                                                num={8}
                                                size={size}
                                            />
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('QA', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='QA'
                                                num={8}
                                                size={size}
                                                countFrom={9}
                                            />
                                        </>
                                    )}
                                />

                                <LineNameWrapper
                                    lineNumber='02'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('QA', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='QA'
                                            size={size}
                                        />
                                    )}
                                />
                            </div>
                            <Mid size={size} />

                            <div>
                                <Nodes size={size} />
                                <LineNameWrapper
                                    lineNumber='04'
                                    renderComponent={(lineNumber) => (
                                        <>
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('QA', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='QA'
                                                num={10}
                                                size={size}
                                            />
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('QA', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='QA'
                                                num={10}
                                                size={size}
                                                countFrom={11}
                                            />
                                        </>
                                    )}
                                />

                                <LineNameWrapper
                                    lineNumber='05'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('QA', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='QA'
                                            size={size}
                                            num={10}
                                        />
                                    )}
                                />
                            </div>
                            <Mid size={size} />

                            <div>
                                <Nodes size={size} />
                                <LineNameWrapper
                                    lineNumber='07'
                                    renderComponent={(lineNumber) => (
                                        <>
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('QA', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='QA'
                                                num={8}
                                                size={size}
                                            />
                                            <ListCell
                                                openModal={(cellNumber) =>
                                                    openModal('QA', lineNumber, cellNumber)
                                                }
                                                lineNumber={lineNumber}
                                                areaName='QA'
                                                num={8}
                                                size={size}
                                                countFrom={9}
                                            />
                                        </>
                                    )}
                                />
                                <LineNameWrapper
                                    lineNumber='08'
                                    renderComponent={(lineNumber) => (
                                        <Normal
                                            openModal={(cellNumber) =>
                                                openModal('QA', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='QA'
                                            size={size}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <Mid size={size} step={13} />
                            <div
                                style={{
                                    height: `${size * 2}vh`,
                                    textAlign: 'center',
                                    fontSize: 22,
                                    fontWeight: 600,
                                }}
                            >
                                <p style={{ margin: 'unset', marginTop: 8, color: 'blue' }}>
                                    QUARANTINE AREA
                                </p>
                                <p style={{ margin: 'unset', color: 'blue' }}>
                                    <span style={{ border: '3px solid blue', padding: '0 6px' }}>
                                        R04
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className='flex'>
                            <LineNameWrapper
                                lineNumber='03'
                                renderComponent={(lineNumber) => (
                                    <Normal
                                        openModal={(cellNumber) =>
                                            openModal('QA', lineNumber, cellNumber)
                                        }
                                        lineNumber={lineNumber}
                                        areaName='QA'
                                        size={size}
                                        margin={false}
                                    />
                                )}
                            />

                            <Mid size={size} />
                            <LineNameWrapper
                                lineNumber='06'
                                renderComponent={(lineNumber) => (
                                    <Normal
                                        openModal={(cellNumber) =>
                                            openModal('QA', lineNumber, cellNumber)
                                        }
                                        lineNumber={lineNumber}
                                        areaName='QA'
                                        size={size}
                                        num={10}
                                        margin={false}
                                    />
                                )}
                            />

                            <Mid size={size} />

                            <LineNameWrapper
                                lineNumber='09'
                                renderComponent={(lineNumber) => (
                                    <>
                                        <ListCell
                                            openModal={(cellNumber) =>
                                                openModal('QA', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='QA'
                                            size={size}
                                            num={8}
                                        />
                                        <Nodes size={size} />
                                        <ListCell
                                            openModal={(cellNumber) =>
                                                openModal('QA', lineNumber, cellNumber)
                                            }
                                            lineNumber={lineNumber}
                                            areaName='QA'
                                            size={size}
                                            num={8}
                                            countFrom={9}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        {/* ======================== END QUARANTINE AREA =========================== */}

                        <div style={{ display: 'flex', marginTop: `${size * 3}vh` }}>
                            <div
                                style={{
                                    height: `${size * 4}vh`,

                                    border: '1px solid',
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: 500,
                                    paddingTop: 12,
                                    background: '#ffa1a1',
                                }}
                            >
                                <div style={{ width: `${size * 15}vh` }}>
                                    <p style={{ width: `${size * 15}vh`, margin: 'unset' }}>
                                        REJECTION ROOM
                                    </p>
                                    <p style={{ margin: 'unset', marginBottom: 6 }}>
                                        52'-9"X20'-9"
                                    </p>
                                    <span style={{ border: '3px solid blue', padding: '0 6px' }}>
                                        R03
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{
                                    height: `${size * 4}vh`,

                                    border: '1px solid',
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: 500,
                                    paddingTop: 12,
                                    background: '#bdbdff',
                                }}
                            >
                                <div style={{ width: `${size * 7}vh` }}>
                                    <p style={{ margin: 'unset' }}>SAMPLING AREA</p>
                                    <p style={{ margin: 'unset', marginBottom: 6 }}>
                                        26'-2"X21'-0"
                                    </p>
                                    <span style={{ border: '3px solid blue', padding: '0 6px' }}>
                                        R02
                                    </span>
                                </div>
                            </div>

                            <Mid size={size} step={5} />
                            <div
                                style={{
                                    height: `${size * 4}vh`,

                                    border: '1px solid',
                                    fontSize: 24,
                                    fontWeight: 500,
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{ width: `${size * 3}vh`, marginRight: -6 }}>
                                    <p
                                        style={{
                                            margin: 'unset',
                                            marginTop: `${size * 2}vh`,
                                        }}
                                    >
                                        LIFT
                                    </p>
                                    <p style={{ margin: 'unset' }}>IN</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* lines */}
                    <div>
                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 82}vh`,
                                left: `${size * 0}vh`,
                            }}
                        >
                            <XLine size={size} num={8} />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 6}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <YLine size={size} num={76} />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 6}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <XLine size={size} />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 6}vh`,
                                left: `${size * 10}vh`,
                            }}
                        >
                            <YLine size={size} num={76} />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 82}vh`,
                                left: `${size * 10}vh`,
                            }}
                        >
                            <XLine size={size} num={10} />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <YLine size={size} num={77} />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <XLine size={size} />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 5}vh`,
                                left: `${size * 22}vh`,
                            }}
                        >
                            <YLine size={size} num={77} />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 82}vh`,
                                left: `${size * 22}vh`,
                            }}
                        >
                            <XLine size={size} num={8} />
                        </div>
                    </div>

                    {/* arrows */}
                    <div>
                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 8.5}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 8.5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 15}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 15}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 20.5}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 20.5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 26}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 26}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 31.5}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 31.5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 37}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 37}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 42.5}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 42.5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 48}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 48}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 8.5}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 8.5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 59}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        {/* three arrow */}
                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 53.5}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.threeArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 53.5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 59}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 64.5}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 64.5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 70}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 70}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 75.5}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 75.5}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.fourArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                rotate: '90deg',
                                top: `${size * 80}vh`,
                                left: `${size * 8}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.twoArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                rotate: '90deg',
                                top: `${size * 80}vh`,
                                left: `${size * 20}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.twoArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                rotate: '90deg',
                                top: `${size * 82}vh`,
                                left: `${size * 5}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.twoArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                rotate: '90deg',
                                top: `${size * 82}vh`,
                                left: `${size * 13}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.twoArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                top: `${size * 82}vh`,
                                left: `${size * 16}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.twoArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                rotate: '90deg',
                                top: `${size * 82}vh`,
                                left: `${size * 19}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 2}vh`, height: `${size * 2}vh` }}
                                src={images.twoArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                // rotate: "90deg",
                                top: `${size * 82.5}vh`,
                                left: `${size * 27}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size * 1.5}vh`, height: `${size * 1.5}vh` }}
                                src={images.oneArrow}
                                alt=''
                            />
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                rotate: '90deg',
                                top: `${size * 83}vh`,
                                left: `${size * 28}vh`,
                            }}
                        >
                            <img
                                style={{ width: `${size}vh`, height: `${size}vh` }}
                                src={images.oneArrow}
                                alt=''
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const XLine = ({ size, num = 2 }) => (
    <div style={{ width: `${size * num}vh`, height: 3, background: 'red' }} />
);

const YLine = ({ size, num = 12 }) => (
    <div style={{ height: `${size * num}vh`, width: 3, background: 'red' }} />
);

const Nodes = ({ size, type = 'two-node' }) => {
    const isTwoNode = type === 'two-node';

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: isTwoNode ? 'space-between' : 'center',
                margin: '0 -6px',
            }}
        >
            {isTwoNode && (
                <div
                    style={{
                        height: `${size / 2}vh`,
                        width: `${size / 2}vh`,
                        background: 'red',
                    }}
                />
            )}
            <div
                style={{
                    height: `${size / 2}vh`,
                    width: `${size / 2}vh`,
                    background: 'red',
                }}
            />
        </div>
    );
};

const Normal = ({
    lineNumber,
    areaName,
    size,
    num = 8,
    type,
    countFrom = 1,
    margin = true,
    openModal = () => { },
}) => {
    const nodeType = type ?? (num === 10 ? 'one-node' : 'two-node');

    return (
        <div style={{ marginTop: margin ? `${size * 2}vh` : 0 }}>
            <ListCell
                lineNumber={lineNumber}
                areaName={areaName}
                openModal={openModal}
                num={num}
                size={size}
                countFrom={countFrom}
            />

            <Nodes size={size} type={nodeType} />

            <ListCell
                lineNumber={lineNumber}
                areaName={areaName}
                openModal={openModal}
                num={num}
                size={size}
                countFrom={countFrom + num}
            />
            <ListCell
                lineNumber={lineNumber}
                areaName={areaName}
                openModal={openModal}
                num={num}
                size={size}
                countFrom={countFrom + num * 2}
            />
        </div>
    );
};

const Mid = ({ size, step = 2 }) => {
    return <div style={{ minWidth: `${size * step}vh` }} />;
};

const LiftOut = ({ size = 5 }) => {
    return (
        <div style={{ height: `${2 * size}vh` }} className='center'>
            <div
                style={{
                    width: `${3 * size}vh`,
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 500,
                    color: 'blue',
                }}
            >
                <div style={{ margin: '-5px 0px' }}>OUT</div>
                <div style={{ margin: '-5px 0px' }}>LIFT</div>
            </div>
        </div>
    );
};

export default App;
