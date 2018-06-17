import React from 'react';
import { Button, message, Spin, Modal, Row, Col, Input, Select } from 'antd';
import apiClient from '../../../apiClient';

export class GroupOfBatteriesModalEdit extends React.Component {
	state = {
		loading: false,
		visible: false,
		groupName: '',
		groupId: -1
	}

	componentDidMount() {
	}

	componentWillReceiveProps(next){
		this.setState({
			visible: next.visible,
			groupId: next.groupId,
			groupName: next.groupName
		});
	}

	handleCancel = ()=>{
		this.setState({
			visible: false,
			batteryGroups: [],
			groupName: '',
			groupId: -1
		});
	}

	handleOk = ()=>{
		apiClient.fetch('Batteries/NewBatteryGroup', {
			method: 'POST',
			headers: new Headers({'Content-Type': 'application/json'}),
			body: JSON.stringify({
				groupId: this.state.groupId,
				groupName: this.state.groupName
			})
		}).then(response => {
			if(response.status == 200){
				this.setState({
					groupId:-1,
					groupName: ''
				});
				this.props.groupAddedOrUpdated();
			}
			else
				message.warn('Error fetching api', true);
		})
			.catch((err) => message.warn(`Error fetching api: ${err}`, true));
	}

	groupNameChange = (e, p) => {
		this.setState({
			groupName: e.target.value
		});
	}
	render() {
		let title = (this.state.groupId !== undefined && this.state.groupId > 0) ? 'Modifier le nom du groupe' : 'Ajouter un nouveax group';
		return (	
			<Modal
				visible={this.state.visible}
				title={title}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				footer={[
					<Button key="back" onClick={this.handleCancel}>Annuler</Button>,
					<Button key="submit" type="primary"  onClick={this.handleOk}>
						Valider
					</Button>
				]} >
				<Row gutter={16}>
					<Col span={24}>
						<p>{this.props.groupName}</p>
						<Input placeholder="Nom de group" onChange={this.groupNameChange} value={this.state.groupName} />
					</Col>
				</Row>
			</Modal>
		);
	}
}

export default GroupOfBatteriesModalEdit;