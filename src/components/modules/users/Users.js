import React from 'react';
import { Row, message, Spin, Table, Button ,Popconfirm } from 'antd';
import {Trans} from 'lingui-react';
import NewUserModal from './NewUserModal';
import apiClient from '../../../apiClient';

export class Users extends React.Component {
	state = {
		loading: false,
		modalVisible: false,
		users: []
	}

	componentDidMount() {
		this.fetchUsers();
	}

	fetchUsers(){
		this.setState({loading: true, modalVisible: false});
		let _this = this;
		apiClient.fetch('/Users/GetUsers', {
			method: 'GET',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => response.json())
			.catch((err) => {
				message.warn(`Error fetching api: ${err}`, true);
				_this.setState({loading: false});
			})
			.then((body) => {
				_this.setState({
					users:body,
					loading: false
				});
			});
	}

	refreshUsersTable = () => {
		this.fetchUsers();
		this.setState({
			modalVisible: false
		});
	}

	openNewUserModal = (e) => {
		this.setState({
			modalVisible: true
		});
	}

	deleteUser = (e) => {
		this.setState({loading: true});
		let _this = this;
		apiClient.fetch('/Users/DeleteUser/' + e.userId, {
			method: 'GET',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => response.json())
			.catch((err) => {
				message.warn(`Error fetching api: ${err}`, true);
				_this.setState({loading: false});
			})
			.then((body) => {
				if(body === true){
					_this.fetchUsers();
				}
				else{
					message.error('Supprimer en echec!');
					_this.setState({
						users:body,
						loading: false
					});
				}
			});
		//alert(JSON.stringify(e));
	}

	render() {
		const columns = [
			{
				title: 'Nom d\'utilisateur',
				dataIndex: 'userName',
				key: 'userName'
			}, 
			{
				title: 'Email utilisateur',
				dataIndex: 'email',
				key: 'email'
			}, 
			{
				title: 'Rôle',
				dataIndex: 'role',
				key: 'role',
			}, 
			{
				title: 'Action',
				key: 'action',
				render: (text, record) => (
					<span>
						<Popconfirm title="Sure de supprimer cet utilisateur?" 
							onConfirm={()=>{this.deleteUser(record);}} okText="Oui" cancelText="non">
							<a href="#">Delete</a>
						</Popconfirm>
					</span>
				)
			}
		];
		return (
			<div>
				<Spin size="large" spinning={this.state.loading}>
					<div style={{minHeight:'200px'}} >
						<div style={{ marginBottom: 6 }}>
							<Button type="primary" onClick={this.openNewUserModal}>
								<Trans>Ajout d'un utilisateur</Trans>
							</Button>
						</div>
						<Table columns={columns} dataSource={this.state.users} />
						<NewUserModal visible={this.state.modalVisible}
							refreshUsersTable={this.refreshUsersTable} />
					</div>
				</Spin>
			</div>
		);
	}
}

export default Users;