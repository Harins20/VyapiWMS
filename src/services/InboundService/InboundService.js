import axios from "axios"
import Constants, {appApi} from "../../misc/Constants";


export async function getClient(userName,password,token){
    try{
        let res = await axios(`${appApi}${Constants.clientURL}`, {
            method: 'GET',
            params: {
                "username": userName,
                "password": password
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        if (res.status === 200) {
            debugger
            console.log(res);
            console.log(res.data);
            console.log(res.data.Data);

            console.log(res.data.Data.Client);
            window.localStorage.setItem("Client", res.data.Data.Client)
            window.localStorage.setItem("UserName", res.data.Data.UserName)   
            window.localStorage.setItem("infor_warehouse", res.data.Data.infor_warehouse)   
            return res.data;
        } else return false;
    }
    catch(e){
        return false
    }
}

export async function getInBound(token){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.inboundRead}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST"
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

export async function getInBoundDetails(receiptKey,token){
    try {
        let res = await axios(`${appApi}${Constants.inboundDetails}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mreceiptkey": receiptKey
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

//Create and update receipt header
export async function putInboundHeader(mBody,token,action){
    debugger
   console.log(mBody);

    try {
        let res = await axios(`${appApi}${Constants.inboundHeaderCreate}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption":action

            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
            console.log(res.data);
            return res.data;
        } else {
            console.log(res);
            console.log(res.data);
        };
    } catch (e) {
        return false;
    }
}

// Get one receipt header
export async function getSingleReceiptHeader(receiptKey,token){
    
    try {
        let res = await axios(`${appApi}${Constants.inboundReadSingleReceipt}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mreceiptkey": receiptKey
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}

//statuscount

export async function getStatusCount(token){

    try {
        let res = await axios(`${appApi}${Constants.statusCount}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST"
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



//Create and update receipt detail
export async function PutInboundDetailCreation(mBody,token,action){
    debugger
   console.log(mBody);

    try {
        let res = await axios(`${appApi}${Constants.inboundDetailCreate}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption":action,
                "mwarehouse" : localStorage.getItem("infor_warehouse")

            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
            console.log(res.data);
            return res.data;
        } else {
            console.log(res);
            console.log(res.data);
        };
    } catch (e) {
        return false;
    }
}

//inbound Receive
export async function putReceiveall(mBody,token,action,receiptkey){
debugger
    try {
        let res = await axios(`${appApi}${Constants.inboundReceive}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mReceiptkey": receiptkey,
                "moption": "1",
                "mwarehouse" : localStorage.getItem("infor_warehouse")

            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
            console.log(res.data);
            return res.data;
        } else {
            console.log(res);
            console.log(res.data);
        };
    } catch (e) {
        return false;
    }
}
// /api/user/ReceiveLines?mclient={mclient}&msite={msite}&mReceiptkey={mReceiptkey}&moption={moption}
//inbound Receive by line
export async function putReceiveByLine(mBody,token,action,receiptkey){
    console.log(mBody);
    console.log(mBody);
    debugger
    try {
        let res = await axios(`${appApi}${Constants.inboundreceiveByLine}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mReceiptkey": receiptkey,
                "moption": "1"

            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
            console.log(res.data);
            return res.data;
        } else {
            console.log(res);
            console.log(res.data);
        };
    } catch (e) {
        return false;
    }
}



export async function putUnReceiveall(mBody,token,action,receiptkey){
    try {
        let res = await axios(`${appApi}${Constants.unreceiveall}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
            console.log(res.data);
            return res.data;
        } else {
            console.log(res);
            console.log(res.data);
        };
    } catch (e) {
        return false;
    }
}


export async function savereceiptheader(mBody,token){
    try {
        let res = await axios(`${appApi}${Constants.saveasnhead}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
            console.log(res.data);
            return res.data;
        } else {
            console.log(res);
            console.log(res.data);
        };
    } catch (e) {
        return false;
    }
}

export async function getreceiptheader(receiptkey,token){
    try {
        let res = await axios(`${appApi}${Constants.getreceiptheader}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                'mReceiptkey' : receiptkey,
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
          
        })
        if (res.status === 200) {
            //console.log(res.data);
            return res.data;
        } else {
            //console.log(res);
            //console.log(res.data);
            return res;
        };
    } catch (e) {
        return false;
    }
}

export async function savereceiptdetail(mBody,token){
    try {
        let res = await axios(`${appApi}${Constants.saveasndetail}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption" : "1",
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
            console.log(res.data);
            return res.data;
        } else {
            console.log(res);
            console.log(res.data);
        };
    } catch (e) {
        return false;
    }
}



export async function deleteasn(mBody,token){
    try {
        let res = await axios(`${appApi}${Constants.deleteasn}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
           
            return res.data;
        } else {
            return res.data;
        };
    } catch (e) {
        return false;
    }
}





export async function deleteasnlines(mBody,token, receiptkey, externreceiptkey){
    try {
        let res = await axios(`${appApi}${Constants.deleteasnlines}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "mwarehouse" : localStorage.getItem("infor_warehouse"),
                "receiptkey" : receiptkey,
                "extreceiptkey" : externreceiptkey
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data:mBody
          
        })
        if (res.status === 200) {
           
            return res.data;
        } else {
            return res.data;
        };
    } catch (e) {
        return false;
    }
}