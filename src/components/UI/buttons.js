import React from "react";
import Tag from "antd/es/tag";
import IntlMessages from "components/utility/intlMessages";

export function DisplayTag(props) {

    return <Tag color={props.color || "red"} key={props.key || ""}>
        <IntlMessages id={props.name || "unknown"}/>
    </Tag>
}

