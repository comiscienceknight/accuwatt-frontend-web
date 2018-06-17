import React from 'react';
import { Row, message, Spin, Button,Switch } from 'antd';
import {Link} from 'react-router-dom';
import apiClient from '../../../apiClient';
import {Trans} from 'lingui-react';
import BatteryItem from './BatteryItem';
import BatteriesModalEdit from './BatteriesModalEdit';
import './Batteries.scss';
import BatteryModal from './BatteryModal';
import BatteriesInTable from './BatteriesInTable';
import {getUser} from '../../../utils/Authentication/userSessionStorage';

export class Batteries extends React.Component {
	state = {
		batteries: [],
		groupName: '', 
		loading: false,

		modalVisible: false,
		selectedBatteryId: '',
		selectedBatteryName: '',
		currentGroupId: '',

		newBatteryVisible: false,
		contentForm: true
	}

	fetchBatteries (groupId, groupName) {
		this.setState({loading: true, groupName: groupName});
		apiClient.fetch('/Batteries/GetBatteries/'+groupId, {
			method: 'GET',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => response.json())
			.catch((err) => {
				message.warn(`Error fetching api: ${err}`, true);
				this.setState({loading: false});
			})
			.then((body) => {
				this.setState({
					batteries:body
				});
				this.setState({loading: false});
			});
	}

	addNewBattery(_this){
		_this.setState({
			newBatteryVisible: true,
			modalVisible: false,
			selectedBatteryDevEUI: ''
		});
	}
	onBatteryAddedOrUpdated = ()=>{
		this.fetchBatteries(this.props.match.params.groupId, this.props.match.params.groupName);
		this.setState({
			newBatteryVisible: false
		});
	}

	componentDidMount() {
		if (this.props.match.params.groupId && this.props.match.params.groupId !== null) {
			this.fetchBatteries(this.props.match.params.groupId, this.props.match.params.groupName);
			this.setState({
				currentGroupId: this.props.match.params.groupId
			});
		}
	}

	onBatteryClick(batteryId, batteryName, batteryDevEUI){
		this.setState({
			modalVisible: true,
			newBatteryVisible: false,
			selectedBatteryId: batteryId,
			selectedBatteryName: batteryName,
			selectedBatteryDevEUI: batteryDevEUI
		});
	}
	onDeleteBattery(devEUI, _this){
		apiClient.fetch('Batteries/DeleteBattery/' + devEUI, {
			method: 'POST',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => {
			if(response.status == 200){
				_this.fetchBatteries(_this.props.match.params.groupId, _this.props.match.params.groupName);
			}
			else
				message.warn(`Error fetching api`, true);
		})
			.catch((err) => message.warn(`Error fetching api: ${err}`, true));
	}
	onEditBattery = (devEUI, batteryName)=>{
		this.setState({
			newBatteryVisible: true,
			modalVisible: false,
			selectedBatteryDevEUI: devEUI,
			selectedBatteryName: batteryName
		});
	}
	contentFormChange = (e) => {
		this.setState({
			contentForm: e,
			newBatteryVisible: false,
			modalVisible: false
		});
	}

	render() {
		let batteries = [];
		for(let i = 0;i<this.state.batteries.length;i++){
			let batteryId = this.state.batteries[i].id;
			let name = this.state.batteries[i].batteryName;
			let devEUI = this.state.batteries[i].devEUI;
			let stateOpenClose = this.state.batteries[i].stateOpenClose;
			batteries.push(
				(
					<BatteryItem key={batteryId} batteryName={name} batteryId={batteryId}
						batteryDevEUI={devEUI} stateOpenStop={stateOpenClose}
						deleteBattery={(devEUI)=>{this.onDeleteBattery(devEUI, this);}}
						editBattery={this.onEditBattery}
						onBatteryClick={(b, n, d)=> {this.onBatteryClick(b, n, d);}} />
				));
		}
		let batteriesInTable = <BatteriesInTable onBatteryClick={(b, n, d)=> {this.onBatteryClick(b, n, d);}}
			batteries={this.state.batteries}
			onEditBattery={this.onEditBattery}  />;
		let batteriesInGrid = <div style={{textAlign:'center', minHeight:'200px'}} >
			<Row gutter={8}>
				{batteries}
			</Row>
		</div>;
		let contentChild = this.state.contentForm ? batteriesInTable : batteriesInGrid;
		let content = (<Spin size="large" spinning={this.state.loading}
			style={{backgroundColor:'transparent'}}>
			{contentChild}
		</Spin>);

		
		let user = getUser();
		let addBatteryBtn = <div />;
		if(user.USER_DATA.role === 'ADMINISTRATEUR'){
			addBatteryBtn = (<Button onClick={()=>{this.addNewBattery(this);}} icon="plus-circle-o"
				style={{float:'right'}} type='primary'>
				<Trans>Ajouter une batterie</Trans>
			</Button>);
		}

		return (
			<div>
				<div style={{borderBottom:'gray 1px dashed'}}>
					<h1>
						<Trans></Trans> {this.state.groupName}
						<Switch checkedChildren="Liste" unCheckedChildren="Table" defaultChecked
							style={{float:'right', margin: 3}} 
							onChange={this.contentFormChange}/>
						{addBatteryBtn}
					</h1>
				</div>
				{content}
				<BatteryModal visible={this.state.modalVisible} selectedBatteryId={this.state.selectedBatteryId}
					selectedBatteryName={this.state.selectedBatteryName}
					selectedBatteryDevEUI={this.state.selectedBatteryDevEUI} />

				<BatteriesModalEdit visible={this.state.newBatteryVisible} groupId={this.state.currentGroupId}
					devEUI={this.state.selectedBatteryDevEUI}
					batteryName={this.state.selectedBatteryName}
					batteryAddedOrUpdated={this.onBatteryAddedOrUpdated} />
			</div>
		);
	}
}

export default Batteries;