import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, Button} from 'antd';
import HomeLayoutWrapper from '../home.style';
import ShipperLayoutWrapper from './about.style';
import IntlMessages from "components/utility/intlMessages";
import Card from "../../Uielements/Card/card.style";
import {get_route_path} from "constants/routes";
import Link from "react-router-dom/Link";

const { Header, Content } = Layout;

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
              <Header className="headerClass AboutPageHeaderClass">
                <div className="AboutPageOverHeaderClass">
                  <div className="AboutHeaderTitleWrapper HomeHeaderTitleWrapper" >
                    <h1><IntlMessages id="site.about.header.title"/></h1>
                    <h2><IntlMessages id="site.about.header.subtitle"/></h2>

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
                          <Button href={get_route_path("web", "contact", locale)} size={"large"} type="primary" className="HeaderButton Red1Button">
                            <IntlMessages id="site.word.contact_us" /></Button>
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
                  <IntlMessages id="site.about.mission.title"/>
                </div>
                <div className="FeatureCardBody">
                  <IntlMessages id="site.about.mission.text"/>
                </div>
              </Card>
              <Card  bordered={true} hoverable={false}>
                <div className="FeatureCardTitle">
                  <IntlMessages id="site.about.values.title"/>
                </div>
                <div className="FeatureCardBody">
                  <IntlMessages id="site.about.values.text"/>
                  <br/>

                  <Row type="flex" justify="center" align="middle">
                    <Col span={3}><div className="FeatureIcon64 InnovationIcon"/></Col>
                    <Col span={21}> <IntlMessages id="site.about.values.value1"/></Col>
                  </Row>

                  <Row type="flex" justify="center" align="middle">
                    <Col span={3}><div className="FeatureIcon64 WinWinIcon"/></Col>
                    <Col span={21}> <IntlMessages id="site.about.values.value2"/></Col>
                  </Row>

                  <Row type="flex" justify="center" align="middle">
                    <Col span={3}><div className="FeatureIcon64 GreatUserExperienceIcon"/></Col>
                    <Col span={21}> <IntlMessages id="site.about.values.value3"/></Col>
                  </Row>

                  <Row type="flex" justify="center" align="middle">
                    <Col span={3}><div className="FeatureIcon64 QualityIcon"/></Col>
                    <Col span={21}> <IntlMessages id="site.about.values.value4"/></Col>
                  </Row>


                    {/*<li><IntlMessages id="site.about.values.value2"/></li>*/}
                    {/*<li><IntlMessages id="site.about.values.value3"/></li>*/}
                    {/*<li><IntlMessages id="site.about.values.value4"/></li>*/}


                </div>
              </Card>
              {/*<Card  bordered={true} hoverable={false}>*/}
              {/*  <div className="FeatureCardTitle">*/}
              {/*    <IntlMessages id="site.about.research_partners.title"/>*/}
              {/*  </div>*/}
              {/*  <div className="FeatureCardBody">*/}
              {/*    <IntlMessages id="site.about.research_partners.text"/>*/}
              {/*  </div>*/}
              {/*</Card>*/}

              <Card  bordered={true} hoverable={false}>
                <div className="FeatureCardTitle">
                  <IntlMessages id="site.about.company.title"/>
                </div>
                <div className="FeatureCardBody">
                  <IntlMessages id="site.about.company.text"/>
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