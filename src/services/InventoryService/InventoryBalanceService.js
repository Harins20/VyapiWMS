import axios from "axios"
import Constants, {appApi} from "../../misc/Constants";



export async function getinv(token){
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.getinv}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client")
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


//Adjustment
export async function DoAdjustment(mBody,token,action){
    debugger
   console.log(mBody);

    try {
        let res = await axios(`${appApi}${Constants.Adjustment}`, {
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


export async function massinternaltransferapi(body, token){
    try {
        let res = await axios(`${appApi}${Constants.massinternaltransfer}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`
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