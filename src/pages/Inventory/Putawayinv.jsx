
import * as React from 'react';
import { useLocation } from "react-router-dom";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { putawayservice } from "../../services/PutawayService/PutawayService"
import { useNavigate } from "react-router-dom";
import { useLocalization } from '@progress/kendo-react-intl';
import { WithSnackbar } from "../../../src/components/form/Notification";
import { useState } from "react";
import Loader from "../../components/Loader/Loader"
import { Input as KendoInput, NumericTextBox } from '@progress/kendo-react-inputs';

const initialDataState = {
    sort: [
        {
            field: "code",
            dir: "asc",
        },
    ],
    take: 10,
    skip: 0,
    logic: "and",
    filters: [
        {
            field: "Sku",
            operator: "contains",
            value: "",
        },
    ],
};



const Putawayinv = () => {

    const { state } = useLocation()
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState("success");
    var putaway = state && state.putaway;
    for (let i = 0; i <= putaway.length - 1; i++) {
        putaway[i].ToLoc = ""
        putaway[i].ToQty = 0
        putaway[i].ToId = ""
    }
    console.log(putaway)
    var newstate;
    const [dataState, setDataState] = React.useState(initialDataState);
    const [putawaydet, setputawaydet] = React.useState(putaway)
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let navigate = useNavigate()
    const localizationService = useLocalization();
    const tolocinp = (e) => {
        console.log(e)
        return (
            <td>
                <KendoInput
                    type="text"
                    name={e.dataItem.SerialKey}
                    Defaultvalue={e.dataItem.ToLoc}
                    onChange={handleChange}
                />
            </td>
        )
    }

    const qtyinp = (e) => {
        return (
            <td>
                <NumericTextBox
                    min="1"
                    max="9999"
                    name={e.dataItem.SerialKey}
                    onChange={handleqtyChange}
                    spinners={false}
                    defaultvalue={e.dataItem.ToQty || 0}
                />
            </td>
        )
    }

    

    const toidinp = (e) => {
        console.log(e)
        return (
            <td>
                <KendoInput
                    type="text"
                    name={e.dataItem.SerialKey}
                    Defaultvalue={e.dataItem.ToId}
                    onChange={handlelpnChange}
                />
            </td>
        )
    }

    const handleqtyChange = (event) => {
        debugger
        const id = event.target.name;
        const value = event.target.value;
        const index = putaway.findIndex(obj => obj.SerialKey === id);
        console.log(value, id);
        let records = [...putaway]
        let record = { ...records[index] }
        record.ToQty = value
        putaway[index] = record
        console.log(putaway)
        setputawaydet(putaway)
        newstate = putawaydet.map(obj => {
            return { FromLot: obj.Lot, FromLoc: obj.Loc, Qty: obj.ToQty, ToLoc: obj.ToLoc, FromId: obj.Id, ToId: obj.ToId }
        });
    }

    const handleChange = (event) => {
        const id = event.target.name;
        const value = event.target.value;
        const index = putaway.findIndex(obj => obj.SerialKey === id);
        console.log(value, id);
        let records = [...putaway]
        let record = { ...records[index] }
        record.ToLoc = value
        putaway[index] = record
        console.log(putaway)
        setputawaydet(putaway)
        newstate = putawaydet.map(obj => {
            return { FromLot: obj.Lot, FromLoc: obj.Loc, Qty: obj.ToQty, ToLoc: obj.ToLoc, FromId: obj.Id, ToId: obj.ToId }
        });

    }


    const handlelpnChange = (event) => {
        const id = event.target.name;
        const value = event.target.value;
        const index = putaway.findIndex(obj => obj.SerialKey === id);
        console.log(value, id);
        let records = [...putaway]
        let record = { ...records[index] }
        record.ToId = value
        putaway[index] = record
        console.log(putaway)
        setputawaydet(putaway)
        newstate = putawaydet.map(obj => {
            return { FromLot: obj.Lot, FromLoc: obj.Loc, Qty: obj.ToQty, ToLoc: obj.ToLoc, FromId: obj.Id, ToId: obj.ToId }
        });

    }

    const handleButtonClick = () => {
        var timeout;
        debugger
        putawayservice(newstate, token, 1).then((res) => {
            if (res === "Successfully posted to WMS") {
                setopen(true)
                setmessage("Move success")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    navigate('/Inventory')
                }, 2000);
                
            }
            else if (res.includes("Please check the incorrect Locations :")) {
                setopen(true)
                setmessage("Please check for incorrect Locations")
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 3000);
            }
            else if (res.includes("Hold Locations:")) {
                console.log(res)
                if (window.confirm("Please confirm if you wish to move inventory to hold locations")) {
                    putawayservice(newstate, token, 2).then((res) => {
                        if (res === "Successfully posted to WMS") {
                            setopen(true)
                            setmessage("Move success")
                            setseverity("success")
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                                setopen(false);
                                navigate('/Inventory')
                            }, 2000);
                            
                        }
                        else {
                            setopen(true)
                            setmessage(res)
                            setseverity("error")
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                                setopen(false);
                                navigate('/Inventory')
                            }, 4000);
                            
                        }
                    })
                }
            }
            else {
                console.log(res)
                setopen(true)
                setmessage(res)
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    navigate('/Inventory')
                }, 4000);
               
            }
            //setLoading(false)
        })
        console.log(JSON.stringify(newstate))
        //res.includes("Please check the incorrect Locations :")

    }




    return (
        <>
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
                <WithSnackbar open={open} message={message} severity={severity} />
                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-3'>
                        <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.putaway')}</h3>
                    </div>
                    <div className='position-relative pe-3'>
                        <Button onClick={handleButtonClick} className='text-uppercase br-round' >Finalize Move</Button>
                    </div>
                </div>
                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        style={{
                            height: "450",
                        }}
                        data={process(putawaydet, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >



                        <Column field="Sku" title="SKU" filterable={true} />
                        <Column field="Loc" title="Location" filterable={true} />
                        <Column field="Qty" title="QTY" filter="numeric" />
                        <Column field="QtyAllocated" title="QtyAllocated" filter="numeric" />
                        <Column field="Lot" title="Lot" filter="numeric" />
                        <Column field="QtyPicked" title="QtyPicked" filter="numeric" />
                        <Column field="Lottable08" title="LOTTABLE 08" filterable={true} />
                        <Column field="Lottable09" title="LOTTABLE 09" filterable={true} />
                        <Column field="Id" title="LPN" filterable={true} />
                        <Column title="To Location" filterable={false} cell={tolocinp} />
                        <Column title="Move Qty" filterable={false} cell={qtyinp} />
                        <Column title="To LPN" filterable={false} cell={toidinp} />
                    </Grid>
                </div>
            </div>
        </>)
}

export default Putawayinv;