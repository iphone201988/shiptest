const LocationFilterFormItemlabelCol = {
    xs: {span: 10},
    sm: {span: 8},
    md: {span: 6},
    lg: {span: 4},
}

const LocationFilterFormItemWrapperCol = {
    xs: {span: 14},
    sm: {span: 16},
    md: {span: 18},
    lg: {span: 20},
}

const LocationFilterWrapperCol = {
    xs: {span: 24},
    sm: {span: 18},
    md: {span: 12},
    lg: {span: 12},
}

const LocationRadiusFilterFormItemLabelCol = {
    xs: {span: 8},
    sm: {span: 6},
    md: {span: 4},
    lg: {span: 2},
}

const LocationRadiusFilterFormItemWrapperCol = {
    xs: {span: 16},
    sm: {span: 18},
    md: {span: 20},
    lg: {span: 22},
}

// properties methods

export const LocationFilterProps = (_this, props={}) => {

    const properties = {
        isGroup: true,
        elements:[
            {
                name: "location",
                type: "addressField",
                formItemProps:{
                    hasFeedback: true,
                    label : _this.props.intl.formatMessage({id:"general.address"}),
                    labelCol: LocationFilterFormItemlabelCol,
                    wrapperCol: LocationFilterFormItemWrapperCol
                },
                fieldProps:{
                    placeholder: _this.props.intl.formatMessage({id:"general.address"}),
                },
                wrapperCol: LocationFilterWrapperCol
            },
            {
                name: "locationRadius",
                type: "number",
                formItemProps:{
                    hasFeedback: false,
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

export const LocationFilterProps_ = (_this, props={}) => {

    const properties = {
        name: "Location",
        type: "addressField",
        hasFeedback: true,
        label : "general.address_origin",
        onChange: _this.onLocationChange,
        defaultValue: props.location || "",
        placeholder: "general.address_origin",
        span: 12
    }

    return {...properties, ...props}

}

export const LocationRadiusFilterProps = (_this, props={}) => {

    const properties = {
        name: "locationRadius",
        type: "number",
        label : "general.radius",
        onChange: _this.onLocationRadiusChange,
        defaultValue: props.locationRadius,
        unit: " km",
        span: 4
    }

    return {...properties, ...props}

}



