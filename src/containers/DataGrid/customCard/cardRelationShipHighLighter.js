import React from "react";
import { FormattedMessage } from "react-intl";
import { CapitalizeEachWord } from 'helpers/data/string';

const CardRelationShipHighLighter = (props) => {
    let relationship_type = props.relationship_type;
    let spanClassNames = "ant-tag ant-tag-green";
    if (props.relationship_type == 'supplier' || props.relationship_type == 'pending') {
        spanClassNames = "ant-tag ant-tag-gold"
    } else if (props.relationship_type == 'customer' || props.relationship_type == 'pending') {
        spanClassNames = "ant-tag ant-tag-blue"
    } else if (props.relationship_type == 'waiting_confirmation') {
        spanClassNames = "ant-tag ant-tag-red";
        relationship_type = "Unknown"
    } else if (props.relationship_type == 'completed') {
        relationship_type = "Delivered"
        spanClassNames = "ant-tag ant-tag-green"
    } else {
        spanClassNames = "ant-tag ant-tag-green"
    }

    return (
        <>
            <div className="tripDetail" style={{ width: "20%", textAlign: "right" }}>
                <span className={spanClassNames} >
                    <FormattedMessage id={CapitalizeEachWord(relationship_type)} style={{ padding: "3px" }} />
                </span>

            </div>
        </>
    )
}

export default CardRelationShipHighLighter;