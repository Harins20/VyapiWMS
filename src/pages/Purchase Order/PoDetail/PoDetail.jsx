import * as React from 'react';
import { useState, useEffect } from 'react';
import Loader from "../../../components/Loader/Loader";
import { useLocalization } from '@progress/kendo-react-intl';
import { Grid, GridColumn as Column,GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { useNavigate } from "react-router-dom";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { Button } from "@progress/kendo-react-buttons";
import { logDOM } from '@testing-library/react';
import { useLocation } from "react-router-dom";
import { getPoDetailList } from "../../../services/PoService/PoService";
import { Input as KendoInput } from '@progress/kendo-react-inputs';
import { Label } from '@progress/kendo-react-labels';
import { getRoles } from "../../../services/ConfigurationService/ConfigurationService";

const PoDetail = () => {

    const initialDataState = {
        sort: [
            {
                field: "code",
                dir: "asc",
            },
        ],
        take: 5,
        skip: 0,
    };
    const podetail = {
        "delete": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "asncreation": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "creation": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "update": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        }
    }

    let token = localStorage.getItem("selfToken");
    let navigate = useNavigate();

    const [loading, setLoading] = useState(true)
    const [poDetailTable, setpoDetailTable] = useState([])
    const localizationService = useLocalization();
    const [dataState, setDataState] = React.useState(initialDataState);
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("");
    const [severity, setseverity] = useState("");
    const [refresh, setrefresh] = useState(true)
    const [permissions, setpermissions] = useState(podetail)
    const { state } = useLocation()
    const PoHeaderValueUpdate = state && state.poHeader;
    const Action = state && state.maction;

    useEffect(async () => {
        console.log(PoHeaderValueUpdate);
        console.log(Action);
        setLoading(true)

        LoadGridvalues();
        setLoading(false)
        getRoles(token, "podetail").then((res) => {
            setpermissions(res)
        })

    }, [token])

    const LoadGridvalues = () => {
        //grid data
        getPoDetailList(token, PoHeaderValueUpdate.POKey).then(res => {
            const tempDataValue = res.map(obj => {
                return { ...obj, checker: "" }
            })
            console.log(tempDataValue);
            setpoDetailTable(tempDataValue);
        })
    }

    const onEdit = (e) => {

        navigate('/Po/Detail/Creation', { state: { poDetail: e.dataItem, maction: "2", lineno: e.dataItem.POLineNumber, poHeader : state.poHeader } })
    }

    const CommandCell = (e) => {
        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple" }} onClick={() => onEdit(e)} class="k-icon k-i-edit"></span>
            </td>
        );
    }

    const validateCheck = (e) => {

        var index = poDetailTable.findIndex(p => p.SerialKey == e.target.id);
        if (poDetailTable[index].checker === "") {
            poDetailTable[index].checker = "checked";
        }
        else {
            poDetailTable[index].checker = "";
        }
    }

    const Deletecell = (e) => {
        const serialkey = e.dataItem.SerialKey
        if (e.dataItem.checker !== "") {
            return (
                <td >
                    <input type="checkbox" id={serialkey} onChange={validateCheck} value="" defaultChecked />
                </td>
            )
        }
        else {
            return (
                <td >
                    <input type="checkbox" id={serialkey} onChange={validateCheck} value="" />
                </td>
            )
        }
    }

    const valueCell = (e) => {

        return (<td>{parseInt(e.dataItem.QtyOrdered) * parseInt(e.dataItem.UnitPrice)}</td>)
    }

    const ReceivedValuecell = (e) => {
        return (<td>{parseInt(e.dataItem.QtyReceived) * parseInt(e.dataItem.UnitPrice)}</td>)
    }
    const createasn = () => {
        var timeout;
        const tempselectedrecords = poDetailTable.filter(obj => obj.checker === 'checked')
        if (tempselectedrecords.length > 0) {
            navigate('/Po/Detail/ASN', { state: { 'asndetails': tempselectedrecords, 'poheader': PoHeaderValueUpdate } })
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


    const handlerefreshclick = () => {
        setLoading(true)
        LoadGridvalues();
        setLoading(false)
    }
    return (
        <>
            {loading && <Loader loading={loading} />}

            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>
                <div className="d-flex mt-3 justify-content-between">
                    <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.PoDetail')}</h3>
                    </div>
                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            {permissions.creation.visible === 'True' && <li className='text-uppercase br-round-left active' onClick={() => {
                                let lineno = ""

                                if (poDetailTable.length > 0) {
                                    lineno = String(parseInt(poDetailTable[poDetailTable.length - 1].POLineNumber) + 1).padStart(5, '0')
                                }
                                else {
                                    lineno = "00001"
                                }
                                navigate('/Po/Detail/Creation', { state: { poDetail: PoHeaderValueUpdate, maction: "1", lineno: lineno, poHeader : state.poHeader } })
                            }}>New</li>}
                            <li className={permissions.creation.visible === 'True' ? 'text-uppercase br-round-right active' : 'text-uppercase rounded-pill active'}onClick={() => {
                               
                               navigate('/Po')
                           }}>back</li>

                        </ul>
                    </div>
                </div>

                {/* <div className='row'>
                <div className='col-10'>
                </div>
                <div className='col-2'>
                    <button
                        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                        onClick={showPooup}
                        ref={anchor}
                    >
                        {show ? "Close " : "Custom Grid selector"}
                    </button>
                </div>
            </div> */}

                <div className='mt-1 bg-white m-3 p-3 ps-4 border rounded'>
                    <div className='row'>
                        <div className='col-md-4  float-start mt-3'>
                            <div className=''>
                                <Label >Po Key</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="POKey"
                                    value={PoHeaderValueUpdate.POKey || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='col-md-4 float-start mt-3'>
                            <div className=''>
                                <Label >External PoKey</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="ExternPOKey"
                                    value={PoHeaderValueUpdate.ExternPOKey || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='col-md-4 float-start mt-3'>
                            <div className=''>
                                <Label >Po Date</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="PODate"
                                    value={PoHeaderValueUpdate.PODate || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-4 float-start mt-3'>
                            <div className=''>
                                <Label >Po Type</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="POType"
                                    value={PoHeaderValueUpdate.typedescr || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='col-md-4 float-start mt-3'>
                            <div className=''>
                                <Label >Owner</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="StorerKey"
                                    value={PoHeaderValueUpdate.StorerKey || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>

                        </div>

                        <div className='col-md-4 float-start mt-3'>
                            <div className=''>
                                <Label >Open Qty</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="OpenQty"
                                    value={PoHeaderValueUpdate.OpenQty || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-4 float-start mt-3'>
                            <div className=''>
                                <Label >External PoKey2</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="ExternalPOKey2"
                                    value={PoHeaderValueUpdate.ExternalPOKey2 || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='col-md-4 float-start mt-3'>
                            <div className=''>
                                <Label >Buyer Name</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="BuyerName"
                                    value={PoHeaderValueUpdate.BuyerName || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='col-md-4 float-start mt-3'>
                            <div className=''>
                                <Label >UDF1</Label>
                            </div>
                            <div className=''>
                                <KendoInput
                                    type="text"
                                    id="SUsr1"
                                    value={PoHeaderValueUpdate.SUsr1 || ""}
                                    //onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
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
                        data={process(poDetailTable, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                
                            <GridToolbar>
                      <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            <li className={(permissions.asncreation.visible === 'True' || permissions.delete.visible === 'True') ? 'text-uppercase br-round-left active' : 'text-uppercase rounded-pill active'} onClick={handlerefreshclick}>Refresh</li>
                            {permissions.asncreation.visible === 'True' && <li className={ permissions.delete.visible === 'True' ? 'text-uppercase br-round active' : 'text-uppercase br-round-right active' } onClick={createasn}>ASN</li>}
                            {permissions.delete.visible === 'True' && <li className='text-uppercase br-round-right active'>Delete</li>}

                        </ul>
                    </div>
                        </GridToolbar>
                        {(permissions.asncreation.visible === 'True' || permissions.delete.visible === 'True') && <Column title="" filterable={false} className="edit-btn" width={"60px"} cell={Deletecell} />}
                        <Column field="ExternPOKey" title="External Po" width={"250px"} filterable={true} />
                        <Column field="POLineNumber" title="Po Line Number" width={"250px"} filterable={true} />
                        <Column field="Sku" title="Item" filterable={true} width={"250px"} />
                        <Column field="SKUDescription" title="Description" width={"250px"} filterable={true} />
                        <Column field="QtyOrdered" title="Ordered Qty" width={"250px"} filterable={true} />

                        <Column field="QtyReceived" title="Received Qty" filterable={true} width={"250px"} />
                        {/* <Column field="AllocationZone" title="Status" filterable={true} /> */}
                        <Column title="Value(Price)" filterable={false} cell={valueCell} width={"250px"} />
                        <Column title="Received Value(Price)" filterable={false} cell={ReceivedValuecell} width={"250px"} />
                        {permissions.update.visible === 'True' &&  <Column field="" title="ACTION" className="edit-btn" filterable={false}width={"100px"} cell={CommandCell} />}
                    </Grid>
                </div>




            </div>
        </>
    );
}

export default PoDetail;