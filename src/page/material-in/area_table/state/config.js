import { handleErr } from "../helper/handle_err_request";
import * as services from "../services";
// INIT STATE
export const initialStateConfig = {
    formAdd: [
        {
            name: "name",
            label: "Name",
            rules: [{ required: true }],
        },
        {
            name: 'row',
            label: "Row",
            type: 'number',
            rules: [{ required: true }]
        },
        {
            name: 'column',
            label: "Column",
            type: 'number',
            rules: [{ required: true }]
        },
        {
            name: 'descriptions',
            label: "Descriptions",
        },
    ],
    formEdit: [
        {
            name: "id",
            label: "id",
            hidden: true,
        },
        {
            name: "name",
            label: "Name",
            disabled: true,
            rules: [{ required: true }],
        },
        {
            name: 'row',
            label: "Row",
            type: 'number',
            rules: [{ required: true }]
        },
        {
            name: 'column',
            label: "Column",
            type: 'number',
            rules: [{ required: true }]
        },
        {
            name: 'descriptions',
            label: "Descriptions",
        },
    ],
    formFilter: [{
        name: "name",
        label: "Name",
        rules: [{ required: true }],
    }],
    // "id": 1, "name": "TP1", "row": 10, "column": 20}
    listColumn: [
        // {
        //     title: 'Id',
        //     key: "id",
        //     dataIndex: 'id',
        // },
        {
            title: 'Name',
            key: "name",
            dataIndex: 'name',
        },
        {
            title: 'Row',
            key: 'row',
            dataIndex: 'row'
        },
        {
            title: 'Column',
            key: 'column',
            dataIndex: 'column'
        },
        {
            title: 'Descriptions',
            key: 'descriptions',
            dataIndex: 'descriptions'
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
