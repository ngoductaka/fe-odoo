import { apiRPC } from 'helper/request/rpc_proxy';
import React from 'react';

const App = () => {
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        apiRPC.call({
            method: "web_search_read",
            model: "mrp.production",
            params: [
                ["&", ["picking_type_id.active", "=", true], ["state", "in", ["draft", "confirmed", "progress", "to_close"]]],
                ["activity_exception_decoration", "activity_exception_icon", "activity_state", "activity_summary", "activity_type_icon", "activity_type_id", "company_id", "product_uom_category_id", "priority", "message_needaction", "name", "date_planned_start", "date_deadline", "product_id", "lot_producing_id", "bom_id", "activity_ids", "origin", "user_id", "components_availability_state", "components_availability", "reservation_state", "product_qty", "product_uom_id", "production_duration_expected", "production_real_duration", "state", "delay_alert_date", "json_popover"]
            ]
        })
            .then(({ data }) => {
                setData(data.records)
            })
    });
    return (
        <div className="App">
            <div>Production Status</div>
            <Header />
            {data.map((item, index) => {
                return <Item />
            })}
        </div>
    );
}

const Header = () => {
    return (
            <div className='flex'>
                <div className='flex-1'>Mã phiếu</div>
                <div className='flex-1'>Ngày dự kiến</div>
                <div className='flex-1'>Trạng thái linh kiện </div>
                <div className='flex-1'>Số lượng</div>
                <div className='flex-1'>Đơn vị</div>
                <div className='flex-1'>Thời gian dự kiến</div>
                <div className='flex-1'>Thời gian thực tế </div>
                <div className='flex-1'>Trạng thái</div>
            </div>
        );
}
const Item = () => {
    return (
        <div className='flex'>
        <div className='flex-1'>Mã phiếu</div>
        <div className='flex-1'>Ngày dự kiến</div>
        <div className='flex-1'>Trạng thái linh kiện </div>
        <div className='flex-1'>Số lượng</div>
        <div className='flex-1'>Đơn vị</div>
        <div className='flex-1'>Thời gian dự kiến</div>
        <div className='flex-1'>Thời gian thực tế </div>
        <div className='flex-1'>Trạng thái</div>
    </div>
        );
}
export default App;