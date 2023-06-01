import * as React from 'react';

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { useLocalization } from '@progress/kendo-react-intl';
import { Input } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { getStorerkeys } from "../../../services/OutboundService/outboundService"
import { process } from "@progress/kendo-data-query";
import {OrderCreate} from "../../../services/OutboundService/outboundService";
import {getLocFieldValue} from "../../../services/ConfigurationService/ConfigurationService";

const OrderCreation = () => {

    const OrderHeaderValues = {
        WHSEID: "wmwhse3",
        typedescr: "Standard Order",
        StorerKey: localStorage.getItem("Client"),
        ExternOrderKey: "",
        OrderDate: "10/10/2022 11:00:00",
        PRIORITY: "5",
        CONSIGNEEKEY: "",
        C_Contact1: null,
        C_Contact2: null,
        C_Company: "",
        C_Address1: null,
        C_Address2: null,
        C_Address3: null,
        C_Address4: null,
        C_Address5: null,
        C_Address6: null,
        C_City: null,
        C_State: null,
        C_Zip: null,
        C_COUNTRY: null,
        C_ISOCNTRYCODE: null,
        C_PHONE1: null,
        C_Email1: "",
        C_PHONE2: null,
        C_FAX1: null,
        C_FAX2: null,
        C_VAT: null,
        BUYERPO: null,
        BILLTOKEY: "",
        B_CONTACT1: null,
        B_CONTACT2: null,
        B_COMPANY: null,
        B_ADDRESS1: null,
        B_ADDRESS2: null,
        B_ADDRESS3: null,
        B_ADDRESS4: null,
        B_CITY: null,
        B_STATE: null,
        B_ZIP: null,
        B_COUNTRY: null,
        B_ISOCNTRYCODE: null,
        B_PHONE1: null,
        B_PHONE2: null,
        B_FAX1: null,
        B_FAX2: null,
        B_VAT: null,
        INCOTERM: null,
        PMTTERM: null,
        SORTATIONLOCATION: null,
        BATCHFLAG: "0",
        BULKCARTONGROUP: null,
        ROUTE: "",
        STOP: 0,
        OpenQty: 0,
        Status: "17",
        DISCHARGEPLACE: null,
        DELIVERYPLACE: null,
        INTERMODALVEHICLE: "",
        COUNTRYOFORIGIN: null,
        COUNTRYDESTINATION: null,
        UPDATESOURCE: "0",
        TYPE: "0",
        ORDERGROUP: "",
        EFFECTIVEDATE: "0001-01-01T00:00:00",
        STAGE: "",
        DC_ID: "",
        WHSE_ID: "",
        SPLIT_ORDERS: "0",
        APPT_STATUS: null,
        CHEPPALLETINDICATOR: null,
        CONTAINERTYPE: null,
        CONTAINERQTY: 0,
        BILLEDCONTAINERQTY: 0,
        TRANSPORTATIONMODE: null,
        TransportationService: "UPS",
        ExternalOrderKey2: null,
        C_EMAIL1: null,
        C_EMAIL2: null,
        SUsr1: null,
        SUsr2: null,
        SUsr3: null,
        SUsr4: null,
        SUsr5: null,
        NOTES2: null,
        ITEM_NUMBER: 0,
        FORTE_FLAG: "I",
        LOADID: null,
        SHIPTOGETHER: "N",
        ORDERVALUE: 0,
        OHTYPE: "1",
        ExternalLoadId: "PL2829292",
        DESTINATIONNESTID: 0,
        REFERENCENUM: null,
        INTRANSITKEY: null,
        RECEIPTKEY: null,
        CaseLabelType: null,
        LABELNAME: null,
        STDSSCCLABELNAME: null,
        STDGTINLABELNAME: null,
        RFIDSSCCLABELNAME: null,
        RFIDGTINLABELNAME: null,
        RFIDFLAG: "0",
        CarrierCode: "",
        CarrierName: "",
        CarrierAddress1: null,
        CarrierAddress2: null,
        CarrierCity: null,
        CarrierState: null,
        CarrierZip: null,
        CarrierCountry: null,
        CarrierPhone: "9018",
        DriverName: null,
        TrailerNumber: "",
        TrailerOwner: "ssss",
        TrailerType: null,
        ORDERBREAK: "0",
        ALLOCATEDONERP: "0",
        TRADINGPARTNER: null,
        ProNumber: "09HDHHFH",
        ENABLEPACKING: "0",
        PACKINGLOCATION: " ",
        ORDERSID: null,
        SUSPENDEDINDICATOR: "0",
        PICKLISTREPORTID: null,
        PACKINGLISTREPORTID: null,
        SOURCEVERSION: null,
        REFERENCETYPE: null,
        REFERENCEDOCUMENT: null,
        REFERENCELOCATION: null,
        REFERENCEVERSION: null,
        FREIGHTCHARGEAMOUNT: 0,
        FREIGHTCOSTAMOUNT: 0,
        APPOINTMENTKEY: null,
        AllowOverPick: 0,
        TOTALQTY: 3,
        TOTALGROSSWGT: 0,
        TOTALCUBE: "0",
        TOTALORDERLINES: 1,
        ReferenceAccountingEntity: null,
        POKEY: null,
        APPORTION: null,
        CONTAINERID: null,
        CARRIERROUTEDOCUMENT: null,
        CARRIERROUTEACCOUNTINGENTITY: null,
        CARRIERROUTELOCATION: null,
        CARRIERROUTEVERSION: null,
        TMHOUSEAIRWAYBILLNUMBER: null,
        TMMASTERAIRWAYBILLNUMBER: null,
        TMBOOKINGNUMBER: null,
        TMHOUSEOCEANBOLNUMBER: null,
        TMMASTEROCEANBOLNUMBER: null,
        TMEQUIPMENTNUMBER: null,
        TMSEALNUMBER: null,
        TMLICENSEPLATENUMBER: null,
        TMEQUIPMENTTYPE: null,
        TMEQUIPMENTLENGTH: null,
        TMEQUIPMENTATTRIBUTE: null,
        TMAIRSERVICELEVEL: null,
        TMOCEANSERVICELEVEL: null,
        TMOCEANTARIFFSERVICE: null,
        TMPORTOFLOADING: null,
        TMPORTOFDISCHARGE: null,
        TMROUTEDVIA: null,
        TMSERVICEATTRIBUTE: null,
        TMFREIGHTCOSTCURRENCY: null,
        TMFREIGHTCHARGECURRENCY: null,
        C_ADDRESS5: null,
        C_ADDRESS6: null,
        B_ADDRESS5: null,
        B_ADDRESS6: null,
        RETURNTOPARTY: null,
        TRAILERKEY: null,
        CARRIERROUTESTATUS: null,
        SPLITSHIPMENTINDICATOR: null,
        SPLITSHIPMENTORIGINALORDERKEY: null,
        SPLITSHIPMENTFINALSHIPMENT: null,
        BODAPPLICATIONAREA: null,
        FREIGHTCOSTBASEAMOUNT: 0,
        FREIGHTCHARGEBASEAMOUNT: 0,
        PACKINGVALTEMPLATE: null,
        PACKNOTES: null,
        TOTALROUTES: 0,
        AUTODOORASSIGNED: null,
        AUTOSTAGEASSIGNED: null,
        AUTOPACKASSIGNED: null,
        AUTODOCKASSIGNEDHOW: null,
        AUTODOCKASSIGNEDSET: null,
        AUTODOCKASSIGNEDSTEP: 0,
        TOTALPALLETESTIMATE: 0,
        REQUIREORDERCLOSE: null,
        NOTES: null,
        SPSAPISTRATEGYKEY: null,
        BOLNUMBER: null,
        BOLPRINTED: null,
        SHIPTOGROUP: null



    }
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

    const { state } = useLocation()
    const OrderHeader = state && state.orderkey;
    const OrderKeyValue = state.key;
    
    const Action = state && state.maction;
    // const receiptdetail = state && state.receiptKey
    // const lineno = state && state.lineno
    // const Action = state && state.maction
    const localizationService = useLocalization();
    let navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const [orderHeaderForm, setorderHeaderForm] = useState(OrderHeaderValues)
    const [carrierdialogvisible, setcarrierdialogvisible] = React.useState(false);
    const [shiptoDialogvisible, setshiptoDialogvisible] = React.useState(false);

    const [CarrierTable, setCarrierTable] = useState([]);
    const [ShiptoTable, setShiptoTable] = useState([]);
    const [OrderType, setOrderType] = useState([]);
    const [transpotatioMode, setTranspotatioMode] = useState([]);
    const [Priority,setPriority] = useState([]);
    const [dataState, setDataState] = useState(initialDataState)

    let token = localStorage.getItem("selfToken");
    const [selected, setSelected] = React.useState(0);
    const handleSelect = (e) => {
        setSelected(e.selected);
    };

    const handleChange = (event) => {
        console.log(event);

        const name = event.target.name;
        const value = event.target.value;
        setorderHeaderForm({ ...orderHeaderForm, [name]: value })

    }
    const toggleDialogcarrier = () => {
        debugger
        if (!carrierdialogvisible) {

            setLoading(true)

            getStorerkeys(token, "12").then((res => {

                console.log(res);

                setCarrierTable(res);

                setLoading(false)
                setcarrierdialogvisible(!carrierdialogvisible);


            }))

        }


    };

    const toogleDialogShipCode = () => {
        debugger
        if (!shiptoDialogvisible) {

            setLoading(true)

            getStorerkeys(token, "2").then((res => {

                console.log(res);

                setShiptoTable(res);

                setLoading(false)
                setshiptoDialogvisible(!shiptoDialogvisible);


            }))

        }


    };

    useEffect(async () => {

        // setLoading(true)
        console.log(OrderHeader);
        if(Action === "2"){
            setorderHeaderForm(OrderHeader);
        }
        DropDownValues();
        // setLoading(false)
    }, [token])
    
    const DropDownValues = () =>{

        getLocFieldValue(token,"ORDERTYPE").then(res =>{
            console.log(res);
            setOrderType(res);
            if(Action === "2"){
                debugger
               
                   var OrderType = res.find(obj => obj.code === OrderHeader.TYPE)
                   orderHeaderForm.TYPE = OrderType
                  
               
            }
        })

        getLocFieldValue(token,"TRANSPMODE").then(res =>{
            console.log(res);
            setTranspotatioMode(res);
            if(Action === "2"){
                debugger
               
                   var TRANSPORTATIONMODE = res.find(obj => obj.code === OrderHeader.TRANSPORTATIONMODE)
                   orderHeaderForm.TRANSPORTATIONMODE = TRANSPORTATIONMODE
                  
               
            }
        })

        getLocFieldValue(token,"PRIORITY").then(res =>{
            console.log(res);
            setPriority(res);
            if(Action === "2"){
                debugger
                   var priority = res.find(obj => obj.code === OrderHeader.PRIORITY)
                   orderHeaderForm.PRIORITY = priority
                  
               
            }
        })
    }
    const toogleCarrierClose = () => {
        setcarrierdialogvisible(!carrierdialogvisible);
    }
    const toogleShiptoClose = () => {
        setshiptoDialogvisible(!shiptoDialogvisible);
    }

    function isObject(o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }

    function isPlainObject(o) {
        var ctor, prot;

        if (isObject(o) === false) return false;

        // If has modified constructor
        ctor = o.constructor;
        if (ctor === undefined) return true;

        // If has modified prototype
        prot = ctor.prototype;
        if (isObject(prot) === false) return false;

        // If constructor does not have an Object-specific method
        if (prot.hasOwnProperty('isPrototypeOf') === false) {
            return false;
        }

        // Most likely a plain Object
        return true;
    };
    const onSubmit =()=>{
        
        console.log(orderHeaderForm);
        if((orderHeaderForm.ExternOrderKey !== "") && (orderHeaderForm.TYPE !=="") && (orderHeaderForm.CONSIGNEEKEY !=="") && (orderHeaderForm.CarrierCode !== "")){
            let finalobj = { ...orderHeaderForm }
            debugger
            finalobj.TYPE = isPlainObject(orderHeaderForm.TYPE) ? orderHeaderForm.TYPE.code : orderHeaderForm.TYPE
            finalobj.TRANSPORTATIONMODE= isPlainObject(orderHeaderForm.TRANSPORTATIONMODE) ? orderHeaderForm.TRANSPORTATIONMODE.code : orderHeaderForm.TRANSPORTATIONMODE
            finalobj.PRIORITY = isPlainObject(orderHeaderForm.PRIORITY) ? orderHeaderForm.PRIORITY.code : orderHeaderForm.PRIORITY
            // finalobj.LocationHandling = isPlainObject(LocationForm.LocationHandling) ? LocationForm.LocationHandling.code : LocationForm.LocationHandling
            OrderCreate("[" + JSON.stringify(finalobj) + "]",token).then(res=>{
                console.log(res);
                if(res === "Successfully posted to WMS"){
                    var timeout;
                    setLoading(false);
                    
        
                        setopen(true);
                    if(Action === "2"){
                        setmessage("Order Header Update Succesfully")
                    }
                    else{
                        setmessage("Order Header Created Succesfully")
                    }
        
                      
                        setseverity("success")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                        setorderHeaderForm(OrderHeaderValues);
                }
                else{
                    var timeout;
                    setLoading(false);
                    
        
                        setopen(true);
                    
                            setmessage(res)
        
                      
                        setseverity("error")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                }
            })
        }
        else{
            var timeout;

            setopen(true);
                setmessage("Please fill mandatory fields")
    
            setseverity("error")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }

    }

    return (
        <>

            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">

                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>
                <Button className='text-uppercase br-round-right active' type='button' fillMode="solid" onClick={()=>{
                    navigate('/Outbound');
                }}>Back</Button>

                <div className="d-flex mt-3 justify-content-between">
                    <div className='ps-3'>
                        {OrderKeyValue ?(<h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.OrderCreation')}  {OrderKeyValue}</h3>):
                        (<h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.OrderCreation')}</h3>)}
                        


                        {/* <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.ASNCreation')}</h3> */}
                    </div>

                    {/* <div className='position-relative pe-4'>
                        <ul className='header-buttons'>


                       
                            <Button className='text-uppercase br-round-left active' type="button" onClick={onSubmit} fillMode="solid" style={{ width: '100px', backgroundColor: 'green', color: 'white', fontWeight: "bold" }}>Create</Button>
                            <Button className='text-uppercase br-round-right active' type='button' fillMode="solid" style={{ width: '100px', backgroundColor: 'Red', color: 'white', fontWeight: "bold" }}>Clear</Button>

                  
                        </ul>
                    </div> */}
                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            <li className='text-uppercase br-round-left active' onClick={onSubmit}>Create</li>
                            <li className='text-uppercase br-round-right active'>Clear</li>

                        </ul>
                    </div>
                </div>
            </div>

            <TabStrip selected={selected} onSelect={handleSelect} style={{ margin: '10px' }}>
                <TabStripTab title="Header">


                    <div className='row'>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Order Type *</p>
                            <DropDownList
                                style={{
                                    width: '100%',
                                }}
                                value={orderHeaderForm.TYPE}
                                name="TYPE"
                                onChange={handleChange}
                                textField="description"
                                        dataItemKey="code"
                                data={OrderType}
                            //  defaultValue="Type"
                            />
                        </div>

                        <div className='col-4' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Status</p>
                            <Input name="Status" value="Created Internally" readOnly style={{ width: '100%' }} />
                        </div>



                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Load ID</p>
                            <Input name="LOADID" value={orderHeaderForm.LOADID} onChange={handleChange} style={{ width: '100%' }} />

                        </div>





                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-4' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Owner</p>
                            <Input value={orderHeaderForm.StorerKey || ""} readOnly name="StorerKey" style={{ width: '100%' }} />
                        </div>

                        <div className='col-4' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>External Order *</p>
                            {Action === "2" ?(<Input name="ExternOrderKey" value={orderHeaderForm.ExternOrderKey || ""} readOnly  onChange={handleChange} style={{ width: '100%' }} />
):(<Input name="ExternOrderKey" value={orderHeaderForm.ExternOrderKey || ""}  onChange={handleChange} style={{ width: '100%' }} />
)}
                        </div>



                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Trailer Number</p>

                            <Input value={orderHeaderForm.TrailerNumber || ""} onChange={handleChange} name="TrailerNumber" style={{ width: '100%' }} />


                        </div>







                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Priority *</p>
                            <DropDownList
                                style={{
                                    width: '100%',
                                }}
                                value={orderHeaderForm.PRIORITY || ""}
                                name="PRIORITY"
                                onChange={handleChange}
                                data={Priority}
                                textField="description"
                                        dataItemKey="code"
                            //  defaultValue="Type"
                            />
                        </div>
                        <div className='col-4' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Transportation Mode</p>
                            <DropDownList
                                style={{
                                    width: '100%',
                                }}
                                onChange={handleChange}
                                value={orderHeaderForm.TRANSPORTATIONMODE || ""}
                                name="TRANSPORTATIONMODE"
                                data={transpotatioMode} 
                                textField="description"
                                        dataItemKey="code"/>

                        </div>
                    </div>

                    <div className='row'>



                        <div className='col-4' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Total Ordered</p>
                            <Input name="TOTALCUBE" onChange={handleChange} value={orderHeaderForm.TOTALCUBE} style={{ width: '100%' }} />
                        </div>
                    </div>
                </TabStripTab>
                <TabStripTab title="Ship">
                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship code *</p>
                            <Input style={{ width: '100%' }} onClick={toogleDialogShipCode} readOnly value={orderHeaderForm.CONSIGNEEKEY} name="CONSIGNEEKEY" />
                        </div>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship from name</p>
                            <Input style={{ width: '100%' }}  value={orderHeaderForm.C_Company} readOnly name="C_Company" onChange={handleChange} />
                        </div>

                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }} >Ship Address 1</p>
                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_Address1} readOnly name="C_Address1" onChange={handleChange} />
                        </div>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }} >Ship Address 2</p>
                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_Address2} readOnly name="C_Address2" onChange={handleChange} />
                        </div>

                    </div>

                    <div className='row'>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship Address 3</p>
                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_Address3} readOnly name="C_Address3" onChange={handleChange} />
                        </div>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship Address 4</p>

                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_Address4} readOnly name="C_Address4" onChange={handleChange} />
                        </div>

                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>City</p>

                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_City} readOnly name="C_City" onChange={handleChange} />
                        </div>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>State</p>

                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_State} readOnly name="C_State" onChange={handleChange} />
                        </div>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Zip</p>
                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_Zip} readOnly name="C_Zip" onChange={handleChange} />
                        </div>

                        <div className='col-3'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Country code</p>
                     
                          <Input style={{ width: '100%' }} value={orderHeaderForm.C_COUNTRY} name="C_COUNTRY" onChange={handleChange} />

                        </div>

                    </div>


                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Contact</p>
                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_Contact1} name="C_Contact1" onChange={handleChange} />
                        </div>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Email</p>

                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_Email1} name="C_Email1" onChange={handleChange} />
                        </div>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Phone</p>

                            <Input style={{ width: '100%' }} value={orderHeaderForm.C_PHONE1} name="C_PHONE1" onChange={handleChange} />
                        </div>


                    </div>

                </TabStripTab>
                <TabStripTab title="Carrier">
                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Carrier code *</p>
                            <Input style={{ width: '100%' }}  readOnly value={orderHeaderForm.CarrierCode} onClick={toggleDialogcarrier} />
                        </div>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Carrier name *</p>
                            <Input style={{ width: '100%' }} readOnly value={orderHeaderForm.CarrierName || ""} />
                        </div>

                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Carrier Address 1</p>
                            <Input style={{ width: '100%' }} readOnly value={orderHeaderForm.CarrierAddress1 || ""} />
                        </div>

                        <div className='col-6' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Carrier Address 2</p>
                            <Input style={{ width: '100%' }} readOnly value={orderHeaderForm.CarrierAddress2 || ""} />
                        </div>

                    </div>



                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>City</p>

                            <Input style={{ width: '100%' }} readOnly value={orderHeaderForm.CarrierCity || ""} />
                        </div>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>State</p>

                            <Input style={{ width: '100%' }} readOnly value={orderHeaderForm.CarrierState || ""} />
                        </div>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Zip</p>
                            <Input style={{ width: '100%' }} readOnly value={orderHeaderForm.CarrierZip || ""} />
                        </div>

                        <div className='col-3'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Country</p>
                            <Input style={{ width: '100%' }} readOnly value={orderHeaderForm.CarrierCountry || ""} />

                        </div>

                    </div>
                </TabStripTab>


            </TabStrip>

            {carrierdialogvisible && (

                <Dialog title={"Please select a carrier code"} width="50%" onClose={toogleCarrierClose}>

                    <Grid

                        pageable={true}

                        sortable={true}

                        filterable={true}



                        data={process(CarrierTable, dataState)}

                        {...dataState}

                        onDataStateChange={(e) => {

                            setDataState(e.dataState);

                        }}
                        onRowClick={(event) => {
                            console.log(event);
                            orderHeaderForm.CarrierCode = event.dataItem.StorerKey;
                            orderHeaderForm.CarrierName = event.dataItem.Company;
                            orderHeaderForm.CarrierAddress1 = event.dataItem.Address1;
                            orderHeaderForm.CarrierAddress2 = event.dataItem.Address2;
                            orderHeaderForm.CarrierCity = event.dataItem.City;
                            orderHeaderForm.CarrierState = event.dataItem.State;
                            orderHeaderForm.CarrierZip = event.dataItem.Zip;
                            orderHeaderForm.CarrierCountry = event.dataItem.Country;

                            toogleCarrierClose();
                        }}

                    >
                        <Column style={{ cursor: "pointer" }} field="StorerKey" title="carrier" filterable={true} />

                        <Column field="Company" style={{ cursor: "pointer" }} title="Company" filterable={true} className="fw-bold" />

                    </Grid>

                </Dialog>

            )}

