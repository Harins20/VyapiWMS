import * as React from 'react';
import { useLocation } from "react-router-dom";
import Loader from "../../../components/Loader/Loader"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalization } from '@progress/kendo-react-intl';
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { process } from "@progress/kendo-data-query";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { NumericTextBox } from '@progress/kendo-react-inputs';
import { CreateASNfrompo } from "../../../services/PoService/PoService";
import { getSingleReceiptHeader } from  "../../../services/InboundService/InboundService";


const initialDataState = {
    sort: [
        {
            field: "code",
            dir: "asc",
        },
    ],
    take: 10,
    skip: 0
};


const Poasn = () => {

    const { state } = useLocation()
    const asndetailsfrompodetail = state && state.asndetails;
    const PoHeader = state && state.poheader
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState("success");
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let navigate = useNavigate()
    const localizationService = useLocalization();
    const [dataState, setDataState] = useState(initialDataState);
    const [podet, setpodet] = useState(asndetailsfrompodetail)

    const handleButtonClick = () => {
        var timeout;
        console.log(podet)
        console.log(JSON.stringify(podet))
        CreateASNfrompo(podet, token).then(res => {
            debugger
            if (res.split(".")[0] === "Successfully posted to WMS") {
                setopen(true);
                setmessage("Created Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    getSingleReceiptHeader(res.split(".")[1].split("#")[1], token).then((resp) => {
                        if (resp) {
                            setLoading(false)
                            debugger
                            navigate('/inbound/details', { state: { inboundDetail: resp[0] } })
                        }
                    })
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
                setLoading(false);
            }
        })
        
    }

    const handleqtyChange = (event) => {
        var timeout;
        const id = event.target.name;
        const value = event.target.value;
        const index = podet.findIndex(obj => obj.SerialKey === id);
        console.log(value, id);
        if (value <= podet[index].QtyOrdered - podet[index].QtyReceived) {
            let records = [...podet]
            let record = { ...records[index] }
            record.Qtyexpected = value
            podet[index] = record
            setpodet(podet)
        }
        else {
            setopen(true)
            setmessage('Qty input is greater than Ordered qty')
            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 3000);
            setLoading(false);
        }
    }

    const qtyinp = (e) => {
        return (
            <td>
                <NumericTextBox
                    min={1}
                    max={9999}
                    name={e.dataItem.SerialKey}
                    onChange={handleqtyChange}
                    spinners={false}
                    value={e.dataItem.Qtyexpected}
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
                    <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.poasn')}</h3>
                </div>
                <div className='position-relative pe-3'>
                    <Button onClick={handleButtonClick} className='text-uppercase br-round' >Finalize ASN details</Button>
                </div>
            </div>
            <div className='table-section mt-3 ps-3 pe-3'>
                <Grid
                    style={{
                        height: "450",
                    }}
                    pageable={true}
                    sortable={true}
                    filterable={true}
                    data={process(podet, dataState)}
                    {...dataState}
                    onDataStateChange={(e) => {
                        setDataState(e.dataState);
                    }}
                >

                    <Column field="ExternPOKey" title="External Po" filterable={true} />
                    <Column field="POLineNumber" title="Po Line Number" filterable={true} />
                    <Column field="Sku" title="Item" filterable={true} />
                    <Column field="SKUDescription" title="Description" filterable={true} />
                    <Column title="Qty" filterable={true} cell={(e) => { return (<td> {e.dataItem.QtyOrdered - e.dataItem.QtyReceived} </td>) }} />

                    {/*<Column field="QtyReceived" title="Received Qty" filterable={true} />
                     <Column field="AllocationZone" title="Status" filterable={true} /> 
                        <Column field="" title="ACTION" className="edit-btn" filterable={false} cell={CommandCell} />
                        <Column title="" filterable={false} className="edit-btn" width="60px" cell={Deletecell} />*/}
                    <Column field="UOM" title="Uom" filterable={true} />
                    <Column title="Qty Expected" filterable={false} cell={qtyinp} />


                </Grid>
            </div>
        </div>
    </>)
}


export default Poasn;