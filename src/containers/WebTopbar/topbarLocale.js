import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from 'components/uielements/popover';
import IntlMessages from 'components/utility/intlMessages';
import authAction from 'helpers/redux/auth/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';
import {get_route_path} from "constants/routes";
import {locale_map} from "constants/language"

const { logout } = authAction;

class TopbarLocale extends Component {
  constructor(props) {
    super(props);
    const { locale, url , pathname} = this.props;
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false,
      locale: locale || "en_ca",
      pathname: pathname || `/${locale}`,
      url: url
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }

  locale_link = (pathname, locale) => {
    return (
        <a className="isoDropdownLink" href={get_route_path("web", "app", locale)}>
          <IntlMessages id={locale_map[locale].intl_key }/>
        </a>
    )
  }

  render() {
    const locale_list = Object.keys(locale_map)
    const {pathname} = this.state
    const current_locale =  this.state.locale
    let language_key = locale_map[current_locale].intl_key || locale_map['en_ca'].intl_key

    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        {locale_list.map(locale => {return locale !== current_locale  ? this.locale_link(pathname, locale): ""})}

      </TopbarDropdownWrapper>
    );

    return (
      <Popover
        content={content}
        trigger="hover"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <div className="title">
          <IntlMessages id={language_key}/>
        </div>
      </Popover>
    );
  }
}
export default connect(null, { logout })(TopbarLocale);
