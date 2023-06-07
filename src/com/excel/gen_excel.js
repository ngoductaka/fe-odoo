import _ from "lodash";
import moment from "moment";
import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Download = ({ data, element }) => {
    const dataExcel = React.useMemo(() => {
        console.log('data', data)
        if (!_.isEmpty(data) && data[0])
            return data.sort((a, b) => a?.rfid_code - b?.rfid_code).map(item => ({
                code: String(item.rfid_code),
                itemcode: String(item.itemcode),
                material_name: String(item.material_name),
                receiving_date: item.receiving_date ? moment(item.receiving_date).format("DD-MM-YYYY") : '',
                invoice_no: String(item.invoice),
                lot_no: String(item.lot),
                index_item: String(item.index_item),
                carton_size: String(item.carton_size),
                receivied_qty: String(item.receivied_qty),
                supplier_name: String(item.supplier_name),
            }))
        return []
    }, [data]);
    return (
        <ExcelFile element={element} name={`${_.get(data, [0, 'itemcode', ''])}-${moment().format("DD-MMM-YYYY")}`}>
            <ExcelSheet data={dataExcel} name="Code">
                <ExcelColumn label="Code" value="code" />
                <ExcelColumn label="Item.Code" value="itemcode" />
                <ExcelColumn label="Material Name Warehouse" value="material_name" />
                <ExcelColumn label="Receiving Date" value={'receiving_date'} />
                <ExcelColumn label="Invoice No." value={'invoice_no'} />
                <ExcelColumn label="Lot.No." value={'lot_no'} />
                <ExcelColumn label="Index Item" value={'index_item'} />
                <ExcelColumn label="Carton Size" value={'carton_size'} />
                <ExcelColumn label="Receivied qty" value={'receivied_qty'} />
                <ExcelColumn label="Supplier Name" value={'supplier_name'} />
            </ExcelSheet>
        </ExcelFile>
    );

}


export const DownloadExcelBtn = ({ data, element, format }) => {
    return (
        <ExcelFile element={element} name={`report-${moment().format("DD-MMM-YYYY")}`}>
            <ExcelSheet data={data} name="제품">
                {format.map(i => {
                    return <ExcelColumn label={i.label} value={i.value} />
                })}
            </ExcelSheet>
        </ExcelFile>
    );

}


export default Download;