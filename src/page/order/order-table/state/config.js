import { Button, Popover, Tag } from "antd";
import QRCode from "react-qr-code";
import moment from "moment";
import { Link } from "react-router-dom";
import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE

const map_color = {
    'pending': 'processing',
    'full-fill': 'success',
    'out-stock': 'warning',
};

export const initialStateConfig = {
    formAdd: [
        {
            name: "order_code",
            label: "Order Code",
            rules: [{ required: true }],
        },
        {
            name: "from",
            label: "From",
        },
        {
            name: 'to',
            label: 'To',
        },
        {
            name: 'prepared_by',
            label: 'Prepared By',
        },
        {
            name: 'issued_by',
            label: 'Issued By',
        },
        {
            name: 'received_by',
            label: 'Received By',
        },
        {
            name: 'effective_date',
            label: 'Effective Date',
            type: 'date',
        },
        {
            name: 'date',
            label: 'Request Date',
            type: 'date',
        },
    ],
    formEdit: [
        {
            name: "order_code",
            label: "Order Code",
            disabled: true,
        },
        {
            name: "status",
            label: "Status",
            type: 'select',
            // 'pending', 'full-fill', 'out-stock', 'confirm-in-use'
            data: [
                {id: 'pending'},
                {id: 'full-fill'},
                {id: 'out-stock'},
                {id: 'confirm-in-use'},
            ]
        },
        {
            name: "from",
            label: "From",
        },
        {
            name: "id",
            label: "id",
            hidden: true,
        },
        {
            name: 'to',
            label: 'To',
        },
        {
            name: 'prepared_by',
            label: 'Prepared By',
        },
        {
            name: 'issued_by',
            label: 'Issued By',
        },
        {
            name: 'received_by',
            label: 'Received By',
        },
        {
            name: 'effective_date',
            label: 'Effective Date',
            type: 'date',
        },
        {
            name: 'date',
            label: 'Request Date',
            type: 'date',
        },
    ],
    formFilter: [{
        name: "order_code",
        label: "Order code",
    }],
    // "id": 1, "name": "TP1", "row": 10, "column": 20}
    listColumn: [
        {
            title: 'Order Code',
            key: 'order_code',
            dataIndex: 'order_code'
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: val => {
                return <Tag color={map_color[val]}>{val}</Tag>
            }
        },
        {
            title: "From",
            key: "from",
            dataIndex: 'from',
        },
        {
            title: 'To',
            key: 'to',
            dataIndex: 'to'
        },
        {
            title: 'Prepared by',
            key: 'prepared_by',
            dataIndex: 'prepared_by'
        },
        {
            title: 'Issued by',
            key: 'issued_by',
            dataIndex: 'issued_by'
        },
        {
            title: 'Received by',
            key: 'received_by',
            dataIndex: 'received_by'
        },
        {
            title: 'Effective Date',
            key: 'effective_date',
            dataIndex: 'effective_date',
            render: val => val ? moment(val).format("DD/MM/YYYY") : null,
        },
        {
            title: "Request Date",
            key: "date",
            dataIndex: 'date',
            render: val => val ? moment(val).format("DD/MM/YYYY") : null,
        },
        {
            title: "Action",
            key: "id",
            dataIndex: 'id',
            render: (val, record) => <div>
                <Link to={`/order/${val}`}><Button>Detail</Button></Link>
            </div>,
        },

    ],
    loading: false,
};
// TYPE
const type = {
    'set_jsonForm': 'set_jsonForm',
    'set_columnData': 'set_columnData',
    'set_filterJsonForm': 'set_filterJsonForm',
}
// ACTION
const set_jsonForm = (data) => ({ type: type.set_jsonForm, data })
const set_filterJsonForm = (data) => ({ type: type.set_filterJsonForm, data })
const set_columnData = (data) => ({ type: type.set_columnData, data })
// action request

export const requestFilterForm = async (dispatch) => {
    try {
        const formFilter = await services.getFilterForm();
        dispatch(set_filterJsonForm(formFilter.data));
    } catch (err) {
        handleErr(err);
    }
}

export const requestFormData = async (dispatch) => {
    try {
        const [
            formAdd,
            formEdit,
            formFilter
        ] = await Promise.all([
            services.getPostForm(),
            services.getPatchForm(),
            services.getFilterForm(),
        ]);

        dispatch(set_jsonForm({
            formAdd: formAdd.data.data.map(i => {
                if (i.name === 'role_id') {
                    i.data = [
                        { id: 4, name: 'manager' },
                        { id: 5, name: 'employee' }
                    ]
                }
                return i;
            }),
            formEdit: formEdit.data.data.map(i => {
                if (i.name === 'role_id') {
                    i.data = [
                        { id: 4, name: 'manager' },
                        { id: 5, name: 'employee' }
                    ]
                }
                return i;
            }),
            formFilter: formFilter.data.data,
        }));

    } catch (err) {
        handleErr(err);
    }

}

export const requestDataColumn = async (dispatch) => {
    try {
        // const { data } = await services.getListColumn();
        // console.log('data', data)
        // dispatch(set_columnData(data))
    } catch (err) {

    }
}
export const requestUpdateColumn = async (dispatch, dataUpdate) => {
    try {
        await services.updateListColumn(dataUpdate);
        requestDataColumn(dispatch)
    } catch (err) {

    }
}
// REDUCER
export const reducerConfig = (state, action) => {
    switch (action.type) {
        case 'set_jsonForm':
            return {
                ...state, loading: false,
                formAdd: action.data.formAdd,
                formEdit: action.data.formEdit,
                formFilter: action.data.formFilter,
            };
        case 'set_filterJsonForm':
            return {
                ...state, loading: false,
                formFilter: action.data,
            };
        case 'set_columnData':
            return {
                ...state, loading: false,
                listColumn: action.data,
            };
        default:
            return state;
    }
};
