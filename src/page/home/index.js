import { apiRPC } from 'helper/request/rpc_proxy';
import React from 'react';
import { Button, Skeleton, InputNumber } from 'antd'
import _ from 'lodash';
import { EditOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';


const App = () => {
    const [listMachine, setListMachine] = React.useState([]);
    const [activeMachine, setActiveMachine] = React.useState({ id: null });
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        apiRPC.call({
            method: "web_search_read",
            model: "mrp.workcenter",
            params: []
        })
            .then(({ data }) => {
                console.log("data", data);
                setListMachine(data.records);
                setActiveMachine({
                    id: _.get(data, 'records[0].id', null),
                    name: _.get(data, 'records[0].display_name', null),
                })
            })
            .finally(() => {
                setLoading(false);
            });
    }, [])
    if (loading) return <Skeleton />
    return (
        <div className='p-4 bg-white h-full mb-4' style={{ fontSize: 15 }}>
            <p className='mb-3 font-semibold text-lg' style={{ fontSize: '2em' }}> Chọn máy để xem chi tiêt </p>
            <div className='flex justify-between items-stretch overflow-auto'>
                {listMachine.map(i => {
                    return (
                        <div
                            style={{ fontSize: '1em', minWidth: 180 }}
                            key={i.id}
                            className={`flex-1 mx-3 p-3 rounded-lg  ${activeMachine?.id == i.id ? 'bg-sky-500' : 'bg-slate-100'}`}>
                            <div onClick={() => setActiveMachine({
                                id: i.id,
                                name: i.display_name,
                            })} >
                                <h1>{i.display_name}</h1>
                                <h2>Đang thực hiện: {i.workorder_progress_count}</h2>
                                <h2>Hiệu xuất: <span>{i.oee}%</span></h2>
                            </div>
                            <Button onClick={(e) => {
                                console.log(i.id);
                                e.preventDefault();
                                return 1;
                            }} className='w-full'>Chọn nhân viên</Button>
                        </div>
                    )
                })}
            </div>

            <div className='border-slate-500 border-b w-full my-3'></div>

            {activeMachine?.id ? <TableData activeMachine={activeMachine} /> : null}

        </div>
    );

};

