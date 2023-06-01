import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalization } from '@progress/kendo-react-intl';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { getLocation, DeleteLoc, getRoles } from "../../../services/ConfigurationService/ConfigurationService";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Dialog } from "@progress/kendo-react-dialogs";
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

const LocatioMaster = () => {

    const gridVisibility = {
        Location: true,
        LocationType: true,
        LocationFlag: true,
        LocationCategory: false,
        PutawayZone: false,
        AllocationZone: true,
        StackLimit: false

    }
    const loc = {
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

    //declare service
    const localizationService = useLocalization();
    let navigate = useNavigate()
    const { state } = useLocation()

    //usestate
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const [locationTable, setLocationTable] = useState([])
    const [dataState, setDataState] = React.useState(initialDataState);
    const [gridChangehandler, setgridChangehandler] = useState(gridVisibility)
    const [visible, setVisible] = React.useState(false);
    const anchor = React.useRef(null);
    const [titleZone, settitleZone] = useState("Column Selector");
    const [permissions, setpermissions] = useState(loc)


    //token
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let username = localStorage.getItem("UserName")

    useEffect(() => {
        setLoading(true)
        loadingGridValues();
        getRoles(token, "loc").then((res) => {
            setpermissions(res)
        })
    }, [token])

    //grid values
    const loadingGridValues = () => {

        getLocation(token).then((res) => {
            if (res) {
                const tempDataValue = res.map(obj => {
                    return { ...obj, checker: "" }
                })
                setLocationTable(tempDataValue);
            }
            else {
                setLocationTable([]);
            }
            setLoading(false)
        })
    }

    const handleGridChange = (event) => {

        const name = event.target.name;
        const value = event.target.checked;

        const countValue = Object.values(gridChangehandler).filter(obj => obj === true).length

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

    const onEdit = (e) => {

        navigate('/Config/location/Creation', { state: { LocationUpdate: e.dataItem, maction: "2" } })
    }

    const CommandCell = (e) => {
        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple" }} onClick={() => onEdit(e)} class="k-icon k-i-edit"></span>
            </td>
        );
    }

    const validateCheck = (e) => {

        var index = locationTable.findIndex(p => p.SerialKey == e.target.id);
        if (locationTable[index].checker === "") {
            locationTable[index].checker = "checked";
        }
        else {
            locationTable[index].checker = "";
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
    const DeleteLocation = () => {

        const finalDeleteRecords = locationTable.filter(obj => obj.checker === "checked").map(obj => {

            return { Loc: obj.Loc }
        })

        if (finalDeleteRecords.length > 0) {
            DeleteLoc(JSON.stringify(finalDeleteRecords), token, "1").then(res => {

                if (res === "Location deleted") {
                    var timeout;
                    setopen(true);
                    setmessage("Location Deleted Successfully")
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
            setmessage("Please Select Location to delete")
            setseverity("warning");
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }


    }
    const visibleGrid = () => {
        setVisible(!visible);
    };

    const handleuploadclick = () => {
        navigate("/Config/location/excelupload")
    }
    return (
        <>
            {loading && <Loader loading={loading} />}

            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>

                <div className="d-flex flex-wrap mt-2 justify-content-between">
                    <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.Location')}</h3>
                    </div>

                </div>


                {visible && (<Dialog title={titleZone} onClose={visibleGrid}>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} name='Location' checked={gridChangehandler.Location} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Location</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} checked={gridChangehandler.LocationType} name='LocationType' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>LocationType</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} checked={gridChangehandler.LocationFlag} name='LocationFlag' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>LocationFlag</p>

                        </div>
                    </div>



                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='LocationCategory' checked={gridChangehandler.LocationCategory} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>LocationCategory</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='StackLimit' checked={gridChangehandler.StackLimit} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>StackLimit</p>

                        </div>
                    </div>


                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='PutawayZone' checked={gridChangehandler.PutawayZone} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>PutawayZone</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='AllocationZone' checked={gridChangehandler.AllocationZone} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>AllocationZone</p>

                        </div>
                    </div>


                </Dialog>)}



                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid
                        style={{
                            height: "450",
                        }}
                        resizable={true}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        data={process(locationTable, dataState)}
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

                                        }}  ><span class="k-icon k-i-refresh"></span> Refresh</Button>
                                        <Button ref={anchor} onClick={visibleGrid} >Column selector</Button>
                                        {permissions.create.visible === "True" && <Button  onClick={() => {
                                            navigate('/Config/location/Creation');
                                        }}><span>New</span></Button>}
                                        {permissions.import.visible === "True"  && <Button onClick={handleuploadclick}><span>Import</span></Button>}
                                        {permissions.delete.visible === "True"  && <Button onClick={DeleteLocation}><span>Delete</span></Button>}
                                    </ButtonGroup>
                                </ul>
                            </div>

                        </GridToolbar>
                        {permissions.delete.visible === "True"  && <Column title="" filterable={false} className="edit-btn" width={50} cell={Deletecell} /> } 
                        {gridChangehandler.Location == true ? (<Column field="Loc" title="Location" filterable={true} />) : (<></>)}
                        {gridChangehandler.LocationType == true ? (<Column field="LocationType" title="Location Type" filterable={true} />) : (<></>)}
                        {gridChangehandler.LocationFlag == true ? (<Column field="LocationFlag" title="Location Flag" filterable={true} />) : (<></>)}
                        {gridChangehandler.LocationCategory == true ? (<Column field="LocationCategory" title="Location Category" filterable={true} />) : (<></>)}
                        {gridChangehandler.StackLimit == true ? (<Column field="StackLimit" title="Stack Limit" filterable={true} />) : (<></>)}

                        {gridChangehandler.PutawayZone == true ? (<Column field="PutawayZone" title="Zone" filterable={true} />) : (<></>)}
                        {gridChangehandler.AllocationZone == true ? (<Column field="AllocationZone" title="Allocation Zone" filterable={true} />) : (<></>)}
                        {permissions.update.visible === "True"  && <Column field="" title="" className="edit-btn" filterable={false} cell={CommandCell} />}
                    </Grid>
                </div>




            </div>
        </>
    );
}

export default LocatioMaster;