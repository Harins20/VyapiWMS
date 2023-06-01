import * as React from 'react';
import { useEffect, useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { useLocalization } from '@progress/kendo-react-intl';
import { putPack, getcodesc } from "../../../services/ConfigurationService/ConfigurationService";
import { useLocation, useNavigate } from "react-router-dom";
import { WithSnackbar } from "../../../components/form/Notification";
import Loader from "../../../components/Loader/Loader";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { NumericTextBox } from '@progress/kendo-react-inputs';

const PackCreation = () => {
    var timeout;
    const { state } = useLocation()
    const packdetail = state && state.packkey

    const localizationService = useLocalization();
    let navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState();
    const [uom1, setuom1] = useState([])
    const [uom2, setuom2] = useState([])
    const [uom3, setuom3] = useState([])
    const [uom4, setuom4] = useState([])
    const [uom5, setuom5] = useState([])
    const [uom6, setuom6] = useState([])
    const [uom7, setuom7] = useState([])
    const [uom8, setuom8] = useState([])
    const [uom9, setuom9] = useState([])
    var uom1obj = "", uom2obj = "", uom3obj = "", uom4obj = "", uom5obj = "", uom6obj = "", uom7obj = "", uom8obj = "", uom9obj = ""
    let token = localStorage.getItem("selfToken");

    const packstate = {
        packkey: "",
        packdescr: "",
        PackUOM1: " ",
        CASECNT: 0.0,
        ISWHQTY1: "",
        REPLENISHUOM1: "N",
        REPLENISHZONE1: "N",
        LENGTHUOM1: "0",
        WIDTHUOM1: "0",
        HEIGHTUOM1: "0",
        CUBEUOM1: "0",
        FilterValueUOM1: null,
        IndicatorDigitUOM1: null,
        PACKUOM2: " ",
        INNERPACK: 0.0,
        ISWHQTY2: "",
        REPLENISHUOM2: "N",
        REPLENISHZONE2: "N",
        CARTONIZEUOM2: "N",
        LENGTHUOM2: "0",
        WIDTHUOM2: "0",
        HEIGHTUOM2: "0",
        CUBEUOM2: "0",
        FilterValueUOM2: null,
        IndicatorDigitUOM2: null,
        PACKUOM3: " ",
        QTY: 1.00000,
        ISWHQTY3: "",
        REPLENISHUOM3: "Y",
        REPLENISHZONE3: "N",
        CARTONIZEUOM3: "Y",
        LENGTHUOM3: "0",
        WIDTHUOM3: "0",
        HEIGHTUOM3: "0",
        CUBEUOM3: "0",
        FilterValueUOM3: null,
        IndicatorDigitUOM3: null,
        PACKUOM4: " ",
        PALLET: 0.0,
        ISWHQTY4: "",
        REPLENISHUOM4: "N",
        REPLENISHZONE4: "N",
        CARTONIZEUOM4: "N",
        LENGTHUOM4: "0",
        WIDTHUOM4: "0",
        HEIGHTUOM4: "0",
        CUBEUOM4: "0",
        FilterValueUOM4: null,
        IndicatorDigitUOM4: null,
        PALLETWOODLENGTH: "0",
        PALLETWOODWIDTH: "0",
        PALLETWOODHEIGHT: "0",
        PALLETTI: "0.00000",
        PALLETHI: "0.00000",
        PACKUOM5: " ",
        CUBE: 0.0,
        ISWHQTY5: "",
        FilterValueUOM5: null,
        IndicatorDigitUOM5: null,
        PACKUOM6: " ",
        GROSSWGT: 0.0,
        ISWHQTY6: "",
        FilterValueUOM6: null,
        IndicatorDigitUOM6: null,
        PACKUOM7: " ",
        NETWGT: 0.0,
        ISWHQTY7: "",
        FilterValueUOM7: null,
        IndicatorDigitUOM7: null,
        PACKUOM8: " ",
        OTHERUNIT1: 0.0,
        ISWHQTY8: "",
        REPLENISHUOM8: "N",
        REPLENISHZONE8: "N",
        CARTONIZEUOM8: "N",
        LENGTHUOM8: "0",
        WIDTHUOM8: "0",
        HEIGHTUOM8: "0",
        FilterValueUOM8: null,
        IndicatorDigitUOM8: null,
        PACKUOM9: " ",
        OTHERUNIT2: 0.0,
        ISWHQTY9: "",
        REPLENISHUOM9: "N",
        REPLENISHZONE9: "N",
        CARTONIZEUOM9: "N",
        LENGTHUOM9: "0",
        WIDTHUOM9: "0",
        HEIGHTUOM9: "0",
        FilterValueUOM9: null,
        IndicatorDigitUOM9: null,
        ACCOUNTINGENTITY: null
    }



    // const [packCreationFormValues, setPackCreationFormValues] = useState((packdetail) => packdetail === null ? packstate : packstate);
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


    const [packCreationFormValues, setPackCreationFormValues] = useState(packstate)
    



    useEffect(() => {
        debugger
        //console.log(packdetail, "packdetail");

        if (packdetail !== null) {
            setPackCreationFormValues(packdetail);
        }
        getcodesc(token, 'PACKAGE').then((res => {
            if (res) {
                
                if (packdetail !== null) {
                    uom1obj = res.find(obj => obj.code === packdetail.PackUOM1)
                    uom4obj = res.find(obj => obj.code === packdetail.PACKUOM4)
                    packdetail.PackUOM1 = uom1obj
                    packdetail.PACKUOM4 = uom4obj
                    console.log(packdetail, '14')
                    setPackCreationFormValues(packdetail)
                }
                setuom1(res)
                setuom4(res)
            }
        }))
        getcodesc(token, 'QUANTITY').then((res => {
            if (res) {
                
                if (packdetail !== null) {
                    uom2obj = res.find(obj => obj.code === packdetail.PACKUOM2)
                    uom3obj = res.find(obj => obj.code === packdetail.PACKUOM3)
                    packdetail.PACKUOM2 = uom2obj
                    packdetail.PACKUOM3 = uom3obj
                    console.log(packdetail, "23")
                    setPackCreationFormValues(packdetail)
                }
                setuom2(res)
                setuom3(res)
            }
        }))
        getcodesc(token, 'VOLUME').then((res => {
            if (res) {
                
                if (packdetail !== null) {
                    uom5obj = res.find(obj => obj.code === packdetail.PACKUOM5)
                    packdetail.PACKUOM5 = uom5obj
                    console.log(packdetail, "5")
                    setPackCreationFormValues(packdetail)
                }
                setuom5(res)
            }
        }))
        getcodesc(token, 'WEIGHT').then((res => {
            if (res) {
                
                if (packdetail !== null) {
                    uom6obj = res.find(obj => obj.code === packdetail.PACKUOM6)
                    uom7obj = res.find(obj => obj.code === packdetail.PACKUOM7)
                    packdetail.PACKUOM6 = uom6obj
                    packdetail.PACKUOM7 = uom7obj
                    console.log(packdetail, "67")
                    setPackCreationFormValues(packdetail)
                }
                setuom6(res)
                setuom7(res)
            }
        }))
        getcodesc(token, 'DIMS').then((res => {
            if (res) {
                
                if (packdetail !== null) {
                    uom8obj = res.find(obj => obj.code === packdetail.PACKUOM8)
                    uom9obj = res.find(obj => obj.code === packdetail.PACKUOM9)
                    packdetail.PACKUOM8 = uom8obj
                    packdetail.PACKUOM9 = uom9obj
                    console.log(packdetail, "89")
                    setPackCreationFormValues(packdetail)
                }
                setuom8(res)
                setuom9(res)
            }
        }))
    }, [token])

    //change in state
    const handleChange = (event) => {
        console.log(event);

        const name = event.target.name;
        const value = event.target.value;
        console.log(name, value)
        setPackCreationFormValues({ ...packCreationFormValues, [name]: value })

    }

    const uomhandleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setPackCreationFormValues({ ...packCreationFormValues, [name]: value })
    };


    const onSubmitCreate = () => {
        //setLoading(true);
        token = localStorage.getItem("selfToken");
        debugger
        console.log(packCreationFormValues.PackUOM1, "PACKUOM3")
        if (packCreationFormValues.packkey !== '' && packCreationFormValues.PACKUOM3 !== " " && packCreationFormValues.PACKUOM3 !== null) {
            //console.log(JSON.stringify(packCreationFormValues));
            let finalobj = { ...packCreationFormValues }
            finalobj.PackUOM1 = isPlainObject(packCreationFormValues.PackUOM1) ? packCreationFormValues.PackUOM1.code : packCreationFormValues.PackUOM1
            finalobj.PACKUOM2 = isPlainObject(packCreationFormValues.PACKUOM2) ? packCreationFormValues.PACKUOM2.code : packCreationFormValues.PACKUOM2
            finalobj.PACKUOM3 = isPlainObject(packCreationFormValues.PACKUOM3) ? packCreationFormValues.PACKUOM3.code : packCreationFormValues.PACKUOM3
            finalobj.PACKUOM4 = isPlainObject(packCreationFormValues.PACKUOM4) ? packCreationFormValues.PACKUOM4.code : packCreationFormValues.PACKUOM4
            finalobj.PACKUOM5 = isPlainObject(packCreationFormValues.PACKUOM5) ? packCreationFormValues.PACKUOM5.code : packCreationFormValues.PACKUOM5
            finalobj.PACKUOM6 = isPlainObject(packCreationFormValues.PACKUOM6) ? packCreationFormValues.PACKUOM6.code : packCreationFormValues.PACKUOM6
            finalobj.PACKUOM7 = isPlainObject(packCreationFormValues.PACKUOM7) ? packCreationFormValues.PACKUOM7.code : packCreationFormValues.PACKUOM7
            finalobj.PACKUOM8 = isPlainObject(packCreationFormValues.PACKUOM8) ? packCreationFormValues.PACKUOM8.code : packCreationFormValues.PACKUOM8
            finalobj.PACKUOM9 = isPlainObject(packCreationFormValues.PACKUOM9) ? packCreationFormValues.PACKUOM9.code : packCreationFormValues.PACKUOM9
            console.log(JSON.stringify([finalobj]))
            var Action = "1";
            if (packdetail) {
                Action = "2"
            }
            else {
                Action = "1"
            }
            putPack([finalobj], token).then((res) => {
                debugger
                var timeout;
                setLoading(false);
                if (res === "Successfully posted to WMS") {
                    if (Action === "1") {
                        debugger
                        setopen(true);
                        setmessage("Pack Created Successfully")
                        setseverity("success")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                            navigate("/Config/Pack")
                        }, 2000);
                    }
                    else {
                        debugger
                        setopen(true);
                        setmessage("Pack Updated Successfully")
                        setseverity("success");
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                            navigate("/Config/Pack")
                        }, 2000);
                    }
                }

            })
        }
        else {
            setopen(true);
            setmessage("Please enter Mandatory fields")
            setseverity("warning")
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                setopen(false);
            }, 2000);
        }

        //console.log(packCreationFormValues);
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
                    <div className='ps-3'>

                        <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.PackCreation')}</h3>


                        {/* <h3 className='fw-bold text-uppercase'>{localizationService.toLanguageString('custom.ASNCreation')}</h3> */}
                    </div>
                    <div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            <li className='text-uppercase br-round-left active' onClick={onSubmitCreate}> <span>Save</span></li>


                            {/* <li className='text-uppercase br-round-left active' onClick={onSubmitCreate}>Create</li> */}
                            <li className='text-uppercase active' onClick={() => {
                                setPackCreationFormValues(packstate);
                                const nodeList = document.querySelectorAll("select");
                                const nodeList1 = document.querySelectorAll(".k-input");
                                console.log(nodeList.length);
                                for (let i = 0; i < nodeList.length; i++) {
                                    nodeList1[i].textContent = '';
                                    nodeList[i].value = '';
                                }
                            }}>Clear</li>
                        </ul>
                    </div>
                </div>



                <div style={{ padding: '1%' }}>

                    <div className='row'>

                        <div className='col-3'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Pack *</p>
                            <Input value={packCreationFormValues.packkey || ""} name="packkey" required={true} onChange={handleChange} style={{ width: '100%' }} />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM1</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom1}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PackUOM1 || ""}
                                onChange={uomhandleChange}
                                name='PackUOM1'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Case</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="CASECNT"
                                value={packCreationFormValues.CASECNT || 0}
                                onChange={handleChange}
                                spinners={false}
                            />
                        </div>

                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Description</p>
                            <Input value={packCreationFormValues.packdescr || ""} name="packdescr" onChange={handleChange} style={{ width: '100%' }} />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM2</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom2}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PACKUOM2 || ""}
                                onChange={uomhandleChange}
                                name='PACKUOM2'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Inner Pack</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="INNERPACK"
                                value={packCreationFormValues.INNERPACK || 0}
                                onChange={handleChange}
                                spinners={false}
                            />
                        </div>

                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM3  *</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom3}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PACKUOM3 || ""}
                                onChange={uomhandleChange}
                                name='PACKUOM3'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Master Unit - (Each)</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="QTY"
                                value={packCreationFormValues.QTY || 0}
                                onChange={handleChange}
                                spinners={false}
                                disabled={true}
                            />
                        </div>

                    </div>


                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM4</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom4}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PACKUOM4 || ""}
                                onChange={uomhandleChange}
                                name='PACKUOM4'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Pallet</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="PALLET"
                                value={packCreationFormValues.PALLET || 0}
                                onChange={handleChange}
                                spinners={false}
                            />
                        </div>

                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM5</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom5}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PACKUOM5 || ""}
                                onChange={uomhandleChange}
                                name='PACKUOM5'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Cube</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="CUBE"
                                value={packCreationFormValues.CUBE || 0}
                                onChange={handleChange}
                                spinners={false}
                            />
                        </div>

                    </div>


                    <div className='row' style={{ marginTop: '5px' }}>
                        <div className='col-3' >
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM6</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom6}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PACKUOM6 || ""}
                                onChange={uomhandleChange}
                                name='PACKUOM6'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Gross Weight</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="GROSSWGT"
                                value={packCreationFormValues.GROSSWGT || 0}
                                onChange={handleChange}
                                spinners={false}
                            />
                        </div>

                    </div>


                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM7</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom7}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PACKUOM7 || ""}
                                onChange={uomhandleChange}
                                name='PACKUOM7'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Net Weight</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="NETWGT"
                                value={packCreationFormValues.NETWGT || 0}
                                onChange={handleChange}
                                spinners={false}
                            />
                        </div>

                    </div>



                    <div className='row'>

                        <div className='col-3' >
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM8</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom8}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PACKUOM8 || ""}
                                onChange={uomhandleChange}
                                name='PACKUOM8'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Layer</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="OTHERUNIT1"
                                value={packCreationFormValues.OTHERUNIT1 || 0}
                                onChange={handleChange}
                                spinners={false}
                            />
                        </div>

                    </div>

                    <div className='row' style={{ marginTop: '5px' }}>

                        <div className='col-3' >

                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>UOM9</p>
                            <ComboBox
                                style={{
                                    width: '100%',
                                }}
                                data={uom9}
                                textField="description"
                                dataItemKey="code"
                                value={packCreationFormValues.PACKUOM9 || ""}
                                onChange={uomhandleChange}
                                name='PACKUOM9'
                            />
                        </div>

                        <div className='col-4'>
                            <p style={{ marginBottom: '2px', fontSize: 12 }}>Feet</p>
                            <NumericTextBox
                                min={1}
                                max={9999999}
                                name="OTHERUNIT2"
                                value={packCreationFormValues.OTHERUNIT2 || 0}
                                onChange={handleChange}
                                spinners={false}
                            />
                        </div>

                    </div>


                </div>
            </div>
        </>
    );
}



export default PackCreation;