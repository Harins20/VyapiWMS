import * as React from 'react';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Upload } from "@progress/kendo-react-upload";
import { WithSnackbar } from "../../../src/components/form/Notification"
import { putawayservice } from "../../services/PutawayService/PutawayService"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { upload } from "@progress/kendo-react-upload";


const fileStatuses = [
    "UploadFailed",
    "Initial",
    "Selected",
    "Uploading",
    "Uploaded",
    "RemoveFailed",
    "Removing",
];

const Excelupload = (props) => {
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    let navigate = useNavigate()
    let inbounddetails = props.data;

    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState("success");
    const [files, setFiles] = useState([]);
    const [events, setEvents] = React.useState([]);
    const [filePreviews, setFilePreviews] = React.useState({});
    const [affectedFiles, setAffectedFiles] = React.useState([]);


    function eventcapture(e) {

        // readXlsxFile(e.newState[0]).then(row =>{
        //     console.log(row);
        // })


        const file = e;
        const reader1 = new FileReader();
        const rABS = !!reader1.readAsBinaryString;
        var timeout;
        reader1.onload = function (e) {
            // binary data
            debugger
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
            const lkup = data.reduce((acc, cur) => ({ ...acc, [cur.HU]: cur.ToLoc }), {})
                const finalobj = inbounddetails.map(obj => {
                    return { ToLoc: lkup[obj.Lottable09], FromLot: obj.ToLot, FromLoc: obj.ToLoc, Qty: obj.QtyReceived, FromId : obj.ToId, ToId: obj.ToId }
                }).filter(obj => obj.ToLoc !== undefined)
                console.log(finalobj)
                putawayservice(finalobj, token, 1).then((res) => {
               if (res === "Successfully posted to WMS") {
                   setopen(true)
                   setmessage("Move success")
                   setseverity("success")
                   clearTimeout(timeout);
                   timeout = setTimeout(function () {
                       setopen(false);
                   }, 2000);
                   //navigate('/Inventory')
               }
               else if (res.includes("Please check the incorrect Locations :")) {
                   setopen(true)
                   setmessage("Please check for incorrect Locations")
                   setseverity("error")
                   clearTimeout(timeout);
                   timeout = setTimeout(function () {
                       setopen(false);
                   }, 3000);
               }
               else if (res.includes("Hold Locations:")) {
                   console.log(res)
                   if (window.confirm("Please confirm if you wish to move inventory to hold locations")) {
                       putawayservice(finalobj, token, 2).then((res) => {
                           if (res === "Successfully posted to WMS") {
                               setopen(true)
                               setmessage("Move success")
                               setseverity("success")
                               clearTimeout(timeout);
                               timeout = setTimeout(function () {
                                   setopen(false);
                               }, 2000);
                               //navigate('/Inventory')
                           }
                           else {
                               setopen(true)
                               setmessage(res)
                               setseverity("error")
                               clearTimeout(timeout);
                               timeout = setTimeout(function () {
                                   setopen(false);
                               }, 4000);
                               //navigate('/Inventory')
                           }
                       })
                   }
               }
               else {
                   console.log(res)
                   setopen(true)
                   setmessage(res)
                   setseverity("error")
                   clearTimeout(timeout);
                   timeout = setTimeout(function () {
                       setopen(false);
                   }, 4000);
                   //navigate('/Inventory')
               }
               //setLoading(false)
           })
            
        };
        reader1.onerror = function (e) {
            // error occurred
            console.log('Error : ' + e.type);
        };
        if (rABS) {
            console.log(file);
            reader1.readAsBinaryString(file);
        } else {
            reader1.readAsArrayBuffer(file);
        }
        // setFiles(event.newState);
    }

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
        const file1 = files[0].getRawFile();
        if(event.affectedFiles[0].status === 4){
            eventcapture(file1);
        }
    };



    return (
        <>
            <WithSnackbar open={open} message={message} severity={severity} />
            {/* <div style={ {paddingLeft : "10px",  display: "flex", flexDirection : "row"} } className = "flex-container"> */}
            <div className='row'>
                {/* <div className='col-6' style={{marginRight:"0px",paddingRight:"0px"}}>
                <p> Putaway upload:</p>

                </div>
                <div className='col-6' style={{paddingLeft:"0px"}}>
                <input type="file" className="fileSelect" style={{width:'100%'}}
                        onChange={(e) => fileChange(e)} />
                </div> */}
                <p style={{ marginBottom: '0px', fontSize: '12px' }}>Putaway upload</p>
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


            {/* <div></div> */}
            {/* </div> */}

        </>
    )
}


export default Excelupload;