import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import statusChecker from "../../../misc/Status";
import { process } from "@progress/kendo-data-query";
import { getOutBoundDetails, getpickdetail, pickorder, unpickorderlines, updateorderheader, Updateorder, UpdatePickDetail, OrderDetailDelete } from "../../../services/OutboundService/outboundService"
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { useLocalization } from '@progress/kendo-react-intl';
import { Label } from '@progress/kendo-react-labels';
import { Input as KendoInput, NumericTextBox } from '@progress/kendo-react-inputs';
import { Popup } from "@progress/kendo-react-popup";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Upload } from "@progress/kendo-react-upload";
import * as XLSX from 'xlsx/xlsx.mjs';
import { SvgIcon } from "@progress/kendo-react-common";
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { codeSnippetIcon, fileTxtIcon } from "@progress/kendo-svg-icons";
import { getRoles  } from "../../../services/ConfigurationService/ConfigurationService";


const initialDataState = {
    sort: [
        {
            field: "code",
            dir: "asc",
        },
    ],
    take: 10,
    skip: 0,
};

const fileStatuses = [
    "UploadFailed",
    "Initial",
    "Selected",
    "Uploading",
    "Uploaded",
    "RemoveFailed",
    "Removing",
];


const Outbounddetail = () => {
    const gridVisibility = {
        OrderKey: true,
        OrderLineNumber: true,
        Sku: true,
        ExternLineNo: true,
        OpenQty: false,
        QtyAllocated: false,
        QtyPicked: false,
        ShippedQty: true,
        Status: true,
        Lottable09: true

    }

    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let username = localStorage.getItem("UserName")
    var timeout;


    let arr = [
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "OrderKey", "title": "OrderKey", "className": "fw-bold", "id": "_1_column", "isAccessible": true, "ariaColumnIndex": 2 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "OrderLineNumber", "title": "OrderLineNumber", "id": "_2_column", "isAccessible": true, "ariaColumnIndex": 3 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "Sku", "title": "SKU", "id": "_3_column", "isAccessible": true, "ariaColumnIndex": 4 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "Lot", "title": "LOT", "id": "_4_column", "isAccessible": true, "ariaColumnIndex": 5 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "Qty", "title": "QTY", "id": "_5_column", "isAccessible": true, "ariaColumnIndex": 6 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "Loc", "title": "Loc", "id": "_8_column", "isAccessible": true, "ariaColumnIndex": 9 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "ID", "title": "ID", "id": "_9_column", "isAccessible": true, "ariaColumnIndex": 10 }
    ]

    const outbounddetail = {
        "delete": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "unpick": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "pick": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "saveheader": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "creation": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        }
    }
    let navigate = useNavigate()
    const { state } = useLocation();
    const Outboundheader = state && state.outbound;
    const [outboundheaderstate, setoutboundheaderstate] = useState(Outboundheader);
    const [outboundTableDetail, setoutboundTableDetail] = useState([]);
    const [pickTableDetail, setpickTableDetail] = useState([]);
    const [dataState, setDataState] = React.useState(initialDataState);
    const [loading, setLoading] = useState(true);
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("");
    const [severity, setseverity] = useState("success");
    const [selected, setSelected] = React.useState(1);
    var [search, setNewSearch] = useState([]);
    const localizationService = useLocalization();
    const anchor = React.useRef(null);
    const [show, setShow] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [titleZone, settitleZone] = useState("Field Selector");
    const [gridChangehandler, setgridChangehandler] = useState(gridVisibility)
    const [files, setFiles] = useState([]);
    const [events, setEvents] = React.useState([]);
    const [affectedFiles, setAffectedFiles] = React.useState([]);
    const [orderlineno, setorderlineno] = useState([]);
    const [permissions, setpermissions] = useState(outbounddetail)

    const outboundorder = state && state.outbound.OrderKey;
    const tempExternorderkey = state && state.outbound;

    const loadingGridValues = (order) => {

        setLoading(true)
        getOutBoundDetails(order, token).then((res) => {
            console.log(res);
            if (res) {
                if (res.length > 0) {
                    const tempDataValue = res.map(obj => {
                        return { ...obj, checker: "" }
                    })
                    setoutboundTableDetail(tempDataValue)
                    console.log();
                } else {
                    setopen(true)
                    setmessage("No Records for the order")
                    setseverity("warning")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 3000);
                    setoutboundTableDetail([])
                }
            }
            setLoading(false)
        })
        setLoading(true)
        getpickdetail(order, token).then((res) => {
            if (res) {
                const respobj = JSON.parse(res)
                console.log(respobj)
                if (res.length > 0) {
                    setpickTableDetail(respobj)
                } else {
                    setopen(true)
                    setmessage("No Records for the order")
                    setseverity("warning")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 3000);
                    setpickTableDetail([])
                }
            }
            setLoading(false)
        })

    }

    const visibleGrid = () => {
        setVisible(!visible);
    };
    useEffect(() => {
        loadingGridValues(outboundorder)
        getRoles(token, "outbounddetail").then((res) => {
            setpermissions(res)
        })
    }, [token])


    const handleSelect = (e) => {
        setSelected(e.selected);
    };

    const validateCheck = (e) => {
        const seardvalue = obj => obj === e.target.id;

        if (search.findIndex(seardvalue) == "-1") {
            search.push(e.target.id);
        }
        else if (search.length !== 0) {
            search.splice(search.findIndex(seardvalue), 1);
        }

        console.log(search);

    }
    const showPooup = () => {
        setShow(!show);
    };

    const pickcall = (records, opt) => {


        setLoading(true)
        if (opt === "1") {
            pickorder(records, token).then(res => {
                if (res === "PickDetail stored") {
                    console.log(res)
                    setopen(true);
                    setmessage("Picked Successfully")
                    setseverity("success")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    loadingGridValues(outboundorder)
                    setLoading(false);

                }
                else {
                    console.log(res)
                    setopen(true)
                    setmessage(res)
                    setseverity("error")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    setLoading(false);
                }
                setNewSearch([])
            })
        }
        else {


            UpdatePickDetail(records, token).then(res => {
                if (res === "Successfully posted to WMS") {
                    debugger
                    console.log(res)
                    setopen(true);
                    setmessage("UnPicked Successfully")
                    setseverity("success")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    loadingGridValues(outboundorder)
                    setLoading(false);

                }
                else {
                    console.log(res)
                    setopen(true)
                    setmessage(res)
                    setseverity("error")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    setLoading(false);
                }
                setNewSearch([])

            })
        }
    }

    const _export = React.useRef(null);
    const _grid = React.useRef();
    const excelExport = () => {
        debugger
        if (_export.current !== null) {
            debugger
            _export.current.save(pickTableDetail);

        }
    };
    const handleGridChange = (event) => {
        debugger
        console.log(event);

        const name = event.target.name;
        const value = event.target.checked;
        console.log(event.target.checked);

        const countValue = Object.values(gridChangehandler).filter(obj => obj === true).length
        console.log();
        if (value == false) {
            if (countValue < 2) {
                alert("Please check more than 2 boxes")
            }
            else {
                setgridChangehandler({ ...gridChangehandler, [name]: value });
            }
        }
        else {
            setgridChangehandler({ ...gridChangehandler, [name]: value });

        }






    }

    const handleButtonClick = (opt) => {

        if (search.length > 0) {
            if (opt === "1") {
                const tempselectedrecords = pickTableDetail.filter(objec => {
                    return search.includes(objec.SERIALKEY.toString())
                })
                    .map(obj => {
                        return { Status: "5", PickDetailKey: obj.PICKDETAILKEY, Qty: obj.QTY, Sku: obj.SKU, SerialKey: obj.SERIALKEY }
                    })

                console.log(tempselectedrecords)
                pickcall(tempselectedrecords, opt)
            }
            else {
                const tempselectedrecords = pickTableDetail.filter(objec => {
                    return search.includes(objec.SERIALKEY.toString())
                })
                    .map(obj => {
                        const { UOM, STATUS, ...rest } = obj;
                        return { ...rest, Status: '0' }
                    })

                console.log(tempselectedrecords)
                pickcall(tempselectedrecords, opt)
            }

        }
        else {
            if (opt === "1") {
                const tempselectedrecords = pickTableDetail.filter(objec => {
                    return objec.STATUS === "0"
                })
                    .map(obj => {
                        return { Status: "5", PickDetailKey: obj.PICKDETAILKEY, Qty: obj.QTY, Sku: obj.SKU, SerialKey: obj.SERIALKEY }
                    })
                console.log(tempselectedrecords)
                if (tempselectedrecords.length === 0) {
                    setopen(true)
                    setmessage("No lines allocated to pick")
                    setseverity("warning")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                }
                else {
                    pickcall(tempselectedrecords, opt)
                }
            }
            else {
                const tempselectedrecords = pickTableDetail.filter(objec => {
                    return objec.STATUS === "5"
                })
                    .map(obj => {
                        const { UOM, STATUS, ...rest } = obj;
                        return { ...rest, Status: '0' }
                    })
                console.log(tempselectedrecords.length, "length")
                if (tempselectedrecords.length === 0) {
                    setopen(true)
                    setmessage("No lines picked to unpick")
                    setseverity("warning")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                }
                else {
                    pickcall(tempselectedrecords, opt)
                }

            }
        }

    }

    const Checkrecords = (e) => {
        console.log(e);

        const serialkey = e.dataItem.SERIALKEY

        if (search.includes(serialkey)) {
            return (
                <td >
                    <input type="checkbox" id={e.dataItem.SERIALKEY} onClick={validateCheck} value="" defaultChecked />
                </td>
            )
        }
        else {
            return (
                <td >
                    <input type="checkbox" id={e.dataItem.SERIALKEY} onClick={validateCheck} value="" />
                </td>
            )
        }
    }

    const statusCell = (props) => {

        const setStyle = []
        console.log(props.dataItem.Status);
        if (props.dataItem.Status === 'Shipped Complete') {
            const style = {
                color: "#009933"

            };
            setStyle.push(style);
        }
        else if (props.dataItem.Status === 'Picked Complete') {
            const style = {
                color: "#fd7e14"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Created Externally' || props.dataItem.Status == 'Created Internally') {
            const style = {
                color: "#0d6efd"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Did Not Allocate') {
            const style = {
                color: "#ff3333"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Not Started') {
            const style = {
                color: "#5c00e6"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Part Allocated') {
            const style = {
                color: "#336600"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Allocated') {
            const style = {
                color: "#669999"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Part Picked') {
            const style = {
                color: "#cc9900"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Part Picked / Part Shipped') {
            const style = {
                color: "#cc6600"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Picked / Part Shipped') {
            const style = {
                color: "#993300"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Part Shipped') {
            const style = {
                color: "#20c997"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Cancelled Externally' || props.dataItem.Status == 'Cancelled Internally') {
            const style = {
                color: "#333333"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == 'Part Allocated / Part Shipped') {
            const style = {
                color: "#e67300"


            };

            setStyle.push(style);
        }
        const field = props.field || "";
        return (
            <td style={setStyle[0]} className="status-bg">
                {/* <div className='row' > */}
                <span style={{ justifyContent: 'center' }}>{props.dataItem[field]}</span>
                {/* </div> */}
            </td>
        );

    }

    const pickdetailstatuscell = (props) => {
        const setStyle = []
        console.log(props.dataItem.STATUS);
        if (props.dataItem.STATUS == '9') {
            const style = {
                color: "#009933"

            };
            setStyle.push(style);
        }
        else if (props.dataItem.STATUS == '5') {
            const style = {
                color: "#fd7e14"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.STATUS == '0') {
            const style = {
                color: "#669999"


            };

            setStyle.push(style);
        }
        const field = props.field || "";
        return (
            <td style={setStyle[0]} className="status-bg">
                {/* <div className='row' > */}
                <span style={{ justifyContent: 'center' }}>{statusChecker.pickdetailstatus[props.dataItem.STATUS]}</span>
                {/* </div> */}
            </td>
        );
    }
    const handleorderheaderChange = (event) => {
        //console.log(event);

        const id = event.target._input.id;
        const value = event.target.value;
        //console.log(value);
        //console.log(id);
        setoutboundheaderstate({ ...outboundheaderstate, [id]: value });

    }


    const handledateChange = (event) => {
        console.log(event.target.name);
        const id = event.target.name;
        const value = event.target.value;
        setoutboundheaderstate({ ...outboundheaderstate, [id]: value });
        console.log(setoutboundheaderstate);
    }


    const dateconv = (datobj) => {
        let timepart = datobj.toISOString().split('T')[1].split('.')[0]
        let daypart = ('0' + datobj.getDate().toString()).slice(-2);
        let monthpart = ('0' + (datobj.getMonth() + 1).toString()).slice(-2);
        let yearpart = datobj.getFullYear().toString();
        let fulldatepart = monthpart + '/' + daypart + '/' + yearpart
        return fulldatepart + ' ' + timepart
    }


    const saveheader = () => {
        setLoading(true);
        console.log(outboundheaderstate)
        const saveheaderbody = {
            ...outboundheaderstate,
            ScheduledShipDate: outboundheaderstate.ScheduledShipDate !== "" && outboundheaderstate.ScheduledShipDate !== " " && outboundheaderstate.ScheduledShipDate !== null && outboundheaderstate.ScheduledShipDate !== undefined ? dateconv(outboundheaderstate.ScheduledShipDate) : outboundheaderstate.ScheduledShipDate
        }
        console.log(saveheaderbody)
        updateorderheader([outboundheaderstate], token).then(res => {
            if (res === "Successfully posted to WMS") {
                console.log(res)
                setopen(true);
                setmessage("Updated Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
                loadingGridValues(outboundorder)
                setLoading(false);

            }
            else {
                console.log(res)
                setopen(true)
                setmessage(res)
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
                setLoading(false);
            }
            setNewSearch([])

        })
    }

    const onAdd = (event) => {
        setFiles(event.newState);
        setEvents([...events, `File selected: ${event.affectedFiles[0].name}`]);
        setAffectedFiles(event.affectedFiles);
    };



    const onProgress = (event) => {
        setFiles(event.newState);
        setEvents([...events, `On Progress: ${event.affectedFiles[0].progress} %`]);
    };

    const onStatusChange = (event) => {
        const file = event.affectedFiles[0];
        setFiles(event.newState);
        setEvents([
            ...events,
            `File '${file.name}' status changed to: ${fileStatuses[file.status]}`,
        ]);
        const file1 = files[0].getRawFile();
        if (event.affectedFiles[0].status === 4) {
            fileChangehandle(file1)
        }
    };

    function fileChangehandle(e) {
        debugger
        console.log(e)
        const file = e;
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        var timeout;
        reader.onload = function (e) {
            // binary data
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {
                type: rABS ? "binary" : "array",
                bookVBA: true
            });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            console.log(data)
            const newarr = data.map(obj => {
                return {
                    OrderKey: obj['ORDER NO'], OrderLineNumber: obj['LINE NO'], Sku: obj.SKU,
                    Lot: obj.LOT, Loc: obj.LOC, Status: '5', PackKey: obj.PACKKEY, ToLoc: 'PICKTO', ID: obj.ID, Qty: obj.QTY, StorerKey: obj.STORERKEY, PickDetailKey: obj.PICKDETAILKEY
                }
            })
            console.log(JSON.stringify(newarr), 'into api')
            pickcall(newarr, "1")
            {/*
             const lkup = data.reduce((acc, cur) => ({ ...acc, [cur.Articlenumber]: cur.Price }), {})
            console.log(lkup)
            console.log(inboundTableDetail)
            const finalobj = inboundTableDetail.filter(obj => obj.Status === 'New').map(obj => {
                const { Status, ...rest } = obj
                return { ...rest, SUsr1: lkup[obj.SUsr3] }
            }).filter(obj => obj.SUsr1 !== undefined)

            console.log(finalobj)
           savereceiptdetail(finalobj, token).then(res => {
                if (res === "Successfully posted to WMS") {
                    setopen(true);
                    setmessage("Updated  Successfully")
                    setseverity("success")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                        e.target.value = '';
                        setValue(value => value + 1);
                    }, 2000);
                    const loaded = loadingGridValues(inboundDetail.ReceiptKey);
                    if (loaded) {
                        setLoading(false);
                    }

                }
                else {

                    setopen(true)
                    setmessage(res)
                    setseverity("error")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                        e.target.value = '';
                        setValue(value => value + 1);
                    }, 3000);
                    setLoading(false);
                }
            })*/}
        };
        reader.onerror = function (e) {
            // error occurred
            console.log('Error : ' + e.type);
        };
        if (rABS) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }

    const Startpickupdate = () => {
        Updateorder(token, Outboundheader.OrderKey).then(res => {
            if (res === "updated Successfully") {
                setopen(true);
                setmessage("Picking Started")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    setLoading(false);
                }, 2000);
            }
            else {
                setopen(true)
                setmessage(res)
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    setLoading(false);
                }, 3000);
            }
        })
    }

    const CommandCell = (e) => {
        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple" }} onClick={() => onEdit(e)} class="k-icon k-i-edit"></span>
            </td>
        );
    }

    const onEdit = (e) => {
        navigate('/Outbound/detail/Creation', { state: { orderkey: e.dataItem, maction: "2", key: outboundheaderstate.OrderKey, OrderLineno: e.dataItem.OrderLineNumber, Externorderkey: e.dataItem } })

    }

    const DeleteOrderLine = () => {
        console.log(outboundTableDetail);
        const finalDeleteRecords = outboundTableDetail.filter(obj => obj.checker === "checked").map(obj => {

            return { OrderKey: obj.OrderKey, OrderLineNumber: obj.OrderLineNumber, ExternLineNo: obj.ExternLineNo }
        })
        console.log(finalDeleteRecords);
        debugger
        if (finalDeleteRecords.length > 0) {
            OrderDetailDelete(JSON.stringify(finalDeleteRecords), token, outboundTableDetail[0].OrderKey, outboundTableDetail[0].ExternOrderKey).then(res => {
                console.log(res);
                if (res) {
                    var timeout;
                    setopen(true);
                    setmessage("Order Line Deleted Successfully")
                    setseverity("success");
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    loadingGridValues(outboundorder);
                }
                else {
                    var timeout;
                    setopen(true);
                    setmessage(res)
                    setseverity("error");
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                }
            })
        }
        else {
            var timeout;
            setopen(true);
            setmessage("Please Select line to delete")
            setseverity("warning");
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }

    }

    const validateCheck1 = (e) => {

        var index = outboundTableDetail.findIndex(p => p.SerialKey == e.target.id);
        if (outboundTableDetail[index].checker === "") {
            outboundTableDetail[index].checker = "checked";
        }
        else {
            outboundTableDetail[index].checker = "";
        }
    }

    const Deletecell = (e) => {
        const serialkey = e.dataItem.SerialKey
        if (e.dataItem.checker !== "") {
            return (
                <td >
                    <input type="checkbox" id={serialkey} onChange={validateCheck1} value="" defaultChecked />
                </td>
            )
        }
        else {
            return (
                <td >
                    <input type="checkbox" id={serialkey} onChange={validateCheck1} value="" />
                </td>
            )
        }
    }

    return (
        <>
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
                <WithSnackbar open={open} message={message} severity={severity} />
                <Button className='text-uppercase br-round-right active' type='button' fillMode="solid" onClick={() => {
                    navigate('/Outbound');
                }}>Back</Button>
                <div className="d-flex mt-3 justify-content-between">
                    <div className='ps-3'>
                        <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.outbounddetail')}</h3>
                    </div>
                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            {permissions.creation && <li className={permissions.saveheader ? 'text-uppercase br-round-left active' : 'text-uppercase rounded-pill active'} onClick={() => {
                                debugger
                                if (outboundTableDetail.length > 0) {
                                    const tempOrderlineno = outboundTableDetail[outboundTableDetail.length - 1].OrderLineNumber;
                                    orderlineno.push(String(parseInt(tempOrderlineno) + 1).padStart(5, '0'))
                                }
                                else {
                                    orderlineno.push("00001")
                                }
                                navigate('/Outbound/detail/Creation', { state: { orderkey: "", maction: "1", key: outboundheaderstate.OrderKey, OrderLineno: orderlineno[0], Externorderkey: tempExternorderkey } })
                            }}>New</li>}
                            {/* {Client !== 'TEST' && (<li className='text-uppercase br-round active' onClick={() => handleButtonClick("1")}>Pick</li>)}
                   <li className='text-uppercase br-round active' onClick={() => handleButtonClick("2")}>Un Pick</li> */}
                            {permissions.saveheader && <li className={permissions.creation ? 'text-uppercase br-round-right active' : 'text-uppercase rounded-pill active'} onClick={saveheader}>Save Header</li>}
                        </ul>
                    </div>
                </div>
                <TabStrip selected={selected} onSelect={handleSelect} style={{ margin: '10px' }}>
                    <TabStripTab title="Header">

                    <div className='row mt-3'>
                            <div className='col-md-3 float-start '>
                                <div className=''>
                                    <Label >ORDER KEY</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="Customer"

                                        value={outboundheaderstate.OrderKey || ""}
                                        onChange={handleorderheaderChange}
                                        disabled={true}
                                    />
                                </div>
                            </div>  
                            <div className='col-md-3 float-start '>
                                <div className=''>
                                    <Label >CARRIER NAME</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="Customer"

                                        value={outboundheaderstate.C_Company || ""}
                                        onChange={handleorderheaderChange}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className='col-md-3 float-start'>
                                <div className=''>
                                    <Label >CARRIER PHONE</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="CarrierPhone"
                                        readOnly={username === 'maheshbsidom' || username === 'maheshbsiftwz'}
                                        value={outboundheaderstate.CarrierPhone || ""}
                                        onChange={handleorderheaderChange}
                                    />
                                </div>
                            </div>
                            <div className='col-md-3 float-start'>
                                <div className=''>
                                    <Label >TRAILER NUMBER</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="TrailerNumber"
                                        value={outboundheaderstate.TrailerNumber || ""}
                                        onChange={handleorderheaderChange}
                                        readOnly={username === 'maheshbsidom' || username === 'maheshbsiftwz'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-3'>
                          
                            <div className='col-md-3 float-start'>
                                <div className=''>
                                    <Label >TRAILER OWNER</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="TrailerOwner"
                                        value={outboundheaderstate.TrailerOwner || ""}
                                        onChange={handleorderheaderChange}
                                        readOnly={username === 'maheshbsidom' || username === 'maheshbsiftwz'}
                                    />
                                </div>
                            </div>
                            <div className='col-md-3 float-start '>
                                <div className=''>
                                    <Label >PRONUMBER</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="ProNumber"
                                        value={outboundheaderstate.ProNumber || ""}
                                        onChange={handleorderheaderChange}
                                        readOnly={username === 'maheshbsidom' || username === 'maheshbsiftwz'}
                                    />
                                </div>
                            </div>
                            <div className='col-md-3 float-start'>
                                <div className=''>
                                    <Label >EXTERNAL LOADID</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="ExternalLoadId"
                                        value={outboundheaderstate.ExternalLoadId || ""}
                                        onChange={handleorderheaderChange}
                                        readOnly={username === 'maheshbsidom' || username === 'maheshbsiftwz'}
                                    />
                                </div>
                            </div>
                            <div className='col-md-3 float-start'>
                                <div className=''>
                                    <Label >TRANSPORTATION SERVICE</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="TransportationService"
                                        value={outboundheaderstate.TransportationService || ""}
                                        onChange={handleorderheaderChange}
                                        readOnly={username === 'maheshbsidom' || username === 'maheshbsiftwz'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                          
                            <div className='col-md-3 float-start'>
                                <div className=''>
                                    <Label >TOTAL QTY</Label>
                                </div>
                                <div className=''>
                                    <KendoInput
                                        type="text"
                                        id="TOTALQTY"
                                        value={outboundheaderstate.TOTALQTY || ""}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabStripTab>
                    <TabStripTab title="Pick Detail">
                        <ExcelExport ref={_export} data={pickTableDetail}>
                            <Grid
                                pageable={true}
                                sortable={true}
                                filterable={false}
                                style={{
                                    height: "450",
                                }}
                                data={process(pickTableDetail, dataState)}
                                {...dataState}
                                onDataStateChange={(e) => {
                                    setDataState(e.dataState);
                                }}
                                ref={_grid}
                            >

                                {(permissions.delete.visible === 'True' || permissions.pick.visible === 'True' || permissions.unpick.visible === 'True') && (<Column title="" filterable={false} className="edit-btn" width={60} cell={Checkrecords} />)}
                                <Column field="ORDERKEY" title="ORDER NO" width={180} filterable={false} className="fw-bold" />
                                <Column field="ORDERLINENUMBER" width={150} title="LINE NO" filterable={false} />
                                <Column field="SKU" title="SKU" width={180} filterable={false} />
                                <Column field="LOT" title="LOT" width={150} filterable={false} />
                                <Column field="QTY" title="QTY" width={150} filterable={false} />
                                <Column field="PACKKEY" title="PACKKEY" width={180} filterable={false} />
                                <Column field="STATUS" title="STATUS" width={180} filterable={false} cell={pickdetailstatuscell} />
                                <ExcelExportColumn field="LOC" width={150} title="LOC" />
                                <Column field="ID" title="LPN" width={150} filterable={false} />
                                <ExcelExportColumn field="STORERKEY" width={150} title="STORERKEY" />
                                <Column field="DROPID" title="DROPID" width={150} filterable={false} />

                            </Grid>
                        </ExcelExport>
                    </TabStripTab>
                </TabStrip>
                <div>


                    <Popup anchor={anchor.current} show={show} popupClass={"popup-content"}>



                    </Popup>
                </div>
                <div className='row mt-2'>
                    <div className='col-lg-9 col-4'></div>
                    <div className='col-lg-3 col-8 col-sm-auto' style={{justifyContent:'flex-end'}} >
                        <button
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" 
                            onClick={visibleGrid}
                            ref={anchor}
                        >
                            Field Selector
                        </button>
                    </div>
                    {/*<Upload
                    batch={false}
                    multiple={false}
                    defaultFiles={[]}
                    files={files}
                    onAdd={onAdd}

                    onProgress={onProgress}
                    onStatusChange={onStatusChange}
                    restrictions={{
                        allowedExtensions: [".xlsx"],
                    }}
                    withCredentials={false}
                    saveUrl={"https://demos.telerik.com/kendo-ui/service-v4/upload/save"}
                    removeUrl={"https://demos.telerik.com/kendo-ui/service-v4/upload/remove"}
                    className='col-3' 
                />
       
       <div className='col-1 mt-2'> <SvgIcon onClick={excelExport} icon={fileTxtIcon} style={{ cursor: "pointer" }} size="medium" /></div>*/}


                </div>
                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid
                        pageable={true}
                        sortable={true}
                        filterable={false}
                        style={{
                            height: "450",
                        }}
                        data={process(outboundTableDetail, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        <GridToolbar style={{ float: 'right' }}>
                            <div >
                                <div className='position-relative pe-4'>
                                    <ul className='header-buttons'>
                                        <ButtonGroup>
                                            {permissions.pick.visible === 'True' && <Button onClick={() => handleButtonClick("1")}>Pick</Button >}
                                            {permissions.unpick.visible === 'True' && <Button  onClick={() => handleButtonClick("2")}>Un Pick</Button >}
                                            {permissions.delete.visible === 'True' && <Button  onClick={DeleteOrderLine}>Delete</Button >}
                                        </ButtonGroup>
                                    </ul>
                                </div>
                            </div>
                        </GridToolbar>
                        <Column title="" filterable={false} className="edit-btn" width="60px" cell={Deletecell} />
                        {gridChangehandler.OrderKey == true ? (<Column field="OrderKey" title="ORDER NO" filterable={false} className="fw-bold" />) : (<></>)}
                        {gridChangehandler.OrderLineNumber == true ? (<Column field="OrderLineNumber" title="LINE NO" filterable={false} />) : (<></>)}
                        {gridChangehandler.Sku == true ? (<Column field="Sku" title="SKU" filterable={false} />) : (<></>)}
                        {gridChangehandler.ExternLineNo == true ? (<Column field="ExternLineNo" title="EXTERNLINENO" filterable={false} />) : (<></>)}
                        {gridChangehandler.OpenQty == true ? (<Column field="OpenQty" title="OPEN QTY" filterable={false} />) : (<></>)}
                        {gridChangehandler.QtyAllocated == true ? (<Column field="QtyAllocated" title="ALLOCATED" filterable={false} />) : (<></>)}
                        {gridChangehandler.QtyPicked == true ? (<Column field="QtyPicked" title="PICKED" filterable={false} />) : (<></>)}
                        {gridChangehandler.ShippedQty == true ? (<Column field="ShippedQty" title="SHIPPED" filterable={false} />) : (<></>)}
                        {gridChangehandler.Status == true ? (<Column field="Status" title="STATUS" filterable={false} cell={statusCell} />) : (<></>)}
                        {gridChangehandler.Lottable09 == true ? (<Column field="Lottable09" title="HU" filterable={false} />) : (<></>)}

                    </Grid>

                </div>

                {visible && (
                    <Dialog title={titleZone} onClose={visibleGrid}>
                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" style={{ marginTop: "5px" }} name='OrderKey' checked={gridChangehandler.OrderKey} onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>OrderKey</p>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" style={{ marginTop: "5px" }} checked={gridChangehandler.OrderLineNumber} name='OrderLineNumber' onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>OrderLineNumber</p>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" id="1" style={{ marginTop: "5px" }} checked={gridChangehandler.Sku} name='Sku' onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>Sku</p>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" id="1" style={{ marginTop: "5px" }} name='ExternLineNo' checked={gridChangehandler.ExternLineNo} onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>ExternLineNo</p>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" id="1" name='OpenQty' checked={gridChangehandler.OpenQty} onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>OpenQty</p>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" id="1" name='QtyAllocated' checked={gridChangehandler.QtyAllocated} onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>QtyAllocated</p>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" id="1" name='QtyPicked' checked={gridChangehandler.QtyPicked} onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>QtyPicked</p>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" id="1" name='ShippedQty' checked={gridChangehandler.ShippedQty} onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>ShippedQty</p>

                            </div>
                        </div>


                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" id="1" name='Status' checked={gridChangehandler.Status} onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>Status</p>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-2'>
                                <input type="checkbox" id="1" name='Lottable09' checked={gridChangehandler.Lottable09} onChange={handleGridChange} value="1" />
                            </div>
                            <div className='col-10'>
                                <p>HU</p>

                            </div>
                        </div>

                    </Dialog>

                )}
            </div>
        </>
    );
}



export default Outbounddetail;