import React, {lazy} from "react";
import {injectIntl, intlShape} from "react-intl";
import {renderDetailsView} from "components/render/details_views";
const Drawer = lazy(() => import("antd/es/drawer"));

export class ItemDetailsView extends React.PureComponent {
    state = { visible: false };

    defaultVewType = "drawer"
    defaultWidth = "100%"

    INITIAL_STATE = {
        visible: false,
        item: undefined,
        itemType: undefined,
        itemTabKey: "1",
        itemView: {},
        viewType: this.defaultVewType,
        viewWidth: this.defaultWidth,
    }

    constructor(props){
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        const {visible, item, itemDetailsView, itemType, itemTabKey} =  this.props;

        if (visible === true || item || itemDetailsView || itemType || itemTabKey) {
        this.setState({ visible: visible, item:item, itemType:itemType, itemTabKey: itemTabKey});
        }
    }

    componentDidUpdate(prevProps) {
        const {visible, item, itemType, itemTabKey } =  this.props;
        const viewType = this.props.viewType || this.defaultVewType
        const viewWidth = this.props.viewWidth || this.defaultWidth

        if (prevProps.visible !== visible || prevProps.item !== item || prevProps.itemType !== itemType || prevProps.itemTabKey !== itemTabKey) {
            this.setState({visible: this.props.visible, item:item,
                itemType:itemType, viewType:viewType, viewWidth: viewWidth, itemTabKey: itemTabKey})
        }
    }

    onClose = () => {
        this.setState({
            visible: false,
        });
        if (this.props.onClose){
            this.props.onClose()
        }
    };

    renderItemView = () => {

        const {item, itemType, itemTabKey} = this.state;
        return renderDetailsView(itemType, item, this.onClose, itemTabKey)
    }

    renderView = () => {
        const {viewType, visible } = this.state;

        const itemView = visible ? this.renderItemView() : ""
      
        if (viewType === "drawer"){
            return <Drawer
                width="80%"
                placement="right"
                closable={true}
                onClose={this.onClose}
                visible={visible}
                defaultActiveKey={"2"}
            >{itemView}</Drawer>
        }else{
            return ""
        }
    }

    render() {

        const {visible} = this.state;

        return (

            <Drawer
                width="80%"
                placement="right"
                closable={true}
                onClose={this.onClose}
                visible={visible}
            >
                {this.renderView()}
            </Drawer>
        );
    }
}


ItemDetailsView.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(ItemDetailsView);

