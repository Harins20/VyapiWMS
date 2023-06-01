import React, {useEffect, useState} from 'react';

import {useLocation, useNavigate, withRouter} from 'react-router-dom';
import { registerForLocalization, provideLocalizationService } from '@progress/kendo-react-intl';
import { Drawer, DrawerContent } from '@progress/kendo-react-layout';

import { Header } from './layoutComponents/Header.jsx';

const items = [
        { name: 'dashboard', icon: 'k-i-grid', selected: true , route: '/dashboard',  title: 'Dashboard'},
        { name:'Purchase Order', icon: 'k-i-user',route:'/Po', title : 'Purchase Order'},
        { name: 'Inbound', icon: 'k-i-hyperlink', route: '/inbound', title: 'Inbound'},
        { name: 'Outbound', icon: 'k-i-hyperlink-remove', route: '/Outbound', title: 'Outbound'},
        { name: 'Pickdetail', icon: 'k-i-user', route: '/Pickdetail', title: 'Pickdetail' },
        { name: 'Inventory', icon: 'k-i-dictionary-add', route: '/Inventory', title: 'Inventory' },
        { name: 'Masters'},
        { name: 'Item',icon: 'k-i-reorder', route : '/Config/ItemMaster', title: 'Item' },
        { name: 'Location',icon: 'k-i-marker-pin-target', route : '/Config/location', title: 'Location' },
        { name: 'Zone',icon: 'k-i-user', route : '/Config/Zone', title: 'Zone' },
        { name: 'Pack', icon: 'k-i-user', route: '/Config/Pack', title: 'Pack' },
        { name: 'Carrier', icon: 'k-i-user', route: '/Config/Carrier', title: 'Carrier' },
        { name: 'Ship From', icon: 'k-i-user', route: '/Config/Shipfrom', title: 'Ship From'},
        { name: 'Ship To', icon: 'k-i-user', route: '/Config/Shipto', title: 'Ship To'},
        { name: 'Reports', icon: 'k-i-document-manager', route: '/Reports', title: 'Reports' },
        //{ name : 'Excel Upload', icon: 'k-i-user', route: '/Inventory/excelupload'}
    ];


const DrawerRouterContainer = (props) => {
    let location = useLocation()
    let navigate = useNavigate()
    const localizationService = provideLocalizationService({})

    const [expanded, setExpanded] = useState(true)
    const [selectedId, setSelectedId] = useState(items.findIndex(x => x.selected === true),)
    const [isSmallerScreen, setIsSmallerScreen] = useState(window.innerWidth < 768)
    const [pageTitle, setPageTitle] = useState('Dashboard');

    const resizeWindow = () => {
        setIsSmallerScreen(window.innerWidth < 768)
    }


    useEffect(() => {
        try {
            const parent = window.parent;
            if(parent) {
                parent.postMessage({ url: location.pathname, demo: true }, "*")
            }
        } catch(err) {
            console.warn('Cannot access iframe')
        }
    },[])

    useEffect(() => {
        window.addEventListener('resize', resizeWindow, false)
        resizeWindow();
    },[])

    useEffect(() => {
        window.removeEventListener('resize', resizeWindow)
    },[])

    const handleClick = () => {
       setExpanded(!expanded)
    }

    const handleSelect = (e) => {
        setSelectedId(e.itemIndex)
        setExpanded(true)
         navigate(e.itemTarget.props.route);
         setPageTitle(e.itemTarget.props.title);
    }

    const getSelectedItem = (pathName) => {
        
        let currentPath = items.find(item => pathName.includes(item.route));
        if (currentPath.name) {
            return currentPath.name;
        }
    }

    let selected = getSelectedItem(location.pathname)

    return (
        <React.Fragment>
            <Header
                onButtonClick={handleClick}
                page={localizationService.toLanguageString(`custom.${selected}`)}
                title = {pageTitle}
            />
            <Drawer
                expanded={expanded}
                animation={{duration: 100}}
                items={items.map((item) => ({
                    ...item,
                    text: item.name.charAt(0).toUpperCase() + item.name.slice(1),
                    selected: item.name === selected
                }))
                }
                position='start'
                
                mode={isSmallerScreen ? 'overlay' : 'push'}
                mini={isSmallerScreen ? false : true}

                onOverlayClick={handleClick}
                onSelect={handleSelect}
                
            >
                <DrawerContent >
                    {props.children}
                </DrawerContent>
            </Drawer>
        </React.Fragment>
    );
}

registerForLocalization(DrawerRouterContainer);

export default DrawerRouterContainer





