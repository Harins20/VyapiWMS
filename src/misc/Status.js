




let statusDecode = {
    
    /******************************************* Common Api Path *********************************************************/
    /*****************************************************************************************************************/

    //Login
    "inbound_New": "0",
    "inbound_Received":"9",
    "inbound_InReceving":"5"
    // Inbound
}

let receiptstatuscode = {
  "0"  : "New",
  "5"  : "In Receiving",
  "9"  : "Received",
  "11" : "Closed"
}

let setStatusColor ={
    New: "0",
    Received: "9",
    Closed: "11",
    InReceiving:"5"

  }



let setOrderStatusColor = {
  '95' : 'Shipped Complete',
  '55' : 'Pick Complete',
  '04' : 'Created Internally',
  '02' : 'Created Externally',
  '06' : 'Did Not Allocate',
  '17' : 'Allocated',
  '09' : 'Not Started',
  '14' : 'Part Allocated',
  '52' : 'Part Picked',
  '92' : 'Part Shipped',
  '53' : 'Part Picked / Part Shipped',
  '57' : 'Picked / Part Shipped',
  '98' : 'Cancelled Externally',
  '99' : 'Cancelled Internally',
  '00' : 'Empty Order'
}


let setOrderdetailStatusColor = {
  ShippedComplete : 'Shipped Complete',
  PickComplete : 'Pick Complete',

}


let pickdetailstatus = {
  '0' : 'Allocated',
  '5' : 'Picked',
  '9' : 'Shipped'
}
export default {statusDecode,setStatusColor,setOrderStatusColor,setOrderdetailStatusColor, pickdetailstatus, receiptstatuscode}