const TableData = ({ activeMachine }) => {

    const [tableData, setTableData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [order, setOrder] = React.useState({});

    React.useEffect(() => {
        if (!_.get(activeMachine, 'id')) return () => { };
        setLoading(true)
        apiRPC.call({
            method: "web_search_read",
            model: "mrp.workorder",
            params: [
                ["&", ["state", "not in", ["done", "cancel"]], "&", ["workcenter_id", "=", _.get(activeMachine, 'id')], "|", ["state", "=", "ready"], ["state", "=", "progress"]],
                ["name", "production_id", "state", "is_user_working", "working_user_ids", "last_working_user_id", "working_state", "workcenter_id", "product_id", "qty_remaining", "qty_production", "date_planned_start", "production_date", "product_uom_id", "operation_id", "__last_update"]
            ]
            // ["&",["state","not in",["done","cancel"]],"&",["workcenter_id","=",activeMachine],"|",["state","=","ready"],["state","=","progress"]]
        }).then(({ data }) => {
            console.log(data, '00000');
            setTableData(data.records);
            const item = _.get(data, 'records[0]');
            if (item)
                setOrder({
                    id: item.id,
                    name: `${_.get(item, 'production_id[1]')} - ${_.get(item, 'operation_id[1]')}`,
                    plan: _.get(item, 'qty_production', 0)
                })
        }).finally(() => {
            setLoading(false)
        });

    }, [activeMachine])
    if (loading) return <Skeleton />
    return (
        <div>
            <p className='my-3 font-semibold text-lg' style={{ fontSize: '2em' }}> {_.get(activeMachine, 'name')} </p>
            {_.isEmpty(tableData) ? <b className='mt-5'>Không có lệnh làm việc</b> :
                <div >
                    <p className='my-3 font-semibold'> Chọn lệnh làm việc để xem chi tiêt </p>
                    <div className='overflow-auto' style={{ maxHeight: '45vh' }}>
                        {tableData.map(i => {
                            const plan = _.get(i, 'qty_production', 0);
                            const actual = plan - _.get(i, 'qty_remaining');
                            const per = Math.floor(100 * (actual / plan), 2);
                            return (
                                <div onClick={() => setOrder({
                                    id: i.id,
                                    plan,
                                    name: `${_.get(i, 'production_id[1]', 0)} - ${_.get(i, 'operation_id[1]')}`
                                })} key={i.id}
                                    className={`border border-slate-500 px-4 py-3 rounded-lg mt-4 ${order?.id === i.id ? 'bg-sky-500' : ''}`}>
                                    <div className='flex'>
                                        <div>
                                            <div className='flex justify-between'>
                                                <div className='font-bold'>{_.get(i, 'production_id[1]')} - {_.get(i, 'operation_id[1]')} </div>
                                                <div>{_.get(i, 'production_date')} </div>
                                                <div >
                                                    <Button style={{ background: mapColor[_.get(i, 'state')] }}><span className='font-bold'>{mapStt[_.get(i, 'state')]}</span></Button>
                                                </div>
                                            </div>
                                            <div className='flex justify-between mt-3'>
                                                <div className='font-bold'> {_.get(i, 'product_id[1]')} </div>
                                            </div>
                                        </div>
                                        <div className='ml-4 font-bold'>
                                            <div className='flex justify-between'><div className="mr-2 min-w-fit">Kế hoạch:</div> {plan} </div>
                                            <div className='flex justify-between'><div className="mr-2 min-w-fit">Thực tế:</div> {actual} </div>
                                            <div className='flex justify-between'><div className="mr-2 min-w-fit">Tỷ lệ:</div> {per} </div>
                                        </div>
                                    </div>
                                    {/* <div className='font-bold text-lg'> {_.get(i, 'qty_production')} / {_.get(i, 'qty_remaining')} {_.get(i, 'product_uom_id[1]')} </div> */}
                                </div>
                            )
                        })}
                    </div>

                    <div className='border-slate-500 border-b w-full my-3'></div>
                    {order?.id ? <Order order={order} /> : null}
                </div>
            }
        </div>
    )
}

const Order = ({ order }) => {
    const [product, setProduct] = React.useState(0);
    const [ng, setNG] = React.useState(0);
    React.useEffect(() => {

        if (order?.id) {
            console.log(order.plan, 'order.plan')
            setProduct(+order.plan)
        }
    }, [order]);

    return (
        <div>
            <div className="flex justify-between items-center">
                <p className='my-3 font-semibold text-lg' style={{ fontSize: '2em' }}> {order?.name} </p>
                <div >
                    <Button style={{ fontSize: '1em' }} icon={<PlayCircleOutlined />} onClick={() => { }} >Chạy</Button>
                    <Button style={{ fontSize: '1em' }} icon={<PauseCircleOutlined />} onClick={() => { }} >Tạm dừng</Button>
                    <Button style={{ fontSize: '1em' }} icon={<EditOutlined />} onClick={() => { }} >Ghi nhận sản xuất</Button>
                </div>
            </div>
            <div className='flex justify-between items-center mt-6'>
                <div>
                    <div style={{ fontSize: '1.5em' }} className='text-lg'>Số lượng sản phẩm</div>
                    <InputNumber value={product} onChange={setProduct} style={{ height: 60, width: 220, fontSize: 40 }} />
                </div>
                <div>
                    <div style={{ fontSize: '1.5em' }} className='text-lg'>Số lượng NG</div>
                    <InputNumber value={ng} onChange={setNG} style={{ height: 60, width: 220, fontSize: 40 }} />
                </div>
                <div>
                    <Button style={{ fontSize: '1.5em', padding: '10px 20px', height: 70 }} type='primary'>
                        Cập nhật hệ thống
                    </Button>
                </div>
            </div>

        </div>
    )

};


export default App;

const mapStt = {
    'waiting': "Đang chờ linh kiện",
    'progress': "Đang thực hiện",
}
const mapColor = {
    'waiting': "#17a2b8",
    'progress': "#ffc107",
}