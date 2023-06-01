import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalization } from '@progress/kendo-react-intl';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../../src/components/form/Notification";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { PostItem } from "../../../services/ConfigurationService/ConfigurationService";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {getLocFieldValue} from "../../../services/ConfigurationService/ConfigurationService";
import {getPack} from "../../../services/ConfigurationService/ConfigurationService";



const ItemMasterCreation = () => {
    const allocationStatagey = ["N03"]
    const putawayStatageyKey = ["STD"]
    const Packkey = ["FTWZ-1-999"]

    const itemCreationForm = {

        SkuFacilityGroup: null,
        Type: null,
        Action: null,
        // StorerKey: "BSI FTWZ",
        StorerKey: localStorage.getItem("Client"),
        Sku: "",
        SourceVersion: "0",
        AccountingEntity: null,
        Active: "1",
        AvgCaseWeight: "0.00000",
        BUsr1: null,
        BUsr2: null,
        BUsr3: null,
        BUsr4: null,
        BUsr5: null,
        BUsr6: null,
        BUsr7: null,
        BUsr8: null,
        BUsr9: null,
        BUsr10: null,
        CatchGrossWgt: "0",
        CatchNetWgt: "0",
        CatchTareWgt: "0",
        Class: "STD",
        CountSequence: "1",
        CubeUOM: null,
        CWFlag: null,
        Descr: "",
        DimenUOM: null,
        FillQtyUOM: " ",
        FreightClass: null,
        GrossWgt: "0",
        GroupFtEach: "1",
        HazMatCodesKey: "",
        ICD1Unique: null,
        ICDFlag: "0",
        ICWBy: "0",
        ICWFlag: "0",
        IDEWeight: "0",
        ItemReference: " ",
        Lottable01Label: "Lottable01",
        Lottable02Label: "Lottable02",
        Lottable03Label: "Lottable03",
        Lottable04Label: "Manufacturing Date",
        Lottable05Label: "Expiration Date",
        Lottable06Label: "Lottable06",
        Lottable07Label: "Lottable07",
        Lottable08Label: "Lottable08",
        Lottable09Label: "Lottable09",
        Lottable10Label: "Lottable10",
        Lottable11Label: "Delivery By Date",
        Lottable12Label: "Best By Date",
        LottableValidationKey: "STD",
        MateabilityCode: null,
        NMFCClass: null,
        NonStockedIndicator: "0",
        OACOverride: "0",
        OAvgCaseWeight: "0.00000",
        OCD1Unique: null,
        OCDCatchQty1: "ANY",
        OCDCatchQty2: "ANY",
        OCDCatchQty3: "ANY",
        OCDCatchWhen: "PICK",
        OCDFlag: "0",
        OCWBy: "0",
        OCWFlag: "0",
        ODEWeight: "1",
        OTareWeight: "0.00000",
        OTolerancePct: "0.000000",
        PackKey: "FTWZ-1-999",
        RecurCode: null,
        ShelfLife: "0",
        ShelfLifeCodeType: "E",
        ShelfLifeIndicator: "N",
        ShelfLifeOnReceiving: "0",
        ShippableContainer: "N",
        SkuGroup: "STD",
        SkuGroup2: null,
        StdCube: "0.00000",
        StdGrossWgt1: "0",
        StdNetWgt1: "0",
        StdUOM: null,
        StorageType: null,
        StdGrossWgt: "0",
        StdNetWgt: "0",
        Tare: "0.00000",
        TareWeight: "0",
        TareWgt1: "0",
        Tariffkey: "XXXXXXXXXX",
        ToBestByDays: "0",
        ToDeliverByDays: "0",
        ToExpireDays: "0",
        TolerancePct: "0.000000",
        TransportationMode: null,
        VoiceGroupingId: "0",
        WgtUOM: null,
        ZeroDefaultWgtForPick: "0",
        Cube: "0",
        ManufacturerSku: null,
        RetailSku: null,
        SkuType: "0",
        TempForASN: "N",
        ItemCharacteristic1: null,
        ItemCharacteristic2: null,
        CommodityClass: null,
        StockCategory: null,
        CountryOfOrigin: null,
        Collection: null,
        Theme: null,
        Season: null,
        Style: null,
        Color: null,
        SkuSize: null,
        CampaignStart: null,
        CampaignEnd: null,
        IBSumCwFlg: "0",
        OBSumCwFlg: "0",
        ShowRFCWOnTrans: "0",
        BarcodeConfigKey: null,
        TransportationService: null,
        DefaultEquipmentAttribute: null,
        DefaultEquipmentType: null,
        DefaultEquipmentLength: null,
        Vert_Storage: "0",
        OnReceiptCopyPackKey: "0",
        ABC: null,
        AllowConsolidation: "0",
        AllowMultiLotLPN: "0",
        AutoReleaseLotBy: "01",
        AutoReleaseLpnBy: "01",
        BulkCartonGroup: " ",
        CarryCost: "0",
        CartonGroup: "STD",
        CartonizeFT: "0",
        CCDiscrepancyRule: "STD",
        Conveyable: "N",
        Cost: "0.0000",
        DAPickSort: "1",
        DateCodeDays: "999",
        DefaultRotation: "1",
        FlowThruItem: "N",
        HoursToHoldLot: "0.00",
        HoursToHoldLpn: "0.00",
        LastCycleCount: null,
        LotHoldCode: null,
        ManualSetupRequired: "0",
        MaxPalletsPerZone: "0",
        MinimumShelfLifeOnRFPicking: "0",
        MinimumWaveQty: null,
        Notes1: null,
        Notes2: null,
        Price: "0.0000",
        PutawayLoc: "UNKNOWN",
        PutawayStrategyKey: "STD",
        PutawayZone: "RACK",
        QCLoc: "QC",
        QCLocOut: "PICKTO",
        ReceiptHoldCode: "",
        ReceiptInspectionLoc: "QC",
        ReceiptValidationTemplate: "STD",
        ReorderPoint: null,
        ReturnsLoc: "RETURN",
        ReorderQty: null,
        RFDefaultPack: "STD",
        RFDefaultUOM: "EA",
        RotateBy: "Lot",
        RplnSort: "1",
        SerialNumberEnd: null,
        SerialNumberNext: null,
        SerialNumberStart: null,
        StackLimit: "0",
        StdOrderCost: "0",
        StrategyKey: null,
        SUsr1: null,
        SUsr2: null,
        SUsr3: null,
        SUsr4: null,
        SUsr5: null,
        SUsr6: null,
        SUsr7: null,
        SUsr8: null,
        SUsr9: null,
        SUsr10: null,
        VerifyLot04Lot05: "0",
        AutoAssignConsLoc: "0",
        ConsPickLocMin: "0.00000",
        ConsPickLocMax: "0.00000",
        ConsPickMinMaxUOM: null,
        ConsPickReplenUOM: null,
        RoundBackflushQty: "1",
        ForceUOMReplenQty: "0",
        ReceiptUnitLabelName: null,
        ReceiptUnitLabelUOM: null,
        AMStrategyKey: "",
        TempForAsn: null,
        PutawayClass: "0",
        NewAllocationStrategy: "N03",
        SlotGroup: null,
        PickContPlacement: "5",
        LotCtrlAtPack: "0",
        LastCCReleaseDate: null,
        SubstituteSku: null,
        Sequence: null,
        SubPackKey: null,
        Uom: null,
        UomQty: null,
        Qty: null,
        SubUom: null,
        SubUomQty: null,
        SubQty: null,
        AltSku: null,
        AltSkuPackKey: null,
        DefaultUOM: null,
        Vendor: null,
        Udf1: null,
        Udf2: null,
        Udf3: null,
        Udf4: null,
        Udf5: null,
        ColumnName: null,
        Translation: null,
        ComponentSku: null,
        BOMOnly: null,
        Notes: null,
        AddDate: null,
        AddWho: null,
        EditWho: null,
        EditDate: null,



    }


    //declare service
    const localizationService = useLocalization();
    const { state } = useLocation();

    //usestate
    const [itemForm, setItemForm] = useState(itemCreationForm);
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const [AllocationStra, setAllocationStra] = useState([]);
    const [PutAwayStra, setPutAwayStra] = useState([]);
    const [pack,setPack] = useState([]);

    const itemUpdateState = state && state.itemUpdate;
    const Action = state && state.maction;

    //token
    let token = localStorage.getItem("selfToken");


    useEffect(() => {
        if (Action === "2") {
            setItemForm(itemUpdateState)


        }
        debugger
        getPack(token).then(res=>{
console.log(res);    
   
setPack(res.map(obj=>{
    return obj.packkey
}));
})

    }, [token])
    //Tab strip
    const [selected, setSelected] = React.useState(0);
    const handleSelect = (e) => {

        setSelected(e.selected);
    };
    const handleChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;
        setItemForm({ ...itemForm, [name]: value })

    }



    const onSubmit = (e) => {
        
        console.log();
        if(document.getElementById('tareweight').value >= 0){
      
            const date = new Date();
            itemForm.AddWho = localStorage.getItem('Client');
            itemForm.EditWho = localStorage.getItem('Client');
            itemForm.AddDate = date;
            itemForm.EditDate = date;
            if(Action !=="2"){
                itemForm.TareWeight = document.getElementById('tareweight').value
            }
            // DateFunction();
    
            if (Action == "2") {
    
    
                itemForm.EditDate = new Date().toISOString().split('T')[0];
                itemForm.EditWho = localStorage.getItem("Client");
                ItemCreation(itemForm, "2");
    
            }
            else {
                itemForm.AddWho = localStorage.getItem("Client");
                itemForm.AddDate = new Date().toISOString().split('T')[0];
                itemForm.EditDate = new Date().toISOString().split('T')[0];
                itemForm.EditWho = localStorage.getItem("Client");
    
                ItemCreation(itemForm, "1");
            }
        }
        else{
                            var timeout;
                setopen(true)
                    setmessage("Tare Weight cannot be Negative")
          
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
        }


       
        console.log(itemForm);
        e.preventDefault();

    }
    function isObject(o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }

    function isPlainObject(o) {
        var ctor, prot;

        if (isObject(o) === false) return false;

        // If has modified constructor
        ctor = o.constructor;
        if (ctor === undefined) return true;

        // If has modified prototype
        prot = ctor.prototype;
        if (isObject(prot) === false) return false;

        // If constructor does not have an Object-specific method
        if (prot.hasOwnProperty('isPrototypeOf') === false) {
            return false;
        }

        // Most likely a plain Object
        return true;
    };

    const ItemCreation = (event, mAction) => {

        let finalobj = { ...event }
        finalobj.NewAllocationStrategy = isPlainObject(event.NewAllocationStrategy) ? event.NewAllocationStrategy.code : event.NewAllocationStrategy
        finalobj.PutawayStrategyKey = isPlainObject(event.PutawayStrategyKey) ? event.PutawayStrategyKey.code : event.PutawayStrategyKey

        PostItem("[" + JSON.stringify(event) + "]", token, mAction).then(res => {
            if (res === "Successfully posted to WMS") {

                var timeout;
                setopen(true);
                if (mAction == "1") {
                    setmessage("Item Created Successfully")
                }
                else {
                    setmessage(res)

                }
                setseverity("success");
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
                setItemForm(itemCreationForm);
            }
            else {
                var timeout;
                setopen(true)
                if (mAction == "1") {
                    setmessage("Item Creation Failed")
                }
                else {
                    setmessage(res)

                }
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
            }
        })
    }

    return (
        <>
            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inboundHeaderCreation-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>
                <form className="k-form" onSubmit={onSubmit}>

                    <div className="d-flex flex-wrap mt-2 justify-content-between ">
                        <div className='ps-4'> <h4 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.ItemMasterCreation')}{Action === "2" ?(<span> Updation</span>):(<span> Creation</span>)}</h4>
                        </div>

                        <div className='inbound-page pe-4'>
                            <ul className='header-buttons'>


                                {/* <li className='text-uppercase br-round-left active' type="submit">
                            <input type="submit" className="k-button k-button-md" value="Create" /> */}
                                <Button className='br-round-left active' type="submit" fillMode="solid" style={{ width: '90px' }} >{Action === "2" ?(<span>Update</span>):(<span>Create</span>)}</Button>
                                <Button className='br-round-right active' type='button' onClick={() => {
                                    setItemForm(itemCreationForm);
                                }} fillMode="solid" style={{ width: '90px', backgroundColor: '#E6E6E6', color: '#1B1D21' }}>Clear</Button>

                                {/* </li> */}
                            </ul>
                        </div>
                        {/* <div className='position-relative pe-4'>
                        <ul className='header-buttons'>
                            <li className='text-uppercase br-round-left active' onClick={onSubmit}><span>Create</span></li>
                            <li className='text-uppercase br-round-right active' onClick={onSubmit}><span>Clear</span></li>

                        </ul>
                    </div> */}
                    </div>

                    <TabStrip selected={selected} onSelect={handleSelect} style={{ margin: '10px' }}>
                        <TabStripTab title="Item Details">

                            <div className='row'>
                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Owner *</p>
                                    <Input readOnly value={itemForm.StorerKey || ""} name="StorerKey" style={{ width: '100%' }} />
                                </div>

                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Standard Net Weight *</p>
                                    <Input value={itemForm.StdNetWgt || ""} maxLength="5" type="number" min="0" name="StdNetWgt" onChange={handleChange} required={true} validityStyles={false} style={{ width: '100%' }} />
                                </div>

                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Allocation Strategy *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        value={itemForm.NewAllocationStrategy || ""}
                                        onChange={handleChange}
                                        name="NewAllocationStrategy"
                                        required={true} validityStyles={false}
                                        data={allocationStatagey}
                                       
                                        dataItemKey="code"
                                    />
                                </div>







                            </div>

                            <div className='row' style={{ marginTop: '10px' }}>


                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Item *</p>
                                    {Action === "2" ? (<Input value={itemForm.Sku || ""} name="Sku" readOnly onChange={handleChange} maxLength="50" required={true} validityStyles={false} style={{ width: '100%' }} />
                                    ) : (
                                        <Input value={itemForm.Sku || ""} name="Sku" onChange={handleChange} maxLength="50" required={true} validityStyles={false} style={{ width: '100%' }} />
                                    )}
                                </div>

                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Standard Gross Weight *</p>
                                    <Input value={itemForm.StdGrossWgt || ""} maxLength="5" type="number" min="0" name="StdGrossWgt" required={true} validityStyles={false} onChange={handleChange} style={{ width: '100%' }} />
                                </div>

                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Putaway Strategy *</p>
                                    {/* <Input value={itemForm.PUTAWAYSTRATEGYKEY || ""} name="PUTAWAYSTRATEGYKEY" required={true} validityStyles={false} onChange={handleChange} style={{ width: '100%' }} /> */}
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        value={itemForm.PutawayStrategyKey || ""}
                                        onChange={handleChange}
                                        name="PutawayStrategyKey"
                                        required={true} validityStyles={false}
                                        data={putawayStatageyKey}
                                        defaultValue="Select "
                                    />
                                </div>

                         

                        </div>

                        <div className='row' style={{ marginTop: '10px' }}>

                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Description</p>
                                    <Input name="Descr" value={itemForm.Descr || ""} onChange={handleChange} maxLength="60" style={{ width: '100%' }} />
                                </div>

                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Standard Tare Weight *</p>
                                    <Input name="TareWeight" id='tareweight' type="number"  min="0"  readOnly value={(itemForm.StdGrossWgt - itemForm.StdNetWgt) || ""} maxLength="5"  onChange={handleChange} style={{ width: '100%' }} />
                                </div>

                       

                         



                        </div>

                        <div className='row' style={{ marginTop: '10px' }}>

                                <div className='col-lg-4 col-12'>
                                    <p style={{ marginBottom: '2px', fontSize: 12 }}>Pack *</p>
                                    <DropDownList
                                        style={{
                                            width: "100%",
                                        }}
                                        value={itemForm.PackKey || ""}
                                        onChange={handleChange}
                                        name="PackKey"
                                        required={true} validityStyles={false}
                                        data={pack}
                                        defaultValue="Select "
                                    />
                                </div>




                              



                            </div>


                        </TabStripTab>
                    </TabStrip>
                </form>






            </div>

        </>
    );
}

export default ItemMasterCreation;