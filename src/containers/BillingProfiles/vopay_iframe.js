import React from "react"
import Iframe from 'react-iframe'
import Modal from '../../components/feedback/modal'


const vopayIframe = (props) => {

    if (props.isModalVisible === true) {
        return (
            <Modal visible={true} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{danger: true}} closable={false} onCancel={props.handleModalCancel} bodyStyle={{height: "600px"}}>
                <Iframe 
                    url={props.vopayURL}
                    width="100%"
                    height="100%"
                    id="billing-iframe"
                    className="vopayIframe"
                    display="initial"
                    position="relative"
                /> 
            </Modal>
        )
    } else {
        return ""
    }

}

export default vopayIframe