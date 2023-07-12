import React, { Component } from 'react';
import LoginForm from "components/Authentication/LoginForm";

export default class extends Component {
	render(){
		return (<LoginForm domain={"admin"}/>)
	}
}

