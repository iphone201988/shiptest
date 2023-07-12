import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { Col, Row } from 'antd/es/grid/';
import { injectIntl, intlShape } from "react-intl";
import { getSpan, spans } from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import Loader from "components/utility/loader";
import { notifyError, notifySuccess } from "components/notification";
import { optionObjectToOptionsLabelValue } from "helpers/data/mapper";
import { PropTypes } from "prop-types";
import carrierOptions from './Carrier/options'
import shipperOptions from './Shipper/options'
import DataView from "../base/data_view";
import {
  getIntegrationEntities,
  importIntegrationEntities
} from "helpers/firebase/firebase_functions/integrations";
import Tag from "antd/es/tag";
import IntlMessages from "components/utility/intlMessages";
import { ROLES } from "constants/options/user";
import { DisplayTag } from "components/UI/buttons";
import { integration_status } from "model/manager/integration/integrations_map";
import { get_trailer_type } from "constants/options/shipping";
import CompanyIntegrationEntitiesSummary from "../../model/integration/company_integration_entities_summary";
import Button from "components/uielements/button";

const IntegrationOptions = {
  actions: {
    importEntity: {
      name: 'integration_sync.action.import',
      description: 'integration_sync.action.import.description'
    },
    removeEntity: {
      name: 'integration_sync.action.remove',
      description: 'integration_sync.action.add.description'
    },
    viewAll: {
      name: 'integration_sync.action.view_all',
      description: 'integration_sync.action.add.description'
    },
  }
}

class IntegrationSync extends React.Component {
  defaultViewType = "table";
  INITIAL_STATE = {
    dataItems: [],
    view: undefined,
    options: undefined,
    action: 'importEntity',
    entityType: undefined,
    selectedRowKeys: [],
    selectedItems: [],
    formSubmitLoading: false,
    importedEntities: undefined,
    dataLoading: false,
    importedEntitiesLoading: false,
  };

  static propTypes = {
    companyId: PropTypes.string,
    domain: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    if (this.props.integration) {
      this.setOptions();
    }
    if (this.props.itemTabKey) {
      this.setState({ view: this.props.itemTabKey })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.integration !== prevProps.integration) {
      this.setOptions();
    }
    if (this.state.entityType !== prevState.entityType) {
      this.loadEntityData()
    }
  }

  setOptions = () => {

    let options = IntegrationOptions
    if (this.props.domain === 'carrier') {
      options = { ...options, ...carrierOptions }
    } else if (this.props.domain === 'shipping') {
      options = { ...options, ...shipperOptions }
    }
    if (options) {
      Object.keys(options).forEach(key => {
        options[key] = optionObjectToOptionsLabelValue(options[key], this.props.intl);
      })
    }

    this.setState({ options: options });
  };

  handleReset = () => {
    this.setState = { ...this.INITIAL_STATE };
  };

  onCloseDetail = () => {
    if (this.props.onCloseDetail) {
      this.props.onCloseDetail();
    }
  };

  loadImportedEntities = () => {
    const { entityType } = this.state
    const { companyId, integration } = this.props
    const provider = integration?.provider
    const id = CompanyIntegrationEntitiesSummary.getId(provider, entityType, companyId)
    this.setState({ importedEntitiesLoading: true })
    CompanyIntegrationEntitiesSummary.collection.get(id, this.onImportedEntitiesChange, true)
  }

  onImportedEntitiesChange = (values) => {
    this.setState({ importedEntities: values, importedEntitiesLoading: false })
  }

  onEntityTypeSelect = (types) => {
    this.setState({ entityType: types, importedEntities: undefined }, this.loadImportedEntities)
  }

  onActionSelect = (action) => {
    this.setState({ action: action })
  }

