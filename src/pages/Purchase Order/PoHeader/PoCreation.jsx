import * as React from 'react';
import { useState, useEffect } from 'react';
import Loader from "../../../components/Loader/Loader";
import { useLocalization } from '@progress/kendo-react-intl';
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { Button } from "@progress/kendo-react-buttons";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { getLocFieldValue } from "../../../services/ConfigurationService/ConfigurationService";
import { PutPoCreate } from "../../../services/PoService/PoService";
import moment from 'moment';
import { useLocation, useNavigate } from "react-router-dom";
import { getStorerkeys, getcodesc } from "../../../services/ConfigurationService/ConfigurationService";
import { Dialog } from "@progress/kendo-react-dialogs";
import {
    Card
} from "@progress/kendo-react-layout";

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


const PoHeaderCreation = () => {

    const poHeader = {
        StorerKey: localStorage.getItem("Client"),
        ExternPOKey: "",
        statusdescr: "New",
        Status: '0',
        POType: "0",
        PODate: "",
        SellersReference: "",
        BuyersReference: "",
        BuyerName: "",
        BuyerAddress1: "",
        BuyerAddress2: "",
        BuyerAddress3: "",
        BuyerAddress3: "",
        BuyerAddress4: "",
        BuyerCity: "",
        BuyerState: "",
        BuyerZip: "",
        SellerName: "",
        SellerAddress1: "",
        SellerAddress2: "",
        SellerAddress3: "",
        SellerAddress4: "",
        SellerCity: "",
        SellerState: "",
        SellerZip: "",


    }
    const { state } = useLocation()

    let token = localStorage.getItem("selfToken");
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const localizationService = useLocalization();
    // const [dataState, setDataState] = React.useState(initialDataState);
    const [poHeadeForm, setpoHeadeForm] = useState(poHeader);
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("");
    const [severity, setseverity] = useState("");
    const [selected, setSelected] = React.useState(0);
    const [poType, setPoType] = useState([]);
    const [clear, setclear] = useState(true)
    const [suppliercodes, setsuppliercodes] = useState([]);
    const [supplierdialogvisible, setsupplierdialogvisible] = useState(false);
    const [dataState, setDataState] = useState(initialDataState);
    const PoHeaderValueUpdate = state && state.poHeader;
    const Action = state && state.maction;
    const handleSelect = (e) => {
        setSelected(e.selected);
    };

    useEffect(async () => {
        debugger //POKey
        console.log(Action);
        console.log(PoHeaderValueUpdate);
        if (Action === "2") {
            const temp = {
                PODate: new Date(PoHeaderValueUpdate.PODate),

                StorerKey: PoHeaderValueUpdate.StorerKey,
                ExternPOKey: PoHeaderValueUpdate.ExternPOKey,
                Status: PoHeaderValueUpdate.Status,
                statusdescr: PoHeaderValueUpdate.statusdescr,
                POType: PoHeaderValueUpdate.POType,
                SellersReference: PoHeaderValueUpdate.SellersReference,
                BuyersReference: PoHeaderValueUpdate.BuyersReference,
                BuyerName: PoHeaderValueUpdate.BuyerName,
                BuyerAddress1: PoHeaderValueUpdate.BuyerAddress1,
                BuyerAddress2: PoHeaderValueUpdate.BuyerAddress2,
                BuyerAddress3: PoHeaderValueUpdate.BuyerAddress3,
                BuyerAddress3: PoHeaderValueUpdate.BuyerAddress3,
                BuyerAddress4: PoHeaderValueUpdate.BuyerAddress4,
                BuyerCity: PoHeaderValueUpdate.BuyerCity,
                BuyerState: PoHeaderValueUpdate.BuyerState,
                BuyerZip: PoHeaderValueUpdate.BuyerZip,
                SellerName: PoHeaderValueUpdate.SellerName,
                SellerAddress1: PoHeaderValueUpdate.SellerAddress1,
                SellerAddress2: PoHeaderValueUpdate.SellerAddress2,
                SellerAddress3: PoHeaderValueUpdate.SellerAddress3,
                SellerAddress4: PoHeaderValueUpdate.SellerAddress4,
                SellerCity: PoHeaderValueUpdate.SellerCity,
                SellerState: PoHeaderValueUpdate.SellerState,
                SellerZip: PoHeaderValueUpdate.SellerZip
            }
            dropdownValue(temp)

        }
        else{
        setLoading(true)
        dropdownValue({});
        setLoading(false)
        }
    }, [token, clear])



    const dropdownValue = (obj) => {
        getLocFieldValue(token, "POTYPE").then(res => {
            console.log(res);
            setPoType(res);

            if (Action === "2") {
                debugger
                var potype = res.find(obj => obj.code === PoHeaderValueUpdate.POType)
                obj.POType = potype
                setpoHeadeForm(obj)

            }
        })
    }

    const handleChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;
        setpoHeadeForm({ ...poHeadeForm, [name]: value })

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

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(moment(poHeadeForm.PODate).format("MM/DD/YYYY HH:MM:SS"));
        if ((poHeadeForm.ExternPOKey !== "") && (poHeadeForm.POType !== "") && poHeadeForm.PODate !== "") {
            debugger
            let finalobj = { ...poHeadeForm }
            finalobj.POType = isPlainObject(poHeadeForm.POType) ? poHeadeForm.POType.code : poHeadeForm.POType

            let poheadervalues = [];
            poheadervalues.push(finalobj)
            setLoading(true);
            // poHeadeForm.PODate = moment(poHeadeForm.PODate).format("MM/DD/YYYY HH:MM:SS")

            const FinalValue = poheadervalues.map(obj => {
                const { ...rest } = obj;

                return { ...rest, PODate: moment(poHeadeForm.PODate).format("MM/DD/YYYY HH:MM:SS") }
            })



            PutPoCreate(JSON.stringify(FinalValue), token).then(res => {
                if (res === "Successfully posted to WMS") {
                    var timeout;
                    setLoading(false);
                    setopen(true);
                    if (Action === "2") {
                        setmessage("Order Header Update Succesfully")
                    }
                    else {
                        setmessage("Po Header Update Succesfully")
                    }
                    setseverity("success")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    navigate("/Po")
                }
                else {
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
        else {
            var timeout;
            setLoading(false);
            setopen(true);
            setmessage("Please fill mandatory field")
            setseverity("error")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }
    }


    const toggleDialogSupplier = () => {
        if (!supplierdialogvisible) {
            setLoading(true)
            getStorerkeys(token, "5").then((res => {
                setsuppliercodes(res)
                setLoading(false)
            }))
        }
        setsupplierdialogvisible(!supplierdialogvisible);
    };
    const handlesupplierClick = (event) => {
        console.log(event.dataItem)
        const selectedsupplier = event.dataItem
        setpoHeadeForm({...poHeadeForm, SellerName : selectedsupplier.StorerKey ,
            SellerAddress1: selectedsupplier.Address1,
            SellerAddress2: selectedsupplier.Address2,
            SellerAddress3: selectedsupplier.Address3,
            SellerAddress4: selectedsupplier.Address4,
            SellerCity: selectedsupplier.City,
            SellerState: selectedsupplier.State,
            SellerZip: selectedsupplier.Zip})
            toggleDialogSupplier()
    }
    const handleclear = () => {
        if(Action === '2')
        {
            setclear(!clear)
        }
        else{
            setpoHeadeForm(poHeader)
        }
    }

    return (
        <>
            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}
            {supplierdialogvisible && (
                <Dialog title={"Please select a Supplier code"} onClose={toggleDialogSupplier} className='dialoggrid'>
                    <Grid
                        onRowClick={handlesupplierClick}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        style={{
                            height: "450"
                        }}
                        data={process(suppliercodes, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        <Column field="StorerKey" title="Supplier" filterable={true} />
                        <Column field="Company" title="Company" filterable={true} className="fw-bold" />
                    </Grid>
                </Dialog>
            )}
            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>
                
                <Button className='text-uppercase active' type="button" onClick={() => { navigate('/Po') }} fillMode="solid">
                    Back</Button>
                    <form className="k-form" onSubmit={onSubmit}>
                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-4'> <h4 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.PoHeader')} {Action === "2" ? (<span>{PoHeaderValueUpdate.POKey}</span>) : (<span>Create</span>)}</h4>
                    </div>
                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            <Button className= 'text-uppercase br-round-left active' type='submit'>{Action === "2" ? (<span>Update</span>) : (<span>Create</span>)}</Button>
                            <Button className='text-uppercase br-round-right active' type='button' onClick={handleclear}>Clear</Button>

                        </ul>
                    </div>
                </div>
                <TabStrip selected={selected} onSelect={handleSelect} style={{ margin: '10px' }}>
                    <TabStripTab title="General">
                        <div style={{ margin: '10px' }}>
                            <div className='row'>
                                <div className='col-4'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>External PoKey *</p>
                                    <Input value={poHeadeForm.ExternPOKey || ""} name="ExternPOKey" onChange={handleChange} style={{ width: '100%' }} readOnly={Action === '2'} />
                                </div>
                                <div className='col-4'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Status</p>
                                    <Input value={poHeadeForm.statusdescr || ""} name="Status" onChange={handleChange} readOnly style={{ width: '100%' }} />
                                </div>
                                <div className='col-4'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Type *</p>
                                    <DropDownList
                                        value={poHeadeForm.POType || ""}
                                        style={{
                                            width: "100%",
                                        }}
                                        name="POType"
                                        onChange={handleChange}
                                        data={poType}
                                        textField="description"
                                        dataItemKey="code"
                                        defaultValue="Select"
                                        readOnly={Action === '2'}
                                    />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Order date *</p>
                                    <DatePicker
                                        onChange={handleChange}
                                        value={poHeadeForm.PODate || ""}
                                        name="PODate"
                                        format="dd/MMM/yyyy"
                                        weekNumber={true}
                                        width='100%'
                                        style={{ marginTop: '20px' }}
                                        readOnly={Action === '2'}
                                    />
                                </div>
                                <div className='col-4'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Buyer Reference</p>
                                    <Input onChange={handleChange} value={poHeadeForm.BuyersReference || ""} name="BuyersReference" style={{ width: '100%' }} />
                                </div>
                                <div className='col-4'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Supplier Reference</p>
                                    <Input value={poHeadeForm.SellersReference || ""} onChange={handleChange} name="SellersReference" style={{ width: '100%' }} />
                                </div>

                            </div>

                        </div>
                    </TabStripTab>
                    <TabStripTab title="Buyer">
                        <div className='row' style={{ marginTop: '5px' }}>
                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Buyer Name </p>
                                <Input value={poHeadeForm.BuyerName || ""} name="BuyerName" onChange={handleChange} style={{ width: '80%' }}  />
                            </div>
                            <div className='col-6' >
                            </div>
                        </div>
                        <div className='row' style={{ marginTop: '5px' }}>
                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }} >Address 1</p>
                                <Input value={poHeadeForm.BuyerAddress1 || ""} name="BuyerAddress1" onChange={handleChange} style={{ width: '100%' }} />
                            </div>
                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }} >Address 2</p>
                                <Input value={poHeadeForm.BuyerAddress2 || ""} name="BuyerAddress2" onChange={handleChange} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Address 3</p>
                                <Input value={poHeadeForm.BuyerAddress3 || ""} name="BuyerAddress3" onChange={handleChange} style={{ width: '100%' }} />
                            </div>
                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Address 4</p>

                                <Input value={poHeadeForm.BuyerAddress4 || ""} name="BuyerAddress4" onChange={handleChange} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>City</p>

                                <Input value={poHeadeForm.BuyerCity || ""} name="BuyerCity" onChange={handleChange} style={{ width: '100%' }} />
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>State</p>

                                <Input value={poHeadeForm.BuyerState || ""} name="BuyerState" onChange={handleChange} style={{ width: '100%' }} />
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Zip</p>
                                <Input value={poHeadeForm.BuyerZip || ""} name="BuyerZip" onChange={handleChange} style={{ width: '100%' }} />
                                
                            </div>



                        </div>

                    </TabStripTab>

                    <TabStripTab title="Supplier">
                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Supplier name </p>
                                <Input value={poHeadeForm.SellerName || ""} name="SellerName" onChange={handleChange} style={{ width: '80%' }} />
                                <span class="k-icon k-i-zoom-in" readOnly onClick={toggleDialogSupplier} style={{ marginLeft: "10px",cursor : "pointer" }}></span>
                            </div>

                            <div className='col-6' >

                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }} >Address 1</p>
                                <Input style={{ width: '100%' }} readOnly value={poHeadeForm.SellerAddress1 || ""} onChange={handleChange} name="SellerAddress1" />
                            </div>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }} >Address 2</p>
                                <Input style={{ width: '100%' }} readOnly value={poHeadeForm.SellerAddress2 || ""} onChange={handleChange} name="SellerAddress2" />
                            </div>

                        </div>

                        <div className='row'>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Address 3</p>
                                <Input style={{ width: '100%' }} readOnly value={poHeadeForm.SellerAddress3 || ""} onChange={handleChange} name="SellerAddress3" />
                            </div>

                            <div className='col-6' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Address 4</p>

                                <Input style={{ width: '100%' }} readOnly value={poHeadeForm.SellerAddress4 || ""} onChange={handleChange} name="SellerAddress4" />
                            </div>

                        </div>

                        <div className='row' style={{ marginTop: '5px' }}>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>City</p>

                                <Input style={{ width: '100%' }} readOnly value={poHeadeForm.SellerCity || ""} onChange={handleChange} name="SellerCity" />
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>State</p>

                                <Input style={{ width: '100%' }} readOnly value={poHeadeForm.SellerState || ""} onChange={handleChange} name="SellerState" />
                            </div>

                            <div className='col-3' >
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Zip</p>
                                <NumericTextBox
                                    style={{ width: '100%' }}
                                    value={poHeadeForm.SellerZip || ""}
                                    onChange={handleChange}
                                    name="SellerZip"
                                    spinners={false}
                                    format="#"
                                    max={999999999999999999}
                                    readOnly
                                />
                            </div>



                        </div>

                    </TabStripTab></TabStrip>
                    </form>
            </div>
        </>
    )
}

export default PoHeaderCreation;