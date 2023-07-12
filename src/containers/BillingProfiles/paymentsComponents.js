import React from "react";
import Card from "containers/Uielements/Card/card.style";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";
import IntlMessages from "components/utility/intlMessages";

export const  BankAccountContent= (props) => {
  const { payment_account } = props
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={8}>Bank Name</Col>
        <Col span={16}>{payment_account?.bank_name}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>Account Holder</Col>
        <Col span={16}>{payment_account?.account_holder_name}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>Account Number</Col>
        <Col span={16}>*****{payment_account?.last4}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>Country</Col>
        <Col span={16}>{payment_account?.country}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>Currency</Col>
        <Col span={16}>{payment_account?.currency}</Col>
      </Row>
    </>
  )
}

export const  CardAccountContent = (props) => {
  const { payment_account } = props
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={8}><IntlMessages id={"payment_method.brand"}></IntlMessages></Col>
        <Col span={16}>{payment_account?.brand}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}><IntlMessages id={"payment_method.account_number"}></IntlMessages></Col>
        <Col span={16}>*****{payment_account?.last4}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}><IntlMessages id={"payment_method.expiration"}></IntlMessages></Col>
        <Col span={16}>{payment_account?.exp_month} / {payment_account?.exp_year}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}><IntlMessages id={"payment_method.country"}></IntlMessages></Col>
        <Col span={16}>{payment_account?.country}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}><IntlMessages id={"payment_method.currency"}></IntlMessages></Col>
        <Col span={16}>{payment_account?.currency}</Col>
      </Row>
    </>
  )
}


export const PaymentMethodCard = (props) => {

  const { payment_account } = props
  const type = payment_account?.object
  let content = ''
  let title = ''
  if (type === 'bank_account'){
    content = <BankAccountContent payment_account={payment_account}/>
    title = <IntlMessages id={"payment.bank_account.name"}></IntlMessages>

  }else if (type === 'card'){
    content = <CardAccountContent payment_account={payment_account}/>
    title = <IntlMessages id={"payment_method.Card"}></IntlMessages>
  }

  return payment_account ?
    <Card title={title}>
      {content}
    </Card>
      : ''
}