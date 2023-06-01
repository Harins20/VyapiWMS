
import axios from "axios"
import Constants, {appApi} from "../../misc/Constants";

export async function getInBoundChartData(token, start, end){
    try {
        let res = await axios(`${appApi}${Constants.getInBoundChart}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse" : localStorage.getItem("infor_warehouse"),
                "fromdate" : start,
                "todate" : end
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}

export async function getOutBoundChartData(token, start, end){
    try {
        let res = await axios(`${appApi}${Constants.getOutBoundChart}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse" : localStorage.getItem("infor_warehouse"),
                "fromdate" : start,
                "todate" : end
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}
export async function getLocReportChartData(token){
    try {
        let res = await axios(`${appApi}${Constants.getLocReportChart}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}