{shiptoDialogvisible && (

<Dialog title={"Please select a Ship to"} width="50%" onClose={toogleShiptoClose}>

    <Grid

        pageable={true}

        sortable={true}

        filterable={true}



        data={process(ShiptoTable, dataState)}

        {...dataState}

        onDataStateChange={(e) => {

            setDataState(e.dataState);

        }}
        onRowClick={(event) => {
            console.log(event);
            orderHeaderForm.CONSIGNEEKEY = event.dataItem.StorerKey;
            orderHeaderForm.C_Company = event.dataItem.Company;
            orderHeaderForm.C_Address1 = event.dataItem.Address1;
            orderHeaderForm.C_Address1 = event.dataItem.Address2;
            orderHeaderForm.C_Address3 = event.dataItem.C_Address3;
            orderHeaderForm.C_Address4 = event.dataItem.C_Address4;
            orderHeaderForm.C_City = event.dataItem.City;
            orderHeaderForm.C_State = event.dataItem.State;
            orderHeaderForm.C_Zip = event.dataItem.Zip;
            orderHeaderForm.C_Country = event.dataItem.Country;
            orderHeaderForm.C_Contact1 = event.dataItem.Contact1;
            orderHeaderForm.C_Email1 = event.dataItem.C_Email1;
            orderHeaderForm.C_PHONE1 = event.dataItem.Phone1;



            toogleShiptoClose();
        }}

    >
        <Column style={{ cursor: "pointer" }} field="StorerKey" title="Ship To" filterable={true} />

        <Column field="Company" style={{ cursor: "pointer" }} title="Ship From Name" filterable={true} className="fw-bold" />
        <Column field="Country" style={{ cursor: "pointer" }} title="Country" filterable={true} className="fw-bold" />


                    </Grid>

                </Dialog>

            )}
           
        </>
    );
}

export default OrderCreation;