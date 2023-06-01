import * as React from 'react';
import { useEffect, useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { useLocalization } from '@progress/kendo-react-intl';
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { putInboundHeader, getSingleReceiptHeader, savereceiptheader } from "../../../services/InboundService/InboundService";
import { useLocation, useNavigate } from "react-router-dom";
import { WithSnackbar } from "../../../components/form/Notification";
import Loader from "../../../components/Loader/Loader";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import countries from "../../../misc/countries.json";
import { getStorerkeys, getcodesc } from "../../../services/ConfigurationService/ConfigurationService";
import { Button } from "@progress/kendo-react-buttons";


const InboundHeaderCreation = () => {

    //variable declare
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let UserName = localStorage.getItem("UserName");

    let navigate = useNavigate()

    //Declare service
    const localizationService = useLocalization();
    const { state } = useLocation();
    // const  state  = useLocation();
    let dateinit = new Date()




    //Form using usestate
    const inboundCreation = {
        "ExternReceiptKey": "",
        "ExternalReceiptKey2": "",
        "StorerKey": Client,
        "RMA": "",
        "ProNumber": "",
        "CarrierPhone": "",
        "TrailerNumber": "",
        "TrailerOwner": "",
        "CarrierName": "",
        "SUsr1": null,
        "SUsr2": null,
        "SUsr3": null,
        "SUsr4": null,
        "SUsr5": null,
        "CarrierKey": "",
        "CarrierAddress1": "",
        "CarrierAddress2": "",
        "CarrierCity": "",
        "CarrierState": "",
        "CarrierZip": "",
        "CarrierReference": null,
        "WarehouseReference": "",
        "OriginCountry": null,
        "DestinationCountry": null,
        "ContainerKey": null,
        "Status": "0",
        "ContainerType": null,
        "ContainerQty": null,
        "TransportationMode": null,
        "Type": {
            "code": "1",
            "description": "Normal"
        },
        "AllowAutoReceipt": "0",
        "CarrierCountry": "",
        "DriverName": "",
        "AdviceNumber": null,
        "AdviceDate": "",
        "PackingSlipNumber": null,
        "SupplierName": "",
        "SupplierCode": "",
        "ShipFromAddressLine1": "",
        "ShipFromAddressLine2": "",
        "ShipFromAddressLine3": "",
        "ShipFromAddressLine4": "",
        "ShipFromAddressLine5": "",
        "ShipFromAddressLine6": "",
        "ShipFromCity": "",
        "ShipFromState": "",
        "ShipFromZip": "",
        "ShipFromPhone": "",
        "ShipFromContact": "",
        "ShipFromEmail": "",
        "ShipFromISOCountry": { "name": "India", "code": "IN" },
        "PlannedDeliveryDate": null,
        "AddWho": UserName,
        "EditWho": UserName,
        "Notes": "",
        "ProductionStatus": null
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

    const [inboundCreationFormValues, setInboundCreationFormValues] = useState(inboundCreation);
    // const receiptKey =  state && state.inboundDetail;
    const receiptKey = state && state.receiptKey;

    //Tab strip
    const [selected, setSelected] = React.useState(0);
    const handleSelect = (e) => {
        setSelected(e.selected);
    };

    const [loading, setLoading] = useState(false)

    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState();
    const [shipcodedialogvisible, setshipcodedialogvisible] = React.useState(false);
    const [carrierdialogvisible, setcarrierdialogvisible] = React.useState(false);
    const [dataState, setDataState] = React.useState(initialDataState);
    const [shipfromcodes, setshipfromcodes] = useState([]);
    const [carriercodes, setcarriercodes] = useState([]);
    const [rectype, setrectype] = useState([]);

    //functions

    // Loading function
    // useEffect(() => {

  
    // },[[token]])

    const toggleDialogshipcode = () => {
        if (!shipcodedialogvisible) {
            setLoading(true)
            getStorerkeys(token, "12").then((res => {
                setshipfromcodes(res)
                setLoading(false)
            }))
        }
        setshipcodedialogvisible(!shipcodedialogvisible);
    };

    const toggleDialogcarrier = () => {
        if (!carrierdialogvisible) {
            setLoading(true)
            getStorerkeys(token, "3").then((res => {
                setcarriercodes(res)
                setLoading(false)
            }))
        }
        setcarrierdialogvisible(!carrierdialogvisible);
    };

    useEffect(() => {
        debugger
        if(receiptKey){
            const s = getSingleReceiptHeader(receiptKey, token).then((res => {
                console.log(res)
                if (res.length === 1) {
                    console.log(2)
                    getcodesc(token, 'RECEIPTYPE').then((resp => {
                        console.log(resp,'resp')
                        if (resp) {
                            setrectype(resp)
                            let typeobj =  resp.find(obj => obj.code === res[0].Type)
                            let advdate = datestringconv(res[0].AdviceDate)
                            setInboundCreationFormValues({...res[0], Type : typeobj, AdviceDate : advdate});
                            console.log(res[0],'test')
                            console.log(inboundCreationFormValues)
                        }
                    }))
                }

            }))
        }
        else {
            getcodesc(token, 'RECEIPTYPE').then((res => {
                if (res) {
                    setrectype(res)
                }
            }))
        }

    },[token])

    const handleshiptoClick = (e) => {
        let shipfromcode = e.dataItem
        setInboundCreationFormValues({
            ...inboundCreationFormValues, ShipFromAddressLine1: shipfromcode.Address1, ShipFromAddressLine2: shipfromcode.Address2, ShipFromAddressLine3: shipfromcode.Address3,
            ShipFromAddressLine4: shipfromcode.Address4, ShipFromAddressLine5: shipfromcode.Address5, ShipFromAddressLine6: shipfromcode.Address6, SupplierName: shipfromcode.Company,
            SupplierCode: shipfromcode.StorerKey, ShipFromCity: shipfromcode.City, ShipFromZip: shipfromcode.Zip, ShipFromPhone: shipfromcode.Phone1, ShipFromEmail: shipfromcode.Email1,
            ShipFromContact: shipfromcode.Contact1, ShipFromState: shipfromcode.State
        })
        toggleDialogshipcode()
    }

    const handlecarrierClick = (e) => {
        let carriercode = e.dataItem
        setInboundCreationFormValues({
            ...inboundCreationFormValues, CarrierAddress1: carriercode.Address1, CarrierAddress2: carriercode.Address2, CarrierName: carriercode.Company,
            CarrierKey: carriercode.StorerKey, CarrierCity: carriercode.City, CarrierZip: carriercode.Zip, CarrierCountry: carriercode.Country, CarrierPhone: carriercode.Phone1, CarrierState : carriercode.State
        })
        toggleDialogcarrier()
    }

    //change in state
    const handleChange = (event) => {
        console.log(event);

        const name = event.target.name;
        const value = event.target.value;
        setInboundCreationFormValues({ ...inboundCreationFormValues, [name]: value })
  
    }

    const dateconv = (datobj) => {
        let timepart = datobj.toISOString().split('T')[1].split('.')[0]
        let daypart = ('0' + datobj.getDate().toString()).slice(-2);
        let monthpart = ('0' + (datobj.getMonth()+1).toString()).slice(-2);
        let yearpart = datobj.getFullYear().toString();
        let fulldatepart = monthpart + '/' + daypart + '/' + yearpart
        return fulldatepart + ' ' + timepart
    }

    const datestringconv = (datobj) => {
        return new Date(datobj)
    }



    const onSubmitCreate = () => {
        debugger
        setLoading(true);
        let finalobj = { ...inboundCreationFormValues }
        finalobj.Type = inboundCreationFormValues.Type.code
        if (inboundCreationFormValues.ShipFromISOCountry !== null) {
        finalobj.ShipFromISOCountry = inboundCreationFormValues.ShipFromISOCountry.code
        }
        if (inboundCreationFormValues.AdviceDate !== null && inboundCreationFormValues.AdviceDate !== "") {
            finalobj.AdviceDate = dateconv(inboundCreationFormValues.AdviceDate)
        }
        console.log(JSON.stringify(finalobj));

        var timeout;
        savereceiptheader(JSON.stringify([finalobj]), token).then(res => {
            if (res === "AdvancedShipNotice stored") {
                setopen(true);
                setmessage(receiptKey ? "Updated  Successfully" : "Created Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    setLoading(false);
                    navigate('/inbound')
                }, 2000);
            }
            else {

                setopen(true)
                setmessage(res)
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);

            }

        })
    setLoading(false);
    }

    return (
        <>
            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}

            {shipcodedialogvisible && (
                <Dialog title={"Please select a Ship code"} onClose={toggleDialogshipcode} className='dialoggrid'>
                    <Grid
                        onRowClick={handleshiptoClick}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        style={{
                            height: "450"
                        }}
                        data={process(shipfromcodes, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        
                        <Column field="StorerKey" title="Shipfromcode" filterable={false} />
                        <Column field="Company" title="Company" filterable={true} className="fw-bold" />
                    </Grid>
                </Dialog>
            )}
            {carrierdialogvisible && (
                <Dialog title={"Please select a carrier code"} onClose={toggleDialogcarrier} className='dialoggrid'>
                    <Grid
                        onRowClick={handlecarrierClick}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        style={{
                            height: "450"
                        }}
                        data={process(carriercodes, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        
                        <Column field="StorerKey" title="carrier" filterable={false} />
                        <Column field="Company" title="Company" filterable={true} className="fw-bold" />
                    </Grid>
                </Dialog>
            )}
            <div id="Planning" className="inboundHeaderCreation-page main-content">
                <div className='row' style={{justifyContent: "center"}}>
                <WithSnackbar open={open} message={message} severity={severity}  />
                </div>
                <Button  className='text-uppercase br-round' onClick={() => {
                                navigate('/inbound');
                        }} >Back</Button>
                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-3'>
                        {receiptKey ? (
                            <h3 className='fw-bold text-uppercase'>{Client} - {localizationService.toLanguageString('custom.ASNUpdate')}{receiptKey}</h3>

                        ) : (
                            <h3 className='fw-bold text-uppercase'>{Client} - {localizationService.toLanguageString('custom.ASNCreation')}</h3>

                        )}
                        {/* <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.ASNCreation')}</h3> */}
                    </div>
                    <div className='position-relative pe-3'>
                    {inboundCreationFormValues.Status !== "9" && (<Button  className='text-uppercase br-round' onClick={onSubmitCreate} >{inboundCreationFormValues.ReceiptKey ? (<span>Update</span> ): ( <span>Create</span>)}</Button>)}
                    <Button  className='text-uppercase br-round'onClick={() => {
                                setInboundCreationFormValues(inboundCreation);
                                if(receiptKey !== null)
                                    receiptKey = null;
                            }} >Clear</Button>
                  



                        {/* <ul className='header-buttons'>
                        {inboundCreationFormValues.Status !== "9" && (<li className='text-uppercase br-round-left active' onClick={onSubmitCreate}>{inboundCreationFormValues.ReceiptKey ? (<span>Update</span> ): ( <span>Create</span>)}</li>)}

                  
                            <li className='text-uppercase active' onClick={() => {
                                setInboundCreationFormValues(inboundCreation);
                                if(receiptKey !== null)
                                    receiptKey = null;
                            }}>Clear</li>
                            <li className='text-uppercase br-round active' onClick={() => {
                                navigate('/inbound');
                        }}>Back</li>
                        </ul> */}
                    </div>
                </div>



                <TabStrip selected={selected} onSelect={handleSelect} style={{ margin: '10px' }}>
                    <TabStripTab title="ASN/Receipts">


                        <div className='row'>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Receipt Status</p>
                                <Input value="New" style={{ width: '100%' }} disabled={true} />
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Owner</p>
                                <Input value={inboundCreationFormValues.StorerKey || ""} name="StorerKey" onChange={handleChange} style={{ width: '100%' }} disabled={true} />
                            </div>


                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Type</p>
                                <ComboBox
                                    style={{
                                        width: '100%',
                                    }}
                                    data={rectype}
                                    textField="description"
                                    dataItemKey="code"
                                    value={inboundCreationFormValues.Type || ""}
                                    onChange={handleChange}
                                    name="Type"
                                    disabled={inboundCreationFormValues.Status === "9"}
                                //  defaultValue="Type"
                                />
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>External ASN</p>
                                <Input label="" value={inboundCreationFormValues.ExternReceiptKey || ""} name="ExternReceiptKey" onChange={handleChange} style={{ width: '100%' }} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                        </div>

                        {/*<div className='row' style={{ marginTop: '5px' }}>


                           <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Closed Date</p>
                                <DatePicker
                                    name="CLOSEDDATE"
                                    Value={inboundCreationFormValues.CLOSEDDATE || null}
                                    onChange={handleChange}
                                    format="dd/MMM/yyyy"
                                    weekNumber={true}
                                    width='100%'
                                    style={{ marginTop: '20px' }}
                                    disabled={true}
                                />

                            </div>




                        </div>*/}

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Vendor reference</p>
                                <Input value={inboundCreationFormValues.ExternalReceiptKey2 || ""} name="ExternalReceiptKey2" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Advice Date</p>
                                <DatePicker
                                    // defaultValue={value}
                                    format="dd/MMM/yyyy"
                                    weekNumber={true}
                                    width='100%'
                                    style={{ marginTop: '20px' }}
                                    onChange={handleChange}
                                    name='AdviceDate'
                                    value={inboundCreationFormValues.AdviceDate}
                                    disabled={inboundCreationFormValues.Status === "9"}
                                />
                            </div>
                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Warehouse reference</p>

                                <Input value={inboundCreationFormValues.WarehouseReference || ""} name="WarehouseReference" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Trailer number</p>

                                <Input value={inboundCreationFormValues.TrailerNumber || ""} name="TrailerNumber" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>


                        </div>

                        <div className='row'>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>RMA</p>

                                <Input value={inboundCreationFormValues.RMA || ""} name="RMA" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>
                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Pro Number</p>

                                <Input value={inboundCreationFormValues.ProNumber || ""} name="ProNumber" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF1</p>

                                <Input value={inboundCreationFormValues.SUsr1 || ""} name="SUsr1" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>
                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF2</p>

                                <Input value={inboundCreationFormValues.SUsr2 || ""} name="SUsr2" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>


                        </div>
                        <div className='row'>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF3</p>

                                <Input value={inboundCreationFormValues.SUsr3 || ""} name="SUsr3" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>
                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF4</p>

                                <Input value={inboundCreationFormValues.SUsr4 || ""} name="SUsr4" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UDF5</p>

                                <Input value={inboundCreationFormValues.SUsr5 || ""} name="SUsr5" style={{ width: '100%' }} onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>



                        </div>




                    </TabStripTab>
                    <TabStripTab title="Ship from">
                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship code</p>
                                <Input style={{ width: '80%' }}  readOnly value={inboundCreationFormValues.SupplierCode} disabled={inboundCreationFormValues.Status === "9"}/>
                                <span class="k-icon k-i-zoom-in"  onClick={toggleDialogshipcode} style={{ marginLeft: "10px",cursor : "pointer" }}></span>
                            </div>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship from name</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.SupplierName} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship Address 1</p>
                                <Input style={{ width: '100%' }}  readOnly value={inboundCreationFormValues.ShipFromAddressLine1} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship Address 2</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromAddressLine2} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                        </div>

                        <div className='row'>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship Address 3</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromAddressLine3} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship Address 4</p>

                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromAddressLine4} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>City</p>

                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromCity} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>State</p>

                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromState} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Zip</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromZip} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Country code</p>
                                <ComboBox
                                    style={{
                                        width: '100%',
                                    }}
                                    data={countries}
                                    textField="name"
                                    dataItemKey="code"
                                    value={inboundCreationFormValues.ShipFromISOCountry || ""}
                                    onChange={handleChange}
                                    name="ShipFromISOCountry"
                                    disabled={inboundCreationFormValues.Status === "9"}
                                //  defaultValue="Type"
                                />
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Contact</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromContact} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Email</p>

                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromEmail} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Phone</p>

                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.ShipFromPhone} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>


                        </div>

                    </TabStripTab>
                    <TabStripTab title="Carrier">

                        <div className='row'>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Carrier code</p>
                                <Input style={{ width: '80%' }} readOnly value={inboundCreationFormValues.CarrierKey} disabled={inboundCreationFormValues.Status === "9"}/>
                                <span class="k-icon k-i-zoom-in" readOnly onClick={toggleDialogcarrier} style={{ marginLeft: "10px",cursor : "pointer" }}></span>
                            </div>
                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Carrier Name</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.CarrierName} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>


                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Driver Name</p>
                                <Input style={{ width: '100%' }}  value={inboundCreationFormValues.DriverName} onChange={handleChange} name='DriverName' disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>
                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Carrier reference</p>
                                <Input style={{ width: '100%' }} value={inboundCreationFormValues.CarrierReference} name='CarrierReference' onChange={handleChange} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>


                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 1</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.CarrierAddress1} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Trailer number</p>
                                <Input style={{ width: '100%' }} value={inboundCreationFormValues.TrailerNumber} name='TrailerNumber' onChange={handleChange} />
                            </div>



                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 2</p>
                                <Input style={{ width: '100%' }}  readOnly value={inboundCreationFormValues.CarrierAddress2} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>


                            <div className='col-3'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>City</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.CarrierCity} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Trailer owner</p>
                                <Input style={{ width: '100%' }} value={inboundCreationFormValues.TrailerOwner} onChange={handleChange} name='TrailerOwner' disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>


                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>State</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.CarrierState} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Country</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.CarrierCountry} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>


                            {/*<div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Door</p>
                                <Input style={{ width: '100%' }} />
                                </div>*/}



                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Zip</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.CarrierZip} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Phone</p>
                                <Input style={{ width: '100%' }} readOnly value={inboundCreationFormValues.CarrierPhone} disabled={inboundCreationFormValues.Status === "9"}/>
                            </div>



                        </div>



                    </TabStripTab>
                </TabStrip>
            </div>
        </>
    )
}
export default InboundHeaderCreation;