import React from 'react';
import { Table, message, Spin } from 'antd';
import apiClient from '../../../apiClient';
// import {withRouter} from 'react-router-dom';


const columns = [
	{
		title: 'Etat',
		dataIndex: 'stateOpenClose',
		render: (text, record) => {
			const { stateOpenClose } = record;
			let displayText = (stateOpenClose === 0 ? 'arrete': 'marche');
			return (<div>{displayText}</div>);
		},
	}, 
	{
		title: 'Date Time',
		dataIndex: 'timeStamp',
	}
];


export class BatteryModalHistory extends React.Component {
	state = {
		devEUI: '',
		loading: false,
		visible: false,
		batteryHistory: [],
		pagination: {
			pageSize: 5,
			current: 0,
			showTotal: (total) => <div>
				Total: {total}
			</div>
		},
	}

	getOrders = (postBody = {}) => {
		debugger
		this.setState({loading: true});
		apiClient.fetch('Batteries/GetBatteryUplinkHistory/'+ postBody.devEUI + '/' + postBody.pageNumber + '/' + postBody.pageSize, {
			method: 'GET',
			headers: new Headers({'Content-Type': 'application/json'})
		}).then(response => response.json())
			.catch((err) => {
				this.setState({
					loading: false
				});
				message.warn(`Error fetching api: ${err}`, true)
			})
			.then((body) => {
				const pagination = {...this.state.pagination};
				pagination.total = body.totalCount;
		
				this.setState({
					batteryHistory: body.items,
					loading: false,
					pagination,
				});
			});
	}

	fetch = (devEUI) => {
		debugger
		const {pagination} = this.state;
		let pageNumber = pagination.current;
		// if(pageNumber === 0)
		// 	pageNumber = 1;
		this.getOrders({
			pageSize: pagination.pageSize,
			pageNumber: pageNumber,
			devEUI: devEUI
		});
	}

	
	handleTableChange = (pagination) => {
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;
		pager.pageSize = pagination.pageSize;
		this.setState({
			pagination: pager
		}, () => this.fetch(this.props.selectedBatteryDevEUI));
	}

	componentDidMount() {
		this.fetch(this.props.selectedBatteryDevEUI);
	}

	componentWillReceiveProps(next){
		this.setState({
			devEUI: next.selectedBatteryDevEUI
		});
		if(next.selectedBatteryDevEUI !== undefined && next.selectedBatteryDevEUI !== '')
			this.fetch(next.selectedBatteryDevEUI);
	}

	render() {
		return (
			<Spin size="large" spinning={this.state.loading}
				style={{backgroundColor:'transparent'}}>
				<Table columns={columns} dataSource={this.state.batteryHistory} size="small"
					pagination={this.state.pagination}
					onChange={this.handleTableChange}  />
			</Spin>
		);
	}
}

export default BatteryModalHistory;