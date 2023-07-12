import React, {PureComponent} from "react";
import Collapse from "antd/es/collapse";
import FormBox from "containers/base/form_box";

export default class FilterBox extends PureComponent {

    render() {

        return <Collapse onChange={this.props.onCollapse} defaultActiveKey={this.props.defaultOpen ? "1": "0"} bordered={false} style={{width:"100%"}}>
            <Collapse.Panel header={this.props.title} key={1} forceRender={true}>
                <FormBox
                    {... this.props}
                    enabledLoading={false}
                />
            </Collapse.Panel>
        </Collapse>
    }
}