
import * as React from 'react';
import { Upload } from "@progress/kendo-react-upload";
import * as XLSX from 'xlsx/xlsx.mjs';
import Loader from "../../../components/Loader/Loader";
import { putLocation } from "../../../services/ConfigurationService/ConfigurationService"
import { fileTxtIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { process } from "@progress/kendo-data-query";
import { WithSnackbar } from "../../../../src/components/form/Notification";

const Locationexcelupload = () => {


    let token = localStorage.getItem("selfToken");
    const [files, setFiles] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [filePreviews, setFilePreviews] = React.useState({});
    const [affectedFiles, setAffectedFiles] = React.useState([]);
    const [loading, setLoading] = React.useState(false)
    const [open, setopen] = React.useState(false);
    const [message, setmessage] = React.useState("")
    const [severity, setseverity] = React.useState("");
    const [erromsg, seterromsg] = React.useState("")
    const _exporter = React.createRef()
    const fileStatuses = [
        "UploadFailed",
        "Initial",
        "Selected",
        "Uploading",
        "Uploaded",
        "RemoveFailed",
        "Removing",
    ];
    const [ZoneCreateValues, setZoneCreateValues] = React.useState([]);
    let Client = localStorage.getItem("Client");

    const onAdd = (event) => {
        setFiles(event.newState);
        setEvents([...events, `File selected: ${event.affectedFiles[0].name}`]);
        setAffectedFiles(event.affectedFiles);
    };



    const onProgress = (event) => {
        setFiles(event.newState);
        setEvents([...events, `On Progress: ${event.affectedFiles[0].progress} %`]);
    };

    const onStatusChange = (event) => {
        const file = event.affectedFiles[0];
        setFiles(event.newState);
        setEvents([
            ...events,
            `File '${file.name}' status changed to: ${fileStatuses[file.status]}`,
        ]);
        console.log(file.status)
        if (file.status === 4) {
            const file1 = files[0].getRawFile();
            fileChangehandle(file1)
        }

    };

    const excelExport = () => {
        if (_exporter.current) {
            _exporter.current.save();
        }
    };


    function fileChangehandle(e) {

        const file = e;
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        var timeout;
        reader.onload = function (e) {
            // binary data
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {
                type: rABS ? "binary" : "array",
                bookVBA: true
            });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            console.log(data)
            let columnHeaders = [];
            for (let key in ws) {
                let regEx = new RegExp("^\(\\w\)\(1\){1}$");
                if (regEx.test(key) == true) {
                    columnHeaders.push(ws[key].v);
                }
            }
            console.log(columnHeaders)
            debugger
            if (JSON.stringify(["Loc", "PutawayZone"]) === JSON.stringify(columnHeaders.sort())) {
                putLocation(JSON.stringify(data), token, "1").then(res => {
                    var timeout;
                    setLoading(false);
                    if (res === "Successfully posted to WMS") {
                        setopen(true);
                        setmessage("Loc Created Successfully")
                        setseverity("success")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                    }
                    else {
                        setopen(true);
                        setmessage(res)
                        seterromsg(res)
                        setseverity("error")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                    }
                })
            }
            else 
            {
                setopen(true);
                setmessage("Excel must contain Loc, PutawayZone columns")
                seterromsg("Excel must contain Loc, PutawayZone columns")
                setseverity("error")
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setopen(false);
                }, 2000);
            }

        };
        reader.onerror = function (e) {
            // error occurred
            console.log('Error : ' + e.type);
        };
        if (rABS) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }

    return (<>
        {loading && <Loader loading={loading} />}
        <div id="Planning" className="inbound-page main-content">
        <WithSnackbar open={open} message={message} severity={severity} />
            <div className="d-flex mt-5 justify-content-between">
                <div className='ps-3'>
                    <h3 className='fw-bold text-uppercase'>{Client}-{'Location Excel Upload'}</h3>
                </div>
            </div>
        </div>
        <div className='col-3'>
            <div className='col-1' style={{ marginTop: '20px' }}>
                <SvgIcon onClick={excelExport} icon={fileTxtIcon} style={{ cursor: "pointer" }} size="medium" />

            </div>
            <Upload
                batch={false}
                multiple={false}
                defaultFiles={[]}
                files={files}
                onAdd={onAdd}

                onProgress={onProgress}
                onStatusChange={onStatusChange}
                restrictions={{
                    allowedExtensions: [".xlsx"],
                }}
                withCredentials={false}
                saveUrl={"https://demos.telerik.com/kendo-ui/service-v4/upload/save"}
                removeUrl={"https://demos.telerik.com/kendo-ui/service-v4/upload/remove"}
            />

        </div>
        <>{erromsg}</>
        <ExcelExport
            data={[]}
            fileName="Locs.xlsx"
            ref={_exporter}
        >
            <ExcelExportColumn field="Loc" title="Loc" />
            <ExcelExportColumn field="PutawayZone" title="PutawayZone" />
        </ExcelExport>
    </>)

}


export default Locationexcelupload;