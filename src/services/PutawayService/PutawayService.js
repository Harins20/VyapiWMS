import axios from "axios"
import Constants, {appApi} from "../../misc/Constants";


export async function putawayservice(body,token,opt){
    try {
        let res = await axios(`${appApi}${Constants.moveall}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": opt,
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