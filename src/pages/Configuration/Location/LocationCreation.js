import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalization } from '@progress/kendo-react-intl';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { putLocation,getZone,getLocFieldValue } from "../../../services/ConfigurationService/ConfigurationService";
// import { PostLoc } from "../../../services/ConfigurationService/ConfigurationService";

import {
    Card
} from "@progress/kendo-react-layout";

const LocationCreation = () => {


    const LocationValues = {
        Loc: "",
        LocationType: "Other",
        LocationFlag: "NONE",
        LocationCategory: "OTHER",
        PutawayZone: "ZONE2",
        AllocationZone: "1",
        LocationHandling: "Other",
        LoseId: "1",
        Cube: "0",
        Length: "0",
        Height: "0",
        LocLevel: "0",
        CubicCapacity: "0",
        WeightCapacity: "0",
        Width: "0",
        SectionKey: "FACILITY",
        XCoord: "0",
        YCoord: "0",
        ZCoord: "0",
        CommingleSku: "No",
        CommingleLot: "No",
        ABC: "0",
        StackLimit: "0",
        FootPrint: "0",
        Orientation: null,
        BackflushIndicator: "0",
        ProdStageLoc: null,
        CommingleLottable1: "1",
        CommingleLottable2: "1",
        CommingleLottable3: "1",
        CommingleLottable6: "1",
        CommingleLottable7: "1",
        CommingleLottable8: "1",
        CommingleLottable9: "1",
        CommingleLottable10: "1",
        InterleavingSequence: "0",
        AutoShip: "0",
        CycleClass: null,
        MaxDockAssignOrders: null,
        MaxDockAssignEstPallets: null,
        CheckDigit: "A",
        ShareWidthFromLoc: null,
        ShareWeightCapacityFromLoc: null,
        LpnSortAllocation: "1",
        AddDate: "2022-08-04T12:59:57",
        AddWho: "wmsadmin",
        EditDate: "2022-08-04T12:59:57",
        EditWho: "wmsadmin"
    }
    //declare  variable
    const LocationType = ["None", "CROSSDOCK", "DOORR", "OTHER"];
    const LocationCatagory = ["NONE", "OTHER"];
    const AllocationZone = ["None"];
    const ABC = ["Fast Move", "Average Move", "Slow Move"];
    const Facility = ["Facility"];
    const LocationFlag = ["NONE", "DAMAGE", "HOLD"];
    const zone = ["ZONE2"];
    const commingle = ["Yes", "No"]
    const ComingalItemLOT = ["Yes", "No"];
    const commonstate = [{ key: "Yes", value: "1" }, { key: "No", value: "0" }];
    const locationhandling = ["None", "Pallets Only", "Cases Only", "Other"]
    const locationhandlingValue = [{ key: "None", value: "0" }, { key: "Pallets Only", value: "1" }, { key: "Cases Only", value: "2" }, { key: "Other", value: "9" }];


    //declare service
    const localizationService = useLocalization();
    const { state } = useLocation();

    //usestate
    const [LocationForm, setLocationnForm] = useState(LocationValues);
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const LocationUpdate = state && state.LocationUpdate;
    const Action = state && state.maction;
    const [zonDropDown,setzonDropDown] = useState([]);
    const [fieldLocationType,setLocatioType] = useState([]);
    const [fieldLocationTypearray,setLocatioTypearray] = useState([]);
    const [locCatagotry,setLocCatagory] = useState([]);
    const [LocHandling,setLocHandling] = useState([]);
    const [LocFlag,setLocFlag] = useState([]);
 


    //token
    let token = localStorage.getItem("selfToken");

    useEffect(() => {


        if (Action == "2") {
            setLocationnForm(LocationUpdate);
            LocationUpdate.CommingleLot = generateIndexOfDataSet(LocationUpdate.CommingleLot, "recover")
            LocationUpdate.CommingleSku = generateIndexOfDataSet(LocationUpdate.CommingleSku, "recover")
            // LocationUpdate.LocationHandling = generateLocationHandlingData(LocationUpdate.LocationHandling, "recover");
            // LocationForm.LocationType = generateLocationType(LocationForm.LocationType,"recover")

            
        }


        locationDropDownValues();
    }, [token])

    const locationDropDownValues = () =>{
        console.log(LocationUpdate);
        getZone(token).then(res=>{
            setzonDropDown(res.map(obj=>{
                return obj.PutawayZone
            }))
        })

        getLocFieldValue(token,"Loctype").then(res =>{
            console.log(res);
            setLocatioType(res)
            setLocatioTypearray(res);
            if(Action === "2"){
                debugger
               
                   var loctype = res.find(obj => obj.code === LocationUpdate.LocationType)
                   LocationForm.LocationType = loctype
                  
               
            }
        })

        getLocFieldValue(token,"locflag").then(res =>{
            console.log(res);
            setLocFlag(res)
            if(Action === "2"){
                debugger
                var locFlag = res.find(obj => obj.code === LocationUpdate.LocationFlag)
                LocationForm.LocationFlag = locFlag
            }
           
        })
        

        getLocFieldValue(token,"loccategry").then(res=>{
            if(Action === "2"){
                debugger
                var locCatagory = res.find(obj => obj.code === LocationUpdate.LocationCategory)
                LocationForm.LocationCategory = locCatagory
            }
            setLocCatagory(res);
        })

        getLocFieldValue(token,"LOCHDLING").then(res=>{
            if(Action === "2"){
                debugger
                var locHandling = res.find(obj => obj.code === LocationUpdate.LocationHandling)
                LocationForm.LocationHandling = locHandling
                LocationForm.Loc = LocationUpdate.Loc;
                LocationForm.CommingleSku= LocationUpdate.CommingleSku;
                LocationForm.CommingleLot= LocationUpdate.CommingleLot;
            }
            setLocHandling(res);
        })

       
        setLocationnForm(LocationForm)
    }

    const handleChange = (event) => {



        const name = event.target.name;
        let value =""
        console.log(event.target.value);
        console.log(event.target.value.PutawayZone);
        if(name === "PutawayZone"){
            
             value = event.target.value.PutawayZone;
        }
        else{
            if(event.target.value === "-"){
                textboxNegativePrevent();

            }
            else{
                value = event.target.value;

            }
        }
        setLocationnForm({ ...LocationForm, [name]: value })
    }

    const textboxNegativePrevent =() =>{
        var timeout;
        setopen(true);
   
            setmessage("Cannot enter negative value")
        
        setseverity("success")
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            setopen(false);
        }, 2000);
    }

     
    const generateIndexOfDataSet = (event, section) => {

        for (let i = 0; i < commonstate.length; i++) {
            if (section == "validate") {
                if (event == commonstate[i].key) {
                    return commonstate[i].value
                }
            }
            else if (section == "recover") {
                if (event == commonstate[i].value) {
                    return commonstate[i].key
                }
            }
        }
    }



    const generateLocationType = (event, section) => {


        // for (let i = 0; i < locationhandlingValue.length; i++) {
        //     if (section == "validate") {

        //         if (event == locationhandlingValue[i].key) {
        //             return locationhandlingValue[i].value
        //         }
        //     }
        //     else if (section == "recover") {
        //         if (event == locationhandlingValue[i].value) {
        //             return locationhandlingValue[i].key
        //         }
        //     }
        // }
        // if(section == "validate"){
        //     const finslvalue =  fieldLocationTypearray.filter(obj => obj.description === event).map(obj =>{
        //         return obj.code
        //     })
        //     console.log(finslvalue);
        //     return finslvalue[0];
        // }
        // else if (section == "recover"){
        //     const finslvalue = fieldLocationTypearray.filter(obj => obj.code === event).map(obj =>{
        //         return obj.description 
        //     })
        //     console.log(finslvalue);
        //     return finslvalue[0];
        // }
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
    const locationCreation = (maction) => {
       debugger

        let finalobj = { ...LocationForm }
        finalobj.LocationType = isPlainObject(LocationForm.LocationType) ? LocationForm.LocationType.code : LocationForm.LocationType
        finalobj.LocationFlag = isPlainObject(LocationForm.LocationFlag) ? LocationForm.LocationFlag.code : LocationForm.LocationFlag
        finalobj.LocationCategory = isPlainObject(LocationForm.LocationCategory) ? LocationForm.LocationCategory.code : LocationForm.LocationCategory
        finalobj.LocationHandling = isPlainObject(LocationForm.LocationHandling) ? LocationForm.LocationHandling.code : LocationForm.LocationHandling






        debugger
        putLocation("[" + JSON.stringify(finalobj) + "]", token, maction).then(res => {

            var timeout;
            setLoading(false);
            if (res === "Successfully posted to WMS") {

                setopen(true);
                if (maction === "1") {
                    setmessage("Location Created Successfully")
                }
                else {
                    setmessage(res)

                }
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
                setLocationnForm(LocationValues);
            }
            else {
                LocationForm.CommingleLot = generateIndexOfDataSet(LocationForm.CommingleLot, "recover")
                LocationForm.CommingleSku = generateIndexOfDataSet(LocationForm.CommingleSku, "recover")

                setopen(true);
                if (maction === "1") {
                    setmessage("Location not created successfully")
                }
                else {
                    setmessage(res)

                }
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
            }
        })
    }
    const onSubmit = (e) => {

        e.preventDefault();
        setLoading(true);
debugger

        LocationForm.CommingleSku = generateIndexOfDataSet(LocationForm.CommingleSku, "validate");
        LocationForm.CommingleLot = generateIndexOfDataSet(LocationForm.CommingleLot, "validate");
        // LocationForm.LocationType = generateLocationType(LocationForm.LocationType,"validate")


        if (Action == "2") {
            LocationForm.EditWho = localStorage.getItem('Client');
            LocationForm.EditDate = new Date();
            locationCreation("2");
        }
        else {
            LocationForm.AddWho = localStorage.getItem('Client');
            LocationForm.AddDate = new Date();
            LocationForm.EditWho = localStorage.getItem('Client');
            LocationForm.EditDate = new Date();
            locationCreation("1");
        }





    }
    //dropdown Default
    const putawaydefault ={
        PutawayZone: LocationForm.PutawayZone,
    };

    return (
        <>
            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inboundHeaderCreation-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>
                <form className="k-form" onSubmit={onSubmit}>
                    <div className="d-flex flex-wrap mt-2 justify-content-between">
                        <div className='ps-4'> <h4 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.Location')}{Action === "2" ?(<span> Updation</span>):(<span> Creation</span>)}</h4>
                        </div>
                        <div className='inbound-page pe-4'>
                            <ul className='header-buttons'>


                                {/* <li className='text-uppercase br-round-left active' type="submit">
                            <input type="submit" className="k-button k-button-md" value="Create" /> */}
                                <Button className='text-uppercase br-round-left active' type="submit" fillMode="solid" style={{ width: '90px' }}>{Action === "2" ?(<span> Update</span>):(<span> Create</span>)}</Button>
                                <Button className='text-uppercase br-round-right active' type='button' onClick={() => {
                                    setLocationnForm(LocationValues);
                                }} fillMode="solid" style={{ width: '90px', backgroundColor: '#E6E6E6', color: '#1B1D21' }}>Clear</Button>

                                {/* </li> */}
                            </ul>
                        </div>
                    </div>

                    <div style={{ margin: '10px' }}>
                        <p style={{ marginTop: "5px", fontSize: "15px", fontWeight: "bold" }}>General</p>
                        <Card style={{ padding: "10px", marginTop: '10px' }}>
                            <div className='row'>
                                <div className='col-lg-6 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Location *</p>
                                    {Action === "2" ? (<Input style={{ width: '100%' }} maxLength="9" readOnly required={true} validityStyles={false} onChange={handleChange} name="Loc" value={LocationForm.Loc || ""} />
                                    ) : (
                                        <Input style={{ width: '100%' }} maxLength="10" required={true} validityStyles={false} onChange={handleChange} name="Loc" value={LocationForm.Loc || ""} />
                                    )}
                                </div>

                                <div className='col-lg-6 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Location Handling *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        required={true} validityStyles={false}
                                        value={LocationForm.LocationHandling || ""}
                                        name="LocationHandling"
                                        onChange={handleChange}

                                        data={LocHandling}
                                        textField="description"
                                        dataItemKey="code"
                                        defaultValue="Select "
                                    />
                                </div>




                            </div>

                            <div className='row' style={{ marginTop: '10px' }}>


                                <div className='col-lg-6 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Location Type *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        required={true} validityStyles={false}
                                        value={LocationForm.LocationType || ""}
                                        onChange={handleChange}
                                        data={fieldLocationType}
                                        textField="description"
                                        dataItemKey="code"
                                        name="LocationType"
                                        defaultItem= "Select"
                                        
                                    />
                                </div>



                                <div className='col-lg-6 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Location Flag *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        required={true} validityStyles={false}
                                        value={LocationForm.LocationFlag || ""}
                                        name="LocationFlag"
                                        textField="description"
                                        dataItemKey="code"
                                        onChange={handleChange}
                                        data={LocFlag}
                                        defaultValue="Select "
                                    />
                                </div>




                            </div>

                            <div className='row' style={{ marginTop: '10px', marginBotton: '5px' }}>

                                <div className='col-lg-6 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Location Catagory *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        required={true} validityStyles={false}
                                        value={LocationForm.LocationCategory || ""}
                                        textField="description"
                                        dataItemKey="code"
                                        onChange={handleChange}
                                        name="LocationCategory"
                                        data={locCatagotry}
                                        defaultValue="Select "
                                    />
                                </div>

                                <div className='col-lg-6 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Zone *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                      
                                        value={LocationForm.PutawayZone || ""}
                                        onChange={handleChange}
                                        name="PutawayZone"
                                        data={zonDropDown}
                                        
                                    />
                                </div>
                            </div>
                        </Card>
                        <p style={{ marginTop: "5px", fontSize: "15px", fontWeight: "bold", marginTop: "10px" }}>Capacity</p>
                        <Card style={{ padding: "10px" }}>
                            <div className='row' style={{ marginTop: "5px", marginBotton: '5px' }} >
                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Weight Capacity</p>
                                    <Input value={LocationForm.WeightCapacity || ""}
                                     type="number" min="0" maxLength="8" onChange={handleChange} name="WeightCapacity" style={{ width: '100%' }} />
                                </div>

                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Stack limit</p>
                                    <Input value={LocationForm.StackLimit || ""} type="number" maxLength="4" min="0" onChange={handleChange} name="StackLimit" style={{ width: '100%' }} />
                                </div>
                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Foot print</p>
                                    <Input value={LocationForm.FootPrint || ""} type="number" maxLength="4" min="0" onChange={handleChange} name="FootPrint" style={{ width: '100%' }} />
                                </div>
                            </div>



                        </Card>

                        <p style={{ marginTop: "5px", fontSize: "15px", fontWeight: "bold", marginTop: "10px" }}>Commingle</p>
                        <Card style={{ padding: "10px" }}>
                            <div className='row' style={{ marginTop: "5px", marginBotton: '5px' }} >
                                <div className='col-lg-6 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Commingle Item *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        value={LocationForm.CommingleSku || ""}
                                        onChange={handleChange}
                                        name="CommingleSku"
                                        data={commingle}
                                        defaultValue="Select "
                                    />
                                </div>
                                <div className='col-lg-6 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Commingle Lot *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        value={LocationForm.CommingleLot || ""}
                                        onChange={handleChange}
                                        name="CommingleLot"
                                        data={commingle}
                                        defaultValue="Select "
                                    />
                                </div>
                            </div>
                        </Card>

                    </div>
                </form>
            </div>
        </>
    );
}

export default LocationCreation;