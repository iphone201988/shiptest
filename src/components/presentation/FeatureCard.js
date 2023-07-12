import React, {PureComponent} from "react";
import {injectIntl, intlShape}  from "react-intl";
import Card from "containers/Uielements/Card/card.style";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";
import IntlMessages from "components/utility/intlMessages";
import {getSpan} from "constants/layout/grids";

class FeatureCardsGrids extends PureComponent{

//   constructor(props) {
//       super(props);
//   }

  render(){
      const gutter = this.props.gutter || [16, 16]
    //   const contentLeft = this.props.contentLeft || 8
    //   const contentRight = this.props.contentRight || 16

      const cards = (this.props.cardConfigs || []).map(config => {
          try{
              const titleId = this.props.intl.formatMessage({id: config.titleId || ""})
              const contextTextId = config.contextTextId || ""
              const imageClassName = config.imageClassName || ""
              const headStyle = config.headStyle || {fontSize:"1.6em"}
              const bodyStyle = config.bodyStyle || {fontSize:"1.2em"}
              const cardSpanSize = config.cardSpanSize || 8
              const cardSpan = getSpan(cardSpanSize)

            //   const imagePosition = config.imagePosition || "left"
              const imageSpan = config.ImageSpan || 8
              const contentSpan = 24 - imageSpan


              return <Col xs={cardSpan.xs} sm={cardSpan.sm} md={cardSpan.md} lg={cardSpan.lg} xl={cardSpan.xl}>
                  <Card title={titleId} headStyle={headStyle} bodyStyle={bodyStyle}>
                      <Row>
                          <Col span={imageSpan}><div className={imageClassName}/></Col>
                          <Col span={contentSpan}><IntlMessages id={contextTextId}/></Col>
                      </Row>
                  </Card>
              </Col>
          }catch(e){
              return ""
          }
      })
      return <Row gutter={gutter}>{cards}</Row>
  }
}

FeatureCardsGrids.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(FeatureCardsGrids)


