import axios from "axios"
import Constants, { appApi } from "../../misc/Constants";



export async function getoutBound(token) {
    console.log(token, 'token')
    try {
        let res = await axios(`${appApi}${Constants.outboundRead}`, {
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


export async function getOutBoundDetails(orderkey, token) {
    try {
        let res = await axios(`${appApi}${Constants.outbounddetailread}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mreceiptkey": orderkey
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



export async function allocateorders(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.allocall}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mOrderkey": "test",
                "mRec": "test",
                "moption": 1,
                "mwarehouse": localStorage.getItem("infor_warehouse")
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


export async function unallocateorders(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.unallocall}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mOrderkey": "test",
                "mRec": "test",
                "moption": 1,
                "mwarehouse": localStorage.getItem("infor_warehouse")
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


export async function shiporders(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.shipall}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mOrderkey": "test",
                "mRec": "test",
                "moption": 1,
                "mwarehouse": localStorage.getItem("infor_warehouse")
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


export async function unpickorders(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.unpick}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mOrderkey": "test",
                "mRec": "test",
                "moption": 1,
                "mwarehouse": localStorage.getItem("infor_warehouse")
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



export async function getpickdetail(orderkey, token) {
    try {
        let res = await axios(`${appApi}${Constants.pickdetails}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "morderkey": orderkey,
            },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}



export async function pickorder(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.pickorder}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse": localStorage.getItem("infor_warehouse")
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


export async function unpickorderlines(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.unpicklines}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse": localStorage.getItem("infor_warehouse")
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



export async function updateorderheader(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.updateorderheader}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse": localStorage.getItem("infor_warehouse")
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

export async function getStorerkeys(token, type){
    try {
        let res = await axios(`${appApi}${Constants.getstorer}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "type": type
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

//orderreate
export async function OrderCreate(body, token) {
    debugger
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.OrderCreate}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse": localStorage.getItem("infor_warehouse")
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


export async function Updateorder(token, orderkey){
    try {
        let res = await axios(`${appApi}${Constants.updatedropid}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "morderkey" : orderkey,
                "mwarehouse" : localStorage.getItem("infor_warehouse")
            },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (res.status === 200) {
            return res.data;
        } else return false;
    } catch (e) {
        return false;
    }

}

export async function Closeorder(body,token){
    try {
        let res = await axios(`${appApi}${Constants.closeorder}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mOrderkey": "test",
                "mRec": "test",
                "moption": 1,
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
//orderdetail Create 
export async function OrderDetail(body, token, OrderKey, ExternOrderKey) {
    debugger
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.OrderUpdate}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "moption": "1",
                "mwarehouse": localStorage.getItem("infor_warehouse"),
                "mOrderkey": OrderKey,
                "extordkey": ExternOrderKey,
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

//OrderLinneDelette
export async function OrderDetailDelete(body, token, OrderKey, ExternOrderKey) {
    debugger
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.OrderLineDelete}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                // "msite": "TEST",
                // "moption": "1",
                "mwarehouse": localStorage.getItem("infor_warehouse"),
                "morderkey": OrderKey,
                "mextorderkey": ExternOrderKey,
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

//OrderHeaderDelete
export async function OrderHeaderDelete(body, token) {
    debugger
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.OrderHeaderDelete}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                // "msite": "TEST",
                // "moption": "1",
                "mwarehouse": localStorage.getItem("infor_warehouse"),
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

//Pick Detail 

//get pickkdetail 

export async function getPickDetail(token) {
    try {
        let res = await axios(`${appApi}${Constants.getpickdetail}`, {
            method: 'GET',
            params: {
                "mclient": localStorage.getItem("Client"),
            },
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        if (res.status === 200) {
            return res.data;
        } else {
            return false
        };
    } catch (e) {
        return false;
    }
}

//Delete Pickdetail 

export async function DeletePickDetail(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.DeletePickDetail}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "mwarehouse": localStorage.getItem("infor_warehouse"),
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


//PickDetail Create  

export async function CreatePickDetail(body, token) {
    try {
        let res = await axios(`${appApi}${Constants.CreatePickDetail}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse": localStorage.getItem("infor_warehouse"),
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



//PickDetail Update  

export async function UpdatePickDetail(body, token) {
    debugger
    console.log(body);
    try {
        let res = await axios(`${appApi}${Constants.UpdatePickDetail}`, {
            method: 'PUT',
            params: {
                "mclient": localStorage.getItem("Client"),
                "msite": "TEST",
                "mwarehouse": localStorage.getItem("infor_warehouse"),
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

