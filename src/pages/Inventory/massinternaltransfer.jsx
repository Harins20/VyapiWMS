import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { useLocalization } from '@progress/kendo-react-intl';
import { WithSnackbar } from "../../../src/components/form/Notification";
import { useState } from "react";
import Loader from "../../components/Loader/Loader"
import { Input as KendoInput, NumericTextBox } from '@progress/kendo-react-inputs';
import { massinternaltransferapi } from "../../services/InventoryService/InventoryBalanceService"



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

const Massinternaltransfer = () => {

    const { state } = useLocation()
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState("success");
    const localizationService = useLocalization();
    var transfer = state && state.transfer;
    let navigate = useNavigate()
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    transfer = transfer.map(obj => {return {...obj, ToLottable09 : "", ToLoc : "", ToQty : 0}})
    const [dataState, setDataState] = useState(initialDataState);
    const [transferdet, settransferdet] = useState(transfer);


    const handleButtonClick = () => {
        console.log(transferdet)
        debugger
        const newState = transferdet.map(obj => {
                return {  FromStorerKey: obj.StorerKey, FromPackKey: 'FTWZ-1-999', FromSku: obj.Sku, FromLot : obj.Lot, FromQty : obj.ToQty, ToLot : '', FromLoc: obj.Loc,ToPackKey : 'FTWZ-1-999',
                ToStorerKey : obj.StorerKey,ToSku : obj.Sku,ToQty : obj.ToQty,ToLoc : obj.ToLoc, LOTTABLE01 : obj.Lottable01 , LOTTABLE02 : obj.Lottable02, LOTTABLE03: obj.Lottable03, 
                LOTTABLE04 : obj.Lottable04, LOTTABLE07: obj.Lottable07, LOTTABLE08 : obj.Lottable08, LOTTABLE09 : obj.ToLottable09, LOTTABLE10 : obj.Lottable10, SerialKey : obj.SerialKey};
        })
        console.log(newState)
    {/* LOTTABLE05 : obj.LOTTABLE05, LOTTABLE06 : obj.LOTTABLE06, LOTTABLE11 : obj.Lottable11,LOTTABLE12 : obj.Lottable12, */}
        
        console.log(JSON.stringify(newState))

        setLoading(true);
        massinternaltransferapi(newState, token).then(res => {
            if(res === "Successfully posted to WMS"){
                var timeout;
                setLoading(false);
                setopen(true);
                setmessage("Moved")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    navigate('/Inventory')
                }, 2000);  
            }
            else{
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

    const handleChange = (event, item) => {
        debugger
        console.log(item)
        console.log(event)
        const datafield = event.target.name;
        const value = event.target.value;
        const id = item.SerialKey
        const index = transfer.findIndex(obj => obj.SerialKey === id);
        var timeout
        if (value > item.Qty-item.QtyAllocated-item.QtyPicked && datafield === 'ToQty') {
            setopen(true)
            setmessage('Qty input is greater than available qty')
            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 3000);
            setLoading(false);
        }
        else{
            let records = [...transfer]
            let record = { ...records[index] }
            record[datafield] = value
            transfer[index] = record
            console.log(transfer)
        }
        
    }

    const tolottable09inp = (e) => {
        console.log(e)
        return (
            <td>
                <KendoInput
                    type="text"
                    name="ToLottable09"
                    onChange={event  => handleChange(event, e.dataItem)}
                    defaultValue={e.dataItem.ToLottable09}
                />
            </td>
        )
    }

    const tolocinp = (e) => {
        return (
            <td>
                <KendoInput
                    type="text"
                    name="ToLoc"
                    onChange={event  => handleChange(event, e.dataItem)}
                    defaultValue={e.dataItem.ToLoc}
                    
                />
            </td>
        )
    } 

    const qtyinp = (e) => {
        return (
            <td>
                <NumericTextBox
                    min={1}
                    max={9999}
                    name="ToQty"
                    onChange={event  => handleChange(event, e.dataItem)}
                    spinners={false}
                    defaultValue={e.dataItem.ToQty}
                />
            </td>
        )
    }


    return (<>
    {loading && <Loader loading={loading} />}
    <div id="Planning" className="inbound-page main-content">
        <WithSnackbar open={open} message={message} severity={severity} />
        <div className="d-flex mt-5 justify-content-between">
            <div className='ps-3'>
                <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.Consolidate')}</h3>
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
                data={process(transferdet, dataState)}
                {...dataState}
                onDataStateChange={(e) => {
                    setDataState(e.dataState);
                }}
            >



                <Column field="Sku" title="SKU" filterable={true} />
                <Column field="Loc" title="Location" filterable={true} />
                <Column field="Lot" title="Lot" filter="numeric" />
                <Column field="Qty" title="QTY" filter="numeric" cell={(e) => {return(<td> {e.dataItem.Qty-e.dataItem.QtyAllocated-e.dataItem.QtyPicked} </td>)}} />
                <Column field="Lottable09" title="From Hu" filterable={true} />
                <Column title="To HU" filterable={false} cell={tolottable09inp} />
                <Column title="Qty" filterable={false} cell={qtyinp} />
                <Column title="To Loc" filterable={false} cell={tolocinp} />
            </Grid>
        </div>
    </div>
    </>)
}

export default Massinternaltransfer;