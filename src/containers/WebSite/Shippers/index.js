import React, { Component } from "react";
import {injectIntl, intlShape}  from "react-intl";
import { Layout, Button} from 'antd';
import HomeLayoutWrapper from '../home.style';
import ShipperLayoutWrapper from './shipper.style';
import IntlMessages from "components/utility/intlMessages";
import FeatureCardsGrids from "components/presentation/FeatureCard";
import Card from "../../Uielements/Card/card.style";
import {get_route_path} from "constants/routes";
import {compose} from "redux";
import Link from "react-router-dom/Link";

const { Header, Content, Footer} = Layout;

const featureCardConfigs = [
    {
      cardSpanSize: 12,
      imageSpan: 10,
      titleId: "site.shipper.advantages.freight_matching.title",
      contextTextId: "site.shipper.advantages.freight_matching.text",
      imageClassName: "FeatureIcon64 QualityMonitoringIcon"
    },
    {
      cardSpanSize: 12,
      titleId: "site.shipper.advantages.full_visibility.title",
      contextTextId: "site.shipper.advantages.full_visibility.text",
      imageClassName: "FeatureIcon64 MobileNavigationIcon",
    },
    {
      cardSpanSize: 12,
      titleId: "site.shipper.advantages.intelligence_optimization.title",
      contextTextId: "site.shipper.advantages.intelligence_optimization.text",
      imageClassName: "FeatureIcon64 InnovationIcon",
    },
    {
      cardSpanSize: 12,
      titleId: "site.shipper.advantages.freight_management.title",
      contextTextId: "site.shipper.advantages.freight_management.text",
      imageClassName: "FeatureIcon64 ManagementIcon",
    },
  {
    cardSpanSize: 12,
    titleId: "site.shipper.advantages.pricing.title",
    contextTextId: "site.shipper.advantages.pricing.text",
    imageClassName: "FeatureIcon64 MarketPriceIcon",
  }
]

class WebShippers extends Component {

  INITIAL_STATE = {}
  constructor(props) {
    super(props);
    this.state = {...this.INITIAL_STATE};
  }


  render() {
    const {locale} = this.props

    return (

        <HomeLayoutWrapper>
          <ShipperLayoutWrapper>
            <Layout>
              <Header className="headerClass ShippingPageHeaderClass">
                <div className="ShippingPageOverHeaderClass">
                  <div className="HomeHeaderTitleWrapper" >
                    <h1><IntlMessages id="site.shipping.header_title"/></h1>
                    <h2><IntlMessages id="site.shipping.header_subtitle"/></h2>

                    <div className="ShipperHeaderAction">
                      <div className="section group">
                        <div className="col span_1_of_2">
                          <Link to={get_route_path("web", "shipperSignup", locale)}>
                            <Button href={get_route_path("web", "shipperSignup", locale)} size={"large"} type="primary" className="HeaderButton Red1Button">
                              <IntlMessages id="shipping.join.title" />
                            </Button>
                          </Link>
                        </div>
                        <div className="col span_1_of_2">
                          <Link to={get_route_path("web", "contact", locale)}>
                            <Button  size={"large"} type="primary" className="HeaderButton Red1Button">
                              <IntlMessages id="site.word.contact_us" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Header>


            <Content className="contentClass">

              <Card  bordered={true} hoverable={false}>

                <div className="FeatureCardTitle">
                  <IntlMessages id="site.shipper.features.title"/>
                </div>
                <div className="FeatureCardSubTitle">
                  <IntlMessages id="site.shipper.features.text"/>
                </div>
                <FeatureCardsGrids cardConfigs={featureCardConfigs}></FeatureCardsGrids>
              </Card>
            </Content>
            <Footer>ShipHaul Inc.</Footer>
          </Layout>
          </ShipperLayoutWrapper>
        </HomeLayoutWrapper>

    );
  }
}

WebShippers.propTypes = {
  intl: intlShape.isRequired
}

export default compose()(injectIntl(WebShippers))

// export default connect(
//     state => ({
//       ...state.App,
//       locale: state.LanguageSwitcher.language.locale,
//     }),
// )(WebShippers);