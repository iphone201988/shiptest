import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Button} from 'antd';
import HomeLayoutWrapper from '../home.style';
import IntlMessages from "components/utility/intlMessages";
import Card from "../../Uielements/Card/card.style";
import {get_route_path} from "constants/routes";
import ShipperLayoutWrapper from "../Shippers/shipper.style";
import FeatureCardsGrids from "components/presentation/FeatureCard";
import Link from "react-router-dom/Link";

const { Header, Content, Footer} = Layout;

const featureCardConfigs = [
  {
    cardSpanSize: 12,
    imageSpan: 10,
    titleId: "site.carrier.book_freight.title",
    contextTextId: "site.carrier.book_freight.text",
    imageClassName: "FeatureIcon64 QualityMonitoringIcon"
  },
  {
    cardSpanSize: 12,
    titleId: "site.carrier.full_visibility.title",
    contextTextId: "site.carrier.full_visibility.text",
    imageClassName: "FeatureIcon64 MobileNavigationIcon",
  },
  {
    cardSpanSize: 12,
    titleId: "site.carrier.intelligence_optimization.title",
    contextTextId: "site.carrier.intelligence_optimization.text",
    imageClassName: "FeatureIcon64 InnovationIcon",
  },
  {
    cardSpanSize: 12,
    titleId: "site.shipper.advantages.freight_management.title",
    contextTextId: "site.shipper.advantages.freight_management.text",
    imageClassName: "FeatureIcon64 ManagementIcon",
  }
]

class WebCarriers extends Component {

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
              <Header className="headerClass CarrierPageHeaderClass">
                         <div className="CarrierPageOverHeaderClass">
                           <div className="CarrierHeaderTitleWrapper HomeHeaderTitleWrapper" >
                             <h1><IntlMessages id="site.carrier.header.title"/></h1>
                             <h2><IntlMessages id="site.carrier.header.subtitle"/></h2>
                             <div className="CarrierHeaderAction">
                               <div className="section group">
                                 <div className="col span_1_of_2">
                                   <Link to={get_route_path("web", "carrierSignup", locale)}>
                                    <Button size={"large"} type="primary" className="HeaderButton Red1Button">
                                     <IntlMessages id="shipping.join.title" />
                                    </Button>
                                   </Link>
                                 </div>
                                 <div className="col span_1_of_2">
                                   <Link to={get_route_path("web", "contact", locale)}>
                                    <Button size={"large"} type="primary" className="HeaderButton Red1Button">
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
                    <IntlMessages id="site.carrier.features.title"/>
                  </div>
                  <div className="FeatureCardSubTitle">
                    <IntlMessages id="site.carrier.features.text"/>
                  </div>
                  <FeatureCardsGrids cardConfigs={featureCardConfigs}></FeatureCardsGrids>
                </Card>
              </Content>
              <Footer>ShipHaul Inc.</Footer>
            </Layout>
          </ShipperLayoutWrapper>
        </HomeLayoutWrapper>

        // <HomeLayoutWrapper>
        //   <CarrierLayoutWrapper>
        //     <Layout>
        //       <Header className="headerClass CarrierPageHeaderClass">
        //         <div className="CarrierPageOverHeaderClass">
        //           <div className="CarrierHeaderTitleWrapper" >
        //             <h1><IntlMessages id="site.carrier.header.title"/></h1>
        //             <h2><IntlMessages id="site.carrier.header.subtitle"/></h2>
        //             <div className="CarrierHeaderAction">
        //               <div className="section group">
        //                 <div className="col span_1_of_2">
        //                   <Button href={get_route_path("web", "carrierSignup", locale)} size={"large"} size={"large"} type="primary" className="HeaderButton Red1Button">
        //                     <IntlMessages id="shipping.join.title" /></Button>
        //                 </div>
        //                 <div className="col span_1_of_2">
        //                   <Button href={get_route_path("web", "contact", locale)} size={"large"} type="primary" className="HeaderButton Red1Button">
        //                     <IntlMessages id="site.word.contact_us" /></Button>
        //                 </div>
        //               </div>
        //             </div>
        //           </div>
        //         </div>
        //       </Header>
        //
        //       <Content className="contentClass">
        //         <Card bordered={true} hoverable={false}>
        //           <div className="FeatureCardTitle">
        //             <IntlMessages id="site.carrier.advantages.title"/>
        //           </div>
        //           <div className="FeatureCardBody">
        //             {/*Opportunity*/}
        //             <div className="section group">
        //               <div className="col span_1_of_5">
        //                 <div className="FeatureIcon64 OpportunityIcon"/>
        //               </div>
        //               <div className="col span_4_of_5">
        //                 <IntlMessages id="site.carrier.advantages.why_join"/>
        //               </div>
        //             </div>
        //             {/*Visibility / Tracking*/}
        //             <div className="section group">
        //               <div className="col span_1_of_5">
        //                 <div className="FeatureIcon64 TrackingIcon"/>
        //               </div>
        //               <div className="col span_4_of_5">
        //                 <IntlMessages id="site.carrier.advantages.full_visibility"/>
        //               </div>
        //             </div>
        //             {/*Freight Rate*/}
        //             <div className="section group">
        //               <div className="col span_1_of_5">
        //                 <div className="FeatureIcon64 BusinessIcon"/>
        //               </div>
        //               <div className="col span_4_of_5">
        //                 <IntlMessages id="site.carrier.advantages.price"/>
        //               </div>
        //             </div>
        //
        //             {/*Managemennt*/}
        //             <div className="section group">
        //               <div className="col span_1_of_5">
        //                 <div className="FeatureIcon64 TimeMoneyIcon"/>
        //               </div>
        //               <div className="col span_4_of_5">
        //                 <IntlMessages id="site.carrier.advantages.management"/>
        //               </div>
        //             </div>
        //
        //             {/*Mobile App*/}
        //             <div className="section group">
        //               <div className="col span_1_of_5">
        //                 <div className="FeatureIcon64 MobileNavigationIcon"/>
        //               </div>
        //               <div className="col span_4_of_5">
        //                 <IntlMessages id="site.carrier.advantages.mobile_app"/>
        //               </div>
        //             </div>
        //           </div>
        //         </Card>
        //
        //       </Content>
        //       <Footer>ShipHaul Inc.</Footer>
        //     </Layout>
        //   </CarrierLayoutWrapper>
        // </HomeLayoutWrapper>

    );
  }
}

export default connect(
    state => ({
      ...state.App,
      locale: state.LanguageSwitcher.language.locale,
    }),
)(WebCarriers);