  selectEntityFormInputs = () => {
    const { options, entityType } = this.state;

    const FieldWrapperCol = getSpan(24)
    const FieldLabelCol = getSpan(4)
    const FieldFormItemWrapperCol = getSpan(20)

    const items = [
      {
        name: "action",
        type: "selectField",
        formItemProps: {
          label: this.props.intl.formatMessage({ id: "integration_sync.select_action.title", }),
          initialValue: 'importEntity',
          labelCol: FieldLabelCol,
          wrapperCol: FieldFormItemWrapperCol,
        },
        fieldProps: {
          options: options.actions ?? [],
          onSelect: this.onActionSelect,
        },
        wrapperCol: FieldWrapperCol,
      },
      {
        name: "entityType",
        type: "selectField",
        formItemProps: {
          label: this.props.intl.formatMessage({ id: "integration_sync.select_entity_type.title" }),
          labelCol: FieldLabelCol,
          wrapperCol: FieldFormItemWrapperCol,
        },
        fieldProps: {
          placeholder: this.props.intl.formatMessage({ id: "integration_sync.select_entity_type.placeholder" }),
          options: options.entities ?? [],
          onSelect: this.onEntityTypeSelect,
        },
        wrapperCol: FieldWrapperCol,
      },
    ]

    // if (entityType == 'user'){
    //   items.push(
    //   {
    //     name: "userRoles",
    //     type: "selectField",
    //     formItemProps: {
    //       label: this.props.intl.formatMessage({id: "general.users",}),
    //       labelCol: FieldLabelCol,
    //       wrapperCol: FieldFormItemWrapperCol,
    //       multiple: true,
    //     },
    //     fieldProps: {
    //       options: options.users ?? [],
    //       onSelect: this.onUserRolesSelect,
    //       mode: 'multiple',
    //     },
    //     wrapperCol: FieldWrapperCol,
    //   }
    //   )
    // }

    // if (entityType == 'device'){
    //   items.push(
    //     {
    //       name: "deviceTypes",
    //       type: "selectField",
    //       formItemProps: {
    //         label: this.props.intl.formatMessage({id: "general.devices",}),
    //         labelCol: FieldLabelCol,
    //         wrapperCol: FieldFormItemWrapperCol,
    //         multiple: true,
    //       },
    //       fieldProps: {
    //         options: options.devices ?? [],
    //         onSelect: this.onDeviceTypeSelect,
    //         mode: 'multiple',
    //       },
    //       wrapperCol: FieldWrapperCol,
    //     }
    //   )
    // }

    return {
      form_type: "regular",
      // submit_label: this.props.intl.formatMessage({ id: "action.import" }),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          type: "noButtons",
          key: "entities_select",
          title: this.props.intl.formatMessage({ id: "entities_sync" }),
          groups: [
            {
              name: "entities_sync",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
              },
              items: items,
            },
          ],
        },
      ],
    };
  };

  loadEntityData = () => {
    const { entityType } = this.state

    const filterData = {
      entity_type: entityType,
      provider: this.props.integration?.provider,
      options: {},
    };
    this.setState({ dataLoading: true })
    getIntegrationEntities(filterData).then((entities) => {
      entities.map((entity, index) => { entity.key = index })
      this.setState({ dataItems: entities, dataLoading: false })
    })
      .catch(e => {
        notifyError("notification.fail.get_provider_entities", this.props.intl)
        this.setState({ dataLoading: false })
        console.error(e)
      })

  }

  onSubmit = () => {
    const { selectedItems, entityType } = this.state
    const provider = this.props.integration?.provider

    if (Array.isArray(selectedItems) && selectedItems.length > 0 && entityType && provider) {
      this.setState({ formSubmitLoading: true })
      const selectIds = selectedItems.map(selectedItem => selectedItem?.associations?.provider_resource?.id)
      importIntegrationEntities({ entity_type: entityType, provider: provider, selected_entities: selectIds }).then((_) => {
        notifySuccess("notification.success.import_provider_entities", this.props.intl)
      }).catch(e => {
        notifyError("notification.fail.import_provider_entities", this.props.intl)
      }).finally(() => {
        this.setState({ formSubmitLoading: false })
      })
    }

  }

  onDone = () => {
    if (this.props.onDone) {
      this.props.onDone();
    }
  }

  isEntityImported = (entity) => {
    const { importedEntities } = this.state
    const id = entity.associations?.provider_resource?.id
    const importedEntity = (importedEntities?.entities || {})[id]
    return id !== undefined && importedEntity !== undefined
  }

  getDataColumns = () => {
    const { entityType, importedEntities, action } = this.state
    //todo: disable select for rows already imported
    const yesText = this.props.intl.formatMessage({ id: 'general.answer.yes' })
    const noText = this.props.intl.formatMessage({ id: 'general.answer.no' })
    const isImportedFilteredValue = []
    let isImportedFilters = []
    if (action === 'importEntity') {
      isImportedFilteredValue.push(false)
      isImportedFilters.push({ text: noText, value: false, })
    }
    else if (action === 'removeEntity') {
      isImportedFilteredValue.push(true)
      isImportedFilters.push({ text: yesText, value: true, })
    } else {
      isImportedFilters = [
        {
          text: yesText,
          value: true,
        },
        {
          text: noText,
          value: false,
        }
      ]
    }

    const columns = [
      {
        title: this.props.intl.formatMessage({ id: "general.isImported" }),
        dataIndex: 'isImported',
        filters: isImportedFilters,
        filterMode: 'tree',
        filterSearch: true,
        filteredValue: isImportedFilteredValue,
        onFilter: (value, record) => record.isImported === value,
        key: 'isImported',
        width: '10%',
        render: (text, entity, i) => {
          return <span>{entity.isImported ? yesText : noText}</span>
        },
      },
    ]

    if (entityType == 'user') {
      return columns.concat(this.getUserColumns());
    }
    else if (entityType == 'vehicle') {
      return columns.concat(this.getVehicleColumns());
    }
    else if (entityType == 'trailer') {
      return columns.concat(this.getTrailerColumns());
    }
    else if (entityType == 'device') {
      return columns.concat(this.getDeviceColumns());
    }

    return columns;
  }

  getUserColumns = () => {
    return [
      // {
      //   title: this.props.intl.formatMessage({id: "general.isImported"}),
      //   key: 'isImported',
      //   width: '20%',
      //   render: (text, user, i) => <span></span>,
      // },
      {
        title: this.props.intl.formatMessage({ id: "general.name" }),
        key: 'name',
        width: '40%',
        render: (text, user, i) => <span>{user.profile.first_name} {user.profile.last_name}</span>,
      },
      {
        title: this.props.intl.formatMessage({ id: "general.roles" }),
        dataIndex: '',
        rowKey: 'roles',
        width: '40%',
        render: (text, user, index) => <span> {Object.values(user.roles ?? {}).map(role => role ?
          <Tag color="blue" key={role.type}>
            <IntlMessages id={ROLES[role.type].name} />
          </Tag> : "")}</span>,
      }
    ]
  }

  getDeviceColumns = () => {
    return [
      {
        title: this.props.intl.formatMessage({ id: "general.identifier" }),
        key: 'identifier',
        width: '30%',
        render: (text, device) => <span>{device.profile?.identifier}</span>,
      },
      {
        title: this.props.intl.formatMessage({ id: "general.model" }),
        key: 'model',
        width: '30%',
        render: (text, device) => <span>{device.profile?.model}</span>,
      },
      {
        title: this.props.intl.formatMessage({ id: "general.type" }),
        key: 'type',
        width: '30%',
        render: (text, device) => <span>{device.device_type}</span>,
      },
    ]
  }

  addFilter = (filters, entry) => {
    if (entry && Array.isArray(filters)) {
      filters.push({ text: entry, value: entry });
    } else if (entry) {
      filters = [{ text: entry, value: entry }]
    }
    return filters
  }

  getVehicleColumns = () => {
    const { dataItems } = this.state
    const filters = {};
    (dataItems || []).forEach(dataItem => {
      filters.vin = this.addFilter(filters.vin, dataItem?.profile?.vin)
    })

    return [
      {
        title: this.props.intl.formatMessage({ id: "general.vin" }),
        key: 'vin',
        dataIndex: ['profile', 'vin'],
        width: '30%',
        filters: filters.vin || [],
        onFilter: (value, record) => (record.profile?.vin ?? '').indexOf(value) > -1,
      },
      {
        title: this.props.intl.formatMessage({ id: "general.model" }),
        key: 'model',
        width: '30%',
        render: (text, asset, i) => {
          return (
            <>
              {asset.profile?.year ? <span>{asset.profile.year} </span> : ''}
              {asset.profile?.make ? <span>{asset.profile.make} </span> : ''}
              {asset.profile?.model ? <span>{asset.profile.model} </span> : ''}
            </>
          )
        },
      },
      {
        title: this.props.intl.formatMessage({ id: "general.status" }),
        key: 'status',
        width: '30%',
        render: (text, asset, i) => {
          return (
            <>
              {DisplayTag(integration_status(asset.status))}
            </>
          )
        },
      },
    ]
  }

  getTrailerColumns = () => {
    return [
      {
        title: this.props.intl.formatMessage({ id: "general.vin" }),
        key: 'name',
        width: '25%',
        render: (text, asset, i) => {
          return (
            <>
              <div> {asset.profile?.vin}</div>
            </>
          )
        },
      },
      {
        title: this.props.intl.formatMessage({ id: "general.type" }),
        key: 'type',
        width: '25%',
        render: (text, asset, i) => {

          return (<div> {this.props.intl.formatMessage({ id: get_trailer_type(asset.profile?.trailer_type)?.name || "" })}</div>)
        },
      },
      {
        title: this.props.intl.formatMessage({ id: "general.model" }),
        key: 'model',
        width: '25%',
        render: (text, asset, i) => {
          return (
            <>
              {asset.profile?.year ? <span>{asset.profile.year} </span> : ''}
              {asset.profile?.make ? <span>{asset.profile.make} </span> : ''}
              {asset.profile?.model ? <span>{asset.profile.model} </span> : ''}
            </>
          )
        },
      },
      {
        title: this.props.intl.formatMessage({ id: "general.status" }),
        key: 'status',
        width: '25%',
        render: (text, asset, i) => {
          return (
            <>
              {DisplayTag(integration_status(asset.status))}
            </>
          )
        },
      },
    ]
  }

  onSelectRowChange = (selectedRowKeys, selectedItems) => {
    this.setState({ selectedRowKeys, selectedItems });
  };

  getCheckboxProps = (record) => {
    const { action } = this.state
    const isImported = this.isEntityImported(record);

    return ({
      disabled: action === 'importEntity' ? isImported : !isImported,
      name: record.name,
    })
  }
  /*
  *
  * importEntity: {
      name: 'integration_sync.actions.import',
      description: 'integration_sync.actions.import.description'
    },
    removeEntity:{
      name: 'integration_sync.actions.remove',
      description: 'integration_sync.actions.add.description'
    },
    viewAll:{
      name: 'integration_sync.actions.view_all',
      description: 'integration_sync.actions.add.description'
    },
  * */

  renderActionButton = () => {
    const { action, formSubmitLoading } = this.state;
    const actionLabelMap = {
      importEntity: <IntlMessages id={'action.import'} />,
      removeEntity: <IntlMessages id={'action.remove'} />,
      viewAll: <IntlMessages id={'action.view'} />,
    }
    const noButtonActions = ['viewAll']
    if (noButtonActions.includes(action)) {
      return null
    }
    return <Button loading={formSubmitLoading} onClick={this.onSubmit} type="primary" >{actionLabelMap[action] || <IntlMessages id={'action.submit'} />}</Button>
  }

  renderDataView = () => {

    const { dataItems, dataLoading, importedEntitiesLoading, action } = this.state

    dataItems.forEach(dataItem => {
      dataItem.isImported = this.isEntityImported(dataItem)
    })
    const noCheckActions = ['viewAll']

    const rowSelection = noCheckActions.includes(action) ? undefined : { type: "checkbox", onChange: this.onSelectRowChange, getCheckboxProps: this.getCheckboxProps }

    return (
      <>
        <Row>
          <Col span={getSpan(4)}>
            {this.renderActionButton()}
          </Col>
          <Col span={getSpan(20)}></Col>
        </Row>
        <Row>
          <Col span={24}>
            <DataView
              rowSelection={rowSelection}
              hasRowSelectio={true}
              dataItems={dataItems}
              columns={this.getDataColumns()}
              layouts={[{ key: 'table', sections: [{ type: 'table', span: 24 }] }]}
              loading={dataLoading || importedEntitiesLoading}
            />
          </Col>
        </Row>
      </>
    )



  }

  render() {
    const { options, action, entityType } = this.state

    return <div>
      {options ?
        <FormBox
          formInputs={this.selectEntityFormInputs()}
        /> : null}
      {/*{this.renderDataView()}*/}
      {action && entityType ? this.renderDataView() : null}
    </div>
  }
}

IntegrationSync.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    companyId: state.FB.company.companyId,
    domain: state.FB.company.domain
  };
};

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(IntegrationSync));
