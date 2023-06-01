import * as React from 'react';
import { useState, useEffect } from 'react';
import Loader from "../../../components/Loader/Loader";
import { getoutBound, allocateorders, unallocateorders, shiporders, unpickorders, OrderHeaderDelete, Closeorder } from "../../../services/OutboundService/outboundService"
import { getcodesc, getLocFieldValue, getRoles  } from "../../../services/ConfigurationService/ConfigurationService"
import { useLocalization } from '@progress/kendo-react-intl';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import statusChecker from "../../../misc/Status";
import { process, filterBy } from "@progress/kendo-data-query";
import { useNavigate } from "react-router-dom";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { DropdownFilterCell } from "../../../components/dropdownFilterCell";
import { DateRangePicker } from "@progress/kendo-react-dateinputs";
import { getOutBoundChartData } from "../../../services/HomeService/HomeService";
import dollarImage from '../../../assets/dollar.png';
import { ButtonGroup, Button } from "@progress/kendo-react-buttons";
import allocatedIcon from '../../../assets/icons/allocated.png';
import pickedIcon from '../../../assets/icons/picked.png';
import shippedIcon from '../../../assets/icons/shipped.png'
import outBoundNew from '../../../assets/icons/outbound-new.png';
import { OndemandVideoTwoTone } from '@mui/icons-material';
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


