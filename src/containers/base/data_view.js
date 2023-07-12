import React, { PureComponent, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Popconfirm } from "antd";
import { injectIntl, intlShape } from "react-intl";
import { firestoreConnect } from "react-redux-firebase";
import { Row, Col } from "antd/es/grid/";
import { toTableList } from "helpers/data/mapper";
import CustomTable from "../DataGrid/customTable";
import Popover from "components/uielements/popover";
import { MoreOutlined } from "@ant-design/icons";
import IntlMessages from "components/utility/intlMessages";
import { applyResultsFilters } from "helpers/firebase/firestore/results_filter";
import LayoutWrapper from "components/utility/layoutWrapper";
import Map from "components/HereMaps/base_map";
import ItemDetailsView from "./item_details_view";
import { selectCollectionModel } from "model/model_selector";
import DnDCalendar from "../Calendar/DnDCalendar";
import * as _ from "helpers/data/underscore";
import CustomCard from "../DataGrid/customCard";

class DataView extends PureComponent {
  INITIAL_STATE = {
    itemType: undefined,
    queryFilterConditions: [],
    resultsFilterConditions: [],
    collectionModel: {},
    columns: [],
    itemActions: [],
    layouts: [],
    selectedItem: undefined,
    itemViewVisible: false,
    dataItems: [],
    loading: false,
    hasLocationFilters: undefined,
    itemTabKey: "1",
    selectionType: 'checkbox',
    order: "last_modified",
    invoices:[]
  };

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE, ...props };
  }

  componentDidMount() {
  
    if (this.props.columns || this.props.itemActions ) 

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
        order: this.props.order || "last_modified"
      });
    }
   
    if (this.props.dataItems){
      this.setState({dataItems: this.props.dataItems})
    } else if (this.props.itemType) {

      this.setState(
        {
          itemType: this.props.itemType,
          itemTabKey:this.props.itemTabKey,
          collectionModel: selectCollectionModel(this.props.itemType),
         
        },
        this.fetchDataItems
      );
    }
   

    if (this.props.hasLocationFilters) {
      this.setState({ hasLocationFilters: this.props.hasLocationFilters });
    }
    if (this.props.loading){
      this.Loading(this.props.loading)
    }
    // if(this.props.invoices){
    //    this.setState({ invoices: this.props.invoices });
    // }

  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.dataItems, this.props.dataItems)){
      this.setState({dataItems: this.props.dataItems})
    } else if (!_.isEqual(prevProps.itemType,this.props.itemType))
    {
      this.setState(
        {
          itemType: this.props.itemType,
          itemTabKey:this.props.itemTabKey,
          collectionModel: selectCollectionModel(this.props.itemType),
        },
        this.fetchDataItems
      );
    }
    if(!_.isEqual(prevProps.order,this.props.order)){
      this.setState(
        {
          order: this.props.order
        },
        this.fetchDataItems
      );
    }
    if (!_.isEqual(prevProps.queryFilterConditions,this.props.queryFilterConditions)) {
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
    //   if(!_.isEqual(prevProps.invoices,this.props.invoices)){
    //    this.setState({ invoices: this.props.invoices });
    // }
  }

  Loading = (loading) => {
    this.setState({ loading: loading });
  };

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

  setDataItems = (dataItems) => {
  
    const { selectedItem } = this.state;
 
    const resultsFilterConditions =  this.state.resultsFilterConditions || []
    const {onItemsChange} = this.props;
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
      }
    }
    if (typeof onItemsChange === 'function'){
      onItemsChange(dataItems)
    }

    this.setState({ dataItems: dataItems });
    this.Loading(false);
  };

  unsubscribeDataItemListener = () => {
    const { dataItemsListener } = this.state;
    if (dataItemsListener instanceof Function) {
      // unsubscribe Data Listener if it already exists
      dataItemsListener();
    }
  };

  setDataItemListener = (queryConditions, order) => {
    
    const { collectionModel } = this.state;

    if (collectionModel && collectionModel.collection) {
      // console.log('i am collectionModel',collectionModel,'i am collectoinModel.collection',collectionModel.collection);
      this.Loading(true);
      this.unsubscribeDataItemListener();
      const dataItemsListener = collectionModel.collection.query(
        queryConditions,
        this.setDataItems,
        true,
        this.state.hasLocationFilters,
        order
      );
   
      this.setState({ dataItemsListener: dataItemsListener, dataItems: [], order: order });
    }
  };

  fetchDataItems = () => {
    const { queryFilterConditions } = this.props;
    const order = this.state.order ;
    try {
      this.setDataItemListener(queryFilterConditions, order);
    } catch (e) {
      console.error(e.message);
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

  renderLayout = (layout) => {
    /*
     *   Layout : {key: 'key',  sections:[{type: 'table', span:12}, {type: 'location_map', span:12}]}
     * */
    const layoutSections = (layout.sections || []).map((section, index) => {
    
      let sectionLayout = "";
      if (section.type === "table") {
        sectionLayout = this.renderTable(section);
      } else if (section.type === "map") {
        sectionLayout = this.renderLocationsMap(section);
      } else if (section.type === "calendar") {
        sectionLayout = this.renderCalendar(section);
      }else if (section.type === "card") {
        sectionLayout = this.renderCard(section);
      }
      return (
        <Col span={section.span || 24} key={"column" + index}>
          {sectionLayout}
        </Col>
      );
    });
    return (
      <Row style={{ width: "100%" }} key="rowID">
        {layoutSections}
      </Row>
    );
  };

  onItemDetailsClose = () => {
    this.setState({ selectedItem: undefined, itemViewVisible: false });
  };

  selectItem = (item, tabKey) => { 
    // console.log(this.state.itemTabKey,"QWERT");
    if(this.state.itemType == "invoice" && this.state.itemTabKey == "shipment_info" ){ 
      item = item.shipment_info
   }   
   
    this.setState({ selectedItem: item, itemViewVisible: true, itemTabKey: tabKey });
  };

  renderItemActions = (item) => {
    const itemActions = this.state.itemActions ?? []
    const actionList = itemActions
      .filter(
        (itemAction) =>
          itemAction.displayCondition === undefined ||
          (typeof itemAction.displayCondition === "function" &&
            itemAction.displayCondition(item))
      )
      .map((itemAction, index) => {
        let content = "";
        if (itemAction.type === "viewItem") {
          content = (
            <li key={"cell" + index}>
              {/* eslint-disable-next-line */}
              <a
                onClick={() => {
                  this.selectItem(item, itemAction.itemTabKey);
                }}
              >
                <IntlMessages id={itemAction.label} />
              </a>
            </li>
          );

        } else if (itemAction.type === "link") {
          content = (
            <li key={"cell" + index}>
              {/* eslint-disable-next-line */}
              <a
                onClick={() => {
                  itemAction.callback(item);
                }}
              >
                <IntlMessages id={itemAction.label} />
              </a>
            </li>
          );
        } else if (itemAction.type === "confirm") {
          content = (
            <Popconfirm
              title={this.props.intl.formatMessage({
                id: itemAction.confirm_text || "",
              })}
              key={"confirm" + index}
              onConfirm={() => {
                itemAction.callback(item);
              }}
              okText={this.props.intl.formatMessage({
                id: "general.answer.yes",
              })}
              cancelText={this.props.intl.formatMessage({
                id: "general.answer.no",
              })}
            >
              <a href="/#">
                {this.props.intl.formatMessage({ id: itemAction.label || "" })}
              </a>
            </Popconfirm>
          );
        } else {
          content = <li key={"cell" + index}>{itemAction.label}</li>;
        }
        return content;
      });
    return <div>{actionList}</div>;
  };


  renderTable = (layoutSection) => {
    const {
      loading,
      dataItems,
      columns,
    } = this.state;
    console.log(dataItems,"VVVVVVV");
    const {gridProps} = this.props

    return (
      <div>
      <CustomTable
        rowSelection={this.props.rowSelection}
        invoices={this.state.invoices}
        loading={loading}
        size="medium"
        dataSource={dataItems}
        columns={columns}
        pagination={true}
        className="dataViewTable"
        {...gridProps}
      />
      </div>
    );
  };

  renderCard = (layoutSection) => {
    const {
      loading,
      dataItems,
      columns,

    } = this.state;

    const {gridProps} = this.props

    return (
      <div>
      <CustomCard
        rowSelection={this.props.rowSelection}
        loading={loading}
        item={this.state.selectedItem}
        size="medium"
        itemAction={this.state.itemActions}
        dataItems={dataItems}
        columns={columns}
        pagination={true}
        itemType={this.state.itemType}
        className="dataViewCard"
        invoices={this.state.invoices}
        {...gridProps}
      />
      </div>
    );
  };

  renderLocationsMap = (layoutSection) => {

        const {dataItems} = this.state
        const fieldDataItems = (dataItems || []).map(item => {
            if (layoutSection.field) {
                return item[layoutSection.field]
            } else {
                return item
            }
        })
        let mapRender = ""
        if (Array.isArray(fieldDataItems) && fieldDataItems.length > 0 && this.state.selectedItem === undefined) {
            if (layoutSection.map_type === "company_locations") {
                mapRender = <Map map_id={"here-maps"} zoom_to={layoutSection.zoom_to} company_locations={fieldDataItems} width={layoutSection.width ? layoutSection.width : "100%"} height={layoutSection.height ? layoutSection.height : "400px"}></Map>
            } else if (layoutSection.map_type === "routes") {
                mapRender = ""
            }else if (layoutSection.map_type === "tracking") {
              // const positions = fieldDataItems.map(fieldDataItem => fieldDataItem.position || {})
              mapRender = <Map map_id={"here-maps"} tracking_data={fieldDataItems.reverse()} width={layoutSection.width ? layoutSection.width : "100%"} height={layoutSection.height ? layoutSection.height : "400px"}></Map>
            }
        }
        return (<div >{mapRender}</div>)
    }

  renderCalendar = (layoutSection) => {
    const { dataItems } = this.state;
    let calendarOptions = layoutSection.calendarOptions;

    calendarOptions.events = dataItems.map(event => ({
      allDay: event.info.start_time === event.info.end_time,
      trailers: event.assignments.trailers, 
      vehicles: event.assignments.vehicles,
      users: event.assignments.users,
      desc: event.info.description,
      title: event.info.title,
      start: event.info.start_time.toDate(),
      end: event.info.end_time.toDate(),
      id: event.id,
      event_status: event.info.event_status,
      visibility: event.info.visibility,
      location: event.info.location,
      
    }));
    return <DnDCalendar {...calendarOptions} />;
  };

  render() {
    const { itemViewVisible, selectedItem, itemType, itemTabKey } = this.state;
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
      </div>
    );
  }
}

DataView.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    firebase: state.FB.firebase,
  };
};

export default compose(
  connect(mapStateToProps, {}),
  firestoreConnect()
)(injectIntl(DataView));
