import * as React from "react";
import { useState, useEffect } from 'react';
import Loader from "../../../components/Loader/Loader";
import { useLocalization } from '@progress/kendo-react-intl';
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import statusChecker from "../../../misc/Status";
import { process } from "@progress/kendo-data-query";
import { useNavigate, useLocation } from "react-router-dom";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { OndemandVideoTwoTone } from '@mui/icons-material';
import { OrderHeaderDelete } from "../../../services/OutboundService/outboundService";
import { Button } from "@progress/kendo-react-buttons";
import moment from 'moment';
import { Input } from "@progress/kendo-react-inputs";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { getoutBound, getOutBoundDetails, CreatePickDetail, UpdatePickDetail } from "../../../services/OutboundService/outboundService";
import { getinv } from "../../../services/InventoryService/InventoryBalanceService";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { getPackUoms } from "../../../services/ConfigurationService/ConfigurationService"

import {
    Card
} from "@progress/kendo-react-layout";

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



let token = localStorage.getItem("selfToken");
class PickDetailCreation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            open: false,
            severity: "",
            message: "",
            PicDetailForms: {
                OrderKey: "",
                OrderLineNumber: "",
                Sku: "",
                Status: "0",
                PackKey: "",
                UOM: "",
                Qty: "",
                UOMQty: "1",
                Loc: "",
                ID: "",
                Lot: "",
                ToLoc: "PICKTO",
                NetWgt: "",
                GrossWgt: "",
                TareWgt: "",
                StorerKey: localStorage.getItem('Client')
            },
            OrdersTable: [],
            OrderDetailTable: [],
            Inventory: [],
            OrderDialog: false,
            OrderDetailDialog: false,
            InventoryDialog: false,
            dataState: initialDataState,
            dataState1: initialDataState,
            UOM: ['EA'],
            UpdatePickDetail: "",
            Status: "Normal",
            PickDetailKey: "[New]",
            SerialKey: ""


        }



    }

    componentDidMount() {
        debugger
        const { loadingValue } = this.props

        if (loadingValue !== null) {
            this.UpdatePickdetail();

        }
    }

    UpdatePickdetail = () => {
        const { loadingValue } = this.props
        console.log(loadingValue.PickdetailData);
        const UpdateValues = loadingValue.PickdetailData
        console.log(UpdateValues);
        this.setState({
            PicDetailForms: {
                ...this.state.PicDetailForms,
                ["OrderKey"]: UpdateValues.OrderKey,
                ["OrderLineNumber"]: UpdateValues.OrderLineNumber,
                ["Sku"]: UpdateValues.Sku,
                ["Status"]: UpdateValues.Status,
                ["PackKey"]: UpdateValues.PackKey,
                ["UOM"]: "EA",
                ["Qty"]: UpdateValues.Qty,
                ["UOMQty"]: "1",
                ["Loc"]: UpdateValues.Loc,
                ["ID"]: UpdateValues.ID,
                ["Lot"]: UpdateValues.Lot,
                ["NetWgt"]: UpdateValues.NetWgt,
                ["GrossWgt"]: UpdateValues.GrossWgt,
                ["TareWgt"]: UpdateValues.TareWgt,

            }
        })
        this.setState({ PickDetailKey: UpdateValues.PickDetailKey })
        this.setState({ SerialKey: UpdateValues.SerialKey })
        this.setState({ Status: UpdateValues.Pickdetailstatus })
    }
    handleFormChange = (e) => {

        this.setState({ PicDetailForms: { ...this.state.PicDetailForms, [e.target.name]: e.target.value } })
    }

    onOrderClick = () => {
        debugger
        if (!this.state.OrderDialog) {

            this.setState({ loading: true })

            getoutBound(token).then((res => {
                console.log(res);

                this.setState({ OrdersTable: res })

                this.setState({ loading: false })
                // setskuDialog(!skuDialog);
                this.setState({ OrderDialog: !this.state.OrderDialog })


            }))

        }
    }

    orderLineClick = () => {
        debugger
        if ((this.state.PicDetailForms.OrderKey !== "") && (this.state.PicDetailForms.OrderKey !== undefined)) {

            if (!this.state.OrderDetailDialog) {

                this.setState({ loading: true })

                getOutBoundDetails(this.state.PicDetailForms.OrderKey, token).then((res => {
                    console.log(res);

                    if (res) {
                        this.setState({ OrderDetailTable: res })

                        this.setState({ loading: false })
                        // setskuDialog(!skuDialog);
                        this.setState({ OrderDetailDialog: !this.state.OrderDetailDialog })
                    }



                }))

            }
        }
        else {

            this.setState({ open: true }, () => setTimeout(() => {
                this.setState({ open: false })
            }, 2000))
            this.setState({ message: "Please fill selecct OrderKey" })
            this.setState({ severity: "warning" })
        }
    }

    clearClick = () => {

        this.setState({
            PicDetailForms: {
                OrderKey: "",
                OrderLineNumber: "",
                Sku: "",
                Status: "0",
                PackKey: "",
                UOM: "",
                Qty: "",
                UOMQty: "1",
                Loc: "",
                ID: "",
                Lot: "",
                ToLoc: "PICKTO",
                NetWgt: "",
                GrossWgt: "",
                TareWgt: "",
                StorerKey: localStorage.getItem('Client')
            }

        })
    }
    inventoryClick = () => {
        debugger
        if (!this.state.InventoryDialog) {

            this.setState({ loading: true })

            getinv(token).then((res => {
                console.log(res);
                if (res) {
                    this.setState({
                        Inventory: res.filter(res => {
                            if (res.Loc !== "PICKTO") {
                                return res
                            }
                        })
                    })

                    this.setState({ loading: false })
                    // setskuDialog(!skuDialog);
                    this.setState({ InventoryDialog: !this.state.InventoryDialog })
                }





            }))

        }
    }
    [{ "OrderKey": "0000000046", "OrderLineNumber": "00001", "Sku": "4006103105006", "Status": "0", "PackKey": "FTWZ-1-999", "UOM": "EA", "Qty": 3, "UOMQty": "1", "Loc": "STAGE", "ID": "HARI TEST", "Lot": "0000000022", "ToLoc": "PICKTO", "NetWgt": 0, "GrossWgt": 0, "TareWgt": "", "StorerKey": "BSI FTWZ" }]
    closeOrder = () => {
        this.setState({ OrderDialog: !this.state.OrderDialog })
    }
    closeOrderDetail = () => {
        this.setState({ OrderDetailDialog: !this.state.OrderDetailDialog })
    }
    closeInventory = () => {
        this.setState({ InventoryDialog: !this.state.InventoryDialog })
    }

    onSubmit = (e) => {
        debugger
        e.preventDefault();
        // let finalizeData = this.state.PicDetailForms.map(obj =>{
        //     return {Status:obj.Status,Qty:obj.Qty,PackKey:obj.PackKey,Sku:obj.Sku,OrderKey:obj.OrderKey,OrderLineNumber:obj.OrderLineNumber,ToLoc:obj.ToLoc,ToLot:obj.ToLot,I}
        // })
        // console.log(finalizeData);
        const { loadingValue } = this.props
        if (loadingValue === null) {

            CreatePickDetail("[" + JSON.stringify(this.state.PicDetailForms) + "]", token).then(res => {
                console.log(res);
                if (res === "Successfully posted to WMS") {
                    this.setState({ open: true }, () => setTimeout(() => {
                        this.setState({ open: false })
                    }, 2000))
                    this.setState({ message: "Pick Create Successfully" })
                    this.setState({ severity: "success" })
                }
                else {
                    this.setState({ open: true }, () => setTimeout(() => {
                        this.setState({ open: false })
                    }, 2000))
                    this.setState({ message: res })
                    this.setState({ severity: "error" })
                }
            })
        }
        else {
            let finalValue = [];
            finalValue.push(this.state.PicDetailForms)

            finalValue = finalValue.map(obj => {
                return { ...obj, PickDetailKey: this.state.PickDetailKey, SerialKey: this.state.SerialKey }
            });
            console.log(finalValue[0]);

            UpdatePickDetail("[" + JSON.stringify(finalValue[0]) + "]", token).then(res => {
                console.log(res);
                if (res === "Successfully posted to WMS") {
                    this.setState({ open: true }, () => setTimeout(() => {
                        this.setState({ open: false })
                    }, 2000))
                    this.setState({ message: "Pick update Successfully" })
                    this.setState({ severity: "success" })
                }
                else {
                    this.setState({ open: true }, () => setTimeout(() => {
                        this.setState({ open: false })
                    }, 4000))
                    this.setState({ message: res })
                    this.setState({ severity: "error" })
                }
            })
        }

    }

    statusCell = (props) => {
        debugger
        const field = props.field || "";
        return (
            <td className="status-bg">
                {/* <div className='row' > */}
                <span style={{ justifyContent: 'center' }}>{statusChecker.setOrderStatusColor[props.dataItem.Status]}</span>
                {/* </div> */}
            </td>
        );

    }
    detailstatusCell = (props) => {
        debugger
        const field = props.field || "";
        return (
            <td className="subStatus">
                {/* <div className='row' > */}
                <span style={{ justifyContent: 'center' }}>{props.dataItem[field]}</span>
                {/* </div> */}
            </td>
        );

    }
    render() {
        // useEffect(() => {
        //     const { state } = useLocation()
        //     debugger
        //     console.log(state);
        //   }, [token])

        const { localizationService } = this.props;
        const { navigate } = this.props;
        const { loadingValue } = this.props;

        // this.setState({UpdatePickDetail:location})
        // console.log(location);
        // console.log(1);
        // console.log(this.state.UpdatePickDetail);

        return (
            <>
                {this.state.loading && <Loader loading={this.state.loading} />}
                <form className="k-form" onSubmit={this.onSubmit}>
                    <div id="Planning" className="inbound-page main-content">
                        <div className='row' style={{ justifyContent: "center" }}>
                            <WithSnackbar open={this.state.open} message={this.state.message} severity={this.state.severity} />
                        </div>

                        <div className="d-flex mt-5 justify-content-between">
                            <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.PickDetailCreation')} {this.state.PickDetailKey}</h3>
                            </div>
                            <div className='position-relative pe-3'>
                                <ul className='header-buttons'>
                                    <Button className='text-uppercase br-round active' type="submit" fillMode="solid" >{this.state.SerialKey === "" ? (<apan>Create</apan>) : (<span>Update</span>)}</Button>
                                    { loadingValue === null && <Button className='text-uppercase br-round active' type='button' fillMode="solid"  onClick={this.clearClick} >Clear</Button>}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <Card style={{ padding: "10px", marginTop: '50px',borderRadius:"16px" }}>

                        <div className="row mt-2">
                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>OrderKey *</p>
                                <Input value={this.state.PicDetailForms.OrderKey} name="OrderKey" required={true} validityStyles={false} readOnly style={{ width: '90%' }} />
                                <span class="k-icon k-i-zoom-in" readOnly onClick={this.onOrderClick} style={{ marginLeft: "10px" }}></span>
                            </div>

                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Pack</p>
                                <Input value={this.state.PicDetailForms.PackKey} onChange={this.handleFormChange} name="PackKey" style={{ width: '100%' }} />
                            </div>

                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Location</p>
                                <Input value={this.state.PicDetailForms.Loc} onChange={this.handleFormChange} name="Loc" style={{ width: '100%' }} />
                            </div>

                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Net Wgt</p>
                                <Input value={this.state.PicDetailForms.NetWgt} onChange={this.handleFormChange} name="NetWgt" style={{ width: '100%' }} />
                            </div>


                        </div>

                        <div className="row mt-2">
                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>OrderLineno *</p>
                                <Input value={this.state.PicDetailForms.OrderLineNumber} required={true} validityStyles={false} name="OrderLineNumber" style={{ width: '90%' }} />
                                <span class="k-icon k-i-zoom-in" readOnly onClick={this.orderLineClick} style={{ marginLeft: "10px" }}></span>
                            </div>

                            <div className="col-3">
                                {/* <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM</p> */}
                                {/* <Input value={this.state.PicDetailForms.UOM} name="UOM" style={{ width: '100%' }} /> */}
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM Qty</p>
                                <Input value={this.state.PicDetailForms.UOMQty} onChange={this.handleFormChange} readOnly name="UOMQty" style={{ width: '100%' }} />


                            </div>

                            <div className="col-3" style={{ flex: "1.1" }}>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>LPN</p>
                                <Input value={this.state.PicDetailForms.ID} required={true} validityStyles={false} onChange={this.handleFormChange} name="ID" style={{ width: '90%' }} />
                                <span class="k-icon k-i-zoom-in" readOnly onClick={this.inventoryClick} style={{ marginLeft: "10px" }}></span>
                            </div>

                            <div className="col-3">

                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Gross Wgt</p>
                                <Input value={this.state.PicDetailForms.GrossWgt} readOnly onChange={this.handleFormChange} name="GrossWgt" style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Sku</p>
                                <Input value={this.state.PicDetailForms.Sku} name="Sku" readOnly onChange={this.handleFormChange} style={{ width: '100%' }} />
                            </div>

                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Qty</p>
                                <Input value={this.state.PicDetailForms.Qty} name="Qty" readOnly onChange={this.handleFormChange} style={{ width: '100%' }} />
                            </div>

                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lot</p>
                                <Input value={this.state.PicDetailForms.Lot} name="Lot" readOnly onChange={this.handleFormChange} style={{ width: '100%' }} />

                            </div>

                            <div className="col-3">

                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Tare Wgt</p>
                                <Input value={(this.state.PicDetailForms.GrossWgt - this.state.PicDetailForms.NetWgt) || ""} readOnly name="TareWgt" style={{ width: '100%' }} />

                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Status</p>
                                <Input value={this.state.Status} readOnly onChange={this.handleFormChange} name="Status" style={{ width: '100%' }} />

                            </div>
                            {this.state.SerialKey === "" ? (
                                <div className="col-3">
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM *</p>

                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        name="UOM"
                                        required={true} validityStyles={false}
                                        value={this.state.PicDetailForms.UOM || ""} onChange={this.handleFormChange}
                                        data={this.state.UOM}


                                        defaultValue="Select "
                                    />



                                </div>
                            ) : (<></>)}


                            <div className="col-3">
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>To Location</p>
                                <Input value={this.state.PicDetailForms.ToLoc} onChange={this.handleFormChange} readOnly name="ToLoc" style={{ width: '100%' }} />
                            </div>


                        </div>

                    </Card>
                </form>

                {/* OrderPopup */}
                {this.state.OrderDialog && (

                    <Dialog title={"Please select Order"} width="50%" onClose={this.closeOrder}>

                        <Grid

                            pageable={true}

                            sortable={true}

                            filterable={true}



                            data={process(this.state.OrdersTable, this.state.dataState)}

                            {...this.state.dataState}

                            onDataStateChange={(e) => {

                                // setDataState(e.dataState);
                                this.setState({ dataState: e.dataState })

                            }}
                            onRowClick={(event) => {

                                this.setState({ PicDetailForms: { ...this.state.PicDetailForms, ["OrderKey"]: event.dataItem.OrderKey } })
                                this.closeOrder();
                            }}


                        >
                            <Column field="OrderKey" style={{ cursor: "pointer" }} title="OrderKey" filterable={true} />
                            <Column field="Status" title="Status" filterable={false} cell={this.statusCell} />
                            <Column field="typedescr" style={{ cursor: "pointer" }} title="Type" filterable={true} />

                        </Grid>

                    </Dialog>

                )}

                {this.state.OrderDetailDialog && (

                    <Dialog title={"Please select"} width="50%" onClose={this.closeOrderDetail}>

                        <Grid

                            pageable={true}

                            sortable={true}

                            filterable={true}



                            data={process(this.state.OrderDetailTable, this.state.dataState)}

                            {...this.state.dataState}

                            onDataStateChange={(e) => {

                                // setDataState(e.dataState);
                                this.setState({ dataState: e.dataState })

                            }}
                            onRowClick={(event) => {

                                this.setState({
                                    PicDetailForms: {
                                        ...this.state.PicDetailForms,
                                        ["Sku"]: event.dataItem.Sku,
                                        ["Qty"]: event.dataItem.OpenQty,
                                        ["PackKey"]: event.dataItem.PackKey,
                                        ["OrderLineNumber"]: event.dataItem.OrderLineNumber
                                    }
                                })

                                // this.setState({ Status: event.dataItem.Status })

                                getPackUoms(token, event.dataItem.PackKey).then(res => {
                                    console.log(res);


                                    // setUom(Object.values(res[0]).filter(obj=>{
                                    //     return obj !== " "
                                    // }))

                                    this.setState({
                                        UOM: Object.values(res[0]).filter(obj => {
                                            return obj !== " "
                                        })
                                    })

                                })
                                this.closeOrderDetail();
                            }}


                        >
                            <Column field="OrderLineNumber" style={{ cursor: "pointer" }} title="Line no" filterable={true} />
                            <Column field="Sku" style={{ cursor: "pointer" }} title="Sku" filterable={true} />
                            <Column field="PackKey" style={{ cursor: "pointer" }} title="PackKey" filterable={true} />
                            <Column field="Status" style={{ cursor: "pointer" }} title="Status" filterable={true} cell={this.detailstatusCell} />

                        </Grid>

                    </Dialog>

                )}

                {this.state.InventoryDialog && (

                    <Dialog title={"Please select Order"} width="50%" onClose={this.closeInventory}>

                        <Grid

                            pageable={true}

                            sortable={true}

                            filterable={true}



                            data={process(this.state.Inventory, this.state.dataState1)}

                            {...this.state.dataState1}

                            onDataStateChange={(e) => {

                                // setDataState(e.dataState);
                                this.setState({ dataState1: e.dataState })

                            }}
                            onRowClick={(event) => {

                                this.setState({
                                    PicDetailForms: {
                                        ...this.state.PicDetailForms,
                                        ["ID"]: event.dataItem.Id,
                                        ["Lot"]: event.dataItem.Lot,
                                        ["Loc"]: event.dataItem.Loc,
                                        // ["Qty"]: event.dataItem.Qty,
                                        ["NetWgt"]: event.dataItem.NetWgt,
                                        ["GrossWgt"]: event.dataItem.GrossWgt,

                                    }
                                })
                                this.closeInventory();


                            }}


                        >
                            <Column field="Id" style={{ cursor: "pointer" }} title="Lpn" filterable={true} />
                            <Column field="Lot" style={{ cursor: "pointer" }} title="Lot" filterable={true} />
                            <Column field="Loc" style={{ cursor: "pointer" }} title="Location" filterable={true} />
                            <Column field="Sku" style={{ cursor: "pointer" }} title="Sku" filterable={true} />

                            <Column field="Qty" style={{ cursor: "pointer" }} title="Qty" filterable={true} />


                        </Grid>

                    </Dialog>

                )}
            </>
        );
    }
}

export default function () {
    const localizationService = useLocalization();
    let navigate = useNavigate()
    // let state = useLocation()
    debugger
    const { state } = useLocation()
    // const test = state && state.PickdetailData;
    // console.log(test);
    return <PickDetailCreation localizationService={localizationService} loadingValue={state} navigate={navigate} />
}