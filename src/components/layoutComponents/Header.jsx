
import * as React from 'react';
import * as PropTypes from 'prop-types';

import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Avatar } from '@progress/kendo-react-layout';
import { useLocalization } from '@progress/kendo-react-intl';

import { locales } from '../../resources/locales';
import { Input } from "@progress/kendo-react-inputs";
import { AppContext } from '../../AppContext'
import Logo from "../../assets/vyapilogo1.png";

import headerBg from '../../assets/header-bg.png';
import userAvatar from '../../assets/mask.png';
import burger from '../../assets/burger-icon1.png';
import { useNavigate} from "react-router-dom";

export const Header = (props) => {
    const { onButtonClick } = props;
    const { avatar, localeId, onLanguageChange } = React.useContext(AppContext);
    const localizationService = useLocalization();

    const currentLanguage = locales.find(item => item.localeId === localeId);

    const pageTitle = props.title && props.title;

    const imgRef = React.useRef(null);
    const hasImage = avatar && avatar.length > 0;

    let navigate = useNavigate();

    React.useEffect(
        () => {
            if (hasImage) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    imgRef.current.setAttribute('src', e.target.result)
                }

                reader.readAsDataURL(avatar[0].getRawFile());
            }
        },
        [avatar, hasImage]
    );
    const logout = () => {
        console.log('logout');
        window.localStorage.removeItem("selfToken");

         navigate('/');

      }

    return (
        <header className="header" >
                    {/* <header className="header" style={{ backgroundImage: "linear-gradient(to right, #00BCD4, #862359)", zIndex : 100 }}> */}

            <div className="nav-container">
                
                <div className="title" >
                <img src={Logo} alt="Logo" width="150px" height="70px" />
                </div>
                <div className="menu-button"  >
                <img className='menu-icon' src={burger} alt="" onClick={onButtonClick} />
               
                </div>
                <h2 className='header-page-title' > {pageTitle}</h2>
                <div style={{ flex:'1 1 0%', boxSizing : 'border-box' }} ></div>

                {/*<div className="settings me-3 rounded position-relative">
                    <span className='k-icon k-i-search position-absolute ps-1'></span>
                    <input type="text" className='search ps-4 pt-2 pb-2' name='search' placeholder='Search...'/>
                </div>
                <div className='notification pe-3'>
                <span className="k-icon k-i-question fs-4"></span>
                </div>
                <div className='notification'>
                <span className="k-icon k-i-bell fs-4"></span>
                </div>
                <Avatar type={'image'} shape={'circle'}>
                    {
                        hasImage ?
                            <img ref={imgRef} src={'#'} alt={'User Avatar'} /> :
                            <img src={userAvatar} alt="user-avatar"/>
                    }
                </Avatar>*/}
               <Avatar type={'image'} shape={'circle'}>
                    {
                        hasImage ?
                            <img ref={imgRef} src={'#'} alt={'User Avatar'} /> :
                            <img src={userAvatar} alt="user-avatar"/>
                    }
                </Avatar>
                <button title="logout"  className='logout me-3' onClick={logout} >
                <span className="k-icon k-i-logout fs-7"></span>
                </button>
            </div>
        </header>
    );
}

Header.displayName = 'Header';
Header.propTypes = {
    page: PropTypes.string,
    onButtonClick: PropTypes.func
};
