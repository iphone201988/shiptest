
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from 'components/uielements/card';
import { Button, Col, Collapse, Row, Divider, Timeline } from 'antd';
import CardStyle from './card.style';
import { datetimeFormat, localDateAndTimeString, localDateString } from 'helpers/data/datetime';
import { CapitalizeEachWord, removeUnderScoreWithSpace } from 'helpers/data/string';
import { FormattedMessage } from 'react-intl';
import CardRelationShipHighLighter from './cardRelationShipHighLighter';
import { Popconfirm } from "antd";
import Popover from "components/uielements/popover";
import { MoreOutlined } from "@ant-design/icons";
import IntlMessages from "components/utility/intlMessages";
import * as _ from "helpers/data/underscore";
import { selectCollectionModel } from "model/model_selector";
import { applyResultsFilters } from "helpers/firebase/firestore/results_filter";
import { toTableList } from "helpers/data/mapper";
import ItemDetailsView from "../../base/item_details_view";
import Drawer from "../../base/item_details_view";
import LayoutWrapper from "components/utility/layoutWrapper";

const { Panel } = Collapse;
class CardView extends Component {
  defaultVewType = "drawer"
  defaultWidth = "100%"
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      cardValue: null,
      selectedItem: undefined,
      itemTabKey: "1",
      itemViewVisible: false,
      loading: false,
      dataItems: [],
      layouts: [],
      visible: false,
      item: undefined,
      itemType: undefined,
      itemView: {},
      viewType: this.defaultVewType,
      viewWidth: this.defaultWidth,
    };
    console.log(this.props, "===prpertiessssssssssssss===");
  }
  fetchDataItems = () => {
    const { queryFilterConditions } = this.props;
    const order = this.state.order;
    try {
      this.setDataItemListener(queryFilterConditions, order);
    } catch (e) {
      console.error(e.message);
    }
  };
  onItemDetailsClose = () => {
    this.setState({ selectedItem: undefined, itemViewVisible: false });
  };

  
  componentDidMount() {

    if (this.props.columns || this.props.itemActions)
    {
      this.setState(
        { itemActions: this.props.itemActions, columns: this.props.columns },
        this.setColumns
      );
    }
    if (
      this.props.layouts ||
      this.props.queryFilterConditions ||
      this.props.resultsFilterConditions || this.props.order
    ) {
      this.setState({
        layouts: this.props.layouts,
        queryFilterConditions: this.props.queryFilterConditions,
        resultsFilterConditions: this.props.resultsFilterConditions,
        order: this.props.order
      });
    }
    
    if (this.props.dataItems) {
      this.setState({ dataItems: this.props.dataItems })
    } else if (this.props.itemType) {
      this.setState(
        {
          itemType: this.props.itemType,
          collectionModel: selectCollectionModel(this.props.itemType),
        },
        this.fetchDataItems
      );
    }

    if (this.props.hasLocationFilters) {
      this.setState({ hasLocationFilters: this.props.hasLocationFilters });
    }
    if (this.props.loading) {
      this.Loading(this.props.loading)
    }

    const {visible, item, itemDetailsView, itemType, itemTabKey} =  this.props;

    if (visible === true || item || itemDetailsView || itemType || itemTabKey) {
    this.setState({ visible: visible, item:item, itemType:itemType, itemTabKey: itemTabKey});
    }

  }
 

  // componentDidUpdate(prevProps) {

  //   if (!_.isEqual(prevProps.dataItems, this.props.dataItems)) {
  //     this.setState({ dataItems: this.props.dataItems })
  //   } else if (!_.isEqual(prevProps.itemType, this.props.itemType)) {
  //     this.setState(
  //       {
  //         itemType: this.props.itemType,
  //         collectionModel: selectCollectionModel(this.props.itemType),
  //       },
  //       this.fetchDataItems
  //     );
  //   }
  //   if (!_.isEqual(prevProps.order, this.props.order)) {
  //     this.setState(
  //       {
  //         order: this.props.order
  //       },
  //       this.fetchDataItems
  //     );
  //   }
  //   if (!_.isEqual(prevProps.queryFilterConditions, this.props.queryFilterConditions)) {
  //     this.fetchDataItems();
  //   }
  //   if (
  //     prevProps.columns !== this.props.columns ||
  //     prevProps.itemActions !== this.props.itemActions
  //   ) {
  //     this.setState({ itemActions: this.props.itemActions }, this.setColumns);
  //     console.log(this.props.itemActions, "========");
  //   }
  //   if (
  //     prevProps.resultsFilterConditions !== this.props.resultsFilterConditions ||
  //     prevProps.itemType !== this.props.itemType
  //   ) {
  //     this.setState({
  //       resultsFilterConditions: this.props.resultsFilterConditions,
  //       itemType: this.props.itemType,
  //     });
  //   }
  //   if (prevProps.layouts !== this.props.layouts) {
  //     this.setState({ layouts: this.props.layouts });
  //   }

  //   if (prevProps.loading !== this.props.loading) {
  //     this.Loading(this.props.loading)
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.dataItems, this.props.dataItems)) {
      this.setState({ dataItems: this.props.dataItems })
    } else if (!_.isEqual(prevProps.itemType, this.props.itemType)) {
      this.setState(
        {
          itemType: this.props.itemType,
          collectionModel: selectCollectionModel(this.props.itemType),
        },
        this.fetchDataItems
      );
    }
    if (!_.isEqual(prevProps.order, this.props.order)) {
      this.setState(
        {
          order: this.props.order
        },
        this.fetchDataItems
      );
    }
    if (!_.isEqual(prevProps.queryFilterConditions, this.props.queryFilterConditions)) {
      this.fetchDataItems();
    }
    if (
      prevProps.columns !== this.props.columns ||
      prevProps.itemActions !== this.props.itemActions
    ) {
      this.setState({ itemActions: this.props.itemActions }, this.setColumns);
    }
    if (
      prevProps.resultsFilterConditions !== this.props.resultsFilterConditions ||
      prevProps.itemType !== this.props.itemType
    ) {
      this.setState({
        resultsFilterConditions: this.props.resultsFilterConditions,
        itemType: this.props.itemType,
      });
    }
    if (prevProps.layouts !== this.props.layouts) {
      this.setState({ layouts: this.props.layouts });
    }

    if (prevProps.loading !== this.props.loading) {
      this.Loading(this.props.loading)
    }
  }

  Loading = (loading) => {
    this.setState({ loading: loading });
  };

  onChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter)
    }
  }

  handleButtonClick = (listItem) => {
    // console.log(listItem, "listItemClick")
    this.setState({ showList: !this.state.showList, cardValue: listItem });

  };

  selectItem = (item, tabKey) => {
    this.setState({ selectedItem: item, itemViewVisible: true, itemTabKey: tabKey });
  };


  setDataItems = (dataItems) => {
    const { selectedItem } = this.state;
    const resultsFilterConditions = this.state.resultsFilterConditions || []
    const { onItemsChange } = this.props;
    if (resultsFilterConditions.length > 0) {
      dataItems = applyResultsFilters(resultsFilterConditions, dataItems);
      // console.log('i am dataItems',dataItems);
    }
    dataItems = toTableList(dataItems);
    // update selected Item
    if (selectedItem) {
      const selectedDataItem = dataItems.filter(
        (dataItem) => dataItem.id === selectedItem.id
      )[0];
      if (selectedDataItem) {
        // console.log('i am selectedDataItem',selectedDataItem);
        this.setState({ selectedItem: selectedDataItem });
        console.log();
      }
    }
    if (typeof onItemsChange === 'function') {
      onItemsChange(dataItems)
    }

    this.setState({ dataItems: dataItems });
    this.Loading(false);
  };


  renderItemActions = (item) => {



    const itemActions = this.props.itemAction ?? []
    const actionList = itemActions
      .filter(
        (itemActions) =>

          itemActions.displayCondition === undefined ||
          (typeof itemActions.displayCondition === "function" &&
            itemActions.displayCondition(item))
      ).map((itemActions, index) => {
        console.log(itemActions, index)
        let content = "";
        if (itemActions.type === "viewItem") {
          content = (
            <li key={"cell" + index}>
              {/* eslint-disable-next-line */}
              <a
                onClick={() => {
                  this.selectItem(item, itemActions.itemTabKey);
                }}
              >
                <IntlMessages id={itemActions.label} />
              </a>
            </li>
          );

        } else if (itemActions.type === "link") {
          content = (
            <li key={"cell" + index}>
              {/* eslint-disable-next-line */}
              <a
                onClick={() => {
                  itemActions.callback(item);
                }}
              >
                <IntlMessages id={itemActions.label} />
              </a>
            </li>
          );
        } else if (itemActions.type === "confirm") {
          content = (
            <Popconfirm
              title={this.props.intl.formatMessage({
                id: itemActions.confirm_text || "",
              })}
              key={"confirm" + index}
              onConfirm={() => {
                itemActions.callback(item);
              }}
              okText={this.props.intl.formatMessage({
                id: "general.answer.yes",
              })}
              cancelText={this.props.intl.formatMessage({
                id: "general.answer.no",
              })}>
              <a href="/#">
                {this.props.intl.formatMessage({ id: itemActions.label || "" })}
              </a>
            </Popconfirm>
          );
        } else {
          content = <li key={"cell" + index}>{itemActions.label}</li>;
        }
        return content;
      });
    return <div>{actionList}</div>;
  }



  setColumns = () => {
    let columns = [
      {
        title: "Action",
        key: "action",
        width: "5%",
        dataIndex: "",
        render: (text, item, index) => (
          <span>
            <Popover content={this.renderItemActions(item)} placement="bottom">
              <MoreOutlined
                style={{ fontSize: "2.0vw", color: "black" }}
                theme="outlined"
              />
            </Popover>
          </span>
        ),
      },
    ];
    columns = columns.concat(this.props.columns || []);
    this.setState({ columns: columns });
  };

  unsubscribeDataItemListener = () => {
    const { dataItemsListener } = this.state;
    if (dataItemsListener instanceof Function) {
      // unsubscribe Data Listener if it already exists
      dataItemsListener();
    }
  };
  Loading = (loading) => {
    this.setState({ loading: loading });
  };
  setDataItemListener = (queryConditions, order) => {
    const { collectionModel } = this.state;
    if (collectionModel && collectionModel.collection) {
      this.Loading(true);
      this.unsubscribeDataItemListener();
      const dataItemsListener = collectionModel.collection.query(
        queryConditions,
        this.setDataItems,
        true,
        this.state.hasLocationFilters,
        order
      );
      // console.log('i am order', order);
      this.setState({ dataItemsListener: dataItemsListener, dataItems: [], order: order });
    }
  };

  renderLayouts = () => {
    const { layouts } = this.state;
    const renderLayout = (layouts || []).map((layout) =>
      this.renderLayout(layout)
    );
    return (
      <LayoutWrapper style={{ width: "100%", height: "100%" }}>{renderLayout}</LayoutWrapper>
    );
  };


  render() {
    // console.log(this.props, "this.props this.props")
    const {visible} = this.state;
    const { dataItems: cards, columns } = this.props;
    const { itemViewVisible, selectedItem, itemType, itemTabKey } = this.state;
    const className = this.props.className;
    const { showList, listItem, cardValue } = this.state;
    console.log(this.state)
    return (
      <div>
        {this.renderLayouts()}
        <ItemDetailsView
         visible={itemViewVisible}
          item={selectedItem}
         itemType={itemType}
         onClose={this.onItemDetailsClose}
         itemTabKey={itemTabKey}
         ></ItemDetailsView>
      
        <CardStyle>

          <Row gutter={[16, 16]}>
            {
              cards.map(
                (card, index) => {
                
                  const formattedDate = datetimeFormat(card?.destination?.access_time?.earliest_time);
                  let trailer_types = removeUnderScoreWithSpace(card?.trailer_types ? card?.trailer_types[0] : '');
                  // columns.map((col, i) => {
                  //     console.log(col, i)
                  // })
                  trailer_types = CapitalizeEachWord(trailer_types);
                  let buttons = [<Button key="action1" type="primary">
                    Details
                  </Button>,
                  <Button onClick={() => this.handleButtonClick(index + 1)} key="action2" >
                    Action {listItem}
                  </Button>]
                  if (card.type == 'company_location') {
                    buttons = [<Button key="action1" type="primary">
                      Details
                    </Button>]
                  }
                  return <>

                    <Col xs={24} sm={12} md={8} lg={6} className={className} key={index}>
                      <Card
                        hoverable
                        actions={buttons}
                      >
                       <div className='kit__l19__itemTime'>
                      {card.type === "shipment_invoice" && <>
                            <div className="cardInnerHead">
                            <p className="p1">
                                {card.invoice_number &&
                                  <>
                                    <span>
                                    <FormattedMessage id={card.invoice_number} />
                                    </span>
                                  </>
                                }
                              </p>
                              {card?.type &&
                                <p className="p1">
                                  <span>
                                    <FormattedMessage id={"Ship To City"} />
                                  </span>
                                </p>
                              }
                              {card?.type &&
                                <p className="p1">
                                  <span>
                                    <FormattedMessage id={"Shipment Invoice"} />
                                  </span>
                                </p>
                              }
                              {card?.invoice_date &&
                                <p className="p1">
                                  <span>
                                    <FormattedMessage id={card?.invoice_date} />
                                  </span>
                                </p>
                              }
                              {card?.invoice_due_date &&
                                <p className="p1">
                                  <span>
                                    <FormattedMessage id={card.invoice_due_date} />
                                  </span>
                                </p>
                              }
                              <p className="p1">
                              {card?.invoice_status?.current_status && <CardRelationShipHighLighter relationship_type={card.invoice_status.current_status} />}
                              </p>
                          </div>
                        </>
                      }</div>
                        <div className='kit__l19__itemTime'>
                          {/* {console.log(card, "card type")} */}
                          {card.type === "company_location" && <>
                            <div className="cardInnerHead">
                              <p className="p1">
                                {card?.data?.profile?.name &&
                                  <>
                                    <span>
                                      <FormattedMessage id={index + 1} />
                                      <FormattedMessage id={") "} />
                                      <FormattedMessage id={card.data.profile.name} />
                                    </span>
                                  </>
                                }
                              </p>
                              {card?.data?.profile?.address?.label &&
                                <p className="p1">
                                  <span>
                                    <FormattedMessage id={card?.data?.profile?.address?.label} />
                                  </span>
                                </p>
                              }
                            </div>


                            {card?.data?.relationship_type &&
                              <CardRelationShipHighLighter relationship_type={card.data?.relationship_type} />
                            }
                          </>
                          }
                          {(card?.profile?.type === 'acss_debit' || card?.profile?.type === 'us_bank_account' || card?.profile?.type === 'card') && <>
                            <div className="cardInnerHead cardInnerHeadPaymentDetail">
                              <p className="p1">

                                {card?.profile?.type &&
                                  <>
                                    <span>
                                      <FormattedMessage id={card?.profile?.type} />
                                    </span>
                                  </>
                                }
                              </p>
                              {card?.profile?.type === 'card' &&
                                <>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.card?.brand} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.card?.country} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.card?.expiration_date} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.card?.last4} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.card?.type} />
                                    </span>
                                  </p>
                                </>
                              }
                              {card?.profile?.type === 'acss_debit' &&
                                <>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.acss_debit?.bank_name} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.acss_debit?.institution_number} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.acss_debit?.transit_number} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.acss_debit?.last4} />
                                    </span>
                                  </p>
                                </>
                              }
                              {card?.profile?.type === 'us_bank_account' &&
                                <>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.us_bank_account?.bank_name} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.us_bank_account?.routing_number} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.us_bank_account?.last4} />
                                    </span>
                                  </p>
                                  <p className="p1">
                                    <span>
                                      <FormattedMessage id={card?.profile?.us_bank_account?.account_holder_type} />
                                    </span>
                                  </p>
                                </>
                              }
                            </div>
                            {card?.data?.relationship_type &&
                              <CardRelationShipHighLighter relationship_type={card.data?.relationship_type} />
                            }
                          </>
                          }
                          {(card.type === "quote_request" || card.type === "shipment") && <>
                            <div className="cardInnerHead" style={{ width: "60%" }}>
                              <p className="p1">
                                {card?.itinerary_sequence?.distance &&
                                  <span>
                                    <FormattedMessage id={card?.itinerary_sequence?.distance / 1000} />
                                    <FormattedMessage id={" Km"} />

                                  </span>
                                }
                              </p>
                              <p className="p1">
                                {(card?.freight_type && trailer_types) && <>
                                  <span>
                                    <FormattedMessage id={card?.freight_type} />
                                  </span>


                                </>}
                              </p>
                              {card?.status && <CardRelationShipHighLighter relationship_type={card.status} />}
                            </div>

                          </>
                          }

                          {card?.rate?.total && card?.rate?.currency_code &&
                            <div className="tripDetail" style={{ width: " 40%", textAlign: "right" }}>
                              <p className="Text">
                                <FormattedMessage id={card?.rate?.total} />
                                <FormattedMessage id={' '} />
                                <FormattedMessage id={card?.rate?.currency_code} />
                              </p>
                            </div>
                          }
                        </div>
                        {(card?.destination?.location?.address?.shortLabel && card?.origin?.location?.address?.shortLabel) &&
                          <>
                            <Divider />
                            <ul className="list-unstyled">
                              <li className="kit__l19__item">
                                <div className="kit__l19__itemSeparator">
                                  <div className="kit__utils__donut kit__utils__donut--danger mr-3"></div>
                                </div>
                                <div className="cardInnerHead">
                                  <FormattedMessage id={card?.destination?.location?.address?.shortLabel} />

                                  <div className="kit__l19__itemTime mr-3">
                                    <span>
                                      <FormattedMessage id={formattedDate} />
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="kit__l19__item">
                                <div className="kit__l19__itemSeparator">
                                  <div className="kit__utils__donut kit__utils__donut--danger mr-3"></div>
                                </div>
                                {card?.origin?.location?.address?.shortLabel &&
                                  <div className="cardInnerHead">
                                    <FormattedMessage id={card?.origin?.location?.address?.shortLabel} />

                                    <div className="kit__l19__itemTime mr-3">
                                      <span>
                                        <FormattedMessage id={localDateString(card?.origin?.access_time?.earliest_time)} />

                                      </span>
                                      <span>  <FormattedMessage id={" - "} />
                                      </span>
                                      <span>
                                        <FormattedMessage id={localDateAndTimeString(card?.origin?.access_time?.latest_time)} />
                                      </span>
                                    </div>
                                  </div>
                                }
                              </li>
                            </ul>
                          </>
                        }

                        {(showList && (cardValue == index + 1)) ? <span className="toolip"  >
                          {this.renderItemActions(card)}
                          {/* <Popover content={this.renderItemActions(card)} placement="bottom">
              <MoreOutlined
                style={{ fontSize: "2.0vw", color: "black" }}
                theme="outlined"
              />
            </Popover> */}
                        </span> : ''} </Card>
                    </Col>
                  </>
                }
              )
            }
          </Row>
        </CardStyle>
      </div >
    );
  }
}

const mapStateToProps = state => ({
  cards: state.cards,
});

export default connect(mapStateToProps)(CardView);
