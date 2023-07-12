import {injectIntl, intlShape} from "react-intl";
import React, {PureComponent} from "react";
import Form from "../uielements/form";
import {Row, Col} from 'antd';
import AddressInput from "../Location/address_input";
import Button from "../uielements/button";
import InputNumber from "../uielements/InputNumber";
import IntlMessages from "components/utility/intlMessages";
import {Box} from "./filter.style";
import {Location} from "model/location/location";

class QuoteRequestFilter extends PureComponent {

    INITIAL_STATE = {
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }

    onSubmit = (e) => {
        if (this.props.handleSubmit){
            this.props.handleSubmit(e)
        }
    }

    onOriginLocationSelect = (val) => {
        if (this.props.onOriginLocationSelect){
            if (val instanceof Location || !val){
                this.props.onOriginLocationSelect(val)
            }
        }
    }

    onDestinationLocationSelect = (val) => {
        if (this.props.onDestinationLocationSelect){
            if (val instanceof Location){
                this.props.onDestinationLocationSelect(val)
            }
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Box>
                <Form onSubmit={this.props.handleSubmit}>
                    <Row type="flex"  align="middle">
                        <Col span={12} xs={12} sm={12} md={12} lg={8} xl={4}>
                            {/*<Form.Item label={this.props.intl.formatMessage({id:"general.address_origin"})}>*/}
                                <div className="isoInputWrapper">
                                    <AddressInput
                                        label={this.props.intl.formatMessage({id:"general.address_origin"})}
                                        onSelect={this.onOriginLocationSelect}
                                        Value={this.props.originLocation}
                                        placeholderMessageId={"general.address_origin"}>
                                    </AddressInput>
                                </div>
                        </Col>
                        <Col span={12} xs={12} sm={12} md={12} lg={8} xl={4}>
                            <Form.Item label={this.props.intl.formatMessage({id:"general.distance"})}>
                                    <div className="isoInputWrapper">
                                        <InputNumber
                                            label={this.props.intl.formatMessage({id:"general.distance"})}
                                            min={0}
                                            onChange={this.onOriginRadiusSelect}
                                            value={this.props.originRadius}
                                            placeholder={this.props.intl.formatMessage({id: "general.distance"})}
                                        />
                                    </div>
                            </Form.Item>
                        </Col>
                        <Col span={12} xs={12} sm={12} md={12} lg={8} xl={4}>

                                    <div className="isoInputWrapper">
                                        <AddressInput onSelect={this.onDestinationLocationSelect}
                                                      label={this.props.intl.formatMessage({id:"general.address_destination"})}
                                                      Value={this.props.destinationLocation}
                                                      placeholderMessageId={"general.address_destination"}>
                                        </AddressInput>
                                    </div>
                        </Col>
                        <Col span={12} xs={12} sm={12} md={12} lg={8} xl={4}>
                            <Form.Item label={this.props.intl.formatMessage({id:"general.distance"})}>
                                {getFieldDecorator('destinationRadius', {
                                })(
                                    <div className="isoInputWrapper">
                                        <InputNumber
                                            min={0}
                                            value={this.props.destinationRadius}
                                            onChange={this.onDestinationRadiusSelect}
                                            placeholder={this.props.intl.formatMessage({id: "general.distance"})}
                                        />
                                    </div>
                                )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={12} xs={12} sm={12} md={12} lg={8} xl={4}>
                            <div style={{padding: "20px"}}>
                                <Button type="primary" htmlType="submit">
                                    <IntlMessages id="general.search" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Box>

       )
    }


}

QuoteRequestFilter.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(QuoteRequestFilter);

