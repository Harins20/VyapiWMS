import axios from "axios"
import Constants, {appApi} from "../../misc/Constants";




// Item get Service
export async function getItem(token){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.getSku}`, {
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

//item put setvice
export async function PostItem(mBody,token,action){
    debugger
   console.log(mBody);

    try {
        let res = await axios(`${appApi}${Constants.PutSku}`, {
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

//item Delete setvice
export async function DeleteItem(mBody,token,action){
    debugger
   console.log(mBody);
//    localStorage.getItem("Client")
    try {
        let res = await axios(`${appApi}${Constants.DeleteSku}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption":action,
                "mwarehouse" :  localStorage.getItem("infor_warehouse")

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

// Location get Service
export async function getLocation(token){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.getLoc}`, {
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

//Create and update Location
export async function putLocation(mBody,token,action){
    debugger
   console.log(mBody);

    try {
        let res = await axios(`${appApi}${Constants.PutLoc}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption":action,
                "mwarehouse" :  localStorage.getItem("infor_warehouse")

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

//Location Delete setvice
export async function DeleteLoc(mBody,token,action){
    debugger
   console.log(mBody);
//    localStorage.getItem("Client")
    try {
        let res = await axios(`${appApi}${Constants.DeleteLoc}`, {
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

//Loc feild Values
export async function getLocFieldValue(token, listname){
    console.log(token, 'token')
    debugger
    try {
        let res = await axios(`${appApi}${Constants.getcode}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "listname": listname
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

// Zone get Service
export async function getZone(token){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.getZone}`, {
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

//Create and update Zone
export async function putZone(mBody,token,action){
    debugger
   console.log(mBody);

    try {
        let res = await axios(`${appApi}${Constants.PutZone}`, {
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

export async function DeleteZone(mBody,token,action){
    debugger
   console.log(mBody);

    try {
        let res = await axios(`${appApi}${Constants.DeleteZone}`, {
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

export async function getcodesc(token, listname){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.getcode}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "listname": listname
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

export async function getStorerkeys(token, type){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.getstorer}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "type" : type
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


export async function getPack(token){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.getpackkey}`, {
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



export async function putPack(mBody, token){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.updpackkey}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse" : localStorage.getItem("infor_warehouse"),
                "moption" : 1 
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
            data:mBody
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}



export async function getPackUoms(token, packkey){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.packuoms}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "packkey" : packkey
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

export async function delPack(mBody, token){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.deletepack}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
            data:mBody
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}


export async function createStorerKeys(mBody, token, type){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.createstorer}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "mwarehouse" : localStorage.getItem("infor_warehouse"),
                "msite" : "TEST",
                "type" : type
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
            data:mBody
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}


export async function deletetorerKeys(mBody, token, type){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.deletestorer}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "mwarehouse" : localStorage.getItem("infor_warehouse"),
                "msite" : "TEST",
                "type" : type
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
            data:mBody
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}


export async function getRoles(token, pagename){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.roles}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse" : "SCPRD_ENTERPRISE",
                "pagename" : pagename,
                //"template" :  "readOnly"  
                //localStorage.getItem("Template") 
                "template" :  "temp1" 
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