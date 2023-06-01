import React from 'react';

import {BrowserRouter as Router,Route, Routes, Navigate} from "react-router-dom";

import Profile from './pages/Profile.jsx';
import Info from './pages/Info.jsx';
import DrawerRouterContainer from './components/DrawerRouterContainer.jsx';
import { AppContext } from './AppContext';
import { countries } from './resources/countries';
import { IntlProvider, load, LocalizationProvider, loadMessages } from '@progress/kendo-react-intl';
import {org_urls} from "./config/PrivateUrlConfig";

import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import weekData from 'cldr-core/supplemental/weekData.json';

import frNumbers from 'cldr-numbers-full/main/fr/numbers.json';
import frLocalCurrency from 'cldr-numbers-full/main/fr/currencies.json';
import frCaGregorian from 'cldr-dates-full/main/fr/ca-gregorian.json';
import frDateFields from'cldr-dates-full/main/fr/dateFields.json';

import usNumbers from 'cldr-numbers-full/main/en/numbers.json';
import usLocalCurrency from 'cldr-numbers-full/main/en/currencies.json';
import usCaGregorian from 'cldr-dates-full/main/en/ca-gregorian.json';
import usDateFields from'cldr-dates-full/main/en/dateFields.json';

import esNumbers from 'cldr-numbers-full/main/es/numbers.json';
import esLocalCurrency from 'cldr-numbers-full/main/es/currencies.json';
import esCaGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
import esDateFields from'cldr-dates-full/main/es/dateFields.json';

import { enMessages } from './messages/en-US';
import { frMessages } from './messages/fr';
import { esMessages } from './messages/es';

import 'hammerjs';
import '@progress/kendo-theme-default/dist/all.css';
import './App.scss';
import PrivateRoute from "./components/privateRoute/PrivateRoute.jsx";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/utility/NotFound.jsx";
// import InboundDetails from "./pages/InboundDetails";
import Login from '../src/pages/login/Login'
// import Inbound from './pages/Inbound.jsx';
import Logo from "./assets/vyapilogo.png";
import MultifactAuthenticator from "../src/pages/login/MultiFactAuthentication/multifactAuthentication"
import { useEffect } from 'react';
load(
    likelySubtags,
    currencyData,
    weekData,
    frNumbers,
    frLocalCurrency,
    frCaGregorian,
    frDateFields,
    usNumbers,
    usLocalCurrency,
    usCaGregorian,
    usDateFields,
    esNumbers,
    esLocalCurrency,
    esCaGregorian,
    esDateFields
);

loadMessages(esMessages, 'es');
loadMessages(frMessages, 'fr');
loadMessages(enMessages, 'en-US');

const App = () => {
    const [contextState, setContextState] = React.useState({
        localeId:'en-US',
        firstName: 'Peter',
        lastName: 'Douglas',
        middleName: '',
        email: 'peter.douglas@progress.com',
        phoneNumber: '(+1) 8373-837-93-02',
        avatar: null,
        country: countries[33].name,
        isInPublicDirectory: true,
        biography: '',
        teamId: 1
    });

    const events = [
        "load",
        "mousemove",
        "mousedown",
        "click",
        "scroll",
        "keypress",
    ];
    let timer;
    // this function sets the timer that logs out the user after 10 secs
    const handleLogoutTimer = () => {
        timer = setTimeout(() => {
            // clears any pending timer.
            resetTimer();
            // Listener clean up. Removes the existing event listener from the window
            Object.values(events).forEach((item) => {
                window.removeEventListener(item, resetTimer);
            });
            // logs out user
            logoutAction();
        }, 1200000); // 10000ms = 10secs. You can change the time. 1200000 for 20 mins
    };
    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };
    useEffect(() => {
        Object.values(events).forEach((item) => {
            window.addEventListener(item, () => {
                resetTimer();
                handleLogoutTimer();
            });
        });
    }, []);
    const logoutAction = () => {
        localStorage.clear();
        window.location.pathname = "/";
      };
      
    const onLanguageChange = React.useCallback(
        (event) => { setContextState({...contextState, localeId: event.value.localeId}) },
        [contextState, setContextState]
    );
    const onProfileChange = React.useCallback(
        (event) => {
            setContextState({...contextState, ...event.dataItem});
        },
        [contextState, setContextState]
    );
    let isLoggedIn = false

    if(localStorage.getItem('selfToken')) {
        isLoggedIn = true
    }

    return (
        <div className="App">
            <LocalizationProvider language={contextState.localeId}>
                <IntlProvider locale={contextState.localeId}> 
                    <AppContext.Provider value={{...contextState, onLanguageChange, onProfileChange}}>
                        <Router>
                            <Routes>
                                <Route exact path="/" name="Login" element={<Login />} />
                                {org_urls && org_urls.length > 0 && org_urls.map((route, id)=>(
                                    <Route
                                        key={id}
                                        path={route.path}
                                        element={
                                            <PrivateRoute>
                                                <route.content />
                                            </PrivateRoute>
                                        }/>
                                ))}
                                <Route exact path="/Auth" name ="Authentication" element={<MultifactAuthenticator />} />
                                <Route exact path="*" element={<NotFound />} />
                            </Routes>
                        </Router>
                </AppContext.Provider>
                </IntlProvider>
            </LocalizationProvider>
        </div>
    );
}

export default App;
