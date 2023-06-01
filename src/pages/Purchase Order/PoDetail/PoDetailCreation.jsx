import * as React from 'react';
import { useState, useEffect } from 'react';
import Loader from "../../../components/Loader/Loader";
import { useLocalization } from '@progress/kendo-react-intl';
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { useNavigate } from "react-router-dom";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { Button } from "@progress/kendo-react-buttons";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { getItem } from "../../../services/ConfigurationService/ConfigurationService"
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { useLocation } from "react-router-dom";
import { PutPODetail } from "../../../services/PoService/PoService";
import { getPackUoms, getPack } from "../../../services/ConfigurationService/ConfigurationService";
import { Card } from "@progress/kendo-react-layout";


const PoDetailCreation = () => {
    const data = ["EA"]
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

    const povalue = {
        POLineNumber: "",
        StorerKey: localStorage.getItem("Client"),
        ExternLineNo: "",
        PackKey: "STD",
        QtyOrdered: "",
        QtyAdjusted: "",
        QtyReceived: "",
        QCAutoAdjust: "",
        POKey: "",
        SourceLocation: null,
        Sku: "",
        PODetailKey: "",
        ExternPOKey: "",
        MarksContainer: "",
        SourceVersion: null,
        SKUDescription: "",
        ManufacturerSku: "",
        RetailSku: "",
        AltSku: "",
        UnitPrice: "0",
        UOM: "",
        Notes: null,
        SUsr1: null,
        SUsr2: null,
        SUsr3: null,
        SUsr4: null,
        SUsr5: null,
        Status: "New",
    }

    let token = localStorage.getItem("selfToken");
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [poHeaderTale, setpoHeaderTable] = useState([])
    const localizationService = useLocalization();
    // const [dataState, setDataState] = React.useState(initialDataState);
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("");
    const [severity, setseverity] = useState("success");
    const [skuDialog, setskuDialog] = React.useState(false);
    const [dataState, setDataState] = useState(initialDataState)
    const [podetailForm, setpodetailForm] = useState(povalue);
    const [desc, setDescr] = useState("");
    const [skuTable, setSkuTable] = useState([]);
    const [selected, setSelected] = React.useState(0);
    const { state } = useLocation()
    const [pack, setPack] = useState([]);
    const [uom, setUom] = useState(["EA"]);
    const PoHeaderValueUpdate = state && state.poDetail;
    const PoHeaderfromPo = state && state.poHeader;
    const Action = state && state.maction;
    const lineno = state && state.lineno;


    const handleSelect = (e) => {
        setSelected(e.selected);
    };

    useEffect(async () => {
        setLoading(true)
        const tempCreate = {
            POLineNumber: lineno,
            StorerKey: localStorage.getItem("Client"),
            ExternLineNo: lineno,
            PackKey: "STD",
            QtyOrdered: "0",
            QtyAdjusted: "0",
            QtyReceived: "0",
            QCAutoAdjust: "",
            POKey: PoHeaderValueUpdate.POKey,
            SourceLocation: null,
            Sku: "",
            PODetailKey: "",
            ExternPOKey: PoHeaderValueUpdate.ExternPOKey,
            MarksContainer: "",
            SourceVersion: null,
            SKUDescription: "",
            ManufacturerSku: "",
            RetailSku: "",
            AltSku: "",
            UnitPrice: "0",
            UOM: "",
            Notes: null,
            SUsr1: null,
            SUsr2: null,
            SUsr3: null,
            SUsr4: null,
            SUsr5: null,
            statusdescr : "New",
            Status: '0'
        }
        setpodetailForm(tempCreate)
        if (Action === "2") {
            const temp = {
                POLineNumber: PoHeaderValueUpdate.POLineNumber,
                StorerKey: PoHeaderValueUpdate.StorerKey,
                ExternLineNo: PoHeaderValueUpdate.ExternLineNo,
                PackKey: PoHeaderValueUpdate.PackKey,
                QtyOrdered: PoHeaderValueUpdate.QtyOrdered,
                QtyAdjusted: PoHeaderValueUpdate.QtyAdjusted,
                QtyReceived: PoHeaderValueUpdate.QtyReceived,
                QCAutoAdjust: PoHeaderValueUpdate.QCAutoAdjust,
                POKey: PoHeaderValueUpdate.POKey,
                StorerKey: PoHeaderValueUpdate.StorerKey,
                SourceLocation: PoHeaderValueUpdate.SourceLocation,
                Sku: PoHeaderValueUpdate.Sku,
                PODetailKey: PoHeaderValueUpdate.PODetailKey,
                ExternPOKey: PoHeaderValueUpdate.ExternPOKey,
                MarksContainer: PoHeaderValueUpdate.MarksContainer,
                SourceVersion: PoHeaderValueUpdate.SourceVersion,
                SKUDescription: PoHeaderValueUpdate.SKUDescription,
                ManufacturerSku: PoHeaderValueUpdate.ManufacturerSku,
                RetailSku: PoHeaderValueUpdate.RetailSku,
                AltSku: PoHeaderValueUpdate.AltSku,
                UnitPrice: PoHeaderValueUpdate.UnitPrice,
                UOM: PoHeaderValueUpdate.UOM,
                Notes: PoHeaderValueUpdate.Notes,
                SUsr1: PoHeaderValueUpdate.SUsr1,
                SUsr2: PoHeaderValueUpdate.SUsr2,
                SUsr3: PoHeaderValueUpdate.SUsr3,
                SUsr4: PoHeaderValueUpdate.SUsr4,
                SUsr5: PoHeaderValueUpdate.SUsr5,
                Status: PoHeaderValueUpdate.Status,
                statusdescr : PoHeaderValueUpdate.statusdescr
            }
            setpodetailForm(temp);
        }
        setLoading(false)
        getpack();
    }, [token])

    const getpack = () => {
        getPack(token).then(res => {
            console.log(res);
            setPack(res.map(obj => {
                return obj.packkey
            }));
        })
    }

    const handleChange = (event) => {
        debugger
        var timeout;
        const name = event.target.name;
        const value = event.target.value;
        if (name !== 'QtyOrdered') {
            setpodetailForm({ ...podetailForm, [name]: value })
        }
        else if (parseInt(value) > parseInt(podetailForm.QtyReceived)) {
            setpodetailForm({ ...podetailForm, [name]: value })
        }
        else {
            setopen(true);
            setmessage("Qty Ordered cannot be less than Received Qty")
            setseverity("warning");
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }

    }

    const onSkuClick = () => {
        if (!skuDialog) {
            setLoading(true)
            getItem(token).then((res => {
                setSkuTable(res);
                setLoading(false)
                setskuDialog(!skuDialog);
            }))
        }
    }

    const closeSku = () => {
        setskuDialog(!skuDialog);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        var timeout;
        console.log(JSON.stringify(podetailForm))
        console.log(parseInt(podetailForm.QtyOrdered) < 0)
        if (parseInt(podetailForm.QtyOrdered) <= 0) {
            setopen(true);
            setmessage('Qty Ordered cannot be zero')
            setseverity("warning");
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }
        else {
            PutPODetail("[" + JSON.stringify(podetailForm) + "]", token, podetailForm.ExternPOKey).then(res => {
                if (res === "Successfully posted to WMS") {
                    if (Action === "1") {
                        debugger
                        setopen(true);
                        setmessage("Po Detail Created Successfully")
                        setseverity("success")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                            navigate('/Po/Detail', { state: { poHeader: PoHeaderfromPo, maction: "1" } });
                        }, 2000);
                    }
                    else {
                        debugger
                        setopen(true);
                        setmessage("Po Detail Update Successfully")
                        setseverity("success");
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                    }
                }
                else {
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


    const navigateback = () => {
        debugger
        navigate('/Po/Detail', { state: { poHeader: PoHeaderfromPo, maction: "1" } });
    }
    const handleclear = () => {
        if(Action === '2' )
        {
            setpodetailForm(PoHeaderValueUpdate)
           
        }
        else{
            
            setpodetailForm(povalue)

        }

      
        
    }

   


    return (
        <>

            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inbound-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>
                <form className="k-form" onSubmit={onSubmit}>
                    <Button className='text-uppercase br-round active' type='button' onClick={navigateback} >Back</Button>

                    <div className="d-flex mt-5 justify-content-between">
                        <div className='ps-4'> <h4 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.PoDetail')} {PoHeaderValueUpdate.POKey}</h4>
                        </div>
                        <div className='position-relative pe-4'>
                            <ul className='header-buttons'>


                                {/* <li className='text-uppercase br-round-left active' type="submit" >
                        <input type="submit" className="k-button k-button-md" value="Create" /> */}
                                <Button className='text-uppercase br-round-left active' type="submit"  >Create</Button>
                                <Button  className='text-uppercase br-round-right active' type='button'  onClick={handleclear} >Clear</Button>

                                {/* </li> */}
                            </ul>
                        </div>
                    </div>
                    <Card style={{ padding: "10px", marginTop: '10px' }}>
                        <div className='row'>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Po Line Number</p>
                                <Input style={{ width: '100%' }} required={true} validityStyles={false} value={podetailForm.POLineNumber || ""} readOnly name="POLineNumber" onChange={handleChange} />
                            </div>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Item *</p>
                                <Input data-readonly required={true} validityStyles={false} value={podetailForm.Sku || ""} style={{ width: '90%' }} />
                                <span class="k-icon k-i-zoom-in" readOnly onClick={onSkuClick} style={{ marginLeft: "10px", cursor: "pointer" }}></span>
                            </div>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Description</p>
                                <Input readOnly style={{ width: '100%' }} value={podetailForm.SKUDescription || ""} />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Ordered Qty *</p>

                                <NumericTextBox
                                    min={1}
                                    max={9999}
                                    name="QtyOrdered" 
                                    value={parseInt(podetailForm.QtyOrdered) || 0}
                                    onChange={handleChange}
                                    readOnly={podetailForm.Status === "11" || podetailForm.Status === "9"}
                                    spinners={false}
                                    format="n0"
                                    required={true}
                                />
                            </div>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Received Qty</p>
                                <Input style={{ width: '100%' }} value={podetailForm.QtyReceived || ""} name="QtyReceived" readOnly onChange={handleChange} />
                            </div>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Status</p>
                                <Input style={{ width: '100%' }} value={podetailForm.statusdescr || ""} readOnly name="Status" onChange={handleChange} />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Pack *</p>
                                <DropDownList
                                    style={{
                                        width: "100%",
                                    }}
                                    required={true} validityStyles={false}
                                    value={podetailForm.PackKey || ""} data={pack} name="PackKey" onChange={(event) => {
                                        const name = event.target.name;
                                        const value = event.target.value;
                                        setpodetailForm({ ...podetailForm, [name]: value })
                                        getPackUoms(token, event.target.value).then(res => {
                                            setUom(Object.values(res[0]).filter(obj => {
                                                return obj !== " "
                                            }))
                                        })
                                    }}
                                    defaultValue="Select "
                                />
                            </div>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM *</p>
                                <DropDownList
                                    style={{
                                        width: "100%",
                                    }}
                                    required={true} validityStyles={false}
                                    value={podetailForm.UOM || ""} name="UOM" onChange={handleChange}
                                    data={uom}
                                    defaultValue="Select "
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>Unit Price</p>
                                <Input type='number' required data-readonly style={{ width: '100%' }} value={podetailForm.UnitPrice || ""} name="UnitPrice" onChange={handleChange} />
                            </div>
                            <div className='col-4'>
                                <p style={{ marginBottom: '2px', fontSize: 12 }}>External Line No</p>
                                <Input style={{ width: '100%' }} value={podetailForm.ExternLineNo || ""} name="ExternLineNo" onChange={handleChange} />
                            </div>
                        </div>
                    </Card>
                </form>

            </div>

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
                            console.log(event);
                            podetailForm.Sku = event.dataItem.Sku;
                            podetailForm.SKUDescription = event.dataItem.Descr;
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

export default PoDetailCreation;