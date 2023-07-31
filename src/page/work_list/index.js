import { apiRPC } from 'helper/request/rpc_proxy';
import moment from 'moment';
import { Button } from 'antd'
import React from 'react';

const App = () => {
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        apiRPC.call({
            method: "web_search_read",
            model: "mrp.production",
            params: [
                ["&", ["picking_type_id.active", "=", true], ["state", "in", ["draft", "confirmed", "progress", "to_close"]]],
                ["activity_exception_decoration", "activity_exception_icon", "activity_state", "activity_summary", "activity_type_icon", "activity_type_id", "company_id", "product_uom_category_id", "priority", "message_needaction", "name", "date_planned_start", "date_deadline", "product_id", "lot_producing_id", "bom_id", "activity_ids", "origin", "user_id", "components_availability_state", "components_availability", "reservation_state", "product_qty", "product_uom_id", "production_duration_expected", "production_real_duration", "state", "delay_alert_date", "json_popover", "workorder_ids"]
            ]
        })
            .then(({ data }) => {
                setData(data.records)
            })
    }, []);
    return (
        <div className="App">
            <div style={{background: '#173348', fontSize: 20, textAlign: 'center', padding: '5px 0px', color: '#fff', fontWeight: 'bold'}}>Production Status</div>
            <Header />
            {data.map((item, index) => {
                return <Item key={index + ''} index={index} data={item} />
            })}
        </div>
    );
}

const Header = ({ data }) => {
    return (
        <div className='flex' style={{
            background: '#214D6E',
            fontSize: 16,
            color: 'white',
            padding: 10,
            borderBottom: '1px solid white'
        }}>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '>Ngày giao hàng</div>
            <div style={{ flex: 2 }} className='truncate border-r px-2 '>Mã phiếu / Mã sản phẩm</div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '>P1 - Máy Sóng </div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '>P2 - Máy In</div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '>P3 - Máy Ghim</div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '>P4 - Hoàn thiện</div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '>Nhận sét</div>
            <div style={{ flex: 1 }} className=' truncate px-2 '>Trạng thái</div>
        </div>
    );
}
const val = () => Math.floor(Math.random() * 100)
const dataRand = () => moment().add(val(), 'd').format('DD/MM/YYYY');
const Item = ({ data, index }) => {
    return (
        <div className={`flex ${index % 2 === 0 ? "" : 'bg-gray-200'} mt-1`} style={{ padding: '0px 10px' }}>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '>{dataRand()}</div>
            <div style={{ flex: 2 }} className='truncate border-r px-2 '>{data.name} / {data?.product_id[1]}</div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '><ProgressItem /> </div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '><ProgressItem /> </div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '><ProgressItem /> </div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '><ProgressItem /> </div>
            <div style={{ flex: 1 }} className=' truncate border-r px-2 '></div>
            <div style={{ flex: 1 }} className=' truncate px-2 '>
                <div style={{ 
                    background: mapColor[data?.state], 
                    textAlign: 'center', 
                    borderRadius: 10
                     }}><span className='font-bold'>{mapStt[data?.state]}</span></div>
            </div>
        </div>
    );
}
export default App;

const ProgressItem = ({ plan = val() + 100, actual = val() }) => {
    const per = (actual / plan * 100);
    return <div style={{ fontSize: 11 }} className='flex items-center'>
        <div style={{ background: '#aaa', marginTop: 3, flex: 1 }}>
            <div style={{ width: `${per}%`, height: 15, background: 'green', paddingLeft: 5 }} >{actual}</div>
        </div>
        <div style={{ width: 30 }}>
            {plan}
        </div>

    </div>
}

const mapStt = {
    'waiting': "waiting",
    'progress': "progress",
}
const mapColor = {
    'waiting': "#17a2b8",
    'progress': "#ffc107",
}