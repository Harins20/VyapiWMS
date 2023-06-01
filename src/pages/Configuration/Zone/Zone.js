import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalization } from '@progress/kendo-react-intl';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { getZone, putZone, DeleteZone, getRoles } from "../../../services/ConfigurationService/ConfigurationService";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Popup } from "@progress/kendo-react-popup";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { TextArea } from "@progress/kendo-react-inputs";
import { Input } from "@progress/kendo-react-inputs";
import {
    Slide
} from "@progress/kendo-react-animation";


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
const Zone = () => {

    const gridVisibility = {
        Location: true,
        LocationType: true,
        LocationFlag: true,
        LocationCategory: false,
        PutawayZone: false,
        AllocationZone: true,
        StackLimit: false

    }

    const ZoneValue = {
        PutawayZone: "",
        Descr: "",
        AddDate: "",
        AddWho: "",
        EditDate: "",
        EditWho: ""
    }
    const zone = {
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
        "import": {
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
    let navigate = useNavigate()
    const { state } = useLocation()
    let Client = localStorage.getItem("Client");

    //usestate
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const [zoneTable, setZonetTable] = useState([])
    const [ZoneCreateValues, setZoneCreateValues] = useState(ZoneValue);
    const [dataState, setDataState] = React.useState(initialDataState);
    const [gridChangehandler, setgridChangehandler] = useState(gridVisibility)
    const [show, setShow] = React.useState(false);
    const anchor = React.useRef(null);
    const [IConChange, setIConChange] = useState("");
    const [visible, setVisible] = React.useState(false);
    const [titleZone, settitleZone] = useState("Create Zone");
    const [Action, setAction] = useState("1");
    const [permissions, setpermissions] = useState(zone)

    //token
    let token = localStorage.getItem("selfToken");

    useEffect(() => {
        setLoading(true)
        loadingGridValues();
        getRoles(token, "zone").then((res) => {
            setpermissions(res)
        })
    }, [token])

    //get Zone Detail
    const loadingGridValues = () => {

        getZone(token).then((res) => {

            if (res) {
                const tempDataValue = res.map(obj => {
                    return { ...obj, checker: "" }
                })
                setZonetTable(tempDataValue);
            }
            else {
                setZonetTable([]);
            }
            setLoading(false)
        })
    }

    const handleChange = (event) => {



        const name = event.target.name;
        if (name === "PutawayZone") {
            const value = event.target.value;
            setZoneCreateValues({ ...ZoneCreateValues, [name]: value })
        }
        else {
            const value1 = event.value;
            setZoneCreateValues({ ...ZoneCreateValues, [name]: value1 })

        }







    }

    const CommandCell = (e) => {
        return (
            <td className="k-command-cell">
                {/* <p style={{cursor:"pointer"}} onClick={() =>onEdit(e)}>Edit</p> */}
                <span style={{ cursor: "pointer", color: "purple" }} onClick={() => onEdit(e)} class="k-icon k-i-edit"></span>
            </td>
        );
    }

    const onEdit = (e) => {
        ZoneCreateValues.PutawayZone = e.dataItem.PutawayZone;
        ZoneCreateValues.Descr = e.dataItem.Descr;
        setAction("2");
        settitleZone("Update Zone")
        ZoneCreation();

    }

    const validateCheck = (e) => {

        var index = zoneTable.findIndex(p => p.SerialKey == e.target.id);
        if (zoneTable[index].checker === "") {
            zoneTable[index].checker = "checked";
        }
        else {
            zoneTable[index].checker = "";
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

    const ZoneCreation = () => {
        setVisible(!visible);
    };

    const NewZone = () => {
        ZoneCreateValues.PutawayZone = "";
        ZoneCreateValues.Descr = "";
        setAction("");
        settitleZone("Create Zone")
        ZoneCreation();
    }
    const onSubmit = (e) => {
        setLoading(true);
        debugger





        if (Action == "2") {
            ZoneCreateValues.EditWho = localStorage.getItem('Client');
            ZoneCreateValues.EditDate = new Date();
            zonCreation("2");
        }
        else {
            ZoneCreateValues.AddWho = localStorage.getItem('Client');
            ZoneCreateValues.AddDate = new Date();
            ZoneCreateValues.EditWho = localStorage.getItem('Client');
            ZoneCreateValues.EditDate = new Date();
            zonCreation("1");
        }
    }

    const zonCreation = (event) => {
        if ((ZoneCreateValues.PutawayZone !== "") && (ZoneCreateValues.Descr !== "")) {

            putZone("[" + JSON.stringify(ZoneCreateValues) + "]", token, "1").then(res => {

                var timeout;
                setLoading(false);
                if (res === "Zone stored") {

                    setopen(true);
                    if (Action === "1") {
                        setmessage("Zone Created Successfully")
                    }
                    else {
                        setmessage("Zone Updated Successfully")

                    }
                    setseverity("success")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    setZoneCreateValues(ZoneValue);
                    ZoneCreation();
                    loadingGridValues();

                }
                else {
                    setopen(true);
                    if (Action === "1") {
                        setmessage("ZONE not created successfully")
                    }
                    else {
                        setmessage("ZONE not Updated Successfully")

                    }
                    setseverity("error")
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                }
            })
        }
        else {
            setLoading(false);
            var timeout;
            setopen(true);

            setmessage("Please fill mandatory field")


            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }

    }

    const DeleteZoneCall = () => {

        debugger
        const finalDeleteRecords = zoneTable.filter(obj => obj.checker === "checked").map(obj => {

            return { PutawayZone: obj.PutawayZone }
        })

        if (finalDeleteRecords.length > 0) {
            DeleteZone(JSON.stringify(finalDeleteRecords), token, "1").then(res => {

                if (res === "Zone deleted") {
                    var timeout;
                    setopen(true);
                    setmessage("Zone Deleted Successfully")
                    setseverity("success");
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    loadingGridValues();
                }
                else {
                    var timeout;
                    setopen(true);
                    setmessage(res)
                    setseverity("error");
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 4000);
                }
            })
        }
        else {
            var timeout;
            setopen(true);
            setmessage("Please Select Zone to delete")
            setseverity("warning");
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }

    }
    const handleclick = () => {
        navigate("/Config/Zone/excelupload")
    }

    return (
        <>
            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}

            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>

                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.Zone')}</h3>
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
                        data={process(zoneTable, dataState)}
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
                                        {permissions.create.visible === 'True' && <Button onClick={NewZone}>New</Button>}
                                        {permissions.import.visible === 'True' && <Button onClick={handleclick} >Import</Button>}
                                        {permissions.delete.visible === 'True' && <Button onClick={DeleteZoneCall} >Delete</Button>}
                                    </ButtonGroup>
                                </ul>
                            </div>

                        </GridToolbar>
                        {permissions.delete.visible === 'True' && <Column title="" filterable={false} className="edit-btn" width={60} cell={Deletecell} />}
                        <Column field="PutawayZone" title="Zone" filterable={true} />
                        <Column field="Descr" title="Description" filterable={true} />
                        <Column field="PickToLoc" title="Default Pick to Location" width={250} filterable={true} />
                        {permissions.update.visible === 'True' && <Column field="" title="" className="edit-btn" width={250} filterable={false} cell={CommandCell} />}
                    </Grid>
                </div>




            </div>

            {visible && (
                <Slide>
                    <Dialog title={titleZone} onClose={ZoneCreation}>
                        <div className='row' style={{ marginBottom: "0px" }}>
                            <div className='col-8' style={{ marginBottom: "0px" }}>
                                <p style={{ marginTop: "5px", marginBottom: "0px" }}>Zone *</p>
                                {Action === "2" ? (<Input maxLength="9" readOnly name='PutawayZone' value={ZoneCreateValues.PutawayZone || ""} style={{ width: '100%' }} onChange={handleChange} />
                                ) : (<Input maxLength="9" name='PutawayZone' value={ZoneCreateValues.PutawayZone || ""} style={{ width: '100%' }} onChange={handleChange} />)}

                            </div>
                        </div>
                        <div className='row' style={{ marginBottom: "0px" }}>
                            <div className='col-10' style={{ marginBottom: "0px" }}>
                                <p style={{ marginTop: "5px", marginBotton: "0px" }}>Description *</p>
                                <TextArea
                                    name='Descr' checked={ZoneCreateValues.Descr} onChange={handleChange}
                                    value={ZoneCreateValues.Descr || ""}
                                />
                            </div>
                        </div>


                        <DialogActionsBar>
                            {Action === "2" ? (
                                <button
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"

                                    style={{ background: "green", color: "white" }}

                                    onClick={onSubmit}
                                >
                                    Update
                                </button>) : (
                                <button
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"

                                    style={{ background: "green", color: "white" }}

                                    onClick={onSubmit}
                                >
                                    Create
                                </button>
                            )}
                            <button
                                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"

                                style={{ background: "Red", color: "white" }}
                                onClick={() => {
                                    setZoneCreateValues(ZoneValue);
                                }}
                            >
                                Clear
                            </button>
                        </DialogActionsBar>
                    </Dialog>
                </Slide>
            )}
        </>
    );
}

export default Zone;