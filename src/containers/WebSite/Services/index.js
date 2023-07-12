import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, Button} from 'antd';
import HomeLayoutWrapper from '../home.style';
import ShipperLayoutWrapper from './services.style';
import IntlMessages from "components/utility/intlMessages";
import Card from "../../Uielements/Card/card.style";
import {get_route_path} from "constants/routes";

const { Header, Content, Footer} = Layout;

class WebShippers extends Component {

  INITIAL_STATE = {}
  constructor(props) {
    super(props);
    this.state = { ... this.INITIAL_STATE};
  }


  render() {
    const {locale} = this.props

    return (

        <HomeLayoutWrapper>
          <ShipperLayoutWrapper>
            <Layout>
              <Header className="headerClass ServicesPageHeaderClass">
                <div className="ServicesPageOverHeaderClass">
                  <div className="ServicesHeaderTitleWrapper" >
                    <h1><IntlMessages id="site.services.trucking.header.title"/></h1>
                    {/*<h2><IntlMessages id="site.services.trucking.header_subtitle"/></h2>*/}

                    <div className="ShipperHeaderAction">
                      <div className="section group">
                        <div className="col span_1_of_2">
                          <Button href={get_route_path("web", "shipperSignup", locale)} size={"large"} type="primary" className="HeaderButton Red1Button">
                            <IntlMessages id="shipping.join.title" /></Button>
                        </div>
                        <div className="col span_1_of_2">
                          <Button href={get_route_path("web", "contact", locale)} size={"large"} type="primary" className="HeaderButton Red1Button">
                            <IntlMessages id="site.word.contact_us" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Header>


            <Content className="contentClass">

              <Card  bordered={true} hoverable={false}>
                <div className="FeatureCardTitle">
                  <IntlMessages id="site.services.introduction.title"/>
                </div>
                <div className="FeatureCardBody">
                  <IntlMessages id="site.services.introduction.text"/>
                </div>
              </Card>
            </Content>

          </Layout>
          </ShipperLayoutWrapper>
        </HomeLayoutWrapper>

    );
  }
}

export default connect(
    state => ({
      ...state.App,
      locale: state.LanguageSwitcher.language.locale,
    }),
)(WebShippers);