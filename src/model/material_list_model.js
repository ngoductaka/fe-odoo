export const MaterialModel = [
    {
        // fixed key
        title: 'Item.Code',
        dataKey: 'itemcode',
        // option
        type: 'text',
        width: 120,
        url: 'itemcode',
    },
    {
        title: 'Product Category',
        dataKey: 'product_category',

        width: 180,
        type: 'fixed',
        url: 'product',
        optionKey: 'product_category',
    },
    {
        title: 'Sub Category',
        dataKey: 'sub_category',
        type: 'fixed',
        url: 'category',
        optionKey: 'sub_category',
    },
    {
        title: 'Type',
        dataKey: 'type_name',
        type: 'fixed',
        url: 'type',
        optionKey: 'type_name',
    },
    {
        title: 'Material Name Warehouse',
        dataKey: 'material_name',
        width: 200,
        type: 'fixed',
        url: 'material',
        optionKey: 'material_name',
    },
    {
        title: 'Receiving Date',
        dataKey: 'receiving_date',
        type: 'date',
        width: 130,

    },
    {
        title: 'Invoice No.',
        dataKey: 'invoice',
        type: 'text'
    },
    {
        title: 'Lot.No.',
        dataKey: 'lot',
        type: 'text'
    },
    {
        title: 'Artwork No.',
        dataKey: 'artwork',
        type: 'text'
    },
    {
        title: 'Lic. No.',
        dataKey: 'lic',
        type: 'text'
    },
    {
        title: 'Artwork Status',
        dataKey: 'artwork_status',
        width: 140,
        type: 'text'
    },
    {
        title: 'Mfg. Date',
        dataKey: 'mfg_date',
        type: 'date',
        width: 130,
    },
    {
        title: 'Exp. Date',
        dataKey: 'exp_date',
        type: 'date',
        width: 130,
    },
    {
        width: 130,
        title: 'Supplier Name',
        dataKey: 'supplier_name',
        type: 'text'
    },
    {
        title: 'Price',
        dataKey: 'price',
        type: 'text'
    },
    {
        title: 'Receivied Qty',
        width: 120,
        dataKey: 'receivied_qty',
        type: 'text'
    },
    {
        title: ' Opening Stock',
        width: 120,
        dataKey: 'opening_stock',
        type: 'text'
    },
    // {
    //     title: 'Unit',
    //     dataKey: 'unit',
    //     type: 'text'
    // },
    {
        title: 'Carton Size',
        dataKey: 'carton_size',
        type: 'text'
    },
    {
        title: 'Cartons/Beans',
        dataKey: 'cartons_beans',
        type: 'text'
    },
    {
        title: 'Unit Type',
        dataKey: 'unit_type',
        type: 'text'
    },
    {
        title: 'QC Status',
        dataKey: 'qc_status',
        width: 100,
        type: 'fixed',
        sortable: false,
        url: 'status',
        optionKey: 'status',
    },
    {
        title: 'QC.Passed No.',
        dataKey: 'qc_passed',
        width: 130,
        type: 'text'
    },
    {
        title: 'Sampled By QC',
        dataKey: 'sampled_by_qc',
        width: 130,
        type: 'text'
    },
    {
        title: ' Stock in Warehouse',
        dataKey: 'stock_in_warehouse',
        width: 160,
        type: 'text'
    },
    {
        title: 'Remarks',
        dataKey: 'remarks',
        type: 'text'
    },
    {
        title: 'Temperature',
        dataKey: 'temperature',
        type: 'text'
    },
    {
        title: 'Store Status',
        dataKey: 'warehouse_status',
        type: 'fixed'
    },
    {
        title: 'Location',
        dataKey: 'location',
        type: 'autoComplete',
        width: 130
    },

]