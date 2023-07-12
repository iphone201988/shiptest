import React from "react";
import {injectIntl, intlShape} from "react-intl";
import {Col, Row} from 'antd';
import {DescriptionItem} from "helpers/views/elements";
import Card from "containers/Uielements/Card/card.style";


class CompanyIntegrationDetails extends React.Component {

    render() {
        const {integration} = this.props

        // console.log('integrations...',integration)

        if (integration === null){
            return (<div></div>)
        }
        return <div>
                    <Card title={this.props.intl.formatMessage({id: 'general.identification'})}>
                        <Row>
                            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                                <DescriptionItem title={this.props.intl.formatMessage({id: "general.provider"})}
                                                        content={`${integration.provider}`} />
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                                <DescriptionItem title={this.props.intl.formatMessage({id: 'general.type'})}
                                                            content={`${integration.category}`} />
                            </Col>
                        </Row>
                    </Card>
            </div>
    }
}

CompanyIntegrationDetails.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(CompanyIntegrationDetails)