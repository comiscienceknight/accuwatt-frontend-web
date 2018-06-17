import React from 'react';
import {connect} from 'react-redux';
import {login} from '../utils/Authentication/actions';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import {Trans, withI18n} from 'lingui-react';
import LanguageSelect from './LanguageSelect';
import logo from '../images/accuwatt-logo.png';
import './LoginPage.scss';

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.loginOnClick = this.loginOnClick.bind(this);
		this.signUpOnClick = this.signUpOnClick.bind(this);
	}

	loginOnClick(ev) {
		if (this.usernameField.refs.input.value && this.passwordField.refs.input.value) {
			ev.preventDefault();
			this.props.login({
				userName: this.usernameField.refs.input.value,
				password: this.passwordField.refs.input.value
			});
		}
	}

	signUpOnClick(ev) {
		ev.preventDefault();
	}

	render() {
		const EmailInputWithI18n = withI18n()(
			({ i18n }) => <Input
				//className="email"
				type="text" required size="large"
				ref={(username) => this.usernameField = username}
				placeholder={i18n.t`Entrer votre nom d'utilisateur`}/>
		);
		const PasswordInputWithI18n = withI18n()(
			({ i18n }) => <Input
				className="password"
				type="password" required size="large"
				ref={(password) => this.passwordField = password}
				placeholder={i18n.t`Entrer votre mot de passe`}/>
		);
		return (
			<div className="login-page">
				<Card className="login-inner" title={<Trans>Log in</Trans>} bordered={false} style={{ width: 300 }}>
					<img className="logo" src={logo} alt="tuding-logo"/>
					<form className="login-form">
						<EmailInputWithI18n />
						<PasswordInputWithI18n />
						<div className="actions">
							<Button size="large" type="primary" onClick={(ev) => this.loginOnClick(ev)}><Trans>Log in</Trans></Button>
							<Button size="large" onClick={(ev) => this.signUpOnClick(ev)}><Trans>Sign up</Trans></Button>
						</div>
					</form>
					<LanguageSelect className="select-language" />
				</Card>
			</div>
		);
	}

}

export default connect(null, {login})(LoginPage);

// login :          bo.hu@clermontech.com
// password :       @nlc0ccmb