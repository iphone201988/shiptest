export const LocationFilterFormItemlabelCol = {
    xs: {span: 13},
    sm: {span: 11},
    md: {span: 9},
    lg: {span: 7},
}

export const LocationFilterFormItemWrapperCol = {
    xs: {span: 10},
    sm: {span: 12},
    md: {span: 14},
    lg: {span: 16},
}

export const LocationFilterWrapperCol = {
    xs: {span: 22},
    sm: {span: 16},
    md: {span: 10},
    lg: {span: 10},
}

export const LocationRadiusFilterFormItemLabelCol = {
    xs: {span: 12},
    sm: {span: 10},
    md: {span: 8},
    lg: {span: 6},
}

export const LocationRadiusFilterFormItemWrapperCol = {
    xs: {span: 18},
    sm: {span: 20},
    md: {span: 22},
    lg: {span: 24},
}

export const LocationRadiusFilterWrapperCol = {
    xs: {span: 6},
    sm: {span: 8},
    md: {span: 10},
    lg: {span: 10},
}

export const StatusFilterFormItemLabelCol = {
    xs: {span: 13},
    sm: {span: 11},
    md: {span: 9},
    lg: {span: 7},
}

export const StatusFilterFormItemWrapperCol = {
    xs: {span: 10},
    sm: {span: 12},
    md: {span: 14},
    lg: {span: 16},
}

export const StatusFilterWrapperCol = {
    xs: {span: 22},
    sm: {span: 16},
    md: {span: 10},
    lg: {span: 10},
}

export const TrailerTypeFilterFormItemLabelCol = {
    xs: {span: 11},
    sm: {span: 9},
    md: {span: 7},
    lg: {span: 5},
}

export const TrailerTypeFilterFormItemWrapperCol = {
    xs: {span: 10},
    sm: {span: 12},
    md: {span: 14},
    lg: {span: 16},
}

export const TrailerTypeFilterWrapperCol = {
    xs: {span: 6},
    sm: {span: 8},
    md: {span: 10},
    lg: {span: 10},
}

export const DistanceFilterFormItemLabelCol = {
    xs: {span: 13},
    sm: {span: 11},
    md: {span: 9},
    lg: {span: 7},
}

export const DistanceFilterFormItemWrapperCol = {
    xs: {span: 10},
    sm: {span: 12},
    md: {span: 14},
    lg: {span: 16},
}

export const DistanceFilterWrapperCol = {
    xs: {span: 22},
    sm: {span: 16},
    md: {span: 10},
    lg: {span: 10},
}

export const PickupDateFilterFormItemLabelCol = {
    xs: {span: 11},
    sm: {span: 9},
    md: {span: 7},
    lg: {span: 5},
}

export const PickupDateFilterFormItemWrapperCol = {
    xs: {span: 10},
    sm: {span: 12},
    md: {span: 14},
    lg: {span: 16},
}

export const PickupDateFilterWrapperCol = {
    xs: {span: 6},
    sm: {span: 8},
    md: {span: 10},
    lg: {span: 10},
}

export const originLocationFilterProps = (_this, props={}) => {

    const properties = {
        isGroup: true,
        elements:[
            {
                name: "originLocation",
                type: "addressField",
                formItemProps:{
                    hasFeedback: true,
                    label : _this.props.intl.formatMessage({id:"general.address_origin"}),
                    labelCol: LocationFilterFormItemlabelCol,
                    wrapperCol: LocationFilterFormItemWrapperCol
                },
                fieldProps:{
                    placeholder: _this.props.intl.formatMessage({id:"general.address_origin"}),
                },
                wrapperCol: LocationFilterWrapperCol
            },
            {
                name: "originLocationRadius",
                type: "number",
                formItemProps:{
                    initialValue: "101",
                    hasFeedback: true,
                    label : _this.props.intl.formatMessage({id:"general.radius"}),
                    labelCol: LocationRadiusFilterFormItemLabelCol,
                    wrapperCol: LocationRadiusFilterFormItemWrapperCol
                },
                fieldProps:{
                    unit: "km",
                    placeholder: _this.props.intl.formatMessage({id:"general.radius"}),
                },
                wrapperCol: LocationFilterWrapperCol
            }
        ]
    }

    return {...properties, ...props}

}

export const destinationLocationFilterProps = (_this, props={}) => {

    const properties = {
        isGroup: true,
        elements:[
            {
                name: "destinationLocation",
                type: "addressField",
                formItemProps:{

                    hasFeedback: true,
                    label : _this.props.intl.formatMessage({id:"general.address_destination"}),
                    labelCol: LocationFilterFormItemlabelCol,
                    wrapperCol: LocationFilterFormItemWrapperCol
                },
                fieldProps:{
                    placeholder: _this.props.intl.formatMessage({id:"general.address_destination"}),
                },
                wrapperCol: LocationFilterWrapperCol
            },
            {
                name: "destinationLocationRadius",
                type: "number",
                formItemProps:{
                    initialValue: "102",
                    hasFeedback: true,
                    label : _this.props.intl.formatMessage({id:"general.radius"}),
                    labelCol: LocationRadiusFilterFormItemLabelCol,
                    wrapperCol: LocationRadiusFilterFormItemWrapperCol
                },
                fieldProps:{
                    unit: "km",
                    placeholder: _this.props.intl.formatMessage({id:"general.radius"}),
                },
                wrapperCol: LocationFilterWrapperCol
            }
        ]
    }

    return {...properties, ...props}
}

