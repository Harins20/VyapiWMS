import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';


const Modal = (props) => {

    const [isVisible,setIsVisible] = useState(false);

    console.log('modal');
    console.log(props);


    let back = e => {
        e.stopPropagation();
        console.log('modal closed')
        // props.history.goBack()
    };


    return(

        ReactDOM.createPortal(
            <React.Fragment>
                <div id="overlay"></div>
                <div role="dialog" tabIndex={`-1`} id="modal">
                {props.children}
                </div>
            </React.Fragment>, document.body
        )
    )
}
export default Modal;
