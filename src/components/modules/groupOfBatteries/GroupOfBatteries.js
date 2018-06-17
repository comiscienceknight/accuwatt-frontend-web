import React from 'react';
import { Row, message, Spin, Button  } from 'antd';
import apiClient from '../../../apiClient';
import BatteryGroupItem from './BatteryGroupItem';
import GroupOfBatteriesModalEdit from './GroupOfBatteriesModalEdit';
import {Trans} from 'lingui-react';
import {getUser} from '../../../utils/Authentication/userSessionStorage';

export class GroupOfBatteries extends React.Component {
	state = {
		loading: false,
		batteryGroups: [],
		selectedGroupId: -1,
		selectedGroupName: ''
	}

	componentDidMount() {
		this.fetchBatteryGroups();
	}


	fetchBatteryGroups () {
		this.setState({loading: true});
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
					batteryGroups:body
				});
				this.setState({loading: false});
			});
	}

	addNewGroup = ()=>{
		this.setState({
			modalVisible: true,
			selectedGroupName: '',
			selectedGroupId: -1
		});
	}

	onGroupAddedOrUpdated=()=>{
		this.setState({
			modalVisible: false,
			selectedGroupName: '',
			selectedGroupId: -1
		});
		this.fetchBatteryGroups();
	}

	onGroupDelete = (groupId)=>{
		apiClient.fetch('Batteries/DeleteBatteryGroup/'+groupId, {
			method: 'POST',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => response.json())
			.catch((err) => {
				message.warn(`Error fetching api: ${err}`, true);
				this.setState({loading: false});
			})
			.then((body) => {
				if(body.message != 'OK')
					message.warn(body.message);
				else
					this.fetchBatteryGroups();
			});
	}

	onGroupEdit = (groupId, groupName)=>{
		this.setState({
			modalVisible: true,
			selectedGroupName: groupName,
			selectedGroupId: groupId
		});	
	}

	render() {
		let groups = [];
		let batteryGroups = this.state.batteryGroups;
		
		let addBatteryBtn = (<Button onClick={this.addNewGroup} icon="plus-circle-o"
			style={{float:'right'}} type='primary'>
			<Trans>Ajouter un groupe</Trans>
		</Button>);
		let user = getUser();
		if(user.USER_DATA.role === 'VISITEUR')
			addBatteryBtn = <div />;

		for(let i = 0;i<batteryGroups.length;i++){
			let groupName = batteryGroups[i].groupName.trim();
			let groupId = batteryGroups[i].id;
			let numberOfBattery = batteryGroups[i].numberOfBattery;
			groups.push(
				(
					<BatteryGroupItem key={groupId} groupId={groupId} groupName={groupName}
						onEdit={this.onGroupEdit}
						numberOfBattery={numberOfBattery} onDelete={this.onGroupDelete} />
				));
		}
		return (
			<div>
				<Spin size="large" spinning={this.state.loading}>
					<div style={{textAlign:'center', minHeight:'200px'}} >		
						<div style={{borderBottom:'gray 1px dashed'}}>
							<h1 style={{textAlign:'left'}}>
								<Trans>Groupes</Trans>
								{addBatteryBtn}
							</h1>
						</div>
						<Row gutter={8}>
							{groups}
						</Row>
					</div>
				</Spin>
				
				<GroupOfBatteriesModalEdit 
					visible={this.state.modalVisible} groupId={this.state.selectedGroupId}
					groupName={this.state.selectedGroupName} 
					groupAddedOrUpdated={this.onGroupAddedOrUpdated} />
			</div>
		);
	}
}

export default GroupOfBatteries;