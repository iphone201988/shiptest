import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout } from 'antd';
import HomeLayoutWrapper from '../home.style';
import ContactLayoutWrapper from './contact.style';
import IntlMessages from "components/utility/intlMessages";
import Card from "../../Uielements/Card/card.style";


const { Header, Content } = Layout;

class ContactPage extends Component {

  INITIAL_STATE = {}
  constructor(props) {
    
    super(props);
    this.state = {...this.INITIAL_STATE};
  }


  render() {

    return (

        <HomeLayoutWrapper>
          <ContactLayoutWrapper>
            <Layout>
              <Header className="headerClass ContactPageHeaderClass"  >
                <div className="ContactPageOverHeaderClass">
                  <div className="ContactHeaderTitleWrapper HomeHeaderTitleWrapper" >
                    <h1><IntlMessages id="site.contact.header.title"/></h1>
                  </div>
                </div>
              </Header>


            <Content className="contentClass" style="top-margin:25px" >

              <Card  bordered={true} hoverable={false}>
                <div className="FeatureCardTitle">
                  <IntlMessages id="site.contact.information.title"/>
                </div>
                <div className="FeatureCardBody">
                  <IntlMessages id="site.contact.information.intro.title"/>
                  <Card bordered={false}>
                    <p><IntlMessages id="site.contact.information.ceo.line1"/></p>
                    <IntlMessages id="site.contact.information.ceo.line2"/>
                    <p><a href="tel:+15147160585">514-716-0585</a> | <a href="mailto:info@shiphaul.com">info@shiphaul.com</a></p>
                  </Card>
                </div>
              </Card>
            </Content>

          </Layout>
          </ContactLayoutWrapper>
        </HomeLayoutWrapper>

    );
  }
}

export default connect(
    state => ({
      ...state.App,
      locale: state.LanguageSwitcher.language.locale,
    }),
)(ContactPage);