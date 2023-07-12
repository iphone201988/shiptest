import React from 'react';
import { Col, Row } from 'antd/es/grid/';
import { DescriptionItem } from "helpers/views/elements";

export function renderDetails(company, LanguageFormatMessage) {
  const profile = company.profile;
  const companyName = profile.name;
  const companyEmail = profile.email;
  const companyPhone = profile.phone;
  const companyWebsite = profile.website;
  let companyAddress ;
  
  if(profile.address.address.label && profile.address.address.postalCode){
    companyAddress = `${profile.address.address.label}, ${profile.address.address.postalCode} `;
  } else {
    companyAddress = "" ;
  }

  // const formInputs = {
  // 		form_type: "regular",
  // 		submit_label: this.props.intl.formatMessage({id:"general.update"}),
  // 		formProps:{
  // 			layout: "horizontal",
  // 		},
  // 		sections: [
  // 			{
  // 			key: "company_detail",
  // 			title: this.props.intl.formatMessage({id:"general.company_detail"}),
  // 			type: "detail",
  // 			groups: [
  // 				{
  // 				name: "company_detail",
  // 				wrapperCol: {...getSpan(24)},
  // 				groupWrapper:{
  // 					type: "box",
  // 				},
  // 				items: [
  // 							{
  // 							  name: "company_name",
  // 							  type: "textField",
  // 							  formItemProps:{
  // 								  label : this.props.intl.formatMessage({id:"company.name"}),
  // 								  labelCol: UserDetailFormItemLabelCol,
  // 								  wrapperCol: UserDetailFormItemWrapperCol,
  // 								  initialValue: companyName,
  // 							  },
  // 							  fieldProps:{
  // 							  },
  // 							  wrapperCol: UserDetailWrapperCol
  // 							},
  // 							{
  // 								name: "company_email",
  // 								type: "textField",
  // 								formItemProps:{
  // 									label : this.props.intl.formatMessage({id:"company.email"}),
  // 									labelCol: UserDetailFormItemLabelCol,
  // 									wrapperCol: UserDetailFormItemWrapperCol,
  // 									initialValue: companyEmail
  // 								},
  // 								fieldProps:{
  // 									disabled: true
  // 								},
  // 								wrapperCol: UserDetailWrapperCol
  // 							},
  // 							{
  // 								name: "company_phone",
  // 								type: "textField",
  // 								formItemProps:{
  // 									label : this.props.intl.formatMessage({id:"company.phone"}),
  // 									labelCol: UserDetailFormItemLabelCol,
  // 									wrapperCol: UserDetailFormItemWrapperCol,
  // 									initialValue: companyPhone
  // 								},
  // 								fieldProps:{
  // 									disabled: true
  // 								},
  // 								wrapperCol: UserDetailWrapperCol
  // 							},
  //               {
  // 								name: "company_address",
  // 								type: "textField",
  // 								formItemProps:{
  // 									label : this.props.intl.formatMessage({id:"company.address"}),
  // 									labelCol: UserDetailFormItemLabelCol,
  // 									wrapperCol: UserDetailFormItemWrapperCol,
  // 									initialValue: companyAddress
  // 								},
  // 								fieldProps:{
  // 									disabled: true
  // 								},
  // 								wrapperCol: UserDetailWrapperCol
  // 							},
  //               {
  // 								name: "company_website",
  // 								type: "textField",
  // 								formItemProps:{
  // 									label : this.props.intl.formatMessage({id:"company.website"}),
  // 									labelCol: UserDetailFormItemLabelCol,
  // 									wrapperCol: UserDetailFormItemWrapperCol,
  // 									initialValue: companyWebsite
  // 								},
  // 								fieldProps:{
  // 									disabled: true
  // 								},
  // 								wrapperCol: UserDetailWrapperCol
  // 							}
  // 						]
  // 					}
  // 				]
  // 			}
  // 		]
  // 	}

  return (
    <div>
      {profile ?
        <Row>
          <Col xs={6} sm={8} md={8} lg={6} xl={6}>
            {companyName ?
              <DescriptionItem title={LanguageFormatMessage({ id: 'general.company_name' })}
                content={`${companyName}`} DescriptionItem /> : ""}
          </Col>
      <Row>

          <Col xs={10} sm={10} md={10} lg={6} xl={6}>
            {companyAddress ?
              <DescriptionItem title={LanguageFormatMessage({ id: 'general.company_address' })}
              content={`${companyAddress}`} DescriptionItem /> : ""
            }
          </Col>

      </Row>
          <Col xs={6} sm={8} md={8} lg={6} xl={6}>
            {companyPhone ?
              <DescriptionItem title={LanguageFormatMessage({ id: 'general.company_phone' })}
                content={`${companyPhone}`} DescriptionItem /> : ""
            }
          </Col>

          <Col xs={6} sm={8} md={8} lg={6} xl={6}>
            {companyEmail ?
              <DescriptionItem title={LanguageFormatMessage({ id: 'general.company_email' })}
                content={`${companyEmail}`} DescriptionItem /> : ""
            }
          </Col>

          <Col xs={6} sm={8} md={8} lg={6} xl={6}>
            {companyWebsite ?
              <DescriptionItem title={LanguageFormatMessage({ id: 'general.company_website' })}
                content={`${companyWebsite}`} DescriptionItem /> : ""
            }
          </Col>

        </Row> :
        //* Other half of if statement.
        <div>
          No profile from CompanyComponents
        </div>

      }
    </div>
  )
}
