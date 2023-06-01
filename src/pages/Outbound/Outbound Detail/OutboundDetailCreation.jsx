import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { useLocalization } from '@progress/kendo-react-intl';
import { Input } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { getStorerkeys } from "../../../services/OutboundService/outboundService"
import { process } from "@progress/kendo-data-query";
import {OrderCreate} from "../../../services/OutboundService/outboundService";
import {getItem} from "../../../services/ConfigurationService/ConfigurationService"
import {OrderDetail} from "../../../services/OutboundService/outboundService"
import moment from 'moment';
const OrderDetailCreation = () =>{

    const OrderDetailValue = {
  

            OrderKey: "",
            ExternOrderKey: "",
            OrderLineNumber: "",
            StorerKey: localStorage.getItem("Client"),
            Sku: "",
            PackKey: "",
            OpenQty: "",
            NewAllocationStrategy: "",
            Lottable01: "",
            Lottable02: "",
            Lottable03: "",
            Lottable04:"",
            Lottable05:"",
            Lottable06: "",
            Lottable07: "",
            Lottable08: "",
            Lottable09: "",
            Lottable10: "",
            Status:"Created Internallyw",
            Desc:""
    }

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


    // const receiptdetail = state && state.receiptKey
    // const lineno = state && state.lineno
    // const Action = state && state.maction
    const localizationService = useLocalization();
    let navigate = useNavigate()
    const { state } = useLocation()
    const OrderHeader = state && state.orderkey;
    const OrderKeyValue = state.key;
    
    const Action = state && state.maction;
    const orderlineno = state && state.OrderLineno
    const externorderkey = state && state.Externorderkey;
    const [loading, setLoading] = useState(false)
    const [orderdetailForm,setorderdetailForm] = useState(OrderDetailValue)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const [skuDialog, setskuDialog] = React.useState(false);
    const [dataState, setDataState] = useState(initialDataState)

    const [skuTable, setSkuTable] = useState([]);


    let token = localStorage.getItem("selfToken");
    useEffect(async () => {
console.log(externorderkey);
debugger

        // setLoading(true)
        console.log(OrderHeader);
        console.log(orderdetailForm);
        if(Action === "2"){
            const temp =  {
             OrderKey : OrderKeyValue,
                ExternOrderKey : OrderHeader.ExternOrderKey,
                OrderLineNumber : OrderHeader.OrderLineNumber,
                StorerKey: OrderHeader.StorerKey,
            Sku: OrderHeader.Sku,
                PackKey: OrderHeader.PackKey,
                OpenQty:OrderHeader.OpenQty,
                NewAllocationStrategy: OrderHeader.NewAllocationStrategy,
                Lottable01: OrderHeader.Lottable01,
               Lottable02: OrderHeader.Lottable02,
                Lottable03: OrderHeader.Lottable03,
                Lottable04: new Date(OrderHeader.Lottable04),
               Lottable05: new Date(OrderHeader.Lottable05),
                Lottable06: OrderHeader.Lottable06,
                Lottable07: OrderHeader.Lottable07,
                Lottable08: OrderHeader.Lottable08,
                Lottable09: OrderHeader.Lottable09,
                Lottable10: OrderHeader.Lottable10,
                Status: OrderHeader.Status,
                Desc: OrderHeader.descr,
            }
            // orderdetailForm.OrderKey = OrderKeyValue;
            // orderdetailForm.ExternOrderKey = OrderHeader.ExternOrderKey;
            // orderdetailForm.OrderLineNumber = OrderHeader.OrderLineNumber;
            // orderdetailForm.StorerKey= OrderHeader.StorerKey;
            // orderdetailForm.Sku= OrderHeader.Sku;
            // orderdetailForm.PackKey= OrderHeader.PackKey;
            // orderdetailForm.OpenQty= OrderHeader.OpenQty;
            // orderdetailForm.NewAllocationStrategy= OrderHeader.NewAllocationStrategy;
            // orderdetailForm.Lottable01= OrderHeader.Lottable01;
            // orderdetailForm.Lottable02= OrderHeader.Lottable02;
            // orderdetailForm.Lottable03= OrderHeader.Lottable03;
            // orderdetailForm.Lottable04= OrderHeader.Lottable04;
            // orderdetailForm.Lottable05= OrderHeader.Lottable05;
            // orderdetailForm.Lottable06= OrderHeader.Lottable06;
            // orderdetailForm.Lottable07= OrderHeader.Lottable07;
            // orderdetailForm.Lottable08= OrderHeader.Lottable08;
            // orderdetailForm.Lottable09= OrderHeader.Lottable09;
            // orderdetailForm.Lottable10= OrderHeader.Lottable10;
            // orderdetailForm.Status= OrderHeader.Status;
            // orderdetailForm.Desc= OrderHeader.descr;
            setorderdetailForm(temp)
            console.log(temp);
        }
        else{
            // if(orderlineno){
               
            // }
            // else{
            //     orderdetailForm.OrderLineNumber = "00001";
            // }
            orderdetailForm.OrderLineNumber = orderlineno;
            orderdetailForm.OrderKey = OrderKeyValue;
            orderdetailForm.ExternOrderKey = externorderkey.ExternOrderKey;
        }
        console.log(OrderKeyValue);
        
        // setLoading(false)
    }, [token])

    const [selected, setSelected] = React.useState(0);
    const handleSelect = (e) => {
        setSelected(e.selected);
    };
   
    const handleChange = (event) => {
        console.log(event);

        const name = event.target.name;
        const value = event.target.value;
        console.log(value);
        setorderdetailForm({ ...orderdetailForm, [name]: value })

    }
    const onSkuClick =() =>{
        if (!skuDialog) {

            setLoading(true)

            getItem(token).then((res => {

                console.log(res);

                setSkuTable(res);

                setLoading(false)
                setskuDialog(!skuDialog);


            }))

        }
    }

    const closeSku = () =>{
        setskuDialog(!skuDialog);
    }
    const onSubmit = () =>{
        
        console.log(new Date("MM/DD/YYYY HH:MM:SS"));
        console.log(new Date("MM/dd/yyyy hh:mm:ss"));
        debugger
        let orderdetailValue = []
        orderdetailValue.push(orderdetailForm)
        if((orderdetailForm.ExternOrderKey !=="") && (orderdetailForm.Sku !=="") && (orderdetailForm.OpenQty !=="") && (orderdetailForm.PackKey !=="") && (orderdetailForm.NewAllocationStrategy !=="")
        && (orderdetailForm.Lottable01 !=="")&& (orderdetailForm.Lottable02 !=="")&& (orderdetailForm.Lottable03 !=="")&& (orderdetailForm.Lottable04 !=="")&& (orderdetailForm.Lottable05 !=="")){
            const newState = orderdetailValue.map(obj => {

                // ??? if id equals 2, update country property
    
                // if (obj.id === 2) {
    
                const date = new Date();
               
                // if (action === "1") {
    
                    const { Status, Desc, ...rest } = obj;
    
                    return { ...rest,Lottable04:moment(orderdetailForm.Lottable04).format("MM/DD/YYYY HH:MM:SS"),Lottable05:moment(orderdetailForm.Lottable05).format("MM/DD/YYYY HH:MM:SS")};
    
                // }
    
                // else if (action === "2") {
    
                    // const { LOTTABLE09, DATERECEIVED, EFFECTIVEDATE, ...rest } = obj;
    
                    // return { ...rest, QtyReceived: "0", Status: statusDecode.statusDecode.inbound_New, Lottable09: obj.LOTTABLE09 };
    
    
    
                // }
    
                // }
    
    
    
                // ??? otherwise return object as is
    
                // return obj;
    
            });
            debugger
            console.log(newState);
            OrderDetail(JSON.stringify(newState),token,orderdetailForm.OrderKey,orderdetailForm.ExternOrderKey).then(res=>{
                console.log(res);
                if(res === "ShipmentOrder Stored"){
                    var timeout;
                    setLoading(false);
                    
        
                        setopen(true);
                    if(Action === "2"){
                        setmessage("Order detail Update Succesfully")
                    }
                    else{
                        setmessage("Order detail Created Succesfully")
                    }
        
                      
                        setseverity("success")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                        navigate('/Outbound/detail', { state: { outbound:externorderkey} }) 
                        // /Outbound/detail
                }
                else{
                    var timeout;
                    setLoading(false);
                    
        
                        setopen(true);
            
                
                        setmessage(res)
                    
                      
                        setseverity("error")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                }
            })
        }
        else{
            var timeout;
            setLoading(false);
            

                setopen(true);
            
                    setmessage("Please fill mandatory field")

              
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
        }
      

        // OrderDetail()
    }
   
    return (
        <>

        {loading && <Loader loading={loading} />}
        <div id="Planning" className="inbound-page main-content">

            <div className='row' style={{ justifyContent: "center" }}>
                <WithSnackbar open={open} message={message} severity={severity} />
            </div>
          
            <div className="d-flex mt-3 justify-content-between">
                <div className='ps-3'>
                    <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.OrderdetailCreation')}  {OrderKeyValue}</h3>
                    
                </div>

                <div className='position-relative pe-4'>
                    <ul className='header-buttons'>


                        {/* <li className='text-uppercase br-round-left active' type="submit">
                        <input type="submit" className="k-button k-button-md" value="Create" /> */}
                        <li className='text-uppercase br-round-left active' type="button" fillMode="solid"  onClick={onSubmit}>Create</li>
                        <li className='text-uppercase br-round-right active' type='button' fillMode="solid" >Clear</li>

                        {/* </li> */}
                    </ul>
                </div>
            </div>
        </div>

        <TabStrip selected={selected} onSelect={handleSelect} style={{ margin: '10px' }}>
                <TabStripTab title="General">
                    <div className='row'>
                        <div className='col-4'>
                        <p style={{ marginBottom: '2px', fontSize: 12 }}>Order Line Number</p>
                    <Input readOnly value={orderlineno || ""} name="OrderLineNumber" onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                        <div className='col-4'>
                        <p style={{ marginBottom: '2px', fontSize: 12 }}>Open Qty *</p>
                    <Input  value={orderdetailForm.OpenQty || ""} name="OpenQty" onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                        <div className='col-4'>
                        <p style={{ marginBottom: '2px', fontSize: 12 }}>Status</p>
                    <Input value={orderdetailForm.Status || ""} name="Status" onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                   
                    </div>
                    <div className='row'>
                    <div className='col-4'>
                        <p style={{ marginBottom: '2px', fontSize: 12 }}>Sku *</p>
                    <Input  readOnly value={orderdetailForm.Sku || ""} onClick={onSkuClick} style={{ width: '100%' }} />
                        </div>
                        <div className='col-4'>
                        <p style={{ marginBottom: '2px', fontSize: 12 }}>Desc</p>
                    <Input readOnly value={orderdetailForm.Desc || ""} style={{ width: '100%' }} />
                        </div>
               
                        <div className='col-4'>
                        <p style={{ marginBottom: '2px', fontSize: 12 }}>Packkey</p>
                    <Input readOnly value={orderdetailForm.PackKey || ""} style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div className='row'>
                    <div className='col-4'>
                        <p style={{ marginBottom: '2px', fontSize: 12 }}>Allocation Stratagy</p>
                    <Input readOnly value={orderdetailForm.NewAllocationStrategy || ""}   style={{ width: '100%' }} />
                        </div>
                    </div>
                </TabStripTab>
                <TabStripTab title="Lottable">
                <div className='row'>
            

                                <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable01 *</p>
                                <Input  value={orderdetailForm.Lottable01 || ""} name="Lottable01" onChange={handleChange} style={{ width: '100%' }} />
                                </div>

                                 <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable07</p>
                                <Input  value={orderdetailForm.Lottable07 || ""} name="Lottable07" onChange={handleChange} style={{ width: '100%' }} />
                                </div>
                             
                            </div>

                            <div className='row' style={{marginTop:'10px'}}>
                            

                                <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable02 *</p>
                                <Input  value={orderdetailForm.Lottable02 || ""} name="Lottable02" onChange={handleChange} style={{ width: '100%' }} />
                                </div>

                                 <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable08</p>
                                <Input  value={orderdetailForm.Lottable08 || ""} name="Lottable08" onChange={handleChange}  style={{ width: '100%' }} />
                                </div>
                             
                            </div>

                            <div className='row' style={{marginTop:'10px'}}>
                          

                                <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable03 *</p>
                                <Input  value={orderdetailForm.Lottable03 || ""} name="Lottable03" onChange={handleChange}  style={{ width: '100%' }} />
                                </div>

                                 <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable09</p>
                                <Input  value={orderdetailForm.Lottable09 || ""} name="Lottable09" onChange={handleChange} style={{ width: '100%' }} />
                                </div>
                             
                            </div>


                            <div className='row' style={{marginTop:'10px'}}>
                             

                                <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Manufacture Date *</p>
                                <DatePicker
                                    name="Lottable04"
                                    value={orderdetailForm.Lottable04 || ""}
                                    onChange={handleChange}
                                    format="dd/MMM/yyyy"
                                    weekNumber={true}
                                    width='100%'
                                    style={{ marginTop: '20px' }}
                                />
                                </div>

                                 <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable10</p>
                                <Input  value={orderdetailForm.Lottable010 || ""} name="Lottable10" onChange={handleChange}  style={{ width: '100%' }} />
                                </div>
                             
                            </div>

                            <div className='row' style={{marginTop:'10px'}}>
                            
                                <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Expiration Date *</p>
                                <DatePicker
                                     name="Lottable05"
                                     value={orderdetailForm.Lottable05 || ""}
                                     onChange={handleChange}
                                    
                                    format="dd/MMM/yyyy"
                                    weekNumber={true}
                                    width='100%'
                                    style={{ marginTop: '20px' }}
                                />
                                </div>

                                 <div className='col-6'>
                                 <div className='col-6'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Lottable06</p>
                                <Input  value={orderdetailForm.Lottable06 || ""} name="Lottable06" onChange={handleChange} style={{ width: '100%' }} />
                                </div>
                                </div>
                             
                            </div>

                </TabStripTab>
                </TabStrip>

                {skuDialog && (

<Dialog title={"Please select Sku"} width="50%" onClose={closeSku}>

    <Grid

        pageable={true}

        sortable={true}

        filterable={true}



        data={process(skuTable, dataState)}

        {...dataState}

        onDataStateChange={(e) => {

            setDataState(e.dataState);

        }}
        onRowClick={(event) => {
            orderdetailForm.Sku = event.dataItem.Sku;
            orderdetailForm.PackKey = event.dataItem.PackKey;
            orderdetailForm.NewAllocationStrategy = event.dataItem.NewAllocationStrategy;
            orderdetailForm.Desc = event.dataItem.Descr

            closeSku();
        }}
      

    >
        <Column field="Sku" style={{ cursor: "pointer" }} title="Sku" filterable={true} />
        <Column field="Descr" style={{ cursor: "pointer" }} title="Descr" filterable={true} />


    </Grid>

</Dialog>

)}
    </>
    )
}

export default OrderDetailCreation;