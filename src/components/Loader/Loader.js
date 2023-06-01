import React from "react";
import Modal from "../Modal/Modal";

const Loader=(props)=>{

    let loadVisible = props.loading && props.loading


    return (
    <Modal>
        <p style={{display: loadVisible ? 'block' : 'none' }}>
            {/* <div className="globalloader"></div> */}
                <div className="spinner-border" role="status" style={{zIndex:'999'}}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            {/*<div className="globalloader-text">{props.submitting ? 'Saving...' : 'Please wait...'}</div>*/}
        </p>
    </Modal>

    
)
}

export default Loader;