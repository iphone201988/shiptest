import React, {PureComponent} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {PropTypes} from "prop-types";

class Template extends PureComponent {

    INITIAL_STATE = {
    }

    static propTypes = {
        domain: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {...this.INITIAL_STATE};
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
    }

    render() {
        return ""
    }
}

Template.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
    return {
        domain: state.FB.company.domain,
    };
};

export default compose(
  connect(mapStateToProps, {}),
)(injectIntl(Template));