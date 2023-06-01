import axios from "axios"
import Constants, {appApi} from "../../misc/Constants";


export async function getPoHeader(token){
    debugger
    try {
        let res = await axios(`${appApi}${Constants.getPodHeader}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse":localStorage.getItem("infor_warehouse")
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
// /api/user/updpohdr

//orderreate
export async function PutPoCreate(body, token){
    debugger
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.putPoHeader}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse":localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: body
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}


//getpoDetailList
export async function getPoDetailList(token,pokey){
    debugger
    try {
        let res = await axios(`${appApi}${Constants.getPoDetail}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse":localStorage.getItem("infor_warehouse"),
                "mpokey": pokey
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


export async function PutPODetail(body, token,pokey){
    debugger
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.PutPoDetail}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse":localStorage.getItem("infor_warehouse"),
                "mextpokey" : pokey,
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: body
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}


export async function CreateASNfrompo(body, token){
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.CreateASNfrompo}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse":localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: body
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}

export async function deletepoheader(body, token){
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.deletepoheader}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "mwarehouse":localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: body
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}