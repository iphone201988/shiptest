import React from "react";
import {injectIntl, intlShape} from "react-intl";
import CompanyLocation from "model/location/company_location";
import Card from "containers/Uielements/Card/card.style";
import {getSpan} from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import {WEEK_DAYS, COMPANY_LOCATION_TYPES, RELATIONSHIP_TYPE, VISIBILITY_OPTIONS, CONTACT_TYPE} from "constants/options/location";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {updateCompanyLocation} from "helpers/firebase/firebase_functions/company_location";
import {getWeekAccess, getContactInformation} from "helpers/containers/states/location"
import {notifySuccess, notifyError} from "../../notification";
///Users/sayantanbasu/shiphaul/shiphaul_carrier_dashboard/src/helpers/data/format.js
import { getInitialValue, getDayFormField } from "helpers/containers/properties/company_location";
// import moment from 'moment';
// import { earliestTimeToUnix, latestTimeToUnix } from 'helpers/containers/states/timeToUnix';

class CompanyLocationDetailsView extends React.Component {
  constructor(props) {
    super(props);
    const INITIAL_QUOTE = {
      is_shipper: false,
      company_location: this.props.company_location || null,
      remove_map: this.props.remove_map || false,
      loading: false,
      formInputs: undefined,
      DaysOptions: [],
      CategoryOptions: [],
      RelationshipTypeOptions: [],
      VisibilityOptions: [],
    };

    this.state = { ...INITIAL_QUOTE };
  }

