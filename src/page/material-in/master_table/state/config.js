import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE
export const initialStateConfig = {
    formAdd: [
        {
            name: "itemcode",
            label: "itemcode",
            rules: [{ required: true }],
        },
        {
            name: "product_category",
            label: "Product category",
        },
        {
            name: 'sub_category',
            label: 'Sub category',
        },
        {
            name: 'type_name',
            label: 'Type name',
        },
        {
            name: 'material_name',
            label: 'Material name',
        },
        {
            name: 'artwork_status',
            label: 'Artwork status',
        },
        {
            name: 'supplier_name',
            label: 'Supplier name',
        },
        {
            name: 'unit_type',
            label: 'Unit type',
        },
        {
            name: 'qc_status',
            label: 'QC status',
        },
        {
            name: 'remarks',
            label: 'Remarks',
        },
        {
            name: 'price',
            label: 'Price',
        },
        {
            name: 'artwork',
            label: 'Artwork',
        },
        {
            name: 'receiving_date',
            label: 'Receiving date',
            type: 'date',
        },
        {
            name: 'mfg_date',
            label: 'Mfg date',
            type: 'date',
        },
        {
            name: 'exp_date',
            label: 'Exp date',
            type: 'date',
        },
        {
            name: 'opening_stock',
            label: 'Opening stock',
        },
        {
            name: 'carton_size',
            label: 'Carton size',
        },
        {
            name: 'cartons_beans',
            label: 'Cartons beans',
        },
        {
            name: 'qc_passed',
            label: 'QC passed',
        },
        {
            name: 'sampled_by_qc',
            label: 'Sampled by qc',
        },
        {
            name: 'stock_in_warehouse',
            label: 'Stock in warehouse',
        },
        {
            name: 'temperature',
            label: 'Temperature',
        },
    ],
    formEdit: [
        {
            name: "itemcode",
            label: "itemcode",
            disabled: true,
            rules: [{ required: true }],
            fixed: 'left',
            width: 120,
        },
        {
            name: "product_category",
            label: "Product category",
        },
        {
            name: 'sub_category',
            label: 'Sub category',
        },
        {
            name: 'type_name',
            label: 'Type name',
        },
        {
            name: 'material_name',
            label: 'Material name',
        },
        {
            name: 'artwork_status',
            label: 'Artwork status',
        },
        {
            name: 'supplier_name',
            label: 'Supplier name',
        },
        {
            name: 'unit_type',
            label: 'Unit type',
        },
        {
            name: 'qc_status',
            label: 'QC status',
        },
        {
            name: 'remarks',
            label: 'Remarks',
        },
        {
            name: 'price',
            label: 'Price',
        },
        {
            name: 'artwork',
            label: 'Artwork',
        },
        {
            name: 'receiving_date',
            label: 'Receiving date',
            type: 'date',
        },
        {
            name: 'mfg_date',
            label: 'Mfg date',
            type: 'date',
        },
        {
            name: 'exp_date',
            label: 'Exp date',
            type: 'date',
        },
        {
            name: 'opening_stock',
            label: 'Opening stock',
        },
        {
            name: 'carton_size',
            label: 'Carton size',
        },
        {
            name: 'cartons_beans',
            label: 'Cartons beans',
        },
        {
            name: 'qc_passed',
            label: 'QC passed',
        },
        {
            name: 'sampled_by_qc',
            label: 'Sampled by qc',
        },
        {
            name: 'stock_in_warehouse',
            label: 'Stock in warehouse',
        },
        {
            name: 'temperature',
            label: 'Temperature',
        },
    ],
    formFilter: [{
        name: "name",
        label: "Name",
        rules: [{ required: true }],
    }],
    // "id": 1, "name": "TP1", "row": 10, "column": 20}
    listColumn: [
        {
            title: "Item code",
            key: "itemcode",
            dataIndex: 'itemcode',
            width: 120,
            fixed: 'left',
        },
        {
            title: "Product category",
            key: "product_category",
            dataIndex: 'product_category',
            width: 120,
        },
        {
            title: 'Sub category',
            key: 'sub_category',
            dataIndex: 'sub_category',
            width: 120,
        },
        {
            title: 'Type name',
            key: 'type_name',
            dataIndex: 'type_name',
            width: 120,
        },
        {
            title: 'Material name',
            key: 'material_name',
            dataIndex: 'material_name',
            width: 200,
        },
        {
            title: 'Artwork status',
            key: 'artwork_status',
            dataIndex: 'artwork_status',
            width: 120,
        },
        {
            title: 'Supplier name',
            key: 'supplier_name',
            dataIndex: 'supplier_name',
            width: 160,
        },
        {
            title: 'Unit type',
            key: 'unit_type',
            dataIndex: 'unit_type',
            width: 120,
        },
        {
            title: 'QC status',
            key: 'qc_status',
            dataIndex: 'qc_status',
            width: 120,
        },
        {
            title: 'Remarks',
            key: 'remarks',
            dataIndex: 'remarks',
            width: 120,
        },
        {
            title: 'GE No',
            key: 'ge_no',
            dataIndex: 'ge_no',
            width: 120,
        },
        {
            title: 'Invoice',
            key: 'invoice',
            dataIndex: 'invoice',
            width: 120,
        },
        {
            title: 'Lot',
            key: 'lot',
            dataIndex: 'lot',
            width: 120,
        },
        {
            title: 'Receivied qty',
            key: 'receivied_qty',
            dataIndex: 'receivied_qty',
            width: 120,
        },
        {
            title: 'QC status',
            key: 'qc_status',
            dataIndex: 'qc_status',
            width: 120,
        },
        {
            title: 'Price',
            key: 'price',
            dataIndex: 'price',
            width: 120,
        },
        {
            title: 'Artwork',
            key: 'artwork',
            dataIndex: 'artwork',
            width: 120,
        },
        {
            title: 'Receiving date',
            key: 'receiving_date',
            dataIndex: 'receiving_date',
            width: 160,
        },
        {
            title: 'Mfg date',
            key: 'mfg_date',
            dataIndex: 'mfg_date',
            width: 160,
        },
        {
            title: 'Exp date',
            key: 'exp_date',
            dataIndex: 'exp_date',
            width: 160,
        },
        {
            title: 'Opening stock',
            key: 'opening_stock',
            dataIndex: 'opening_stock',
            width: 120,
        },
        {
            title: 'Carton size',
            key: 'carton_size',
            dataIndex: 'carton_size',
            width: 120,
        },
        {
            title: 'Cartons beans',
            key: 'cartons_beans',
            dataIndex: 'cartons_beans',
            width: 120,
        },
        {
            title: 'QC passed',
            key: 'qc_passed',
            dataIndex: 'qc_passed',
            width: 120,
        },
        {
            title: 'Sampled by qc',
            key: 'sampled_by_qc',
            dataIndex: 'sampled_by_qc',
            width: 120,
        },
        {
            title: 'Stock in warehouse',
            key: 'stock_in_warehouse',
            dataIndex: 'stock_in_warehouse',
            width: 160,
        },
        {
            title: 'Temperature',
            key: 'temperature',
            dataIndex: 'temperature',
            width: 120,
        },
    ],
    loading: false,
};
// TYPE
const type = {
    'set_jsonForm': 'set_jsonForm',
    'set_columnData': 'set_columnData',
}
// ACTION
const set_jsonForm = (data) => ({ type: type.set_jsonForm, data })
const set_columnData = (data) => ({ type: type.set_columnData, data })
// action request
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
        case 'set_columnData':
            return {
                ...state, loading: false,
                listColumn: action.data,
            };
        default:
            return state;
    }
};
