import React from "react";
import { FormattedMessage } from 'react-intl';
import { getLocalTimeFromEpoch } from "helpers/data/format";
import { dateFormat, dateTimeFormat, timeFormat } from "constants/variables";
import { DurationTimeString, secondsToTimeDict } from "helpers/data/datetime";
import Steps from '../uielements/steps';
import IntlMessages from "components/utility/intlMessages";
import ReactDOM from 'react-dom'
import { Col, Row } from 'antd/es/grid/';
import { DescriptionItem } from "helpers/views/elements";
import { DescriptionView } from "helpers/views/description";
import { Capitalize } from "helpers/data/string";
import { Space, Table } from 'antd';
import CustomTable from "../../containers/DataGrid/customTable";
import {
    shipment_handling_units,
    get_freight_type,
    get_packaging_type,
    get_trailer_length,
    get_trailer_type
} from "constants/options/shipping";
// import ShipmentDeliveryCell from "./ShipmentShowMore"
//eslint-disable-next-line
import Box from "components/utility/box";
import Map from "../HereMaps/base_map"
import { ShipmentLocation } from "model/shipment/baseShipment";
//eslint-disable-next-line
import SonarSignal from "../Sonar/sonar_signal";
import PDFGenerator from "./invoicePDF"
import "./invoiceStyle.css"
// const { Column, ColumnGroup } = Table;


