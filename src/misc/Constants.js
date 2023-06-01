

//export const appApi = "http://wservice.vyapitech.com"

export const appApi = "http://webscm.vyapilogistics.com:8089";

let urlConstant = {
    
    /******************************************* Common Api Path *********************************************************/
    /*****************************************************************************************************************/

    //Login
    "login": "/token",
    // Inbound
    "inboundRead": "/api/user/GetRceiptList",
    "inboundDetails": "/api/user/GetRceiptDtlLines",
    "inboundHeaderCreate":"/api/user/UpdRcpt",
    "inboundReadSingleReceipt":"/api/user/GetRceiptKey",
    "statusCount":"/api/user/GetRcptCounter",
    "inboundDetailCreate": "/api/user/UpdRcptDtl",
    "inboundReceive":"/api/user/ReceiveAll",
    "inboundreceiveByLine":"/api/user/ReceiveLines",
    "clientURL" : "/api/user/ValidateLogin",
    "getItem" : "/api/user/GetSKUList",
    "CreateItem" : "/api/user/UpdSKUList",
    "GetLocation":"api/user/GetLOCList",
    "outboundRead": "/api/user/GetOrderList",
    "outbounddetailread" : "/api/user/GetOrdertDtlLines",
    "getinv" : "/api/user/getInventoryList",
    "allocall" : "/api/user/Allocateall",
    "unallocall": "/api/user/UnAllocateall",
    "shipall": "/api/user/Shipall",
    "unreceiveall" : "/api/user/UnReceiveAll",
    "unpick" : "/api/user/UnPickall",
    "moveall" : "/api/user/MoveAll",
    "pickdetails" : "/api/user/getpickdetdata",
    "pickorder" : "/api/user/Pickall",
    "saveasnhead" : "/api/user/Updrcpthdr",
    "getreceiptheader" : "/api/user/getrcpthdrdet",
    "saveasndetail" : "/api/user/updasnqty",
    "unpicklines" : "/api/user/UnPicksel",
    "updateorderheader" : "/api/user/updordhdr",
    "getSku" : "/api/user/getskulist",
    "getLoc" : "/api/user/getloclist",
    "PutLoc" : "/api/user/locupdate",
    "PutSku" :"/api/user/skuupdate",
    "DeleteSku" :"/api/user/deletesku",
    "DeleteLoc" :"/api/user/deleteloc",
    "getZone":"/api/user/getzonelist",
    "PutZone":"/api/user/zoneupdate",
    "DeleteZone":"/api/user/deletezon",
    "getcode":"/api/user/getcodesc",
    "Adjustment" : "/api/user/adjentry",
    "getstorer" : "/api/user/getstorerkey",
    "OrderCreate" : "/api/user/updordhdr",
    "OrderUpdate" : "/api/user/updorddet",
    "OrderLineDelete":"/api/user/deleteordline",
    "OrderHeaderDelete":"/api/user/deleteorder",
    "DeleteOrderLine":"/api/user/deleteordline",
    "putPoHeader" : "/api/user/updpohdr",
    "getPodHeader" : "/api/user/getpohdrlist",
    "getPoDetail" : "/api/user/getpodtllist",
    "PutPoDetail" : "/api/user/updpodet",
    "deleteasn" : "/api/user/deleteasn",
    "deleteasnlines" : "/api/user/deleteasnline",
    "getpackkey" : "/api/user/packkey",
    "updpackkey" : "/api/user/packkeyupdate",
    "packuoms" : "/api/user/packuom",
    "deletepack" : "/api/user/deletepackkey",
    "createstorer" : "/api/user/createstorer",
    "deletestorer" : "/api/user/deletestorer",
    "getpickdetail" : "/api/user/getpickdetaillist",
    "DeletePickDetail":"/api/user/deletepickdet",
    "CreatePickDetail":"/api/user/createpickdet",
    "CreateASNfrompo" : "/api/user/createpoASN",
    "massinternaltransfer" : "/api/user/inttransfer",
    "updatedropid" : "/api/user/upddropid",
    "getInBoundChart": "/api/user/getinboundrec",
    "getOutBoundChart": "/api/user/getoutboundrec",
    "closeorder" : "/api/user/CloseOrder",
    "UpdatePickDetail":"/api/user/updpickdet",
    "getLocReportChart":"/api/user/getloccountreport",
    "deletepoheader" : "/api/user/deletepurchaseorder",
    "roles" : "/api/user/getrolecomp"
}

export default urlConstant
