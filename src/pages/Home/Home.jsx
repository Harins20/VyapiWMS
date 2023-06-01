
import * as React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { useLocalization } from '@progress/kendo-react-intl';
import { getInBoundChartData, getOutBoundChartData, getLocReportChartData } from "../../services/HomeService/HomeService";
import { getStatusCount } from "../../services/InboundService/InboundService";

import Loader from "../../components/Loader/Loader";
import { Avatar } from '@progress/kendo-react-layout';

import inReceiveIcon from '../../assets/icons/in-receiving.png';
import receiveIcon from '../../assets/icons/receiving.png';

import inBoundNewIcon from '../../assets/icons/new.png';
import closedIcon from '../../assets/icons/closed.png';
import allocatedIcon from '../../assets/icons/allocated.png';
import pickedIcon from '../../assets/icons/picked.png';
import shippedIcon from '../../assets/icons/shipped.png'
import outBoundNewIcon from '../../assets/icons/outbound-new.png';

import availableLocIcon from '../../assets/icons/available-location.png';
import freeLocIcon from '../../assets/icons/free-location.png'
import usedLocIcon from '../../assets/icons/used-location.png';

import {
    Card,
    CardTitle,
    CardBody,
    CardHeader,
  } from "@progress/kendo-react-layout";

 import {
    Chart,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartTitle,
    ChartLegend,
    ChartLegendTitle,
    ChartTooltip
  } from "@progress/kendo-react-charts";
import { AppContext } from '../../AppContext';
import { teams } from '../../resources/teams';
import { orders } from '../../resources/orders';
import { count } from '@progress/kendo-data-query/dist/npm/array.operators';
import { style } from '@mui/system';

const categories = [''];

let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    const sleep = (time) => new Promise((r) => setTimeout(r, time))

    const ChartTooltipRender = ({ point }) => {
       const tooltip =  (point && point.category != 'undefined') ? <p>{point.category} : {point.value}</p> : <p></p>
        return (
            tooltip
        );
    };
   