export function renderInvoiceDataView(invoice, LanguageFormatMessage, { showTotalDetails = false,
    showType = false, showName = false, showPayitems = false, showInvoiceNumber = false, showInvoiceDates = false, showInvoiceStatus = false, showIssuerAccount = false, showRecipientAccount = false, showShipmentInfo = false, showInvoiceDueDates = false, showBalance = false } = {}) {
    console.log(invoice, "LLLLLLL");
    const invoice_amount = showPayitems && invoice?.amount
    const invoice_total = showTotalDetails && invoice?.amount
    const invoice_name = showName && invoice?.type
    const invoice_num = showInvoiceNumber && invoice?.invoice_number
    const invoice_dates = showInvoiceDates && invoice?.dates
    const invoice_status = showInvoiceStatus && invoice?.invoice_status
    const invoice_issuer_profle = showIssuerAccount && invoice?.issuer_account
    const invoice_recipient_profle = showRecipientAccount && invoice?.recipient_account
    const invoice_type = showType && invoice?.type
    const payItems = invoice?.amount?.invoice_line_items
    const data_item = [{amount_excluding_tax:11},{amount_excluding_tax:111},{amount_excluding_tax:11}]
    const subtotalData = data_item.reduce((accumulator, item) => accumulator + item.amount_excluding_tax, 0);
    const tex = [
        {
            amount: 10,
            name: "pen",
            description: "red",
            rate: "2%"
        }, {
            amount: 12,
            name: "pencil",
            description: "black",
            rate: "5%"
        },
        {
            amount: 10,
            name: "pen",
            description: "red",
            rate: "2%"
        },
        {
            amount: 10,
            name: "pen",
            description: "red",
            rate: "2%"
        },
        {
            amount: 10,
            name: "pencil",
            description: "red",
            rate: "5%"
        },{
            
            amount: 10,
            name: "pencil",
            description: "red",
            rate: "3%"
        }
    ];

    const dis = [
        {
            amount: 10,
            name: "bottle",
            description: "red",
            rate: "2%"
        }, {
            amount: 12,
            name: "book",
            description: "black",
            rate: "5%"
        },
        {
            amount: 10,
            name: "bottle",
            description: "red",
            rate: "2%"
        },
        {
            amount: 15,
            name: "bottle",
            description: "red",
            rate: "2%"
        },
        {
            amount: 10,
            name: "book",
            description: "red",
            rate: "5%"
        },{
            
            amount: 10,
            name: "towel",
            description: "red",
            rate: "3%"
        }
    ];

    const Unique_taxes =  Object.values(dis.reduce((accumulator, obj) => {
        const key = obj.name; 
      
        if (!accumulator[key]) {
          accumulator[key] = {
            totalAmount: 0,
            name:obj.name,
            rate:obj.rate
          };
        }
        accumulator[key].totalAmount += obj.amount;
        return accumulator;
      }, {}));
      const  taxes_total = Unique_taxes.reduce((accumulator, item) => accumulator + item.totalAmount, 0);

      const Unique_discounts =  Object.values(tex.reduce((accumulator, obj) => {
        const key = obj.name; 
      
        if (!accumulator[key]) {
          accumulator[key] = {
            totalAmount: 0,
            name:obj.name,
            rate:obj.rate
          };
        }
        accumulator[key].totalAmount += obj.amount;
        return accumulator;
      }, {}));
      

         
            const discountData = invoice?.amount?.discounts
            const discount_total = Unique_discounts.reduce((accumulator, item) => accumulator + item.totalAmount, 0);
            const amount = taxes_total -  discount_total
            const total_total = subtotalData - amount
           

            const columns = [
                {
                    title: 'Name',
                    dataIndex: 'invoice_line_items',
                    key: 'invoice_line_items',
                    width: '10%',
                    render: (text) => <span>{text?.name}</span>,
            
                },
                {
                    title: 'Description ',
                    dataIndex: 'invoice_line_items',
                    key: 'invoice_line_items',
                    width: '10%',
                    render: (text) => <span>{text?.description}</span>,
                 
                },
                {
                    title: 'Rate',
                    dataIndex: 'invoice_line_items',
                    key: 'invoice_line_items',
                    width: '10%',
                    render: (text) => <span>{text?.rate}</span>,
                   
                },
                {
                    title: 'Quantity ',
                    dataIndex: 'shipment_info',
                    key: 'currency_code',
                    width: '10%',
                    render: (text) => {
                        const data = text?.handling_units

                        return (data.map((value) => {
                            return (<span>{value?.quantity}</span>)
                        }))
                    },
                },

                {
                    title: 'Taxes',
                    dataIndex: 'amount',
                    key: 'amount',
                    width: '15%',
                    render: (text) => {

                        const tex = [
                            {
                                amount_to_tax: 30,
                                amount_with_tax: 40,
                                tax_rate: 4,
                                name: "bottle",
                                description: "tea",
                                tax_amount: 34
                            }, {
                                amount_to_tax: 60,
                                amount_with_tax: 50,
                                tax_rate: 5,
                                name: "phone",
                                description: "coffee",
                                tax_amount: 55
                            }
                        ];
                        console.log(tex.length, "mnb");

                        if (Unique_taxes.length >= 0) {
                            return (Unique_taxes.map((value) => {
                                return (<><span> <b>{value?.name}&nbsp; &nbsp;{value?.rate} </b>| {value?.totalAmount}$</span><br /></>)
                            }))
                        }

                    }
                },
                {
                    title: 'Discounts',
                    dataIndex: 'discount',
                    key: 'discount',
                    width: '20%',
                    render: (text) => {
                       

                        if (Unique_discounts.length >= 0) {
                            return (Unique_discounts.map((value) => {
                                return (<><span><b>{value.name}&nbsp; &nbsp;{value?.rate}</b> | {value.totalAmount} $</span><br /></>)
                            }))
                        }
                    }
                },

                {
                    title: 'Excluding Tax',
                    dataIndex: 'invoice_line_items',
                    width: '10%',
                    key: 'invoice_line_items',
                    render: (text) => <span>{text?.amount_excluding_tax}</span>,
                    
                },
                {
                    title: 'Including Tax',
                    dataIndex: 'invoice_line_items',
                    key: 'invoice_line_items',
                    width: '10%',
                    render: (text) => <span>{text?.amount_including_tax}</span>,
                    
                }
            ];

            const data = []
            data.push(invoice)

            return <div>

                {showIssuerAccount ?

                    <Row xs={24} sm={24} md={24} lg={24} xl={24}  >
                        <Col className="shiphaulTopLeft" xs={12} sm={12} md={12} lg={12} xl={12} style={{ "justifyContent": "right" }}>
                            {invoice_issuer_profle ?
                                <> <h1 className="logo">Shiphaul</h1>
                                    <span>ShipHaul Logistics ,<br />
                                    </span>
                                    <span>
                                        8275 Rte Transcanadienne, <br /></span>
                                    <span>Saint-Laurent,<br /></span>
                                    <span> QC H4S 0B6</span></>
                                : " "
                            }
                        </Col>
                        <Col className="shiphaulTopRight" xs={12} sm={12} md={12} lg={12} xl={12} >
                            <h2 style={{"marginRight":"95px"}}><b>INVOICE</b></h2>
                            {invoice_issuer_profle ?
                                <div className="invoice" style={{"width":"100%", "marginRight":"-55%"}}>  <DescriptionView title={LanguageFormatMessage({ id: 'invoice.number' })}
                                    content={`${invoice.invoice_number}`} />

                                    <DescriptionView title={LanguageFormatMessage({ id: 'general.date' })}
                                        content={`${invoice.dates.invoice_date}`} />

                                    <DescriptionView title={LanguageFormatMessage({ id: 'invoice.invoice_due_date' })}
                                        content={`${invoice.dates.invoice_due_date}`} />
                                    {/* <DescriptionView title={LanguageFormatMessage({ id: 'general.status' })} /> */}
                                        <div className="status" style={{"display":"flex"}}>
                                        <span style={{ "marginRight": "75px" ,"marginleft": "75px"  }}>{"Status"}</span>
                                        {(invoice_status && (invoice?.invoice_status.current_status.toLowerCase() === 'draft')) ? <span className='ant-tag ant-tag-grey'>{'Draft'}</span> : ""}
                                        {(invoice_status && (invoice?.invoice_status.current_status.toLowerCase() === 'open')) ? <span className='ant-tag ant-tag-blue'>{'Open'}</span> : ""}
                                        {(invoice_status && (invoice?.invoice_status.current_status.toLowerCase() === 'void')) ? <span className='ant-tag ant-tag-black'>{'Void'}</span> : ""}
                                        {(invoice_status && (invoice?.invoice_status.current_status.toLowerCase() === 'partially paid')) ? <span className='ant-tag ant-tag-orange'>{'Partially Paid'}</span> : ""}
                                        {(invoice_status && (invoice?.invoice_status.current_status.toLowerCase() === 'paid')) ? <span className='ant-tag ant-tag-green'>{'Paid'}</span> : ""}
                                        {(invoice_status && (invoice?.invoice_status.current_status.toLowerCase() === 'uncollectible')) ? <span className='ant-tag ant-tag-red'>{'Uncollectible'}</span> : ""}
                                        {(invoice_status && (invoice?.invoice_status.current_status.toLowerCase() === 'failed')) ? <span className='ant-tag ant-tag-maroon'>{'Failed'}</span> : ""}
                                        </div>
                                </div>

                                : <></>}

                        </Col></Row> : ""
                }

                {showRecipientAccount ? <><h3><b>Bill To:</b></h3><b><hr /></b>
                    <Row xs={24} sm={24} md={24} lg={24} xl={24}  >
                        <Col className="shiphaulMidLeft" xs={12} sm={12} md={12} lg={12} xl={12} style={{ "justifyContent": "right", }}>
                            {invoice_recipient_profle ?
                                <> <div className="comapnyName" ><b><DescriptionView style={{"width":"35px !important","justifyContent": "none !important"}} title={LanguageFormatMessage({ id: 'checkout.billingform.company' })}
                                    content={`${invoice?.recipient_account?.company_account?.name}`} /></b></div>
                                    <b><DescriptionItem title={LanguageFormatMessage({ id: 'checkout.billingform.address' })}
                                    /></b>
                                    <Col className="address" xs={24} sm={24} md={24} lg={24} xl={24}>
                                        {invoice_recipient_profle ?
                                            <>
                                                <span>{`${invoice?.recipient_account?.billing_profile?.business_profile?.billing_address?.address?.street}`}</span><br />
                                                <span>{`${invoice?.recipient_account?.billing_profile?.business_profile?.billing_address?.address?.label}`}</span>
                                                <span>{`#${invoice?.recipient_account?.billing_profile?.business_profile?.billing_address?.address?.houseNumber}`}</span><br />
                                                <span>{`${invoice?.recipient_account?.billing_profile?.business_profile?.billing_address?.address?.city},`}</span>
                                                <span>{`${invoice?.recipient_account?.billing_profile?.business_profile?.billing_address?.address?.state},`}</span>
                                                <span>{`${invoice?.recipient_account?.billing_profile?.business_profile?.billing_address?.address?.district},`}</span>
                                                <span>{`${invoice?.recipient_account?.billing_profile?.business_profile?.billing_address?.address?.postalCode}`}</span><br />
                                                <span>{`${invoice?.recipient_account?.billing_profile?.business_profile?.billing_address?.address?.country}`}</span>


                                            </> : ""
                                        }
                                    </Col>
                                </>
                                : " "
                            }
                        </Col>
                        <Col className="shiphaulMidRight" xs={12} sm={12} md={12} lg={12} xl={12} >
                            <span><b>Contact information</b></span>
                            {invoice_issuer_profle ?
                                <>   <Row className="address"> <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    {invoice_recipient_profle ?
                                        <DescriptionItem title={LanguageFormatMessage({ id: 'antTable.title.email' })}
                                            content={`${invoice?.recipient_account?.billing_profile?.contact_profile?.email}`} DescriptionItem /> : ""
                                    }
                                </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        {invoice_recipient_profle ?
                                            <DescriptionItem title={LanguageFormatMessage({ id: 'antTable.title.firstName' })}
                                                content={`${invoice?.recipient_account?.billing_profile?.contact_profile?.first_name}`} DescriptionItem /> : ""
                                        }
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        {invoice_recipient_profle ?
                                            <DescriptionItem title={LanguageFormatMessage({ id: 'antTable.title.lastName' })}
                                                content={`${invoice?.recipient_account?.billing_profile?.contact_profile?.last_name}`} DescriptionItem /> : ""
                                        }
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        {invoice_recipient_profle ?
                                            <DescriptionItem title={LanguageFormatMessage({ id: 'general.phone_number' })}
                                                content={`${invoice?.recipient_account?.billing_profile?.contact_profile?.phone}`} DescriptionItem /> : ""
                                        }
                                    </Col>
                                </Row>
                                </>

                                : <></>}

                        </Col></Row></>
                    : " "}

                {/* amount_to_tax: number;
    amount_with_tax: number;
    tax_rate: number;
    name: string;
    description: string;
    tax_amount: number; */}
                {showPayitems ? <>
                    {console.log(columns, "ZZZZZZ")}
                    {console.log(invoice, "KKKKKK")}
                    <h3><b>Pay Items</b></h3>
                    <b><hr /></b>
                    {invoice_amount ? <>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}>

                        </Table><hr />

                    </> : ""}
                </> : " "}

                {showTotalDetails ? <>
                    {invoice_total ? <div className="end_right">
                        {console.log(Unique_taxes, "ASDFVB")}
                        {console.log(discount_total, "rtyu")}
                        {invoice?.amount ?
                            <DescriptionItem title={LanguageFormatMessage({ id: 'amount.subtotal' })}
                                content={`${subtotalData}`} DescriptionItem /> : " "
                        }
                        {invoice?.amount?.taxes ?
                            <DescriptionItem title={LanguageFormatMessage({ id: 'amount.tax_amount' })}
                                content={`${taxes_total}`} DescriptionItem /> : " "
                        }
                        {invoice?.amount.discounts ?
                            <DescriptionItem title={LanguageFormatMessage({ id: 'amount.discount' })}
                                content={`${discount_total}`} DescriptionItem /> : " "
                        }
                        {invoice?.amount ?
                            <DescriptionItem title={LanguageFormatMessage({ id: 'shipment.rate.total' })}
                                content={`${total_total}`} DescriptionItem /> : " "
                        }
                    </div> : ""}


                </> : " "}

                {showType ? <> {(invoice_type && invoice?.type.toLowerCase() == "shipment_invoice") ? <><h3><b>Shipment Information</b></h3><b><hr /></b></> : " "} </> : ""
                }

            </div>
        }