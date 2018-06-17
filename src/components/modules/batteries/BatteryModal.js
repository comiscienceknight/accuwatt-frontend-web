import React from 'react';
import { Modal, Button, Row, Col, Table, Tabs, Icon, Input, message, Spin } from 'antd';
import './Batteries.scss';
import BatteryModalPrinciple from './BatteryModalPrinciple';
import BatteryModalControl from './BatteryModalControl';
import BatteryModalHistory from './BatteryModalHistory';
import apiClient from '../../../apiClient';
const TabPane = Tabs.TabPane;


export class BatteryModal extends React.Component {
	state = {
		batteryId: '',
		batteryName: '', 
		loading: false,
		visible: false,
		batteryState: {}
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	}
	hideModal = () => {
		this.setState({
			visible: false,
		});
	}

	fetchBatteryState (batteryDevEUI) {
		this.setState({loading: true});
		apiClient.fetch('/Batteries/GetBatteryUplink/'+batteryDevEUI, {
			method: 'GET',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => response.json())
			.catch((err) => {
				message.warn(`Error fetching api: ${err}`, true);
				this.setState({loading: false});
			})
			.then((body) => {
				this.setState({
					batteryState:body
				});
				this.setState({loading: false});
			});
	}

	fetchBatteryHistory (batteryDevEUI) {
		this.setState({loading: true});
		apiClient.fetch('/Batteries/GetUplinkHisotryAsync/'+batteryDevEUI + '/0/10', {
			method: 'GET',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => response.json())
			.catch((err) => {
				message.warn(`Error fetching api: ${err}`, true);
				this.setState({loading: false});
			})
			.then((body) => {
				this.setState({
					batteryState:body
				});
				this.setState({loading: false});
			});
	}

	componentDidMount() {
	}

	componentWillReceiveProps(next){
		this.setState({
			batteryId: next.selectedBatteryId,
			batteryName: next.selectedBatteryName,
			batteryDevEUI: next.selectedBatteryDevEUI,
			visible: next.visible
		});
		if(next.selectedBatteryDevEUI !== undefined && next.selectedBatteryDevEUI !== '')
			this.fetchBatteryState(next.selectedBatteryDevEUI);
	}

	render() {
		let startStopBtn = <Button type='primary' style={{width:'95%'}}>Allumer</Button>;
		if(this.state.batteryState.stateOpenClose === 1)
			startStopBtn = <Button type='danger' style={{width:'95%'}}>Arrêter</Button>;
		return (
			<Modal title={this.state.batteryName}
				bodyStyle={{paddingTop:5}}   
				width='380px'
				onCancel={this.hideModal}
				visible={this.state.visible}
				footer={[
					<Button key="back" onClick={this.hideModal}>Retourne</Button>
				]}>
				<Spin size="large" spinning={this.state.loading}
					style={{backgroundColor:'transparent'}}>
					<Tabs defaultActiveKey="1">				
						<TabPane tab={<span><Icon type="info-circle-o" />Info</span>} key="1">
							<BatteryModalPrinciple batteryState={this.state.batteryState} />
						</TabPane>
						<TabPane tab={<span><Icon type="edit" />Contrôle</span>} key="2">
							<div>
								<Row>
									<Col span={7}>
										{startStopBtn}
									</Col>
									<Col span={12} style={{fontWeight:500}}>
										<Input placeholder="Code" />
									</Col>
								</Row>
								<BatteryModalControl batteryState={this.state.batteryState} />
							</div>
						</TabPane>
						<TabPane tab={<span><Icon type="edit" />Historique</span>} key="3">
							<BatteryModalHistory selectedBatteryId={this.state.batteryId}
								selectedBatteryDevEUI={this.state.batteryDevEUI} />
						</TabPane>
					</Tabs>
				</Spin>
			
			</Modal>
		);
	}
}

export default BatteryModal;