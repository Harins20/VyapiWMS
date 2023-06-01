
import * as React from 'react';
import { useLocalization } from '@progress/kendo-react-intl';
import { guid } from '@progress/kendo-react-common';
import { orders, ordersModelFields } from '../../../resources/orders';
import { Grid, GridColumn as Column,GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { useEffect, useState } from "react";
import { getInBound, getStatusCount, deleteasn } from "../../../services/InboundService/InboundService";
import { getRoles } from "../../../services/ConfigurationService/ConfigurationService";
import { getInBoundChartData } from "../../../services/HomeService/HomeService";
import Loader from "../../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import statusChecker from "../../../misc/Status";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { filterBy } from '@progress/kendo-data-query';
import { DropdownFilterCell } from "../../../components/dropdownFilterCell";
import dollarImage from '../../../assets/dollar.png';
import inReceiveIcon from '../../../assets/icons/in-receiving.png';
import receiveIcon from '../../../assets/icons/receiving.png';

import inBoundNew from '../../../assets/icons/new.png';
import closedIcon from '../../../assets/icons/closed.png';
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";

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


const initialFilterState = {};

const sleep = (time) => new Promise((r) => setTimeout(r, time))

const Inbound = () => {
    let navigate = useNavigate()
    const [visible, setVisible] = useState(false);

    const localizationService = useLocalization();
    const [filterState, setFilterState] = React.useState(initialFilterState);
    const [data, setData] = React.useState(orders);
    const [dataState, setDataState] = React.useState(initialDataState);

    const [inBoundList, setInBoundList] = useState([])

    const [loading, setLoading] = useState(true)

    const [New, setnewStatus] = useState();
    const [received, setreceived] = useState();
    const [closed, setClosed] = useState();
    const [refresh, setrefresh] = useState(true)
    const [filter, setFilter] = useState();
    const [inReceiving, setInReceived] = useState();
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState("success");
    const [deleasn, setdeleasn] = useState([])
    


    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let username = localStorage.getItem("UserName")
    const asnheader = {
        "creation": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "delete": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        },
        "update": {
            "visible": "True",
            "readonly": "False",
            "label": ""
        }
    }
    const Statuses = ['New', 'Closed', 'Verified Closed', 'In Transit', 'Cancelled', 'Scheduled', 'In Receiving', 'Received'];
    const [permissions, setpermissions] = useState(asnheader)


    useEffect(async () => {

        setLoading(true)
        debugger
        Client = localStorage.getItem("Client");
        await sleep(700)
        getInBound(token).then((res) => {
            if (res) {
                if (res.length > 0) {
                    setInBoundList(res)
                } else {
                    setInBoundList([])
                }
            }
            setLoading(false)
        })

        let start =  '';
        let end = '';

        getInBoundChartData(token, start, end).then((res) => {

            if (res.find(obj => obj.description === 'New')) {
                setnewStatus(res.find(obj => obj.description === 'New').count)
            }
            else{
                setnewStatus(0)
            }
            if(res.find(obj => obj.description === 'Closed')){
                setClosed(res.find(obj => obj.description === 'Closed').count)
            }
            else{
                setClosed(0)
            }
            if(res.find(obj => obj.description === 'Received')){
                setreceived(res.find(obj => obj.description === 'Received').count)
            }
            else{
                setreceived(0)
            }
            if (res.find(obj => obj.description === 'In Receiving')) {
                setInReceived(res.find(obj => obj.description === 'In Receiving').count)
            }
            else {
                setInReceived(0)
            }
        })
        getRoles(token, "asnheader").then((res) => {
            setpermissions(res)
        })
    }, [token, refresh])

    const refreshButtonCilck = () => {
        setrefresh(!refresh) //just change the value, to trigger the useeffect hook
    }
    
    const onDataChange = React.useCallback(
        ({ created, updated, deleted }) => {
            setData(old => old
                // Filter the deleted items
                .filter((item) => deleted.find(current => current[ordersModelFields.id] === item[ordersModelFields.id]) === undefined)
                // Find and replace the updated items
                .map((item) => updated.find(current => current[ordersModelFields.id] === item[ordersModelFields.id]) || item)
                // Add the newly created items and assign an `id`.
                .concat(created.map((item) => Object.assign({}, item, { [ordersModelFields.id]: guid() }))))
        },
        []
    );

    const onEmployeeClick = React.useCallback(
        (employeeId) => {
            setFilterState({
                ...filterState,
                [employeeId]: !filterState[employeeId]
            });
        },
        [filterState, setFilterState]
    );
        const toggleDialog = (e) => {
        const body = {ReceiptKey : e.ReceiptKey, ExternReceiptKey : e.ExternReceiptKey}
        setdeleasn([body])
        setVisible(!visible);
      };

    const onRowClick = (e) => {
        //console.log(e.dataItem, "details")
        if (Client === 'BSI FTWZ') {
            if (e.dataItem.SUsr1 !== "" && e.dataItem.SUsr1 !== " " && e.dataItem.SUsr1 !== null && e.dataItem.SUsr1 !== undefined) {
                let boeobj = new Date(e.dataItem.SUsr1)
                e.dataItem.SUsr1 = boeobj
            }
            if (e.dataItem.SUsr2 !== "" && e.dataItem.SUsr2 !== " " && e.dataItem.SUsr2 !== null && e.dataItem.SUsr2 !== undefined) {
                let invoicedateobj = new Date(e.dataItem.SUsr2)
                e.dataItem.SUsr2 = invoicedateobj
            }
            if (e.dataItem.SUsr4 !== "" && e.dataItem.SUsr4 !== " " && e.dataItem.SUsr4 !== null && e.dataItem.SUsr4 !== undefined) {
                let boeobj = new Date(e.dataItem.SUsr4)
                e.dataItem.SUsr4 = boeobj
            }
            if (e.dataItem.SUsr5 !== "" && e.dataItem.SUsr5 !== " " && e.dataItem.SUsr5 !== null && e.dataItem.SUsr5 !== undefined) {
                let invoicedateobj = new Date(e.dataItem.SUsr5)
                e.dataItem.SUsr5 = invoicedateobj
            }
        }
        else if(Client === 'BSI DOM'){
            if (e.dataItem.SUsr1 !== "" && e.dataItem.SUsr1 !== " " && e.dataItem.SUsr1 !== null && e.dataItem.SUsr1 !== undefined) {
                let boeobj = new Date(e.dataItem.SUsr1)
                e.dataItem.SUsr1 = boeobj
            }
            if (e.dataItem.SUsr2 !== "" && e.dataItem.SUsr2 !== " " && e.dataItem.SUsr2 !== null && e.dataItem.SUsr2 !== undefined) {
                let invoicedateobj = new Date(e.dataItem.SUsr2)
                e.dataItem.SUsr2 = invoicedateobj
            }
        }
        navigate('/inbound/details', { state: { inboundDetail: e.dataItem } })
    };

    const editclick = e => {
        console.log(e)
        navigate('/inbound/creation/header', { state: { receiptKey: e } })
    }
    const deleteclick = () => {
        var timeout;
        deleteasn(deleasn, token).then(res => {
            if (res === "Successfully posted to WMS") {
                setopen(true);
                setmessage("Deleted  Successfully")
                setseverity("success")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
                setLoading(false);
                refreshButtonCilck()
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


    const CommandCell = (e) => {

        const pReceiptkey = e.dataItem.ReceiptKey;

        return (
            <td className="k-command-cell">
                {permissions.update.visible === "True" && <span style={{ cursor: "pointer", color: "purple" , marginRight: "10px" }} onClick={() => editclick(pReceiptkey)} className="k-icon k-i-edit"></span>}
                {permissions.delete.visible === "True" && <span style={{ cursor: "pointer", color: "purple" }} onClick={() => toggleDialog(e.dataItem)} className="k-icon k-i-delete"></span>}
            </td>
        );
    };


    const statusCell = (props) => {

        const setStyle = []
        const statusColorchecker = {
            New: "New",
            Received: "Received",
            Closed: "Closed"

        }
        if (props.dataItem.Status == "New") {
            const style = {
                color: "#0d6efd"

            };
            setStyle.push(style);
        }
        else if (props.dataItem.Status == "Received") {
            const style = {
                color: "#FD3D39"

            };
            setStyle.push(style);
        }
        else if (props.dataItem.Status == "Closed") {
            const style = {
                color: "#FD3D39"

            };
            setStyle.push(style);
        }
        else if (props.dataItem.Status == "Cancelled") {
            const style = {
                color: "#fd7e14"

            };

            setStyle.push(style);
        }
        else if (props.dataItem.Status == "In Receiving") {
            const style = {
                color: "#FE9526"

            };
            
            setStyle.push(style);
        }
        const style = {
            backgroundColor: "blue",
            color: "white",
            justifyContent:"center"
        };


        return (
            <td style={setStyle[0]} className="status-bg">

                {/* <div className='row' > */}
                <span>{props.dataItem.Status}</span>
                {/* </div> */}


            </td>
        );



    }
    const StatusFilterCell = (props) => (
        <DropdownFilterCell
          {...props}
          data={Statuses}
          defaultItem={"Select status"}
        />
      );
      const filterChange = (event) => {
        console.log(event.filter)
        setFilter(event.filter);
      };

    return (
        <>
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
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
              onClick={() => {setVisible(!visible);}}
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
                {/* <div className="d-flex mt-5 justify-content-between">
                  <div className='ps-3'>
                      <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.inbound')}</h3>
                  </div>
                  <div className='position-relative pe-3'>
                      <span className="k-icon k-i-share position-absolute ps-1 pe-1 "></span>
                      <button className='ps-4 pe-3 pt-1 pb-1 rounded top-5 float-end fw-400'>Share</button>
                  </div>
              </div> */}
                <div className="d-flex mt-2 justify-content-between">
                    <div className='ps-3'>
                        <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.inbound')}</h3>
                    </div>
                    {/*<div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            <li className='text-uppercase br-round-left active' onClick={() => {
                                navigate('/inbound/creation/header')
                            }}>New</li>
                        </ul>
                    </div>*/}
                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            {permissions.creation.visible === "True" && <li className='text-uppercase rounded-pill active' onClick={() => {navigate('/inbound/creation/header')}}>New</li>}
                            

                        </ul>
                    </div>
                </div>
                
                <div className="row dashboard">
                    <div className="col-lg-3 col-12">
                         <div class="card info-card new">
                           
                           <div class="card-body">
                              <div class="d-flex align-items-center">
                                 <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                 {/* <span className="k-icon k-i-folder-add"></span> */}
                                    <img src={inBoundNew}></img>
                                 </div>
                                 <div class="ps-3">
                                 <h3 class="card-title">New </h3>
                                    <h6>{New}</h6>
                                 </div>
                              </div>
                           </div>
                        </div>

                    </div>
                    <div className="col-lg-3 col-12 ">
                        
                        <div class="card info-card in-receiving">
                           
                           <div class="card-body">
                              
                              <div class="d-flex align-items-center">
                                 <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                 <img src={inReceiveIcon}></img>
                                 </div>
                                 <div class="ps-3">
                                 <h3 class="card-title">In Receiving </h3>
                                    <h6>{inReceiving}</h6>
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
                                 <img src={receiveIcon}></img>
                                 </div>
                                 <div class="ps-3">
                                 <h3 class="card-title">Received </h3>
                                    <h6>{received}</h6>
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
                                 <img src={closedIcon}></img>
                                 </div>
                                 <div class="ps-3">
                                    <h3 class="card-title">Closed </h3>
                                    <h6>{closed}</h6>
                                 </div>
                              </div>
                           </div>
                        </div>
                    </div>
               </div>
                <div className='table-section mt-4 ps-3 pe-3'>

                    <Grid
                        onRowDoubleClick={onRowClick}

                        pageable={true}
                        sortable={true}
                        filterable={true}
                        style={{
                            height: "450",
                        }}
                        data={process(filterBy(inBoundList, filter), dataState)}
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
                            <li className='text-uppercase rounded-pill active' onClick={refreshButtonCilck}>Refresh</li>
                            

                        </ul>
                    </div>
                        
                       
                            
                        </GridToolbar>
                        <Column field="ReceiptKey" title="Asn No." filterable={true} width={250} className="fw-bold" />
                        <Column field="ExternReceiptKey" title="External Ref" width={250} filterable={true} />
                        <Column field="CarrierName" title="Carrier Name" width={250} filterable={true} />
                        <Column field="POKey" title="Pokey" filterable={true} width={250} />
                        <Column title="Status" field="Status"  cell={statusCell} width={250} filterCell={StatusFilterCell} />
                        <Column field="AddDate" title="Add Date" filterable={true} width={250} />
                        {(permissions.update.visible === "True" || permissions.delete.visible === "True") && <Column title="" filterable={false} className="edit-bg"width={100} cell={CommandCell} />}

                    </Grid>
                </div>
            </div>
        </>
    );
}

export default Inbound;




