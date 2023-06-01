import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Label } from '@progress/kendo-react-labels';
import { Input as KendoInput } from '@progress/kendo-react-inputs';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { Button } from "@progress/kendo-react-buttons";
import { createStorerKeys } from "../../../services/ConfigurationService/ConfigurationService";
import { TextArea } from "@progress/kendo-react-inputs";

const ShiptoCreation = () => {

    const { state } = useLocation()
    const Shiptodetail = state && state.Shiptodetail
    const shiptostate = {
        "Type": "2",
        "StorerKey": null,
        "Address1": null,
        "Address2": null,
        "Address3": null,
        "Address4": null,
        "Address5": null,
        "Address6": null,
        "B_Address1": null,
        "B_Address2": null,
        "B_Address3": null,
        "B_Address4": null,
        "Contact1": null,
        "Contact2": null,
        "Phone1": null,
        "Phone2": null,
        "Fax1": null,
        "Fax2": null,
        "Email1": null,
        "Email2": null,
        "B_Contact1": null,
        "B_Contact2": null,
        "City": null,
        "Company": null,
        "Country": null,
        "B_City": null,
        "B_State": null,
        "B_Zip": null,
        "B_Country": null,
        "B_ISOCntrycode": null,
        "B_Phone1": null,
        "B_Phone2": null,
        "B_Fax1": null,
        "B_Fax2": null,
        "B_Email1": null,
        "B_Email2": null,
        "Description": null,
        "ISOCntryCode": null,
        "Notes1": null,
        "Notes2": null,
        "Scac_Code": null,
        "State": null,
        "Status": null,
        "SUsr1": null,
        "SUsr2": null,
        "SUsr3": null,
        "SUsr4": null,
        "SUsr5": null,
        "SUsr6": null,
        "Title1": null,
        "Title2": null,
        "VAT": null,
        "Zip": null,
    }
    const [shiptoCreationFormValues, setshiptoCreationFormValues] = useState(shiptostate)
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState("info");
    let Client = localStorage.getItem("Client");
    let token = localStorage.getItem("selfToken");
    let navigate = useNavigate()

    useEffect(() => {
        if (Shiptodetail !== null) {
            setshiptoCreationFormValues(Shiptodetail)
            console.log(1)
        }
    }, [Shiptodetail])

    const handleSelect = (e) => {
        setSelected(e.selected);
    };

    useEffect(() => {
        console.log(shiptoCreationFormValues, 'changed')
    }, [shiptoCreationFormValues])


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.value;
        console.log(name, '  ', value)

        setshiptoCreationFormValues({ ...shiptoCreationFormValues, [name]: value })

    }

    const handleclick = () => {
        console.log(shiptoCreationFormValues)

        createStorerKeys([shiptoCreationFormValues], token, 2).then(res => {
            var timeout;
            setLoading(false);
            if (res === "Successfully posted to WMS") {
                setopen(true);
                setmessage("Carrier Created Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    navigate('/Config/Shipto')
                }, 2000);
            }
            else {
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

    return (
        <>
            {loading && <Loader loading={loading} />}
            <WithSnackbar open={open} message={message} severity={severity} />
               <div id="Planning" className="inbound-page main-content">
            <div className="d-flex mt-5 justify-content-between">
                <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{Client} - Ship To</h3>
                </div>
                <Button className='text-uppercase  active' type="button" onClick={handleclick} >{Shiptodetail === null ? 'Create' : 'Update'}</Button>
            </div>
            <TabStrip selected={selected} onSelect={handleSelect} style={{ margin: '10px' }}>
                <TabStripTab title="General">
                    <div className="row">
                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Ship To *</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.StorerKey || ""} name="StorerKey" style={{ width: '100%' }} disabled={Shiptodetail !== null} maxLength={15}/>
                            
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Company</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.Company || ""} name="Company" style={{ width: '100%' }} maxLength={45}/>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Scac Code</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.Scac_Code || ""} name="Scac_Code" style={{ width: '100%' }} maxLength={10}/>
                        </div>
                    </div>


                    <div className="row mt-1">
                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Description</p>
                            <TextArea
                                onChange={handleChange} value={shiptoCreationFormValues.Description || ""} name="Description"
                                style={{ width: '100%' }}
                                maxLength={50}
                            />
                        </div>
                    </div>

                </TabStripTab>
                <TabStripTab title="Address">
                    <div className="row">
                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 01</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.Address1 || ""} name="Address1" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 02</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.Address2 || ""} name="Address2" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 03</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.Address3 || ""} name="Address3" style={{ width: '100%' }} maxLength={45}/>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 04</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.Address4 || ""} name="Address4" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 05</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.Address5 || ""} name="Address5" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Phone</p>
                            <KendoInput type="number" onChange={handleChange} value={shiptoCreationFormValues.Phone1 || ""} name="Phone1" style={{ width: '100%' }} maxLength={18}/>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-3">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>City</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.City || ""} name="City" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-3">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>State</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.State || ""} name="State" style={{ width: '100%' }} maxLength={25}/>
                        </div>

                        <div className="col-3">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Zip</p>
                            <KendoInput type="number" onChange={handleChange} value={shiptoCreationFormValues.Zip || ""} name="Zip" style={{ width: '100%' }} maxLength={18}/>
                        </div>

                        <div className="col-3">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Country</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.Country || ""} name="Country" style={{ width: '100%' }} maxLength={30}/>
                        </div>
                    </div>
                </TabStripTab>
                <TabStripTab title="Bill Address">

                    <div className="row">
                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 01</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.B_Address1 || ""} name="B_Address1" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 02</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.B_Address2 || ""} name="B_Address2" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 03</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.B_Address3 || ""} name="B_Address3" style={{ width: '100%' }} maxLength={45}/>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 04</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.B_Address4 || ""} name="B_Address4" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Address Line 05</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.B_Address5 || ""} name="B_Address5" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-4">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Phone</p>
                            <KendoInput type="number" onChange={handleChange} value={shiptoCreationFormValues.B_Phone1 || ""} name="B_Phone1" style={{ width: '100%' }} maxLength={18}/>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-3">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>City</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.B_City || ""} name="B_City" style={{ width: '100%' }} maxLength={45}/>
                        </div>

                        <div className="col-3">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>State</p>
                            <KendoInput onChange={handleChange} value={shiptoCreationFormValues.B_State || ""} name="B_State" style={{ width: '100%' }} maxLength={25}/>
                        </div>

                        <div className="col-3">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Zip</p>
                            <KendoInput type="number" onChange={handleChange} value={shiptoCreationFormValues.B_Zip || ""} name="B_Zip" style={{ width: '100%' }} maxLength={18}/>
                        </div>

                        <div className="col-3">
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Country</p>
                            <KendoInput  onChange={handleChange} value={shiptoCreationFormValues.B_Country || ""} name="B_Country" style={{ width: '100%' }} maxLength={30}/>
                        </div>
                    </div>
                </TabStripTab>
            </TabStrip>
            </div>
        </>
    )
}



export default ShiptoCreation;