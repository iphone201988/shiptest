import React, { Component } from 'react'
import Form from 'components/uielements/form';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import IntlMessages from "components/utility/intlMessages";
import Card from "containers/Uielements/Card/card.style";
import Input from "../uielements/input"
import Button from "../uielements/button"
import { firebaseConnect, isLoaded } from 'react-redux-firebase'
import {Link, Redirect} from "react-router-dom";
import {get_route_path} from "constants/routes";
import SignInStyleWrapper from "./Signin.style";

const FormItem = Form.Item;

const INITIAL_STATE = {
	UserEmail:'',
	UserPassword:'',
	domain:'', // carrier , shipper
	error: null,
	isLoggedIn: false,
	checking: false,
};


class Login extends Component {
	static propTypes = {
		auth: PropTypes.object,
		firebase: PropTypes.shape({
			login: PropTypes.func.isRequired,
			logout: PropTypes.func.isRequired,
		}),
	}

	componentDidMount() {

		this.setState({domain: this.props.domain})

		this.props.firebase.auth().onIdTokenChanged((user) => {
			let isLogged = false
			let domain = this.state.domain
			if (user) {
				user.getIdTokenResult().then(IdTokenResult=>  {
					let claims = IdTokenResult.claims;
					if (claims.domain){
						isLogged = true
						domain = claims.domain
					}else{
						this.props.firebase.logout()
					}
					this.setState({ isLoggedIn: isLogged, domain: domain});
				})
			}else{
				this.setState({ isLoggedIn: isLogged, domain: domain});
			}

		});

	}

	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onFinish = (values) =>{
		const {
			UserEmail,
			UserPassword,
		} = this.state;

		this.props.firebase.login({email: UserEmail, password: UserPassword})
		this.setState({checking: true})

	};

	render() {

		const {
			UserEmail,
			UserPassword,
			isLoggedIn,
			domain
		} = this.state;


		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
			},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 14,
					offset: 6,
				},
			},
		};

		if (!isLoaded(this.props.auth)) {
			return null
		}else{
			if (!isLoggedIn) {
				return (
					<SignInStyleWrapper className="isoSignInPage">
						<div className="isoSignInContentWrapper">
							<div className="isoSignInContent">
								<div className="isoLogoWrapper">
									<Link to="/">
										{domain === "carrier" ?
											<IntlMessages id="carrier.signin.title"/>
										: ""}
										{domain === "shipping" ?
											<IntlMessages id="shipping.signin.title"/>
											: ""}
										{domain === "admin" ?
											<IntlMessages id="admin.signin.title"/>
											: ""}
									</Link>
								</div>

								<Form className="isoSignInForm" onFinish={this.onFinish}>
									<Card
										bordered={true}
										style={{ width: '100%' }}
									>
										<div className="isoInputWrapper">
											<FormItem {...formItemLayout}
													name={'UserEmail'}
													  label={this.context.intl.formatMessage({id: 'general.email'})}
													  rules={[
														  {
															  required: true,
															  message: this.context.intl.formatMessage({id: 'general.validation.enter_valid_email'}),
														  },
													  ] }
											>

													<Input size="large"
																 type="email"
																 value={UserEmail}
																 onChange={event => this.setState({'UserEmail': event.target.value})}
													/>

											</FormItem>
										</div>


										<FormItem {...formItemLayout}
												  name={'UserPassword'}
												  label={this.context.intl.formatMessage({id: 'general.password'})}
												  rules={[
													  {
														  required: true,
														  message: this.context.intl.formatMessage({id: 'general.validation.enter_password'}),
													  },

												  ]}
												  hasFeedback>
												<div className="isoInputWrapper">
													<Input size="large"
																 type="password"
																 value={UserPassword}
																 onChange={event => this.setState({'UserPassword': event.target.value})}
																 placeholder={this.context.intl.formatMessage({id: 'general.password'})}
													/>
												</div>
										</FormItem>
									</Card>
									<hr/>

									<FormItem {...tailFormItemLayout}>
										<Button type="primary" htmlType="submit">
											<IntlMessages id="page.signInButton" />
										</Button>
									</FormItem>

									<div className="isoInputWrapper isoCenterComponent isoHelperWrapper">
										{domain === "carrier" ?
										<Link to={get_route_path("web", "carrierSignup")}>
											<IntlMessages id="carrier.signup.link_text" />
										</Link>: ""
										}
										{domain === "carrier" ?
										<Link to={get_route_path("web", "carrierForgotPassword")}>
											<IntlMessages id="carrier.forgot.password.link_text" />
										</Link>: ""
										}
										{domain === "shipping" ?
											<Link to={get_route_path("web", "shipperSignup")}>
												<IntlMessages id="shipping.signup.link_text" />
											</Link>: ""
										}
										{domain === "shipping" ?
											<Link to={get_route_path("web", "shipperForgotPassword")}>
												<IntlMessages id="shipper.forgot.password.link_text" />
											</Link>: ""
										}
										{domain === "admin" ?
											<Link to={get_route_path("web", "adminSignup")}>
												<IntlMessages id="admin.signup.link_text" />
											</Link>: ""
										}
										{domain === "admin" ?
											<Link to={get_route_path("web", "adminForgotPassword")}>
												<IntlMessages id="admin.forgot.password.link_text" />
											</Link>: ""
										}

									</div>
								</Form>
							</div>
						</div>
					</SignInStyleWrapper>
				)
			}
			else{
				return (<Redirect to={get_route_path(domain, "app")} />)
			}
		}
	}
}

const mapStateToProps = state => {
	return { auth: state.FB.firebase.auth }
}

const mapDispatchToProps = dispatch => {
	return {
		clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA' })
	}
}

Login.contextTypes = {
	intl: PropTypes.object.isRequired,
};


export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	firebaseConnect()
)(Login)