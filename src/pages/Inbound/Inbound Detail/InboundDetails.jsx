
import * as React from 'react';
import { useLocalization } from '@progress/kendo-react-intl';
import { guid } from '@progress/kendo-react-common';
import { orders, ordersModelFields } from '../../../resources/orders';
import { Grid, GridColumn as Column,GridToolbar } from "@progress/kendo-react-grid";
import { process, aggregateBy } from "@progress/kendo-data-query";
import { ButtonGroup, Button } from "@progress/kendo-react-buttons";
import statusDecode from "../../../misc/Status";
import { Input as KendoInput, NumericTextBox } from '@progress/kendo-react-inputs';
import { FieldWrapper } from '@progress/kendo-react-form';
import { Label } from '@progress/kendo-react-labels';
import { DropDownList as KendoDropDownList } from '@progress/kendo-react-dropdowns';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Upload } from "@progress/kendo-react-upload";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import statusChecker from "../../../misc/Status";
import { getInBoundDetails, putReceiveall, putUnReceiveall, savereceiptheader, getSingleReceiptHeader, savereceiptdetail, deleteasnlines } from "../../../services/InboundService/InboundService";
import { getcodesc, getRoles } from "../../../services/ConfigurationService/ConfigurationService"
import Loader from "../../../components/Loader/Loader";

import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import Excelupload from "../../../pages/Inventory/Excelupload";
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popup } from "@progress/kendo-react-popup";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import "../../../styles/common.css";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";

import {
    codeSnippetIcon,
    fileTxtIcon
} from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { DropdownFilterCell } from "../../../components/dropdownFilterCell";
import { filterBy } from '@progress/kendo-data-query';


const fileStatuses = [
    "UploadFailed",
    "Initial",
    "Selected",
    "Uploading",
    "Uploaded",
    "RemoveFailed",
    "Removing",
];
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


const initialagg = {
    "QtyExpected": { "sum": 0 },
    "QtyReceived": { "sum": 0 }
}







const initialFilterState = {};

