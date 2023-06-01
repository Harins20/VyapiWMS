import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalization } from '@progress/kendo-react-intl';
import Loader from "../../../components/Loader/Loader";
import { WithSnackbar } from "../../../components/form/Notification";
import { getLocation } from "../../../services/ConfigurationService/ConfigurationService";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";


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

const LocationMaster = () => {

    //declare service
    const localizationService = useLocalization();
    let navigate = useNavigate()


    //usestate
    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [opendialog, setopendialog] = useState(true);
    const [severity, setseverity] = useState("");
    const [locationTable, setLocationTable] = useState([])
    const [dataState, setDataState] = React.useState(initialDataState);


    //token
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");

    useEffect(() => {
        setLoading(true)
        loadingGridValues();
    }, [token])

    //grid values
    const loadingGridValues = () => {

        getLocation(token).then((res) => {
            console.log(res);
            if (res) {
                setLocationTable(res);
            }
            else {
                setLocationTable([]);
            }
            setLoading(false)
        })
    }

    const CommandCell = () => {
        return (
            <td className="k-command-cell">
                <p>Edit</p>
            </td>
        );
    }
    return (
        <>
            {/* close={handleclose} */}
            {loading && <Loader loading={loading} />}
            <div id="Planning" className="inboundHeaderCreation-page main-content">
                <div className='row' style={{ justifyContent: "center" }}>
                    <WithSnackbar open={open} message={message} severity={severity} />
                </div>

                <div className="d-flex mt-5 justify-content-between">
                    <div className='ps-3'> <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.LocMaster')}</h3>
                    </div>
                    {/*<div className='position-relative pe-3'>
                        <ul className='header-buttons'>
                            <li className='text-uppercase br-round-left active'><span>New</span></li>
                        </ul>
                        </div>*/}
                </div>

                <div className='table-section mt-3 ps-3 pe-3'>
                    <Grid
                        style={{
                            height: "70vh",
                        }}
                        pageable={true}
                        sortable={true}
                        filterable={true}
                        data={process(locationTable, dataState)}
                        {...dataState}
                        onDataStateChange={(e) => {
                            setDataState(e.dataState);
                        }}
                    >
                        <Column field="Loc" title="Location" filterable={true} />
                        <Column field="LocationType" title="Location Type" filterable={true} />
                        <Column field="LocationFlag" title="Location Flag" filterable={true} />
                        <Column field="LocationCategory" title="Location Category" filterable={true} />
                        <Column field="PutawayZone" title="Putaway Zone" filterable={false} />
                        <Column field="AllocationZone" title="Allocation Zone" filterable={false} />
                        {/*<Column field="" title="ACTION" className="edit-btn" filterable={false} cell={CommandCell} />*/}
                    </Grid>
                </div>




            </div>
        </>
    );
}

export default LocationMaster;