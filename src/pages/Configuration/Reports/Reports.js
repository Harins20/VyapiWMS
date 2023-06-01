import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@progress/kendo-react-buttons";


const Reports = () => {


    const [hidebutton, sethidebutton] = useState(0)
    let Client = localStorage.getItem("Client");
    const reloadftwzfunc = () => { 
        let iframe = document.getElementById('myframe')
        iframe.src = "http://accexreports.vyapiscm.com/Home/bsiftzw";
    }
    const reloadbsifunc = () => { 
        let iframe = document.getElementById('myframe')
        iframe.src = "http://accexreports.vyapiscm.com/Home/BSIdom";
    }
    const iframeDidLoad = () => {
        sethidebutton(hidebutton + 1)
    }

    return (
        <>
        {Client === 'BSI FTWZ' && (<div>
            {hidebutton % 2 === 0 && (<Button onClick={reloadftwzfunc} className='k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary m-1' >Back</Button>)}
             <iframe id='myframe' src="http://accexreports.vyapiscm.com/Home/bsiftzw" title="Reports" style = {{width:'calc(100vw - 240px)', height: 'calc(100vh - 80px)'}} onLoad={iframeDidLoad}></iframe> 
        </div>)}
        {Client === 'BSI DOM' && (<div>
            {hidebutton % 2 === 0  && (<Button onClick={reloadbsifunc} className='k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary m-1' >Back</Button>)}
             <iframe id='myframe' src="http://accexreports.vyapiscm.com/Home/BSIdom" title="Reports" style = {{width:'calc(100vw - 240px)', height: 'calc(100vh - 80px)'}} onLoad={iframeDidLoad}></iframe> 
        </div>)}
        </>
    );
}



export default Reports;