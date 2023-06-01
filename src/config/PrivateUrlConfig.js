import Home from "../pages/Home/Home"; 
import Inbound from "../pages/Inbound/Inbound Header/Inbound";
import InboundDetails from "../pages/Inbound/Inbound Detail/InboundDetails";
import InboundHeaderCreation from "../pages/Inbound/Inbound Header/InboundHeaderCreation";
import InboundDetailCreation from "../../src/pages/Inbound/Inbound Detail/InboundDetailCreation";
import ItemMaster from "../../src/pages/Configuration/ItemMaster/item";
import ItemMasterCreation from "../../src/pages/Configuration/ItemMaster/ItemCreation";
import Outboundheader from "../pages/Outbound/Outbound Header/Outboundheader";
import Outbounddetail from "../pages/Outbound/Outbound Detail/Outbounddetail";
import Inventorybalance from  "../pages/Inventory/Inventorybalance";
import Reports from "../pages/Configuration/Reports/Reports";
import Putaway from "../pages/Inventory/Putawayinv";
import massinternaltransfer from "../pages/Inventory/massinternaltransfer";
import excelupload from "../pages/Inventory/Excelupload"
import location from "../pages/Configuration/Location/Location";
import locationCreation from "../pages/Configuration/Location/LocationCreation";
import zone from "../pages/Configuration/Zone/Zone";
import OrderCreation from "../../src/pages/Outbound/Outbound Header/OrderHeaderCreation";
import OrderDetailCreation from "../../src/pages/Outbound/Outbound Detail/OutboundDetailCreation";
import Po from "../../src/pages/Purchase Order/PoHeader/Po"
import PoHeaderCreation from "../pages/Purchase Order/PoHeader/PoCreation";
import PoDetail from "../../src/pages/Purchase Order/PoDetail/PoDetail";
import PoDetailCreation from "../../src/pages/Purchase Order/PoDetail/PoDetailCreation";
import Pack from "../pages/Configuration/PackkeyMaster/Pack";
import PackCreation from "../pages/Configuration/PackkeyMaster/PackCreation";
import Poasn from  "../pages/Purchase Order/PoDetail/Poasn";
import zoneupload from "../pages/Configuration/Zone/Zoneexcelupload";
import locupload from "../pages/Configuration/Location/Locationexcelupload";
import itemupload from "../../src/pages/Configuration/ItemMaster/Itemexcelupload";
import Carrier from "../pages/Configuration/Carrier/Carrier";
import CarrierCreation from "../pages/Configuration/Carrier/CarrierCreation";
import ShipfromCreation from "../pages/Configuration/ShipFrom/ShipfromCreation";
import ShiptoCreation from "../pages/Configuration/ShipTo/ShiptoCreation";
import Shipfrom from "../pages/Configuration/ShipFrom/Shipfrom";
import Shipto from "../pages/Configuration/ShipTo/Shipto";
import PickDetailCreation from "../pages/Outbound/Pickdetail/PickdetailCreation";
import Pickdetail from "../pages/Outbound/Pickdetail/PickDetail";

export const org_urls =[
  {
    path: "/dashboard",
    content: Home,
  },
  {
    path: "/inbound",
    content: Inbound,
  },
  {
    path: "/inbound/details",
    content: InboundDetails,
  },
  {
    path: "/inbound/creation/header",
    content: InboundHeaderCreation,
  },
  {
    path: "/inbound/details/creation",
    content: InboundDetailCreation,
  },
  {
    path: "/Config/ItemMaster",
    content: ItemMaster,
  },
  {
    path:"/Config/ItemMasterCreation",
    content:ItemMasterCreation,
  },
  {
    path: "/Outbound",
    content: Outboundheader,

  },
  {
    path: "/Outbound/detail",
    content : Outbounddetail,
  },
  {
    path: "/Inventory",
    content : Inventorybalance,
  },
  {
    path : "/Reports",
    content : Reports,
  },
  {
    path : "/Inventory/Putaway",
    content : Putaway,
  },
  {
    path : "/Inventory/excelupload",
    content : excelupload
  },
  {
    path :"/Config/location",
    content :location
  },
  {
    path:"/Config/location/Creation",
    content : locationCreation,
  },
  {
    path:"/Config/Zone",
    content:zone,
  },
  {
    path:"/Outbound/Creation",
    content:OrderCreation,
  },
  {
    path: "/Inventory/Transfer",
    content : massinternaltransfer,
  },
  {
    path:"/Outbound/detail/Creation",
    content:OrderDetailCreation
  },{
    path:"/Po",
    content:Po,
  },{
    path:"/Po/Header/Creation",
    content:PoHeaderCreation,
  },{
    path:"/Po/Detail",
    content:PoDetail,
  },{
    path:"/Po/Detail/Creation",
    content:PoDetailCreation,
  },
  {
    path: "/Config/Pack",
    content: Pack,
  },
  {
    path: "/Config/Pack/Creation",
    content: PackCreation,
  },
  {
    path: "/Po/Detail/ASN",
    content: Poasn,
  },
  {
    path : "/Config/Zone/excelupload",
    content : zoneupload,
  },
  {
    path : "/Config/location/excelupload", 
    content : locupload,
  },
  {
    path : "/Config/ItemMaster/excelupload", 
    content : itemupload,
  },
  {
    path : "/Config/Carrier",
    content : Carrier,
  },
  {
    path : "/Config/Carrier/Creation",
    content : CarrierCreation,
  },
  {
    path : "/Config/Shipfrom/Creation",
    content : ShipfromCreation,
  },
  {
    path : "/Config/Shipto/Creation",
    content : ShiptoCreation,
  },
  {
    path : "/Config/Shipfrom",
    content : Shipfrom,
  },
  {
    path : "/Config/Shipto",
    content : Shipto,
  },
  {
    path: "/Pickdetail",
    content: Pickdetail
  },
  {
    path:"/Pickdetail/PickDetailCreation",
    content: PickDetailCreation
  }
]


