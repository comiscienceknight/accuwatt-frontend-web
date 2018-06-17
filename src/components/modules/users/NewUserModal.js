import React from 'react';
import { Row, message, Spin, Modal, Button, Form, Icon, Input, Checkbox, Alert, Radio   } from 'antd';
import {Trans} from 'lingui-react';
import objectAssign from 'object-assign';
import apiClient from '../../../apiClient';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export class NewUserModal extends React.Component {
	state = {
		loading: false,
		visible: false,
		newUserInfo: {
			userName: '',
			email: '',
			password: '',
			roleId: '4D1CCF6B-B7B4-4AF1-9D0A-E43EE98E3B31'
		},
		valueValidation: {
			email: '',
			password: '',
			userName: ''
		}
	}

	componentDidMount() {
	}

	componentWillReceiveProps(next){
		this.setState({
			visible: next.visible
		});
	}

	canSubmitUser = () => {
		let canSubmit = true;
		let valueValidation = objectAssign({}, this.state.valueValidation); 
		let newUserInfo = this.state.newUserInfo;
		if(!this.validateEmail(newUserInfo.email)){
			valueValidation.email = 'Email unvalide';
			canSubmit = false;
		}
		else{
			valueValidation.email = '';
		}
		if(newUserInfo.password.length < 4){
			valueValidation.password = 'Minimum 4 charactère';
			canSubmit = false;
		}
		else{
			valueValidation.password = '';
		}
		if(newUserInfo.userName.length < 1){
			valueValidation.userName = 'Veuillez remplir ce champs';
			canSubmit = false;
		}
		else{
			valueValidation.userName = '';
		}
		this.setState({
			valueValidation: valueValidation
		});
		return canSubmit;
	}
	submitUser = (e) => {
		if(this.canSubmitUser() === false)
			return;
		let _this = this;
		apiClient.fetch('/Users/NewUser', {
			method: 'POST',
			headers: new Headers({'Content-Type': 'application/json'}),
			body: JSON.stringify(this.state.newUserInfo)
		}).then(response => response.json())
			.catch((err) => message.warn(`Error fetching api: ${err}`, true))
			.then((body) => {
				if(body.succeeded === true){
					this.setState({
						visible: false
					});
					_this.props.refreshUsersTable();
				}
				else{
					if(body.errors !== undefined && body.errors.length > 0){
						if(body.errors[0].code && body.errors[0].code === 'DuplicateUserName')
							message.error('Nom d\'utilisateur existe déjà');
						else
							message.error(JSON.stringify(body));
					}
				}
			});
	}

	handleCancel = (e) => {
		this.setState({
			visible: false,
		});
	}

	onValueChange = (c) => {
		let newUserInfo = objectAssign({}, this.state.newUserInfo); 
		newUserInfo[c.target.name] = c.target.value;
		this.setState({
			newUserInfo: newUserInfo
		});
	}


	validateEmail = (email) => {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email.toLowerCase());
	}

	render() {
		const { visible, loading, valueValidation } = this.state;
		return (
			<Modal visible={visible}
				title="Nouvel utilisateur"
				onOk={this.handleOk}
          		onCancel={this.handleCancel}
				footer={[
					<Button key="back" onClick={this.handleCancel}>Return</Button>,
					<Button key="submit" type="primary" loading={loading} onClick={this.submitUser}>
						Submit
					</Button>
				]}>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<FormItem>
						<Input name='userName' id='userName' onChange={this.onValueChange}
							prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
							placeholder="Nom d'utilisateur" />
						<span id='email-validation' style={{color:'red', margin:0}}>
							{valueValidation.userName}
						</span>
					</FormItem>
					<FormItem>
						<Input  name='email' id='email' onChange={this.onValueChange}
							prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} 
							placeholder="Email" />
						<span id='email-validation' style={{color:'red', margin:0}}>
							{valueValidation.email}
						</span>
					</FormItem>
					<FormItem>
						<Input name='password' id='password' onChange={this.onValueChange}
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
							type="password" placeholder="Password" />
						<span id='password-validation' style={{color:'Red', margin:0}}>
							{valueValidation.password}
						</span>
					</FormItem>
					<RadioGroup name='roleId' id='roleId' onChange={this.onValueChange}
						defaultValue='4D1CCF6B-B7B4-4AF1-9D0A-E43EE98E3B31'>
						<Radio name='roleId' value='0CA1FD93-E1A8-4F62-9197-B932735BEDF9'>
							<Trans>Administrateur</Trans>
						</Radio>
						<Radio name='roleId' value='4D1CCF6B-B7B4-4AF1-9D0A-E43EE98E3B31'>
							<Trans>Visiteur</Trans>
						</Radio>
					</RadioGroup>
				</Form>
			</Modal>
		);
	}
}

export default NewUserModal;