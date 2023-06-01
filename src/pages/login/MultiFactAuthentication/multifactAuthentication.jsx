import React, { Component } from "react";
import { render } from "react-dom";
import Logo from "../../../assets/vyapilogo.png";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";
import { WithSnackbar } from "../../../components/form/Notification";
import { useNavigate  } from "react-router-dom";
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from "@progress/kendo-react-inputs";

class MultifactAuthenticator extends Component {
  state = {
    image: "",
    secret: "",
    validCode: "",
    isCodeValid: null,
    open: false,
    severity: "",
    message: "",
  };

  componentDidMount() {
    
    const secret = {
        username:"Vyapi",
      ascii: "?:SD%oDD<E!^q^1N):??&QkeqRkhkpt&",
      base32: "H45FGRBFN5CEIPCFEFPHCXRRJYUTUPZ7EZIWWZLRKJVWQ23QOQTA",
      hex: "3f3a5344256f44443c45215e715e314e293a3f3f26516b6571526b686b707426",
      otpauth_url:
        "otpauth://totp/" + localStorage.getItem('UserName') + "?secret=H45FGRBFN5CEIPCFEFPHCXRRJYUTUPZ7EZIWWZLRKJVWQ23QOQTA"
    };
    // console.log('SECRET -->', secret);

    // Backup codes
    const backupCodes = [];
    const hashedBackupCodes = [];
    const randomCode = (Math.random() * 10000000000).toFixed();
    console.log('randomCode -->', randomCode);

    for (let i = 0; i < 10; i++) {
      const randomCode = (Math.random() * 10000000000).toFixed();
      const encrypted = CryptoJS.AES.encrypt(
        randomCode,
        secret.base32
      ).toString();
      console.log(encrypted);
      console.log(randomCode)
      backupCodes.push(randomCode);
      hashedBackupCodes.push(encrypted);
    }

    console.log("backupCodes ----->", backupCodes);
    console.log("hashedBackupCodes ----->", hashedBackupCodes);

    // const encrypted = CryptoJS.AES.encrypt(randomCode, secret.base32).toString();
    // console.log('encrypted -->', encrypted)
    // var bytes  = CryptoJS.AES.decrypt(encrypted, secret.base32);
    // var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // console.log('originalText --->', originalText);
    debugger
console.log(QRCode);
console.log(secret);

    QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
      this.setState({ image: image_data, secret });
    });
  }

  getCode = () => {
    const { base32, hex } = this.state.secret;
    console.log(speakeasy.totp);
    const code = speakeasy.totp({
      secret: hex,
      encoding: "hex",
      algorithm: "sha1"
    });
console.log(code);
    this.setState({ validCode: code });
  };

  verifyCode = () => {
    debugger
    const { inputValue, secret } = this.state;
    const { base32, hex } = secret;
    const { navigate } = this.props;
    console.log(hex);
    console.log(inputValue);
    console.log(secret.base32);
    console.log("base32",base32 );
    console.log(speakeasy.totp.secret);
    console.log(speakeasy.totp.verify.secret);
    const isVerified = speakeasy.totp.verify({
      secret:hex,
      encoding: "hex",
       
       token:inputValue,
window:7   });

    if(isVerified === false){
        this.setState({ open: true }, () => setTimeout(() => {
            this.setState({ open: false })
        }, 2000))
        this.setState({ message: "Wrong OTP" })
        this.setState({ severity: "error" })
    }
    else{
        this.setState({ open: true }, () => setTimeout(() => {
            this.setState({ open: false })
        }, 2000))
        this.setState({ message: "Welcome to VWMS" })
        this.setState({ severity: "success" })
        navigate('/dashboard')
    }
    console.log("isVerified -->", isVerified);
    // this.setState({ isCodeValid: isVerified });
  };

  render() {
    const { image, validCode, isCodeValid } = this.state;
    return (
        <>
      <WithSnackbar open={this.state.open} message={this.state.message} severity={this.state.severity} />
     
      {/* <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}>
        <img src={`${image}`} />
       
        <div>
         <div style={{ marginTop: 20,marginRight:10 }}>Verify code</div>
        <input
          type="number" 
          onChange={e => this.setState({ inputValue: e.target.value })}
        />
        <button onClick={this.verifyCode}>Verify</button>
       
        </div>
      </div> */}


        <div id="Login" className="login-page" >
     
            <div className="login-container">

                <div className="login-header" >
                <img src={Logo} alt="Logo" width="150px" height="80px" />
                </div>
                <div className="login-component">
                <div className="login-title"  >
                <img src={`${image}`} />
                    </div>
                    <Form
                        render={(formRenderProps) => (
                            <FormElement horizontal={true}  >
                                <Field
                                   
                                    
                                    type={'number'}
                                    label={'Verify code'}
                                    component={Input}
                                    
                                    onChange={e => this.setState({ inputValue: e.target.value })}
                                />
                               
                                


                               <div className={'k-form-buttons d-block '}>
                                    <Button
                                        primary={true}
                                       
                                        className={'d-block  rounded'}
                                        onClick={this.verifyCode}
                                    >
                                       Verify
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
}

export default function(){
    let navigate = useNavigate()
    return <MultifactAuthenticator navigate={navigate} />
}
