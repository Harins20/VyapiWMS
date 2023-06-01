import * as React from 'react';
import { useState, useEffect } from 'react';
import Loader from "../../../components/Loader/Loader";
import { useLocalization } from '@progress/kendo-react-intl';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { useNavigate } from "react-router-dom";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { Button } from "@progress/kendo-react-buttons";
import { getPoHeader, deletepoheader } from "../../../services/PoService/PoService";
import { logDOM } from '@testing-library/react';
import { getRoles } from "../../../services/ConfigurationService/ConfigurationService";


const PoHeader = () => {

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
    const poheader = {
        "delete": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "creation": {
            "visible": "True",
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
    const [poHeaderTale, setpoHeaderTable] = useState([])
    const localizationService = useLocalization();
    const [dataState, setDataState] = React.useState(initialDataState);
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("");
    const [severity, setseverity] = useState("success");
    const [refresh, setrefresh] = useState(true)
    const [permissions, setpermissions] = useState(poheader)

    useEffect(async () => {
        LoadGridvalues();
        getRoles(token, "poheader").then((res) => {
            setpermissions(res)
        })
    }, [token])

    const LoadGridvalues = () => {
        setLoading(true)
        getPoHeader(token).then(res => {
            const tempDataValue = res.map(obj => {
                return { ...obj, checker: "" }
            })
            setpoHeaderTable(tempDataValue);
            setLoading(false)
        })
    }



    const onEdit = (e) => {
        navigate('/Po/Header/Creation', { state: { poHeader: e.dataItem, maction: "2" } });
    }

    const CommandCell = (e) => {
        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple" }} onClick={() => onEdit(e)} className="k-icon k-i-edit"></span>
            </td>
        );
    }

    const validateCheck = (e, rec) => {
        debugger
        var index = poHeaderTale.findIndex(p => p.SerialKey === rec.SerialKey);
        if (poHeaderTale[index].checker === "") {
            poHeaderTale[index].checker = "checked";
        }
        else {
            poHeaderTale[index].checker = "";
        }
    }

    const Deletecell = (e) => {
        const record = e.dataItem
        if (e.dataItem.checker !== "") {
            return (
                <td >
                    <input type="checkbox"  onChange={event => validateCheck(event, record)} value="" defaultChecked />
                </td>
            )
        }
        else {
            return (
                <td >
                    <input type="checkbox"  onChange={event => validateCheck(event, record)} value="" />
                </td>
            )
        }
    }

    const handledelete = () => {
        const deletereceords = poHeaderTale.filter(obj => obj.checker === 'checked').map(obj => { return { SerialKey: obj.SerialKey, POKey: obj.POKey, ExternPOKey: obj.ExternPOKey } })
        console.log(deletereceords)
        var timeout
        deletepoheader(deletereceords, token).then(res => {
            console.log(res)
            if (res === 'PurchaseOrder deleted') {
                setopen(true)
                setmessage(res)
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    setLoading(false);
                    LoadGridvalues()
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
    return (
        <>
            {loading && <Loader loading={loading} />}

            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>

                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.PoHeader')}</h3>
                    </div>
                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            {permissions.creation.visible === 'True' && <li className='text-uppercase  rounded-pill active' onClick={() => { navigate('/Po/Header/Creation', { state: { poHeader: "", maction: "1" } }); }}>New</li>}

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




                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid
                        style={{
                            height: "450",
                        }}
                        resizable={true}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        data={process(poHeaderTale, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                        onRowClick={(e) => {
                            navigate('/Po/Detail', { state: { poHeader: e.dataItem, maction: "1" } });
                        }}
                    >
                        <GridToolbar>
                            <div className='position-relative pe-3'>
                                <ul className='header-buttons'>
                                    <li className={permissions.delete.visible === 'True'? 'text-uppercase br-round-left active' : 'text-uppercase rounded-pill active'} onClick={LoadGridvalues}>Refresh</li>
                                    {permissions.delete.visible === 'True' && <li className='text-uppercase br-round-right active' onClick={handledelete}>Delete</li>}
 
                                </ul>
                            </div>
                        </GridToolbar>
                        {permissions.delete.visible === 'True' && <Column title="" filterable={false} className="edit-btn" width="60px" minResizableWidth={30} cell={Deletecell} />}
                        <Column field="POKey" title="Po" filterable={true} width={"250px"} />
                        <Column field="ExternPOKey" title="External Po" width={"250px"} filterable={true} />
                        <Column field="BuyersReference" title="Buyer Reference" width={"250px"} filterable={true} />
                        <Column field="SellersReference" title="Supplier Reference" width={"250px"} filterable={true} />

                        <Column field="statusdescr" title="Status" filterable={true} width={"250px"} />
                        <Column field="typedescr" title="Type" filterable={true} width={"250px"} />
                        <Column field="SUsr1" title="Price" filterable={true} width={"250px"} />

                        {permissions.update.visible === 'True' &&  <Column field="" title="" className="edit-btn" width={"250px"} filterable={false} cell={CommandCell} />}
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default PoHeader;