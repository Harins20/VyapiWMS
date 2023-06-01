import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalization } from '@progress/kendo-react-intl';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { getItem, DeleteItem, getRoles } from "../../../services/ConfigurationService/ConfigurationService";
import { Dialog } from "@progress/kendo-react-dialogs";
import { ButtonGroup, Button } from "@progress/kendo-react-buttons";



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

const ItemMaster = () => {

    const gridVisibility = {
        SKU: true,
        DESCR: true,
        PACK: true,
        ALLOCATIONSTG: false,
        PUTAWAYSTG: false,
        NETWGT: true,
        GROSSWGT: true,
        TAREWGT: true,
    }
    const item = {
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
    const [itemTable, setItemTable] = useState([])
    const [dataState, setDataState] = React.useState(initialDataState);
    const [gridChangehandler, setgridChangehandler] = useState(gridVisibility)
    const [visible, setVisible] = React.useState(false);
    const anchor = React.useRef(null);
    const [titleZone, settitleZone] = useState("Column Selector");
    const [permissions, setpermissions] = useState(item)

    //token
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let username = localStorage.getItem("UserName")

    useEffect(() => {
        setLoading(true)
        loadingGridValues();
        getRoles(token, "item").then((res) => {
            setpermissions(res)
        })
    }, [token])

    //grid values
    const loadingGridValues = () => {

        getItem(token).then((res) => {
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
    const onEdit = (e) => {
        navigate('/Config/ItemMasterCreation', { state: { itemUpdate: e.dataItem, maction: "2" } })
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
    const validateCheck = (e) => {
        var index = itemTable.findIndex(p => p.SerialKey == e.target.id);
        if (itemTable[index].checker === "") {
            itemTable[index].checker = "checked";
        }
        else {
            itemTable[index].checker = "";
        }
    }


    const CommandCell = (e) => {
        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple" }} onClick={() => onEdit(e)} class="k-icon k-i-edit"></span>
            </td>
        );
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
    const DeleteSku = () => {
        const finalDeleteRecords = itemTable.filter(obj => obj.checker === "checked").map(obj => {

            return { StorerKey: obj.StorerKey, Sku: obj.Sku }
        })


        if (finalDeleteRecords.length > 0) {
            DeleteItem(JSON.stringify(finalDeleteRecords), token, "1").then(res => {
                if (res === "Successfully posted to WMS") {
                    var timeout;
                    setopen(true);
                    setmessage("Item Deleted Successfully")
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
            setmessage("Please Select item to delete")
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
        navigate("/Config/ItemMaster/excelupload")
    }
    return (
        <>

            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>

                <div className="d-flex flex-wrap mt-2 justify-content-between ">
                    <div className='ps-3'>
                        <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.ItemMaster')}</h3>
                    </div>



                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            {permissions.create.visible === "True" && <li className='text-uppercase rounded-pill active' onClick={() => { navigate('/Config/ItemMasterCreation'); }} >New</li>}


                        </ul>
                    </div>


                    {/* <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            <li className='text-uppercase br-round-left active' onClick={() => {
                                navigate('/Config/ItemMasterCreation');
                            }}  ><span>New</span></li>
                        </ul>
                    </div> 
                    <div className='position-relative pe-3'>
                    <ul className='header-buttons'>
						           <li className=' br-round-left active' onClick={() => {
                                setLoading(true)
                                loadingGridValues();
                        }}  ><span class="k-icon k-i-refresh"></span> Refresh</li>
                        <li className=' br-round active' onClick={visibleGrid} >Column selector</li>
                        <li className=' br-round active' onClick={() => {
                                navigate('/Config/ItemMasterCreation');
                            }} >New</li>
						            <li className=' br-round active' onClick={handleuploadclick} >Import</li>
						            <li className=' br-round-right active' onClick={DeleteSku} >Delete</li>
                        </ul>
                    </div>*/}
                </div>

                {visible && (<Dialog title={titleZone} onClose={visibleGrid}>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} name='SKU' checked={gridChangehandler.SKU} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>SKU</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" style={{ marginTop: "5px" }} checked={gridChangehandler.DESCR} name='DESCR' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>DESCR</p>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} checked={gridChangehandler.PACK} name='PACK' onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>PACK</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" style={{ marginTop: "5px" }} name='ALLOCATIONSTG' checked={gridChangehandler.ALLOCATIONSTG} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>ALLOC STG</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='PUTAWAYSTG' checked={gridChangehandler.PUTAWAYSTG} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>PUTAWAYSTG</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='NETWGT' checked={gridChangehandler.NETWGT} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>NET WGT</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='GROSSWGT' checked={gridChangehandler.GROSSWGT} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>GROSS WGT</p>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>
                            <input type="checkbox" id="1" name='TAREWGT' checked={gridChangehandler.TAREWGT} onChange={handleGridChange} value="1" />
                        </div>
                        <div className='col-10'>
                            <p>TARE WGT</p>

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
                        data={process(itemTable, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        <GridToolbar style={{ float: 'right' }}>
                            <div className='position-relative pe-3'>
                                <ul className='header-buttons'>
                                    <ButtonGroup>
                                        <Button onClick={() => {
                                            setLoading(true)
                                            loadingGridValues();
                                        }}  ><span class="k-icon k-i-refresh"></span> Refresh</Button >
                                        <Button onClick={visibleGrid} >Column selector</Button >
                                        {permissions.import.visible === "True" && <Button onClick={handleuploadclick} >Import</Button >}
                                        {permissions.delete.visible === "True" && <Button onClick={DeleteSku} >Delete</Button >}
                                    </ButtonGroup>
                                </ul>
                            </div>
                        </GridToolbar>
                        {permissions.delete.visible === "True" && <Column title="" filterable={false} className="edit-btn" width={70} cell={Deletecell} />}
                        {gridChangehandler.SKU == true ? (<Column field="Sku" title="Sku" width={250} filterable={true} />) : (<></>)}
                        {gridChangehandler.DESCR == true ? (<Column field="Descr" title="Descr" width={250} filterable={true} />) : (<></>)}
                        {gridChangehandler.PACK == true ? (<Column field="PackKey" title="Pack" width={250} filterable={true} />) : (<></>)}
                        {gridChangehandler.ALLOCATIONSTG == true ? (<Column field="NewAllocationStrategy" title="Allocation Stg" width={250} filterable={true} />) : (<></>)}
                        {gridChangehandler.PUTAWAYSTG == true ? (<Column field="PutawayStrategyKey" title="Putaway Stg" width={250} filterable={true} />) : (<></>)}
                        {gridChangehandler.NETWGT == true ? (<Column field="StdNetWgt" title="Net Wgt" width={250} filterable={true} />) : (<></>)}
                        {gridChangehandler.GROSSWGT == true ? (<Column field="StdGrossWgt" title="Gross Wgt" width={250} filterable={true} />) : (<></>)}
                        {gridChangehandler.TAREWGT == true ? (<Column field="TareWeight" title="Tare Wgt" width={250} filterable={true} />) : (<></>)}

                        {permissions.update.visible === "True" && <Column field="" title="" className="edit-btn" width={50} filterable={false} cell={CommandCell} />}
                    </Grid>
                </div>




            </div>
        </>
    );
}

export default ItemMaster;