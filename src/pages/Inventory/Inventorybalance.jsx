import * as React from 'react';
import { getinv, DoAdjustment } from "../../services/InventoryService/InventoryBalanceService";
import { useState, useEffect } from 'react';
import { WithSnackbar } from "../../../src/components/form/Notification";
import { process } from "@progress/kendo-data-query";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import Loader from "../../../src/components/Loader/Loader";
import { useLocalization } from '@progress/kendo-react-intl';
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { useNavigate } from "react-router-dom";
import { Popup } from "@progress/kendo-react-popup";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { getLocFieldValue, getRoles } from "../../services/ConfigurationService/ConfigurationService"


const sleep = (time) => new Promise((r) => setTimeout(r, time));

const initialDataState = {
    sort: [
        {
            field: "code",
            dir: "asc",
        },
    ],
    take: 25,
    skip: 0,
    logic: "and"
};



const Inventorybalance = () => {


    const gridVisibility = {
        Lot: true,
        Sku: true,
        Sku: true,
        Loc: true,
        Qty: true,
        QtyAllocated: true,
        Status: true,
        QtyPicked: true,
        Lottable08: true,
        Lottable09: true,
        Id: true
    }

    const AdjustmentData = {
        Id: "",
        Loc: "",
        Lot: "",
        Lottable01: "",
        Lottable02: "",
        Lottable03: "",
        Lottable04: "",
        Lottable07: "",
        Lottable08: "",
        Lottable09: "",
        Lottable10: "",
        Qty: "",
        QtyAllocated: "",
        QtyExpected: "",
        QtyPicked: "",
        AdjustmentQty: "0",
        ReasonCode: "",
        Sku: "",
        Status: "",
        StorerKey: "",
        GrossWgt: "",
        NetWgt: "",
        TareWgt: "",
    }

    const inv = {
        "adjust": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "consolidate": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "move": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        }
    }
    const [permissions, setpermissions] = useState(inv)
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let username = localStorage.getItem("UserName")
    var timeout;
    let navigate = useNavigate()

    const [dataState, setDataState] = React.useState(initialDataState);
    const [open, setopen] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [titleZone, settitleZone] = useState("Column Selector");
    const [message, setmessage] = useState("");
    const [severity, setseverity] = useState("success");
    const [loading, setLoading] = useState(true);
    const localizationService = useLocalization();
    const [invbal, setinvbal] = useState([]);
    const [search, setNewSearch] = useState([]);
    const [refresh, setrefresh] = useState(true)
    const anchor = React.useRef(null);
    const [show, setShow] = React.useState(false);
    const [AdjustmetForm, setAdjustmetForm] = useState(AdjustmentData)
    const [gridChangehandler, setgridChangehandler] = useState(gridVisibility)
    const [AdjustmentContent, setAdjustmentContent] = React.useState(false);
    const [ReasonCode, setReasonCode] = useState();


    useEffect(async () => {

        setLoading(true)
        await sleep(700)
        getLocFieldValue(token, "ADJREASON").then(res => {
            console.log(res);
            setReasonCode(res);
        })


        onloading();
        getRoles(token, "inv").then((res) => {
            setpermissions(res)
        })
    }, [token, refresh])

    const onloading = () => {
        getinv(token).then((res) => {
            if (res) {
                if (res.length > 0) {
                    const tempDataValue = res.map(obj => {
                        return { ...obj, checker: "" }
                    })
                    console.log(tempDataValue);
                    setinvbal(tempDataValue)
                } else {
                    setinvbal([])
                }
            }
            setLoading(false)
        })
    }

    const toggleAdjustment = () => {
        setAdjustmentContent(!AdjustmentContent);
    };

    const visibleGrid = () => {
        setVisible(!visible);
    };
    const handleButtonClick = (mode) => {

        debugger


        console.log(invbal);
        const tempselectedrecords = invbal.filter(objec => {
            return objec.checker !== "";
        })


        if (tempselectedrecords.length > 0) {
            console.log(tempselectedrecords);
            if (mode === 1) {
                navigate('/Inventory/Putaway', { state: { 'putaway': tempselectedrecords } })
            }
            if (mode === 2) {
                navigate('/Inventory/Transfer', { state: { 'transfer': tempselectedrecords } })
            }

        }
        else {
            setopen(true)
            setmessage("Select a line to perform the action")
            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }
    }
    const refreshButtonCilck = () => {
        setrefresh(!refresh) //just change the value, to trigger the useeffect hook
    }

    const validateCheck = (e) => {


        var index = invbal.findIndex(p => p.SerialKey == e.target.id);
        if (invbal[index].checker === "") {
            invbal[index].checker = "checked";
        }
        else {
            invbal[index].checker = "";
        }

    }

    const showPooup = () => {
        setShow(!show);
    };


    const invChecked = (e) => {

        console.log(e.dataItem.checker);
        if (e.dataItem.checker !== "") {
            return (
                <td>
                    <input type="checkbox" id={e.dataItem.SerialKey} onChange={validateCheck} value="" defaultChecked />
                </td>
            );
        }
        return (

            <td>
                <input type="checkbox" id={e.dataItem.SerialKey} onChange={validateCheck} />
            </td>
        )
    }

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

    const Adjustment = () => {

        console.log(invbal);

        const CountSelect = invbal.filter(obj => {
            if (obj.checker === "checked")
                return obj;
        })




        // console.log(AdjustmetForm[0][0].Lot);
        if (CountSelect.length > 0) {
            AdjustmetForm.Loc = CountSelect[0].Loc;
            AdjustmetForm.Id = CountSelect[0].Id;
            AdjustmetForm.Loc = CountSelect[0].Loc;
            AdjustmetForm.Lot = CountSelect[0].Lot;
            AdjustmetForm.Lottable01 = CountSelect[0].Lottable01;
            AdjustmetForm.Lottable02 = CountSelect[0].Lottable02;
            AdjustmetForm.Lottable03 = CountSelect[0].Lottable03;
            AdjustmetForm.Lottable04 = CountSelect[0].Lottable04;
            AdjustmetForm.Lottable07 = CountSelect[0].Lottable07;
            AdjustmetForm.Lottable08 = CountSelect[0].Lottable08;
            AdjustmetForm.Lottable09 = CountSelect[0].Lottable09;
            AdjustmetForm.Lottable10 = CountSelect[0].Lottable10;
            AdjustmetForm.Qty = CountSelect[0].Qty;
            AdjustmetForm.QtyAllocated = CountSelect[0].QtyAllocated;
            AdjustmetForm.QtyExpected = CountSelect[0].QtyExpected;
            AdjustmetForm.QtyPicked = CountSelect[0].QtyPicked;
            AdjustmetForm.AdjustmentQty = CountSelect[0].AdjustmentQty;
            AdjustmetForm.Sku = CountSelect[0].Sku;
            AdjustmetForm.Status = CountSelect[0].Status;
            AdjustmetForm.StorerKey = CountSelect[0].StorerKey;
            AdjustmetForm.GrossWgt = CountSelect[0].GrossWgt;
            AdjustmetForm.NetWgt = CountSelect[0].NetWgt;
            AdjustmetForm.TareWgt = CountSelect[0].TareWgt;
            if (CountSelect.length < 2) {
                toggleAdjustment();
            }
            else {
                var timeout;
                setopen(true)
                setmessage("Cannot Adjust more than one select")
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
            }
        }
        else {
            var timeout;
            setopen(true);
            setmessage("Please select the data to Adjust");
            setseverity("error")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);

        }

    }

    const handleChange = (event) => {
        const name = event.target.name;
        let value = event.target.value
        setAdjustmetForm({ ...AdjustmetForm, [name]: value })
        console.log(AdjustmetForm);
    }
    const DoAdjust = () => {
        debugger
        console.log(AdjustmetForm);
        if (AdjustmetForm.ReasonCode !== "") {
            AdjustmetForm.TareWgt = document.getElementById('tareweightPopup').value

            // Adjustment("[" + JSON.stringify(AdjustmetForm) + "]", token, "1").then(res=>{
            //     console.log(res);
            // })
            setLoading(true);
            DoAdjustment("[" + JSON.stringify(AdjustmetForm) + "]", token, "1").then(res => {
                if (res === "Adjustment created") {
                    var timeout;
                    setLoading(false);


                    setopen(true);

                    setmessage("Adjustment Completed")

                    setseverity("success")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    setAdjustmentContent(AdjustmentData);

                    toggleAdjustment();
                    onloading();

                }
                else {
                    setLoading(false);
                    setopen(true);
                    setmessage("Adjustment not completed")

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
            setopen(true);
            setmessage("ReasonCode is important")

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
                <WithSnackbar open={open} message={message} severity={severity} />
                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-3'>
                        <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.inv')}</h3>
                    </div>
                    <div>
                        <Popup anchor={anchor.current} show={show} popupClass={"popup-content"}></Popup>
                    </div>

                </div>


                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid
                        resizable={true}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        style={{
                            height: "80vh"
                        }}
                        data={process(invbal, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        <GridToolbar>
                            <div className='position-relative pe-3'>
                                <ul className='header-buttons'>
                                    <ButtonGroup>
                                        <Button  onClick={refreshButtonCilck} >Refresh</Button>
                                        <Button  onClick={showPooup} ref={anchor} fillMode="solid" > {show ? "Close " : "Field selector"}</Button>
                                        {permissions.move.visible === "True" && <Button  onClick={() => handleButtonClick(1)} fillMode="solid" >Move</Button>}
                                        {permissions.consolidate.visible === "True" && <Button className=' br-round active' onClick={() => handleButtonClick(2)} >Consolidate</Button>}
                                        {permissions.adjust.visible === "True" && <Button  onClick={Adjustment} fillMode="solid" >Adjust</Button>}
                                    </ButtonGroup>
                                </ul>
                            </div>
                        </GridToolbar>

                        {(permissions.move.visible === "True" || permissions.consolidate.visible === "True" || permissions.adjust.visible === "True" ) && <Column title="" filterable={false} className="edit-btn" width={60} cell={invChecked} />}
                        {gridChangehandler.Lot == true ? (<Column field="Lot" title="Lot" filterable={true} width={200} />) : (<></>)}
                        {gridChangehandler.Sku == true ? (<Column field="Sku" title="Sku" filterable={true} width={200} />) : (<></>)}
                        {gridChangehandler.Loc == true ? (<Column field="Loc" title="Loc" filterable={true} width={200} />) : (<></>)}
                        {gridChangehandler.Qty == true ? (<Column field="Qty" title="Qty" filter="numeric" width={200} />) : (<></>)}
                        {gridChangehandler.QtyAllocated == true ? (<Column field="QtyAllocated" title="Qty Allocated" filter="numeric" width={200} />) : (<></>)}
                        {gridChangehandler.Status == true ? (<Column field="Status" title="Status" filterable={true} width={200} />) : (<></>)}
                        {gridChangehandler.QtyPicked == true ? (<Column field="QtyPicked" title="Qty Picked" filter="numeric" width={200} />) : (<></>)}
                        {gridChangehandler.Lottable08 == true ? (<Column field="Lottable08" title="Lottable 08" filterable={true} width={200} />) : (<></>)}
                        {gridChangehandler.Lottable09 == true ? (<Column field="Lottable09" title="Lottable 09" filterable={true} width={200} />) : (<></>)}
                    </Grid>
                </div>
            </div>

            {AdjustmentContent && (
                <Dialog title="Adjustment" width="50%" height="55%" style={{ zIndex: 100 }} onClose={toggleAdjustment}>
                    <div className='row'>
                        <div className='col-2'>
                            <p>Lot</p>
                        </div>
                        <div className='col-6'>
                            <Input readOnly value={AdjustmetForm.Lot} style={{ width: '100%', borderColor: "black" }} />
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "5px" }}>
                        <div className='col-2'>
                            <p>Sku</p>
                        </div>
                        <div className='col-6'>
                            <Input readOnly value={AdjustmetForm.Sku || ""} style={{ width: '100%', borderColor: "black" }} />
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "5px" }}>
                        <div className='col-2'>
                            <p>Loc</p>
                        </div>
                        <div className='col-6'>
                            <Input value={AdjustmetForm.Loc || ""} name="Loc" readOnly style={{ width: '100%', borderColor: "black" }} />

                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "5px" }}>
                        <div className='col-2'>
                            <p>Available Qty</p>
                        </div>
                        <div className='col-6'>
                            <Input value={AdjustmetForm.Qty || ""} name="Qty" onChange={handleChange} readOnly style={{ width: '100%', borderColor: "black" }} />
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "5px" }}>
                        <div className='col-2'>
                            <p>Qty Adjust</p>
                        </div>
                        <div className='col-4'>
                            <Input value={AdjustmetForm.AdjustmentQty || ""} type="number" name="AdjustmentQty" onChange={handleChange} style={{ width: '100%', borderColor: "black" }} />
                        </div>
                        <div className='col-2'>
                            <p>Target Qty</p>
                        </div>
                        <div className='col-4'>
                            <Input readOnly value={Number(AdjustmetForm.Qty) + Number(AdjustmetForm.AdjustmentQty)} style={{ width: '100%', borderColor: "black" }} />
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "5px" }}>
                        <div className='col-2'>
                            <p>Gross Wgt</p>

                        </div>
                        <div className='col-2'>
                            <Input value={AdjustmetForm.GrossWgt || ""} name="GrossWgt" onChange={handleChange} style={{ width: '100%', borderColor: "black" }} />

                        </div>
                        <div className='col-2'>
                            <p>Net Wgt</p>

                        </div>
                        <div className='col-2'>
                            <Input value={AdjustmetForm.NetWgt || ""} name="NetWgt" onChange={handleChange} style={{ width: '100%', borderColor: "black" }} />

                        </div>
                        <div className='col-2'>
                            <p>Tare Wgt</p>
                        </div>
                        <div className='col-2'>
                            <Input value={(AdjustmetForm.GrossWgt - AdjustmetForm.NetWgt) || ""} type="number" min="0" id="tareweightPopup" readOnly style={{ width: '100%', borderColor: "black" }} />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-8'>
                            <p style={{ marginBottom: '2px' }}>Reason Code *</p>
                            <DropDownList
                                style={{
                                    width: "100%", zIndex: '80003',
                                }}
                                name="ReasonCode"
                                dataItemKey="Code"
                                textField="description"
                                data={ReasonCode}
                                onChange={(event) => {
                                    debugger


                                    AdjustmetForm.ReasonCode = event.value.code;
                                }}

                            />
                        </div>

                    </div>





                    <DialogActionsBar>
                        <button
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            style={{ background: "green", color: "white" }}
                            onClick={DoAdjust}
                        >
                            Do Adjust
                        </button>
                        <button
                            style={{ background: "red", color: "white" }}

                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            onClick={toggleAdjustment}
                        >
                            Close
                        </button>
                    </DialogActionsBar>
                </Dialog>
            )}



            {visible && (
                <Dialog title={titleZone} onClose={visibleGrid}>
                    {Client !== 'BSI FTWZ' && <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} name='Lot' checked={gridChangehandler.Lot} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Lot</p>

                        </div>
                    </div>}
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} checked={gridChangehandler.Sku} name='Sku' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Sku</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} checked={gridChangehandler.Loc} name='Loc' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Loc</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} name='Qty' checked={gridChangehandler.Qty} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Qty</p>

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
                            <input type="checkbox" id="1" name='Status' checked={gridChangehandler.Status} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Status</p>

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
                            <input type="checkbox" id="1" name='Lottable08' checked={gridChangehandler.Lottable08} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Lottable08</p>

                        </div>
                    </div>


                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='Lottable09' checked={gridChangehandler.Lottable09} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Lottable09</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='Id' checked={gridChangehandler.Id} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>LPN</p>

                        </div>
                    </div>

                </Dialog>

            )}
        </>

    );
}

export default Inventorybalance;