const Home = () => {
    let navigate = useNavigate()
    const [inChartData, setInChartData] = useState([]);
    const [outChartData, setOutChartData] = useState([]);
    const [locReportChartData, setLocReportChartData] = useState([]);
    const [locReportPieChartData, setLocReportPieChartData] = useState([]);

    const [locReportCartData, setLocReportCartData] = useState([]);
    
    const [loading, setLoading] = useState(true);

    const [isTrend, setIsTrend] = useState(true);
    const [isOutType, setIsOutType] = useState(true);
    const [isLocChatType, setLocChatType] = useState(true);

    const localizationService = useLocalization();

    const isChartChangeRef = React.useRef(false);
    const isChartChangeRef1 = React.useRef(false);

    const onChartRefresh = React.useCallback(
        () => null,
        []
    );
    
      const inChartDefaultColors = [
        '#271547',
        '#52436b',
        '#3c2c59',
      ];
      
      const inPieChartDefaultColors = [
        '#271547',
        '#3c2c59',
        '#52436b',
       ' #675b7e',
        '#7d7290',
      ];

      const outChartDefaultColors = [
        '#271547',
        '#beb8c7',
        '#a8a1b5',
        '#938aa3',
        '#7d7290',
        '#675b7e',
        '#52436b',
        '#3c2c59',
        '#271547',
      ];
      const startDateInputSettings = {
        label: "Start Date",
        format: "yyyy-M-dd",
      };
      const endDateInputSettings = {
        steps: {
          day: 2,
        },
        label: "End Date",
        format: "yyyy-M-dd",
      };
    let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");

    const [New, setnewStatus] = useState();
    const [received, setreceived] = useState();
    const [closed, setClosed] = useState();
    const [inReceiving, setInReceived] = useState();

    const [outboundNew, setOutboundNew] = useState();
    const [outboundAllocated, setOutboundAllocated] = useState();
    const [outboundPicked, setOutboundPicked] = useState();
    const [outboundShipped, setOutboundShipped] = useState();

    const inChartDataFn = (from, to) => {
        setLoading(true)
        let start =  '';
        let end = '';
        if(from !='' && to != '') {
             start = (from)? dateconv(from) : '';
             end = (to) ? dateconv(to) : '';
        } 

        getInBoundChartData(token, start, end).then((res) => {
            if (res) {
                if (res.length > 0) {
                    
                    if (res.find(obj => obj.description === 'New')) {
                        setnewStatus(res.find(obj => obj.description === 'New').count);

                    }
                    else {
                        setnewStatus(0)
                    }
                    if (res.find(obj => obj.description === 'Closed')) {
                        setClosed(res.find(obj => obj.description === 'Closed').count)
                    }
                    else {
                        setClosed(0)
                    }
                    if (res.find(obj => obj.description === 'Received')) {
                        setreceived(res.find(obj => obj.description === 'Received').count)
                    }
                    else {
                        setreceived(0)
                    }
                    if (res.find(obj => obj.description === 'In Receiving')) {
                        setInReceived(res.find(obj => obj.description === 'In Receiving').count)
                    }
                    else {
                        setInReceived(0)
                    }

                    
                    var data = [
                    { 
                        color :"#905583",
                        description: "New",
                        count : (res.find(obj => obj.description === 'New')) ? res.find(obj => obj.description === 'New').count : 0
                    },
                    {   color :"#7D487A",
                        description: "Received",
                        count : (res.find(obj => obj.description === 'Received')) ? res.find(obj => obj.description === 'Received').count : 0
                    },
                    {
                        color :"#6A518A",
                        description: "In Receiving",
                        count : (res.find(obj => obj.description === 'In Receiving')) ? res.find(obj => obj.description === 'In Receiving').count : 0
                    },
                    {
                        color :"#573B79",
                        description: "Closed",
                        count : (res.find(obj => obj.description === 'Closed')) ? res.find(obj => obj.description === 'Closed').count : 0
                    } ] ;
                    setInChartData(data);
                    
                } else {
                    setInChartData([])
                }
            }
            setLoading(false)
        })
    }

    const outChartDataFn = (from, to) => {
        setLoading(true)
        let start =  '';
        let end = '';
        if(from !='' && to != '') {
             start = (from)? dateconv(from) : '';
             end = (to) ? dateconv(to) : '';
        } 

        getOutBoundChartData(token, start, end).then((res) => {
            if (res) {
                if (res.length > 0) {
                    var newTotal = 0;
                    var externally = 0;
                    var internally  = 0;

                    if (res.find(obj => obj.description === 'Created Externally')) {
                        var externally = res.find(obj => obj.description === 'Created Externally').count;
                    }

                    if (res.find(obj => obj.description === 'Created Internally')) {
                        var internally = res.find(obj => obj.description === 'Created Internally').count;
                    }

                    var newTotal = externally + internally;
                    setOutboundNew(newTotal);

                    if (res.find(obj => obj.description === 'Allocated')) {
                        setOutboundAllocated(res.find(obj => obj.description === 'Allocated').count)
                    }

                    if (res.find(obj => obj.description === 'Picked Complete')) {
                        setOutboundPicked(res.find(obj => obj.description === 'Picked Complete').count)
                    } else {
                        setOutboundPicked(0)
                    }
                    if (res.find(obj => obj.description === 'Shipped Complete')) {
                        setOutboundShipped(res.find(obj => obj.description === 'Shipped Complete').count);
                    } else {
                        setOutboundShipped(0);
                    }
                    var data = [
                        {
                             color :"#905583",
                             description: "New",
                             count : newTotal
                        },
                        {
                            color :"#7D487A",
                            description: "Allocated",
                            count : (res.find(obj => obj.description === 'Allocated')) ? res.find(obj => obj.description === 'Allocated').count : 0
                        },
                        {
                            color :"#6A518A",
                            description: "Picked Complete",
                            count : (res.find(obj => obj.description === 'Picked Complete')) ? res.find(obj => obj.description === 'Picked Complete').count : 0
                        },
                        {
                            color :"#573B79",
                            description: "Shipped Complete",
                            count : (res.find(obj => obj.description === 'Shipped Complete')) ? res.find(obj => obj.description === 'Shipped Complete').count : 0
                        } ] ;

                    setOutChartData(data);

                } else {
                    setOutChartData([])
                }
            }
            setLoading(false)
        })
    }
    const locReportChartDataFn = (f) => {
        setLoading(true)
        getLocReportChartData(token).then((res) => {
            if (res) {
                if (res.length > 0) {
                    let response = res[0];
                    setLocReportCartData(response);
                    var data1 = [
                        {
                         color :"#7D487A",
                         description: "Available Locations",
                         count : response.Availablelocations
                        },
                        {
                         color :"#6A518A",
                         description: "Free Locations",
                         count : response.Unusedlocations
                        },
                        {
                         color :"#573B79",
                         description: "Used Locations",
                         count : response.Usedlocations
                        }] ;

                        var pieData = [
                            {
                             description: "Free Locations",
                             count : response.Unusedlocations
                            },
                            {
                             description: "Used Locations",
                             count : response.Usedlocations
                            }] ;
                    setLocReportPieChartData(pieData);

                    setLocReportChartData(data1);


                } else {
                    setLocReportChartData([]);
                    setLocReportCartData([]);
                }
            }
            setLoading(false)
        })
    }
    useEffect(async () => {
        inChartDataFn('','');
        outChartDataFn('','');
        locReportChartDataFn();

        isChartChangeRef.current = false;
        isChartChangeRef1.current = false;

    }, [token])

    var makeDate = new Date();
    makeDate.setMonth(makeDate.getMonth() - 1);
    const defaultValue = {
        start: makeDate.toString(),
        end: new Date(),
      };

    const { teamId } = React.useContext(AppContext);
    var makeDate = new Date();
    makeDate.setMonth(makeDate.getMonth() - 1);
    
    const [inRange, setInRange] = React.useState({
        start: new Date(),
        end: new Date()
    });
    const [outRange, setOutRange] = React.useState({
        start: new Date(),
        end: new Date()
    });
    const onInRangeChange = React.useCallback(
        (event) => {
            console.log(event.value);
            setInRange({
                start: event.value.start,
                end: event.value.end
            })

            console.log(event.value.end);
            if (event.value.start != null && event.value.end != null ) {

                inChartDataFn(event.value.start, event.value.end);
            }
           
        },
        [setInRange]
    );
    const onOutRangeChange = React.useCallback(
        (event) => {
            console.log(event.value);
            setOutRange({
                start: event.value.start,
                end: event.value.end
            })
            if (event.value.start != null && event.value.end != null) {
                outChartDataFn(event.value.start, event.value.end);
            }
        },
        [setOutRange]
    );
    const trendOnClick = React.useCallback(
        () => {
            isChartChangeRef.current = true;
            setIsTrend(true);
        },
        [setIsTrend]
    );
    const volumeOnClick = React.useCallback(
        () => {
            isChartChangeRef.current = true;
            setIsTrend(false);
        },
        [setIsTrend]
    );
    const outBarOnClick = React.useCallback(
        () => {
            isChartChangeRef.current = true;
            setIsOutType(true);
        },
        [setIsOutType]
    );
    const outPieOnClick = React.useCallback(
        () => {
            isChartChangeRef.current = true;
            setIsOutType(false);
        },
        [setIsOutType]
    );

    
    const locBarOnClick = React.useCallback(
        () => {
            isChartChangeRef.current = true;
            setLocChatType(true);
        },
        [setLocChatType]
    );
    const locPieOnClick = React.useCallback(
        () => {
            isChartChangeRef.current = true;
            setLocChatType(false);
        },
        [setLocChatType]
    );



    const dateconv = (datobj) => {
        let timepart = datobj.toISOString().split('T')[1].split('.')[0]
        let daypart = ('0' + datobj.getDate().toString()).slice(-2);
        let monthpart = ('0' + (datobj.getMonth()+1).toString()).slice(-2);
        let yearpart = datobj.getFullYear().toString();
        let fulldatepart = yearpart + '-' + monthpart  + '-' + daypart;
        return fulldatepart 
    }

    return (
        <>
            {loading && <Loader loading={loading} />}
           <div id="Home" className="inbound-page main-content ">

                {/* <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.inbound')}</h3> */}


                <div className="row dashboard">
            
                <div className="col-lg-12 col-12">
                <div className="row mb-2">
                    <div className="col-lg-3 col-12">
                         <div class="card info-card new">   
                           <div class="card-body">
                              <div class="d-flex justify-content-between">
                                 <div>
                                 <h3 class="card-title">New </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h4>{New}</h4>
                                 </div>
                                 <div class="card-icon  rounded-circle d-flex align-items-center justify-content-center"> 
                                    <img  src={inBoundNewIcon}></img>
                                 </div>
                              </div>
                              <span class="card-cotitle">Today New</span>
                           </div>
                        </div>

                    </div>
                    <div className="col-lg-3 col-12 ">
                        
                        <div class="card info-card in-receiving">
                           <div class="card-body">             
                           <div class="d-flex justify-content-between">
                             <div >
                                 <h3 class="card-title">In Receiving  </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h6>{inReceiving}</h6>
                                 </div>
                                 <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                 <img src={inReceiveIcon}></img>
                                 </div>
                              </div>
                              <span class="card-cotitle">Today Receiving</span>
                           </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-12">  
                       <div class="card info-card receiving">      
                           <div class="card-body">  
                           <div class="d-flex justify-content-between">
                             <div >
                                 <h3 class="card-title">Received </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h6>{received}</h6>
                                 </div>
                                 <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                 <img src={receiveIcon}></img>
                                 </div>
                              </div>
                              <span class="card-cotitle">Today received</span>
                           </div>
                        </div>
                    </div>
                    
                    
                    <div className="col-lg-3 col-12">
                       
                        <div class="card info-card closed">
                           <div class="card-body">
                           <div class="d-flex justify-content-between">
                              <div >
                                 <h3 class="card-title">Closed </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h6>{closed}</h6>
                                 </div>
                                 <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                 <img src={closedIcon}></img>
                                 </div>
                              </div>
                              <span class="card-cotitle">Today closed</span>
                           </div>
                        </div>
                    </div>
               </div>
                
                </div> 
                </div>
               
                <div className="card-container">
                <div className="card-component">
                <h3 className="col-lg-10 col-12 fw-bold text-uppercase">{Client}-{localizationService.toLanguageString('custom.inbound')}</h3>
                <div className="row">    
                <div className="col-lg-4 col-12">
                <div className="card-buttons chart d-flex align-items-center justify-content-start">
                    
                    <ButtonGroup >
                        <Button togglable={true} selected={isTrend} onClick={trendOnClick}>
                        <span className="k-icon k-i-chart-column-clustered fs-5 "></span>
                        </Button>
                        <Button togglable={true} selected={!isTrend} onClick={volumeOnClick}>
                         <span className="k-icon k-i-chart-pie fs-5 "></span>
                        </Button>
                    </ButtonGroup>
                    </div>   
                    </div>
                   
                       
                <div className="col-lg-8 col-12 ">
                        <div className=" d-flex align-items-center justify-content-end">
                            <DateRangePicker  className='datepicker '
                                allowReverse={true}
                                startDateInputSettings={startDateInputSettings}
                                endDateInputSettings={endDateInputSettings} 
                                value={inRange}  onChange={onInRangeChange} />
                        </div>
                        </div>
                      
                      </div>
                      <div className="row">
                <div className="col-lg-12 col-12 ">
                    
                    <Chart >
                        <ChartTitle text="" />
                        <ChartTooltip render={ChartTooltipRender} />
                        <ChartSeries>
                        <ChartSeriesItem 
                                tooltip={{
                                        visible: true,
                                    }} 
                                    type={isTrend ? 'column' : 'pie'}  field="count" categoryField="description" data={inChartData}

                                />
                        </ChartSeries>

                        <ChartCategoryAxis>
                        <ChartCategoryAxisItem />
                        </ChartCategoryAxis>
                        
                    </Chart>
                
                </div>
                </div>
                </div>
            
            </div>

                    <div className="row dashboard">
                
                        <div className="col-lg-12 col-12">
                        <div class="row ">
                            <div class="col-lg-3 col-12">
                                <div class="card info-card new">
                                    <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                       <div>
                                        <h3 class="card-title">New </h3>
                                       </div>
                                       <div class="d-flex align-items-center justify-content-center">
                                       <h6>{outboundNew}</h6>
                                        </div>
                                            <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                                <img src={outBoundNewIcon}></img>
                                            </div>
                                        </div>
                                        <span class="card-cotitle">Today New</span>
                                    </div>
                                </div>

                            </div>
                        
                             
                            <div className="col-lg-3 col-12">   
                                 <div class="card info-card receiving">
                                    <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                       <div>
                                        <h3 class="card-title">Allocated </h3>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-center">
                                           <h6>{outboundAllocated}</h6>
                                        </div>
                                            <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                            <img src={allocatedIcon} ></img>
                                            </div>
                                        </div>
                                        <span class="card-cotitle">Today Allocated</span>
                                    </div>
                                </div>
                            </div>   
                            <div className="col-lg-3 col-12"> 
                                <div class="card info-card in-receiving">
                                <div class="card-body">
                                <div class="d-flex justify-content-between">
                                <div>
                                 <h3 class="card-title">Picked Complete </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h6>{outboundPicked}</h6>
                                 </div>
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                        <img src={pickedIcon} ></img>
                                        </div>
                                    </div>
                                    <span class="card-cotitle">Today Picked</span>
                                </div>
                            </div>
                            </div>   
                            <div className="col-lg-3 col-12"> 
                                <div class="card info-card closed">
                                    <div class="card-body">      
                                    <div class="d-flex justify-content-between">
                                    <div>
                                 <h3 class="card-title">Shipped Complete  </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h6>{outboundShipped}</h6>
                                 </div>
                                            <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                            <img src={shippedIcon} ></img>
                                            </div>
                                        </div>
                                        <span class="card-cotitle">Today Shipped</span>
                                    </div>
                                </div>                     
                            </div>   
                        </div>  
                        
                        </div>
                        </div>
                      

                        <div className="card-container">
                          <div className="card-component">
                          <h3 className="col-lg-10 col-12 fw-bold text-uppercase">{Client}-{localizationService.toLanguageString('custom.outbound')}</h3>
                          <div className="row">  
                          
                    <div className="col-lg-4 col-12">
                   <div className="card-buttons chart d-flex align-items-center justify-content-start">
                    <ButtonGroup>
                        <Button togglable={true} selected={isOutType} onClick={outBarOnClick}>
                        <span className="k-icon k-i-chart-column-clustered fs-5"></span>
                        </Button>
                        <Button togglable={true} selected={!isOutType} onClick={outPieOnClick}>
                        <span className="k-icon k-i-chart-pie fs-5"></span>
                        </Button>
                    </ButtonGroup>
                    </div>
                </div>
                    <div className="col-lg-8 col-8">
                         <div className=" d-flex align-items-center justify-content-end">
                        <DateRangePicker 
                        allowReverse={true}
                        startDateInputSettings={startDateInputSettings}
                        endDateInputSettings={endDateInputSettings} 
                         value={outRange}  onChange={onOutRangeChange} />
                        </div>
                    </div>
                    </div>
                     <div className="row">

                           <div className="col-lg-12 col-12">

                            <Chart 
                                
                                seriesColors={isOutType ? inChartDefaultColors : null}  >
                                <ChartTitle text="" />
                                <ChartCategoryAxis>
                                <ChartCategoryAxisItem 
                                    categories ={outChartData.description} 
                                    title={{
                                       text: "Type",
                                     }}/>
                                </ChartCategoryAxis>
                                <ChartTooltip render={ChartTooltipRender} />
                                <ChartLegend/>
                                <ChartSeries>
                                <ChartSeriesItem 
                                        tooltip={{
                                                visible: true,
                                            }} 
                                            type='area' field="count" categoryField="description" data={outChartData}

                                        />
                                </ChartSeries>

                               
                            </Chart>
                        
                        </div>
                        </div>
                        </div>
                    </div>
               
          

                        <div className="row dashboard">
                    
                            <div className="col-lg-12 col-12">
                            <div class="row ">
                                <div class="col-lg-3 col-12">
                                    <div class="card info-card new">
                                        <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                        <div>
                                 <h3 class="card-title">Available Locations </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h6>{locReportCartData.Availablelocations}</h6>
                                 </div>
                                                <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                                    <img src={availableLocIcon}></img>
                                                </div>
                                            </div>
                                            <span class="card-cotitle">Today Available Locations </span>
                                        </div>
                                    </div>

                                </div>
                            
                                
                                <div className="col-lg-3 col-12"> 
                                    
                                    <div class="card info-card receiving">
                            
                                        <div class="card-body">
                                        
                                        <div class="d-flex justify-content-between">
                                        <div>
                                 <h3 class="card-title">Free Locations  </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h6>{locReportCartData.Unusedlocations}</h6>
                                 </div>
                                                <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                                <img src={freeLocIcon} ></img>
                                                </div>
                                            </div>
                                             <span class="card-cotitle">Today Free Locations</span>
                                        </div>
                                    </div>
                                </div>   
                                <div className="col-lg-3 col-12"> 
                                    
                                    <div class="card info-card in-receiving">
                            
                                    <div class="card-body">
                                        
                                    <div class="d-flex justify-content-between">
                                    <div>
                                 <h3 class="card-title">Used Locations </h3>
                                 </div>
                                 <div class="d-flex align-items-center justify-content-center">
                                    <h6>{locReportCartData.Usedlocations}</h6>
                                 </div>
                                            <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                            <img src={usedLocIcon} ></img>
                                            </div>
                                        </div>
                                          <span class="card-cotitle">Today Used Locations</span>
                                    </div>
                                </div>
                                </div>   
                                 
                            </div>  
                            
                            </div>
                            </div>
                           
                            </div>
                            <div className="card-container">
                           <div className="card-component">
                           <h3 className="col-lg-12 col-12 fw-bold text-uppercase">{Client}-Locations</h3>
                           <div className="row">
                        <div className="col-card-buttonslg-12 col-12">
                         <div className="card-buttons chart d-flex align-items-center justify-content-start">
                        
                        <ButtonGroup>
                            <Button togglable={true} selected={isLocChatType} onClick={locBarOnClick}>
                            <span className="k-icon k-i-chart-column-clustered fs-5"></span>
                            </Button>
                            <Button togglable={true} selected={!isLocChatType} onClick={locPieOnClick}>
                            <span className="k-icon k-i-chart-pie fs-5"></span>
                            </Button>
                        </ButtonGroup>
                    </div>
                    </div>
                            <div className="col-lg-12 col-12">
                                <Chart 
                                    
                                    seriesColors={isLocChatType ? inChartDefaultColors : null}   >
                                    <ChartTitle text="" />
                                    <ChartTooltip render={ChartTooltipRender} />
                                    <ChartLegend/>
                                    <ChartSeries>
                                    <ChartSeriesItem 
                                            tooltip={{
                                                    visible: true,
                                                }} 
                                                type={isLocChatType ? 'column' : 'pie'}  field="count" categoryField="description"
                                                data={isLocChatType ? locReportChartData : locReportPieChartData } 

                                            />
                                    </ChartSeries>

                                    <ChartCategoryAxis>
                                    <ChartCategoryAxisItem />
                                    </ChartCategoryAxis>
                                </Chart>
                            
                            </div>
                        </div>
                    </div>
               
        </div>
        </>
    );
}

export default Home;





