import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { useLocalization } from '@progress/kendo-react-intl';

import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { PutInboundDetailCreation, savereceiptdetail } from "../../../services/InboundService/InboundService";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import { getItem, getPackUoms, getPack } from "../../../services/ConfigurationService/ConfigurationService";


const InboundDetailCreation = () => {
    //declare service
    const { state } = useLocation()
    const receiptdetail = state && state.receiptKey
    const lineno = state && state.lineno
    const Action = state && state.maction
    const header  = state.header
    const localizationService = useLocalization();
    let navigate = useNavigate()

    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let UserName = localStorage.getItem("UserName");

    const inboundDetailCreationForm = {
        ReceiptKey: receiptdetail.ReceiptKey,
        ReceiptLineNumber: lineno,
        SUBLINENUMBER: "",
        ExternReceiptKey: receiptdetail.ExternReceiptKey,
        ExternLineNo: "",
        StorerKey: Client,
        POKEY: "",
        TARIFFKEY: "XXXXXXXXXX",
        Sku: "",
        ALTSKU: "",
        PALID: null,
        Status: "0",
        QtyExpected: 0,
        QTYADJUSTED: 0,
        QtyReceived: 0,
        UOM: "EA",
        PackKey: "",
        ToLoc: "STAGE",
        ToLot: "",
        ToId: "",
        ExternalLot: "",
        CONDITIONCODE: "OK",
        Lottable01: "",
        Lottable02: "",
        Lottable03: "",
        Lottable04: null,
        Lottable05: null,
        Lottable06: "",
        Lottable07: "",
        Lottable08: "",
        Lottable09: "",
        Lottable10: "",
        CASECNT: 0.00000,
        INNERPACK: 0.00000,
        PALLET: 0.00000,
        CUBE: 0.0,
        GrossWgt: 0.00000,
        NetWgt: 0.00000,
        OTHERUNIT1: 0.0,
        OTHERUNIT2: 0.0,
        UNITPRICE: 0.0,
        EXTENDEDPRICE: 0.0,
        FORTE_FLAG: "I",
        SUsr1: null,
        SUsr2: null,
        SUsr3: null,
        SUsr4: null,
        SUsr5: null,
        Notes: null,
        REASONCODE: null,
        PALLETID: null,
        QTYREJECTED: 0.00000,
        TYPE: "1",
        QCREQUIRED: "0",
        PACKINGSLIPQTY: 0.00000,
        RECEIPTDETAILID: null,
        TareWgt: 0.00000,
        QTYTOINSPECT: 0.00000,
        TIMESTAMP: null,
        Descr: ""
    }

    //state
    const [inboundDetailCreationFormValues, setInboundDetailCreationFormValues] = useState(inboundDetailCreationForm);

    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [packkeys, setpackkeys] = useState([])
    //const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const [uoms, setuoms] = useState(['EA'])


    //Tab strip
    const [selected, setSelected] = React.useState(0);
    const [data, setData] = useState([]);
    const [dataforfilter, setdataforfilter] = useState([]);
    const [packkeydataforfilter, setpackkeydataforfilter] = useState([]);
    const handleSelect = (e) => {
        setSelected(e.selected);
    };



    const removeItemAll = (arr, value) => {
        
        return arr.filter(obj => obj !== value);
    }


    // loading function call
    useEffect(() => {
        setLoading(true)
        getItem(token).then((res) => {
            debugger
            if (res) {
                setData(res);
                setdataforfilter(res)
                if (Action == "2") {
                    console.log(receiptdetail.Sku)
                    let skuobj = res.find(obj => obj.Sku === receiptdetail.Sku)
                    console.log(skuobj);
                    let packobj;
                    getPack(token).then((resp) => {
                        if (resp) {
                            setpackkeys(resp);
                            setpackkeydataforfilter(resp)
                            packobj = resp.find(obj => obj.packkey === receiptdetail.PackKey)
                            //setInboundDetailCreationFormValues({ ...receiptdetail, PackKey: packobj })
                            setInboundDetailCreationFormValues({
                                ...receiptdetail, Sku: skuobj, Descr: skuobj.Descr, PackKey: packobj, Lottable04: new Date(receiptdetail.Lottable04),
                                Lottable05: new Date(receiptdetail.Lottable05)
                            });
                        }
                        else {
                            setpackkeys([]);
                        }
                        setLoading(false)
                    })
                    
                }
                else
                {
                    getPack(token).then((res) => {
                        if (res) {
                            setpackkeys(res);
                            setpackkeydataforfilter(res)
                        }
                        else {
                            setpackkeys([]);
                        }
                        setLoading(false)
                    })
                }
                //console.log(res)
            }
            else {
                setData([]);
                getPack(token).then((res) => {
                    if (res) {
                        setpackkeys(res);
                        setpackkeydataforfilter(res)
                    }
                    else {
                        setpackkeys([]);
                    }
                    setLoading(false)
                })
            }
        })
        
        if (Action == "2") {
            getPackUoms(token, receiptdetail.PackKey).then((resp) => {

                let uomarr = removeItemAll(Object.values(resp[0]), " ")
                setuoms(uomarr)
                
            })
        }
    }, [token])


    const handleChange = (event) => {
        console.log(event);

        const name = event.target.name;
        const value = event.target.value;
        if (name === 'Sku') {
            let packobj = packkeydataforfilter.find(obj => obj.packkey === value.PackKey)
            setInboundDetailCreationFormValues({ ...inboundDetailCreationFormValues, Descr: value.Descr, Sku: value, PackKey: packobj })
            getPackUoms(token, value.PackKey).then((resp) => {
                let uomarr = removeItemAll(Object.values(resp[0]), " ")
                setuoms(uomarr)
            })
            
            console.log(inboundDetailCreationFormValues)
        }
        else if(name === 'PackKey') {
            console.log(value.packkey)
            getPackUoms(token, value.packkey).then((resp) => {
                let uomarr = removeItemAll(Object.values(resp[0]), " ")
                setuoms(uomarr)
            })
            setInboundDetailCreationFormValues({ ...inboundDetailCreationFormValues, [name]: value })
        }
        else if(name === 'GrossWgt') {
            let timeout;
            if (value - inboundDetailCreationFormValues.NetWgt >= 0){
                setInboundDetailCreationFormValues({ ...inboundDetailCreationFormValues, [name]: value, TareWgt : value - inboundDetailCreationFormValues.NetWgt})
            }
            else{
                setopen(true)
                setmessage('Gross weight is less than Net weight')
                setseverity("warning")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 3000);
                setLoading(false);
            }
        }
        else if (name === 'NetWgt'){
            let timeout;
            if (inboundDetailCreationFormValues.GrossWgt - value >= 0){
                setInboundDetailCreationFormValues({ ...inboundDetailCreationFormValues, [name]: value, TareWgt : inboundDetailCreationFormValues.GrossWgt - value})
            }
            else{
                setopen(true)
                setmessage('Gross weight is less than Net weight')
                setseverity("warning")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 3000);
                setLoading(false);
            }
        }
        else {
            setInboundDetailCreationFormValues({ ...inboundDetailCreationFormValues, [name]: value })
        }



    }

    const filterData = (filter, name) => {
        console.log(filter)
        if(name === 'Sku'){
            return filterBy(dataforfilter, filter);
        }
        if(name === 'PackKey'){
            return filterBy(packkeydataforfilter, filter);
        }
        
    };
    const filterChange = (event) => {
        setData(filterData(event.filter, event.target.name));
        //console.log(event.target.name)
    };

    //submit receipt detail

    const onSubmit = () => {
        console.log(token);
        if ((inboundDetailCreationFormValues.Sku !== "") && (inboundDetailCreationFormValues.QtyExpected != 0) && (inboundDetailCreationFormValues.QtyExpected != "") &&
            (inboundDetailCreationFormValues.PackKey !== "") && (inboundDetailCreationFormValues.StorerKey !== "")) {
            //setLoading(true);
            // let JsonSubmit = JSON.stringify( inboundDetailCreationFormValues)
            // console.log("[" + JsonSubmit + "]");
            debugger
            let finalobj = { ...inboundDetailCreationFormValues }
            console.log(finalobj, "before conv")
            finalobj.Sku = inboundDetailCreationFormValues.Sku.Sku
            finalobj.PackKey = inboundDetailCreationFormValues.PackKey.packkey
            if (inboundDetailCreationFormValues.Lottable04 !== null) {
                finalobj.Lottable04 = dateconv(inboundDetailCreationFormValues.Lottable04)
            }
            if (inboundDetailCreationFormValues.Lottable05 !== null) {
                finalobj.Lottable05 = dateconv(inboundDetailCreationFormValues.Lottable05)
            }
            finalobj.Status = '0'
            finalobj.CarrierKey = header.CarrierKey
            finalobj.SupplierCode = header.SupplierCode
            console.log(JSON.stringify(finalobj))
            console.log(finalobj)
            CreateReceipt(finalobj);
        }
        else {
            var timeout;
            setopen(true)
            setmessage("Please fill mandatory fields")
            setseverity("error")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }
    }
    const dateconv = (datobj) => {
        let timepart = datobj.toISOString().split('T')[1].split('.')[0]
        let daypart = ('0' + datobj.getDate().toString()).slice(-2);
        let monthpart = ('0' + datobj.getMonth().toString()).slice(-2);
        let yearpart = datobj.getFullYear().toString();
        let fulldatepart = monthpart + '/' + daypart + '/' + yearpart
        return fulldatepart + ' ' + timepart
    }

    const CreateReceipt = (event) => {
        setLoading(true)
        var timeout;
        savereceiptdetail([event], token).then(res => {
            if (res === "Successfully posted to WMS") {
                setopen(true);
                setmessage("Created  Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
                setLoading(false);
            }
            else {
                setopen(true)
                setmessage(res)
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 3000);
                setLoading(false);
            }
            setLoading(false);
        })
    }

    return (
        <>
            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>
                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-3'>
                        {receiptdetail.RECEIPTKEY ? (
                            <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.ASNUpdate')}{receiptdetail.RECEIPTKEY}</h3>

                        ) : (
                            <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.ASNCreation')}</h3>

                        )}
                        {/* <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.ASNCreation')}</h3> */}
                    </div>
                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            {inboundDetailCreationFormValues.Status !== "Received" && (<li className='text-uppercase br-round-left active' onClick={onSubmit} >{Action === '1' ? (<span>Create</span>) : (<span>Update</span>)}</li>)}


                            {/* <li className='text-uppercase br-round-left active' onClick={onSubmitCreate}>Create</li> */}
                            <li className={inboundDetailCreationFormValues.Status !== "Received" ? 'text-uppercase br-round-right active' : 'text-uppercase rounded-pill active'} onClick={() => {
                                console.log(receiptdetail, "receiptdetail")
                                navigate('/inbound/details', { state: { inboundDetail: receiptdetail } });
                            }}>Back</li>

                        </ul>
                    </div>
                </div>



                <TabStrip selected={selected} onSelect={handleSelect} style={{ margin: '10px' }}>
                    <TabStripTab title="ASN Detail">
                        <div className='row'>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>ExternReceiptKey *</p>
                                <Input disabled={true} value={inboundDetailCreationFormValues.ExternReceiptKey} name="ExternReceiptKey" style={{ width: '100%' }} />
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>ReceiptKey</p>
                                <Input value={inboundDetailCreationFormValues.ReceiptKey} disabled={true} name="ReceiptKey" style={{ width: '100%' }} />
                            </div>
                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>LineNo *</p>
                                <Input disabled={true} value={lineno} name="LineNO" style={{ width: '100%' }} />
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Status</p>
                                <Input value="New" disabled={true} name="Status" style={{ width: '100%' }} />
                            </div>

                        </div>

                        <div className='row'>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Item *</p>
                                <DropDownList
                                    style={{
                                        width: "300px",
                                    }}
                                    data={data}
                                    textField="Sku"
                                    filterable={true}
                                    onFilterChange={filterChange}
                                    value={inboundDetailCreationFormValues.Sku}
                                    name='Sku'
                                    onChange={handleChange}
                                    disabled={inboundDetailCreationFormValues.Status === "Received"}
                                />
                            </div>
                            <div className='col-1'>

                            </div>

                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Description</p>
                                <Input name="description" style={{ width: '100%' }} value={inboundDetailCreationFormValues.Descr || ""} disabled={true} />
                            </div>

                        </div>

                        <div className='row'>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM *</p>
                                <DropDownList
                                    style={{
                                        width: "300px",
                                    }}
                                    data={uoms}
                                    name="UOM"
                                    value={inboundDetailCreationFormValues.UOM || ""}
                                    onChange={handleChange}
                                    disabled={inboundDetailCreationFormValues.Status === "Received"}
                                />
                            </div>
                            <div className='col-2'>

                            </div>
                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Packkey *</p>
                                {/*<Input value={inboundDetailCreationFormValues.PackKey || ""} name="PackKey" onChange={handleChange} style={{ width: '100%' }} disabled={true} />*/}
                                <DropDownList
                                    style={{
                                        width: "300px",
                                    }}
                                    data={packkeys}
                                    textField="packkey"
                                    filterable={true}
                                    onFilterChange={filterChange}
                                    value={inboundDetailCreationFormValues.PackKey}
                                    name='PackKey'
                                    onChange={handleChange}
                                    disabled={inboundDetailCreationFormValues.Status === "Received"}
                                />
                            </div>

                        </div>
                        

                        <div className='row' style={{ marginTop: '10px' }}>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Owner *</p>
                                <Input value={inboundDetailCreationFormValues.StorerKey || ""} disabled={true} name="StorerKey" onChange={handleChange} style={{ width: '100%' }} />
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Location *</p>
                                <Input value={inboundDetailCreationFormValues.ToLoc || ""} name="ToLoc" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>LPN *</p>
                                <Input value={inboundDetailCreationFormValues.ToId || ""} name="ToId" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>
                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Expected Qty *</p>
                                <NumericTextBox
                                    min="1"
                                    max="9999"
                                    name="QtyExpected"
                                    value={inboundDetailCreationFormValues.QtyExpected || ""}
                                    onChange={handleChange}
                                    disabled={inboundDetailCreationFormValues.Status === "Received"}
                                    spinners={false}
                                    format="n0"
                                />
                            </div>
                        </div>

                        <div className='row' style={{ marginTop: '10px' }}>
                           
                        
                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Gross Weight *</p>
                                <Input value={inboundDetailCreationFormValues.GrossWgt || ""} name="GrossWgt" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Net Weight *</p>
                                <Input value={inboundDetailCreationFormValues.NetWgt || ""} name="NetWgt" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Tare Weight *</p>
                                <Input value={inboundDetailCreationFormValues.TareWgt || ""} name="TareWgt" onChange={handleChange} style={{ width: '100%' }} disabled={true} />
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Received Qty Qty</p>
                                <NumericTextBox
                                    min="1"
                                    max="9999"
                                    name="QtyReceived"
                                    value={inboundDetailCreationFormValues.QtyReceived || ""}
                                    onChange={handleChange}
                                    disabled={inboundDetailCreationFormValues.Status === "Received"}
                                    spinners={false}
                                    format="n0"
                                />
                            </div>

                        </div>




                    </TabStripTab>
                    <TabStripTab title="Lottables">
                        <div className='row'>
                            <div className='col-2'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>External Lot</p>
                                <Input value={inboundDetailCreationFormValues.ExternalLot || ""} name="ExternalLot" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable01 *</p>
                                <Input value={inboundDetailCreationFormValues.Lottable01 || ""} name="Lottable01" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable07</p>
                                <Input value={inboundDetailCreationFormValues.Lottable07 || ""} name="Lottable07" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '10px' }}>
                            <div className='col-2'>

                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable02 *</p>
                                <Input value={inboundDetailCreationFormValues.Lottable02 || ""} name="Lottable02" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable08</p>
                                <Input value={inboundDetailCreationFormValues.Lottable08 || ""} name="Lottable08" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '10px' }}>
                            <div className='col-2'>
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable03 *</p>
                                <Input value={inboundDetailCreationFormValues.Lottable03 || ""} name="Lottable03" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable09</p>
                                <Input value={inboundDetailCreationFormValues.Lottable09 || ""} name="Lottable09" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                        </div>


                        <div className='row' style={{ marginTop: '10px' }}>
                            <div className='col-2'>
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Manufacture Date *</p>
                                <DatePicker
                                    name="Lottable04"
                                    Value={inboundDetailCreationFormValues.Lottable04 || ""}
                                    onChange={handleChange}
                                    format="dd/MMM/yyyy"
                                    weekNumber={true}
                                    width='100%'
                                    style={{ marginTop: '20px' }}
                                    disabled={inboundDetailCreationFormValues.Status === "Received"}
                                />
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable10</p>
                                <Input value={inboundDetailCreationFormValues.Lottable10 || ""} name="Lottable10" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '10px' }}>
                            <div className='col-2'>
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Expiration Date *</p>
                                <DatePicker
                                    name="Lottable05"
                                    Value={inboundDetailCreationFormValues.Lottable05 || ""}
                                    onChange={handleChange}
                                    format="dd/MMM/yyyy"
                                    weekNumber={true}
                                    width='100%'
                                    style={{ marginTop: '20px' }}
                                    disabled={inboundDetailCreationFormValues.Status === "Received"}
                                />
                            </div>

                            {/*<div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Deliver By Date *</p>
                                <DatePicker
                                    name="Lottable11"
                                    Value={inboundDetailCreationFormValues.Lottable11 || ""}
                                    onChange={handleChange}
                                    
                                    format="dd/MMM/yyyy"
                                    weekNumber={true}
                                    width='100%'
                                    style={{ marginTop: '20px' }}
                                />
                            </div>*/}

                        </div>


                        <div className='row' style={{ marginTop: '10px' }}>
                            <div className='col-2'>
                            </div>

                            <div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable06</p>
                                <Input value={inboundDetailCreationFormValues.Lottable06 || ""} name="Lottable06" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            {/*<div className='col-5'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Best By Date</p>
                                <DatePicker
                                       name="Lottable12"
                                       Value={inboundDetailCreationFormValues.Lottable12 || ""}
                                       onChange={handleChange}
                                    
                                    format="dd/MMM/yyyy"
                                    weekNumber={true}
                                    width='100%'
                                    style={{ marginTop: '20px' }}
                                />
                        </div>*/}

                        </div>

                    </TabStripTab>
                    <TabStripTab title="UDF's">
                        <div className='row'>
                            <div className='col-2'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF1</p>
                                <Input value={inboundDetailCreationFormValues.SUsr1 || ""} name="SUsr1" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-2'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF2</p>
                                <Input value={inboundDetailCreationFormValues.SUsr2 || ""} name="SUsr2" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-2'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF3</p>
                                <Input value={inboundDetailCreationFormValues.SUsr3 || ""} name="SUsr3" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-2'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF4</p>
                                <Input value={inboundDetailCreationFormValues.SUsr4 || ""} name="SUsr4" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>

                            <div className='col-2'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF5</p>
                                <Input value={inboundDetailCreationFormValues.SUsr5 || ""} name="SUsr5" onChange={handleChange} style={{ width: '100%' }} disabled={inboundDetailCreationFormValues.Status === "Received"} />
                            </div>
                        </div>


                    </TabStripTab>
                </TabStrip>
            </div>
        </>
    );
}

export default InboundDetailCreation;