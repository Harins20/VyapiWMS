import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalization } from '@progress/kendo-react-intl';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { getPack, delPack, getRoles } from "../../../services/ConfigurationService/ConfigurationService";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
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


const Pack = () => {

    let navigate = useNavigate()
    const pack = {
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

    //declare service
    const localizationService = useLocalization();

    //usestate
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const [itemTable, setItemTable] = useState([])
    const [dataState, setDataState] = React.useState(initialDataState);
    const [visible, setVisible] = useState(false);
    const [permissions, setpermissions] = useState(pack)
    //token
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");

    useEffect(() => {
        setLoading(true)
        loadingGridValues();
        getRoles(token, "pack").then((res) => {
            setpermissions(res)
        })
    }, [token])


    //grid values
    const loadingGridValues = () => {
        setLoading(true)
        getPack(token).then((res) => {
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
        navigate('/Config/Pack/Creation', { state: { packkey: e } })
    }


    const CommandCell = (e) => {

        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple", marginRight: "10px" }} onClick={() => editclick(e.dataItem)} className="k-icon k-i-edit"></span>
            </td>
        );
    };



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


    const toggleDialog = (e) => {
        setVisible(!visible);
    };

    const deleteclick = () => {
        const finalobj = itemTable.filter(obj => obj.checker === 'checked').map(obj => { return { PackKey: obj.packkey, StorerKey: Client } })
        var timeout;
        delPack(finalobj, token).then(res => {
            if (res === 'Successfully posted to WMS') {
                setopen(true);
                setmessage("Deleted  Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
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
                }, 3000);
                setLoading(false);
            }
        })
        setVisible(!visible);
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
                    <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{Client} - {localizationService.toLanguageString('custom.PackMaster')}</h3>
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
                                        {permissions.create.visible === "True" && <Button onClick={() => {
                                            navigate('/Config/Pack/Creation')
                                        }}  >New</Button>}
                                        {permissions.delete.visible === "True" && <Button onClick={toggleDialog} fillMode="solid" >Delete</Button>}
                                    </ButtonGroup>
                                </ul>
                            </div>
                        </GridToolbar>
                        {permissions.delete.visible === "True" && <Column title="" filterable={false} className="edit-btn" width={60} cell={Deletecell} />}
                        <Column field="packkey" title="Packkey" width={250} filterable={true} />
                        <Column field="packdescr" title="Description" width={250} filterable={true} />
                        <Column field="CASECNT" title="Case Qty" width={250} filterable={true} />
                        <Column field="PALLET" title="Pallet Qty" width={250} filterable={true} />
                        <Column field="QTY" title="Master Unit Quantity" width={250} filterable={true} />
                        {permissions.update.visible === "True" && <Column field="" title="" className="edit-btn" width={50} filterable={false} cell={CommandCell} />}
                    </Grid>
                </div>


            </div>
        </>
    );
}


export default Pack;