  componentDidMount() {
    this.setOptions();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.company_location instanceof CompanyLocation &&
      (prevProps.remove_map !== this.props.remove_map ||
        prevProps.company_location !== this.props.company_location ||
        prevProps.is_shipper !== this.props.is_shipper)
    ) {
      this.setState(
        {
          company_location: this.props.company_location,
          is_shipper: this.props.is_shipper,
        },
        this.setOptions
      );
    }
  }

  setOptions = (options) => {
    this.setState(
      {
        DaysOptions: optionObjectToOptionsLabelValue(
          WEEK_DAYS,
          this.props.intl
        ),
        CategoryOptions: optionObjectToOptionsLabelValue(
          COMPANY_LOCATION_TYPES,
          this.props.intl
        ),
        RelationshipTypeOptions: optionObjectToOptionsLabelValue(
          RELATIONSHIP_TYPE,
          this.props.intl
        ),
        VisibilityOptions: optionObjectToOptionsLabelValue(
          VISIBILITY_OPTIONS,
          this.props.intl
        ),
        ContactTypeOptions: optionObjectToOptionsLabelValue(
          CONTACT_TYPE,
          this.props.intl
        ),
      },
      this.setFormInputs
    );
  };

  Loading = (loading) => {
    this.setState({ loading: loading });
  };

  onSubmit = (values) => {
    // console.log('*****', values)
    let { itemSetsFields } = values;
    const company_location = this.state.company_location;

    const profile = {
      name: values.profile_name,
      address: values.profile_address,
      code: values.code,
      tags: values.tags,
      private_notes: values.private_notes,
      public_notes: values.public_notes,
      contact_information: getContactInformation(
        values,
        itemSetsFields,
        company_location.contact_information
      ),
    };

    const week_access = {
      monday: values.monday ? values.monday : [],
      tuesday: values.tuesday ? values.tuesday : [],
      wednesday: values.wednesday ? values.wednesday : [],
      thrusday: values.thrusday ? values.thrusday : [],
      friday: values.friday ? values.friday : [],
      saturday: values.saturday ? values.saturday : [],
      sunday: values.sunday ? values.sunday : [],
    };

    const CompanyLocationData = {
      id: company_location.id,
      visibility: values.visibility,
      profile: profile,
      relationship_type: values.relationship_type,
      week_access: getWeekAccess(week_access)
    };

    this.Loading(true);
    return updateCompanyLocation(CompanyLocationData)
      .then((res) => {
        notifySuccess(
          "notification.success.new_company_location",
          this.props.intl
        );
        this.Loading(false);
        this.onCloseDetail();
      })
      .catch((e) => {
        notifyError("notification.fail.new_company_location", this.props.intl);
        this.Loading(false);
      });
  };

  

  setFormInputs = () => {
    const {
      company_location,
      CategoryOptions,
      RelationshipTypeOptions,
      VisibilityOptions,
      ContactTypeOptions,
    } = this.state;

    const { profile, week_access, contact_information } = company_location;


    const CompanyLocationDetailFormItemLabelCol = {
      xs: { span: 13 },
      sm: { span: 11 },
      md: { span: 9 },
      lg: { span: 7 },
    };

    const CompanyLocationDetailFormItemWrapperCol = {
      xs: { span: 10 },
      sm: { span: 12 },
      md: { span: 14 },
      lg: { span: 16 },
    };

    const CompanyLocationDetailWrapperCol = {
      xs: { span: 22 },
      sm: { span: 16 },
      md: { span: 10 },
      lg: { span: 10 },
    };

    const formInputs = {
      form_type: "multi_steps_tabs",
      submit_label: this.props.intl.formatMessage({ id: "general.update" }),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          key: "company_location_detail",
          size: "full",
          title: this.props.intl.formatMessage({
            id: "shipment.actions.details",
          }),
          type: "detail",
          groups: [
            {
              name: "company_location_detail",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
                props: { size: "small" },
              },
              items: [
                {
                  name: "profile_name",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.name",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                    initialValue: profile.name,
                  },
                  fieldProps: {},
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "profile_address",
                  type: "addressField",
                  formItemProps: {
                    hasFeedback: true,
                    label: this.props.intl.formatMessage({
                      id: "general.address",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                    initialValue: profile.address,
                  },
                  fieldProps: {},
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "code",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "company_location.code",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                    initialValue: profile.code,
                  },
                  fieldProps: {},
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "tags",
                  type: "tagField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "company_location.tags",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                    initialValue: profile.tags,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({
                      id: "company_location.tags",
                    }),
                    options: CategoryOptions,
                  },
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "public_notes",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.public_notes",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                    initialValue: profile.public_notes,
                  },
                  fieldProps: {},
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "private_notes",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.private_notes",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                    initialValue: profile.private_notes,
                  },
                  fieldProps: {},
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "relationship_type",
                  type: "selectField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.relationship_type",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                    initialValue: company_location.relationship_type,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({
                      id: "general.relationship_type",
                    }),
                    options: RelationshipTypeOptions,
                  },
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "visibility",
                  type: "radioGroupField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.visibility",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                    initialValue: company_location.visibility,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({
                      id: "general.visibility",
                    }),
                    options: VisibilityOptions,
                  },
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
              ],
            },
            {
              //!! week access starts here
              name: "week_access",
              mode: "single",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "card",
                props: {
                  size: "small",
                  title: this.props.intl.formatMessage({
                    id: "company_location.week_access",
                  }),
                },
              },
              items: [
                getDayFormField("monday", this.props, week_access),
								getDayFormField("tuesday", this.props, week_access),
								getDayFormField("wednesday", this.props, week_access),
								getDayFormField("thrusday", this.props, week_access),
								getDayFormField("friday", this.props, week_access),
								getDayFormField("saturday", this.props, week_access),
								getDayFormField("sunday", this.props, week_access),
              ],
            },
          ],
        },
        //!! contact info sec 
        {
          key: "contact_information",
          title: this.props.intl.formatMessage({
            id: "general.contact_information",
          }),
          type: "detail",
          groups: [
            {
              name: "contact_information",
              mode: "multiple",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "card",
                props: {
                  size: "small",
                  title: this.props.intl.formatMessage({
                    id: "general.contact_information",
                  }),
                },
              },
              formItemsProps: profile.contact_information.map((info) => {
                return {
                  contact_type: { initialValue: info.type },
                  contact_name: { initialValue: info.name },
                  contact_address: { initialValue: info.address },
                  contact_phone: { initialValue: info.phone },
                  contact_email: { initialValue: info.email },
                };
              }),
              items: [
                {
                  name: "contact_type",
                  type: "selectField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.type",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({
                      id: "general.type",
                    }),
                    options: ContactTypeOptions,
                    mode: "multiple",
                  },
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "contact_name",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.name",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({
                      id: "general.name",
                    }),
                  },
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "contact_address",
                  type: "addressField",
                  formItemProps: {
                    // rules:[{ required: true }],
                    label: this.props.intl.formatMessage({
                      id: "general.address",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({
                      id: "general.address",
                    }),
                  },
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "contact_phone",
                  type: "phoneField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.phone_number",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({
                      id: "general.phone_number",
                    }),
                  },
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
                {
                  name: "contact_email",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.email",
                    }),
                    labelCol: CompanyLocationDetailFormItemLabelCol,
                    wrapperCol: CompanyLocationDetailFormItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({
                      id: "general.email",
                    }),
                  },
                  wrapperCol: CompanyLocationDetailWrapperCol,
                },
              ],
            },
          ],
        },
      ],
    };
    this.setState({ formInputs: formInputs });
  };

  onCloseDetail = () => {
    this.props.onCloseDetail();
  };

  render() {
    const { company_location, formInputs } = this.state;

    if (company_location === null) {
      return <div></div>;
    }

    return (
      <div>
        <Card
          title={this.props.intl.formatMessage({
            id: "shipment.actions.details",
          })}
        >
          {formInputs ? (
            <FormBox
              title={"CompanyLocationDetails"}
              formInputs={formInputs}
              onSubmit={this.onSubmit}
              onCloseDetail={this.onCloseDetail}
            />
          ) : (
            ""
          )}
        </Card>
      </div>
    );
  }
}

CompanyLocationDetailsView.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(CompanyLocationDetailsView)