const InboundDetails = () => {

    const gridVisibility = {
        ExternReceiptKey: false,
        ReceiptLineNumber: true,
        Sku: true,
        ToId: false,
        EXP_QTY: false,
        QtyReceived: false,
        SUsr1: false,
        SUsr2: false,
        SUsr3: false,
        Lottable09: true,
        Status: true
    }
    const Statuses = ['New', 'Closed', 'Verified Closed', 'In Transit', 'Cancelled', 'Scheduled', 'In Receiving', 'Received'];

    let asndetail = {
        "CarrierName": {
            "visible": "False",
            "readonly": "False",
            "label": "CARRIER NAME"
        },
        "CarrierPhone": {
            "visible": "False",
            "readonly": "False",
            "label": "PHONE"
        },
        "ProNumber": {
            "visible": "False",
            "readonly": "False",
            "label": "PRO NUMBER"
        },
        "TrailerOwner": {
            "visible": "False",
            "readonly": "False",
            "label": "TRAILER OWNER"
        },
        "TrailerNumber": {
            "visible": "False",
            "readonly": "False",
            "label": "TRAILER NUMBER"
        },
        "WarehouseReference": {
            "visible": "False",
            "readonly": "False",
            "label": "WAREHOUSE REF"
        },
        "SUsr2": {
            "visible": "False",
            "readonly": "False",
            "label": "UDF2"
        },
        "ExternalReceiptKey2": {
            "visible": "False",
            "readonly": "False",
            "label": "EXT REF 2"
        },
        "SUsr1": {
            "visible": "False",
            "readonly": "False",
            "label": "UDF1"
        },
        "qtyupdate": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "creation": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "saveheader": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "delete": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "unreceive": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "receive": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "SupplierName": {
            "visible": "True",
            "readonly": "False",
            "label": "Supplier Name"
        },
        "update": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        }
    }

    let navigate = useNavigate()

    const [value, setValue] = useState(0);
    const { state } = useLocation()
    const localizationService = useLocalization();
    let inboundDetail = state && state.inboundDetail
    const [inboundheader, setinboundheader] = useState(inboundDetail)
    const [gridChangehandler, setgridChangehandler] = useState(gridVisibility)
    const [inboundTableDetail, setInboundTableDetail] = useState([])
    const [selectedReceive, setSelectedReceive] = useState([])
    const [search, setNewSearch] = useState([]);
    const [filterState, setFilterState] = React.useState(initialFilterState);
    const [data, setData] = React.useState(orders);
    const [dataState, setDataState] = React.useState(initialDataState);
    const [newLineNo, setNewLineNo] = useState();
    const [loading, setLoading] = useState(true)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("success");
    const [agg, setagg] = useState(initialagg);
    const [test1, settest1] = useState([]);
    const anchor = React.useRef(null);
    const [show, setShow] = React.useState(false);
    const [files, setFiles] = useState([]);
    const [events, setEvents] = React.useState([]);
    const [filePreviews, setFilePreviews] = React.useState({});
    const [affectedFiles, setAffectedFiles] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [titleZone, settitleZone] = useState("Field Selector");
    const [filter, setFilter] = useState();
    const [permissions, setpermissions] = useState(asndetail)

    let Client = localStorage.getItem("Client");
    let ftwz_disp_switch = (Client === 'BSI FTWZ')
    let username = localStorage.getItem("UserName")
    let arr = [
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "ReceiptKey", "title": "ReceiptKey", "id": "_7_column", "isAccessible": true, "ariaColumnIndex": 8 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "Lottable09", "title": "HU", "className": "fw-bold", "id": "_10_column", "isAccessible": true, "ariaColumnIndex": 12 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "putawayLoc", "title": "ToLoc", "className": "fw-bold", "id": "_12_column", "isAccessible": true, "ariaColumnIndex": 14 },

    ]

    let arr1 = [
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "ReceiptKey", "title": "ReceiptKey", "id": "_4_column", "isAccessible": true, "ariaColumnIndex": 5 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "SUsr3", "title": "Articlenumber", "id": "_8_column", "isAccessible": true, "ariaColumnIndex": 9 },
        { "filterable": false, "editable": true, "sortable": true, "resizable": true, "reorderable": true, "groupable": true, "field": "SUsr1", "title": "Price", "id": "_8_column", "isAccessible": true, "ariaColumnIndex": 9 }
    ]


    let token = localStorage.getItem("selfToken");

    const dateconv = (datobj) => {
        let timepart = datobj.toISOString().split('T')[1].split('.')[0]
        let daypart = ('0' + datobj.getDate().toString()).slice(-2);
        let monthpart = ('0' + (datobj.getMonth()+1).toString()).slice(-2);
        let yearpart = datobj.getFullYear().toString();
        let fulldatepart = monthpart + '/' + daypart + '/' + yearpart
        return fulldatepart + ' ' + timepart
    }


    useEffect(() => {

        console.log(gridChangehandler);
        setShow(false);

        setLoading(true)
        console.log(statusDecode.statusDecode);

        console.log(statusDecode.statusDecode.inbound_New);
        let tempReceiptkey = "";
        debugger
        tempReceiptkey = inboundDetail.ReceiptKey;
        loadingGridValues(tempReceiptkey);
        getRoles(token, "asndetail").then((res) => {
            setpermissions(res)
        })
    }, [token])

    const loadingGridValues = (tempReceiptkey) => {

        getInBoundDetails(tempReceiptkey, token).then((res) => {
            if (res) {
                debugger
                if (res.length > 0) {
                    const tempDataValue = res.map(obj => {
                        return { ...obj, checker: "" }
                    })
                    console.log(tempDataValue);


                    setInboundTableDetail(tempDataValue)
                    console.log(inboundTableDetail);
                    const result = aggregateBy(res, [
                        { aggregate: "sum", field: "QtyExpected" },
                        { aggregate: "sum", field: "QtyReceived" }
                    ]);
                    setagg(result);
                    console.log(result, "aggregate");
                    const maxlineno = aggregateBy(res, [
                        { aggregate: "max", field: "ReceiptLineNumber" }
                    ]);
                    setNewLineNo(String(parseInt(maxlineno.ReceiptLineNumber.max) + 1).padStart(5, '0'))
                } else {
                    setNewLineNo("00001");
                    setInboundTableDetail([])
                }
            }
            setLoading(false)
            //
        })

        console.log(inboundDetail, "from prev page")

        getSingleReceiptHeader(tempReceiptkey, token).then((res) => {
            if (res) {
                debugger
                //let resp = txml.simplify(txml.parse(res)).Message.Body.Receipt.ReceiptHeader;
                
                if (Client === 'BSI FTWZ') {
                    if (res[0].SUsr1 !== "" && res[0].SUsr1 !== " " && res[0].SUsr1 !== null && res[0].SUsr1 !== undefined) {
                        let boeobj = new Date(res[0].SUsr1)
                        res[0].SUsr1 = boeobj
                    }
                    if (res[0].SUsr2 !== "" && res[0].SUsr2 !== " " && res[0].SUsr2 !== null && res[0].SUsr2 !== undefined) {
                        let invoicedateobj = new Date(res[0].SUsr2)
                        res[0].SUsr2 = invoicedateobj
                    }
                    if (res[0].SUsr4 !== "" && res[0].SUsr4 !== " " && res[0].SUsr4 !== null && res[0].SUsr4 !== undefined) {
                        let vasstartdateobj = new Date(res[0].SUsr4)
                        res[0].SUsr4 = vasstartdateobj
                    }
                    if (res[0].SUsr5 !== "" && res[0].SUsr5 !== " " && res[0].SUsr5 !== null && res[0].SUsr5 !== undefined) {
                        let vasenddateobj = new Date(res[0].SUsr5)
                        res[0].SUsr5 = vasenddateobj
                    }
                    console.log(res[0], "from api")
                    setinboundheader(res[0])
                }
                else if(Client === 'BSI DOM'){
                    if (res[0].SUsr1 !== "" && res[0].SUsr1 !== " " && res[0].SUsr1 !== null && res[0].SUsr1 !== undefined) {
                        let boeobj = new Date(res[0].SUsr1)
                        res[0].SUsr1 = boeobj
                    }
                    if (res[0].SUsr2 !== "" && res[0].SUsr2 !== " " && res[0].SUsr2 !== null && res[0].SUsr2 !== undefined) {
                        let invoicedateobj = new Date(res[0].SUsr2)
                        res[0].SUsr2 = invoicedateobj
                    }
                    console.log(res[0], "from api")
                    setinboundheader(res[0])
                }
                else {
                    setinboundheader(res[0])
                }
                console.log(inboundheader, "state")
                setLoading(false)
                let typeobj, statusobj
                getcodesc(token, 'RECEIPTYPE').then((resp => {
                    debugger
                    if (resp) {
                        typeobj = resp.find(obj => obj.code === res[0].Type)
                    }
                    getcodesc(token, 'RECSTATUS').then((resp1 => {
                        if (resp1) {
                            statusobj = resp1.find(obj => obj.code === res[0].Status)
                            setinboundheader({ ...inboundheader, Status: statusobj.description, Type: typeobj.description })
                        }
                    }))
                }))

            }
        })
    }



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
            })
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


    const Edit = (e) => {

        navigate('/inbound/details/creation', { state: { receiptKey: e.dataItem, lineno: e.dataItem.RECEIPTLINENUMBER, maction: "2", header : state.inboundDetail } })

    }

    const CommandCell = (e) => {

        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple" , marginRight: "10px" }} onClick={() => Edit(e)} className="k-icon k-i-edit"></span>
            </td>
        );
    };

    // const filtered = !search
    // ? people
    // : people.filter((person) =>
    //     person.name.toLowerCase().includes(search.toLowerCase())
    //   );


    const handleChange = (event) => {
        console.log(event);

        const id = event.target._input.id;
        const value = event.target.value;
        console.log(value);
        console.log(id);
        setinboundheader({ ...inboundheader, [id]: value });

    }
    const handledateChange = (event) => {
        //console.log(event.target.name);
        const id = event.target.name;
        const value = event.target.value;
        setinboundheader({ ...inboundheader, [id]: value });
    }



    const validateCheck = (e) => {
        var index = inboundTableDetail.findIndex(p => p.SerialKey == e.target.id);
        if (inboundTableDetail[index].checker === "") {
            inboundTableDetail[index].checker = "checked";
        }
        else {
            inboundTableDetail[index].checker = "";
        }
    }

    const ReceiveChecked = (e) => {

        const serialkey = e.dataItem.SerialKey
        if (e.dataItem.checker !== "") {
            return (
                <td >
                    <input type="checkbox" id={serialkey} onChange={validateCheck} value="" defaultChecked />
                </td>
            )
        }
        else {
            return (
                <td >
                    <input type="checkbox" id={serialkey} onChange={validateCheck} value="" />
                </td>
            )
        }



    }
    const deleteasnlinesclick = () => {
        debugger
       
        const newState = inboundTableDetail.filter(obj => obj.Status === 'New' && obj.checker !== "" ).map(obj => {
            return { ReceiptKey: obj.ReceiptKey, ReceiptLineNumber: obj.ReceiptLineNumber, ExternLineNo: obj.ExternLineNo };
        });
        console.log(newState)
        
        if (newState.length > 0) {
            var timeout;
                deleteasnlines(newState, token, inboundTableDetail[0].ReceiptKey,inboundTableDetail[0].ExternReceiptKey).then(res => {
                    debugger
                    // console.log(res);
                    if (res === "Successfully posted to WMS") {
                        setopen(true);
                        setmessage("Deleted Successfully")
                        setseverity("success")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                        loadingGridValues(inboundDetail.ReceiptKey);
                        setLoading(false);

                    }
                    else {

                        setopen(true)
                        setmessage(res)
                        setseverity("error")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                        setLoading(false);
                    }
                    setSelectedReceive([]);
                    setNewSearch([])
                })
            }
        else {
            setopen(true)
            setmessage("No Records to perform the action")
            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
            setLoading(false);
        }
    }

    const commonReceive = (action) => {
        debugger

        setLoading(true);

        const isnew = (value) => {
            if (value.Status === 'New' || value.Status === 'In Receiving') {
                return true;
            }
            return false;
        };
        const isreceived = (value) => {
            if (value.Status === 'Received' || value.Status === 'In Receiving') {
                return true;
            }
            return false;
        };

        var recordsubset, subsetlinenos = [];

        if (action === "1") {
            recordsubset = inboundTableDetail.filter(isnew)
        }
        else if (action === "2") {
            recordsubset = inboundTableDetail.filter(isreceived)
        }

        for (let i = 0; i <= recordsubset.length - 1; i++) {
            subsetlinenos.push(recordsubset[i].ReceiptLineNumber);
        }

        const newState = inboundTableDetail.map(obj => {
            // 👇️ if id equals 2, update country property
            // if (obj.id === 2) {
            const date = new Date();
            if (action === "1") {
                const { LOTTABLE09, DATERECEIVED, EFFECTIVEDATE, ...rest } = obj;
                return { ...rest, QtyReceived: obj.QtyExpected, Status: statusDecode.statusDecode.inbound_Received, Lottable09: obj.LOTTABLE09 };
            }
            else if (action === "2") {
                const { LOTTABLE09, DATERECEIVED, EFFECTIVEDATE, ...rest } = obj;
                return { ...rest, QtyReceived: "0", Status: statusDecode.statusDecode.inbound_New, Lottable09: obj.LOTTABLE09 };

            }
            // }

            // 👇️ otherwise return object as is
            // return obj;
        });

        console.log(newState);

        debugger
        // if (search.length > 0) {

        const tempselectedrecords = newState.filter(objec => {
            return objec.checker !== "";
        })
        debugger
        console.log(tempselectedrecords);
        if (tempselectedrecords.length > 0) {

            for (let i = 0; i <= tempselectedrecords.length - 1; i++) {
                if (subsetlinenos.includes(tempselectedrecords[i].ReceiptLineNumber)) {
                    selectedReceive.push(tempselectedrecords[i]);
                }
            }


        }
        else {
            for (let i = 0; i <= inboundTableDetail.length - 1; i++) {
                if (subsetlinenos.includes(newState[i].ReceiptLineNumber)) {
                    selectedReceive.push(newState[i]);
                }
            }
        }



        debugger
        if (selectedReceive.length > 0) {
            var timeout;
            selectedReceive.map(obj => {return {...obj,CarrierKey : inboundheader.CarrierKey,SupplierCode : inboundheader.SupplierCode } })
            if (action === "1") {
                putReceiveall(JSON.stringify(selectedReceive), token, action, selectedReceive[0].ReceiptKey).then(res => {
                    debugger
                    // console.log(res);
                    if (res === "Successfully posted to WMS") {
                        setopen(true);
                        setmessage("Received Successfully")
                        setseverity("success")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                        loadingGridValues(selectedReceive[0].ReceiptKey);
                        setLoading(false);

                    }
                    else {

                        setopen(true)
                        setmessage(res)
                        setseverity("error")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                        setLoading(false);
                    }
                    setSelectedReceive([]);
                    setNewSearch([])
                })
            }
            else if (action === "2") {
                putUnReceiveall(JSON.stringify(selectedReceive), token, action, selectedReceive[0].ReceiptKey).then(res => {
                    debugger
                    console.log(res);
                    if (res === "Successfully posted to WMS") {
                        setopen(true);
                        setmessage("Unreceived  Successfully")
                        setseverity("success")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                        const loaded = loadingGridValues(selectedReceive[0].ReceiptKey);
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
                        }, 2000);
                        setLoading(false);
                    }
                    setSelectedReceive([]);
                    setNewSearch([])
                })
            }
        }
        else {
            setopen(true)
            setmessage("No Records to perform the action")
            setseverity("error")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
            setLoading(false);
        }
    }

    const UpdateLines = () => {
        debugger
        const isnew = (value) => {
            if (value.Status == 'New') {
                return true;
            }
            return false;
        };
        var recordsubset, subsetlinenos = [];
        recordsubset = inboundTableDetail.filter(isnew)
        for (let i = 0; i <= recordsubset.length - 1; i++) {
            subsetlinenos.push(recordsubset[i].ReceiptLineNumber);
        }
        const newState = inboundTableDetail.map(obj => {
            const { QTYADJUSTED, QtyReceived, EFFECTIVEDATE, Status, ...rest } = obj;
            return { ...rest, Status: 0 }
        })
        const tempselectedrecords = newState.filter(objec => {
            return objec.checker !== "";
        })
        if (tempselectedrecords.length > 0) {

            for (let i = 0; i <= tempselectedrecords.length - 1; i++) {
                if (subsetlinenos.includes(tempselectedrecords[i].ReceiptLineNumber)) {
                    selectedReceive.push(tempselectedrecords[i]);
                }
            }

            var timeout;
            savereceiptdetail(selectedReceive, token).then(res => {
                if (res === "Successfully posted to WMS") {
                    setopen(true);
                    setmessage("Updated  Successfully")
                    setseverity("success")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    const loaded = loadingGridValues(selectedReceive[0].ReceiptKey);
                    if (loaded) {
                        setLoading(false);
                    }

                }
                else {

                    setopen(true)
                    setmessage("Action Failed")
                    setseverity("error")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    setLoading(false);
                }
                setSelectedReceive([]);
                setNewSearch([])
            })
        }
        else {
            setopen(true)
            setmessage("Please select a record to perform the action")
            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
            setLoading(false);
        }

        console.log(JSON.stringify(selectedReceive))


    }
    const saveheader = () => {

        debugger
        console.log(inboundheader.CarrierPhone === '' || inboundheader.CarrierPhone === null || inboundheader.CarrierPhone === '+__-__________')
        console.log(inboundheader.CarrierPhone === '+__-__________')
        let saveheaderbody = []
        if(Client === 'BSI FTWZ'){
        saveheaderbody =
            [{
                ReceiptKey: inboundheader.ReceiptKey, StorerKey: inboundheader.StorerKey, ExternReceiptKey: inboundheader.ExternReceiptKey,
                ExternalReceiptKey2: inboundheader.ExternalReceiptKey2, TrailerNumber: inboundheader.TrailerNumber, CarrierName: inboundheader.CarrierName,
                SUsr1: inboundheader.SUsr1 !== "" && inboundheader.SUsr1 !== " " && inboundheader.SUsr1 !== null && inboundheader.SUsr1 !== undefined ? dateconv(inboundheader.SUsr1) : inboundheader.SUsr1,
                SUsr2: inboundheader.SUsr2 !== "" && inboundheader.SUsr2 !== " " && inboundheader.SUsr2 !== null && inboundheader.SUsr2 !== undefined ? dateconv(inboundheader.SUsr2) : inboundheader.SUsr2,
                SUsr4: inboundheader.SUsr4 !== "" && inboundheader.SUsr4 !== " " && inboundheader.SUsr4 !== null && inboundheader.SUsr4 !== undefined ? dateconv(inboundheader.SUsr4) : inboundheader.SUsr4,
                SUsr5: inboundheader.SUsr5 !== "" && inboundheader.SUsr5 !== " " && inboundheader.SUsr5 !== null && inboundheader.SUsr5 !== undefined ? dateconv(inboundheader.SUsr5) : inboundheader.SUsr5,
                ProNumber: inboundheader.ProNumber,
                CarrierPhone: inboundheader.CarrierPhone === '' || inboundheader.CarrierPhone === null || inboundheader.CarrierPhone === '+__-__________' ? null : inboundheader.CarrierPhone,
                WarehouseReference: inboundheader.WarehouseReference,
                TrailerOwner: inboundheader.TrailerOwner,
                SupplierName : inboundheader.SupplierName
            }]}
            else if (Client === 'BSI DOM'){
                saveheaderbody =
            [{
                ReceiptKey: inboundheader.ReceiptKey, StorerKey: inboundheader.StorerKey, ExternReceiptKey: inboundheader.ExternReceiptKey,
                ExternalReceiptKey2: inboundheader.ExternalReceiptKey2, TrailerNumber: inboundheader.TrailerNumber, CarrierName: inboundheader.CarrierName,
                SUsr1: inboundheader.SUsr1 !== "" && inboundheader.SUsr1 !== " " && inboundheader.SUsr1 !== null && inboundheader.SUsr1 !== undefined ? dateconv(inboundheader.SUsr1) : inboundheader.SUsr1,
                SUsr2: inboundheader.SUsr2 !== "" && inboundheader.SUsr2 !== " " && inboundheader.SUsr2 !== null && inboundheader.SUsr2 !== undefined ? dateconv(inboundheader.SUsr2) : inboundheader.SUsr2,
                SUsr4: inboundheader.SUsr4, SUsr5: inboundheader.SUsr5,
                ProNumber: inboundheader.ProNumber,
                CarrierPhone: inboundheader.CarrierPhone === '' || inboundheader.CarrierPhone === null || inboundheader.CarrierPhone === '+__-__________' ? null : inboundheader.CarrierPhone,
                WarehouseReference: inboundheader.WarehouseReference,
                TrailerOwner: inboundheader.TrailerOwner,
                SupplierName : inboundheader.SupplierName
            }]
            } else{
                saveheaderbody =
            [{
                ReceiptKey: inboundheader.ReceiptKey, StorerKey: inboundheader.StorerKey, ExternReceiptKey: inboundheader.ExternReceiptKey,
                ExternalReceiptKey2: inboundheader.ExternalReceiptKey2, TrailerNumber: inboundheader.TrailerNumber, CarrierName: inboundheader.CarrierName,
                SUsr1: inboundheader.SUsr1, SUsr2: inboundheader.SUsr2, SUsr4: inboundheader.SUsr4, SUsr5: inboundheader.SUsr5,
                ProNumber: inboundheader.ProNumber,
                CarrierPhone: inboundheader.CarrierPhone === '' || inboundheader.CarrierPhone === null || inboundheader.CarrierPhone === '+__-__________' ? null : inboundheader.CarrierPhone,
                WarehouseReference: inboundheader.WarehouseReference,
                TrailerOwner: inboundheader.TrailerOwner,
                SupplierName : inboundheader.SupplierName
            }]
            }
        const pattern = /^\+91\-[0-9]\d{9}$/
        //console.log('+__-__________')
        if (pattern.test(inboundheader.CarrierPhone) || saveheaderbody[0].CarrierPhone === null) {
            console.log(JSON.stringify(saveheaderbody))
            var timeout;

        savereceiptheader(JSON.stringify(saveheaderbody), token).then(res => {
            if (res === "AdvancedShipNotice stored") {
                setopen(true);
                setmessage("Updated  Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
                const loaded = loadingGridValues(inboundheader.ReceiptKey);
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
                    }, 2000);
                    setLoading(false);
                }
            })
        }
        else {
            setopen(true)
            setmessage("Phone No is not valid")
            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
            setLoading(false);
        }
        //console.log(inboundheader)

    }


    const visibleGrid = () => {
        setVisible(!visible);
    };

    const Refresh = () => {
        loadingGridValues(inboundheader.ReceiptKey)
    }

    const statusCell = (props) => {

        const setStyle = []
        const statusColorchecker = {
            New: "New",
            Received: "Received",
            Closed: "Closed",
            Cancelled: "Cancelled",
            InReceiving: "in Receiving"

        }
        console.log(props.dataItem.Status);
        if (props.dataItem.Status == "New") {
            const style = {
                color: "#20c997" //"#0d6efd",
                

            };
            setStyle.push(style);
        }
        else if (props.dataItem.Status == "Received") {
            const style = {
                color: "#198754" //"#20c997",
                

            };
            setStyle.push(style);
        }
        else if (props.dataItem.Status == "Closed") {
            const style = {
                color: "#dc3545"
                

            };
            setStyle.push(style);
        }
        else if (props.dataItem.Status == "Cancelled") {
            const style = {
                color: "#fd7e14"
                

            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == "In Receiving") {
            const style = {
                color: "#ffa31a"//"#198754",
                

            };

            setStyle.push(style);
        }
        const style = {
            color: "blue",
            
            width: 1000

        };

        const field = props.field || "";

        return (
            <td style={setStyle[0]} className="status-bg">

                {/* <div className='row' > */}
                <span style={{ justifyContent: 'center' }}>{props.dataItem[field]}</span>
                {/* </div> */}


            </td>
        );



    }

    const handleqtyChange = (e) => {
        var tempinboundTableDetailrecord = inboundTableDetail[e.target.name]
        tempinboundTableDetailrecord.QtyExpected = e.value
        var tempinboundTableDetail = inboundTableDetail
        tempinboundTableDetail[e.target.name] = tempinboundTableDetailrecord
        setInboundTableDetail(tempinboundTableDetail);
    }

    const qtycell = (e) => {
        return (
            <td>
                <NumericTextBox
                    min="1"
                    max="9999"
                    name={e.dataIndex}
                    defaultValue={e.dataItem.QtyExpected || 0}
                    onChange={handleqtyChange}
                    readOnly={e.dataItem.Status === "Received" || e.dataItem.Status === "Closed" || !(permissions.qtyupdate.readonly === 'False') }
                    spinners={false}
                    format="n0"
                />
            </td>
        )
    }

    const _export = React.useRef(null);
    const _grid = React.useRef();
    const excelExport = () => {
        debugger
        if (_export.current !== null) {
            debugger
            const rec = inboundTableDetail.filter(obj => obj.Status === "Received")
            let uniqueObjArray = [...new Map(rec.map((item) => [item["Lottable09"], item])).values()];
            let lotkeys = [...new Map(rec.map((item) => [item["Lottable09"], item])).keys()];
            const recs = inboundTableDetail.filter(obj => obj.Status !== "Received")
            let Notreceived_uniqueObjArray = [...new Map(recs.map((item) => [item["Lottable09"], item])).keys()];
            let difference = lotkeys.filter(x => !Notreceived_uniqueObjArray.includes(x));
            const newformat = uniqueObjArray.filter(obj => difference.includes(obj.Lottable09)).map(item => {
                return { Lottable09: item.Lottable09, ReceiptKey: item.ReceiptKey, ToLoc: '' }
            })
            _export.current.save(newformat, arr);


        }
    };
    const excelExport_price = () => {
        debugger
        if (_export.current !== null) {
            let uniqueObjArray = [...new Map(inboundTableDetail.map((item) => [item["SUsr3"], item])).values()];
            const newformat = uniqueObjArray.map(item => {
                return { SUsr3: item.SUsr3, ReceiptKey: item.ReceiptKey, SUsr1: item.SUsr1 }
            })
            _export.current.save(newformat, arr1);
        }

    }

    const onRowClick = (e) => {
        navigate('/inbound/details/creation', { state: { receiptKey: e.dataItem, lineno: e.dataItem.ReceiptLineNumber, maction: "2", header : state.inboundDetail } })
    }

    const Lottable09header = (e) => {
        return (
            <a className="k-link" >
                <span title={e.dataItem.Lottable09}>{e.dataItem.Lottable09}</span>

            </a>
        );
    }

    const showPooup = () => {
        setShow(!show);
    };

    const handleGridChange = (event) => {
        debugger
        console.log(event);

        const name = event.target.name;
        const value = event.target.checked;
        console.log(event.target.checked);

        const countValue = Object.values(gridChangehandler).filter(obj => obj === true).length
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

    const StatusFilterCell = (props) => (
        <DropdownFilterCell
          {...props}
          data={Statuses}
          defaultItem={"Select status"}
        />
      );
      const filterChange = (event) => {
        setFilter(event.filter);
      };

    return (
        <>
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page  main-content">
                <WithSnackbar open={open} message={message} severity={severity} />
                <div className="d-flex flex-wrap mt-2 justify-content-between ">
                    <div className='ps-3'>
                        <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.inboundDeatils')}  {inboundDetail.ReceiptKey}</h3>
                    </div>
                    <div className='pe-3 ' >
                        <ul className='header-buttons'>
                            {permissions.creation.visible === "True" && <li className='text-uppercase br-round-left active' onClick={() => {
                                navigate('/inbound/details/creation', { state: { receiptKey: inboundDetail, lineno: newLineNo, maction: "1" , header : state.inboundDetail} })

                            }}>New</li>}

                            {/* <li className='text-uppercase br-round-right active' onClick={clickReceive}>{search.length > 0 ? (<span>Receive</span> ): ( <span>Receive all</span>)}</li> 
                            <li className='text-uppercase br-round-left active' onClick={() => clickReceive("3")}>receive</li>*/}
                            { !(username === 'maheshbsidom' ||  username === 'maheshbsiftwz') && (<>
                            {permissions.receive.visible === "True" && <li className={permissions.creation.visible === "True" ? 'text-uppercase br-round active' : 'text-uppercase br-round-left active'} onClick={() => commonReceive("1")}>receive</li>}
                            {permissions.unreceive.visible === "True" && <li className={(permissions.creation.visible === "True" || permissions.receive.visible === "True") ? 'text-uppercase br-round active': 'text-uppercase br-round-left active'} onClick={() => commonReceive("2")}>unreceive</li>} </>)}
                            <li className={(permissions.creation.visible === "True" || permissions.receive.visible === "True" || permissions.unreceive.visible === "True") ? 'text-uppercase br-round active' :'text-uppercase br-round-left active'} onClick={() => Refresh()}>Refresh</li>
                            { !(username === 'maheshbsidom' ||  username === 'maheshbsiftwz') && 
                            (<><li className={(permissions.delete.visible === "True" || permissions.saveheader.visible === "True") ? 'text-uppercase br-round active':'text-uppercase br-round-right active'} onClick={() => { navigate('/inbound') }}>Back</li>
			                {permissions.delete.visible === "True" && <li className={permissions.saveheader.visible === "True" ? 'text-uppercase br-round active' : 'text-uppercase br-round-right active'} onClick={deleteasnlinesclick}>Delete</li>}
                            {permissions.saveheader.visible === "True" && <li className='text-uppercase br-round-right active'  onClick={() => saveheader()}>Save Header</li>}</>)}
                            {/*<li className='text-uppercase br-round-right active' onClick={clickReceive}>{buttonText}</li> */}

                        </ul>
                    </div>
                </div>

                <div className='card-container-form mt-3'>
                    <div className='row '>
                    <div className='col-md-6 col-12'>
                        <div className='row align-items-start'>
                        {(Client === 'BSI FTWZ' || Client === 'BSI DOM') ?  (<div className='col-lg-4 col-12'>
                                    <div>
                                    <Label w>BOE DATE</Label>
                                    </div>
                                    <div>
                                    <DatePicker
                                        // defaultValue={value}
                                        format="dd/MMM/yyyy"
                                        weekNumber={true}
                                        onChange={handledateChange}
                                        name="SUsr1"
                                        value={inboundheader.SUsr1 || ''}
                                    />
                                     </div>
                            </div>) : (<div className='col-lg-4 col-12'>
                                <div>
                                <Label >{permissions.SUsr1.label}</Label>
                                </div>
                                <div>
                                <KendoInput
                                    type="text"
                                    id="SUsr1"
                                    value={inboundheader.SUsr1 || ""}
                                    onChange={handleChange}
                                    maxLength={10}
                                    readOnly={permissions.SUsr1.readonly === 'True'}
                                />
                                 </div>
                        </div>)}
                         <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label >{(Client === 'BSI FTWZ' || Client === 'BSI DOM') ? 'BOE NUMBER' : permissions.ExternalReceiptKey2.label}</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="ExternalReceiptKey2"
                                        value={inboundheader.ExternalReceiptKey2 || ""}
                                        onChange={handleChange}
                                        maxLength={25}
                                        readOnly={permissions.ExternalReceiptKey2.readonly === 'True'}
                                    />
                                    </div>
                            </div>
                            {(Client === 'BSI FTWZ' || Client === 'BSI DOM') ? (<div className='col-lg-4 col-12'>
                                    <div>
                                    <Label >INVOICE DATE</Label>
                                    </div>
                                    <div>
                                    <DatePicker
                                        // defaultValue={value}
                                        format="dd/MMM/yyyy"
                                        weekNumber={true}
                                        onChange={handledateChange}
                                        name="SUsr2"
                                        value={inboundheader.SUsr2 || ''}
                                    />
                                     </div>
                            </div>) :
                            (<div className='col-lg-4 col-12'>
                                 <div>
                                <Label >{permissions.SUsr2.label}</Label>
                                </div>
                                <div>
                                <KendoInput
                                    type="text"
                                    id="SUsr2"
                                    value={inboundheader.SUsr2 || ""}
                                    onChange={handleChange}
                                    maxLength={10}
                                    readOnly={permissions.SUsr2.readonly === 'True'}
                                />
                                 </div>
                        </div>)}
                        </div>
                        <div className='row align-items-start mt-2'>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label >{(Client === 'BSI FTWZ' || Client === 'BSI DOM') ? 'INVOICE NUMBER' : permissions.WarehouseReference.label}</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="WarehouseReference"
                                        value={inboundheader.WarehouseReference || ""}
                                        onChange={handleChange}
                                        maxLength={25}
                                        readOnly={permissions.WarehouseReference.readonly === 'True'}
                                    />
                                    </div>
                            </div>

                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label >{permissions.TrailerNumber.label}</Label>
                                    </div>
                                    <div>
                                        <KendoInput
                                            type="text"
                                            id="TrailerNumber"
                                            value={inboundheader.TrailerNumber || ""}
                                            onChange={handleChange}
                                            maxLength={25}
                                            readOnly={permissions.TrailerNumber.readonly === 'True'}
                                        />
                                    </div>
                            </div>

                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label >{permissions.TrailerOwner.label}</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="TrailerOwner"
                                        value={inboundheader.TrailerOwner || ""}
                                        onChange={handleChange}
                                        maxLength={25}
                                        readOnly={permissions.TrailerOwner.readonly === 'True'}
                                    />
                                    </div>
                            </div>
                        </div>
                        <div className='row align-items-start mt-2'>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label>{permissions.ProNumber.label}</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="ProNumber"
                                        value={inboundheader.ProNumber || ""}
                                        onChange={handleChange}
                                        maxLength={25}
                                        readOnly={permissions.ProNumber.readonly === 'True'}
                                    />
                                    </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label>{permissions.CarrierPhone.label}</Label>
                                    </div>
                                    <div>
                                    <MaskedTextBox
                                        mask={"+YZ-CCCCCCCCCC"}
                                        value={inboundheader.CarrierPhone || ""}
                                        rules={{
                                            Y: /9/,
                                            Z: /1/,
                                            A: /\+/,
                                            B: /\-/,
                                            C: /[0-9]/,
                                        }} //^\+91\-[6-9]\d{9}$
                                        name="CarrierPhone"
                                        onChange={handledateChange}
                                        readOnly={permissions.CarrierPhone.readonly === 'True'}
                                    />
                                     </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                        <Label >{permissions.CarrierName.label}</Label>
                                    </div>
                                    <div>
                                        <KendoInput
                                            type="text"
                                            id="CarrierName"
                                            value={inboundheader.CarrierName || ""}
                                            onChange={handleChange}
                                            maxLength={25}
                                            readOnly={permissions.CarrierName.readonly === 'True'}
                                        />
                                    </div>
                            </div>
                        </div>
                        <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label className='opacity-50 text-uppercase'>{permissions.SupplierName.label}</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="SupplierName"
                                        value={inboundheader.SupplierName}
                                        onChange={handleChange}
                                        readOnly={permissions.SupplierName.readonly === 'True'}
                                        maxLength={45}
                                    />
                                </div>
                            </div>
                        {Client === 'BSI FTWZ' && <div className='row align-items-start mt-2'>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label >VAS START DATE</Label>
                                    </div>
                                    <div>
                                    <DatePicker
                                        // defaultValue={value}
                                        format="dd/MMM/yyyy"
                                        weekNumber={true}
                                        onChange={handledateChange}
                                        name="SUsr4"
                                        value={inboundheader.SUsr4 || ''}
                                    />
                                     </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                     <div>
                                    <Label >VAS COMPLETE DATE</Label>
                                    </div>
                                    <div>
                                    <DatePicker
                                        // defaultValue={value}
                                        format="dd/MMM/yyyy"
                                        weekNumber={true}
                                        onChange={handledateChange}
                                        name="SUsr5"
                                        value={inboundheader.SUsr5 || ''}
                                    />
                                    </div>
                            </div>
                        </div>}
                    </div>
                    <div className='col-md-1 col-12'>
                        <div className='vertical-line d-sm-none d-md-block'></div>
                    </div>
                    <div className='col-md-5 col-12'>
                        <div className='row align-items-start '>
                            <div className='col-lg-4 col-12'>
                                     <div>
                                    <Label className='opacity-50 text-uppercase'>ASN NO</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="ReceiptKey"
                                        value={inboundheader.ReceiptKey}
                                        disabled={true}
                                    />
                                    </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label className='opacity-50 text-uppercase'>{(Client === 'BSI FTWZ' || Client === 'BSI DOM') ? 'Delivery Number' : 'EXT REF'}</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="ExternReceiptKey"
                                        value={inboundheader.ExternReceiptKey}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                <div>
                                    <Label className='opacity-50 text-uppercase'>Status</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="Status"
                                        value={inboundheader.Status}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row align-items-start mt-2'>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label className='opacity-50 text-uppercase'>ASN Date</Label>
                                    </div>
                                    <div>
                                    <DatePicker
                                        // defaultValue={value}
                                        format="dd/MMM/yyyy"
                                        weekNumber={true}
                                        //onChange={handledateChange}
                                        name="AddDate"
                                        value={new Date(inboundheader.AddDate)}
                                        disabled={true}
                                    />
                                    </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label className='opacity-50 text-uppercase'>Type</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="Type"
                                        value={inboundheader.Type}
                                        disabled={true}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className='row align-items-start mt-2'>
                            <div className='col-lg-4 col-12'>
                                    <div>
                                    <Label className='opacity-50 text-uppercase'>Expected Qty</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="TOTEXPQTY"
                                        value={agg.QtyExpected.sum}
                                        disabled={true}
                                    />
                                     </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                <div>
                                    <Label className='opacity-50 text-uppercase'>Received Qty</Label>
                                    </div>
                                    <div>
                                    <KendoInput
                                        type="text"
                                        id="TOTRECQTY"
                                        value={agg.QtyReceived.sum}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                {ftwz_disp_switch && (<div className='row'>

                    {/* <div className='col-1' style={{marginRight:"25px"}}>
                    <button
                            title="Export Excel"
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                            onClick={excelExport}
                        >Putaway Format
                    </button>
                    </div> */}
                    <div className='col-3' style={{ marginLeft: "15px" }}>
                        <Excelupload data={inboundTableDetail.filter(obj => obj.Status === 'Received')} />
                    </div>
                    <div className='col-1' style={{ marginTop: '20px' }}>
                        <SvgIcon onClick={excelExport} icon={fileTxtIcon} style={{ cursor: "pointer" }} size="medium" />

                    </div>
                    {/* <div className='col-3'>
                        
                    </div> */}
                    {/* <div className='col-2'>
                        <div className='row'>
                        <p style={{textAlign: 'right'}}>Price upload:</p>
                        </div>
                    </div> */}
                    <div className='col-3'>

                        {/* <input type="file" className="fileSelect" 
                        onChange={(e) => fileChangehandle(e)} /> */}
                        <p style={{ marginBottom: '0px', fontSize: '12px' }}>Price Upload</p>
                        <Upload
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
                        />

                    </div>
                    <div className='col-1' style={{ marginTop: '20px' }}>
                        <SvgIcon onClick={excelExport_price} icon={fileTxtIcon} style={{ cursor: "pointer" }} size="medium" />

                    </div>
                


                </div>)}

               
                <div className='row mt-2 '>
                    <div className='col-lg-9 col-4'>

                    </div>
                    <div className='col-lg-3 col-8 col-sm-auto'>
                    <ButtonGroup>
                        { permissions.qtyupdate.visible === "True"  && (<Button onClick={UpdateLines}  id={"qtyupdate"}
                        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" >Qty Update</Button>)}
                         <Button
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            onClick={visibleGrid}
                            ref={anchor}
                        >
                            Field selector
                        </Button>
                        </ButtonGroup>
                    </div>
                   
                </div>
                <div className='table-section mt-2 ps-1 pe-1'>
                    <ExcelExport ref={_export}>
                        <div className='d-flex position-relative pe-3'>
                            {/* <div style={{ marginLeft: "20px", paddingRight :"10px" }} ><Button onClick={UpdateLines} className='k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary' >Qty Update</Button></div>
                    <div><button
                            title="Export Excel"
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                            onClick={excelExport}
                        >Putaway Format
                    </button></div>
                    <div><button
                            title="Export Excel"
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                            onClick={excelExport_price}
                        >Price Update Format
                    </button></div> */}

                            <div>



                                <Popup anchor={anchor.current} show={show} popupClass={"popup-content"}>
                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" style={{ marginTop: "5px" }} name='ExternReceiptKey' checked={gridChangehandler.ExternReceiptKey} onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>EXTERNAL REF 1</p>

                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" style={{ marginTop: "5px" }} checked={gridChangehandler.ReceiptLineNumber} name='ReceiptLineNumber' onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>LINE NO</p>

                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} checked={gridChangehandler.Sku} name='Sku' onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>SKU</p>

                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} name='ToId' checked={gridChangehandler.ToId} onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>LPN</p>

                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" id="1" name='EXP_QTY' checked={gridChangehandler.EXP_QTY} onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>EXP QTY</p>

                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" id="1" name='QtyReceived' checked={gridChangehandler.QtyReceived} onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>REC QTY</p>

                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" id="1" name='SUsr1' checked={gridChangehandler.SUsr1} onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>PRICE</p>

                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" id="1" name='SUsr2' checked={gridChangehandler.SUsr2} onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>ORIG QTY</p>

                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" id="1" name='SUsr3' checked={gridChangehandler.SUsr3} onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>ARTICLE NO</p>

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


                                    <div className='row'>
                                        <div className='col-2'>
                                            <input type="checkbox" id="1" name='Status' checked={gridChangehandler.Status} onChange={handleGridChange} value="1" />
                                        </div>
                                        <div className='col-10'>
                                            <p>STATUS</p>

                                        </div>
                                    </div>


                                </Popup>
                            </div>




                        </div>
                        <Grid
                            onRowDoubleClick={onRowClick}
                            pageable={true}
                            sortable={true}
                            filterable={true}
                            style={{
                                height: "450"
                            }}
                            data={process(filterBy(inboundTableDetail, filter), dataState)}
                            {...dataState}
                            onDataStateChange={(e) => {
                                setDataState(e.dataState);
                            }}
                            ref={_grid}
                            filter={filter}
                            onFilterChange={filterChange}

                        >
                            { !(username === 'maheshbsidom' ||  username === 'maheshbsiftwz') && (<Column title="" filterable={false} className="edit-btn" width="60px" cell={ReceiveChecked} />)}
                            {gridChangehandler.ExternReceiptKey == true ? (
                                <Column field="ExternReceiptKey" title="EXTERNAL REF 1" width={150} filterable={false} className="fw-bold" />
                            ) : (<></>)}
                            {gridChangehandler.ReceiptLineNumber == true ? (<Column  width={150}  field="ReceiptLineNumber" title="LINE NO" filterable={false} />) : (<></>)}
                            {gridChangehandler.Sku == true ? (<Column field="Sku"  width={150}  title="SKU" filterable={true} />) : (<></>)}
                            {gridChangehandler.SUsr2 == true ? (<Column field="SUsr2"  width={150}  title="ORIG QTY" filterable={false} />) : (<></>)}
                            {gridChangehandler.SUsr3 == true ? (<Column field="SUsr3"  width={150}  title="ARTICLE NO" filterable={true} />) : (<></>)}
                            {gridChangehandler.ToId == true ? (<Column field="ToId"  width={150}  title="LPN" filterable={false} />) : (<></>)}
                            {gridChangehandler.EXP_QTY == true ? (<Column title="EXP QTY"  width={150}  filterable={false} cell={qtycell} />) : (<></>)}
                            {gridChangehandler.QtyReceived == true ? (<Column field="QtyReceived"  width={150}  title="REC QTY" filterable={false} />) : (<></>)}
                            {gridChangehandler.SUsr1 == true ? (<Column field="SUsr1" title="PRICE"  width={150}  filterable={false} />) : (<></>)}
                            {gridChangehandler.Lottable09 == true ? (<Column field="Lottable09"  width={150}  title="HU" filterable={true} />) : (<></>)}

                            {/*<Column field="ToLoc" title="LOCATION" filterable={false} Visible={false} /> */}
                            {gridChangehandler.Status == true ? (<Column field="Status" title="STATUS"  width={150} cell={statusCell} filterCell={StatusFilterCell} />) : (<></>)} 
                            {permissions.update.visible === 'True' && <Column title="" filterable={false} className="edit-bg"width={100} cell={CommandCell} />}


                            <ExcelExportColumn field="ReceiptKey" title="ReceiptKey" />
                            <ExcelExportColumn field="ExternLineNo" title="ExternLineNo" />
                            <ExcelExportColumn field="StorerKey" title="StorerKey" />
                        </Grid>

                    </ExcelExport>


                </div>
            </div>

            {visible && (
                <Dialog title={titleZone} onClose={visibleGrid}>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} name='ExternReceiptKey' checked={gridChangehandler.ExternReceiptKey} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>EXTERNAL REF 1</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} checked={gridChangehandler.ReceiptLineNumber} name='ReceiptLineNumber' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>LINE NO</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} checked={gridChangehandler.Sku} name='Sku' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>SKU</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} name='ToId' checked={gridChangehandler.ToId} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>LPN</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" name='EXP_QTY' checked={gridChangehandler.EXP_QTY} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>EXP QTY</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" name='QtyReceived' checked={gridChangehandler.QtyReceived} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>REC QTY</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" name='SUsr1' checked={gridChangehandler.SUsr1} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>PRICE</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" name='SUsr2' checked={gridChangehandler.SUsr2} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>ORIG QTY</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" name='SUsr3' checked={gridChangehandler.SUsr3} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>ARTICLE NO</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" name='Lottable09' checked={gridChangehandler.Lottable09} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>HU</p>

                        </div>
                    </div>


                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" name='Status' checked={gridChangehandler.Status} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>STATUS</p>

                        </div>
                    </div>

                </Dialog>

            )}

        </>
    );
}

export default InboundDetails;


