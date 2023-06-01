
import * as React from 'react';

import { useLocalization } from '@progress/kendo-react-intl';
import { useNavigate} from "react-router-dom";
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from "@progress/kendo-react-inputs";
import './login.css';
import {authenticate, authenticateToken} from "../../services/auth/AuthService";
import {useState} from "react";
import Loader from "../../components/Loader/Loader";
import {getClient} from "../../services/InboundService/InboundService";
import { WithSnackbar } from "../../../src/components/form/Notification";
import Logo from "../../assets/vyapilogo.png";
import headerBg from '../../assets/header-bg.png';



const Login = () => {

    const localizationService = useLocalization();
    let navigate = useNavigate()
    var timeout;

    const [state, setState] = useState({
        email : '',
        password : '',
        grant_type: 'password',
        isLogged: '',
        isLoaded: '',
        invalidCred: false,
        errorMsg: ''
    })

    const [loading, setLoading] = useState(false)
    const [open, setopen] = useState(false);
    const [message, setmessage] = useState("")
    const [severity, setseverity] = useState("success");

    // const onCancelClick = React.useCallback(
    //     () => {
    //         history.push('/');
    //     },
    //     [history]
    // );

    const handleChange = (e) =>{
        setState({...state, [e.target.name]: e.target.value})
    }

    const user_authenticated = (res) =>{
debugger
        authenticateToken().then(r => {
            console.log(r)
            if(r){
               navigate('/Auth')
            }
        });
    }


    const handleSubmit = (e) => {
        debugger
        e.preventDefault()

        let details = {
            'userName': state.email,
            'password': state.password,
            'grant_type': 'password'
        };

        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property)
            let encodedValue = encodeURIComponent(details[property])
            formBody.push(encodedKey + "=" + encodedValue)
        }
        formBody = formBody.join("&");

        setLoading(true)
        authenticate(formBody).then(r => {
            debugger
            if(r.access_token){
                
                getClient(details.userName,details.password,r.access_token).then(res=>{
                    if (!hasError) {
                        user_authenticated(r)
                    }
                    else{
                        console.log(errMsg, "msg")
                        setopen(true);
                        setmessage(errMsg)
                        setseverity("error")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
                    }
                })
            }
            else{
                setopen(true);
                        setmessage(r)
                        setseverity("error")
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            setopen(false);
                        }, 2000);
            }
            let hasError = true
            let errMsg = "";
            if (r.hasOwnProperty('access_token')) {
                hasError = false
            } else if (!r.hasOwnProperty('access_token')){
                hasError = true
                errMsg = r.error_description ? r.error_description : r.msg
             }
            setLoading(false)
            
        })

    }

    return (
        <>
        {loading && <Loader loading={loading}/>}
        <div id="Login" className="login-page" >
        <WithSnackbar open={open} message={message} severity={severity} />
            <div className="login-container">

                <div className="login-header" >
                        <img src={Logo} alt="Logo" width="150px" height="80px" />
                </div>
                <div className="login-component">
                <div className="login-title"  >
                     Login
                    </div>
                    <Form
                        render={(formRenderProps) => (
                            <FormElement horizontal={true}  >
                                <Field
                                    id={'email'}
                                    name={'email'}
                                    type={'email'}
                                    label={localizationService.toLanguageString('custom.userID')}
                                    component={Input}
                                    value={state.email}
                                    onChange={handleChange}
                                />
                                <Field
                                    id={'password'}
                                    name={'password'}
                                    type={'password'}
                                    className="{password-field mt-5}"
                                    label={localizationService.toLanguageString('custom.password')}
                                    component={Input}
                                    value={state.password}
                                    onChange={handleChange}
                                />
                                {/*<div className='row mt-2'>
                                    <div className='col-md-6'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                            <label className="form-check-label" for="flexCheckChecked">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-end'>
                                        <a href='#' className=''>Forgot Password?</a>
                                    </div>
                                    </div>*/}


                                <div className={'k-form-buttons d-block '}>
                                    <Button
                                        primary={true}
                                        type={'submit'}
                                        className={'d-block  rounded'}
                                        onClick={handleSubmit}
                                    >
                                        <span class="k-icon k-i-lock"></span> {localizationService.toLanguageString('custom.signIn')}
                                    </Button>
                                </div>
                                {/*<div className='row mt-2'>
                                    <div className='text-center'>
                                        Dont't have an account? <a href='#'>Sign up</a>
                                    </div>
                                </div>*/}
                            </FormElement>
                        )}
                    />
                    
                </div>
                <div  className={'login-footer'} >
                <div className='text-center'>&copy;2022 - Powered by Vyapisoft</div>
                    </div>
            </div>
        </div>
        </>
    );
}

export default Login;
