import * as React from 'react';
import { useState, useEffect } from 'react';
import Loader from "../../../components/Loader/Loader";
import { useLocalization } from '@progress/kendo-react-intl';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import statusChecker from "../../../misc/Status";
import { process } from "@progress/kendo-data-query";
import { json, useNavigate } from "react-router-dom";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { OndemandVideoTwoTone } from '@mui/icons-material';
import { OrderHeaderDelete } from "../../../services/OutboundService/outboundService";
import { Button, ButtonGroup, DropDownButtonItem } from "@progress/kendo-react-buttons";
import moment from 'moment';
import { getPickDetail, DeletePickDetail, CreatePickDetail, UpdatePickDetail } from "../../../services/OutboundService/outboundService";
import {  getRoles  } from "../../../services/ConfigurationService/ConfigurationService"
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input as KendoInput } from '@progress/kendo-react-inputs';

const sleep = (time) => new Promise((r) => setTimeout(r, time))


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
let changedrecords = [];

const Pickdetail = () => {

    const gridVisibility = {
        pickdetailkey: true,
        OrderKey: true,
        OrderLineNumber: true,
        Sku: true,
        Qty: false,
        caseid: false,
        Loc: false,
        Id: true,
        Pickdetailstatus: true,
        Lottable09: true

    }


    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [pickDetailList, setPickDetailList] = useState([])
    const localizationService = useLocalization();
    const [dataState, setDataState] = React.useState(initialDataState);
    var [selectedOrders, setselectedOrders] = useState([]);
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("");
    const [severity, setseverity] = useState("success");
    const [gridChangehandler, setgridChangehandler] = useState(gridVisibility)
    const [visible, setVisible] = React.useState(false);
    const anchor = React.useRef(null);
    const [titleZone, settitleZone] = useState("Field Selector");
    const pickdetail ={
        "delete": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "create": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "ship": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "UpdateDrpId": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "unpick": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "pick": {
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

    const [permissions, setpermissions] = useState(pickdetail)
    useEffect(async () => {
        LoadGridvalues()
        await sleep(700);
        getRoles(token, "pickdetail").then((res) => {
            setpermissions(res)
        })

    }, [token])
    useEffect(() => {
        console.log(pickDetailList, 'set')
    }, [pickDetailList])
    const LoadGridvalues = async () => {
        debugger
        setLoading(true);
        let getPickdetail = await getPickDetail(token);

        if (getPickdetail.length > 0) {
            const tempDataValue = getPickdetail.map(obj => {
                return { ...obj, checker: "" }
            })
            setPickDetailList(tempDataValue)
            setLoading(false);
        } else {
            setLoading(false);
            setPickDetailList([])
        }
        console.log(getPickdetail);

    }

    const statusCell = (props) => {

        const setStyle = []
        if (props.dataItem.Pickdetailstatus == 'Shipped') {
            const style = {
                color: "#009933"
            };
            setStyle.push(style);
        }
        else if (props.dataItem.Pickdetailstatus == 'Normal') {
            const style = {
                color: "#0d6efd"

            };

            setStyle.push(style);
        }
        else if (props.dataItem.Pickdetailstatus == 'Picked') {
            const style = {
                color: "#fd7e14",


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Pickdetailstatus == 'Allocated') {
            const style = {
                color: "#669999",


            };

            setStyle.push(style);
        }

        return (
            <td style={setStyle[0]} className="status-bg">
                {/* <div className='row' > */}
                <span style={{ justifyContent: 'center' }}>{props.dataItem.Pickdetailstatus}</span>
                {/* </div> */}
            </td>
        );

    }

    const onEdit = (e) => {
        console.log(e.dataItem);
        navigate('/Pickdetail/PickDetailCreation', { state: { PickdetailData: e.dataItem, Action: "1" } })
        // navigate('/Outbound/Creation', { state: { orderkey: e.dataItem, maction: "2", key:e.dataItem.OrderKey } })

    }

    const CommandCell = (e) => {
        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple" }} onClick={() => onEdit(e)}
                    className="k-icon k-i-edit"></span>
            </td>
        );
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

    const handleshipclick = (action) => {
        const deleterecordscheck = pickDetailList.filter(obj => obj.checker === "checked" && obj.Status !== '5')
        if (action === 'ship') {
            var shiprecords = pickDetailList.filter(obj => obj.checker === "checked" && obj.Status === '5').map(obj => {
                const { UOM, ...rest } = obj;
                return { ...rest, Status: '9' }
            })
        }
        else {
            var shiprecords = pickDetailList.filter(obj => obj.checker === "checked" && obj.Status === '5').map(obj => {
                const { UOM, ...rest } = obj;
                return { ...rest, Status: '0' }
            })

        }
        if (shiprecords.length > 0) {
            UpdatePickDetail(shiprecords, token).then(res => {

                if (res === "Successfully posted to WMS") {
                    var timeout;
                    let msg = ''
                    if (deleterecordscheck.length === 0 && action === 'ship') {
                        msg = "Shipped Successfully"
                    }
                    else if (deleterecordscheck.length === 0) {
                        msg = "Unpicked Successfully"
                    }
                    else if (action === 'ship') {
                        msg = 'Some records cannot be shipped as they are not picked'
                    }
                    else {
                        msg = 'Some records cannot be un picked as they are not picked'
                    }
                    setopen(true);
                    setmessage(msg)
                    setseverity(deleterecordscheck.length === 0 ? "success" : "warning");
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    LoadGridvalues();

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
            setmessage("No records selected or selected records are all not picked")
            setseverity("warning");
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 5000);
        }
    }
    const visibleGrid = () => {
        setVisible(!visible);
    };

    const PickdetailChecker = (e) => {

        console.log(e.dataItem.checker);
        if (e.dataItem.checker !== "") {
            return (
                <td>
                    <input type="checkbox" id={e.dataItem.SerialKey} onChange={validateCheck} value="" defaultChecked disabled={e.dataItem.Status === '9'} />
                </td>
            );
        }
        return (

            <td>
                <input type="checkbox" id={e.dataItem.SerialKey} onChange={validateCheck} disabled={e.dataItem.Status === '9'} />
            </td>
        )
    }

    const validateCheck = (e) => {


        var index = pickDetailList.findIndex(p => p.SerialKey == e.target.id);
        if (pickDetailList[index].checker === "") {
            pickDetailList[index].checker = "checked";
        }
        else {
            pickDetailList[index].checker = "";
        }

    }

    const Pick = (Status) => {

        const finalRecords = pickDetailList.filter(obj => obj.checker === "checked").map(obj => {

            return { SerialKey: obj.SerialKey, PickDetailKey: obj.PickDetailKey, Status: Status, UOM: "EA", PackKey: obj.PackKey }


        })

        if (finalRecords.length > 0) {
            CreatePickDetail(JSON.stringify(finalRecords), token).then(res => {
                if (res === "Successfully posted to WMS") {
                    var timeout;
                    setopen(true);
                    if (Status === "5") {
                        setmessage("Picked Successfully")
                    }
                    else if (Status === "0") {
                        setmessage("Un Pick Successfully")
                    }
                    else if (Status === "9") {
                        setmessage("Shipped Successfully")
                    }
                    setseverity("success");
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    LoadGridvalues();

                }
                else {
                    var timeout;
                    setopen(true);
                    setmessage(res)
                    setseverity("error");
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                }
            })
        }

    }

    const DeletePickDetailrecords = () => {
        // DeletePickDetail
        const deleterecordscheck = pickDetailList.filter(obj => obj.checker === "checked" && obj.Status !== '0')
        const finalDeleteRecords = pickDetailList.filter(obj => obj.checker === "checked" && obj.Status === '0').map(obj => {
            return { PickDetailKey: obj.pickdetailkey }
        })
        if (finalDeleteRecords.length > 0) {
            DeletePickDetail(JSON.stringify(finalDeleteRecords), token,).then(res => {
                if (res === "Successfully posted to WMS") {
                    var timeout;
                    setopen(true);
                    setmessage(deleterecordscheck.length === 0 ? "PickDetail Deleted Successfully" : "Some records cannot be deleted as they are picked")
                    setseverity(deleterecordscheck.length === 0 ? "success" : "warning");
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        setopen(false);
                    }, 2000);
                    LoadGridvalues();

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
            setmessage("No records selected or selected records are all picked")
            setseverity("warning");
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 5000);
        }
    }

    const dropidinp = (e) => {
        return (
            <td>
                <KendoInput
                    type="text"
                    defaultValue={e.dataItem.DropID || ''}
                    onChange={event => handledropidChange(event, e.dataItem)}
                    disabled={e.dataItem.Status !== '0'}
                    readOnly={permissions.UpdateDrpId.visible === 'False'}
                />
            </td>
        )
    }


    const handledropidChange = (e, rec) => {
        const index = pickDetailList.findIndex(obj => obj.SerialKey === rec.SerialKey);
        var record = pickDetailList[index];
        record.DropID = e.target.value;
        var records = pickDetailList;
        records[index] = record
        console.log(records)
        setPickDetailList(records)
        if (!changedrecords.includes(rec.SerialKey)) {
            changedrecords.push(rec.SerialKey)
        }
        console.log(changedrecords, 'pushed')
    }

    const updatehandleclick = () => {
        let finalrec = pickDetailList.filter(obj => changedrecords.includes(obj.SerialKey)).map(obj => {
            const { UOM, ...rest } = obj
            return { ...rest }
        })

        console.log(finalrec)
        UpdatePickDetail(finalrec, token).then(res => {
            if (res === "Successfully posted to WMS") {
                var timeout;
                setopen(true);
                setmessage('Updated Successfully')
                setseverity("success");
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
                LoadGridvalues();
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
        changedrecords = []
    }


    return (
        <>
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
                <WithSnackbar open={open} message={message} severity={severity} />
                <div className="d-flex mt-3 justify-content-between">
                    <div className='ps-3'>
                        <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.PickDetail')}</h3>
                    </div>


                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            <ButtonGroup>
                                {permissions.create.visible === 'True' && <Button onClick={() => { navigate('/Pickdetail/PickDetailCreation') }} >Create</Button>}
                                {permissions.delete.visible === 'True' && <Button onClick={DeletePickDetailrecords} >Delete</Button>}
                            </ButtonGroup>
                        </ul>
                    </div>
                </div>

                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid

                        // onRowDoubleClick={onRowClick}
                        resizable={true}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        style={{
                            height: "75vh",
                        }}
                        data={process(pickDetailList, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        <GridToolbar style={{ float: 'right' }}>
                            <div >
                                <div className='position-relative pe-4'>
                                    <ul className='header-buttons'>
                                        <ButtonGroup>
                                            {permissions.pick.visible === 'True' && <Button onClick={() => Pick("5")} type="button" >Pick</Button>}
                                            {permissions.unpick.visible === 'True' && <Button onClick={() => handleshipclick("pick")} type="button" >UnPick</Button>}
                                            {permissions.UpdateDrpId.visible === 'True' && <Button type="button"
                                                onClick={updatehandleclick} >Update Drop ID</Button>}
                                            {permissions.ship.visible === 'True' && <Button onClick={() => handleshipclick("ship")} >Ship</Button>}
                                        </ButtonGroup>
                                        <Button className='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base' style={{ marginLeft: "30px" }} ref={anchor} type="button" onClick={visibleGrid} icon="k-icon k-i-borders-show-hide" ></Button>

                                    </ul>
                                </div>
                            </div>
                        </GridToolbar>
                        {(permissions.UpdateDrpId.visible === 'True' || permissions.delete.visible === 'True' || permissions.pick.visible === 'True' ||
                         permissions.ship.visible === 'True' || permissions.unpick.visible === 'True' || permissions.update.visible === 'True') && 
                        <Column title="" filterable={false} className="edit-btn" width={60} cell={PickdetailChecker} />}
                        {gridChangehandler.pickdetailkey == true ? (<Column width={250} field="PickDetailKey" title="Pick Detail Key" filterable={true} style={{ cursor: "pointer" }} className="fw-bold" />) : (<></>)}
                        {gridChangehandler.OrderKey == true ? (<Column field="OrderKey" width={250} title="Order key" />) : (<></>)}
                        {gridChangehandler.OrderLineNumber == true ? (<Column width={250} field="OrderLineNumber" title="Order Line No" filterable={true} />) : (<></>)}
                        {gridChangehandler.Sku == true ? (<Column width={250} field="Sku" title="Sku" filterable={true} />) : (<></>)}
                        {gridChangehandler.Qty == true ? (<Column width={250} field="Qty" title="Qty" filterable={false} />) : (<></>)}
                        {gridChangehandler.caseid == true ? (<Column width={250} field="caseid" title="Case Id" filterable={false} />) : (<></>)}
                        {gridChangehandler.Loc == true ? (<Column width={250} field="Loc" title="Loc" filterable={true} />) : (<></>)}
                        {gridChangehandler.Id == true ? (<Column width={250} field="ID" title="Lpn" filterable={true} />) : (<></>)}
                        {gridChangehandler.Pickdetailstatus == true ? (<Column field="Pickdetailstatus" title="Status" width={250} filterable={true} cell={statusCell} />) : (<></>)}
                        <Column field="DropID" title="Drop Id" width={250} filterable={false} cell={dropidinp} />
                        {permissions.update.visible === 'True' && <Column field="" title="" width={50} className="edit-btn" filterable={false} cell={CommandCell} />}


                    </Grid>
                </div>
            </div>

            {visible && (
                <Dialog title={titleZone} onClose={visibleGrid}>
                    {Client !== 'BSI FTWZ' && <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} name='pickdetailkey' checked={gridChangehandler.pickdetailkey} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>pickdetailkey</p>

                        </div>
                    </div>}
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} checked={gridChangehandler.OrderKey} name='OrderKey' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>OrderKey</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} checked={gridChangehandler.OrderLineNumber} name='OrderLineNumber' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>OrderLineNumber</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} name='Sku' checked={gridChangehandler.Sku} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Sku</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='Qty' checked={gridChangehandler.Qty} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Qty</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='caseid' checked={gridChangehandler.caseid} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>caseid</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='Loc' checked={gridChangehandler.Loc} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Loc</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='Id' checked={gridChangehandler.Id} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Id</p>

                        </div>
                    </div>


                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='Pickdetailstatus' checked={gridChangehandler.Pickdetailstatus} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>Status</p>

                        </div>
                    </div>

                </Dialog>

            )}



        </>
    )
}

export default Pickdetail;