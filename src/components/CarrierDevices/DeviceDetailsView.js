import React from "react";
import {injectIntl, intlShape} from "react-intl";
import Card from "containers/Uielements/Card/card.style";
import {Col, Row} from 'antd';
import {DescriptionItem} from "helpers/views/elements";


class DeviceDetailsView extends React.Component {

    render() {
        const {device} = this.props

        // console.log('i m device',device);
        
        if (device === null){
            return (<div></div>)
        }
        return <div>
        <Card title={this.props.intl.formatMessage({id: 'general.identification'})}>
            <Row>
                <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                        <DescriptionItem title={this.props.intl.formatMessage({id: 'general.name'})}
                                                         content={`${device.profile.name}`} />
                </Col>
                <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                    <DescriptionItem title={this.props.intl.formatMessage({id: "general.model"})}
                                                     content={`${device.profile.model}`} />
                </Col>
                <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                    <DescriptionItem title={this.props.intl.formatMessage({id: "general.type"})}
                                                     content={`${device.device_type}`} />
                </Col>
            </Row>
            <Row>
                <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                    <DescriptionItem title={this.props.intl.formatMessage({id: 'general.device.provider'})}
                                                     content={`${device.profile.provider.provider}`} />
                </Col>
                <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                    <DescriptionItem title={this.props.intl.formatMessage({id: 'general.status'})}
                                                     content={`${device.status}`} />
                </Col>
                {/* <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                    <DescriptionItem title={this.props.intl.formatMessage({id: 'general.temperature'})}
                                                     content={`${device.track_data.temperature}`} />
                </Col> */}
            </Row>
        </Card>
    </div>
    }
}

DeviceDetailsView.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(DeviceDetailsView)