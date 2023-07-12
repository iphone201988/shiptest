import React from "react";
import address from "../invoice/address";
import {getSpan} from "../../constants/layout/grids";
import {Col, Row} from "antd";

export const fullAddress = (address) => {
  return (<>
    <div>
      {address?.houseNumber}, {address?.street}
    </div>
    <div>
      {address?.city}, {address?.postalCode}
    </div>
    <div>
      {address?.state}, {address?.country}
    </div>
  </>);
}

export const CompactAddress = (props) => {
  const address = props.address || props.location?.address

  return ( address ?
  <Row>
    <Col flex="auto">
      <span>{address?.houseNumber} </span>
    </Col>
    <Col flex="auto">
      <span>{address?.street} </span>
    </Col>
    <Col flex="auto">
      <span>{address?.city}, </span>
    </Col>
    <Col flex="auto">
      <span>{address?.state}, </span>
    </Col>
    <Col flex="auto">
      <span>{address?.postalCode} </span>
    </Col>
  </Row> : ''
  )

}