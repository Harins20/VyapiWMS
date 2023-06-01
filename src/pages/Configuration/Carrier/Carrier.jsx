import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalization } from '@progress/kendo-react-intl';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { getStorerkeys, deletetorerKeys, getRoles } from "../../../services/ConfigurationService/ConfigurationService"
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";


//initialstate // test
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


const Carrier = () => {

    let navigate = useNavigate()
    const carrier = {
        "create": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "delete": {
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

    const localizationService = useLocalization();

    //usestate
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState("");
    const [itemTable, setItemTable] = useState([])
    const [dataState, setDataState] = useState(initialDataState);
    const [visible, setVisible] = useState(false);
    const [permissions, setpermissions] = useState(carrier)


    //token
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");

    useEffect(() => {
        setLoading(true)
        loadingGridValues();
        getRoles(token, "carrier").then((res) => {
            setpermissions(res)
        })
    }, [token])


    //grid values
    const loadingGridValues = () => {
        setLoading(true)
        getStorerkeys(token, 3).then((res) => {
            console.log(res);
            if (res) {
                const tempDataValue = res.map(obj => {
                    return { ...obj, checker: "" }
                })
                setItemTable(tempDataValue);
            }
            else {
                setItemTable([]);
            }
            setLoading(false)
        })
    }

    const editclick = e => {
        navigate('/Config/Carrier/Creation', { state: { Carrierdetail: e } })
    }


    const CommandCell = (e) => {

        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple", marginRight: "10px" }} onClick={() => editclick(e.dataItem)} className="k-icon k-i-edit"></span>

            </td>
        );
    };

    const toggleDialog = (e) => {
        setVisible(!visible);
    };

    const deleteclick = () => {
        debugger
        const finalobj = itemTable.filter(obj => obj.checker === 'checked').map(obj => { return { StorerKey: obj.StorerKey } });
        var timeout;
        deletetorerKeys(finalobj, token, 3).then(res => {
            if (res === "Successfully posted to WMS") {
                setopen(true);
                setmessage("Deleted  Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    loadingGridValues();
                }, 2000);
                setLoading(false);
                loadingGridValues();
            }
            else {

                setopen(true)
                setmessage(res)
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                    loadingGridValues();
                }, 3000);
                setLoading(false);
            }
        })
        setVisible(!visible);
    }


    const validateCheck = (event, serialkey) => {

        var index = itemTable.findIndex(p => p.SerialKey == serialkey);
        if (itemTable[index].checker === "") {
            itemTable[index].checker = "checked";
        }
        else {
            itemTable[index].checker = "";
        }
    }


    const Deletecell = (e) => {
        const serialkey = e.dataItem.SerialKey
        if (e.dataItem.checker !== "") {
            return (
                <td >
                    <input type="checkbox" onChange={event => validateCheck(event, serialkey)} value="" defaultChecked />
                </td>
            )
        }
        else {
            return (
                <td >
                    <input type="checkbox" onChange={event => validateCheck(event, serialkey)} value="" />
                </td>
            )
        }
    }


    return (
        <>
            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                    {visible && (
                        <Dialog title={"Please confirm"} onClose={toggleDialog}>
                            <p
                                style={{
                                    margin: "25px",
                                    textAlign: "center",
                                }}
                            >
                                Are you sure you want to Delete?
                            </p>
                            <DialogActionsBar>
                                <button
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                                    onClick={() => { setVisible(!visible); }}
                                >
                                    No
                                </button>
                                <button
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                                    onClick={deleteclick}
                                >
                                    Yes
                                </button>
                            </DialogActionsBar>
                        </Dialog>
                    )}
                </div>
                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{Client} - Carrier</h3>
                    </div>

                </div>

                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid
                        style={{
                            height: "450",
                        }}
                        resizable={true}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        data={process(itemTable, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        <GridToolbar>

                            <div className='position-relative pe-3'>
                                <ul className='header-buttons'>
                                    <ButtonGroup>
                                        <Button onClick={() => {
                                            setLoading(true)
                                            loadingGridValues();
                                        }} >Refresh</Button>
                                        {permissions.create.visible === "True" && <Button type="button" onClick={() => {
                                            navigate('/Config/Carrier/Creation')
                                        }}  >New</Button>}
                                        {permissions.delete.visible === "True" && <Button onClick={toggleDialog} >Delete</Button>}
                                    </ButtonGroup>
                                </ul>
                            </div>

                        </GridToolbar>
                        {permissions.delete.visible === "True" && <Column title="" filterable={false} className="edit-btn" width="60px" cell={Deletecell} />}
                        <Column field="StorerKey" title="Carriercode" width={250} filterable={true} />
                        <Column field="Company" title="Company" width={250} filterable={true} />
                        <Column field="Scac_Code" title="Scac Code" width={250} filterable={true} />
                        <Column field="Address1" title="Address1" width={250} filterable={true} />
                        <Column field="Address2" title="Address2" width={250} filterable={true} />
                        {permissions.update.visible === "True" && <Column field="" title="" className="edit-btn" width={250} filterable={false} cell={CommandCell} />}
                    </Grid>
                </div>


            </div>
        </>
    );
}


export default Carrier;