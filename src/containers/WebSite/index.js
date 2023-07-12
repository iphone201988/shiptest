import React, { Component } from "react";
import {injectIntl, intlShape} from "react-intl";
import { connect } from "react-redux";
import { Layout, Button} from 'antd';
import { Link } from "react-router-dom";
import HomeLayoutWrapper from './home.style';
import IntlMessages from "components/utility/intlMessages";
import {get_route_path} from "constants/routes";


const { Header, Content, Footer} = Layout;


class WebHome extends Component {


  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE};
  }

  render() {
    const {locale} = this.props

    return (

        <HomeLayoutWrapper>
          <Layout>
            <Header className="headerClass HomePageHeaderClass">
              <div className="HomePageOverHeaderClass">
                <div className="HomeHeaderTitleWrapper" >
                  <h1><IntlMessages id="site.home.title.line1"/></h1>
                  <h2><IntlMessages id="site.home.title.line2"/></h2>
                  <div className="HomeHeaderAction">
                    <div className="section group">
                      <div className="col span_1_of_2">
                        <Link to={get_route_path("web", "shippers", locale)}>
                          <Button size={"large"} type="primary" className="HeaderButton Red1Button">
                            <IntlMessages id="site.home.ship_freight"/>
                          </Button>
                        </Link>
                      </div>
                      <div className="col span_1_of_2">
                        <Link to={get_route_path("web", "carriers", locale)}>
                          <Button size={"large"}
                                  type="primary" className="HeaderButton Red1Button">
                            <IntlMessages id="site.haul_freight" />
                          </Button>
                        </Link>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </Header>
            <Content className="contentClass">

              {/*<Card bordered={true} hoverable={false}>*/}
                {/*<div className="FeatureCardTitle">*/}
                  {/*<IntlMessages id="site.home.introduction.title"/>*/}
                {/*</div>*/}
                {/*<div className="FeatureCardBody">*/}
                  {/*<IntlMessages id="site.home.introduction.text"/>*/}
                {/*</div>*/}
              {/*</Card>*/}

              <div className="section section1">
                <div className="section group">
                  <div className="col span_1_of_2">
                    <div className="FeatureCardTitle">
                      <IntlMessages id="site.home.shippers.title"/>
                    </div>
                    <div className="FeatureCardBody">
                      <div className="content_shipper_image1"/>
                      <div className="FeatureCardBodyText">
                        <IntlMessages id="site.home.shipper.title.line1"/>
                      </div>
                      <Link to={get_route_path("web", "shippers", locale)}>
                        <Button size={"large"} type="primary" className="HeaderButton Red1Button">
                          <IntlMessages id="general.learn_more"/>
                        </Button>
                      </Link>

                      {/* Disabled -  SHIPPER FEATURES ACCORDION*/}

                      {/*<Collapse accordion>*/}
                      {/*  <Panel*/}
                      {/*    header={<IntlMessages id="site.home.shipper.features.freight_service.title" />}*/}
                      {/*    key="freight_service"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.shipper.features.freight_service.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={<IntlMessages id="site.home.shipper.features.tracking.title" />}*/}
                      {/*      key="tracking"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.shipper.features.tracking.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.shipper.features.manage.title" />}*/}
                      {/*      key="manage"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.shipper.features.manage.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.shipper.features.document.title" />}*/}
                      {/*      key="document"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.shipper.features.document.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.shipper.features.quotes.title" />}*/}
                      {/*      key="quote"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.shipper.features.quotes.text" /></p>*/}
                      {/*  </Panel>*/}
                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.shipper.features.payments.title" />}*/}
                      {/*      key="payment"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.shipper.features.payments.text" /></p>*/}
                      {/*  </Panel>*/}
                      {/*</Collapse>*/}

                    </div>

                  </div>
                  <div className="col span_1_of_2">
                    <div className="FeatureCardTitle">
                      <IntlMessages id="site.home.carriers.title"/>
                    </div>
                    <div className="FeatureCardBody">
                      <div className="content_carrier_image1"/>
                      <div className="FeatureCardBodyText">
                        <IntlMessages id="site.home.carrier.text.paragraph1"/>
                      </div>
                      <Link to={get_route_path("web", "carriers", locale)}>
                        <Button size={"large"} type="primary" className="HeaderButton Red1Button">
                          <IntlMessages id="general.learn_more"/>
                        </Button>
                      </Link>
                      {/* CARRIER FEATURES ACCORDION*/}
                      {/*<Collapse accordion>*/}

                      {/*  <Panel*/}
                      {/*      header={<IntlMessages id="site.home.carrier.features.freight_service.title" />}*/}
                      {/*      key="freight_services"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.carrier.features.freight_service.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={<IntlMessages id="site.home.carrier.features.tracking.title" />}*/}
                      {/*      key="tracking"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.carrier.features.tracking.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.carrier.features.manage.title" />}*/}
                      {/*      key="manage"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.carrier.features.manage.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.carrier.features.document.title" />}*/}
                      {/*      key="document"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.carrier.features.document.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.carrier.features.quotes.title" />}*/}
                      {/*      key="quotes"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.carrier.features.quotes.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.carrier.features.payments.title" />}*/}
                      {/*      key="payments"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.carrier.features.payments.text" /></p>*/}
                      {/*  </Panel>*/}

                      {/*  <Panel*/}
                      {/*      header={ <IntlMessages id="site.home.carrier.features.driver_app.title" />}*/}
                      {/*      key="payments"*/}
                      {/*  >*/}
                      {/*    <p><IntlMessages id="site.home.carrier.features.driver_app.text" /></p>*/}
                      {/*  </Panel>*/}
                      {/*</Collapse>*/}

                    </div>
                  </div>
                </div>
              </div>
            </Content>

            <Footer> <IntlMessages id="site.home.disclaimer"/></Footer>
          </Layout>
        </HomeLayoutWrapper>

    );
  }
}

WebHome.propTypes = {
  intl: intlShape.isRequired
};

export default connect(
    state => ({
      ...state.App,
      locale: state.LanguageSwitcher.language.locale,
    }),
)(injectIntl(WebHome))


