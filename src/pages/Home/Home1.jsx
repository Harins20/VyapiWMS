
import * as React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dollarImage from '../../assets/dollar.png';
import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { useLocalization } from '@progress/kendo-react-intl';
import { getInBoundChartData,getOutBoundChartData } from "../../services/HomeService/HomeService";
import { getStatusCount } from "../../services/InboundService/InboundService";

import Loader from "../../components/Loader/Loader";
import { Avatar } from '@progress/kendo-react-layout';

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
    ChartTooltip
  } from "@progress/kendo-react-charts";
import { AppContext } from '../../AppContext';
import { teams } from '../../resources/teams';
import { orders } from '../../resources/orders';

const categories = [''];

let token = localStorage.getItem("selfToken");
    let Client = localStorage.getItem("Client");
    const sleep = (time) => new Promise((r) => setTimeout(r, time))

    const ChartTooltipRender = ({ point }) => {
        return (
            <div>
                <p>{point.category} : {point.value}</p>
            </div>
        );
    };
   
const Home = () => {
    let navigate = useNavigate()
    const [inChartData, setInChartData] = useState([]);
    const [outChartData, setOutChartData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [isTrend, setIsTrend] = React.useState(true);
    const [isMyTeam, setIsMyTeam] = React.useState(true);
    const localizationService = useLocalization();

    const isChartChangeRef = React.useRef(false);
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
                    setInChartData(res);

                    if (res.find(obj => obj.description === 'New')) {
                        setnewStatus(res.find(obj => obj.description === 'New').count)
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
                    setOutChartData(res);    
                } else {
                    setOutChartData([])
                }
            }
            setLoading(false)
        })
    }
    useEffect(async () => {
        inChartDataFn('','');
        outChartDataFn('','');
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
            
            inChartDataFn(event.value.start, event.value.end);
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
            
            outChartDataFn(event.value.start, event.value.end);
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
           <div id="Home" className="main-content">

                <h3 className='fw-bold text-uppercase'>{Client}-{localizationService.toLanguageString('custom.inbound')}</h3>

                <div className="row mb-2">
                    <div className="col-lg-3 col-6">
                    <div className='card-container bgimage'>
                    <h3 className="card-title">  <span className="k-icon k-i-dollar fs-5 "></span>
                    New</h3>
                       
                        <div className="card-component text-center">
                        <div className='fs-2 amount fw-600'>{New}</div>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-3 col-6 ">
                        <div className='card-container bgimage'>
                            <h3 className="card-title blue"> <span className="k-icon k-i-dollar fs-5 "></span> 
                            In Receiving</h3>
                        
                            <div className="card-component text-center">
                            <div className='fs-2 amount fw-600'>{inReceiving}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-6">
                        <div className='card-container bgimage'>
                        <h3 className="card-title orange"> <span className="k-icon k-i-dollar fs-5 "></span> Received</h3>
                        
                            <div className="card-component text-center">
                            <div className='fs-2 amount fw-600'>{received}</div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="col-lg-3 col-6">
                        <div className='card-container bgimage'>
                            <h3 className="card-title red"> <span className="k-icon k-i-dollar fs-5 "></span> Closed</h3>
                            <div className="card-component text-center">
                            <div className='fs-2 amount fw-600'>{closed}</div>
                            </div>
                        </div>
                    </div>
               </div>

                <div className="card-container">
                <div className="row">
                    <h3 className="col-lg-6 col-12">{localizationService.toLanguageString('custom.inbound')}</h3>
                    
                    <div className="col-lg-6 col-12">
                        <div className=" ">
                            <DateRangePicker  
                                startDateInputSettings={startDateInputSettings}
                                endDateInputSettings={endDateInputSettings} 
                                value={inRange}  onChange={onInRangeChange} />
                        </div>
                    </div>
                </div>


                
                <div className="card-component mt-1">
                    
                  
            <div className="row">
            
                <div className="col-lg-6 col-12">
                <Chart seriesColors={inChartDefaultColors}>
                    <ChartTooltip render={ChartTooltipRender} />
                    <ChartTitle text="" />
                    <ChartSeries>
                    <ChartSeriesItem 
                            tooltip={{
                                    visible: true,
                                }} 
                            type="column" field="count" categoryField="description" data={inChartData}
                              />
                    </ChartSeries>
                    <ChartCategoryAxis>
                    <ChartCategoryAxisItem />
                    </ChartCategoryAxis>
                </Chart>
                </div>
                <div className="col-lg-6 col-12">
                    <Chart  >
                        <ChartTitle text="" />
                        <ChartLegend position="top" orientation="horizontal" />
                        <ChartSeries>
                        <ChartSeriesItem
                            type="pie"
                            overlay={{
                            gradient: "sharpBevel",
                            }}
                            tooltip={{
                            visible: true,
                            }}
                            data={inChartData}
                            categoryField="description"
                            field="count"
                        />
                        </ChartSeries>
                    </Chart>
                </div>
                </div>
                </div>
            </div>
            <div className="row" >
                <h3 className='fw-bold mt-2 text-uppercase'>{Client}-{localizationService.toLanguageString('custom.outbound')}</h3>
            </div>
            <div className='intro-box '>
            <div className="box"> 
                <div className='card-container bgimage'>
                    <h3 className="card-title green"> <span className="k-icon k-i-dollar fs-5 "></span> Created Externally</h3>
                    <div className="card-component text-center">
                        <div className='fs-2 amount fw-600'>{outChartData.filter(obj => obj.description == 'Created Externally').map(filteredCount => (
                            <span>
                            {filteredCount.count}
                            </span>
                        ))}</div>
                    </div>
                </div>
            </div>
        
            <div className="box"> 
                <div className='card-container bgimage'>
                    <h3 className="card-title"> <span className="k-icon k-i-dollar fs-5 "></span> Created Internally</h3>
                    <div className="card-component text-center">
                        <div className='fs-2 amount fw-600'>{outChartData.filter(obj => obj.description == 'Created Internally').map(filteredCount => (
                            <span>
                            {filteredCount.count}
                            </span>
                        ))}</div>
                    </div>
                </div>
            </div>   
            <div className="box"> 
                <div className='card-container bgimage'>
                    <h3 className="card-title"> <span className="k-icon k-i-dollar fs-5 "></span> Allocated</h3>
                    <div className="card-component text-center">
                        <div className='fs-2 amount fw-600'>{outChartData.filter(obj => obj.description == 'Allocated').map(filteredCount => (
                            <span>
                            {filteredCount.count}
                            </span>
                        ))}</div>
                    </div>
                </div>
            </div>   
            <div className="box"> 
                <div className='card-container bgimage'>
                    <h3 className="card-title "> <span className="k-icon k-i-dollar fs-5 "></span> Picked Complete</h3>
                    <div className="card-component text-center">
                        <div className='fs-2 amount fw-600'>{outChartData.filter(obj => obj.description == 'Picked Complete').map(filteredCount => (
                            <span>
                            {filteredCount.count}
                            </span>
                        ))}</div>
                    </div>
                </div>
            </div>   
            <div className="box"> 
                <div className='card-container bgimage'>
                    <h3 className="card-title"> <span className="k-icon k-i-dollar fs-5 "></span> Shipped Complete</h3>
                    <div className="card-component text-center">
                        <div className='fs-2 amount fw-600'>{outChartData.filter(obj => obj.description == 'Shipped Complete').map(filteredCount => (
                            <span>
                            {filteredCount.count}
                            </span>
                        ))}</div>
                    </div>
                </div>
            </div>   
        </div>  
        

               <div className="card-container ">
               <div className="row">
                    
                    <h3 className="col-lg-6 col-12">
                        {localizationService.toLanguageString('custom.outbound')}
                    </h3>
                    <div className="col-lg-6 col-12">
                        <DateRangePicker 
                        startDateInputSettings={startDateInputSettings}
                        endDateInputSettings={endDateInputSettings} 
                         value={outRange}  onChange={onOutRangeChange} />
                    </div>

                </div>
            
                <div className="card-component">
                    
                <Chart seriesColors={outChartDefaultColors} >
                    <ChartTooltip render={ChartTooltipRender} />

                    <ChartTitle text="" />
                    <ChartSeries>
                    <ChartSeriesItem 
                            tooltip={{
                                    visible: true,
                                }} 
                            type="column" field="count" categoryField="description" data={outChartData} />
                    </ChartSeries>
                    <ChartCategoryAxis>
                    <ChartCategoryAxisItem />
                    </ChartCategoryAxis>
                </Chart>
                    
                </div>
            </div>
        </div>
        </>
    );
}

export default Home;