const Outboundheader = () => {

    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let username = localStorage.getItem("UserName")
    let navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [outBoundList, setoutBoundList] = useState([])
    const localizationService = useLocalization();
    const [dataState, setDataState] = React.useState(initialDataState);
    var [search, setNewSearch] = useState([]);
    var [selectedOrders, setselectedOrders] = useState([]);
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("");
    const [severity, setseverity] = useState("success");
    const [refresh, setrefresh] = useState(true)
    const [outChartData, setOutChartData] = useState([]);
    const [filter, setFilter] = useState();
    const [outboundNew, setOutboundNew] = useState();
    const [outboundAllocated, setOutboundAllocated] = useState();
    const [outboundPicked, setOutboundPicked] = useState();
    const [outboundShipped, setOutboundShipped] = useState();
    const [ordertypes, setordertypes] = useState([])
    const Statuses = ['Empty Order', 'Created Externally', 'Created Internally', 'Did Not Allocate', 'Converted', 'Not Started', 'Unknown', 'Batched', 'Part Pre-allocated', 'Pre-allocated', 'Released to WareHouse Planner', 'Part Allocated', 'Part Allocated / Part Picked', 'Part Allocated / Part Shipped', 'Allocated', 'Substituted', 'OutOfSync', 'Part Released', 'Part Released/Part Picked', 'Part Released/Part Shipped', 'Released', 'In Picking', 'Part Picked', 'Part Picked / Part Shipped', 'Picked Complete', 'Picked / Part Shipped', 'In Packing', 'Pack Complete', 'Staged', 'Manifested', 'In Loading', 'Loaded', 'Part Shipped', 'Close Production', 'Shipped Complete', 'Delivered Accepted', 'Delivered Rejected', 'Cancelled Externally', 'Cancelled Internally']
    const outboundheader ={
        "update": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "close": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "delete": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "unpick": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "ship": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "unallocate": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "allocate": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        },
        "creation": {
            "visible": "False",
            "readonly": "False",
            "label": ""
        }
    }
    const [permissions, setpermissions] = useState(outboundheader)

    const LoadGridvalues = (e) => {
        getoutBound(token).then((res) => {
            if (res) {
                if (res.length > 0) {
                    setoutBoundList(res)
                } else {
                    setoutBoundList([])
                }
            }
            setLoading(false)
        })
        setNewSearch([])
    }

    useEffect(async () => {

        outChartDataFn();

        setLoading(true)
        await sleep(700)
        LoadGridvalues()
        setLoading(true)
        getcodesc(token,'ORDERTYPE').then(res => {
            let ordtype = res.map(obj => {return obj.description})
            setordertypes(ordtype)
	    setLoading(false)
        })
        getRoles(token, "outboundheader").then((res) => {
            setpermissions(res)
        })

    }, [token, refresh])


    const onRowClick = (e) => {
        debugger

        navigate('/Outbound/detail', { state: { outbound: e.dataItem } })
    };


    const validateCheck = (e) => {
        const seardvalue = obj => obj === e.target.id;

        if (search.findIndex(seardvalue) === -1) {
            search.push(e.target.id);
        }
        else if (search.length !== 0) {
            search.splice(search.findIndex(seardvalue), 1);
        }

        console.log(search);

    }


    function Checkrecords(props) {

        const orderkey = props.dataItem.OrderKey

        if (search.includes(orderkey)) {
            return (
                <td >
                    <input type="checkbox" id={props.dataItem.OrderKey} onClick={validateCheck} value="" defaultChecked />
                </td>
            )
        }
        else {
            return (
                <td >
                    <input type="checkbox" id={props.dataItem.OrderKey} onClick={validateCheck} value="" />
                </td>
            )
        }
    }

    const statusCell = (props) => {

        const setStyle = []
        if (props.dataItem.Status === '95') {
            const style = {
                color: "#009933"
            };
            setStyle.push(style);
        }
        else if (props.dataItem.Status === '55') {
            const style = {
                color: "#fd7e14"
            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '02' || props.dataItem.Status === '04' || props.dataItem.Status === '00') {
            const style = {
                color: "#0d6efd"

            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '06') {
            const style = {
                color: "#ff3333"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '09') {
            const style = {
                color: "#5c00e6"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '14') {
            const style = {
                color: "#336600"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '17') {
            const style = {
                color: "#669999"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '52') {
            const style = {
                color: "#cc9900"

            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '53') {
            const style = {
                color: "#cc6600"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '57') {
            const style = {
                color: "#993300"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '92') {
            const style = {
                color: "#20c997"


            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status === '98' || props.dataItem.Status === '99') {
            const style = {
                color: "#333333"


            };

            setStyle.push(style);
        }

        return (
            <td style={setStyle[0]} className="status-bg">
                {/* <div className='row' > */}
                <span style={{ justifyContent: 'center' }}>{props.dataItem.STATUSdesc}</span>
                {/* </div> */}
            </td>
        );

    }
    const click = (action) => {
        console.log(search.length);
        if (search.length > 0) {
            commonactions(action);
            setNewSearch([])

        }
        else {
            var timeout;
            setopen(true)
            setmessage("Please select the line to perform the action")
            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 3000);
        }
    }

    const commonactions = (action) => {
        setLoading(true);
        debugger
        if (action !== '5') {
            for (let i = 0; i <= search.length - 1; i++) {
                selectedOrders.push({ "OrderKey": search[i] });
            }
        }

        console.log(selectedOrders);

        if (action === '1') {
            allocateorders(selectedOrders, token).then(res => {
                LoadGridvalues()
            })
        }
        else if (action === '2') {
            unallocateorders(selectedOrders, token).then(res => {
                LoadGridvalues()
            })
        }
        else if (action === '3') {
            shiporders(selectedOrders, token).then(res => {
                LoadGridvalues()
            })
        }
        else if (action === '4') {
            unpickorders(selectedOrders, token).then(res => {
                LoadGridvalues()
            })
        }
        else if (action === '5') {
            console.log(search);
            let tempDelete = [];
            console.log(outBoundList);
            debugger
            for (let i = 0; i <= search.length - 1; i++) {
                for (let j = 0; j <= outBoundList.length - 1; j++) {
                    if (search[i] == outBoundList[j].OrderKey) {
                        debugger
                        tempDelete.push(outBoundList[j])
                    }
                }

            }
            debugger
            console.log(tempDelete);
            if (tempDelete.length > 0) {
                const finalDeleteRecords = tempDelete.map(obj => {

                    return { OrderKey: obj.OrderKey, ExternOrderKey: obj.ExternOrderKey }
                })
                OrderHeaderDelete(JSON.stringify(finalDeleteRecords), token).then(res => {
                    if (res) {
                        var timeout;
                        setopen(true);
                        setmessage("Order Header Deleted Successfully")
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
            else {
                var timeout;
                setopen(true);
                setmessage("Please Select line to delete")
                setseverity("warning");
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
            }
        }
        else if (action === '6') {
            Closeorder(selectedOrders, token).then(res => {
                LoadGridvalues()
            })
        }
        setselectedOrders([])
        setLoading(false);

    }
    const refreshButtonCilck = () => {
        setrefresh(!refresh) //just change the value, to trigger the useeffect hook
    }
    const StatusFilterCell = (props) => (
        <DropdownFilterCell
            {...props}
            data={Statuses}
            defaultItem={"Select status"}
        />
    );
    const TypeFilterCell = (props) => (
        <DropdownFilterCell
            {...props}
            data={ordertypes}
            defaultItem={"Select Type"}
        />
    );
    const filterChange = (event) => {
        console.log(event.filter)
        setFilter(event.filter);
    };

    const outChartDataFn = () => {
        let start = '';
        let end = '';


        getOutBoundChartData(token, start, end).then((res) => {
            if (res) {
                if (res.length > 0) {
                    setOutChartData(res);

                    if (res.find(obj => obj.description === 'Created Externally')) {
                        var externally = res.find(obj => obj.description === 'Created Externally').count;
                        var internally = res.find(obj => obj.description === 'Created Internally').count;
                        var total = externally + internally;
                        setOutboundNew(total);
                    }

                    if (res.find(obj => obj.description === 'Allocated')) {
                        setOutboundAllocated(res.find(obj => obj.description === 'Allocated').count)
                    }

                    if (res.find(obj => obj.description === 'Picked Complete')) {
                        setOutboundPicked(res.find(obj => obj.description === 'Picked Complete').count)
                    }
                    if (res.find(obj => obj.description === 'Shipped Complete')) {
                        setOutboundShipped(res.find(obj => obj.description === 'Shipped Complete').count)
                    }

                } else {
                    setOutChartData([])
                }
            }
        })
    }
    const CommandCell = (e) => {
        return (
            <td className="k-command-cell">
                <span style={{ cursor: "pointer", color: "purple" }} onClick={() => onEdit(e)}
                    class="k-icon k-i-edit"></span>
            </td>
        );
    }

    const onEdit = (e) => {
        console.log(e.dataItem);
        navigate('/Outbound/Creation', { state: { orderkey: e.dataItem, maction: "2", key: e.dataItem.OrderKey } })

    }



    return (
        <>
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
                <WithSnackbar open={open} message={message} severity={severity} />
                <div className="d-flex mt-2 justify-content-between">
                    <div className='ps-3'>
                        <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.outbound')}</h3>
                    </div>

                </div>
                <div class="row dashboard">
                    <div class="col-lg-3 col-12">

                        <div class="card info-card new">

                            <div class="card-body">

                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <img src={outBoundNew}></img>
                                    </div>
                                    <div class="ps-3">
                                        <h3 class="card-title">New </h3>
                                        <h6 >{outboundNew} </h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="col-lg-3 col-12">

                        <div class="card info-card receiving">

                            <div class="card-body">

                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <img src={allocatedIcon} ></img>
                                    </div>
                                    <div class="ps-3">
                                        <h3 class="card-title">Allocated </h3>
                                        <h6>{outboundAllocated}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-12">

                        <div class="card info-card in-receiving">

                            <div class="card-body">

                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <img src={pickedIcon} ></img>
                                    </div>
                                    <div class="ps-3">
                                        <h3 class="card-title">Picked Complete </h3>
                                        <h6 >{outboundPicked}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-12">

                        <div class="card info-card closed">
                            <div class="card-body">

                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <img src={shippedIcon} ></img>
                                    </div>
                                    <div class="ps-3">
                                        <h3 class="card-title">Shipped Complete </h3>
                                        <h6>{outboundShipped}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid

                        onRowDoubleClick={onRowClick}
                        resizable={true}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        style={{
                            height: "60vh",
                        }}
                        data={process(filterBy(outBoundList, filter), dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                        filter={filter}
                        onFilterChange={filterChange}
                    >
                        <GridToolbar>
                            <div className='position-relative pe-3'>
                                <ul className='header-buttons'>
                                    <ButtonGroup>
                                        {permissions.creation.visible === 'True' && <Button className='text-uppercase br-round-left active' onClick={() => {

                                            navigate('/Outbound/Creation', { state: { orderkey: "", maction: "1", key: "" } })

                                        }}>New</Button>}
                                        {permissions.allocate.visible === 'True' && <Button className='text-uppercase br-round active' onClick={() => click('1')}>Allocate</Button>}
                                        {permissions.unallocate.visible === 'True' && <Button className='text-uppercase br-round active' onClick={() => click('2')}>Unallocate</Button>}
                                        {permissions.ship.visible === 'True' && <Button className='text-uppercase br-round active' onClick={() => click('3')}>Ship</Button>}
                                        <Button className='text-uppercase br-round active' onClick={refreshButtonCilck}>Refresh</Button>
                                        {permissions.unpick.visible === 'True' && <Button className='text-uppercase br-round active' onClick={() => click('4')}>Unpick</Button>}
                                        {permissions.delete.visible === 'True' && <Button className='text-uppercase br-round active' onClick={() => click('5')}>Delete</Button>}
                                        {permissions.close.visible === 'True' && <Button className='text-uppercase br-round-right active' onClick={() => click('6')}>Close</Button>}
                                    </ButtonGroup>

                                </ul>
                            </div>

                        </GridToolbar>
                        {(permissions.creation.visible === 'True' || permissions.allocate.visible === 'True' || permissions.unallocate.visible === 'True' 
                        || permissions.ship.visible === 'True' || permissions.unpick.visible === 'True' || permissions.delete.visible === 'True' 
                        || permissions.close.visible === 'True')  &&
                        <Column title="" filterable={false} className="edit-btn" width={50} cell={Checkrecords}/> }
                        <Column field="OrderKey" title="Order No." filterable={false} width={250} className="fw-bold" />
                        <Column field="ExternOrderKey" title="Extern Order Key" width={250} filterable={true} />
                        <Column field="OrderDate" title="Order Date" width={250} filterable={true} />
                        <Column field="C_Company" title="Customer" width={250} filterable={true} />
                        <Column field="TOTALQTY" title="Total Qty" width={250} filterable={false} />
                        <Column field="STATUSdesc" title="Status" width={250} filterable={true} cell={statusCell} filterCell = {StatusFilterCell}/>
                        <Column field="typedescr" title="Type" width={250} filterable={true} filterCell = {TypeFilterCell}/>
                        {permissions.update.visible === 'True' && <Column field="" title="" className="edit-btn" width={50} filterable={false} cell={CommandCell} />}

                    </Grid>
                </div>
            </div>

        </>
    );
}


export default Outboundheader;