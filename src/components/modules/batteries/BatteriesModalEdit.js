import React from 'react';
import { Button, message, Spin, Modal, Row, Col, Input, Select } from 'antd';
import apiClient from '../../../apiClient';

export class BatteriesModalEdit extends React.Component {
	state = {
		loading: false,
		visible: false,
		batteryGroups: [],
		devEUI:'',
		batteryName: ''
	}

	componentDidMount() {
	}

	componentWillReceiveProps(next){
		this.setState({
			visible: next.visible,
			devEUI: next.devEUI,
			selectGroupId: next.groupId,
			batteryName: next.batteryName
		}, () => {
            this.getBatteryGroups();
        });
	}

	handleCancel = ()=>{
		this.setState({
			visible: false,
			batteryGroups: [],
			devEUI:'',
			batteryName: ''
		});
	}

	handleOk = ()=>{
		apiClient.fetch('Batteries/AddBattery', {
			method: 'POST',
			headers: new Headers({'Content-Type': 'application/json'}),
			body: JSON.stringify({
				devEUI: this.state.devEUI,
				groupId: this.state.selectGroupId,
				batteryName: this.state.batteryName
			})
		}).then(response => {
				if(response.status == 200){
					this.setState({
						batteryGroups: [],
						devEUI:'',
						batteryName: ''
					});
					this.props.batteryAddedOrUpdated();
				}
				else
					message.warn(`Error fetching api`, true);
			})
			.catch((err) => message.warn(`Error fetching api: ${err}`, true));
	}

	getBatteryGroups = ()=>{
		apiClient.fetch('Batteries/GetBatteryGroups', {
			method: 'GET',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => response.json())
			.catch((err) => {
				message.warn(`Error fetching api: ${err}`, true);
				this.setState({loading: false});
			})
			.then((body) => {
				this.setState({
					batteryGroups:body,
					groupId: this.state.groupId
				});
				this.setState({loading: false});
			});
	}

	devEUIInputChange = (e, p) => {
		this.setState({
			devEUI: e.target.value
		});
	}
	nameInputChange = (e, p) => {
		this.setState({
			batteryName: e.target.value
		});
	}
	gourpSelectChange = (e) => {
		this.setState({
			selectGroupId: e
		});
	}
	render() {
		const Option = Select.Option;
		let options = this.state.batteryGroups.map(function (group) {
			return <Option key={group.id}>{group.groupName}</Option>;
		});
		let selectGroupId = (this.state.selectGroupId === undefined ? '':this.state.selectGroupId);
		let selector = <div />
		if(this.state.batteryGroups !== undefined && this.state.batteryGroups.length > 0)
			selector = (
				<Select style={{width:'100%'}} defaultValue={selectGroupId} onChange={this.gourpSelectChange}> 
					{options}
				</Select>
			);
		let title = (this.state.devEUI !== undefined && this.state.devEUI.length > 0) ? 'Modifier une batterie' : 'Ajouter une nouvelle batterie';
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
					<Col span={12}>
						<p>Dev EUI</p>
						<Input placeholder="Dev EUI" onChange={this.devEUIInputChange} value={this.state.devEUI} />
					</Col>
					<Col span={12}>
						<p>Nom de la batterie</p>
						<Input placeholder="Nom de la batterie" onChange={this.nameInputChange} value={this.state.batteryName} />
					</Col>
					<Col span={12}>
						<p>Group par Groupe</p>
						{selector}
					</Col>
				</Row>
			</Modal>
		);
	}
}

export default BatteriesModalEdit;